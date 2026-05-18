import Link from "next/link";

export function DevSetupFooter() {
  return (
    <footer className="flex flex-col gap-3 border-t border-border/60 pb-[60px] pt-10">
      <Link
        href="/"
        className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← home
      </Link>
    </footer>
  );
}
