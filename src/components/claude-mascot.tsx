import { useEffect, useState } from "react";

import flag from "@/assets/claude-mascot/claude-flag.svg";
import confetti from "@/assets/claude-mascot/claude-mascot.svg";
import props from "@/assets/claude-mascot/claude-props.svg";

const versions = [
  { src: confetti, alt: "Claude mascot waving with confetti", duration: 2000, offset: -1 },
  { src: flag, alt: "Claude mascot waving a checkered flag", duration: 1890, offset: -7 },
  { src: props, alt: "Claude mascot dancing and playing with props", duration: 3360, offset: -4 },
] as const;

/** Base size the per-animation offsets were tuned for. */
const BASE_SIZE = 40;

interface ClaudeMascotProps {
  /** Rendered width/height of each animation in pixels. */
  size?: number;
  className?: string;
}

/** Plays the Claude mascot animations one after another on a loop. */
export function ClaudeMascot({ size = BASE_SIZE, className = "h-8 w-10" }: ClaudeMascotProps) {
  const scale = size / BASE_SIZE;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;

    function syncPlayback() {
      clearTimeout(timer);
      if (!motion.matches) {
        timer = setTimeout(() => {
          setIndex((current) => (current + 1) % versions.length);
        }, versions[index].duration);
      }
    }

    syncPlayback();
    motion.addEventListener("change", syncPlayback);
    return () => {
      clearTimeout(timer);
      motion.removeEventListener("change", syncPlayback);
    };
  }, [index]);

  return (
    <span className={`relative inline-block shrink-0 ${className}`}>
      <img
        key={index}
        src={versions[index].src}
        alt={versions[index].alt}
        width={size}
        height={size}
        className="absolute left-1/2 top-1/2 max-w-none object-contain"
        style={{
          width: size,
          height: size,
          transform: `translate(-50%, -50%) translateY(${versions[index].offset * scale}px)`,
        }}
      />
    </span>
  );
}
