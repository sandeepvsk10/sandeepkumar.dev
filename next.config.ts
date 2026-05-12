import type { NextConfig } from "next";

/**
 * GitHub Pages project sites are served from a subpath (`/repo-name`).
 * Set at build time, e.g. `NEXT_PUBLIC_BASE_PATH=/my-repo` (leading slash, no trailing slash).
 * For a user/org site at the domain root (`username.github.io`), leave unset.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
