import { lazy, Suspense, useEffect, type ComponentType, type ReactNode } from "react";
import { Link, Route, Routes, useLocation } from "react-router";

import routes from "./routes.json";

function lazySection(
  loadPage: () => Promise<{ default: ComponentType }>,
  loadLayout: () => Promise<{ default: ComponentType<{ children: ReactNode }> }>,
) {
  return lazy(async () => {
    // Fetch the page and its layout together, without a nested loading waterfall.
    const [{ default: Page }, { default: Layout }] = await Promise.all([loadPage(), loadLayout()]);
    return { default: function Section() { return <Layout><Page /></Layout>; } };
  });
}

const pages: Record<string, ComponentType> = {
  "/": lazySection(() => import("./pages/home"), () => import("./pages/home/layout")),
  "/blog": lazySection(() => import("./pages/blog"), () => import("./pages/blog/layout")),
  "/blog/build-around-and-find-out": lazySection(
    () => import("./pages/blog/build-around-and-find-out"),
    () => import("./pages/blog/build-around-and-find-out/layout"),
  ),
  "/blog/trying-rex-from-superlogical": lazySection(
    () => import("./pages/blog/trying-rex-from-superlogical"),
    () => import("./pages/blog/trying-rex-from-superlogical/layout"),
  ),
  "/dev-env": lazySection(() => import("./pages/dev-env"), () => import("./pages/dev-env/layout")),
  "/thamizh": lazySection(() => import("./pages/thamizh"), () => import("./pages/thamizh/layout")),
  "/open-source": lazySection(() => import("./pages/open-source"), () => import("./pages/open-source/layout")),
};

export function App() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, "") || "/";
  const metadata = routes.find((route) => route.path === path);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.title = metadata?.title ?? "Page not found · Sandeep";
  }, [metadata]);

  return (
    <Suspense fallback={<div className="flex-1" role="status" aria-label="Loading page" />}>
      <Routes>
        {routes.map(({ path }) => {
          const Page = pages[path];
          return <Route key={path} path={path} element={<Page />} />;
        })}
        <Route path="*" element={
          <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-16">
            <h1 className="text-2xl">Page not found</h1>
            <Link to="/" className="underline">← home</Link>
          </main>
        } />
      </Routes>
    </Suspense>
  );
}
