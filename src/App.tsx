import { useEffect, type ComponentType, type ReactNode } from "react";
import { Link, Route, Routes, useLocation } from "react-router";

import Home from "./pages/home";
import HomeLayout from "./pages/home/layout";
import CoolCompanies from "./pages/cool-companies";
import CoolCompaniesLayout from "./pages/cool-companies/layout";
import DevSetup from "./pages/dev-setup";
import DevSetupLayout from "./pages/dev-setup/layout";
import Neo4j from "./pages/neo4j";
import Neo4jLayout from "./pages/neo4j/layout";
import OpenSource from "./pages/open-source";
import OpenSourceLayout from "./pages/open-source/layout";
import Python from "./pages/python";
import PythonLayout from "./pages/python/layout";
import Thamizh from "./pages/thamizh";
import ThamizhLayout from "./pages/thamizh/layout";
import routes from "./routes.json";

const pages: Record<string, { Page: ComponentType; Layout: ComponentType<{ children: ReactNode }> }> = {
  "/": { Page: Home, Layout: HomeLayout },
  "/cool-companies": { Page: CoolCompanies, Layout: CoolCompaniesLayout },
  "/dev-setup": { Page: DevSetup, Layout: DevSetupLayout },
  "/neo4j": { Page: Neo4j, Layout: Neo4jLayout },
  "/open-source": { Page: OpenSource, Layout: OpenSourceLayout },
  "/python": { Page: Python, Layout: PythonLayout },
  "/thamizh": { Page: Thamizh, Layout: ThamizhLayout },
};

export function App() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, "") || "/";
  const metadata = routes.find((route) => route.path === path);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.title = metadata?.title ?? "Page not found · Sandeep Kumar";
    document.querySelector('meta[name="description"]')?.setAttribute(
      "content", metadata?.description ?? "This page could not be found.",
    );
  }, [metadata]);

  return (
    <>
      <Routes>
        {routes.map(({ path }) => {
          const { Page, Layout } = pages[path];
          return <Route key={path} path={path} element={<Layout><Page /></Layout>} />;
        })}
        <Route path="*" element={
          <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-16">
            <h1 className="text-2xl">Page not found</h1>
            <Link to="/" className="underline">← home</Link>
          </main>
        } />
      </Routes>
    </>
  );
}
