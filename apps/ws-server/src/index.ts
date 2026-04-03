import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// wss.broadcast = function broadcast(data) {
//   wss.clients.forEach(function each(client) {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(data);
//     }
//   });
// };

wss.on("connection", function connection(ws) {
  console.log("Client connected");
  ws.send("Welcome! You are connected to the WebSocket server.");

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    try {
      const incomingMessage = typeof data === "string" ? data : data.toString();
      console.log("received: %s", incomingMessage);
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(incomingMessage);
        }
      });
    } catch (error) {}
  });

  ws.send("something");
});

wss.on("close", function close() {
  console.log("Client disconnected");
});
