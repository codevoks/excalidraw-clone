import { ToolBarEntryProp } from "./tools.types";

export function ToolBarEntry({ entry }: ToolBarEntryProp) {
  return (
    <div>
      <p>{entry.name}</p>
    </div>
  );
}
