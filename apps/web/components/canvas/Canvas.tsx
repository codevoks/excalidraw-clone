"use client";

import { useRef } from "react";
import { pointerToCanvas, PointType } from "./shapes/point";
import { paintScene } from "./render/paintScene";
import { SHAPES_NAMES, Shape, shapeFromDrag } from "./shapes/shape";

export function Canvas({ selectedShape }: { selectedShape: SHAPES_NAMES }) {
  const dragging = useRef(false);
  const draggStart = useRef<PointType | null>(null);
  const draggEnd = useRef<PointType | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapes = useRef<Array<Shape>>([]);

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
    shapes.current.push(
      shapeFromDrag(selectedShape, draggStart.current, draggEnd.current),
    );
    paintScene(context, shapes.current);
    draggStart.current = null;
    draggEnd.current = null;
    dragging.current = false;
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
