import { SitePageShell } from "@/components/site-page-shell";

import { DevEnvFooter } from "./components/dev-env-footer";
import { DevEnvHeader } from "./components/dev-env-header";

export default function DevEnvLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SitePageShell header={<DevEnvHeader />} footer={<DevEnvFooter />}>
      {children}
    </SitePageShell>
  );
}
