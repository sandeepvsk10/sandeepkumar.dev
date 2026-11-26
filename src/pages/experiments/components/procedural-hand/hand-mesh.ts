import { buildHand } from "./hand-model";
import type { HandSdf, Nail } from "./hand-model";

export type HandMesh = {
  positions: Float32Array;
  normals: Float32Array;
  occlusion: Float32Array;
  // Normalized distance across the skin from the index fingertip; drives the gold flow.
  flow: Float32Array;
  indices: Uint32Array;
  fingertip: [number, number, number];
  fingertipDirection: [number, number, number];
  nails: Nail[];
};

const blockSize = 8;

function sampleGrid(sdf: HandSdf, min: number[], size: number, nx: number, ny: number, nz: number) {
  const values = new Float32Array(nx * ny * nz);
  const reach = blockSize * size * Math.sqrt(3) / 2 + size * 2;
  for (let bz = 0; bz < nz - 1; bz += blockSize) {
    for (let by = 0; by < ny - 1; by += blockSize) {
      for (let bx = 0; bx < nx - 1; bx += blockSize) {
        const ex = Math.min(bx + blockSize, nx - 1), ey = Math.min(by + blockSize, ny - 1), ez = Math.min(bz + blockSize, nz - 1);
        const center = sdf(min[0] + (bx + ex) / 2 * size, min[1] + (by + ey) / 2 * size, min[2] + (bz + ez) / 2 * size);
        // Blocks far from the surface all share the center's sign; only blocks near it need full samples.
        const far = Math.abs(center) > reach;
        for (let z = bz; z <= ez; z++) {
          for (let y = by; y <= ey; y++) {
            for (let x = bx; x <= ex; x++) {
              values[x + nx * (y + ny * z)] = far ? center : sdf(min[0] + x * size, min[1] + y * size, min[2] + z * size);
            }
          }
        }
      }
    }
  }
  return values;
}

const cubeCorners = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
const cubeEdges = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];

