import { SHAPES_NAMES, type ShapeType } from "@repo/validation";
import { PointType } from "../point";
import { rectangleShapeFromDrag } from "../rectangle";

export function shapeFromDrag(
  type: ShapeType,
  start: PointType,
  end: PointType,
) {
  if (type === SHAPES_NAMES.RECTANGLE) {
    return rectangleShapeFromDrag(start, end);
  } else {
    throw new Error("Unknown shape type");
  }
}

export function checkShape(data: unknown) {
  if (!data || typeof data !== "object" || !("type" in data)) {
    return;
  }
}
