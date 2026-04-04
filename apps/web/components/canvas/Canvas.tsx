"use client";

import { useRef, useState, useEffect } from "react";
import { pointerToCanvas, PointType } from "./shapes/point";
import { paintScene } from "./render/paintScene";
import { checkShape, shapeFromDrag } from "./shapes/shape";
import { SHAPES_NAMES, Shape } from "@repo/validation";

export function Canvas({
  selectedShape,
}: {
  selectedShape: SHAPES_NAMES;
  roomId: string;
}) {
  const dragging = useRef(false);
  const draggStart = useRef<PointType | null>(null);
  const draggEnd = useRef<PointType | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapes = useRef<Array<Shape>>([]);

  const [messages, setMessages] = useState<Shape[]>([]);
  const [ws, setWs] = useState<WebSocket>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    const websocket = new WebSocket("ws://localhost:8080");
    setWs(websocket);

    websocket.onopen = () => console.log("Connected to WebSocket server");
    websocket.onmessage = (event) => {
      let shapeToAdd: Shape | null = null;
      try {
        const parsedShape = checkShape(JSON.parse(event.data));
        if (!parsedShape.success) {
          return;
        }
        shapeToAdd = parsedShape.data;
      } catch (error) {
        console.log("Error parsing event.data " + error);
        return;
      }
      setMessages((prevMessages) => [...prevMessages, shapeToAdd]);
      shapes.current.push(shapeToAdd);
      if (!context) {
        return;
      }
      paintScene(context, shapes.current);
    };
    websocket.onclose = () => console.log("Disconnected from WebSocket server");

    return () => websocket.close();
  }, []);

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
    shapes.current.push(currentShape);
    paintScene(context, shapes.current);
    draggStart.current = null;
    draggEnd.current = null;
    dragging.current = false;
    ws?.send(JSON.stringify(currentShape));
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
