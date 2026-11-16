// Adapted from the React Bits BlurText source supplied for this project.
import { domAnimation, LazyMotion, m, MotionConfig, useReducedMotion, type Easing, type MotionStyle, type TargetAndTransition, type Transition } from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import "./blur-text.css";

type Snapshot = Record<string, number | string>;
type Direction = "top" | "bottom" | "left" | "right";
type Effect = "blur" | "zoom" | "tilt" | "focus" | "drift";
type Stagger = "start" | "center" | "end" | "random";
type Trigger = "view" | "load" | "hover" | "click";
type Phase = "from" | "in" | "rest" | "out";

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: Direction;
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Snapshot;
  animationTo?: Snapshot[];
  easing?: Easing | Easing[];
  onAnimationComplete?: () => void;
  stepDuration?: number;
  blur?: number;
  distance?: number;
  effect?: Effect;
  staggerFrom?: Stagger;
  staggerByLine?: boolean;
  trigger?: Trigger;
  loop?: boolean;
  loopDelay?: number;
  color?: string;
  fromColor?: string;
  focusOnHover?: boolean;
  as?: "p" | "span";
}

interface EffectSettings {
  from: Snapshot;
  steps: Snapshot[];
  exit: Snapshot;
  times: number[];
  fade: Easing;
  bounce: number | null;
  settle: number;
  exitEase: Easing;
  origin?: MotionStyle;
}

const AXES: Record<Direction, ["x" | "y", number]> = {
  top: ["y", -1], bottom: ["y", 1], left: ["x", -1], right: ["x", 1],
};
const EASE_OUT: Easing = [0.33, 1, 0.68, 1];
const EASE_IN_OUT: Easing = [0.65, 0, 0.35, 1];
const EASE_IN: Easing = [0.55, 0, 0.9, 0.45];
const CSS_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MOVE_KEYS = ["x", "y", "scale", "rotateX", "rotateY", "skewX"] as const;
const INSTANT = { duration: 0 };
const blurTo = (px: number) => `blur(${Math.max(0, px)}px)`;

function buildEffect(effect: Effect, direction: Direction, blur: number, distance: number): EffectSettings {
  const [axis, sign] = AXES[direction];
  const b = Math.max(0, blur);
  const d = distance;
  if (effect === "zoom") return {
    from: { filter: blurTo(b * 1.2), opacity: 0, scale: 1.4, [axis]: sign * d * 0.35 },
    steps: [
      { filter: blurTo(b * 0.2), opacity: 0.9, scale: 0.97, [axis]: -sign * d * 0.03 },
      { filter: blurTo(0), opacity: 1, scale: 1, [axis]: 0 },
    ],
    exit: { filter: blurTo(b), opacity: 0, scale: 0.82, [axis]: -sign * d * 0.2 },
    times: [0, 0.6, 1], fade: EASE_OUT, bounce: 0.25, settle: 0.5, exitEase: EASE_IN,
  };
  if (effect === "tilt") {
    const rotate = axis === "y" ? "rotateX" : "rotateY";
    const lean = axis === "y" ? -sign : sign;
    return {
      from: { filter: blurTo(b), opacity: 0, [rotate]: lean * 55, [axis]: sign * d * 0.5, transformPerspective: 600 },
      steps: [
        { filter: blurTo(b * 0.15), opacity: 0.95, [rotate]: -lean * 8, [axis]: -sign * d * 0.04, transformPerspective: 600 },
        { filter: blurTo(0), opacity: 1, [rotate]: 0, [axis]: 0, transformPerspective: 600 },
      ],
      exit: { filter: blurTo(b), opacity: 0, [rotate]: -lean * 40, [axis]: -sign * d * 0.3, transformPerspective: 600 },
      times: [0, 0.6, 1], fade: EASE_OUT, bounce: 0.3, settle: 0.8, exitEase: EASE_IN,
      origin: { originX: axis === "x" ? (sign < 0 ? 0 : 1) : 0.5, originY: axis === "y" ? (sign < 0 ? 0 : 1) : 0.5 },
    };
  }
  if (effect === "focus") {
    const soft = { filter: blurTo(b * 1.4), opacity: 0.32, scale: 1.12 };
    return {
      from: soft,
      steps: [{ filter: blurTo(b * 0.1), opacity: 0.95, scale: 0.995 }, { filter: blurTo(0), opacity: 1, scale: 1 }],
      exit: soft, times: [0, 0.72, 1], fade: EASE_IN_OUT, bounce: null, settle: 1, exitEase: EASE_IN_OUT,
    };
  }
  if (effect === "drift") {
    const h = direction === "right" ? 1 : -1;
    const v = axis === "y" ? sign : 0;
    return {
      from: { filter: blurTo(b), opacity: 0, x: h * d * 1.6, y: v * d * 0.3, skewX: h * 28 },
      steps: [
        { filter: blurTo(b * 0.15), opacity: 0.95, x: -h * d * 0.06, y: 0, skewX: -h * 7 },
        { filter: blurTo(0), opacity: 1, x: 0, y: 0, skewX: 0 },
      ],
      exit: { filter: blurTo(b), opacity: 0, x: -h * d * 1.2, y: -v * d * 0.2, skewX: h * 20 },
      times: [0, 0.62, 1], fade: EASE_OUT, bounce: 0.3, settle: 0.55, exitEase: EASE_IN,
    };
  }
  return {
    from: { filter: blurTo(b), opacity: 0, [axis]: sign * d },
    steps: [
      { filter: blurTo(b / 2), opacity: 0.5, [axis]: (-sign * d) / 10 },
      { filter: blurTo(0), opacity: 1, [axis]: 0 },
    ],
    exit: { filter: blurTo(b), opacity: 0, [axis]: -sign * d * 0.6 },
    times: [0, 0.5, 1], fade: "linear", bounce: 0.35, settle: 0.5, exitEase: EASE_IN,
  };
}

