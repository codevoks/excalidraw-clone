import { PointType } from "../point";
import { SHAPES_NAMES, type ShapeType } from "@repo/validation";

export function rectangleShapeFromDrag(
  start: PointType,
  end: PointType,
): ShapeType {
  const sx = start.x;
  const sy = start.y;
  const ex = end.x;
  const ey = end.y;
  const left = Math.min(sx, ex);
  const top = Math.min(sy, ey);
  const width = Math.abs(ex - sx);
  const height = Math.abs(ey - sy);
  return { type: SHAPES_NAMES.RECTANGLE, left, top, width, height };
}

export function paintRectangleDragPreview(
  context: CanvasRenderingContext2D,
  start: PointType,
  current: PointType,
) {
  const { left, top, width, height } = rectangleShapeFromDrag(
    { x: start.x, y: start.y },
    { x: current.x, y: current.y },
  );
  context?.strokeRect(left, top, width, height);
  return { left, top, width, height };
}

export function paintExistingRectangles(
  context: CanvasRenderingContext2D,
  rectangles: Array<ShapeType>,
) {
  if (!rectangles || !context) {
    return;
  }
  context?.clearRect(0, 0, context.canvas.width, context.canvas.height);
  for (const rectangle of rectangles) {
    context?.strokeRect(
      rectangle.left,
      rectangle.top,
      rectangle.width,
      rectangle.height,
    );
  }
}
