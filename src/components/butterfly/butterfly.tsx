import { useId, useLayoutEffect, useRef, useState } from "react";

import { flightFrames, offscreenPose, pickLanding, poseFrame, projectPose, randomBetween } from "./butterfly-flight";
import type { ButterflyPose } from "./butterfly-flight";
import "./butterfly.css";

type FlightPhase = "preparing" | "arriving" | "landed" | "departing" | "away";

type ButterflyProps = {
  landingClassName?: string;
  perch?: ButterflyPose;
  onLand?: () => void;
  color?: "lavender" | "gold";
};

const palettes = {
  lavender: { wings: ["#b095d5", "#c6ade8", "#dcc8f3", "#eee4fa"], vein: "#f8eaff", antenna: "#b9a2d7", body: "#ab91cc" },
  gold: { wings: ["#ab792d", "#d5a349", "#edcb7f", "#f7e7b7"], vein: "#fff4d2", antenna: "#bd944e", body: "#a98139" },
};

export function Butterfly({ landingClassName = "inset-0", perch, onLand, color = "lavender" }: ButterflyProps) {
  const palette = palettes[color];
  const gradientId = useId();
  const wingId = useId();
  const landingAreaRef = useRef<HTMLDivElement>(null);
  const flightLayerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastLanding = useRef<ReturnType<typeof pickLanding> | null>(null);
  const [phase, setPhase] = useState<FlightPhase>("preparing");

  useLayoutEffect(() => {
    const button = buttonRef.current;
    const landingArea = landingAreaRef.current;
    const flightLayer = flightLayerRef.current;
    if (!button || !landingArea || !flightLayer || phase === "landed") return;

    if (phase === "preparing") {
      const frame = window.requestAnimationFrame(() => setPhase("arriving"));
      return () => window.cancelAnimationFrame(frame);
    }

    if (phase === "away") {
      const timer = window.setTimeout(() => setPhase("arriving"), 4000);
      return () => window.clearTimeout(timer);
    }

    const areaBounds = landingArea.getBoundingClientRect();
    const viewport = flightLayer.getBoundingClientRect();
    if (!areaBounds.width || !areaBounds.height || !viewport.width || !viewport.height) return;

    const landing = phase === "arriving"
      ? (perch ? { index: 0, pose: perch } : pickLanding(lastLanding.current?.index ?? -1, areaBounds, viewport))
      : null;

    const edge = offscreenPose();
    const previousPose = lastLanding.current?.pose;
    const start = landing
      ? { ...edge, angle: -edge.angle }
      : previousPose && projectPose(previousPose, areaBounds, viewport);
    const end = landing ? projectPose(landing.pose, areaBounds, viewport) : edge;
    if (!start) return;

    const finishFlight = () => {
      Object.assign(button.style, poseFrame(landing?.pose ?? end));
      if (landing) {
        lastLanding.current = landing;
        onLand?.();
      }
      setPhase(landing ? "landed" : "away");
    };

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || typeof button.animate !== "function") {
      finishFlight();
      return;
    }

    button.style.setProperty("--wingbeat", `${randomBetween(790, 1150)}ms`);
    const aspectRatio = viewport.width / viewport.height;
    const distance = Math.hypot(end.x - start.x, (end.y - start.y) / aspectRatio);
    const duration = landing
      ? Math.min(8500, 4750 + distance * 30 + randomBetween(0, 450))
      : Math.min(5350, 1950 + distance * 25 + randomBetween(0, 350));
    const frames = flightFrames(start, end, Boolean(landing), aspectRatio);
    const flight = button.animate(frames, {
      duration,
      fill: "both",
    });
    flight.onfinish = finishFlight;

    const followLandingSpot = () => {
      if (!landing || !(flight.effect instanceof KeyframeEffect)) return;
      const target = projectPose(landing.pose, landingArea.getBoundingClientRect(), flightLayer.getBoundingClientRect());

      // Keep the flight in viewport coordinates while its destination moves with the page.
      flight.effect.setKeyframes(frames.map((frame, index) => {
        const weight = (index / (frames.length - 1)) ** 2;
        return {
          ...frame,
          left: `calc(${frame.left} + ${(target.x - end.x) * weight}%)`,
          top: `calc(${frame.top} + ${(target.y - end.y) * weight}%)`,
        };
      }));
    };

    function handleMotionChange(event: MediaQueryListEvent) {
      if (event.matches) flight.finish();
    }

    if (landing) {
      window.addEventListener("scroll", followLandingSpot, { passive: true });
      window.addEventListener("resize", followLandingSpot);
    }
    motion.addEventListener("change", handleMotionChange);
    return () => {
      window.removeEventListener("scroll", followLandingSpot);
      window.removeEventListener("resize", followLandingSpot);
      motion.removeEventListener("change", handleMotionChange);
      flight.onfinish = null;
      flight.cancel();
    };
  }, [phase, perch, onLand]);

  function takeOff() {
    setPhase((current) => current === "landed" ? "departing" : current);
  }

  return (
    <div ref={landingAreaRef} className={`pointer-events-none absolute z-20 ${landingClassName}`}>
      <div ref={flightLayerRef} className={phase === "landed" ? "absolute inset-0" : "fixed inset-0 overflow-clip"}>
        <button
          ref={buttonRef}
          type="button"
          aria-label="Send the butterfly flying"
          aria-disabled={phase !== "landed"}
          tabIndex={phase === "landed" ? 0 : -1}
          className="site-butterfly rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600"
          data-phase={phase}
          onPointerMove={(event) => {
            if (event.pointerType === "mouse" || event.pointerType === "pen") takeOff();
          }}
          onClick={takeOff}
        >
          <svg aria-hidden="true" viewBox="0 0 80 66" focusable="false">
            <defs>
              <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="40" y1="39" x2="9" y2="8">
                <stop offset="0" stopColor={palette.wings[0]} />
                <stop offset=".45" stopColor={palette.wings[1]} />
                <stop offset=".78" stopColor={palette.wings[2]} />
                <stop offset="1" stopColor={palette.wings[3]} />
              </linearGradient>
              <g id={wingId} fill={`url(#${gradientId})`}>
                <path d="M40 35 C32 30 10 27 12 40 C12 47 18 48 20 53 C24 63 37 53 40 35 Z" />
                <path d="M40 35 C30 33 13 33 7 23 C3 17 2 5 7 4 C17 1 34 12 40 35 Z" />
                <path
                  d="M38 34 Q25 19 10 9 M29 24 Q20 26 12 22 M38 37 Q30 42 24 52"
                  fill="none"
                  stroke={palette.vein}
                  strokeOpacity=".36"
                  strokeLinecap="round"
                />
              </g>
            </defs>

            <g className="site-butterfly-wing">
              <use href={`#${wingId}`} />
            </g>
            <g className="site-butterfly-wing">
              <use href={`#${wingId}`} transform="translate(80 0) scale(-1 1)" />
            </g>

            <path d="M40 29 C39 23 36 21 33 20 M40 29 C41 23 44 21 47 20" fill="none" stroke={palette.antenna} strokeWidth="1.1" strokeLinecap="round" />
            <path d="M40 28 C37 29 37 42 40 48 C43 42 43 29 40 28 Z" fill={palette.body} />
          </svg>
        </button>
      </div>
    </div>
  );
}
