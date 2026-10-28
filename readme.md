# sandeepkumar.dev

Sandeep Kumar's personal portfolio, built with React, Vite, TypeScript, and Tailwind CSS v4.

**Site:** [sandeepkumar.dev](https://sandeepvsk10.github.io/sandeepkumar.dev)

<img src="public/readme/car-with-computer.jpg" alt="hello" width="420" />

Find me on X: [@sandeepvsk10](https://x.com/sandeepvsk10).

## Development

Install [Bun](https://bun.sh/) (the pinned version is in `package.json`), then:

```sh
bun install
bun run dev
```

- `bun run build`: type-check, build with Vite, and generate static route entries in `dist/`.
- `bun run preview`: preview the production build locally.
- `bun run lint`: run ESLint.
- `bun run typecheck`: check TypeScript without emitting files.

Bun is the package manager and script runtime; Vite bundles the frontend. Commit `bun.lock` when changing dependencies. CI uses `bun install --frozen-lockfile`.

## Pages and structure

Pages: `/`, `/cool-companies`, `/dev-setup`, `/neo4j`, `/open-source`, `/python`, and `/thamizh`.

See [project-structure.md](project-structure.md) for page, layout, component, and routing conventions. The site is client-rendered with React Router; each known route also gets an HTML entry with its title and description so direct visits and refreshes work on static hosts. Unknown URLs display a custom 404 page.

## Deployment

The GitHub Pages workflow builds with Bun and uploads `dist/`. In repository Settings → Pages, set the source to **GitHub Actions**. The workflow automatically sets the base URL for project versus user/org sites.

For a manual subpath build:

```sh
VITE_BASE_PATH=/sandeepkumar.dev/ bun run build
bun run preview
```

The default base URL is `/`. Assets and navigation both respect `VITE_BASE_PATH`; use a leading and trailing slash.

Docker builds with Bun and serves the static files with unprivileged Nginx. Cloud Run's `PORT` environment variable is supported (default `8080`).

```sh
docker build -t sandeepkumar-dev .
docker run --rm -p 8080:8080 sandeepkumar-dev
```

## Thanks

Thanks to the maintainers of React, Vite, Bun, Tailwind CSS, GSAP, Motion, Lucide, and the other packages used by this portfolio.
