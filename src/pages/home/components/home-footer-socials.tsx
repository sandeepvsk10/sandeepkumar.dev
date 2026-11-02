import { GithubIcon, NewTwitterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { SOCIAL_LINKS } from "../constants/social-links";

const icons = { GitHub: GithubIcon, X: NewTwitterIcon };

export function HomeFooterSocials() {
  return (
    <nav aria-label="Social profiles" className="flex shrink-0 items-center gap-2 sm:self-end">
      {SOCIAL_LINKS.map(({ label, href }) => {
        return (
          <a
            key={label}
            href={href}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-11 items-center justify-center rounded-md text-foreground/75 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <HugeiconsIcon icon={icons[label]} size={22} strokeWidth={1.7} aria-hidden="true" />
          </a>
        );
      })}
    </nav>
  );
}
