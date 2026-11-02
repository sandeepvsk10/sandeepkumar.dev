import { useEffect, useState } from "react";

import confetti from "../assets/claude-mascot.svg";
import flag from "../assets/claude-flag.svg";
import props from "../assets/claude-props.svg";

const versions = [
  { src: confetti, alt: "Claude mascot waving with confetti", duration: 2000, offset: -1 },
  { src: flag, alt: "Claude mascot waving a checkered flag", duration: 1890, offset: -7 },
  { src: props, alt: "Claude mascot dancing and playing with props", duration: 3360, offset: -4 },
] as const;

export function ClaudeMascot() {
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
    <span className="relative inline-block h-8 w-10 shrink-0">
      <img
        key={index}
        src={versions[index].src}
        alt={versions[index].alt}
        width={40}
        height={40}
        className="absolute left-1/2 top-1/2 size-10 object-contain"
        style={{ transform: `translate(-50%, -50%) translateY(${versions[index].offset}px)` }}
      />
    </span>
  );
}
