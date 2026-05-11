"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
} from "react";

const POOL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function randomChar() {
  return POOL[Math.floor(Math.random() * POOL.length)]!;
}

type TextScrambleOwnProps = {
  children: string;
  speed?: number;
  trigger?: boolean;
  onHoverStart?: () => void;
  onScrambleComplete?: () => void;
};

type TextScrambleProps<T extends ElementType = "span"> = TextScrambleOwnProps &
  Omit<ComponentPropsWithoutRef<T>, keyof TextScrambleOwnProps | "children"> & {
    as?: T;
  };

export function TextScramble<T extends ElementType = "span">({
  children: text,
  className,
  as,
  speed = 0.03,
  trigger = false,
  onHoverStart,
  onScrambleComplete,
  ...rest
}: TextScrambleProps<T>) {
  const Component = (as ?? "span") as ElementType;
  const [display, setDisplay] = useState(text);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const completeRef = useRef(onScrambleComplete);
  completeRef.current = onScrambleComplete;

  useEffect(() => {
    if (!trigger) {
      setDisplay(text);
      return;
    }

    const len = text.length;
    const totalIterations = Math.max(len * 5, 8);
    let frame = 0;

    const tick = () => {
      const progress = Math.min(1, frame / totalIterations);
      const revealed = Math.floor(progress * len);

      let out = "";
      for (let i = 0; i < len; i++) {
        const ch = text[i]!;
        if (i < revealed) out += ch;
        else if (ch === " " || ch === "—" || ch === "-") out += ch;
        else if (!/[a-zA-Z0-9]/.test(ch)) out += ch;
        else out += randomChar();
      }

      setDisplay(out);
      frame++;

      if (revealed >= len) {
        setDisplay(text);
        completeRef.current?.();
        return;
      }

      const delayMs = Math.max(1, speed * 1000);
      timeoutRef.current = setTimeout(tick, delayMs);
    };

    tick();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [trigger, text, speed]);

  useEffect(() => {
    if (!trigger) setDisplay(text);
  }, [text, trigger]);

  return (
    <Component
      className={className}
      onMouseEnter={() => onHoverStart?.()}
      {...rest}
    >
      {display}
    </Component>
  );
}
