import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

/**
 * Brings its content up from below the viewport with a blur-to-focus fade, matching the
 * entrance of the home page masonry tiles. Skipped on phones, hidden tabs and reduced motion.
 */
export function RiseIn({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || document.hidden) return;
    if (window.matchMedia("(max-width: 639px), (prefers-reduced-motion: reduce)").matches) return;

    // Start just past the bottom edge of the viewport, as the masonry tiles do.
    const offset = window.innerHeight + 200 - element.getBoundingClientRect().top;
    const tween = gsap.fromTo(
      element,
      { opacity: 0, y: Math.max(offset, 100), filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out", delay, clearProps: "transform,filter,opacity" },
    );
    return () => {
      tween.kill();
      gsap.set(element, { clearProps: "transform,filter,opacity" });
    };
  }, [delay]);

  return <div ref={ref} className={className}>{children}</div>;
}
