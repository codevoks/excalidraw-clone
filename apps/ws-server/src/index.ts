import "dotenv/config";

import { WebSocketServer } from "ws";
import { connectRedisClients } from "@repo/pubsub";
import { CanvasRoomServer } from "./webSocketHelper";

async function main() {
  await connectRedisClients();

  const canvas = new CanvasRoomServer();
  const wss = new WebSocketServer({ port: 8080 });

  wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.on("error", console.error);

    ws.on("message", async (data) => {
      try {
        await canvas.handleMessage(ws, data);
      } catch (error) {
        console.error(error);
      }
    });

    ws.on("close", () => {
      console.log("WS Connection closed");
      canvas.detach(ws);
    });
  });

  wss.on("close", () => {
    console.log("Server shut down");
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
