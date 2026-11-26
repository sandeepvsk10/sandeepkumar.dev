import { KintsugiHand } from "@/components/kintsugi-hand/kintsugi-hand";
import { ProceduralHand } from "./components/procedural-hand/procedural-hand";

export default function ExperimentsPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-normal tracking-tight">Experiments</h1>
        <h2 className="text-base text-muted-foreground">Kintsugi hand</h2>
      </header>
      <KintsugiHand />
      <section className="flex flex-col gap-6 pt-8">
        <h2 className="text-base text-muted-foreground">Procedural porcelain hand</h2>
        <ProceduralHand />
      </section>
    </main>
  );
}
