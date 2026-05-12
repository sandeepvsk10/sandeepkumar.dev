import { HomeFooterDock } from "./home-footer-dock";

export function HomeFooter() {
  return (
    <footer
      className="flex flex-col gap-8 border-t border-border/60 pb-[60px] pt-10 sm:flex-row sm:items-stretch sm:justify-between sm:gap-12"
      aria-label="Site footer"
    >
      <div className="min-w-0 flex-1 max-w-lg space-y-1 sm:max-w-xl">
        <p className="inline-block w-fit bg-[linear-gradient(90deg,_#6ec0f4_0%,_#a882e8_25%,_#e4738a_50%,_#f0a76f_75%,_#f4cf6e_100%)] bg-clip-text bg-no-repeat text-xl font-normal tracking-tight text-transparent transition-[background] duration-200 hover:bg-[linear-gradient(90deg,_#5db3ea_0%,_#9a72e0_25%,_#dc6380_50%,_#e89960_75%,_#ecc55e_100%)] sm:text-2xl">
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
