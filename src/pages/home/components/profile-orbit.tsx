import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

const viewSize = 114;
const center = viewSize / 2;
const radius = 56;
// Round head at the origin with its tip trailing back along -x.
const dropShape = "M2.6 0C1.2-.35.65-1.75-.55-1.75a1.75 1.75 0 0 0 0 3.5C.65 1.75 1.2.35 2.6 0Z";
const delay = 150;
const duration = 1500;

type Orbit = {
  path: string;
  /** Length the line grows to before it travels as a fixed-length train. */
  trainLength: number;
  /** Viewbox units per screen pixel, so the stroke stays 1px wide. */
  unitsPerPixel: number;
};

const easeInOut = (t: number) => (t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

export function ProfileOrbit({ subtitleRef }: { subtitleRef: RefObject<HTMLSpanElement | null> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGPathElement>(null);
  const progress = useRef(0);
  const trainLength = useRef(0);
  const [orbit, setOrbit] = useState<Orbit | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const subtitle = subtitleRef.current;
    if (!svg || !subtitle) return;
    const mobile = window.matchMedia("(width < 40rem)");

    function alignEndpoint(orbit: SVGSVGElement, bio: HTMLSpanElement) {
      const bounds = orbit.getBoundingClientRect();
      const lines = bio.getClientRects();
      const lastLine = lines[lines.length - 1];
      if (!bounds.width || !bounds.height || !lastLine) return;
      const unitsPerPixel = viewSize / bounds.width;

      if (mobile.matches) {
        // The bio wraps well below the small avatar on phones, so a tail would dangle; draw an open ring.
        const gap = Math.PI / 7;
        setOrbit({
          path: `M${center + radius} ${center} A${radius} ${radius} 0 1 0 ` +
            `${center + radius * Math.cos(gap)} ${center + radius * Math.sin(gap)}`,
          trainLength: Infinity,
          unitsPerPixel,
        });
        return;
      }

      const endX = (lastLine.right - bounds.left) * unitsPerPixel;
      const underlineGap = 20;
      const lineY = (lastLine.bottom + underlineGap - bounds.top) / bounds.height * viewSize;
      const arcY = Math.min(center + radius * .93, Math.max(center + 6, lineY + 4));
      const arcX = center + Math.sqrt(radius ** 2 - (arcY - center) ** 2);
      const bendEnd = Math.min(arcX + 14, endX);
      // Leave the circle tangentially, then flatten into the line under the final text fragment.
      const tangentX = (arcY - center) / radius;
      const tangentY = -(arcX - center) / radius;
      setOrbit({
        path: `M${center + radius} ${center} A${radius} ${radius} 0 1 0 ${arcX} ${arcY} ` +
          `C${arcX + 6 * tangentX} ${arcY + 6 * tangentY} ${bendEnd - 5} ${lineY} ${bendEnd} ${lineY} H${endX}`,
        // Match the train to the subtitle, "Obsessed" through "UI/UX".
        trainLength: lastLine.width * unitsPerPixel,
        unitsPerPixel,
      });
    }

    const update = () => alignEndpoint(svg, subtitle);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(svg);
    if (subtitle.parentElement) observer.observe(subtitle.parentElement);
    document.fonts.addEventListener("loadingdone", update);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", update);
    };
  }, [subtitleRef]);

  /** Grow the line behind a moving head until it reaches its train length, then slide it along. */
  const render = (t: number) => {
    const line = lineRef.current;
    const head = headRef.current;
    if (!line || !head) return;
    const total = line.getTotalLength();
    const front = easeInOut(t) * total;
    const back = Math.max(0, front - trainLength.current);
    line.style.strokeDasharray = `${front - back} ${total + 1}`;
    line.style.strokeDashoffset = `${-back}`;
    line.style.opacity = t > 0 ? "1" : "0";
    const point = line.getPointAtLength(front);
    const behind = line.getPointAtLength(Math.max(0, front - .5));
    const ahead = line.getPointAtLength(Math.min(total, front + .5));
    const angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180 / Math.PI;
    head.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle + 180})`);
    head.style.opacity = "1";
  };

  // Re-apply the current frame whenever the path is re-measured (resize, font load).
  useLayoutEffect(() => {
    if (!orbit) return;
    trainLength.current = orbit.trainLength;
    render(progress.current);
  }, [orbit]);

  const ready = orbit !== null;
  useEffect(() => {
    if (!ready) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progress.current = 1;
      render(1);
      return;
    }
    let frame = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      start ??= now + delay;
      progress.current = Math.min(1, Math.max(0, (now - start) / duration));
      render(progress.current);
      if (progress.current < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ready]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      className="pointer-events-none absolute left-1/2 top-1/2 size-[calc(100%+0.75rem)] -translate-x-1/2 -translate-y-1/2 overflow-visible text-foreground"
    >
      {orbit && (
        <>
          <path
            ref={lineRef}
            d={orbit.path}
            stroke="currentColor"
            strokeWidth={orbit.unitsPerPixel}
            strokeLinecap="round"
            fill="none"
            opacity="0"
          />
          <path ref={headRef} d={dropShape} fill="currentColor" opacity="0" />
        </>
      )}
    </svg>
  );
}
