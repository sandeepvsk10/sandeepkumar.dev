import Image from "next/image";

import { publicAsset } from "@/lib/public-asset";

import { HomeSocialNav } from "./home-social-nav";

export function HomeHeader() {
  return (
    <div className="flex flex-col gap-8 border-b border-border/60 pb-10 pt-[60px] sm:flex-row sm:items-start sm:justify-between sm:gap-12">
      <div className="flex min-w-0 flex-1 flex-row items-start gap-7">
        <div className="relative size-[61px] shrink-0 overflow-hidden rounded-full border border-border bg-muted shadow-sm sm:size-[82px] md:size-[102px]">
          <Image
            src={publicAsset("/home/portfolio.png")}
            alt="Sandeep Kumar"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 61px, (max-width: 768px) 82px, 102px"
            priority
          />
        </div>
        <div className="min-w-0 max-w-lg space-y-1 sm:max-w-xl">
          <p className="text-lg font-normal tracking-tight text-foreground sm:text-lg">
            Sandeep Kumar
          </p>
          <p className="text-sm leading-relaxed text-foreground/78 sm:text-sm">
          Software Engineer - primarily working on data engineering and graph databases. Love spending time engineering AI apps, engaging with open source, and obsessing over good UI/UX.
          </p>
        </div>
      </div>
      <HomeSocialNav />
    </div>
  );
}
