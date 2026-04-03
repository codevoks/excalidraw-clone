"use client";

import { useState } from "react";
import { Canvas } from "../../components/canvas/Canvas";
import { ToolBar } from "../../components/canvas/tools/ToolBar";
import { SHAPES_NAMES } from "../../components/canvas/shapes/shape";

export default function DrawPage() {
  const [selectedShape, setSelectedShape] = useState<SHAPES_NAMES>(
    SHAPES_NAMES.RECTANGLE,
  );
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="">
        <ToolBar selectedShape={selectedShape} setShape={setSelectedShape} />
      </div>
      <Canvas selectedShape={selectedShape} />
    </div>
  );
}
