import { HomeFooterSocials } from "./home-footer-socials";

export function HomeFooter() {
  return (
    <footer
      className="flex flex-col items-center gap-8 border-t border-border/60 pb-[60px] pt-10 text-center sm:flex-row sm:items-stretch sm:justify-between sm:gap-12 sm:text-left"
      aria-label="Site footer"
    >
      <div className="min-w-0 flex-1 max-w-lg space-y-1 sm:max-w-xl">
        <p className="text-lg font-normal tracking-tight text-foreground sm:text-xl">
          sandeepkumar.dev
        </p>
        <p className="text-sm leading-relaxed text-foreground/78 sm:text-sm">
          Thanks for stopping by - find the{" "}
          <a
            href="https://github.com/sandeepvsk10/sandeepkumar.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            source here
          </a>
        </p>
      </div>
      <HomeFooterSocials />
    </footer>
  );
}
