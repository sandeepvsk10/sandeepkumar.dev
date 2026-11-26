import { useId } from "react";
import { Link } from "react-router";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { handSilhouette } from "@/components/kintsugi-hand/hand-silhouette";
import handImage from "@/components/kintsugi-hand/porcelain-hand.png";

export function KintsugiProjectCard() {
  const silhouetteId = useId();

  return (
    <Link
      to="/experiments"
      className="group block rounded-[calc(var(--radius)+var(--project-card-inset)+1px)] border border-border bg-muted p-(--project-card-inset) transition-colors [--project-card-inset:0.5rem] hover:bg-muted/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 640 288"
        className="block aspect-[20/9] w-full overflow-hidden rounded-lg bg-[radial-gradient(ellipse_at_top,#303034,#131313_75%)]"
      >
        <defs>
          <clipPath id={silhouetteId}>
            <path d={handSilhouette} clipRule="evenodd" />
          </clipPath>
        </defs>
        <image
          href={handImage}
          width="564"
          height="564"
          clipPath={`url(#${silhouetteId})`}
          transform="translate(151 -3) scale(.67)"
        />
      </svg>
      <div className="flex items-center justify-between gap-3 px-2 py-2.5">
        <div>
          <h3 className="text-sm leading-4 font-medium text-foreground">This portfolio</h3>
          <p className="text-[0.6875rem] leading-3.5 text-muted-foreground">Kintsugi hand experiment</p>
        </div>
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          size={17}
          strokeWidth={1.7}
          aria-hidden="true"
          className="shrink-0 text-foreground transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
        />
      </div>
    </Link>
  );
}
