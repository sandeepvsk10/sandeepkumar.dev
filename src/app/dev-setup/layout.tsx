import type { Metadata } from "next";

import { SitePageShell } from "@/components/site-page-shell";

import { DevSetupFooter } from "./components/dev-setup-footer";
import { DevSetupHeader } from "./components/dev-setup-header";

export const metadata: Metadata = {
  title: "Dev Setup",
  description: "Development environment and tooling — Sandeep Kumar",
};

export default function DevSetupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SitePageShell header={<DevSetupHeader />} footer={<DevSetupFooter />}>
      {children}
    </SitePageShell>
  );
}
