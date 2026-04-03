import { ToolBarEntry } from "./ToolBarEntry";
import { toolbarClass } from "./tools.classes";
import { tools } from "./tools.config";
import { ToolBarProps } from "./tools.types";

export function ToolBar({ selectedShape, setShape }: ToolBarProps) {
  return (
    <div className={toolbarClass.root}>
      <div className={toolbarClass.rail} role="toolbar" aria-label="Drawing tools">
        {tools.map((tool) => {
          const entry = {
            name: tool.name,
            label: tool.label,
            selected: tool.name === selectedShape,
          };
          return (
            <ToolBarEntry
              key={tool.name}
              entry={entry}
              onClick={setShape}
            />
          );
        })}
      </div>
    </div>
  );
}
