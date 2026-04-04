import type { ShapeType } from "@repo/validation";

export function paintShape(
  context: CanvasRenderingContext2D,
  shape: ShapeType,
) {
  if (shape.type === "rectangle") {
    context.strokeRect(shape.left, shape.top, shape.width, shape.height);
  }
}
