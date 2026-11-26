import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { ClaudeMascot } from "@/components/claude-mascot";
import { EntryWaves } from "@/components/entry-waves";
import { Masonry, MasonryItem } from "@/components/core/masonry";
import { TextScramble } from "@/components/core/text-scramble";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { RiseIn } from "@/components/rise-in";
import { KintsugiProjectCard } from "@/components/kintsugi-project-card";
import {
  PortfolioDotMatrix,
  type DotMatrixVariant,
} from "@/components/ui/portfolio-dot-matrix";

import { TileImageSlideshow } from "./tile-image-slideshow";

interface PortfolioTile extends MasonryItem {
  title: string;
  bg: string;
  loader: DotMatrixVariant;
  images?: string[];
  /** Show the looping Claude mascot animations in the tile. */
  mascot?: boolean;
  /** Mistakes-style gradient and fine wave lines, for tiles without a picture. */
  pattern?: TilePattern;
}

interface TilePattern {
  background: string;
  /** Colour of the wave lines. */
  ink: string;
  waves: "ribbon" | "fan";
  /** Ribbon line count; fewer than the default 28 widens the gaps. */
  lines?: number;
  /** Where the lines fade out, so they read as texture rather than a fill. */
  mask: string;
  /** Mirror or turn the lines so neighbouring tiles don't repeat the same flow. */
  transform?: string;
}

const portfolioItems: PortfolioTile[] = [
  {
    id: "gaming",
    title: "Gaming",
    bg: "bg-blue-200",
    loader: "spiral",
    url: "#",
    height: 600,
    images: ["/home/gaming/val-chamber-4.avif"],
  },
  {
    id: "ai",
    title: "AI",
    bg: "bg-amber-200",
    loader: "middle-ring",
    url: "#",
    height: 550,
    mascot: true,
    pattern: {
      background: "radial-gradient(ellipse at 90% 0%, #fde58f, transparent 70%), linear-gradient(160deg, #fdf3cf, #fae7a8)",
      ink: "#8a5a12",
      waves: "ribbon",
      lines: 20,
      mask: "linear-gradient(to bottom, #000 14%, #0009 52%, transparent 91%)",
    },
  },
  {
    id: "open-source",
    title: "Open Source",
    bg: "bg-violet-200",
    loader: "ripple-echo",
    url: "/open-source",
    height: 550,
    pattern: {
      background: "radial-gradient(ellipse at 14% 82%, #d4c2f2b0, transparent 50%), linear-gradient(120deg, #f3eefb, #e2d6f6)",
      ink: "#5b3f8f",
      waves: "fan",
      mask: "radial-gradient(ellipse 53% 38% at center, #0001, #0003 55%, #000 100%)",
      transform: "scale(-1, 1)",
    },
  },
  {
    id: "blog",
    title: "Blog",
    bg: "bg-rose-200",
    loader: "path-row",
    url: "/blog",
    height: 550,
    pattern: {
      background: "radial-gradient(ellipse at 100% 60%, #f4a9b78f, transparent 68%), linear-gradient(115deg, #fdf0f2, #f9dbe1)",
      ink: "#8f3b4c",
      waves: "ribbon",
      lines: 20,
      mask: "linear-gradient(to right, transparent 9%, #0003 39%, #000 78%)",
      transform: "scale(-1, 1)",
    },
  },
  {
    id: "mistakes",
    title: "Mistakes",
    bg: "bg-amber-100",
    loader: "diagonal-snake",
    url: "/mistakes",
    height: 520,
    images: ["/home/mistakes/kintsugi.webp"],
  },
];

