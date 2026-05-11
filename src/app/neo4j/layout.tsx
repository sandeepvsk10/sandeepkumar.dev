import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neo4j",
  description: "Graph databases and Cypher — Sandeep Kumar",
};

export default function Neo4jLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col border-l-4 border-l-sky-600/90 bg-sky-950/[0.04] dark:bg-sky-400/[0.07]">
      <div className="border-b border-border/80 bg-card/40 px-4 py-6 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-sky-700 dark:text-sky-400">
          Neo4j
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Graph data &amp; Cypher
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Notes and examples for Neo4j — models, queries, and ops patterns.
        </p>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
