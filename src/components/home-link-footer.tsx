import { Link } from "react-router";

export function HomeLinkFooter({ divider = true }: { divider?: boolean }) {
  return (
    <footer className={`flex justify-start pb-[60px] pt-10${divider ? " border-t border-border/60" : ""}`}>
      <Link
        to="/"
        className="w-fit text-sm text-zinc-500 transition-colors hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        home
      </Link>
    </footer>
  );
}
