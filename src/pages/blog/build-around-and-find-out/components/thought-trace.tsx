import { useEffect, useRef, useState } from "react";
import { Add01Icon, ArrowDown01Icon, ArrowUp02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import "./thought-trace.css";

const messages = [
  "read code.",
  "don't read code.",
  "write it by hand.",
  "use agents.",
  "the tools keep changing.",
  "but don't lose touch with the software.",
] as const;

export function ThoughtTrace() {
  const container = useRef<HTMLElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (motion.matches) {
        setVisibleCount(messages.length);
        return;
      }
      messages.forEach((_, index) => {
        timers.push(setTimeout(() => setVisibleCount(index + 1), index * 1000));
      });
    }, { threshold: 0.2 });

    const finish = () => {
      if (motion.matches) {
        timers.forEach(clearTimeout);
        setVisibleCount(messages.length);
      }
    };
    observer.observe(element);
    motion.addEventListener("change", finish);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      motion.removeEventListener("change", finish);
    };
  }, []);

  return (
    <aside
      ref={container}
      aria-label="Thoughts on coding as the tools change"
      className="ml-auto w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50/75 shadow-lg backdrop-blur-sm"
    >
      <div className="flex justify-end px-4 pt-3">
        <p className="rounded-2xl rounded-br-sm bg-black px-3 py-1.5 text-[11px] leading-[17px] text-white">
          I am stuck
        </p>
      </div>
      <details className="mx-4 mt-3 text-[11px] leading-[17px] text-zinc-500">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 [&::-webkit-details-marker]:hidden">
          <span
            aria-hidden="true"
            className="thought-pulse size-2 shrink-0 rounded-full bg-black"
          />
          <span className="text-xs">Thinking</span>
          <HugeiconsIcon icon={ArrowDown01Icon} size={12} strokeWidth={1.7} aria-hidden="true" />
        </summary>
        <p className="mt-2 border-l border-zinc-300 pl-3 text-zinc-500">
          The advice keeps changing. Start small, try the tools, and stay close
          to what the software actually does.
        </p>
      </details>
      <ol role="log" aria-live="polite" aria-label="Thought trace" className="flex min-h-40 flex-col gap-[5px] px-4 py-3">
        {messages.slice(0, visibleCount).map((message, index) => (
          <li key={message} className="text-[11px] leading-[17px]">
            <p className={index === messages.length - 1 ? "font-medium text-zinc-950" : "text-zinc-600"}>
              {message}
            </p>
          </li>
        ))}
      </ol>
      <fieldset disabled aria-label="Message composer illustration" className="m-3 mt-0 min-w-0">
        <InputGroup className="rounded-[calc(1.5rem-0.75rem-1px)] border-zinc-300/60 bg-white/60 p-3">
        <InputGroupTextarea
          aria-label="Message"
          placeholder="Keep building…"
          rows={1}
          className="block min-h-5 w-full resize-none border-0 bg-transparent p-0 text-xs leading-5 text-zinc-600 placeholder:text-zinc-400 disabled:cursor-default disabled:opacity-100 md:text-xs"
        />
        <InputGroupAddon align="block-end" className="mt-2 justify-between p-0">
          <InputGroupButton disabled size="icon-sm" variant="outline" aria-label="Attach files" className="size-7 rounded-full border-zinc-300/70 bg-transparent text-zinc-500 disabled:opacity-100">
            <HugeiconsIcon icon={Add01Icon} size={15} strokeWidth={1.7} aria-hidden="true" />
          </InputGroupButton>
          <InputGroupButton disabled size="sm" variant="outline" className="ml-auto mr-2 h-7 gap-2 rounded-full border-zinc-300/70 bg-transparent px-3 text-[11px] font-normal text-zinc-500 disabled:opacity-100" aria-label="Model: GPT-6 Sol">
            GPT-6 Sol
            <HugeiconsIcon icon={ArrowDown01Icon} size={13} strokeWidth={1.7} aria-hidden="true" />
          </InputGroupButton>
          <InputGroupButton disabled size="icon-sm" variant="default" aria-label="Send message" className="size-7 rounded-full bg-zinc-800 text-white disabled:opacity-100">
            <HugeiconsIcon icon={ArrowUp02Icon} size={15} strokeWidth={1.7} aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
        </InputGroup>
      </fieldset>
    </aside>
  );
}
