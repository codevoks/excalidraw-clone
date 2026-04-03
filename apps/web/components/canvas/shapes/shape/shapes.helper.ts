import { PointType } from "../point";
import { SHAPES_NAMES } from "./shapes.config";
import { ShapeType } from "./shapes.types";
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
