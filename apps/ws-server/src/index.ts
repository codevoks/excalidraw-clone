import { WebSocketServer, WebSocket } from "ws";
import {
  ShapeType,
  AddOpSchema,
  OPS_NAMES,
  DeleteOpSchema,
} from "@repo/validation";

const wss = new WebSocketServer({ port: 8080 });

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

function removeWsFromMap(ws: WebSocket) {
  for (const [roomId, webSockets] of roomsToWsMap.entries()) {
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

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    try {
      const incomingMessage = typeof data === "string" ? data : data.toString();
      console.log("received: %s", incomingMessage);
      const parsedIncomingMessage = JSON.parse(incomingMessage);
      if (parsedIncomingMessage.kind === "join") {
        const roomId = String(parsedIncomingMessage.roomId);
        removeWsFromMap(ws);
        const peers = roomsToWsMap.get(roomId) ?? new Set<WebSocket>();
        peers.add(ws);
        roomsToWsMap.set(roomId, peers);
        wsToRoomsMap.set(ws, new Set([roomId]));
        const storedShapesInCurrentRoom = storedShapesInRooms.get(roomId) || [];
        const wsMetaData = {
          kind: "snapshot",
          shapes: storedShapesInCurrentRoom,
        };
        ws.send(JSON.stringify(wsMetaData));
        return;
      } else if (parsedIncomingMessage.kind === "op") {
        const ctx = getRoomContext(ws);
        if (!ctx) {
          return;
        }
        const { roomId, peers } = ctx;

        if (parsedIncomingMessage.op === OPS_NAMES.ADD) {
          const parsedAddOp = AddOpSchema.safeParse(parsedIncomingMessage);
          if (!parsedAddOp.success) {
            return;
          }
          const list = storedShapesInRooms.get(roomId) || [];
          list.push(parsedAddOp.data.shape);
          storedShapesInRooms.set(roomId, list);
          broadcastToPeers(ws, peers, parsedAddOp.data);
        } else if (parsedIncomingMessage.op === OPS_NAMES.DELETE) {
          const parsedDeleteOp = DeleteOpSchema.safeParse(
            parsedIncomingMessage,
          );
          if (!parsedDeleteOp.success) {
            return;
          }
          const list = storedShapesInRooms.get(roomId) || [];
          const nextShapes = list.filter(
            (shape) => shape.id !== parsedDeleteOp.data.id,
          );
          storedShapesInRooms.set(roomId, nextShapes);
          broadcastToPeers(ws, peers, parsedDeleteOp.data);
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
