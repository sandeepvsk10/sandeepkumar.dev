import type { ReactNode } from "react";

import { HomeLinkFooter } from "@/components/home-link-footer";
import { SitePageShell } from "@/components/site-page-shell";

export default function BuildingLayout({ children }: { children: ReactNode }) {
  return (
    <SitePageShell
      header={
        <header className="flex flex-col gap-3 pt-12">
          <h1 className="text-3xl font-normal tracking-tight">Currently building</h1>
          <p className="text-base leading-relaxed text-muted-foreground">Projects I&apos;m working on right now</p>
        </header>
      }
      footer={<HomeLinkFooter />}
    >
      {children}
    </SitePageShell>
  );
}
