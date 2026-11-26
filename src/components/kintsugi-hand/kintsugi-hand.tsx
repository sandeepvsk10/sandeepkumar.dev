import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Butterfly } from "@/components/butterfly/butterfly";
import handImage from "./porcelain-hand.png";
import { goldTraceLength, goldTraces, goldTraceWidth } from "./gold-flow";
import type { HandScene } from "./hand-scene";
import { fingertip, goldFlowDurationMs, handSilhouette } from "./hand-silhouette";
import "./kintsugi-hand.css";

const mask = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 564 564"><path fill="white" fill-rule="evenodd" d="${handSilhouette}"/></svg>`;
const maskImage = `url("data:image/svg+xml,${encodeURIComponent(mask)}")`;

export function KintsugiHand() {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scene = useRef<HandScene | null>(null);
  const landedAt = useRef<number | null>(null);
  const [gilded, setGilded] = useState(false);
  const goldMaskId = useId();

  const gild = useCallback(() => {
    if (landedAt.current !== null) return;
    landedAt.current = performance.now();
    scene.current?.gild(landedAt.current);
    setGilded(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;
    let disposed = false;

    // The photograph also carries the landing effect while WebGL initializes or is unavailable.
    Promise.all([import("./hand-scene"), image.decode()]).then(([{ createHandScene }]) => {
      if (disposed) return;
      scene.current = createHandScene(canvas, image);
      if (landedAt.current !== null) scene.current.gild(landedAt.current);
    }).catch(() => {
      if (!disposed) canvas.hidden = true;
    });

    return () => {
      disposed = true;
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);

  return (
    <figure className="relative mx-auto aspect-square w-full max-w-[36rem]">
      <canvas ref={canvasRef} aria-hidden="true" hidden className="peer absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 peer-[:not([hidden])]:opacity-0" style={{ maskImage, maskSize: "100% 100%" }}>
        <img ref={imageRef} src={handImage} width="564" height="564" className="kintsugi-porcelain block w-full"
          alt="A porcelain hand with a raised fingertip. Its gray fissures turn gold when the golden butterfly lands." />
        <svg viewBox="0 0 564 564" aria-hidden="true" className="absolute inset-0 h-full w-full">
          <defs>
            <mask id={goldMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width="564" height="564">
              {goldTraces.map(({ path, start, end }) => (
                <path key={path} d={path} fill="none" stroke="white" strokeWidth={goldTraceWidth}
                  pathLength="1" strokeDasharray="1 1" strokeDashoffset={gilded ? 0 : 1}
                  className="transition-[stroke-dashoffset] ease-linear motion-reduce:transition-none"
                  style={{
                    transitionDelay: `${start / goldTraceLength * goldFlowDurationMs}ms`,
                    transitionDuration: `${(end - start) / goldTraceLength * goldFlowDurationMs}ms`,
                  }} />
              ))}
            </mask>
          </defs>
          <image href={handImage} width="564" height="564" className="kintsugi-gold" mask={`url(#${goldMaskId})`} />
        </svg>
      </div>
      <Butterfly landingClassName="kintsugi-butterfly inset-0" perch={fingertip} onLand={gild} color="gold" />
    </figure>
  );
}
