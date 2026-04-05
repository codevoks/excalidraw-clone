import type { ShapeDraftType } from "@repo/validation";

export function paintShape(
  context: CanvasRenderingContext2D,
  shape: ShapeDraftType,
) {
  if (shape.type === "rectangle") {
    context.strokeRect(shape.left, shape.top, shape.width, shape.height);
  }
}
