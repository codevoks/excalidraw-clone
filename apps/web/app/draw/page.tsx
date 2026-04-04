"use client";

import { useState } from "react";
import { Canvas } from "../../components/canvas/Canvas";
import { ToolBar } from "../../components/canvas/tools/ToolBar";
import { SHAPES_NAMES } from "@repo/validation";

export default function DrawPage() {
  const [selectedShape, setSelectedShape] = useState<SHAPES_NAMES>(
    SHAPES_NAMES.RECTANGLE,
  );
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <Canvas selectedShape={selectedShape} />
      {/* Float the rail over the canvas so there’s no full-width “black strip” row */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-center pt-2">
        <div className="pointer-events-auto">
          <ToolBar selectedShape={selectedShape} setShape={setSelectedShape} />
        </div>
      </div>
    </div>
  );
}
