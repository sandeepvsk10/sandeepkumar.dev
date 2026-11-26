import {
  CanvasTexture, DataTexture, LinearFilter, Mesh, OrthographicCamera, PlaneGeometry, RedFormat,
  Scene, ShaderMaterial, Vector2, WebGLRenderer,
} from "three";
import { goldArrivalMap } from "./gold-flow";
import { goldFlowDurationMs, handSilhouette } from "./hand-silhouette";

export type HandScene = { gild: (start: number) => void; dispose: () => void };

export function createHandScene(canvas: HTMLCanvasElement, image: HTMLImageElement): HandScene {
  const cutout = document.createElement("canvas");
  cutout.width = image.naturalWidth;
  cutout.height = image.naturalHeight;
  const context = cutout.getContext("2d");
  if (!context) throw new Error("Unable to prepare the hand texture");
  context.clip(new Path2D(handSilhouette), "evenodd");
  context.drawImage(image, 0, 0);

  const renderer = new WebGLRenderer({ canvas, alpha: true, premultipliedAlpha: false, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0, 0);
  const scene = new Scene();
  const size = image.naturalWidth;
  const half = size / 2;
  const camera = new OrthographicCamera(-half, half, half, -half, 1, 600);
  camera.position.z = 300;
  const geometry = new PlaneGeometry(size, size);
  const texture = new CanvasTexture(cutout);
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const arrivalTexture = new DataTexture(goldArrivalMap(size), size, size, RedFormat);
  arrivalTexture.minFilter = LinearFilter;
  arrivalTexture.magFilter = LinearFilter;
  arrivalTexture.needsUpdate = true;
  const uniforms = {
    porcelain: { value: texture },
    goldArrival: { value: arrivalTexture },
    texel: { value: new Vector2(1 / cutout.width, 1 / cutout.height) },
    reveal: { value: 0 },
  };
  const material = new ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
      }`,
    fragmentShader: `
      uniform sampler2D porcelain;
      uniform sampler2D goldArrival;
      uniform vec2 texel;
      uniform float reveal;
      varying vec2 vUv;
      void main() {
        vec4 sampleColor = texture2D(porcelain, vUv);
        if (sampleColor.a < .002) discard;
        vec3 source = sampleColor.rgb;
        float gray = dot(source, vec3(.2126, .7152, .0722));
        // Sharpen small surface variations without outlining the transparent silhouette.
        vec4 neighbors = texture2D(porcelain, vUv + vec2(texel.x, 0.))
                       + texture2D(porcelain, vUv - vec2(texel.x, 0.))
                       + texture2D(porcelain, vUv + vec2(0., texel.y))
                       + texture2D(porcelain, vUv - vec2(0., texel.y));
        float detail = gray - dot(neighbors.rgb * .25, vec3(.2126, .7152, .0722));
        gray += clamp(detail * .75, -.035, .035) * smoothstep(3.85, 4., neighbors.a);
        // The warm pixels in the reference trace the actual seams, including their hairline branches.
        float arrival = texture2D(goldArrival, vec2(vUv.x, 1. - vUv.y)).r;
        float seam = smoothstep(.012, .12, source.r - source.b) * step(.003, arrival);
        float timeSinceArrival = reveal * 1.024 - arrival;
        float gold = smoothstep(0., .024, timeSinceArrival);
        vec3 porcelainWhite = vec3(mix(gray, 1., .38));
        vec3 gildedSeam = source + 0.55 * (source - vec3(gray));
        vec3 color = mix(porcelainWhite, gildedSeam, seam * gold);
        float glint = (1. - smoothstep(.024, .065, timeSinceArrival)) * (1. - step(1., reveal));
        color += seam * gold * (.095 + .24 * glint) * vec3(1., .71, .25);
        gl_FragColor = vec4(color, sampleColor.a);
      }`,
  });
  scene.add(new Mesh(geometry, material));

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let started: number | null = null;
  let frame = 0;
  let lost = false;

  function draw(now: number) {
    frame = 0;
    if (lost) return;
    const progress = started === null ? 0 : motion.matches ? 1 : Math.min(1, Math.max(0, (now - started) / goldFlowDurationMs));
    uniforms.reveal.value = progress;
    renderer.render(scene, camera);
    if (started !== null && progress < 1) schedule();
  }

  function schedule() {
    if (!lost && !frame) frame = requestAnimationFrame(draw);
  }

  function resize() {
    const width = canvas.parentElement!.clientWidth;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 3));
    renderer.setSize(width, width, false);
    schedule();
  }

  function contextLost() {
    lost = true;
    canvas.hidden = true;
  }

  function contextRestored() {
    lost = false;
    canvas.hidden = false;
    resize();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas.parentElement!);
  canvas.addEventListener("webglcontextlost", contextLost);
  canvas.addEventListener("webglcontextrestored", contextRestored);
  motion.addEventListener("change", schedule);
  canvas.hidden = false;
  resize();
  return {
    gild(time) { started = time; schedule(); },
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      motion.removeEventListener("change", schedule);
      geometry.dispose();
      material.dispose();
      arrivalTexture.dispose();
      texture.dispose();
      renderer.dispose();
      canvas.hidden = true;
    },
  };
}
