import { SitePageShell } from "@/components/site-page-shell";

import { ThamizhFooter } from "./components/thamizh-footer";
import { ThamizhHeader } from "./components/thamizh-header";

export default function ThamizhLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SitePageShell header={<ThamizhHeader />} footer={<ThamizhFooter />}>
      {children}
    </SitePageShell>
  );
}
