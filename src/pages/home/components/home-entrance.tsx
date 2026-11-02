import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { publicAsset } from "@/lib/public-asset";
import "./home-entrance.css";

const LiquidGlassLogo = lazy(() => import("@/components/liquid-glass-logo").then((module) => ({
  default: module.LiquidGlassLogo,
})));

class EntranceBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function HomeEntrance({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<"playing" | "fading" | "finished">("playing");
  const hold = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fade = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const reveal = useCallback(() => {
    if (hold.current !== undefined) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    hold.current = setTimeout(() => {
      setPhase("fading");
      fade.current = setTimeout(() => setPhase("finished"), reduced ? 0 : 400);
    }, reduced ? 150 : 250);
  }, []);

  const finished = phase === "finished";
  useEffect(() => {
    if (finished) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Fail open if a lazy chunk, GPU context, or image never finishes loading.
    const timeout = setTimeout(() => setPhase("finished"), 8000);
    return () => {
      clearTimeout(timeout);
      clearTimeout(hold.current);
      clearTimeout(fade.current);
      hold.current = undefined;
      fade.current = undefined;
      document.body.style.overflow = previousOverflow;
    };
  }, [finished]);

  if (finished) return children;

  return (
    <div className="home-entrance fixed inset-0 z-50 grid place-items-center bg-white" data-phase={phase} aria-label="Loading homepage">
      <EntranceBoundary onError={reveal}>
      <Suspense fallback={null}>
        <LiquidGlassLogo
          logo={publicAsset("/sk.svg")}
          mark=""
          text=""
          ending="logo"
          theme="light"
          tileColor="#fefeff"
          depth={2.9}
          dispersion={0.65}
          background="#ffffff"
          logoColor="#000000"
          finalLogoScale={1}
          loop={false}
          style={{ height: 480 }}
          className="home-entrance-logo"
          onComplete={reveal}
          aria-label="Sandeep Kumar .sk logo"
        />
      </Suspense>
      </EntranceBoundary>
    </div>
  );
}
