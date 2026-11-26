import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { HandMesh } from "./hand-mesh";
import type { ProceduralHandScene } from "./hand-scene";

let meshRequest: Promise<HandMesh> | null = null;

// Meshing takes a moment, so it runs off the main thread once per document.
function loadMesh() {
  meshRequest ??= new Promise<HandMesh>((resolve, reject) => {
    const worker = new Worker(new URL("./hand-mesh.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (event: MessageEvent<HandMesh>) => { resolve(event.data); worker.terminate(); };
    worker.onerror = (event) => { meshRequest = null; reject(event); worker.terminate(); };
    worker.postMessage({ voxel: 0.11 });
  });
  return meshRequest;
}

type Status = "loading" | "ready" | "failed";

export function ProceduralHand() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scene = useRef<ProceduralHandScene | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let inView: IntersectionObserver | null = null;

    Promise.all([import("./hand-scene"), loadMesh()]).then(([{ createProceduralHandScene }, mesh]) => {
      if (disposed) return;
      scene.current = createProceduralHandScene(canvas, mesh);
      setStatus("ready");
      // Gild once the hand is mostly on screen.
      inView = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        window.setTimeout(() => scene.current?.gild(), 600);
        inView?.disconnect();
      }, { threshold: 0.6 });
      inView.observe(canvas);
    }).catch(() => {
      if (!disposed) setStatus("failed");
    });

    return () => {
      disposed = true;
      inView?.disconnect();
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);

  function replay() {
    scene.current?.reset();
    window.setTimeout(() => scene.current?.gild(), 350);
  }

  return (
    <figure className="flex flex-col items-center gap-4">
      <div className="relative aspect-[4/5] w-full max-w-[36rem]">
        <canvas
          ref={canvasRef}
          aria-label="A procedurally modelled porcelain hand. Gold kintsugi seams spread through its cracks from the index fingertip. Drag to turn it."
          role="img"
          className={`absolute inset-0 h-full w-full cursor-grab touch-none transition-opacity duration-1000 active:cursor-grabbing ${status === "ready" ? "opacity-100" : "opacity-0"}`}
          style={{ maskImage: "linear-gradient(to bottom, black 70%, transparent 97%)" }}
        />
        {status !== "ready" && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            {status === "loading" ? "Sculpting the hand…" : "This experiment needs WebGL."}
          </p>
        )}
      </div>
      <figcaption className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>Drag to turn the hand.</span>
        <Button variant="outline" size="sm" onClick={replay} disabled={status !== "ready"}>Replay gold</Button>
      </figcaption>
    </figure>
  );
}
