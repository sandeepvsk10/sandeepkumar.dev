import { useId, type ReactNode } from "react";

const reveal = "transition-[clip-path] ease-out motion-reduce:transition-none";

/**
 * Highlights a word with a hand-made marker scribble and a sketched loop when the header intro (`group/intro`) is hovered.
 * Both marks are an absolutely positioned overlay, so the word's spacing and wrapping never change.
 */
export function DesignMarker({ children }: { children: ReactNode }) {
  const id = useId();
  const brush = `${id}-brush`;
  const pen = `${id}-pen`;

  return (
    <span className="relative isolate transition-colors duration-300 group-hover/intro:text-zinc-900 motion-reduce:transition-none">
      <svg
        aria-hidden="true"
        viewBox="0 0 110 50"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-x-[0.85em] -inset-y-[0.75em] -z-10 overflow-visible"
      >
        <defs>
          {/* Horizontal grain roughens the marker edges into dry, uneven bristle lines. */}
          <filter id={brush} x="-10%" y="-40%" width="120%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035 0.6" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* A slight tremor so the loop reads as drawn by hand rather than plotted. */}
          <filter id={pen} x="-10%" y="-20%" width="120%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="1" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <g filter={`url(#${brush})`} fill="none" strokeLinecap="butt" stroke="#dcf763">
          {/* First pass swipes left to right, slightly uphill. */}
          <g className={`[clip-path:inset(0_100%_0_0)] duration-300 group-hover/intro:[clip-path:inset(0_0_0_0)] ${reveal}`}>
            <path d="M14 28C34 26 66 23 97 21" strokeWidth="18" opacity=".92" />
          </g>
          {/* A thinner return pass overlaps the first, leaving a darker band where they cross. */}
          <g className={`[clip-path:inset(0_0_0_100%)] duration-300 group-hover/intro:[clip-path:inset(0_0_0_0)] group-hover/intro:delay-200 ${reveal}`}>
            <path d="M95 31C70 33 42 34 17 34" strokeWidth="11" opacity=".75" />
          </g>
        </g>

        {/* Loose loop that overshoots its start, drawn once the marker is down. Hand-drawn strokes stay
            transparent until they draw: a fully dashed-out round-capped stroke still paints a dot. */}
        <path
          d="M64 7C90 5 107 13 105 25 103 38 73 46 46 44 19 42 4 34 6 22 8 11 31 5 58 6 80 7 96 11 103 19"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          pathLength="1"
          strokeDasharray="1 1"
          filter={`url(#${pen})`}
          className="text-foreground opacity-0 [stroke-dashoffset:1] transition-[stroke-dashoffset,opacity] group-hover/intro:opacity-100 duration-600 ease-in-out group-hover/intro:[stroke-dashoffset:0] group-hover/intro:delay-400 motion-reduce:transition-none"
        />
      </svg>

      {/* A scribbled aside above the loop, with a curly arrow drawn from it down onto the word. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[calc(100%+0.2em)] left-[calc(100%+0.2em)] flex items-start"
      >
        <svg viewBox="0 0 60 36" className="h-[1.6em] w-[2.7em] shrink-0 overflow-visible text-foreground">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            filter={`url(#${pen})`}
          >
            <path
              d="M57 3C46 2 36 5 31 11 27 16 33 21 37 16 41 11 33 7 26 10 16 14 9 22 6 33"
              pathLength="1"
              strokeDasharray="1 1"
              className="opacity-0 [stroke-dashoffset:1] transition-[stroke-dashoffset,opacity] group-hover/intro:opacity-100 duration-500 ease-in-out group-hover/intro:[stroke-dashoffset:0] group-hover/intro:delay-1250 motion-reduce:transition-none"
            />
            <path
              d="M1.5 27.5 6 33 11.5 29"
              pathLength="1"
              strokeDasharray="1 1"
              className="opacity-0 [stroke-dashoffset:1] transition-[stroke-dashoffset,opacity] group-hover/intro:opacity-100 duration-200 ease-out group-hover/intro:[stroke-dashoffset:0] group-hover/intro:delay-1700 motion-reduce:transition-none"
            />
          </g>
        </svg>
        <span className="relative isolate -mt-[0.45em] ml-[0.1em] whitespace-nowrap px-[0.7em] py-[0.25em] text-[0.8em] font-medium leading-none text-background opacity-0 transition-opacity duration-150 group-hover/intro:opacity-100 group-hover/intro:delay-1000 motion-reduce:transition-none">
          <svg
            viewBox="0 0 100 30"
            preserveAspectRatio="none"
            className="absolute inset-0 -z-10 size-full overflow-visible text-foreground"
          >
            {/* Dry-brush swipe behind the aside, revealed left to right. */}
            <path
              d="M4 8C28 4 70 3 96 6L98 12 94 16 99 21 95 26C66 28 34 28 6 26L2 20 6 15 1 11Z"
              fill="currentColor"
              filter={`url(#${brush})`}
              className="[clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-300 ease-out group-hover/intro:[clip-path:inset(0_0_0_0)] group-hover/intro:delay-1000 motion-reduce:transition-none"
            />
          </svg>
          holy larp
        </span>
      </span>
      {children}
    </span>
  );
}
