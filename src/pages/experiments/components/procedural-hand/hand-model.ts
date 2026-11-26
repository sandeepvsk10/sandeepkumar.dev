// A right hand and forearm described as a signed distance field, in centimetres.
// Hand frame: +X toward the thumb, +Y toward the fingertips, +Z out of the palm.
// The forearm runs down -Y from the wrist at the origin.

type Vec = [number, number, number];

const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: Vec, s: number): Vec => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const normalize = (a: Vec): Vec => scale(a, 1 / Math.hypot(...a));
const radians = (degrees: number) => degrees * Math.PI / 180;

// Rotate v around a unit axis (Rodrigues).
function rotate(v: Vec, axis: Vec, angle: number): Vec {
  const c = Math.cos(angle), s = Math.sin(angle);
  return add(add(scale(v, c), scale(cross(axis, v), s)), scale(axis, dot(axis, v) * (1 - c)));
}

type Frame = { forward: Vec; lateral: Vec; palmar: Vec };

function flex(frame: Frame, angle: number): Frame {
  return {
    lateral: frame.lateral,
    forward: rotate(frame.forward, frame.lateral, angle),
    palmar: rotate(frame.palmar, frame.lateral, angle),
  };
}

// Primitives: round cones (tapered capsules) and ellipsoids.
type Cone = { kind: "cone"; a: Vec; b: Vec; ra: number; rb: number; carve?: number };
type Ellipsoid = { kind: "ellipsoid"; center: Vec; axes: [Vec, Vec, Vec]; radii: Vec };
type Primitive = Cone | Ellipsoid;
type Part = { primitives: Primitive[]; smooth: number; blend: number };

const cone = (a: Vec, b: Vec, ra: number, rb: number): Cone => ({ kind: "cone", a, b, ra, rb });
const ellipsoid = (center: Vec, axes: [Vec, Vec, Vec], radii: Vec): Ellipsoid => ({ kind: "ellipsoid", center, axes, radii });
const handAxes: [Vec, Vec, Vec] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

export type Nail = { center: Vec; lateral: Vec; forward: Vec; dorsal: Vec; size: [number, number] };

type FingerSpec = {
  knuckle: Vec;
  lengths: [number, number, number];
  radii: [number, number, number, number];
  spread: number;
  bend: [number, number, number];
  frame?: Frame;
};

const fingers: Record<"index" | "middle" | "ring" | "little" | "thumb", FingerSpec> = {
  // Posed after the reference: the index lifts and arches, the rear fingers fall away
  // toward the palm in a loose fan, and the thumb rises straight in front of them.
  index: { knuckle: [2.5, 8.3, 0.25], lengths: [4.3, 2.55, 2.0], radii: [0.9, 0.78, 0.68, 0.59], spread: 4, bend: [16, 14, 8] },
  middle: { knuckle: [0.82, 8.6, -0.05], lengths: [4.6, 2.9, 2.05], radii: [0.92, 0.8, 0.7, 0.6], spread: -1, bend: [54, 26, 12] },
  ring: { knuckle: [-0.88, 8.25, 0.0], lengths: [4.3, 2.7, 1.95], radii: [0.87, 0.75, 0.66, 0.57], spread: -5, bend: [64, 30, 14] },
  little: { knuckle: [-2.42, 7.45, 0.3], lengths: [3.4, 2.1, 1.8], radii: [0.78, 0.67, 0.59, 0.52], spread: -10, bend: [72, 34, 16] },
  thumb: {
    knuckle: [1.95, 1.7, 0.85],
    lengths: [4.9, 3.55, 2.85],
    radii: [1.05, 0.9, 0.82, 0.66],
    spread: 0,
    bend: [0, 6, 10],
    frame: (() => {
      const forward = normalize([0.2, 0.95, 0.24]);
      // The thumbnail faces out from the radial side, toward the viewer in the reference.
      const palmar = normalize(cross(cross(forward, [-0.85, 0, 0.55]), forward));
      return { forward, palmar, lateral: cross(palmar, forward) };
    })(),
  },
};

