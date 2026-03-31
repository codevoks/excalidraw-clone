"use client";

import { useEffect, useRef } from "react";

export function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  //   useEffect(() => {
  //     if (canvasRef.current) {
  //       const ctx = canvasRef.current.getContext("2d");
  //       ctx?.strokeRect(200, 200, 40, 50);
  //     }
  //   }, []);

  const handleClick = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const canvasX = (event.clientX - rect.left) * scaleX;
      const canvasY = (event.clientY - rect.top) * scaleY;
      ctx?.strokeRect(canvasX, canvasY, 50, 50);
    }
  };

  return (
    <div ref={containerRef} className="min-h-0 w-full flex-1">
      <canvas
        ref={canvasRef}
        className="h-full w-full bg-slate-800"
        height={600}
        width={400}
        onClick={handleClick}
      />
    </div>
  );
}
