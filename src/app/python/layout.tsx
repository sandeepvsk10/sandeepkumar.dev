import type { Metadata } from "next";

import { SitePageShell } from "@/components/site-page-shell";

import { PythonFooter } from "./components/python-footer";
import { PythonHeader } from "./components/python-header";

export const metadata: Metadata = {
  title: "Python",
  description: "Python notes and tooling — Sandeep Kumar",
};

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
