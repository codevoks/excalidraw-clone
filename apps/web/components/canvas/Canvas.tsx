"use client";

import { useRef } from "react";
import { pointerToCanvas, PointType } from "./shapes/point";
import {
  RectangleType,
  paintRectangleDragPreview,
  paintRectangles,
} from "./shapes/rectangle";

export function Canvas() {
  const dragging = useRef(false);
  const draggStart = useRef<PointType | null>(null);
  const draggEnd = useRef<PointType | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rectangles = useRef<Array<RectangleType>>([]);

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
    paintRectangles(context, rectangles.current);
    const { x, y } = pointerToCanvas(canvas, event.clientX, event.clientY);
    dragging.current = false;
    draggEnd.current = {
      x,
      y,
    };
    const { left, top, width, height } = paintRectangleDragPreview(
      context,
      {
        x: draggStart.current.x,
        y: draggStart.current.y,
      },
      {
        x: draggEnd.current.x,
        y: draggEnd.current.y,
      },
    );
    rectangles.current.push({ left, top, width, height });
    draggStart.current = null;
    draggEnd.current = null;
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
    paintRectangles(context, rectangles.current);
    const { x, y } = pointerToCanvas(canvas, event.clientX, event.clientY);
    draggEnd.current = {
      x,
      y,
    };
    const { left, top, width, height } = paintRectangleDragPreview(
      context,
      {
        x: draggStart.current.x,
        y: draggStart.current.y,
      },
      {
        x: draggEnd.current.x,
        y: draggEnd.current.y,
      },
    );
  };

  return (
    <div className="min-h-0 w-full flex-1">
      <canvas
        ref={canvasRef}
        className="h-full w-full bg-slate-800"
        height={600}
        width={400}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
      />
    </div>
  );
}
