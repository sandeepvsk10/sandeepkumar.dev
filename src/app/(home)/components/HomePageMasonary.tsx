"use client";

import { Masonry, MasonryItem } from "@/components/core/masonry";
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
    id: "data-engineering",
    title: "Data Engineering",
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
    title: "AI Applications",
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

export function HomePageMasonary() {
  return (
    <section className="relative w-full py-10">
      <h2 className="mb-6 font-terminal text-md font-normal tracking-tight text-foreground">
        hello@sandeepkumar.dev ~ % cd /sandeepkumar-dev
      </h2>
      <div className="relative w-full">
        <Masonry
          items={portfolioItems}
          ease="elastic.out"
          duration={0.9}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={0.98}
          blurToFocus={true}
          renderItem={(item) => (
            <div
              className="group relative flex h-full flex-col gap-5 rounded-3xl p-8 shadow-sm ring-1 ring-black/5"
            >
              <div
                aria-hidden
                className={`absolute inset-0 rounded-3xl ${item.bg} opacity-80 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative z-10 flex flex-col gap-5">
                <span aria-hidden className="inline-flex shrink-0">
                  <PortfolioDotMatrix
                    variant={item.loader}
                    size={26}
                    dotSize={3}
                    color="#000000"
                    speed={0.65}
                    animated
                  />
                </span>
                <div className="flex flex-col gap-1">
                  <h3
                    className="text-lg font-normal tracking-tight text-zinc-800 sm:text-xl"
                    lang={item.lang}
                  >
                    {item.title}
                  </h3>
                  {(!item.url || item.url === "#") && (
                    <p className="text-sm font-normal tracking-tight text-zinc-600/90">
                      (coming soon)
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </section>
  );
}
