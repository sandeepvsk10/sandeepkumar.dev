import { HomeFooter } from "@/pages/home/components/HomeFooter";
import { HomeHeader } from "@/pages/home/components/HomeHeader";
import { SitePageShell } from "@/components/site-page-shell";
import { HomeEntrance } from "./components/home-entrance";
import { HOME_FEATURES } from "./constants/feature-flags";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const page = (
    <SitePageShell header={<HomeHeader />} footer={<HomeFooter />}>
      {children}
    </SitePageShell>
  );

  return HOME_FEATURES.liquidGlassEntrance ? <HomeEntrance>{page}</HomeEntrance> : page;
}
