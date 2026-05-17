"use client";

import { useState } from "react";

import { TextScramble } from "@/components/core/text-scramble";

import { SOCIAL_LINKS } from "../constants/social-links";

function SocialNavLink({ label, href }: { label: string; href: string }) {
  const [trigger, setTrigger] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-right text-sm font-normal leading-relaxed text-foreground/78 underline-offset-4 transition-colors hover:underline"
      onMouseEnter={() => setTrigger(true)}
    >
      <TextScramble
        className="text-sm font-normal leading-relaxed text-inherit"
        as="span"
        speed={0.001}
        trigger={trigger}
        onHoverStart={() => setTrigger(true)}
        onScrambleComplete={() => setTrigger(false)}
      >
        {label}
      </TextScramble>
    </a>
  );
}

export function HomeSocialNav() {
  return (
    <nav
      className="flex shrink-0 flex-col items-end gap-1.5 self-end sm:gap-1.5"
      aria-label="Social profiles"
    >
      {SOCIAL_LINKS.map(({ label, href }) => (
        <SocialNavLink key={label} label={label} href={href} />
      ))}
    </nav>
  );
}
