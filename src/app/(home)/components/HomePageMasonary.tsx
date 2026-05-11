"use client";

import { Masonry, MasonryItem } from "@/components/core/masonry";

interface PortfolioTile extends MasonryItem {
  title: string;
  bg: string;
  borderColor: string;
}

const portfolioItems: PortfolioTile[] = [
  {
    id: "data-engineering",
    title: "Data Engineering",
    bg: "bg-blue-100",
    borderColor: "border-blue-500/80",
    url: "#",
    height: 600,
  },
  {
    id: "graph-databases",
    title: "Graph Databases",
    bg: "bg-emerald-100",
    borderColor: "border-emerald-500/80",
    url: "/neo4j",
    height: 500,
  },
  {
    id: "ai-apps",
    title: "AI Applications",
    bg: "bg-violet-100",
    borderColor: "border-violet-500/80",
    url: "#",
    height: 700,
  },
  {
    id: "open-source",
    title: "Open Source",
    bg: "bg-amber-100",
    borderColor: "border-amber-500/80",
    url: "/open-source",
    height: 550,
  },
  {
    id: "python",
    title: "Python",
    bg: "bg-rose-100",
    borderColor: "border-rose-500/80",
    url: "/python",
    height: 650,
  },
  {
    id: "blog",
    title: "Blog",
    bg: "bg-orange-100",
    borderColor: "border-orange-500/80",
    url: "#",
    height: 550,
  },
];

export function HomePageMasonary() {
  return (
    <section className="relative w-full py-10">
      <h2 className="mb-6 text-base font-medium tracking-tight text-foreground">
        Career &amp; Skills
      </h2>
      <div className="relative min-h-[700px] w-full sm:min-h-[800px] lg:min-h-[900px]">
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
            <div className={`flex h-full items-end rounded-[10px] border-[3px] ${item.borderColor} bg-white p-8`}>
              <h3 className="text-3xl font-normal tracking-tight text-zinc-600 sm:text-4xl">
                {item.title}
              </h3>
            </div>
          )}
        />
      </div>
    </section>
  );
}
