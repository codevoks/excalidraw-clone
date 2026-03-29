"use client";

import { useEffect, useRef, useState } from "react";

export function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      setSize({
        w: Math.max(0, Math.floor(cr.width)),
        h: Math.max(0, Math.floor(cr.height)),
      });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.w === 0 || size.h === 0) return;

    const dpr = window.devicePixelRatio ?? 1;
    const bw = Math.max(1, Math.floor(size.w * dpr));
    const bh = Math.max(1, Math.floor(size.h * dpr));
    canvas.width = bw;
    canvas.height = bh;
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, size.w, size.h);

    const clickHandler = () => {
      ctx.fillStyle = "blue";
      ctx.fillRect(0, 0, size.w, size.h);
    };

    canvas.addEventListener("click", clickHandler);
    return () => canvas.removeEventListener("click", clickHandler);
  }, [size.w, size.h]);

  return (
    <div ref={containerRef} className="min-h-0 w-full flex-1">
      <canvas ref={canvasRef} className="touch-none" />
    </div>
  );
}
