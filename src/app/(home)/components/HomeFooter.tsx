import { HomeFooterDock } from "./home-footer-dock";

export function HomeFooter() {
  return (
    <footer
      className="flex flex-col gap-8 border-t border-border/60 pb-[60px] pt-10 sm:flex-row sm:items-stretch sm:justify-between sm:gap-12"
      aria-label="Site footer"
    >
      <div className="min-w-0 flex-1 max-w-lg space-y-1 sm:max-w-xl">
        <p className="inline-block w-fit bg-[linear-gradient(90deg,_#0ea5e9_0%,_#8b5cf6_25%,_#ec4899_50%,_#f97316_75%,_#eab308_100%)] bg-clip-text bg-no-repeat text-lg font-normal tracking-tight text-transparent transition-[background] duration-200 hover:bg-[linear-gradient(90deg,_#38bdf8_0%,_#a78bfa_25%,_#f472b6_50%,_#fb923c_75%,_#facc15_100%)] sm:text-xl">
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
      <div className="flex min-h-[88px] w-full flex-1 flex-col items-end justify-end sm:h-full sm:min-h-0 sm:w-auto sm:self-stretch">
        <HomeFooterDock />
      </div>
    </footer>
  );
}
