import type { ReactNode } from "react";
import { Link } from "react-router";

import "./blog-post.css";

export function BlogPostLayout({ children }: { children: ReactNode }) {
  return <div className="blog-post min-h-screen flex-1 bg-white text-zinc-950">{children}</div>;
}

export function BlogPost({
  category,
  icon,
  title,
  children,
}: {
  category: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
      <article className="flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <Link to="/blog" className="w-fit text-sm text-zinc-500 hover:text-zinc-950">
            ← blog
          </Link>
          <p className="flex min-h-11 items-center gap-2 text-xl font-light tracking-tight text-zinc-500 sm:text-2xl">
            <span>{category}</span>
            <span className="blog-category-icon inline-flex h-11 shrink-0 items-center">{icon}</span>
          </p>
          <h1 className="text-3xl font-normal tracking-tight text-zinc-950 sm:text-4xl">
            {title}
          </h1>
        </header>
        {children}
      </article>
    </main>
  );
}

export function BlogPostMedia({ children }: { children: ReactNode }) {
  return <div className="aspect-video w-full [&>iframe]:h-full [&>iframe]:w-full [&>img]:h-full [&>img]:w-full">{children}</div>;
}
