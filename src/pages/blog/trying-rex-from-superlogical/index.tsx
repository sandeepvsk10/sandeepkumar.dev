import { publicAsset } from "@/lib/public-asset";
import { BlogPost, BlogPostMedia } from "@/components/blog-post";
import classicCrt from "./assets/classic-crt.svg";
import { ClaudeMascot } from "./components/claude-mascot";

export default function RexPostPage() {
  return (
    <BlogPost
      category="Terminal Connoisseuring"
      title="Trying Rex from Superlogical"
      icon={<img src={classicCrt} alt="" width={44} height={44} className="size-11 shrink-0" />}
    >
        <BlogPostMedia>
        <iframe
          src={publicAsset("/blog/trying-rex-from-superlogical/cover/index.html")}
          title="Rex blog cover: terminal panes splitting and expanding"
          className="block border-0"
          sandbox="allow-scripts"
        />
        </BlogPostMedia>
        <div className="flex items-center gap-2">
          <p className="text-base font-normal leading-6 text-zinc-500">
            First impression, multiplexer for the Agentic Era
          </p>
          <ClaudeMascot />
        </div>
        <footer className="flex flex-col gap-3 pt-6 text-xs leading-relaxed text-zinc-500">
          <p>
          Rex, Superlogical, and their logos are trademarks of their respective
          owners. This independent blog shares my personal experience with the
          product and is not affiliated with, sponsored by, or endorsed by
          Superlogical.
          </p>
          <p>
            Claude mascot artwork and animation by{" "}
            <a href="https://ayotomcs.me/claude-mascot" className="underline underline-offset-2">
              Wale-Durojaye Ayotomiwa (ayotomcs)
            </a>
            , adapted for this page. Apple and the Apple logo are trademarks of Apple Inc.
          </p>
        </footer>
    </BlogPost>
  );
}
