"use client";

import { useRef } from "react";
import { pointerToCanvas, rectFromDrag } from "./helper/helper";
import { RectangleType } from "./shapes/rectangle";

interface draggposition {
  x: number;
  y: number;
}

export function Canvas() {
  const dragging = useRef(false);
  const draggStart = useRef<draggposition | null>(null);
  const draggEnd = useRef<draggposition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rectangles = useRef<Array<RectangleType>>([]);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!rectangles || !canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    for (const rectangle of rectangles.current) {
      ctx?.strokeRect(
        rectangle.left,
        rectangle.top,
        rectangle.width,
        rectangle.height,
      );
    }
  };

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
    const ctx = canvas.getContext("2d");
    const { x, y } = pointerToCanvas(canvas, event.clientX, event.clientY);
    dragging.current = false;
    draggEnd.current = {
      x,
      y,
    };
    const { left, top, width, height } = rectFromDrag(
      { x: draggStart.current.x, y: draggStart.current.y },
      { x: draggEnd.current.x, y: draggEnd.current.y },
    );
    redraw();
    ctx?.strokeRect(left, top, width, height);
    rectangles.current.push({ left, top, width, height });
    draggStart.current = null;
    draggEnd.current = null;
  };

  const pointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !dragging.current || !draggStart.current) {
      return;
    }
    const ctx = canvas.getContext("2d");
    const { x, y } = pointerToCanvas(canvas, event.clientX, event.clientY);
    draggEnd.current = {
      x,
      y,
    };
    const { left, top, width, height } = rectFromDrag(
      { x: draggStart.current.x, y: draggStart.current.y },
      { x: draggEnd.current.x, y: draggEnd.current.y },
    );
    redraw();
    ctx?.strokeRect(left, top, width, height);
  };

  return (
    <div ref={containerRef} className="min-h-0 w-full flex-1">
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
