import type { ReactNode } from "react";

import { HomeLinkFooter } from "@/components/home-link-footer";
import { SitePageShell } from "@/components/site-page-shell";

export default function ExperimentsLayout({ children }: { children: ReactNode }) {
  return (
    <SitePageShell showButterfly={false} header={null} footer={<HomeLinkFooter divider={false} />}>
      {children}
    </SitePageShell>
  );
}
