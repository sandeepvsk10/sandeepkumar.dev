import { Link } from "react-router";

import { BLOG_POSTS } from "@/lib/blog-posts";

export default function BlogPage() {
  return (
    <main className="flex w-full flex-1 flex-col gap-4 py-12">
      <h1 className="text-3xl font-normal tracking-tight">Blog</h1>
      {BLOG_POSTS.map(({ title, url }) => (
        <Link
          key={url}
          to={url}
          className="w-fit text-lg underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
        >
          {title}
        </Link>
      ))}
    </main>
  );
}
