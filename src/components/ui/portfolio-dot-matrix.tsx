"use client";

import type { CSSProperties } from "react";

import {
  DotMatrixBase,
  createPathWaveResolver,
  diagonalSnakeNormFromIndex,
  diagonalSnakeOrderValue,
  middleRingAntiClockwiseNormFromIndex,
  middleRingAntiClockwiseOrderValue,
  outerRingClockwiseNormFromIndex,
  outerRingClockwiseOrderValue,
  rowWaveNormFromIndex,
  spiralInwardNormFromIndex,
  spiralInwardOrderValue,
  trBlPathNormFromIndex,
  useDotMatrixPhases,
  usePrefersReducedMotion,
  type DotAnimationResolver,
  type DotMatrixCommonProps,
  type MatrixPattern,
} from "@dotmatrix/core";

export type DotMatrixVariant =
  | "spiral"
  | "diagonal-snake"
  | "outer-ring"
  | "middle-ring"
  | "path-trbl"
  | "path-row"
  | "ripple"
  | "ripple-echo"
  | "center-ripple";

const pathTrblResolver = createPathWaveResolver(({ index }) =>
  trBlPathNormFromIndex(index)
);

const pathRowResolver = createPathWaveResolver(({ index }) =>
  rowWaveNormFromIndex(index)
);

const spiralResolver: DotAnimationResolver = ({
  isActive,
  index,
  reducedMotion,
  phase,
}) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  const order = spiralInwardOrderValue(index);
  const pathNorm = spiralInwardNormFromIndex(index);
  const style = { "--dmx-spiral-order": order } as CSSProperties;

  if (reducedMotion || phase === "idle") {
    return {
      style: {
        ...style,
        opacity: 0.16 + pathNorm * 0.78,
      },
    };
  }

  return { className: "dmx-spiral-snake", style };
};

const diagonalSnakeResolver: DotAnimationResolver = ({
  isActive,
  index,
  reducedMotion,
  phase,
}) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  const order = diagonalSnakeOrderValue(index);
  const pathNorm = diagonalSnakeNormFromIndex(index);
  const style = { "--dmx-diagonal-snake-order": order } as CSSProperties;

  if (reducedMotion || phase === "idle") {
    return {
      style: {
        ...style,
        opacity: 0.16 + pathNorm * 0.78,
      },
    };
  }

  return { className: "dmx-diagonal-snake", style };
};

const outerRingResolver: DotAnimationResolver = ({
  isActive,
  index,
  reducedMotion,
  phase,
}) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  const order = outerRingClockwiseOrderValue(index);
  if (order < 0) {
    return { className: "dmx-inactive" };
  }

  const pathNorm = outerRingClockwiseNormFromIndex(index);
  const style = { "--dmx-outer-order": order } as CSSProperties;

  if (reducedMotion || phase === "idle") {
    return {
      style: {
        ...style,
        opacity: 0.16 + pathNorm * 0.78,
      },
    };
  }

  return { className: "dmx-outer-snake", style };
};

const middleRingResolver: DotAnimationResolver = ({
  isActive,
  index,
  reducedMotion,
  phase,
}) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  const order = middleRingAntiClockwiseOrderValue(index);
  if (order < 0) {
    return { className: "dmx-inactive" };
  }

  const pathNorm = middleRingAntiClockwiseNormFromIndex(index);
  const style = { "--dmx-middle-order": order } as CSSProperties;

  if (reducedMotion || phase === "idle") {
    return {
      style: {
        ...style,
        opacity: 0.16 + pathNorm * 0.78,
      },
    };
  }

  return { className: "dmx-middle-snake", style };
};

const rippleResolver: DotAnimationResolver = ({
  isActive,
  distanceFromCenter,
  reducedMotion,
  phase,
}) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  const ring = Math.round(distanceFromCenter);
  const style = { "--dmx-ripple-ring": ring } as CSSProperties;

  if (reducedMotion || phase === "idle") {
    return {
      style: {
        ...style,
        opacity: 0.16 + (ring / 3) * 0.78,
      },
    };
  }

  return { className: "dmx-ripple", style };
};

const rippleEchoResolver: DotAnimationResolver = ({
  isActive,
  distanceFromCenter,
  row,
  col,
  reducedMotion,
  phase,
}) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  const ring = Math.round(distanceFromCenter);
  const parity = (row + col) % 2;
  const style = {
    "--dmx-ripple-ring": ring,
    "--dmx-ripple-parity": parity,
  } as CSSProperties;

  if (reducedMotion || phase === "idle") {
    return {
      style: {
        ...style,
        opacity: 0.12 + (ring / 3) * 0.72,
      },
    };
  }

  return { className: "dmx-ripple-echo", style };
};

const centerRippleResolver: DotAnimationResolver = ({
  isActive,
  manhattanDistance,
  reducedMotion,
  phase,
}) => {
  if (!isActive) {
    return { className: "dmx-inactive" };
  }

  const ring = Math.round(manhattanDistance);
  const style = { "--dmx-center-ripple-ring": ring } as CSSProperties;

  if (reducedMotion || phase === "idle") {
    return {
      style: {
        ...style,
        opacity: 0.16 + (ring / 4) * 0.78,
      },
    };
  }

  return { className: "dmx-center-origin-ripple", style };
};

const VARIANT_RESOLVERS: Record<DotMatrixVariant, DotAnimationResolver> = {
  spiral: spiralResolver,
  "diagonal-snake": diagonalSnakeResolver,
  "outer-ring": outerRingResolver,
  "middle-ring": middleRingResolver,
  "path-trbl": pathTrblResolver,
  "path-row": pathRowResolver,
  ripple: rippleResolver,
  "ripple-echo": rippleEchoResolver,
  "center-ripple": centerRippleResolver,
};

const VARIANT_PATTERNS: Record<DotMatrixVariant, MatrixPattern> = {
  spiral: "full",
  "diagonal-snake": "full",
  "outer-ring": "outline",
  "middle-ring": "rings",
  "path-trbl": "full",
  "path-row": "full",
  ripple: "diamond",
  "ripple-echo": "cross",
  "center-ripple": "full",
};

export type PortfolioDotMatrixProps = DotMatrixCommonProps & {
  variant: DotMatrixVariant;
};

export function PortfolioDotMatrix({
  variant,
  pattern,
  speed = 0.65,
  animated = true,
  hoverAnimated = false,
  ...rest
}: PortfolioDotMatrixProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { phase, onMouseEnter, onMouseLeave } = useDotMatrixPhases({
    animated: Boolean(animated && !reducedMotion),
    hoverAnimated: Boolean(hoverAnimated && !reducedMotion),
    speed,
  });

  return (
    <DotMatrixBase
      {...rest}
      speed={speed}
      pattern={pattern ?? VARIANT_PATTERNS[variant]}
      phase={phase}
      reducedMotion={reducedMotion}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      animationResolver={VARIANT_RESOLVERS[variant]}
    />
  );
}
