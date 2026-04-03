import { toolIconFor } from "./tools.icons";
import { toolbarEntryClass } from "./tools.classes";
import { ToolBarEntryProp } from "./tools.types";

export function ToolBarEntry({ entry, onClick }: ToolBarEntryProp) {
  const className = entry.selected
    ? `${toolbarEntryClass.root} ${toolbarEntryClass.selected}`
    : toolbarEntryClass.root;

  return (
    <button
      type="button"
      className={className}
      aria-pressed={entry.selected}
      aria-label={entry.label}
      title={entry.label}
      onClick={() => onClick(entry.name)}
    >
      <span className={toolbarEntryClass.icon}>{toolIconFor(entry.name)}</span>
      <span className={toolbarEntryClass.label}>{entry.label}</span>
    </button>
  );
}
