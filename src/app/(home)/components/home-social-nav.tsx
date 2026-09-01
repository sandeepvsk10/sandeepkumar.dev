"use client";

import { useState } from "react";

import { TextScramble } from "@/components/core/text-scramble";

import { SOCIAL_LINKS } from "../constants/social-links";

function SocialNavLink({ label, href }: { label: string; href: string }) {
  const [trigger, setTrigger] = useState(false);

  const isDisabled = label === "LinkedIn";

  if (isDisabled) {
    return (
      <span
        className="block cursor-default select-none text-left text-sm font-normal leading-relaxed text-foreground/78 sm:text-right"
        aria-disabled="true"
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
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-left text-sm font-normal leading-relaxed text-foreground/78 underline-offset-4 transition-colors hover:underline sm:text-right"
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
      className="flex w-full shrink-0 flex-col items-start gap-1.5 pl-[20%] sm:w-auto sm:pl-0 sm:items-end sm:self-end"
      aria-label="Social profiles"
    >
      {SOCIAL_LINKS.map(({ label, href }) => (
        <SocialNavLink key={label} label={label} href={href} />
      ))}
    </nav>
  );
}
