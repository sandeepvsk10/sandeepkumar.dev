import { SitePageShell } from "@/components/site-page-shell";

import { BlogFooter } from "./components/blog-footer";
import { BlogHeader } from "./components/blog-header";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SitePageShell header={<BlogHeader />} footer={<BlogFooter />}>
      {children}
    </SitePageShell>
  );
}
