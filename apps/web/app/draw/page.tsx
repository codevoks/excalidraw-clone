"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Canvas } from "../../components/canvas/Canvas";
import { canvasDebugBridge } from "../../components/canvas/canvasDebugBridge";
import { ToolBar } from "../../components/canvas/tools/ToolBar";
import { SHAPES_NAMES } from "@repo/validation";

function DrawPageContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId") ?? "testRoom";
  const [selectedShape, setSelectedShape] = useState<SHAPES_NAMES>(
    SHAPES_NAMES.RECTANGLE,
  );
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <Canvas selectedShape={selectedShape} roomId={roomId} />
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-center pt-2">
        <div className="pointer-events-auto">
          <ToolBar selectedShape={selectedShape} setShape={setSelectedShape} />
        </div>
      </div>
      <div className="pointer-events-none absolute left-3 top-14 z-20">
        <button
          type="button"
          className="pointer-events-auto rounded border border-amber-500/70 bg-slate-900/95 px-2.5 py-1 text-xs font-medium text-amber-100 shadow-md backdrop-blur-sm hover:bg-slate-800"
          onClick={() => canvasDebugBridge.moveLastRectPlus20()}
        >
          Debug: move last rect +20
        </button>
      </div>
    </div>
  );
}

export default function DrawPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-0 flex-1 flex-col bg-slate-950" />
      }
    >
      <DrawPageContent />
    </Suspense>
  );
}
