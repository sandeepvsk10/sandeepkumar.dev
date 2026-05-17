import type { NextConfig } from "next";

/**
 * GitHub Pages project sites are served from a subpath (`/repo-name`).
 * Set at build time, e.g. `NEXT_PUBLIC_BASE_PATH=/my-repo` (leading slash, no trailing slash).
 * For a user/org site at the domain root (`username.github.io`), leave unset.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Docker / Cloud Run: set `NEXT_STANDALONE=true` at build time for `output: "standalone"`. */
const isStandalone = process.env.NEXT_STANDALONE === "true";

const nextConfig: NextConfig = {
  ...(isStandalone
    ? { output: "standalone" }
    : {
        output: "export",
        images: { unoptimized: true },
      }),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
