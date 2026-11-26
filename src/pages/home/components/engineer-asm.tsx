import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { AppleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { PRINTF_ASM, PRINTF_TARGET } from "../constants/printf-asm";
import "./engineer-asm.css";

const lineInterval = 550;
const startDelay = 260;
// The opening M4 badge lingers before the instructions start rolling.
const targetHold = 1400;
const baseFontEm = 0.8;
// Each crossfade spans most of an instruction's turn, so one hands over to the next without a gap.
const fadeTime = 450;

// The run opens on the chip and target, like the M4 badge, then executes the instructions.
const SEQUENCE = [PRINTF_TARGET, ...PRINTF_ASM];

/**
 * A fixed-width, squared M4-style chip for the mnemonic followed by its operands, all in monospace.
 * The opening target line is the M4 badge (green glow, solid Apple logo) in the site's sans; instructions use
 * a soft red pill in the typewriter face.
 */
function AsmLine({ op, args }: { op: string; args: string }) {
  const target = op === PRINTF_TARGET[0];
  // Special Elite rides high in its line box, so typewriter text drops to the optical centre.
  const typeOffset = target ? undefined : "relative top-[0.2em]";

  return (
    <span
      className={`${target ? "font-sans" : "engineer-asm-line"} inline-flex items-center gap-[0.5ch] whitespace-pre text-foreground`}
    >
      <span
        className={`${target ? "engineer-asm-chip font-semibold" : "engineer-asm-op font-normal"} inline-flex w-[5ch] items-center justify-center gap-[0.12em] rounded-[0.22em] pt-[0.24em] pb-[0.3em] text-[1.1em] leading-none`}
      >
        {target && (
          <HugeiconsIcon
            icon={AppleIcon}
            size="1em"
            fill="currentColor"
            strokeWidth={1}
            aria-hidden="true"
            className="shrink-0"
          />
        )}
        <span className={typeOffset}>{op}</span>
      </span>
      <span className={typeOffset}>{args}</span>
    </span>
  );
}

/**
 * While `active`, steps, in the words' place, through the ARM64 instructions
 * that print them. The instructions play in the words' own box, so the bio's spacing and wrapping never
 * change. Remount (e.g. via `key`) to restart from the beginning.
 */
export function EngineerAsm({ active, children }: { active: boolean; children: ReactNode }) {
  // Instructions executed so far; the run holds on the final RET while still hovered.
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active || step >= SEQUENCE.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setStep(SEQUENCE.length));
      return () => cancelAnimationFrame(frame);
    }
    // A brief pause after hover, hold on the M4 badge, then execute one instruction per tick.
    const delay = step === 0 ? startDelay : step === 1 ? targetHold : lineInterval;
    const timer = window.setTimeout(() => setStep(step + 1), delay);
    return () => window.clearTimeout(timer);
  }, [active, step]);

  // While hovered the instructions take the words' place, ending on RET; the words return on leave.
  const instruction = active && step >= 1 && step <= SEQUENCE.length ? SEQUENCE[step - 1] : null;
  // The instruction before it lingers briefly, fading out underneath the new one.
  const previous = active && step >= 2 ? SEQUENCE[step - 2] : null;

  // One font size for every instruction: the largest that still fits the widest one in the words' width,
  // so each block has the same shape and none spill into ", Databases".
  const wordsRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [fontEm, setFontEm] = useState(baseFontEm);
  useLayoutEffect(() => {
    const words = wordsRef.current;
    const measure = measureRef.current;
    if (!words || !measure) return;
    const fit = () => {
      const available = words.getBoundingClientRect().width;
      const needed = measure.getBoundingClientRect().width;
      if (available && needed) setFontEm(Math.min(baseFontEm, baseFontEm * available / needed));
    };
    fit();
    // Re-fit when either width changes, including when the typewriter font finishes loading.
    const observer = new ResizeObserver(fit);
    observer.observe(words);
    observer.observe(measure);
    document.fonts.addEventListener("loadingdone", fit);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", fit);
    };
  }, []);

  // A thin rule fills whatever width the current instruction leaves free, anchored at the right edge:
  // it draws in right to left, then glides shorter or longer as instructions change length.
  const instructionRef = useRef<HTMLSpanElement>(null);
  // Shrinking is quick so the rule never crosses a longer incoming instruction; growing glides.
  const [rule, setRule] = useState({ width: 0, shrinking: false });
  useLayoutEffect(() => {
    const words = wordsRef.current;
    const line = instructionRef.current;
    if (!instruction || !words || !line) {
      setRule((current) => ({ width: 0, shrinking: current.width > 0 }));
      return;
    }
    const gap = parseFloat(getComputedStyle(line).fontSize) * 0.6;
    const width = Math.max(0, words.getBoundingClientRect().width - line.getBoundingClientRect().width - gap);
    setRule((current) => ({ width, shrinking: width < current.width }));
  }, [instruction, fontEm]);

  return (
    // A small gap before the following comma; a margin rather than a space so the comma can't wrap away.
    <span className="relative mr-[0.25em]" style={{ "--asm-fade": `${fadeTime}ms` } as CSSProperties}>
      <span ref={wordsRef} className="engineer-asm-words" data-hidden={instruction ? "" : undefined}>
        {children}
      </span>
      {/* Invisible stack of every line at the base size; its width is the widest one. The typewriter
          face isn't strictly monospaced, so character counts can't pick the widest line. */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="invisible absolute left-0 top-0 flex w-max flex-col items-start"
        style={{ fontSize: `${baseFontEm}em` }}
      >
        {SEQUENCE.map(([op, args]) => (
          <AsmLine key={op + args} op={op} args={args} />
        ))}
      </span>
      {previous && (
        <span
          key={step - 1}
          aria-hidden="true"
          className="engineer-asm-out pointer-events-none absolute inset-y-0 left-0 flex items-center"
          style={{ fontSize: `${fontEm}em` }}
        >
          <AsmLine op={previous[0]} args={previous[1]} />
        </span>
      )}
      {instruction && (
        <span
          key={step}
          ref={instructionRef}
          aria-hidden="true"
          className="engineer-asm-in pointer-events-none absolute inset-y-0 left-0 flex items-center"
          style={{ fontSize: `${fontEm}em` }}
        >
          <AsmLine op={instruction[0]} args={instruction[1]} />
        </span>
      )}
      <span
        aria-hidden="true"
        className="engineer-asm-rule pointer-events-none absolute right-0 top-1/2 h-px bg-foreground/35"
        style={{ width: rule.width, transitionDuration: rule.shrinking ? "160ms" : undefined }}
      />
    </span>
  );
}
