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
    bg: "bg-blue-950/40",
    borderColor: "border-blue-400/50",
    url: "#",
    height: 600,
  },
  {
    id: "graph-databases",
    title: "Graph Databases",
    bg: "bg-emerald-950/40",
    borderColor: "border-emerald-400/50",
    url: "/neo4j",
    height: 500,
  },
  {
    id: "ai-apps",
    title: "AI Applications",
    bg: "bg-violet-950/40",
    borderColor: "border-violet-400/50",
    url: "#",
    height: 700,
  },
  {
    id: "open-source",
    title: "Open Source",
    bg: "bg-amber-950/40",
    borderColor: "border-amber-400/50",
    url: "/open-source",
    height: 550,
  },
  {
    id: "python",
    title: "Python",
    bg: "bg-rose-950/40",
    borderColor: "border-rose-400/50",
    url: "/python",
    height: 650,
  },
  {
    id: "blog",
    title: "Blog",
    bg: "bg-orange-950/40",
    borderColor: "border-orange-400/50",
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
              <h3 className="text-3xl font-regular tracking-tight text-foreground sm:text-4xl">
                {item.title}
              </h3>
            </div>
          )}
        />
      </div>
    </section>
  );
}
