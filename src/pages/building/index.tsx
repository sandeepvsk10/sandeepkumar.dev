import { KintsugiProjectCard } from "@/components/kintsugi-project-card";
import { RiseIn } from "@/components/rise-in";

export default function BuildingPage() {
  return (
    <main className="grid w-full flex-1 content-start gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
      <RiseIn>
        <KintsugiProjectCard />
      </RiseIn>
    </main>
  );
}
