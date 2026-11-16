import BlurText from "./blur-text";
import { OpenSourceLogo } from "./open-source-logo";

const textAnimation = {
  effect: "blur",
  animateBy: "letters",
  direction: "top",
  staggerFrom: "start",
  staggerByLine: true,
  trigger: "view",
  delay: 7,
  stepDuration: 0.25,
  blur: 10,
  distance: 10,
} as const;

export function OpenSourceHeader() {
  return (
    <header className="mx-auto grid w-full max-w-3xl gap-6 pb-8 pt-10 md:grid-cols-2 md:gap-8">
      <div className="relative flex aspect-[16/10] w-full min-w-0 items-center justify-center self-start">
        <OpenSourceLogo />
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-2">
        <h1 className="text-sm font-normal tracking-tight text-foreground">
          <BlurText {...textAnimation} as="span" text="Hey there," />
        </h1>
        <BlurText
          {...textAnimation}
          text="I believe in open source softwares and dedicate my personal time trying to learn & contribute to oss projects regardless of popularity."
          className="text-xs leading-relaxed text-foreground/78"
        />
        <BlurText
          {...textAnimation}
          text="I owe oss community a big gratitude and below are some of the projects I contributed!"
          className="text-xs leading-relaxed text-foreground/78"
        />
      </div>
    </header>
  );
}
