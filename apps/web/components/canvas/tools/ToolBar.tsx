import { ToolBarEntry } from "./ToolBarEntry";
import { tools } from "./tools.config";

export function ToolBar() {
  return (
    <div>
      {tools.map((tool) => (
        <ToolBarEntry key={tool.name} />
      ))}
    </div>
  );
}
