import type { ReactNode } from "react";

import postgresql from "../assets/database-logos/postgresql.svg";
import "./databases-platter.css";

/**
 * A hard-drive platter centred over the word that peeks up from behind it when the header intro
 * (`group/intro`) is hovered; more than half of it stays submerged below the word's top edge. Slonik, the
 * official PostgreSQL elephant (vectorlogo.zone's postgresql-icon.svg), then rises over the disk, its trunk
 * resting on the platter like a read/write head. PostgreSQL and Slonik are trademarks of the PostgreSQL
 * Community Association, used here to refer to PostgreSQL.
 * It is an absolutely positioned overlay, so the word's spacing and wrapping never change.
 */
export function DatabasesPlatter({ children }: { children: ReactNode }) {
  return (
    <span className="relative">
      {/* The window's bottom edge sits a little above the word's cap line, leaving a gap; anything below it
          stays submerged. Extra height above leaves room for the elephant's head. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[calc(100%+0.15em)] left-[62%] h-[2.15em] w-[2.6em] -translate-x-1/2 overflow-hidden"
      >
        <span className="absolute left-0 top-[1.1em] size-[2.6em] translate-y-[45%] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/intro:translate-y-0 motion-reduce:transition-none">
          <span className="databases-platter absolute inset-0 rounded-full" />
          {/* One whole elephant in front of the disk, its trunk resting on the platter. */}
          <img
            src={postgresql}
            alt=""
            draggable={false}
            className="databases-elephant absolute left-[0.15em] top-[-1em] size-[1.6em]"
          />
        </span>
      </span>
      {/* Slightly bolder on hover, faked by thickening the glyphs with a tight text shadow: a real weight
          change would widen the word and shift the rest of the bio. */}
      <span className="transition-[text-shadow] duration-300 [text-shadow:0_0_0_transparent] group-hover/intro:[text-shadow:0.3px_0_0_currentColor,-0.15px_0_0_currentColor] motion-reduce:transition-none">
        {children}
      </span>
    </span>
  );
}
