import { SHAPES_NAMES } from "../shapes/shape";

type ToolBarEntryType = {
  name: SHAPES_NAMES;
  icon: string;
  selected: boolean;
};

export type ToolBarEntryProp = { entry: ToolBarEntryType };

export type ToolBarType = {
  selectedShape: SHAPES_NAMES;
};
