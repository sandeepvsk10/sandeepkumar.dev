import { HomeFooter } from "@/app/(home)/components/HomeFooter";
import { HomeHeader } from "@/app/(home)/components/HomeHeader";
import { SitePageShell } from "@/components/site-page-shell";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SitePageShell header={<HomeHeader />} footer={<HomeFooter />}>
      {children}
    </SitePageShell>
  );
}
