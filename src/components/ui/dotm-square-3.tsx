"use client";

import {
  PortfolioDotMatrix,
  type DotMatrixVariant,
  type PortfolioDotMatrixProps,
} from "@/components/ui/portfolio-dot-matrix";

export type DotmSquare3Props = Omit<PortfolioDotMatrixProps, "variant">;

export function DotmSquare3(props: DotmSquare3Props) {
  return <PortfolioDotMatrix variant="spiral" {...props} />;
}

export type { DotMatrixVariant };
