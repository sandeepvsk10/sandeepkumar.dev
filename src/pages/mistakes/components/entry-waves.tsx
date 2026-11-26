const ribbon = Array.from({ length: 28 }, (_, index) => {
  const t = index / 27;
  return `M -22 ${85 + 45 * t}
    C ${100 + 28 * t} ${29 - 28 * t}, ${147 + 31 * t} ${-9 + 36 * t}, ${167 + 10 * t} ${39 + 9 * t}
    C ${175 + 94 * t} ${99 + 23 * t}, ${111 + 120 * t} ${228 - 3 * t}, ${232 + 76 * t} ${184 - 14 * t}
    C ${302 - 8 * t} ${159 + 73 * t}, ${344 + 33 * t} ${119 + 99 * t}, 422 ${160 + 32 * t}`;
});

const fan = Array.from({ length: 22 }, (_, index) => {
  const t = index / 21;
  return `M ${-56 + 166 * t} -22
    C ${-22 + 136 * t} ${103 + 54 * t}, ${92 + 121 * t} ${192 + 38 * t}, ${213 + 43 * t} ${146 + 71 * t}
    S ${341 - 28 * t} ${101 + 93 * t}, 424 ${119 + 96 * t}`;
});

const crossing = Array.from({ length: 16 }, (_, index) => {
  const t = index / 15;
  return `M -22 ${170 + 57 * t}
    C ${46 + 29 * t} ${182 - 102 * t}, ${116 + 33 * t} ${-9 + 82 * t}, ${158 + 36 * t} ${103 + 34 * t}
    S ${221 + 24 * t} ${218 - 6 * t}, 424 ${112 + 93 * t}`;
});

export function EntryWaves({ variant }: { variant: "ribbon" | "fan" }) {
  const paths = variant === "ribbon" ? ribbon : fan;

  return (
    <svg
      className="mistakes-entry-waves"
      viewBox="0 0 400 220"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.65"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((path, index) => (
        <path key={path} d={path} strokeOpacity={0.42 + 0.42 * index / paths.length} vectorEffect="non-scaling-stroke" />
      ))}
      {variant === "fan" && (
        <g strokeOpacity="0.33">
          {crossing.map((path) => (
            <path key={path} d={path} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      )}
    </svg>
  );
}
