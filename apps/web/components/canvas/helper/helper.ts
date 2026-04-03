import { PointType } from "../shapes/point";
import { RectangleType } from "../shapes/rectangle";

export function pointerToCanvas(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
) {
  if (!canvas) {
    return { x: 0, y: 0 };
  }
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const canvasX = (clientX - rect.left) * scaleX;
  const canvasY = (clientY - rect.top) * scaleY;
  return { x: canvasX, y: canvasY };
}

export function rectFromDrag(start: PointType, end: PointType) {
  const sx = start.x;
  const sy = start.y;
  const ex = end.x;
  const ey = end.y;
  const left = Math.min(sx, ex);
  const top = Math.min(sy, ey);
  const width = Math.abs(ex - sx);
  const height = Math.abs(ey - sy);
  return { left, top, width, height };
}
