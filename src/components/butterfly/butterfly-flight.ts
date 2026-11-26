export type ButterflyPose = { x: number; y: number; angle: number };

const landingSpots = [
  { x: 16, y: 20 },
  { x: 45, y: 16 },
  { x: 32, y: 52 },
  { x: 19, y: 78 },
  { x: 62, y: 72 },
  { x: 83, y: 34 },
  { x: 85, y: 83 },
];

export function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

type Bounds = Pick<DOMRectReadOnly, "left" | "top" | "width" | "height">;

export function projectPose(pose: ButterflyPose, from: Bounds, to: Bounds): ButterflyPose {
  return {
    x: (from.left - to.left + from.width * pose.x / 100) / to.width * 100,
    y: (from.top - to.top + from.height * pose.y / 100) / to.height * 100,
    angle: pose.angle,
  };
}

export function pickLanding(previousIndex: number, area: Bounds, viewport: Bounds) {
  const inset = 32;
  const left = Math.max(area.left, viewport.left + inset);
  const top = Math.max(area.top, viewport.top + inset);
  const right = Math.min(area.left + area.width, viewport.left + viewport.width - inset);
  const bottom = Math.min(area.top + area.height, viewport.top + viewport.height - inset);
  const visible = { left, top, width: right - left, height: bottom - top };
  const region = visible.width >= inset && visible.height >= inset ? visible : area;

  const options = landingSpots.map((spot, index) => ({
    index,
    pose: {
      x: spot.x + randomBetween(-3, 3),
      y: spot.y + randomBetween(-4, 4),
      angle: randomBetween(-20, 20),
    },
  })).filter(({ index }) => index !== previousIndex);
  const { index, pose } = options[Math.floor(Math.random() * options.length)];

  return { index, pose: projectPose(pose, region, area) };
}

export function offscreenPose() {
  const left = Math.random() < 0.5;
  return { x: left ? -18 : 118, y: randomBetween(17, 76), angle: left ? -62 : 62 };
}

export function poseFrame({ x, y, angle }: ButterflyPose) {
  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
  };
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

const turn = 2 * Math.PI;

export function flightFrames(start: ButterflyPose, end: ButterflyPose, landing: boolean, aspectRatio: number) {
  const direction = Math.sign(end.x - start.x);
  const lift = randomBetween(7, 15);
  const swell = randomBetween(12, 21);
  const flutter = randomBetween(3, 7);
  const drift = Math.min(6, Math.abs(end.x - start.x) * 0.1);
  const longCycles = randomBetween(1.3, 2.1);
  const shortCycles = randomBetween(2.6, 4.1);
  const swellPhase = randomBetween(0, turn);
  const flutterPhase = randomBetween(0, turn);
  const pacePhase = randomBetween(0, turn);
  const pace = randomBetween(0.17, 0.33);

  function positionAt(t: number) {
    // Fade the waves at both ends so takeoff and touchdown meet their exact positions.
    const envelope = Math.sin(Math.PI * t) ** 2;
    const longWave = Math.sin(turn * longCycles * t + swellPhase + 0.6 * Math.sin(turn * t + flutterPhase));
    const shortWave = Math.sin(turn * shortCycles * t + flutterPhase);
    const baseY = lerp(start.y, end.y, t);
    const room = Math.sin(Math.PI * Math.max(0, Math.min(100, baseY)) / 100);

    return {
      x: lerp(start.x, end.x, t) + (longWave * 0.45 + shortWave * 0.55) * drift * envelope,
      y: baseY + (longWave * swell + shortWave * flutter - lift) * envelope * room,
    };
  }

  const samples = 72;
  return Array.from({ length: samples + 1 }, (_, step) => {
    if (step === 0) return poseFrame(start);
    if (step === samples) return poseFrame(end);

    const time = step / samples;
    const glide = time + pace * (Math.sin(turn * time + pacePhase) - Math.sin(pacePhase)) / turn;
    const t = landing ? 1 - (1 - glide) ** 2 : glide ** 1.65;
    const position = positionAt(t);
    const before = positionAt(Math.max(0, t - 0.012));
    const after = positionAt(Math.min(1, t + 0.012));
    const climb = Math.atan2(before.y - after.y, Math.abs(after.x - before.x) * aspectRatio) * 180 / Math.PI;
    const bank = direction * (47 - 0.36 * climb);
    const blend = Math.min(1, t * 6, (1 - t) * 6);
    const angle = lerp(lerp(start.angle, end.angle, t), bank, blend ** 2 * (3 - 2 * blend));

    return poseFrame({ ...position, angle });
  });
}
