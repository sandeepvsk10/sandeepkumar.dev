import { useEffect, useState } from "react";

import { publicAsset } from "@/lib/public-asset";

interface TileImageSlideshowProps {
  images: string[];
  intervalMs?: number;
}

export function TileImageSlideshow({
  images,
  intervalMs = 3000,
}: TileImageSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden rounded-2xl">
      <div className="absolute inset-0 transition-[filter,transform] duration-500 ease-out group-hover:scale-110 group-hover:blur-md">
        {images.map((src, index) => (
          <img
            key={src}
            src={publicAsset(src)}
            alt=""
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/25" />
    </div>
  );
}
