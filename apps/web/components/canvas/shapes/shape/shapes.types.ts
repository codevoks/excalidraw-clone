import { SHAPES_NAMES } from "./shapes.config";

export type ShapeType = SHAPES_NAMES;

export type Shape = {
  type: SHAPES_NAMES;
  left: number;
  top: number;
  width: number;
  height: number;
};
