import { SHAPES_NAMES } from "../shapes/shape";

type ToolBarEntryType = {
  name: SHAPES_NAMES;
  label: string;
  selected: boolean;
};

export type ToolBarEntryProp = {
  entry: ToolBarEntryType;
  onClick: (shape: SHAPES_NAMES) => void;
};

export type ToolBarProps = {
  selectedShape: SHAPES_NAMES;
  setShape: (shape: SHAPES_NAMES) => void;
};
