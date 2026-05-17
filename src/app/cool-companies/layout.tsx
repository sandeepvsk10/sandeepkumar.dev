import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cool companies",
  description:
    "Interesting companies to watch — photonics, tooling, and more — Sandeep Kumar",
};

export default function CoolCompaniesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col border-l-4 border-l-sky-600/90 bg-sky-950/[0.04] dark:bg-sky-400/[0.07]">
      <div className="border-b border-border/80 bg-card/40 px-4 py-6 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-sky-700 dark:text-sky-400">
          Cool companies
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Companies worth watching
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          A running list of teams doing notable work—starting with photonics.
        </p>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
