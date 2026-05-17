import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { publicAsset } from "@/lib/public-asset";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Sandeep Kumar",
    template: "%s · Sandeep Kumar",
  },
  description: "Portfolio and notes — sandeepkumar.dev",
  icons: {
    icon: [{ url: publicAsset("/sk.svg"), type: "image/svg+xml" }],
    shortcut: publicAsset("/sk.svg"),
    apple: publicAsset("/sk.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
