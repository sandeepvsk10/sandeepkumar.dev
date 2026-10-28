import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import routes from "../src/routes.json";

// GitHub Pages has no SPA rewrites. Give each known URL its own HTML entry.
const output = resolve("dist");
const template = await readFile(resolve(output, "index.html"), "utf8");
const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]!);

for (const route of routes) {
  const directory = resolve(output, route.path.slice(1));
  await mkdir(directory, { recursive: true });
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escape(route.description)}" />`);
  await writeFile(resolve(directory, "index.html"), html);
}
await writeFile(resolve(output, "404.html"), template
  .replace(/<title>.*?<\/title>/, "<title>Page not found · Sandeep Kumar</title>")
  .replace(/<meta name="description" content="[^"]*"\s*\/>/, '<meta name="description" content="This page could not be found." />'));
await writeFile(resolve(output, ".nojekyll"), "");
