import type { RawData } from "ws";
import { WebSocket } from "ws";
import { ShapeType, OpSchema, OPS_NAMES } from "@repo/validation";
import {
  getRoomBySlug,
  createRoomBySlug,
  getCanvasShapes,
  saveCanvasState,
} from "@repo/db";
import { subscribe, unsubscribe, QUEUE_NAMES } from "@repo/pubsub";

const ROOM_PREFIX = QUEUE_NAMES.ROOM;

export class CanvasRoomServer {
  private readonly peersByRoom = new Map<string, Set<WebSocket>>();
  private readonly socketRoomId = new Map<WebSocket, string>();
  private readonly shapesByRoom = new Map<string, ShapeType[]>();
  private readonly dbIdByRoomSlug = new Map<string, number>();

  readonly onRedisMessage = (message: string, channel: string) => {
    if (!channel.startsWith(ROOM_PREFIX)) {
      return;
    }
    const roomId = channel.slice(ROOM_PREFIX.length);
    const peers = this.peersByRoom.get(roomId);
    if (!peers?.size) {
      return;
    }
    for (const client of peers) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  };

  detach(ws: WebSocket): void {
    const roomId = this.socketRoomId.get(ws);
    if (roomId === undefined) {
      return;
    }
    this.socketRoomId.delete(ws);
    const peers = this.peersByRoom.get(roomId);
    if (!peers) {
      return;
    }
    peers.delete(ws);
    if (peers.size === 0) {
      this.peersByRoom.delete(roomId);
      void unsubscribe(ROOM_PREFIX + roomId);
    }
  }

  async handleMessage(ws: WebSocket, data: RawData): Promise<void> {
    const raw = typeof data === "string" ? data : data.toString();
    console.log("received: %s", raw);
    const msg = JSON.parse(raw) as { kind?: string };

    if (msg.kind === "join") {
      await this.handleJoin(ws, String((msg as { roomId?: unknown }).roomId));
      return;
    }
    if (msg.kind === "op") {
      await this.handleOp(ws, msg);
    }
  }

  private async handleJoin(ws: WebSocket, roomId: string): Promise<void> {
    let room = await getRoomBySlug(roomId);
    if (!room) {
      room = await createRoomBySlug(roomId);
    }
    this.dbIdByRoomSlug.set(roomId, room.id);
    if (!this.shapesByRoom.has(roomId)) {
      this.shapesByRoom.set(roomId, await getCanvasShapes(roomId));
    }

    this.detach(ws);

    const peers = this.peersByRoom.get(roomId) ?? new Set<WebSocket>();
    peers.add(ws);
    if (peers.size === 1) {
      void subscribe(ROOM_PREFIX + roomId, this.onRedisMessage);
    }
    this.peersByRoom.set(roomId, peers);
    this.socketRoomId.set(ws, roomId);

    const shapes = this.shapesByRoom.get(roomId) || [];
    ws.send(JSON.stringify({ kind: "snapshot", shapes }));
  }

  private peersForSocket(
    ws: WebSocket,
  ): { roomId: string; peers: Set<WebSocket> } | null {
    const roomId = this.socketRoomId.get(ws);
    if (roomId === undefined) {
      return null;
    }
    const peers = this.peersByRoom.get(roomId);
    return peers ? { roomId, peers } : null;
  }

  private broadcastExcept(
    sender: WebSocket,
    peers: Set<WebSocket>,
    payload: unknown,
  ) {
    const out = JSON.stringify(payload);
    for (const c of peers) {
      if (c.readyState === WebSocket.OPEN && c !== sender) {
        c.send(out);
      }
    }
  }

  private async handleOp(ws: WebSocket, msg: unknown): Promise<void> {
    const parsedOp = OpSchema.safeParse(msg);
    if (!parsedOp.success) {
      return;
    }
    const ctx = this.peersForSocket(ws);
    if (!ctx) {
      return;
    }
    const { roomId, peers } = ctx;
    const roomDbId = this.dbIdByRoomSlug.get(roomId);
    if (roomDbId === undefined) {
      return;
    }
    const op = parsedOp.data;

    if (op.op === OPS_NAMES.ADD) {
      const list = this.shapesByRoom.get(roomId) || [];
      const shape = { ...op.shape, version: 0 };
      list.push(shape);
      this.shapesByRoom.set(roomId, list);
      const addPayload = { ...op, shape };
      this.broadcastExcept(ws, peers, addPayload);
      ws.send(JSON.stringify(addPayload));
      await saveCanvasState(roomDbId, list);
      return;
    }

    if (op.op === OPS_NAMES.DELETE) {
      const list = this.shapesByRoom.get(roomId) || [];
      const index = list.findIndex((s) => s.id === op.id);
      if (index === -1 || !list[index]) {
        return;
      }
      if (op.baseVersion !== list[index].version) {
        ws.send(
          JSON.stringify({
            kind: "op_rejected",
            op: OPS_NAMES.DELETE,
            id: op.id,
            reason: "stale_version",
            serverVersion: list[index].version,
            shape: list[index],
          }),
        );
        return;
      }
      const next = list.filter((s) => s.id !== op.id);
      this.shapesByRoom.set(roomId, next);
      this.broadcastExcept(ws, peers, op);
      ws.send(JSON.stringify(op));
      await saveCanvasState(roomDbId, next);
      return;
    }

    if (op.op === OPS_NAMES.UPDATE) {
      const list = this.shapesByRoom.get(roomId) || [];
      const index = list.findIndex((s) => s.id === op.id);
      if (index === -1 || !list[index] || list[index].type !== op.update.type) {
        return;
      }
      if (op.baseVersion !== list[index].version) {
        ws.send(
          JSON.stringify({
            kind: "op_rejected",
            op: OPS_NAMES.UPDATE,
            id: op.id,
            reason: "stale_version",
            serverVersion: list[index].version,
            shape: list[index],
          }),
        );
        return;
      }
      const merged = { ...list[index], ...op.update };
      merged.version = list[index].version + 1;
      list[index] = merged;
      this.shapesByRoom.set(roomId, list);
      const updatePayload = { ...op, newVersion: merged.version };
      this.broadcastExcept(ws, peers, updatePayload);
      ws.send(JSON.stringify(updatePayload));
      await saveCanvasState(roomDbId, list);
    }
  }
}
