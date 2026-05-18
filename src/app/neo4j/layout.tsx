import type { Metadata } from "next";

import { SitePageShell } from "@/components/site-page-shell";

import { Neo4jFooter } from "./components/neo4j-footer";
import { Neo4jHeader } from "./components/neo4j-header";

export const metadata: Metadata = {
  title: "Neo4j",
  description: "Graph databases and Cypher — Sandeep Kumar",
};

export default function Neo4jLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SitePageShell header={<Neo4jHeader />} footer={<Neo4jFooter />}>
      {children}
    </SitePageShell>
  );
}
