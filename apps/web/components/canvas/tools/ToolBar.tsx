import { ToolBarEntry } from "./ToolBarEntry";
import { tools } from "./tools.config";
import { ToolBarProps } from "./tools.types";

export function ToolBar({ selectedShape, setShape }: ToolBarProps) {
  return (
    <div>
      {tools.map((tool) => {
        const entry = {
          name: tool.name,
          icon: tool.icon,
          selected: tool.name === selectedShape,
        };
        return (
          <ToolBarEntry
            key={tool.name}
            entry={entry}
            onClick={() => setShape(tool.name)}
          />
        );
      })}
    </div>
  );
}
