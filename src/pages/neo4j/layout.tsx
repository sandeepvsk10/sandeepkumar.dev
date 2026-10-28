import { SitePageShell } from "@/components/site-page-shell";

import { Neo4jFooter } from "./components/neo4j-footer";
import { Neo4jHeader } from "./components/neo4j-header";

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
