import { Tiro_Tamil } from "next/font/google";

const tiroTamil = Tiro_Tamil({
  weight: "400",
  subsets: ["tamil"],
  display: "swap",
});

export default function ThamizhPage() {
  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center py-12">
      <h1
        className={`${tiroTamil.className} text-7xl leading-none sm:text-8xl md:text-9xl`}
        lang="ta"
      >
        தமிழ்
      </h1>
    </main>
  );
}
