import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Python",
  description: "Python notes and tooling — Sandeep Kumar",
};

export default function PythonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col border-l-4 border-l-amber-600/90 bg-amber-950/[0.04] dark:bg-amber-400/[0.06]">
      <div className="border-b border-border/80 bg-card/40 px-4 py-6 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-amber-800 dark:text-amber-400">
          Python
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Scripts, stacks &amp; snippets
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          A dedicated shell for Python-related posts and experiments.
        </p>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
