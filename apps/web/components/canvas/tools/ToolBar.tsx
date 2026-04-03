import { ToolBarEntry } from "./ToolBarEntry";
import { tools } from "./tools.config";
import { ToolBarType } from "./tools.types";

export function ToolBar({ selectedShape }: ToolBarType) {
  return (
    <div>
      {tools.map((tool) => {
        const entry = {
          name: tool.name,
          icon: tool.icon,
          selected: tool.name === selectedShape,
        };
        return <ToolBarEntry key={tool.name} entry={entry} />;
      })}
    </div>
  );
}