function buildFinger({ knuckle, lengths, radii, spread, bend, frame: start }: FingerSpec, thumb = false) {
  let frame: Frame = start ?? {
    forward: rotate([0, 1, 0], [0, 0, 1], radians(spread)),
    lateral: rotate([1, 0, 0], [0, 0, 1], radians(spread)),
    palmar: [0, 0, 1],
  };
  const primitives: Primitive[] = [];
  let nail: Nail | undefined;
  let joint = knuckle;
  for (let i = 0; i < 3; i++) {
    frame = flex(frame, radians(bend[i]));
    const next = add(joint, scale(frame.forward, lengths[i]));
    primitives.push(cone(joint, next, radii[i], radii[i + 1]));
    // Fleshy pads on the palmar side give each segment a less tubular cross-section.
    const middle = add(joint, scale(frame.forward, lengths[i] * 0.52));
    const r = (radii[i] + radii[i + 1]) / 2;
    primitives.push(ellipsoid(add(middle, scale(frame.palmar, r * 0.22)), [frame.lateral, frame.forward, frame.palmar],
      [r * 0.9, lengths[i] * (i === 2 ? 0.46 : 0.42), r * 0.82]));
    if (i === 2) {
      // Broaden the back of the last segment into the flatter bed a nail sits on.
      const bed = add(joint, add(scale(frame.forward, lengths[i] * 0.55), scale(frame.palmar, -radii[3] * 0.55)));
      primitives.push(ellipsoid(bed, [frame.lateral, frame.forward, frame.palmar], [radii[3] * 0.92, lengths[i] * 0.5, radii[3] * 0.5]));
      const r = (radii[2] + radii[3]) / 2;
      nail = {
        center: add(joint, add(scale(frame.forward, lengths[i] * (thumb ? 0.6 : 0.62)), scale(frame.palmar, -r * 1.02))),
        lateral: frame.lateral,
        forward: frame.forward,
        dorsal: scale(frame.palmar, -1),
        size: [r * (thumb ? 0.7 : 0.68), lengths[i] * (thumb ? 0.3 : 0.34)],
      };
    }
    // Flexion creases on the palmar side of the two finger joints.
    if (i > 0) {
      const crease = add(joint, scale(frame.palmar, radii[i] + 0.17));
      const half = scale(frame.lateral, radii[i] * 0.6);
      primitives.push({ ...cone(add(crease, scale(half, -1)), add(crease, half), 0.22, 0.22), carve: 0.16 });
    }
    joint = next;
  }
  primitives.sort((a, b) => Number(a.kind === "cone" && Boolean(a.carve)) - Number(b.kind === "cone" && Boolean(b.carve)));
  const tip = joint;
  return { primitives, tip, frame, nail: nail!, smooth: thumb ? 0.32 : 0.22 };
}

export type HandPose = { wristExtension: number; wristDeviation: number };