function buildKeyframes(from: Snapshot, steps: Snapshot[]): TargetAndTransition {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(step => Object.keys(step))]);
  return Object.fromEntries([...keys].map(key => [key, [from[key], ...steps.map(step => step[key])]]));
}

function buildRanks(count: number, staggerFrom: Stagger, seedText: string) {
  const ranks = Array.from({ length: count }, (_, i) => i);
  if (staggerFrom === "end") return ranks.map(i => count - 1 - i);
  if (staggerFrom === "center") {
    const mid = (count - 1) / 2;
    const offset = count % 2 === 0 ? 0.5 : 0;
    return ranks.map(i => Math.abs(i - mid) - offset);
  }
  if (staggerFrom === "random") {
    let seed = 2166136261;
    for (let i = 0; i < seedText.length; i++) seed = Math.imul(seed ^ seedText.charCodeAt(i), 16777619) >>> 0;
    const next = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const order = ranks.slice();
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    order.forEach((piece, rank) => { ranks[piece] = rank; });
  }
  return ranks;
}

const startPhase = (trigger: Trigger): Phase =>
  trigger === "load" ? "in" : trigger === "hover" || trigger === "click" ? "rest" : "from";

export default function BlurText({
  text = "", delay = 200, className = "", animateBy = "words", direction = "top",
  threshold = 0.1, rootMargin = "0px", animationFrom, animationTo, easing,
  onAnimationComplete, stepDuration = 0.35, blur = 10, distance = 50, effect = "blur",
  staggerFrom = "start", staggerByLine = false, trigger = "view", loop = false, loopDelay = 2,
  color, fromColor, focusOnHover = false, as: Tag = "p",
}: BlurTextProps) {
  const ref = useRef<HTMLParagraphElement & HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(() => startPhase(trigger));
  const [firstPhase] = useState(() => startPhase(trigger));
  const [focusWord, setFocusWord] = useState(-1);
  const settledRef = useRef(phase === "rest");
  const completeRef = useRef(onAnimationComplete);
  useEffect(() => { completeRef.current = onAnimationComplete; }, [onAnimationComplete]);

  const fx = useMemo(() => buildEffect(effect, direction, blur, distance), [effect, direction, blur, distance]);
  const custom = Boolean(animationFrom || animationTo || easing);
  const fromSnapshot = animationFrom ?? fx.from;
  const toSnapshots = animationTo?.length ? animationTo : fx.steps;
  const exitSnapshot = animationFrom ?? fx.exit;
  const restSnapshot = toSnapshots[toSnapshots.length - 1];
  const animateKeyframes = useMemo(
    () => buildKeyframes(fromSnapshot, custom ? toSnapshots : [restSnapshot]),
    [fromSnapshot, toSnapshots, restSnapshot, custom],
  );
  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = animationTo ? Array.from({ length: stepCount }, (_, i) => i / (stepCount - 1)) : fx.times;
  const stagger = Math.max(0, delay) / 1000;
  const exitDuration = stepDuration * 1.3;
  const exitStagger = stagger * 0.4;
  const words = useMemo(() => text.split(" "), [text]);
  const pieces = useMemo(() => {
    const list: { word: number; content: string; key: string }[] = [];
    words.forEach((word, w) => {
      const isLast = w === words.length - 1;
      if (animateBy === "words") {
        list.push({ word: w, content: isLast ? word : `${word}\u00A0`, key: `word-${w}` });
        return;
      }
      Array.from(word).forEach((char, c) => list.push({ word: w, content: char, key: `char-${w}-${c}` }));
      if (!isLast) list.push({ word: w, content: "\u00A0", key: `space-${w}` });
    });
    return list;
  }, [words, animateBy]);
  const groups = useMemo(() => {
    const list = words.map(() => [] as number[]);
    pieces.forEach((piece, index) => list[piece.word].push(index));
    return list;
  }, [words, pieces]);
  const [lineLayout, setLineLayout] = useState<{ pieces: typeof pieces; ranks: number[] } | null>(null);
  const lineRanks = lineLayout?.pieces === pieces ? lineLayout.ranks : null;

  useLayoutEffect(() => {
    const element = ref.current;
    if (!staggerByLine || reducedMotion || !element) return;
    let active = true;

    const measure = () => {
      if (!active) return;
      // Layout offsets exclude animated transforms, so wrapping can be measured
      // both before the reveal and during a resize without tracking moving text.
      const wordElements = element.querySelectorAll<HTMLElement>(".blur-text-word");
      const lines = new Map<number, number[]>();
      wordElements.forEach((word, index) => {
        const top = word.offsetTop;
        const line = lines.get(top) ?? [];
        line.push(...groups[index]);
        lines.set(top, line);
      });
      const nextRanks = new Array<number>(pieces.length);
      lines.forEach((indices, top) => {
        const localRanks = buildRanks(indices.length, staggerFrom, `${text}-${top}`);
        indices.forEach((piece, index) => { nextRanks[piece] = localRanks[index]; });
      });
      setLineLayout(previous =>
        previous?.pieces === pieces && previous.ranks.every((rank, index) => rank === nextRanks[index])
          ? previous : { pieces, ranks: nextRanks },
      );
    };

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    // Font changes can move words between lines even if the box keeps its size.
    void document.fonts.ready.then(measure);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      active = false;
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [staggerByLine, reducedMotion, pieces, groups, staggerFrom, text]);

  const ranks = useMemo(
    () => staggerByLine && lineRanks ? lineRanks : buildRanks(pieces.length, staggerFrom, text),
    [staggerByLine, lineRanks, pieces.length, staggerFrom, text],
  );
  const maxRank = ranks.reduce((max, rank) => Math.max(max, rank), 0);
  const inTotal = (totalDuration * (custom ? 1 : Math.max(1, fx.settle * 2.2)) + maxRank * stagger) * 1000;
  const outTotal = (exitDuration + maxRank * exitStagger) * 1000;

  useEffect(() => {
    if (phase !== "from" || reducedMotion) return;
    if (staggerByLine && !lineRanks) return;
    if (trigger !== "view") {
      const timer = window.setTimeout(() => setPhase(startPhase(trigger)), 0);
      return () => window.clearTimeout(timer);
    }
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPhase(current => current === "from" ? "in" : current);
        observer.disconnect();
      }
    }, { threshold, rootMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, [phase, trigger, threshold, rootMargin, reducedMotion, staggerByLine, lineRanks]);

  useEffect(() => {
    if (reducedMotion) {
      completeRef.current?.();
      return;
    }
    let timer = 0;
    if (phase === "in") {
      ref.current?.removeAttribute("data-settled");
      settledRef.current = false;
      timer = window.setTimeout(() => {
        settledRef.current = true;
        ref.current?.setAttribute("data-settled", "true");
        completeRef.current?.();
        if (loop) timer = window.setTimeout(() => setPhase("out"), Math.max(0, loopDelay) * 1000);
      }, inTotal);
    } else if (phase === "rest") {
      settledRef.current = true;
      ref.current?.setAttribute("data-settled", "true");
      if (loop) timer = window.setTimeout(() => setPhase("out"), Math.max(0, loopDelay) * 1000);
    } else if (phase === "out") {
      ref.current?.removeAttribute("data-settled");
      settledRef.current = false;
      timer = window.setTimeout(() => setPhase("in"), outTotal);
    }
    return () => window.clearTimeout(timer);
  }, [phase, loop, loopDelay, inTotal, outTotal, reducedMotion]);

  const replay = () => {
    if (phase !== "out" && phase !== "from") setPhase("out");
  };
  const handleEnter = () => { if (settledRef.current) replay(); };
  const inTransition = (rank: number): Transition => {
    const delayed = rank * stagger;
    if (custom) return { duration: totalDuration, times, delay: delayed, ease: easing ?? "linear" };
    const transition: Transition = { duration: totalDuration, delay: delayed, ease: fx.fade };
    if (fx.bounce === null) return transition;
    const move: Transition = { type: "spring", visualDuration: totalDuration * fx.settle, bounce: fx.bounce, delay: delayed };
    const movement = Object.fromEntries(
      MOVE_KEYS.filter(key => key in fromSnapshot).map(key => [key, move]),
    );
    return { ...transition, ...movement };
  };
  const target = phase === "in" ? animateKeyframes : phase === "out" ? exitSnapshot : phase === "rest" ? restSnapshot : fromSnapshot;
  const tinted = Boolean(fromColor) && (phase === "from" || phase === "out");
  const dim = Math.min(6, Math.max(2, blur * 0.3));

  if (reducedMotion) return <Tag className={className} style={{ color }}>{text}</Tag>;

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
      <Tag
        ref={ref}
        className={`blur-text ${className}`}
        style={{ color, cursor: trigger === "click" ? "pointer" : undefined }}
        onPointerEnter={trigger === "hover" ? handleEnter : undefined}
        onClick={trigger === "click" ? replay : undefined}
      >
        <span className="sr-only">{text}</span>
        {groups.map((indices, w) => {
          const dimmed = focusOnHover && focusWord !== -1 && focusWord !== w;
          return (
            <span
              key={`word-${w}`}
              className="blur-text-word"
              style={focusOnHover ? {
                filter: dimmed ? `blur(${dim}px)` : "blur(0px)", opacity: dimmed ? 0.3 : 1,
                transition: `filter 0.45s ${CSS_EASE}, opacity 0.45s ${CSS_EASE}`,
              } : undefined}
              onPointerEnter={focusOnHover ? () => setFocusWord(w) : undefined}
              onPointerLeave={focusOnHover ? () => setFocusWord(-1) : undefined}
            >
              {indices.map(index => {
                const piece = pieces[index];
                const rank = ranks[index];
                const transition: Transition = phase === "in" ? inTransition(rank) : phase === "out"
                  ? { duration: exitDuration, ease: fx.exitEase, delay: rank * exitStagger } : INSTANT;
                const style: MotionStyle = {
                  ...(custom ? {} : fx.origin),
                  ...(fromColor ? {
                    color: tinted ? fromColor : undefined,
                    transition: phase === "in" ? `color ${totalDuration * 0.9}s ${CSS_EASE} ${rank * stagger}s`
                      : phase === "out" ? `color ${exitDuration}s ${CSS_EASE} ${rank * exitStagger}s` : "none",
                  } : {}),
                };
                return (
                  <m.span
                    aria-hidden="true"
                    key={piece.key}
                    className="blur-text-piece"
                    style={style}
                    initial={firstPhase === "rest" ? false : fromSnapshot}
                    animate={target}
                    transition={transition}
                  >
                    {piece.content}
                  </m.span>
                );
              })}
            </span>
          );
        })}
      </Tag>
      </LazyMotion>
    </MotionConfig>
  );
}
