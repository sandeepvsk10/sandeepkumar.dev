import { Link } from "react-router";

export default function BlogPage() {
  return (
    <main className="flex w-full flex-1 flex-col gap-4 py-12">
      <h1 className="text-3xl font-normal tracking-tight">Blog</h1>
      <Link
        to="/blog/build-around-and-find-out"
        className="w-fit text-lg underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
      >
        Build around and find out
      </Link>
      <Link
        to="/blog/trying-rex-from-superlogical"
        className="w-fit text-lg underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
      >
        Trying Rex from Superlogical
      </Link>
    </main>
  );
}
