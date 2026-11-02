import { useEffect, type ComponentType, type ReactNode } from "react";
import { Link, Route, Routes, useLocation } from "react-router";

import Home from "./pages/home";
import HomeLayout from "./pages/home/layout";
import Blog from "./pages/blog";
import BlogLayout from "./pages/blog/layout";
import RexPost from "./pages/blog/trying-rex-from-superlogical";
import RexPostLayout from "./pages/blog/trying-rex-from-superlogical/layout";
import BuildAroundPost from "./pages/blog/build-around-and-find-out";
import BuildAroundLayout from "./pages/blog/build-around-and-find-out/layout";
import DevEnv from "./pages/dev-env";
import DevEnvLayout from "./pages/dev-env/layout";
import Thamizh from "./pages/thamizh";
import ThamizhLayout from "./pages/thamizh/layout";
import routes from "./routes.json";

const pages: Record<string, { Page: ComponentType; Layout: ComponentType<{ children: ReactNode }> }> = {
  "/": { Page: Home, Layout: HomeLayout },
  "/blog": { Page: Blog, Layout: BlogLayout },
  "/blog/build-around-and-find-out": { Page: BuildAroundPost, Layout: BuildAroundLayout },
  "/blog/trying-rex-from-superlogical": { Page: RexPost, Layout: RexPostLayout },
  "/dev-env": { Page: DevEnv, Layout: DevEnvLayout },
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
