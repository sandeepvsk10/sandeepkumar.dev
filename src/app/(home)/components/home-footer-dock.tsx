"use client";

import { useMemo } from "react";

import Dock, { type DockItemData } from "@/components/dock/Dock";

import { DOCK_SOCIAL } from "../constants/dock-social";
import {
  IconGithub,
  IconLinkedin,
  IconMail,
  IconX,
} from "./dock-social-icons";

const icons = [IconGithub, IconLinkedin, IconX, IconMail] as const;

const brandItemClass = [
  "dock-item-brand-github",
  "dock-item-brand-linkedin",
  "dock-item-brand-x",
  "dock-item-brand-mail",
] as const;

function openHref(href: string) {
  if (href.startsWith("mailto:")) {
    // More reliable than direct assignment in some browser setups/extensions.
    const a = document.createElement("a");
    a.href = href;
    a.rel = "noopener noreferrer";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }
  window.open(href, "_blank", "noopener,noreferrer");
}

export function HomeFooterDock() {
  const items = useMemo((): DockItemData[] => {
    return DOCK_SOCIAL.map((entry, i) => {
      const Icon = icons[i]!;
      const isDisabled = entry.label === "LinkedIn";
      return {
        label: entry.label,
        icon: <Icon />,
        onClick: isDisabled ? () => {} : () => openHref(entry.href),
        className: brandItemClass[i],
        disabled: isDisabled,
      };
    });
  }, []);

  return (
    <div className="relative min-h-[120px] w-full shrink-0 sm:h-full sm:min-h-[88px]">
      {/*
        Anchor the dock to the bottom so when the outer height springs open for
        magnification, growth goes upward — the bar does not slide down the page.
      */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center sm:justify-end">
        <Dock
          items={items}
          className="dock-panel--align-end"
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
          distance={200}
        />
      </div>
    </div>
  );
}
