"use client";

import { useRef } from "react";
import { pointerToCanvas } from "./helper/helper";

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
  const rectangles = useRef<
    Array<{ left: number; top: number; w: number; h: number }>
  >([]);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!rectangles || !canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    for (const rectangle of rectangles.current) {
      ctx?.strokeRect(rectangle.left, rectangle.top, rectangle.w, rectangle.h);
    }
  };

  const pointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const { x, y } = pointerToCanvas(canvas, event.clientX, event.clientY);
    if (!x || !y) {
      return;
    }
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
    if (!x || !y) {
      return;
    }
    dragging.current = false;
    draggEnd.current = {
      x,
      y,
    };
    const sx = draggStart.current.x;
    const sy = draggStart.current.y;
    const ex = draggEnd.current.x;
    const ey = draggEnd.current.y;
    const left = Math.min(sx, ex);
    const top = Math.min(sy, ey);
    const w = Math.abs(ex - sx);
    const h = Math.abs(ey - sy);
    redraw();
    ctx?.strokeRect(left, top, w, h);
    rectangles.current.push({ left, top, w, h });
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
    if (!x || !y) {
      return;
    }
    draggEnd.current = {
      x,
      y,
    };
    const sx = draggStart.current.x;
    const sy = draggStart.current.y;
    const ex = draggEnd.current.x;
    const ey = draggEnd.current.y;
    const top = Math.min(sx, ex);
    const left = Math.min(sy, ey);
    const w = Math.abs(ex - sx);
    const h = Math.abs(ey - sy);
    redraw();
    ctx?.strokeRect(x, y, w, h);
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
