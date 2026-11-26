import { useState } from "react";

import { EntryWaves } from "@/components/entry-waves";

import "./entry-grid.css";

const entries = [
  { id: "A", title: "Focused on too many things", wave: "ribbon" },
  { id: "B", title: "Never gave my mind a rest", wave: "fan" },
  { id: "C", title: "Didn’t ask for help", wave: "ribbon" },
  { id: "D", title: "Wanted to be perfect", wave: "fan" },
  { id: "E", title: "Ran away from problems", wave: "fan" },
  { id: "F", title: "Ignored burnout", wave: "ribbon" },
] as const;

type EntryId = (typeof entries)[number]["id"];

export default function MistakesPage() {
  const [hover, setHover] = useState<{ entry: EntryId; fromRest: boolean } | null>(null);

  return (
    <main className="relative isolate grid w-full flex-1 gap-8 pb-12 pt-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:after:aspect-square lg:after:self-center lg:after:content-['']">
      <ul
        aria-label="Career mistakes"
        className="mistakes-entry-grid grid min-h-80 min-w-0 gap-2.5 sm:gap-3 lg:min-h-96"
        data-active-entry={hover?.entry}
        data-hover-start={hover?.fromRest || undefined}
        onPointerLeave={() => setHover(null)}
      >
        {entries.map(({ id, title, wave }) => (
          <li
            key={id}
            data-entry={id}
            data-active={hover?.entry === id || undefined}
            style={{ gridArea: id }}
            className="mistakes-entry-card grid min-w-0 rounded-2xl"
            onPointerEnter={(event) => {
              if (event.pointerType === "touch") return;
              // Keep the current card selected through the gaps until another card takes over.
              setHover((current) => current?.entry === id ? current : { entry: id, fromRest: current === null });
            }}
          >
            <EntryWaves variant={wave} />
            <span>{title}</span>
          </li>
        ))}
      </ul>

    </main>
  );
}