function PortfolioTileContent({ item, width }: { item: PortfolioTile; width: number }) {
  const [trigger, setTrigger] = useState(false);
  const hasImages = Boolean(item.images?.length);
  const matrixSize = Math.min(22, Math.max(14, width * 0.12));
  const dotSize = 2.5 * matrixSize / 22;
  const dotGap = Math.max(1, Math.floor((matrixSize - 5 * dotSize) / 4));
  // The AI animation lights only the middle three rows and columns of the matrix.
  const matrixScale = item.loader === "middle-ring"
    ? 1
    : (3 * dotSize + 2 * dotGap) / (5 * dotSize + 4 * dotGap);

  return (
    <div
      className="group relative flex h-full flex-col gap-4 rounded-2xl p-5 shadow-sm ring-1 ring-black/5 lg:@container lg:p-3"
      onMouseEnter={() => setTrigger(true)}
    >
      <div
        aria-hidden
        className={`absolute inset-0 rounded-2xl ${item.pattern ? "" : item.bg} opacity-80 transition-opacity group-hover:opacity-100`}
        style={item.pattern ? { background: item.pattern.background } : undefined}
      />
      {item.pattern && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
          style={{ color: item.pattern.ink }}
        >
          <EntryWaves
            variant={item.pattern.waves}
            ribbonLines={item.pattern.lines}
            className="absolute inset-0 size-full opacity-[0.36]"
            style={{ maskImage: item.pattern.mask, transform: item.pattern.transform }}
          />
        </div>
      )}
      {item.images && <TileImageSlideshow images={item.images} />}
      {item.mascot && (
        <div
          aria-hidden
          className="pointer-events-none absolute right-5 top-5 lg:right-3 lg:top-3"
        >
          <ClaudeMascot
            size={88}
            className="block size-22 lg:size-[var(--claude-mascot-size)] lg:[--claude-mascot-size:clamp(2rem,36cqi,2.75rem)]"
          />
        </div>
      )}
      <div className="relative z-10 mt-auto flex flex-col gap-4 lg:gap-2">
        <span aria-hidden className="inline-flex w-fit shrink-0" style={{ scale: matrixScale }}>
          <PortfolioDotMatrix
            variant={item.loader}
            size={matrixSize}
            dotSize={dotSize}
            color={hasImages ? "#ffffff" : "#000000"}
            speed={0.65}
            animated
          />
        </span>
        <div className="flex flex-col gap-1">
          <h3
            className={`text-base font-normal tracking-tight sm:text-lg lg:text-[length:clamp(0.8125rem,11cqi,0.9375rem)] lg:leading-tight ${
              hasImages ? "text-white" : "text-zinc-800"
            }`}
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
            <p
              className={`text-xs font-normal tracking-tight sm:text-sm lg:text-[length:clamp(0.6875rem,9cqi,0.75rem)] lg:leading-tight ${
                hasImages ? "text-white/80" : "text-zinc-600/90"
              }`}
            >
              (coming soon)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Fade article titles in one after another, each followed by its category, like the header bio. */
const articleFadeDelay = (index: number) => 250 + index * 150;

/** Section heading that opens the section's own page, marked with a small diagonal arrow. */
function SectionLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-1 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
    >
      {children}
      <HugeiconsIcon
        icon={ArrowUpRight01Icon}
        size={16}
        strokeWidth={1.7}
        aria-hidden="true"
        className="shrink-0 text-muted-foreground transition-[translate,color] group-hover:text-foreground motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
      />
    </Link>
  );
}

export function HomePageMasonary() {
  const sectionDivider =
    "relative min-w-0 before:pointer-events-none before:absolute before:inset-x-0 before:-top-4 before:h-px before:bg-linear-to-r before:from-transparent before:via-border before:to-transparent " +
    "lg:before:inset-x-auto lg:before:inset-y-0 lg:before:-left-4 lg:before:h-auto lg:before:w-px lg:before:bg-linear-to-b";

  return (
    <section className="relative w-full py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="relative flex min-w-0 flex-col lg:[--masonry-columns:3] lg:[--masonry-reference-width-scale:1.5]">
          <h2 className="mb-6 flex min-h-7 items-center font-terminal text-md font-normal tracking-tight text-foreground">
            hello@sandeepkumar.dev ~ % ls
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
            renderItem={(item) => <PortfolioTileContent item={item} width={item.w} />}
          />
          <div className="mt-6 flex min-h-7 items-center">
            <SectionLink to="/crafts">Crafts</SectionLink>
          </div>
        </div>
        <div className="grid min-h-[412px] min-w-0 auto-rows-fr gap-8 lg:min-h-[652px] lg:grid-cols-2">
          <section aria-labelledby="currently-building-title" className={sectionDivider}>
            <h2
              id="currently-building-title"
              className="mb-6 flex min-h-7 items-center font-sans text-xl font-normal tracking-tight text-foreground"
            >
              <SectionLink to="/building">Currently building</SectionLink>
            </h2>
            {/* Rise in right after the masonry tiles' staggered entrance. */}
            <RiseIn delay={portfolioItems.length * 0.05}>
              <KintsugiProjectCard />
            </RiseIn>
          </section>
          <section aria-labelledby="writing-title" className={sectionDivider}>
            <h2
              id="writing-title"
              className="mb-6 flex min-h-7 items-center font-sans text-xl font-normal tracking-tight text-foreground"
            >
              <SectionLink to="/blog">Writing</SectionLink>
            </h2>
            <ol className="flex flex-col">
              {BLOG_POSTS.map(({ title, category, url }, index) => (
                <li key={url} className="border-b border-border/60 first:border-t">
                  <Link
                    to={url}
                    className="group grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                  >
                    {/* The 40px box clips the number's base at the divider, so it reads as submerged; its cap line
                        sits level with the title, which shares the same 40px height with the category. */}
                    <span
                      aria-hidden="true"
                      className="mt-3 h-10 overflow-hidden text-[4rem] font-semibold tracking-tighter tabular-nums text-foreground"
                    >
                      <span className="block leading-[0.8] transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-[0.06em]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span className="flex min-w-0 flex-col gap-1 pt-2.5">
                      <span
                        className="text-sm leading-5 font-medium text-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:fill-mode-both motion-safe:duration-500"
                        style={{ animationDelay: `${articleFadeDelay(index)}ms` }}
                      >
                        {title}
                      </span>
                      <span
                        className="text-xs leading-4 text-muted-foreground transition-colors group-hover:text-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:fill-mode-both motion-safe:duration-500"
                        style={{ animationDelay: `${articleFadeDelay(index) + 150}ms` }}
                      >
                        {category}
                      </span>
                    </span>
                    <HugeiconsIcon
                      icon={ArrowUpRight01Icon}
                      size={15}
                      strokeWidth={1.7}
                      aria-hidden="true"
                      className="mt-3.5 shrink-0 text-muted-foreground transition-[translate,color] group-hover:text-foreground motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </section>
  );
}