// Negative extension flexes the hand gently toward the palm, as in the reference.
export function buildHand(pose: HandPose = { wristExtension: -12, wristDeviation: 0 }) {
  const palm: Primitive[] = [
    // Carpus and metacarpals; a wide blend fuses them into the palm.
    ellipsoid([0, 1.1, 0], handAxes, [2.6, 1.7, 1.45]),
    cone([1.45, 1.8, 0.05], fingers.index.knuckle, 1.0, 0.98),
    cone([0.45, 1.9, -0.05], fingers.middle.knuckle, 1.0, 1.0),
    cone([-0.55, 1.9, -0.05], fingers.ring.knuckle, 0.96, 0.93),
    cone([-1.45, 1.8, 0.05], fingers.little.knuckle, 0.92, 0.84),
    ellipsoid([0.1, 5.4, 0.55], handAxes, [3.5, 3.3, 1.05]),
    // Thenar and hypothenar eminences.
    ellipsoid([2.4, 3.3, 0.95], [normalize([0.85, -0.5, 0]), normalize([0.5, 0.85, 0]), [0, 0, 1]], [1.55, 2.5, 1.25]),
    ellipsoid([-2.55, 3.8, 0.55], handAxes, [1.15, 2.7, 1.05]),
  ];
  const parts: Part[] = [{ primitives: palm, smooth: 1.1, blend: 0 }];
  const tips = {} as Record<keyof typeof fingers, { tip: Vec; frame: Frame }>;
  const nails: Nail[] = [];
  for (const name of ["thumb", "index", "middle", "ring", "little"] as const) {
    const finger = buildFinger(fingers[name], name === "thumb");
    parts.push({ primitives: finger.primitives, smooth: finger.smooth, blend: name === "thumb" ? 1.05 : 0.62 });
    tips[name] = { tip: finger.tip, frame: finger.frame };
    nails.push(finger.nail);
  }

  // Bend the hand at the wrist, then attach the forearm in its own frame.
  const extension = (v: Vec) => rotate(rotate(v, [1, 0, 0], -radians(pose.wristExtension)), [0, 0, 1], radians(pose.wristDeviation));
  const placed = (p: Primitive): Primitive => p.kind === "cone"
    ? { ...p, a: extension(p.a), b: extension(p.b) }
    : { ...p, center: extension(p.center), axes: p.axes.map(extension) as [Vec, Vec, Vec] };
  for (const part of parts) part.primitives = part.primitives.map(placed);
  parts[0].primitives.push(
    ellipsoid([0, -0.3, 0], handAxes, [2.7, 1.8, 1.65]),
    ellipsoid([0, -6.5, 0.05], handAxes, [3.1, 7, 2.15]),
    ellipsoid([0.1, -13.5, -0.1], handAxes, [3.5, 8, 2.55]),
  );

  const index = tips.index;
  return {
    sdf: compile(parts),
    fingertip: extension(index.tip),
    fingertipDirection: extension(index.frame.forward),
    fingertipRadius: fingers.index.radii[3],
    nails: nails.map((n) => ({ center: extension(n.center), lateral: extension(n.lateral), forward: extension(n.forward), dorsal: extension(n.dorsal), size: n.size })),
    bounds: boundsOf(parts),
  };
}

function boundsOf(parts: Part[]) {
  const min: Vec = [Infinity, Infinity, Infinity], max: Vec = [-Infinity, -Infinity, -Infinity];
  for (const { primitives } of parts) {
    for (const p of primitives) {
      const spheres: [Vec, number][] = p.kind === "cone" ? [[p.a, p.ra], [p.b, p.rb]] : [[p.center, Math.max(...p.radii)]];
      for (const [c, r] of spheres) {
        for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], c[k] - r - 0.6); max[k] = Math.max(max[k], c[k] + r + 0.6); }
      }
    }
  }
  return { min, max };
}

export type HandSdf = (x: number, y: number, z: number) => number;

