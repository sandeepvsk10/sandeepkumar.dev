import Link from "next/link";

export function OpenSourceHeader() {
  return (
    <header className="border-b border-amber-500/30 pb-10 pt-[60px]">
      <Link
        href="/"
        className="inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← home
      </Link>
    </header>
  );
}
