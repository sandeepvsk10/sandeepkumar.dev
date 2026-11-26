import { Butterfly } from "./butterfly/butterfly";

/** Shared max-width shell; each route supplies its own header and footer. */
export function SitePageShell({
  header,
  footer,
  children,
  showButterfly = true,
}: Readonly<{
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
  showButterfly?: boolean;
}>) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mx-auto flex min-h-full w-full min-w-0 max-w-[1280px] flex-1 flex-col px-4 sm:px-6">
        {header}
        <div className="relative flex min-h-0 flex-1 flex-col">
          {children}
          {showButterfly && <Butterfly />}
        </div>
        <div className="mt-auto shrink-0">{footer}</div>
      </div>
    </div>
  );
}
