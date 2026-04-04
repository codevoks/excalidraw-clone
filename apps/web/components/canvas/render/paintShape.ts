import type { Shape } from "@repo/validation";

export function paintShape(context: CanvasRenderingContext2D, shape: Shape) {
  if (shape.type === "rectangle") {
    context.strokeRect(shape.left, shape.top, shape.width, shape.height);
  }
}
