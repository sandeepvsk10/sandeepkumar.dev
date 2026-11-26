import { GithubIcon, NewTwitterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { SOCIAL_LINKS } from "../constants/social-links";
import { ThemeToggle } from "./theme-toggle";

function SocialNavLink({ label, handle, href }: { label: string; handle: string; href: string }) {
  const icon = label === "GitHub" ? GithubIcon : NewTwitterIcon;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (@${handle})`}
      className="group inline-flex items-center text-left text-sm font-normal leading-relaxed text-foreground/78 underline-offset-4 transition-colors hover:underline sm:text-right"
    >
      <span className="inline-block max-w-20 shrink-0 overflow-hidden whitespace-nowrap transition-[max-width] duration-300 ease-out group-hover:max-w-0 group-hover:opacity-0 group-focus-visible:max-w-0 group-focus-visible:opacity-0 motion-reduce:transition-none">
        {label}
      </span>
      <span
        aria-hidden="true"
        className="inline-flex max-w-0 shrink-0 items-center gap-1.5 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-300 ease-out group-hover:max-w-40 group-hover:opacity-100 group-focus-visible:max-w-40 group-focus-visible:opacity-100 motion-reduce:transition-none"
      >
        <HugeiconsIcon icon={icon} size={16} strokeWidth={1.7} className="shrink-0" />
        <span className="text-foreground/55">{handle}</span>
      </span>
    </a>
  );
}

export function HomeSocialNav() {
  return (
    <div className="flex w-full shrink-0 flex-row items-center gap-4 pl-[4.5rem] sm:w-auto sm:flex-col sm:gap-2 sm:items-end sm:self-end sm:pl-0">
      <ThemeToggle />
      <nav className="flex flex-row items-center gap-4 sm:flex-col sm:items-end sm:gap-1.5" aria-label="Social profiles">
        {SOCIAL_LINKS.map(({ label, handle, href }) => (
          <SocialNavLink key={label} label={label} handle={handle} href={href} />
        ))}
      </nav>
    </div>
  );
}
