/** Resolve public files against Vite's base URL, including GitHub Pages subpaths. */
export function publicAsset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
