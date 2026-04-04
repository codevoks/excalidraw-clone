import type { ReactNode } from "react";
import { SHAPES_NAMES } from "@repo/validation";

function RectangleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Inset + stroke kept inside viewBox so nothing clips at small sizes */}
      <rect
        x="5.25"
        y="7.25"
        width="13.5"
        height="9.5"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS: Record<SHAPES_NAMES, () => ReactNode> = {
  [SHAPES_NAMES.RECTANGLE]: RectangleIcon,
};

export function toolIconFor(name: SHAPES_NAMES): ReactNode {
  const Icon = ICONS[name];
  return Icon ? <Icon /> : null;
}
