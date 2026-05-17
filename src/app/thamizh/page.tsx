import { Tiro_Tamil } from "next/font/google";

const tiroTamil = Tiro_Tamil({
  weight: "400",
  subsets: ["tamil"],
  display: "swap",
});

export default function ThamizhPage() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <h1
        className={`${tiroTamil.className} text-7xl leading-none sm:text-8xl md:text-9xl`}
        lang="ta"
      >
        தமிழ்
      </h1>
    </main>
  );
}
