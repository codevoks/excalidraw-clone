"use client";

import { useEffect, useRef, useState } from "react";

export function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div ref={containerRef} className="min-h-0 w-full flex-1">
      <canvas ref={canvasRef} className="h-full w-full bg-slate-800" />
    </div>
  );
}
