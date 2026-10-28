import { SitePageShell } from "@/components/site-page-shell";

import { PythonFooter } from "./components/python-footer";
import { PythonHeader } from "./components/python-header";

export default function PythonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SitePageShell header={<PythonHeader />} footer={<PythonFooter />}>
      {children}
    </SitePageShell>
  );
}
