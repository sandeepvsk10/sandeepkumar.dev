import { useEffect, useRef, useState } from "react";
import { ArrowLeft01Icon, ArrowRight01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { OpenSourceProject } from "../constants/projects";
import { ContributionCard } from "./contribution-card";
import "./project-contributions.css";

export function ProjectContributions({ project }: { project: OpenSourceProject }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canScroll, setCanScroll] = useState({ previous: false, next: false });
  const titleId = `${project.id}-title`;
  const listId = `${project.id}-contributions`;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const update = () => {
      const previous = list.scrollLeft > 1;
      const next = list.scrollLeft + list.clientWidth < list.scrollWidth - 1;
      setCanScroll(current => current.previous === previous && current.next === next
        ? current : { previous, next });
    };
    const observer = new ResizeObserver(update);
    observer.observe(list);
    for (const child of list.children) observer.observe(child);
    list.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      list.removeEventListener("scroll", update);
    };
  }, [project.contributions.length]);

  const scroll = (direction: number) => {
    const list = listRef.current;
    if (!list) return;
    const card = list.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + Number.parseFloat(getComputedStyle(list).columnGap) : list.clientWidth;
    list.scrollBy({
      left: direction * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <section aria-labelledby={titleId} className="project-contributions flex min-w-0 flex-col">
      <div className="mb-6 flex min-w-0 flex-col items-start gap-1">
        <h3 id={titleId} className="text-sm font-normal leading-6 tracking-tight">
          <a href={project.url} className="inline-flex items-center gap-2 rounded-sm hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg border border-border">
              <img src={project.logo} alt="" width={16} height={16} className="size-4" />
            </span>
            {project.name}
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.7} className="text-muted-foreground" aria-hidden="true" />
          </a>
        </h3>
        <p className="max-w-lg text-xs leading-snug text-muted-foreground">{project.description}</p>
      </div>

      <ul
        ref={listRef}
        id={listId}
        aria-label={`${project.name} pull requests`}
        tabIndex={0}
        className="project-contributions-carousel flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain rounded-2xl pb-2 pt-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        {project.contributions.map(contribution => (
          <li key={contribution.number} className="shrink-0 snap-start">
            <ContributionCard contribution={contribution} />
          </li>
        ))}
      </ul>

      <div className="mt-2 flex justify-start">
        <div className="flex gap-1.5">
          <button type="button" aria-label={`Previous ${project.name} contribution`} aria-controls={listId} disabled={!canScroll.previous} onClick={() => scroll(-1)} className="flex size-7 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-accent disabled:text-muted-foreground/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <button type="button" aria-label={`Next ${project.name} contribution`} aria-controls={listId} disabled={!canScroll.next} onClick={() => scroll(1)} className="flex size-7 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-accent disabled:text-muted-foreground/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
