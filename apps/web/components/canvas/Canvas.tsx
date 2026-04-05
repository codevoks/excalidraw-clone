"use client";

import { useRef, useEffect } from "react";
import { pointerToCanvas, PointType } from "./shapes/point";
import { paintScene } from "./render/paintScene";
import { checkShape, shapeFromDrag } from "./shapes/shape";
import { canvasDebugBridge } from "./canvasDebugBridge";
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
        if (metaData.kind === "op") {
          if (metaData.op === OPS_NAMES.ADD) {
            handleIncomingDraw(context, metaData.shape);
          } else if (metaData.op === OPS_NAMES.DELETE) {
            const next = shapes.current.filter(
              (shape) => shape.id !== metaData.id,
            );
            shapes.current = next;
            paintScene(context, shapes.current);
          } else if (metaData.op === OPS_NAMES.UPDATE) {
            const index = shapes.current.findIndex(
              (shape) => shape.id === metaData.id,
            );
            if (
              index !== -1 &&
              shapes.current[index] &&
              shapes.current[index].type === metaData.update.type
            ) {
              const cur = shapes.current[index];
              const merged: ShapeType = {
                ...cur,
                ...metaData.update,
              };
              if (typeof metaData.newVersion === "number") {
                merged.version = metaData.newVersion;
              }
              shapes.current[index] = merged;
              paintScene(context, shapes.current);
            }
          } else {
            return;
          }
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

  useEffect(() => {
    canvasDebugBridge.moveLastRectPlus20 = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }
      const list = shapes.current;
      let index = -1;
      for (let i = list.length - 1; i >= 0; i--) {
        const s = list[i];
        if (s?.type === SHAPES_NAMES.RECTANGLE) {
          index = i;
          break;
        }
      }
      if (index === -1) {
        return;
      }
      const prev = list[index];
      if (!prev || prev.type !== SHAPES_NAMES.RECTANGLE) {
        return;
      }
      const update = {
        type: SHAPES_NAMES.RECTANGLE,
        left: prev.left + 20,
        top: prev.top + 20,
      };
      const next: ShapeType = {
        ...prev,
        ...update,
        version: prev.version + 1,
      };
      shapes.current[index] = next;
      paintScene(context, shapes.current);
      const socket = wsRef.current;
      const wsMetaData = {
        kind: "op",
        op: OPS_NAMES.UPDATE,
        id: prev.id,
        update,
        baseVersion: prev.version,
      };
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(wsMetaData));
      }
    };
    return () => {
      canvasDebugBridge.moveLastRectPlus20 = () => {};
    };
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
    const shapeWithId = {
      ...currentShape,
      id: crypto.randomUUID(),
      version: 0,
    };
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
    canvas.focus({ preventScroll: true });
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context || (event.key !== "Backspace" && event.key !== "Delete")) {
      return;
    }
    const list = shapes.current;
    const numberOfShapes = list.length;
    if (!numberOfShapes || numberOfShapes < 1) {
      return;
    }
    event.preventDefault();
    const lastId = list[numberOfShapes - 1]?.id;
    const next = list.filter((shape) => shape.id !== lastId);
    shapes.current = next;
    paintScene(context, shapes.current);
    const socket = wsRef.current;
    const wsMetaData = { kind: "op", op: OPS_NAMES.DELETE, id: lastId };
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(wsMetaData));
    }
  };

  return (
    <div className="flex-1 w-full min-h-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-slate-800"
        tabIndex={0}
        height={600}
        width={400}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