// Flatten the primitives into typed arrays so the field can be sampled millions of times without allocation.
function compile(parts: Part[]): HandSdf {
  const compiled = parts.map(({ primitives, smooth, blend }) => {
    const data = new Float64Array(primitives.length * 16);
    const kinds = new Uint8Array(primitives.length);
    const carves = new Float64Array(primitives.length);
    let cx = 0, cy = 0, cz = 0, count = 0;
    const points: Vec[] = [];
    primitives.forEach((p, i) => {
      const o = i * 16;
      if (p.kind === "cone") {
        kinds[i] = 0;
        carves[i] = p.carve ?? 0;
        const ba = [p.b[0] - p.a[0], p.b[1] - p.a[1], p.b[2] - p.a[2]];
        const l2 = ba[0] ** 2 + ba[1] ** 2 + ba[2] ** 2;
        const rr = p.ra - p.rb;
        data.set([...p.a, ...ba, p.ra, p.rb, l2, rr, l2 - rr * rr, 1 / l2], o);
        points.push(add(p.a, [p.ra, p.ra, p.ra]), add(p.a, [-p.ra, -p.ra, -p.ra]), add(p.b, [p.rb, p.rb, p.rb]), add(p.b, [-p.rb, -p.rb, -p.rb]));
      } else {
        kinds[i] = 1;
        data.set([...p.center, ...p.axes[0], ...p.axes[1], ...p.axes[2], ...p.radii], o);
        const r = Math.max(...p.radii);
        points.push(add(p.center, [r, r, r]), add(p.center, [-r, -r, -r]));
      }
    });
    for (const p of points) { cx += p[0]; cy += p[1]; cz += p[2]; count++; }
    cx /= count; cy /= count; cz /= count;
    let radius = 0;
    for (const p of points) radius = Math.max(radius, Math.hypot(p[0] - cx, p[1] - cy, p[2] - cz));
    return { data, kinds, carves, smooth, blend, cx, cy, cz, radius };
  });

  function partDistance(part: (typeof compiled)[number], x: number, y: number, z: number) {
    const { data, kinds, carves, smooth } = part;
    let d = Infinity;
    for (let i = 0; i < kinds.length; i++) {
      const o = i * 16;
      let e: number;
      if (kinds[i] === 0) {
        // Inigo Quilez's exact round cone.
        const px = x - data[o], py = y - data[o + 1], pz = z - data[o + 2];
        const bx = data[o + 3], by = data[o + 4], bz = data[o + 5];
        const r1 = data[o + 6], r2 = data[o + 7], l2 = data[o + 8], rr = data[o + 9], a2 = data[o + 10], il2 = data[o + 11];
        const yy = px * bx + py * by + pz * bz;
        const zz = yy - l2;
        const qx = px * l2 - bx * yy, qy = py * l2 - by * yy, qz = pz * l2 - bz * yy;
        const x2 = qx * qx + qy * qy + qz * qz;
        const y2 = yy * yy * l2, z2 = zz * zz * l2;
        const k = Math.sign(rr) * rr * rr * x2;
        if (Math.sign(zz) * a2 * z2 > k) e = Math.sqrt(x2 + z2) * il2 - r2;
        else if (Math.sign(yy) * a2 * y2 < k) e = Math.sqrt(x2 + y2) * il2 - r1;
        else e = (Math.sqrt(x2 * a2 * il2) + yy * rr) * il2 - r1;
      } else {
        const px = x - data[o], py = y - data[o + 1], pz = z - data[o + 2];
        const u = px * data[o + 3] + py * data[o + 4] + pz * data[o + 5];
        const v = px * data[o + 6] + py * data[o + 7] + pz * data[o + 8];
        const w = px * data[o + 9] + py * data[o + 10] + pz * data[o + 11];
        const rx = data[o + 12], ry = data[o + 13], rz = data[o + 14];
        const k0 = Math.hypot(u / rx, v / ry, w / rz);
        const k1 = Math.hypot(u / (rx * rx), v / (ry * ry), w / (rz * rz));
        e = k1 > 1e-9 ? k0 * (k0 - 1) / k1 : -Math.min(rx, ry, rz);
      }
      d = carves[i] ? -smoothMin(-d, e, carves[i]) : smoothMin(d, e, smooth);
    }
    return d;
  }

  return (x, y, z) => {
    let d = partDistance(compiled[0], x, y, z);
    for (let i = 1; i < compiled.length; i++) {
      const part = compiled[i];
      // A part farther than the blend radius cannot change the result.
      const bound = Math.hypot(x - part.cx, y - part.cy, z - part.cz) - part.radius;
      if (bound >= d + part.blend) continue;
      d = smoothMin(d, partDistance(part, x, y, z), part.blend);
    }
    return d;
  };
}

function smoothMin(a: number, b: number, k: number) {
  if (a === Infinity) return b;
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}
