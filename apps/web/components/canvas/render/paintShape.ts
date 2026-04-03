import { Shape } from "../shapes/shapes.types";

export function paintShape(context: CanvasRenderingContext2D, shape: Shape) {
  if (shape.type === "rectangle") {
    context.strokeRect(shape.left, shape.top, shape.width, shape.height);
  }
}
