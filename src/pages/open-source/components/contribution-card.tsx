import { GitMergeIcon, GitPullRequestIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Contribution } from "../constants/projects";

export function ContributionCard({ contribution }: { contribution: Contribution }) {
  const merged = contribution.status === "merged";

  return (
    <a
      href={contribution.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Pull request #${contribution.number}: ${contribution.title}, ${contribution.status}`}
      className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      <div className="flex aspect-[4/3] flex-col justify-between gap-6 rounded-2xl bg-muted/40 p-5 transition-colors group-hover:bg-muted/60">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-mono text-sm text-muted-foreground">#{contribution.number}</span>
          <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 capitalize ${merged ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" : "bg-background text-muted-foreground"}`}>
            <HugeiconsIcon icon={merged ? GitMergeIcon : GitPullRequestIcon} size={13} strokeWidth={1.7} aria-hidden="true" />
            {contribution.status}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium leading-snug tracking-tight">{contribution.title}</h4>
          <p className="text-xs leading-relaxed text-muted-foreground">{contribution.description}</p>
        </div>
      </div>
    </a>
  );
}
