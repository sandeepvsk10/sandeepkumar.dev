import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev Setup",
  description: "Development environment and tooling — Sandeep Kumar",
};

export default function DevSetupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col border-l-4 border-l-violet-600/90 bg-violet-950/[0.04] dark:bg-violet-400/[0.07]">
      <div className="border-b border-border/80 bg-card/40 px-4 py-6 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-violet-700 dark:text-violet-400">
          Dev Setup
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Dev environment &amp; tooling
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          My development setup — editors, terminals, extensions, and configuration.
        </p>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
