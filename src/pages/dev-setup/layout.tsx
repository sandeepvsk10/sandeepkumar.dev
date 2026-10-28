import { SitePageShell } from "@/components/site-page-shell";

import { DevSetupFooter } from "./components/dev-setup-footer";
import { DevSetupHeader } from "./components/dev-setup-header";

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
