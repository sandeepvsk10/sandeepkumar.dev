import { SitePageShell } from "@/components/site-page-shell";
import { KintsugiHand } from "@/components/kintsugi-hand/kintsugi-hand";
import { HomeLinkFooter } from "@/components/home-link-footer";

export default function MistakesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SitePageShell
      showButterfly={false}
      header={
        <header className="flex flex-col gap-3 pt-12">
          <h1 className="text-3xl font-normal tracking-tight">Mistakes</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Some weights, regrets and ghosts of yesterday
            <br />
            Rest assured, a damn good journey
          </p>
        </header>
      }
      footer={
        <div className="relative">
          <div className="mistakes-footer-hand">
            <KintsugiHand />
          </div>
          <div className="absolute bottom-0 left-0 lg:static">
            <HomeLinkFooter divider={false} />
          </div>
        </div>
      }
    >
      {children}
    </SitePageShell>
  );
}
