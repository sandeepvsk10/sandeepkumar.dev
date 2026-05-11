import { HomeFooter } from "./components/HomeFooter";
import { HomeHeader } from "./components/HomeHeader";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mx-auto flex w-full min-w-0 max-w-[1280px] flex-1 flex-col px-4 sm:px-6">
        <HomeHeader />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <HomeFooter />
      </div>
    </div>
  );
}
