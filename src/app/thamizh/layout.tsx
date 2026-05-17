import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thamizh",
  description: "Tamil language — Sandeep Kumar",
};

export default function ThamizhLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
