import { SitePageShell } from "@/components/site-page-shell";

import { HomeLinkFooter } from "@/components/home-link-footer";
import { OpenSourceHeader } from "./components/open-source-header";

export default function OpenSourceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SitePageShell header={<OpenSourceHeader />} footer={<HomeLinkFooter />}>
      {children}
    </SitePageShell>
  );
}
