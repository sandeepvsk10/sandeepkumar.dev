"use client";

import { useState } from "react";

import { Masonry, MasonryItem } from "@/components/core/masonry";
import { TextScramble } from "@/components/core/text-scramble";
import {
  PortfolioDotMatrix,
  type DotMatrixVariant,
} from "@/components/ui/portfolio-dot-matrix";

interface PortfolioTile extends MasonryItem {
  title: string;
  bg: string;
  loader: DotMatrixVariant;
  lang?: string;
}

const portfolioItems: PortfolioTile[] = [
  {
    id: "gaming",
    title: "Gaming",
    bg: "bg-blue-200",
    loader: "spiral",
    url: "#",
    height: 600,
  },
  {
    id: "graph-databases",
    title: "Graph Databases",
    bg: "bg-emerald-200",
    loader: "outer-ring",
    url: "/neo4j",
    height: 500,
  },
  {
    id: "ai-apps",
    title: "Applications",
    bg: "bg-violet-200",
    loader: "center-ripple",
    url: "#",
    height: 700,
  },
  {
    id: "open-source",
    title: "Open Source",
    bg: "bg-amber-200",
    loader: "ripple-echo",
    url: "/open-source",
    height: 550,
  },
  {
    id: "python",
    title: "Projects",
    bg: "bg-rose-200",
    loader: "path-trbl",
    url: "/python",
    height: 650,
  },
  {
    id: "blog",
    title: "Blog",
    bg: "bg-orange-200",
    loader: "path-row",
    url: "#",
    height: 550,
  },
  {
    id: "dev-setup",
    title: "Dev Setup",
    bg: "bg-indigo-200",
    loader: "diagonal-snake",
    url: "/dev-setup",
    height: 480,
  },
  {
    id: "books",
    title: "Books",
    bg: "bg-cyan-200",
    loader: "ripple",
    url: "#",
    height: 520,
  },
  {
    id: "thamizh",
    title: "தமிழ்",
    lang: "ta",
    bg: "bg-teal-200",
    loader: "spiral",
    url: "/thamizh",
    height: 540,
  },
];

function PortfolioTileContent({ item }: { item: PortfolioTile }) {
  const [trigger, setTrigger] = useState(false);

  return (
    <div
      className="group relative flex h-full flex-col gap-4 rounded-2xl p-5 shadow-sm ring-1 ring-black/5"
      onMouseEnter={() => setTrigger(true)}
    >
      <div
        aria-hidden
        className={`absolute inset-0 rounded-2xl ${item.bg} opacity-80 transition-opacity group-hover:opacity-100`}
      />
      <div className="relative z-10 flex flex-col gap-4">
        <span aria-hidden className="inline-flex shrink-0">
          <PortfolioDotMatrix
            variant={item.loader}
            size={22}
            dotSize={2.5}
            color="#000000"
            speed={0.65}
            animated
          />
        </span>
        <div className="flex flex-col gap-1">
          <h3
            className="text-base font-normal tracking-tight text-zinc-800 sm:text-lg"
            lang={item.lang}
          >
            <TextScramble
              speed={0.004}
              trigger={trigger}
              onScrambleComplete={() => setTrigger(false)}
            >
              {item.title}
            </TextScramble>
          </h3>
          {(!item.url || item.url === "#") && (
            <p className="text-xs font-normal tracking-tight text-zinc-600/90 sm:text-sm">
              (coming soon)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function HomePageMasonary() {
  return (
    <section className="relative w-full py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="relative flex min-w-0 flex-col">
          <h2 className="mb-6 flex min-h-7 items-center font-terminal text-md font-normal tracking-tight text-foreground">
            hello@sandeepkumar.dev ~ % cd /sandeepkumar-dev
          </h2>
          <Masonry
            items={portfolioItems}
            ease="elastic.out"
            duration={0.9}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.98}
            blurToFocus={true}
            renderItem={(item) => <PortfolioTileContent item={item} />}
          />
        </div>
        <div className="flex min-w-0 flex-col">
          <h2
            id="currently-building-title"
            className="mb-6 flex min-h-7 items-center font-sans text-xl font-normal tracking-tight text-foreground"
          >
            Currently building
          </h2>
          <aside
            aria-labelledby="currently-building-title"
            className="min-h-[360px] flex-1 rounded-2xl border border-border/60 lg:min-h-[600px]"
          />
        </div>
      </div>
    </section>
  );
}
