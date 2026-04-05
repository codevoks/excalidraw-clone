import "dotenv/config";

import { WebSocketServer, WebSocket } from "ws";
import { ShapeType, OpSchema, OPS_NAMES } from "@repo/validation";
import {
  getRoomBySlug,
  createRoomBySlug,
  getCanvasShapes,
  saveCanvasState,
} from "@repo/db";

import { connectRedisClients } from "@repo/pubsub";

// wss.broadcast = function broadcast(data) {
//   wss.clients.forEach(function each(client) {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(data);
//     }
//   });
// };

const roomsToWsMap = new Map<string, Set<WebSocket>>();
const wsToRoomsMap = new Map<WebSocket, Set<string>>();

const storedShapesInRooms = new Map<string, ShapeType[]>();
const roomSlugToDbId = new Map<string, number>();

function removeWsFromMap(ws: WebSocket) {
  for (const [, webSockets] of roomsToWsMap.entries()) {
    if (webSockets.has(ws)) {
      webSockets.delete(ws);
      return;
    }
  }
}

function getRoomContext(ws: WebSocket): {
  roomId: string;
  peers: Set<WebSocket>;
} | null {
  const rooms = wsToRoomsMap.get(ws);
  if (!rooms?.size) {
    return null;
  }
  const [firstRoomId] = rooms;
  if (firstRoomId === undefined) {
    return null;
  }
  const peers = roomsToWsMap.get(firstRoomId);
  if (!peers) {
    return null;
  }
  return { roomId: firstRoomId, peers };
}

function broadcastToPeers(
  sender: WebSocket,
  peers: Set<WebSocket>,
  payload: unknown,
) {
  const message = JSON.stringify(payload);
  for (const client of peers) {
    if (client.readyState === WebSocket.OPEN && client !== sender) {
      client.send(message);
    }
  }
}

async function main() {
  await connectRedisClients();

  const wss = new WebSocketServer({ port: 8080 });

  wss.on("connection", function connection(ws) {
    console.log("Client connected");

    ws.on("error", console.error);

    ws.on("message", async function message(data) {
      try {
        const incomingMessage =
          typeof data === "string" ? data : data.toString();
        console.log("received: %s", incomingMessage);
        const parsedIncomingMessage = JSON.parse(incomingMessage);
        if (parsedIncomingMessage.kind === "join") {
          const roomId = String(parsedIncomingMessage.roomId);
          let room = await getRoomBySlug(roomId);

          if (!room) {
            room = await createRoomBySlug(roomId);
          }
          roomSlugToDbId.set(roomId, room.id);
          if (!storedShapesInRooms.has(roomId)) {
            storedShapesInRooms.set(roomId, await getCanvasShapes(roomId));
          }
          removeWsFromMap(ws);
          const peers = roomsToWsMap.get(roomId) ?? new Set<WebSocket>();
          peers.add(ws);
          roomsToWsMap.set(roomId, peers);
          wsToRoomsMap.set(ws, new Set([roomId]));
          const storedShapesInCurrentRoom =
            storedShapesInRooms.get(roomId) || [];
          const wsMetaData = {
            kind: "snapshot",
            shapes: storedShapesInCurrentRoom,
          };
          ws.send(JSON.stringify(wsMetaData));
          return;
        } else if (parsedIncomingMessage.kind === "op") {
          const parsedOp = OpSchema.safeParse(parsedIncomingMessage);
          if (!parsedOp.success) {
            return;
          }
          const ctx = getRoomContext(ws);
          if (!ctx) {
            return;
          }
          const { roomId, peers } = ctx;
          const roomDbId = roomSlugToDbId.get(roomId);
          if (roomDbId === undefined) {
            return;
          }
          const op = parsedOp.data;

          if (op.op === OPS_NAMES.ADD) {
            const list = storedShapesInRooms.get(roomId) || [];
            const shape = { ...op.shape, version: 0 };
            list.push(shape);
            storedShapesInRooms.set(roomId, list);
            const addPayload = { ...op, shape };
            broadcastToPeers(ws, peers, addPayload);
            ws.send(JSON.stringify(addPayload));
            await saveCanvasState(roomDbId, list);
          } else if (op.op === OPS_NAMES.DELETE) {
            const list = storedShapesInRooms.get(roomId) || [];
            const index = list.findIndex((shape) => shape.id === op.id);
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
            const nextShapes = list.filter((shape) => shape.id !== op.id);
            storedShapesInRooms.set(roomId, nextShapes);
            broadcastToPeers(ws, peers, op);
            ws.send(JSON.stringify(op));
            await saveCanvasState(roomDbId, nextShapes);
          } else if (op.op === OPS_NAMES.UPDATE) {
            const list = storedShapesInRooms.get(roomId) || [];
            const index = list.findIndex((shape) => shape.id === op.id);
            if (
              index === -1 ||
              !list[index] ||
              list[index].type !== op.update.type
            ) {
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
            storedShapesInRooms.set(roomId, list);
            const updatePayload = {
              ...op,
              newVersion: merged.version,
            };
            broadcastToPeers(ws, peers, updatePayload);
            ws.send(JSON.stringify(updatePayload));
            await saveCanvasState(roomDbId, list);
          }
        }
      } catch (error) {
        console.error(error);
      }
    });

    ws.on("close", () => {
      console.log("WS Connection closed");
      removeWsFromMap(ws);
      wsToRoomsMap.delete(ws);
    });
  });

  wss.on("close", function close() {
    console.log("Server shut down");
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
