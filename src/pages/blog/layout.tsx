import { SitePageShell } from "@/components/site-page-shell";
import { HomeLinkFooter } from "@/components/home-link-footer";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SitePageShell header={null} footer={<HomeLinkFooter />}>
      {children}
    </SitePageShell>
  );
}
