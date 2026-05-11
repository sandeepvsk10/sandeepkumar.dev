import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open source",
  description: "Projects and contributions — Sandeep Kumar",
};

export default function OpenSourceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col border-l-4 border-l-emerald-600/90 bg-emerald-950/[0.03] dark:bg-emerald-400/[0.06]">
      <div className="border-b border-border/80 bg-card/40 px-4 py-6 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Open source
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Libraries &amp; contributions
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Everything here lives under this layout — add repos, write-ups, and
          release notes as you go.
        </p>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
