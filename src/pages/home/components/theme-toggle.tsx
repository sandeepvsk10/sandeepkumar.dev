import { useState } from "react";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    const favicon = document.querySelector<HTMLLinkElement>("#site-favicon");
    const href = favicon?.dataset[next ? "dark" : "light"];
    if (favicon && href) favicon.href = href;
    setDark(next);
    try {
      localStorage.setItem("portfolio-theme", next ? "dark" : "light");
    } catch {
      // Keep the selected theme for the current visit.
    }
  }

  return (
    <button
      type="button"
      aria-label="Dark mode"
      aria-pressed={dark}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className="inline-grid size-11 items-center justify-items-start text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:size-8 sm:justify-items-end"
    >
      <HugeiconsIcon
        icon={dark ? Sun03Icon : Moon02Icon}
        size={14}
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </button>
  );
}
