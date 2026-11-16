import { useId, useState } from "react";
import { ReplayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { publicAsset } from "@/lib/public-asset";

import "./open-source-logo.css";

const CENTER = 256;
const OUTER_RADIUS = 189;
const INNER_RADIUS = 42;
const GAP_ANGLE = 17 * Math.PI / 180;
const gapPoint = (radius: number, side: number) =>
  `${CENTER + side * radius * Math.sin(GAP_ANGLE)} ${CENTER + radius * Math.cos(GAP_ANGLE)}`;
const outerLeft = gapPoint(OUTER_RADIUS, -1);
const outerRight = gapPoint(OUTER_RADIUS, 1);
const innerLeft = gapPoint(INNER_RADIUS, -1);
const innerRight = gapPoint(INNER_RADIUS, 1);
// The fill and both cuts share the exact circle intersections used by the skeleton.
const logoPath = `M${outerLeft}A${OUTER_RADIUS} ${OUTER_RADIUS} 0 1 1 ${outerRight}L${innerRight}A${INNER_RADIUS} ${INNER_RADIUS} 0 1 0 ${innerLeft}Z`;
const gapPath = `M${CENTER} ${CENTER}L${gapPoint(512, -1)}L${gapPoint(512, 1)}Z`;

function createTangents(radius: number) {
  const low = CENTER - radius;
  const high = CENTER + radius;
  // The SVG occupies half of the 16:10 card. Visible overflow lets the guides
  // use the rest of that card while the mark keeps its current size.
  const startX = () => -224 + Math.floor(Math.random() * 144);
  const endX = () => 592 + Math.floor(Math.random() * 144);
  const startY = () => -40 + Math.floor(Math.random() * 48);
  const endY = () => 504 + Math.floor(Math.random() * 48);
  return [
    `M${startX()} ${low}H${endX()}`,
    `M${high} ${startY()}V${endY()}`,
    `M${endX()} ${high}H${startX()}`,
    `M${low} ${endY()}V${startY()}`,
  ];
}

const createConstruction = () => [...createTangents(OUTER_RADIUS), ...createTangents(INNER_RADIUS)];

export function OpenSourceLogo() {
  const [animation, setAnimation] = useState(() => ({ replay: 0, tangents: createConstruction() }));
  const id = useId();
  const gradientId = `${id}-fill-gradient`;
  const fillMaskId = `${id}-fill-mask`;
  const gapMaskId = `${id}-gap-mask`;
  const avatarClipId = `${id}-avatar-clip`;

  return (
    <>
      <svg
        key={animation.replay}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        role="img"
        aria-label="Open source logo with Sandeep’s profile photo overlapping its upper-left edge"
        className="oss-construction h-auto w-1/2 text-[#4caf50]"
      >
        <defs>
          <clipPath id={avatarClipId}>
            <circle cx="100" cy="138" r="56" />
          </clipPath>
          <radialGradient id={gradientId}>
            <stop offset="0.72" stopColor="white" />
            <stop offset="1" stopColor="black" />
          </radialGradient>
          <mask id={fillMaskId} x="0" y="0" width="512" height="512" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }}>
            <circle className="oss-fill-wave" cx={CENTER} cy={CENTER} r="300" fill={`url(#${gradientId})`} />
          </mask>
          <mask id={gapMaskId} x="0" y="0" width="512" height="512" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }}>
            <rect width="512" height="512" fill="white" />
            <path className="oss-open-gap" d={gapPath} fill="black" />
          </mask>
        </defs>
        <g className="oss-guides" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2">
          {/* Four contributions arrive from different sides to establish the bounds. */}
          <path className="oss-tangent oss-tangent-top" pathLength="1" d={animation.tangents[0]} />
          <path className="oss-tangent oss-tangent-right" pathLength="1" d={animation.tangents[1]} />
          <path className="oss-tangent oss-tangent-bottom" pathLength="1" d={animation.tangents[2]} />
          <path className="oss-tangent oss-tangent-left" pathLength="1" d={animation.tangents[3]} />
          <path className="oss-tangent oss-inner-tangent-top" pathLength="1" d={animation.tangents[4]} />
          <path className="oss-tangent oss-inner-tangent-right" pathLength="1" d={animation.tangents[5]} />
          <path className="oss-tangent oss-inner-tangent-bottom" pathLength="1" d={animation.tangents[6]} />
          <path className="oss-tangent oss-inner-tangent-left" pathLength="1" d={animation.tangents[7]} />
          <g mask={`url(#${gapMaskId})`}>
            <circle className="oss-circle oss-circle-outer" pathLength="1" cx={CENTER} cy={CENTER} r={OUTER_RADIUS} transform="rotate(-90 256 256)" />
            {/* Sweep flag 0 traces anticlockwise from the top, opposite the outer circle. */}
            <path className="oss-circle oss-circle-inner" strokeWidth="3" pathLength="1" d={`M256 214A${INNER_RADIUS} ${INNER_RADIUS} 0 1 0 256 298A${INNER_RADIUS} ${INNER_RADIUS} 0 1 0 256 214`} />
          </g>
          <path className="oss-cut oss-cut-left" pathLength="1" d={`M${innerLeft}L${outerLeft}`} />
          <path className="oss-cut oss-cut-right" pathLength="1" d={`M${innerRight}L${outerRight}`} />
        </g>
        <g className="oss-anchors" fill="currentColor">
          <circle cx="256" cy="67" r="4" />
          <circle cx="445" cy="256" r="4" />
          <circle cx="256" cy="445" r="4" />
          <circle cx="67" cy="256" r="4" />
        </g>
        <path
          className="oss-finished-mark"
          d={logoPath}
          fill="currentColor"
          mask={`url(#${fillMaskId})`}
        />
        <g className="oss-avatar">
          <circle cx="100" cy="138" r="64" fill="var(--background)" />
          <image
            href={publicAsset("/home/portfolio.webp")}
            x="44"
            y="82"
            width="112"
            height="112"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${avatarClipId})`}
          />
        </g>
      </svg>
      <button
        type="button"
        aria-label="Replay logo animation"
        title="Replay animation"
        onClick={() => {
          const tangents = createConstruction();
          setAnimation(current => ({ replay: current.replay + 1, tangents }));
        }}
        className="oss-replay absolute bottom-3 right-3 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <HugeiconsIcon icon={ReplayIcon} size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </>
  );
}
