# Project structure

The site uses React, Vite, TypeScript, Tailwind CSS v4, and React Router.
Bun installs dependencies and runs Vite for development and production builds.

- `index.html`: document shell and Vite entry.
- `src/main.tsx`: React root, BrowserRouter, global stylesheet.
- `src/App.tsx`: explicit route-to-page/layout mapping and navigation metadata.
- `src/routes.json`: URL, title, and description for each public page, used by React Router and client-side metadata updates.
- `src/pages/home/`: home page, layout, components, and constants.
- `src/pages/<section>/`: section `index.tsx`, `layout.tsx`, and local `components/` and `constants/` as needed.
- `src/components/`: reusable UI, animation primitives, and page shell.
- `src/components/ui/`: shadcn/ui Base UI components using the Rhea preset, alongside existing custom UI. Configuration lives in `components.json`; add components with `bunx --bun shadcn@latest add <component>`. Hugeicons is the configured icon library.
- `src/lib/`: shared utilities, including base-aware public asset URLs.
- `src/styles.css`: Tailwind entry, locally bundled fonts, and theme tokens.
- `public/`: static assets copied unchanged into the build.

Add a page to `src/pages/`, register its metadata in `src/routes.json`, and map its component and layout in `src/App.tsx`. Use React Router's `Link` and `useNavigate` for internal navigation. Resolve public assets through `publicAsset()` so GitHub Pages subpaths work.

Keep route-specific code local. Use `@/` for shared imports and relative imports within a route. No server/client component directives are needed.

The blog's illustrative chat composer uses shadcn Input Group, Textarea, and Button components. It remains disabled and does not call an AI service. Preserve existing theme tokens and font imports when adding components.

The custom cursor is browser-native CSS, with no React overlay, hidden native pointer, or mouse-event tracking. `public/cursors/site-cursor.css` and its relative SVG asset are shared by the app (a public-asset link in `index.html`, rewritten by Vite for the configured base) and the sandboxed Rex cover iframe (relative link). Every local embedded HTML document must load that stylesheet; parent CSS does not cross iframe boundaries. Clickable elements use hand pointers, editors use text cursors, and disabled controls use not-allowed. Touch/coarse pointers and forced-colors mode retain native defaults. ReactDrops artwork notices are retained in `src/components/reactdrops-LICENSE.txt`.

Blog posts live directly under `src/pages/blog/<title-slug>/` and use `/blog/<title-slug>` URLs. Categories appear within posts rather than in URL segments. The Blog listing shows post titles only.

The home page keeps its own header/footer. Each section supplies its own layout; `SitePageShell` provides the shared max-width structure. Fonts are bundled from Fontsource packages without build-time Google Fonts requests.

The experimental `HomeEntrance` lazy-loads ReactDrops Liquid Glass Logo with the site's black `.sk` favicon and light glass on white before mounting the homepage. Its completion event holds the finished logo briefly, then fades it out before showing the page. Toggle `HOME_FEATURES.liquidGlassEntrance` in `src/pages/home/constants/feature-flags.ts` to bypass the entrance entirely. It respects reduced motion, retains the renderer's image fallback, and fails open on errors or after eight seconds. Glass shaders and responsive fitting remain from the installed registry source; the renderer adds an optional completion callback.

Vite produces a single `dist/index.html`. Nginx falls back to this file for app URLs, so React Router handles direct visits and refreshes. Page titles, descriptions, and the not-found screen are updated in the browser. GitHub Pages still serves the build, but direct visits or refreshes on nested URLs return its default 404 because it has no SPA fallback configuration.
