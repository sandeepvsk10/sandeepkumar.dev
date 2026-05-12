import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thamizh",
  description: "Tamil language — Sandeep Kumar",
};

export default function ThamizhLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col border-l-4 border-l-teal-600/90 bg-teal-950/[0.04] dark:bg-teal-400/[0.07]">
      <div className="border-b border-border/80 bg-card/40 px-4 py-6 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-teal-700 dark:text-teal-400">
          Thamizh
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight" lang="ta">
          தமிழ்
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Notes and writing related to Tamil language and culture.
        </p>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
