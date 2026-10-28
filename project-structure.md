# Project structure

The site uses React, Vite, TypeScript, Tailwind CSS v4, and React Router.
Bun installs dependencies and runs Vite for development and production builds.

- `index.html`: document shell and Vite entry.
- `src/main.tsx`: React root, BrowserRouter, global stylesheet.
- `src/App.tsx`: explicit route-to-page/layout mapping and navigation metadata.
- `src/routes.json`: URL, title, and description for each public page; shared by the app and static entry generator.
- `src/pages/home/`: home page, layout, components, and constants.
- `src/pages/<section>/`: section `index.tsx`, `layout.tsx`, and local `components/` and `constants/` as needed.
- `src/components/`: reusable UI, animation primitives, dock, and page shell.
- `src/lib/`: shared utilities, including base-aware public asset URLs.
- `src/styles.css`: Tailwind entry, locally bundled fonts, and theme tokens.
- `public/`: static assets copied unchanged into the build.
- `scripts/static-routes.ts`: generates per-route HTML entries and a 404 document for static hosting.

Add a page to `src/pages/`, register its metadata in `src/routes.json`, and map its component and layout in `src/App.tsx`. Use React Router's `Link` and `useNavigate` for internal navigation. Resolve public assets through `publicAsset()` so GitHub Pages subpaths work.

Keep route-specific code local. Use `@/` for shared imports and relative imports within a route. No server/client component directives are needed.

The home page keeps its own header/footer. Each section supplies its own layout; `SitePageShell` provides the shared max-width structure. Fonts are bundled from Fontsource packages without build-time Google Fonts requests.
