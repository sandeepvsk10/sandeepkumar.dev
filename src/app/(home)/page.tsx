import type { Metadata } from "next";

import { HomePageMasonary } from "./components/HomePageMasonary";

export const metadata: Metadata = {
  title: "sandeepkumar.dev",
  description: "Portfolio, projects, and much more — welcome!",
};

export default function HomePage() {
  return (
    <main className="flex w-full flex-1 flex-col py-12">
      <HomePageMasonary />
    </main>
  );
}
