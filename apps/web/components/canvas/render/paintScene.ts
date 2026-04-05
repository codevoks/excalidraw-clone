import type { ShapeDraftType, ShapeType } from "@repo/validation";
import { paintShape } from "./paintShape";

export function paintScene(
  context: CanvasRenderingContext2D,
  shapes: ShapeType[],
  draft?: ShapeDraftType | null,
) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  for (const shape of shapes) {
    paintShape(context, shape);
  }
  if (draft) {
    paintShape(context, draft);
  }
}
