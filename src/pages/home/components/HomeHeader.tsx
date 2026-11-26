import { useRef, useState } from "react";

import { publicAsset } from "@/lib/public-asset";

import { DatabasesPlatter } from "./databases-platter";
import { DesignMarker } from "./design-marker";
import { EngineerAsm } from "./engineer-asm";
import { HomeSocialNav } from "./home-social-nav";
import { ProfileOrbit } from "./profile-orbit";

export function HomeHeader() {
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const [introHovered, setIntroHovered] = useState(false);

  return (
    <div className="flex flex-col gap-5 pb-10 pt-[60px] sm:flex-row sm:items-start sm:justify-between sm:gap-12">
      <div className="flex min-w-0 flex-1 flex-row items-start gap-4 sm:gap-7">
        <div className="relative size-14 shrink-0 sm:size-[82px] md:size-[102px]">
          <img
            src={publicAsset("/home/portfolio.webp")}
            alt="Sandeep"
            width={102}
            height={102}
            className="h-full w-full rounded-full border border-border bg-muted object-cover shadow-sm"
            sizes="(width < 640px) 56px, (width < 768px) 82px, 102px"
            fetchPriority="high"
          />
          <ProfileOrbit subtitleRef={subtitleRef} />
        </div>
        {/* Hovering the name and bio plays the bio's word effects together. */}
        <div
          className="group/intro min-w-0 max-w-lg space-y-1 sm:max-w-xl"
          onPointerEnter={(event) => event.pointerType !== "touch" && setIntroHovered(true)}
          onPointerLeave={() => setIntroHovered(false)}
        >
          <p className="text-base font-normal tracking-tight text-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:delay-250 sm:text-lg">
            Sandeep
          </p>
          <p className="text-[length:clamp(0.8125rem,3.6vw,0.875rem)] leading-normal sm:text-[0.9375rem] text-pretty text-foreground/78 motion-safe:animate-in motion-safe:fade-in motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:delay-400 sm:leading-relaxed">
            <EngineerAsm key={String(introHovered)} active={introHovered}>Software Engineer</EngineerAsm>, <DatabasesPlatter>Databases</DatabasesPlatter> &amp; dabbling <DesignMarker>Design</DesignMarker> on the side!
            <br />
            <span ref={subtitleRef}>Obsessed over performance &amp; UI/UX</span>
          </p>
        </div>
      </div>
      <HomeSocialNav />
    </div>
  );
}
