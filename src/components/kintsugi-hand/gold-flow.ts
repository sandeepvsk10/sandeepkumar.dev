type Point = readonly [number, number];

function trace(start: number, points: readonly Point[]) {
  const segments = points.slice(1).map((to, index) => {
    const from = points[index];
    const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
    const segment = { from, to, start, length };
    start += length;
    return segment;
  });
  return {
    segments,
    start: segments[0].start,
    end: start,
    path: `M${points.map((point) => point.join(" ")).join(" L")}`,
  };
}

// Source-pixel coordinates. Split paths at the photographed junctions so
// each branch starts as the upstream flow reaches the split.
const palm = trace(36, [[273, 252], [282, 262], [291, 274], [302, 285], [311, 295]]);
const wrist = trace(176, [[369, 418], [358, 429], [342, 432], [330, 440], [316, 443], [301, 456], [283, 466]]);

export const goldTraces = [
  trace(0, [[331, 185], [335, 197], [336, 207], [341, 214], [341, 227], [344, 239], [346, 252], [345, 270], [344, 287], [350, 299]]),
  palm,
  trace(palm.end, [[311, 295], [321, 306], [332, 310], [340, 320], [349, 335], [362, 343]]),
  trace(palm.end, [[311, 295], [296, 288], [273, 282], [259, 285], [248, 292], [230, 284], [218, 281]]),
  trace(151, [[300, 379], [290, 385], [278, 389]]),
  wrist,
  trace(wrist.end, [[283, 466], [273, 491], [263, 504], [255, 510], [243, 528], [232, 539]]),
  trace(wrist.end, [[283, 466], [294, 486], [306, 504], [302, 515], [307, 528], [301, 537], [309, 544], [321, 555]]),
];

export const goldTraceLength = Math.max(...goldTraces.map((trace) => trace.end));
export const goldTraceWidth = 26;

// Each texel stores the arrival time of the nearest part of a traced seam.
// The photo still defines the exact shape and texture of the gold.
export function goldArrivalMap(size: number) {
  const arrivals = new Uint8Array(size * size);
  const nearest = new Float32Array(size * size).fill(Infinity);
  const radius = goldTraceWidth / 2;

  for (const { segments } of goldTraces) {
    for (const { from: [x, y], to: [endX, endY], start, length } of segments) {
      const dx = endX - x;
      const dy = endY - y;
      const maxRow = Math.min(size - 1, Math.ceil(Math.max(y, endY) + radius));
      const maxCol = Math.min(size - 1, Math.ceil(Math.max(x, endX) + radius));
      for (let row = Math.max(0, Math.floor(Math.min(y, endY) - radius)); row <= maxRow; row++) {
        for (let col = Math.max(0, Math.floor(Math.min(x, endX) - radius)); col <= maxCol; col++) {
          const along = Math.max(0, Math.min(1, ((col - x) * dx + (row - y) * dy) / length ** 2));
          const distance = (col - x - along * dx) ** 2 + (row - y - along * dy) ** 2;
          const index = row * size + col;
          if (distance > radius ** 2 || distance >= nearest[index]) continue;
          nearest[index] = distance;
          arrivals[index] = 1 + Math.round((start + along * length) / goldTraceLength * 253);
        }
      }
    }
  }

  return arrivals;
}
