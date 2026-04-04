"use client";

import { useRef, useEffect } from "react";
import { pointerToCanvas, PointType } from "./shapes/point";
import { paintScene } from "./render/paintScene";
import { checkShape, shapeFromDrag } from "./shapes/shape";
import { OPS_NAMES, SHAPES_NAMES, ShapeType } from "@repo/validation";

export function Canvas({
  selectedShape,
  roomId,
}: {
  selectedShape: SHAPES_NAMES;
  roomId: string;
}) {
  const dragging = useRef(false);
  const draggStart = useRef<PointType | null>(null);
  const draggEnd = useRef<PointType | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapes = useRef<Array<ShapeType>>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const handleIncomingDraw = (
    context: CanvasRenderingContext2D,
    shape: unknown,
  ) => {
    const parsedShape = checkShape(shape);
    if (!parsedShape.success) {
      return;
    }
    shapes.current.push(parsedShape.data);
    paintScene(context, shapes.current);
  };

  useEffect(() => {
    shapes.current = [];
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    paintScene(context, shapes.current);
    const websocket = new WebSocket("ws://localhost:8080");
    wsRef.current = websocket;

    websocket.onopen = () => {
      console.log("Connected to WebSocket server");
      const joinMetaData = { kind: "join", roomId: roomId };
      websocket.send(JSON.stringify(joinMetaData));
    };
    websocket.onmessage = (event) => {
      try {
        const metaData = JSON.parse(event.data);
        if (!metaData || !("kind" in metaData)) {
          return;
        }
        if (metaData.kind === "op" && metaData.op === OPS_NAMES.ADD) {
          handleIncomingDraw(context, metaData.shape);
        } else if (metaData.kind === "snapshot") {
          if (!Array.isArray(metaData.shapes)) {
            return;
          }
          const next: ShapeType[] = [];
          for (const item of metaData.shapes) {
            const parsed = checkShape(item);
            if (parsed.success) {
              next.push(parsed.data);
            }
          }
          shapes.current = next;
          paintScene(context, shapes.current);
        }
      } catch (error) {
        console.log("Error parsing event.data " + error);
        return;
      }
    };
    websocket.onclose = () => console.log("Disconnected from WebSocket server");

    return () => {
      wsRef.current = null;
      websocket.close();
    };
  }, [roomId]);

  const pointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const { x, y } = pointerToCanvas(canvas, event.clientX, event.clientY);
    dragging.current = true;
    draggStart.current = {
      x,
      y,
    };
  };

  const pointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !draggStart.current) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const { x, y } = pointerToCanvas(canvas, event.clientX, event.clientY);
    draggEnd.current = {
      x,
      y,
    };
    const currentShape = shapeFromDrag(
      selectedShape,
      draggStart.current,
      draggEnd.current,
    );
    const shapeWithId = { ...currentShape, id: crypto.randomUUID() };
    shapes.current.push(shapeWithId);
    paintScene(context, shapes.current);
    draggStart.current = null;
    draggEnd.current = null;
    dragging.current = false;
    const wsMetaData = {
      kind: "op",
      op: OPS_NAMES.ADD,
      shape: shapeWithId,
    };
    const socket = wsRef.current;
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(wsMetaData));
    }
  };

  const pointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !dragging.current || !draggStart.current) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const { x, y } = pointerToCanvas(canvas, event.clientX, event.clientY);
    draggEnd.current = {
      x,
      y,
    };
    paintScene(
      context,
      shapes.current,
      shapeFromDrag(selectedShape, draggStart.current, draggEnd.current),
    );
  };

  return (
    <div className="flex-1 w-full min-h-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-slate-800"
        height={600}
        width={400}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
      />
    </div>
  );
}
