/**
 * URL for files in `public/` when using `basePath` (e.g. GitHub Pages project sites).
 * Set `NEXT_PUBLIC_BASE_PATH` at build time to match `next.config.ts` (e.g. `/sandeepkumar.dev`).
 */
export function publicAsset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
