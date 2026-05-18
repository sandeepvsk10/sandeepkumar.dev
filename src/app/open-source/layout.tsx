import type { Metadata } from "next";

import { SitePageShell } from "@/components/site-page-shell";

import { OpenSourceFooter } from "./components/open-source-footer";
import { OpenSourceHeader } from "./components/open-source-header";

export const metadata: Metadata = {
  title: "Open source",
  description: "Projects and contributions — Sandeep Kumar",
};

export default function OpenSourceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SitePageShell
      header={<OpenSourceHeader />}
      footer={<OpenSourceFooter />}
    >
      {children}
    </SitePageShell>
  );
}
