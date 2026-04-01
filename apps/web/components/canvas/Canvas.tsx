"use client";

import { useRef } from "react";

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
    Array<{ x: number; y: number; w: number; h: number }>
  >([]);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!rectangles || !canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    for (const rectangle of rectangles.current) {
      ctx?.strokeRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
    }
  };

  const pointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = (event.clientX - rect.left) * scaleX;
    const canvasY = (event.clientY - rect.top) * scaleY;
    dragging.current = true;
    draggStart.current = {
      x: canvasX,
      y: canvasY,
    };
  };

  const pointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !draggStart.current) {
      return;
    }
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = (event.clientX - rect.left) * scaleX;
    const canvasY = (event.clientY - rect.top) * scaleY;
    dragging.current = false;
    draggEnd.current = {
      x: canvasX,
      y: canvasY,
    };
    const sx = draggStart.current.x;
    const sy = draggStart.current.y;
    const ex = draggEnd.current.x;
    const ey = draggEnd.current.y;
    const x = Math.min(sx, ex);
    const y = Math.min(sy, ey);
    const w = Math.abs(ex - sx);
    const h = Math.abs(ey - sy);
    redraw();
    ctx?.strokeRect(x, y, w, h);
    rectangles.current.push({ x, y, w, h });
    draggStart.current = null;
    draggEnd.current = null;
  };

  const pointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !dragging.current || !draggStart.current) {
      return;
    }
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = (event.clientX - rect.left) * scaleX;
    const canvasY = (event.clientY - rect.top) * scaleY;
    draggEnd.current = {
      x: canvasX,
      y: canvasY,
    };
    const sx = draggStart.current.x;
    const sy = draggStart.current.y;
    const ex = draggEnd.current.x;
    const ey = draggEnd.current.y;
    const x = Math.min(sx, ex);
    const y = Math.min(sy, ey);
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
