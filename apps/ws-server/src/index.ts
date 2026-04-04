import { WebSocketServer, WebSocket } from "ws";
import { ShapeSchema, ShapeType } from "@repo/validation";

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
      } else if (parsedIncomingMessage.kind === "draw") {
        const parsedShape = ShapeSchema.safeParse(parsedIncomingMessage.shape);
        if (!parsedShape.success) {
          return;
        }
        const rooms = wsToRoomsMap.get(ws);
        if (!rooms?.size) {
          return;
        }
        const [firstRoomId] = rooms;
        if (firstRoomId === undefined) {
          return;
        }
        const peers = roomsToWsMap.get(firstRoomId);
        if (!peers) {
          return;
        }
        const storedShapesInCurrentRoom =
          storedShapesInRooms.get(firstRoomId) || [];
        storedShapesInCurrentRoom.push(parsedShape.data);
        storedShapesInRooms.set(firstRoomId, storedShapesInCurrentRoom);
        peers.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(incomingMessage);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  });

  ws.send("something");

  ws.on("close", () => {
    console.log("WS Connection closed");
    removeWsFromMap(ws);
    wsToRoomsMap.delete(ws);
  });
});

wss.on("close", function close() {
  console.log("Server shut down");
});
