import { BlogPost, BlogPostMedia } from "@/components/blog-post";

import findingGround from "./assets/finding-ground.png";
import darkActivity from "./assets/dark-activity.svg";
import { ThoughtTrace } from "./components/thought-trace";
import { CodingSlider } from "./components/coding-slider";

export default function BuildAroundPost() {
  return (
    <BlogPost
      category="Development"
      title="Build around and find out"
      icon={<img src={darkActivity} alt="" width={62} height={28} className="h-7 w-[62px] shrink-0" />}
    >
        <p className="text-base leading-7 text-zinc-600">
          Finding your footing in software development while the tools, the
          advice, and the way we write code keep changing. Read more code. Write
          less code. Let an agent do it. Where do you find your ground?
        </p>
        <figure className="relative isolate">
          <BlogPostMedia>
          <img
            src={findingGround}
            alt="Po listening to Master Oogway beneath a flowering tree in Kung Fu Panda"
            width={1280}
            height={532}
            className="block object-contain"
          />
          </BlogPostMedia>
          <div className="relative z-10 -mt-20 ml-auto w-[85%] max-w-[19rem] translate-x-4 sm:-mt-44 sm:translate-x-6 lg:translate-x-12">
            <ThoughtTrace />
          </div>
        </figure>
        <CodingSlider />
    </BlogPost>
  );
}
