import {
  SHAPES_NAMES,
  type ShapeNameType,
  ShapeSchema,
} from "@repo/validation";
import { PointType } from "../point";
import { rectangleShapeFromDrag } from "../rectangle";

export function shapeFromDrag(
  type: ShapeNameType,
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
  return ShapeSchema.safeParse(data);
}