export function buildHandMesh(voxel = 0.1): HandMesh {
  const hand = buildHand();
  const { sdf } = hand;
  const { min, max } = hand.bounds;
  const nx = Math.ceil((max[0] - min[0]) / voxel) + 1;
  const ny = Math.ceil((max[1] - min[1]) / voxel) + 1;
  const nz = Math.ceil((max[2] - min[2]) / voxel) + 1;
  const values = sampleGrid(sdf, min, voxel, nx, ny, nz);

  // Surface nets: one vertex per cell that straddles the surface.
  const cellVertex = new Int32Array((nx - 1) * (ny - 1) * (nz - 1)).fill(-1);
  const points: number[] = [];
  const corner = new Float32Array(8);
  for (let z = 0; z < nz - 1; z++) {
    for (let y = 0; y < ny - 1; y++) {
      for (let x = 0; x < nx - 1; x++) {
        let inside = 0;
        for (let c = 0; c < 8; c++) {
          const [dx, dy, dz] = cubeCorners[c];
          corner[c] = values[x + dx + nx * (y + dy + ny * (z + dz))];
          if (corner[c] < 0) inside++;
        }
        if (inside === 0 || inside === 8) continue;
        let sx = 0, sy = 0, sz = 0, count = 0;
        for (const [a, b] of cubeEdges) {
          const va = corner[a], vb = corner[b];
          if ((va < 0) === (vb < 0)) continue;
          const t = va / (va - vb);
          sx += cubeCorners[a][0] + t * (cubeCorners[b][0] - cubeCorners[a][0]);
          sy += cubeCorners[a][1] + t * (cubeCorners[b][1] - cubeCorners[a][1]);
          sz += cubeCorners[a][2] + t * (cubeCorners[b][2] - cubeCorners[a][2]);
          count++;
        }
        cellVertex[x + (nx - 1) * (y + (ny - 1) * z)] = points.length / 3;
        points.push(min[0] + (x + sx / count) * voxel, min[1] + (y + sy / count) * voxel, min[2] + (z + sz / count) * voxel);
      }
    }
  }

  const triangles: number[] = [];
  const cell = (x: number, y: number, z: number) => cellVertex[x + (nx - 1) * (y + (ny - 1) * z)];
  const quad = (a: number, b: number, c: number, d: number, flip: boolean) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    if (flip) triangles.push(a, d, c, a, c, b);
    else triangles.push(a, b, c, a, c, d);
  };
  for (let z = 1; z < nz - 1; z++) {
    for (let y = 1; y < ny - 1; y++) {
      for (let x = 1; x < nx - 1; x++) {
        const v0 = values[x + nx * (y + ny * z)] < 0;
        if (v0 !== (values[x + 1 + nx * (y + ny * z)] < 0)) quad(cell(x, y - 1, z - 1), cell(x, y, z - 1), cell(x, y, z), cell(x, y - 1, z), !v0);
        if (v0 !== (values[x + nx * (y + 1 + ny * z)] < 0)) quad(cell(x - 1, y, z - 1), cell(x - 1, y, z), cell(x, y, z), cell(x, y, z - 1), !v0);
        if (v0 !== (values[x + nx * (y + ny * (z + 1))] < 0)) quad(cell(x - 1, y - 1, z), cell(x, y - 1, z), cell(x, y, z), cell(x - 1, y, z), !v0);
      }
    }
  }

  const count = points.length / 3;
  const positions = new Float32Array(points);
  const normals = new Float32Array(count * 3);
  const gradient = (x: number, y: number, z: number, out: Float32Array, o: number) => {
    // Tetrahedral central differences.
    const e = voxel * 0.35;
    const a = sdf(x + e, y - e, z - e), b = sdf(x - e, y - e, z + e), c = sdf(x - e, y + e, z - e), d = sdf(x + e, y + e, z + e);
    const gx = a - b - c + d, gy = -a - b + c + d, gz = -a + b - c + d;
    const length = Math.hypot(gx, gy, gz) || 1;
    out[o] = gx / length; out[o + 1] = gy / length; out[o + 2] = gz / length;
  };
  for (let i = 0; i < count; i++) {
    const o = i * 3;
    // Project each vertex onto the true surface, then take its normal from the field.
    for (let step = 0; step < 2; step++) {
      gradient(positions[o], positions[o + 1], positions[o + 2], normals, o);
      const d = sdf(positions[o], positions[o + 1], positions[o + 2]);
      positions[o] -= normals[o] * d;
      positions[o + 1] -= normals[o + 1] * d;
      positions[o + 2] -= normals[o + 2] * d;
    }
    gradient(positions[o], positions[o + 1], positions[o + 2], normals, o);
  }

  // Ambient occlusion sampled from the field along each normal.
  const occlusion = new Float32Array(count);
  const steps = [0.12, 0.32, 0.65, 1.1, 1.8, 2.7];
  let total = 0;
  for (let s = 0, w = 1; s < steps.length; s++, w *= 0.72) total += steps[s] * w;
  for (let i = 0; i < count; i++) {
    const o = i * 3;
    let occluded = 0;
    for (let s = 0, w = 1; s < steps.length; s++, w *= 0.72) {
      const t = steps[s];
      const d = sdf(positions[o] + normals[o] * t, positions[o + 1] + normals[o + 1] * t, positions[o + 2] + normals[o + 2] * t);
      occluded += Math.max(0, t - d) * w;
    }
    occlusion[i] = Math.max(0, 1 - 1.5 * occluded / total);
  }

  const indices = new Uint32Array(triangles);
  // Wind every triangle so its face normal agrees with the field's outward normal.
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i] * 3, b = indices[i + 1] * 3, c = indices[i + 2] * 3;
    const ux = positions[b] - positions[a], uy = positions[b + 1] - positions[a + 1], uz = positions[b + 2] - positions[a + 2];
    const vx = positions[c] - positions[a], vy = positions[c + 1] - positions[a + 1], vz = positions[c + 2] - positions[a + 2];
    const fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx;
    const nx = normals[a] + normals[b] + normals[c], ny = normals[a + 1] + normals[b + 1] + normals[c + 1], nz = normals[a + 2] + normals[b + 2] + normals[c + 2];
    if (fx * nx + fy * ny + fz * nz < 0) { const t = indices[i + 1]; indices[i + 1] = indices[i + 2]; indices[i + 2] = t; }
  }
  const tip = hand.fingertip.map((v, i) => v + hand.fingertipDirection[i] * hand.fingertipRadius) as [number, number, number];
  return {
    positions,
    normals,
    occlusion,
    flow: surfaceDistance(positions, indices, tip),
    indices,
    fingertip: tip,
    fingertipDirection: hand.fingertipDirection,
    nails: hand.nails,
  };
}

