import { PointType } from "../point";

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