// Dijkstra over mesh edges from the vertex nearest the source point.
function surfaceDistance(positions: Float32Array, indices: Uint32Array, source: number[]) {
  const count = positions.length / 3;
  const degree = new Uint32Array(count + 1);
  for (let i = 0; i < indices.length; i += 3) {
    for (let e = 0; e < 3; e++) { degree[indices[i + e] + 1]++; degree[indices[i + (e + 1) % 3] + 1]++; }
  }
  for (let i = 0; i < count; i++) degree[i + 1] += degree[i];
  const neighbors = new Uint32Array(degree[count]);
  const fill = degree.slice(0, count);
  for (let i = 0; i < indices.length; i += 3) {
    for (let e = 0; e < 3; e++) {
      const a = indices[i + e], b = indices[i + (e + 1) % 3];
      neighbors[fill[a]++] = b;
      neighbors[fill[b]++] = a;
    }
  }

  let start = 0, nearest = Infinity;
  for (let i = 0; i < count; i++) {
    const d = Math.hypot(positions[i * 3] - source[0], positions[i * 3 + 1] - source[1], positions[i * 3 + 2] - source[2]);
    if (d < nearest) { nearest = d; start = i; }
  }

  const distance = new Float64Array(count).fill(Infinity);
  const heap = new MinHeap(count);
  distance[start] = 0;
  heap.push(start, 0);
  while (heap.size) {
    const [v, dv] = heap.pop();
    if (dv > distance[v]) continue;
    for (let n = degree[v]; n < degree[v + 1]; n++) {
      const u = neighbors[n];
      const d = dv + Math.hypot(positions[u * 3] - positions[v * 3], positions[u * 3 + 1] - positions[v * 3 + 1], positions[u * 3 + 2] - positions[v * 3 + 2]);
      if (d < distance[u]) { distance[u] = d; heap.push(u, d); }
    }
  }
  let longest = 0;
  for (let i = 0; i < count; i++) if (distance[i] !== Infinity) longest = Math.max(longest, distance[i]);
  const flow = new Float32Array(count);
  for (let i = 0; i < count; i++) flow[i] = distance[i] === Infinity ? 1 : distance[i] / longest;
  return flow;
}

class MinHeap {
  private items: Uint32Array;
  private keys: Float64Array;
  size = 0;
  constructor(capacity: number) {
    this.items = new Uint32Array(capacity * 4);
    this.keys = new Float64Array(capacity * 4);
  }
  push(item: number, key: number) {
    if (this.size === this.items.length) {
      const items = new Uint32Array(this.size * 2); items.set(this.items); this.items = items;
      const keys = new Float64Array(this.size * 2); keys.set(this.keys); this.keys = keys;
    }
    let i = this.size++;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.keys[parent] <= key) break;
      this.items[i] = this.items[parent]; this.keys[i] = this.keys[parent];
      i = parent;
    }
    this.items[i] = item; this.keys[i] = key;
  }
  pop(): [number, number] {
    const item = this.items[0], key = this.keys[0];
    const lastItem = this.items[--this.size], lastKey = this.keys[this.size];
    let i = 0;
    for (;;) {
      let child = i * 2 + 1;
      if (child >= this.size) break;
      if (child + 1 < this.size && this.keys[child + 1] < this.keys[child]) child++;
      if (this.keys[child] >= lastKey) break;
      this.items[i] = this.items[child]; this.keys[i] = this.keys[child];
      i = child;
    }
    this.items[i] = lastItem; this.keys[i] = lastKey;
    return [item, key];
  }
}
