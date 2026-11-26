import {
  ACESFilmicToneMapping, BufferAttribute, BufferGeometry, Color, DirectionalLight, Group, HemisphereLight, Mesh,
  MeshPhysicalMaterial, PCFShadowMap, PerspectiveCamera, PMREMGenerator, Vector2, Scene, SRGBColorSpace, Vector3, WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import type { HandMesh } from "./hand-mesh";
import * as shader from "./porcelain-shader";

export type ProceduralHandScene = { gild: () => void; reset: () => void; dispose: () => void };

export const gildDurationMs = 5200;

export function createProceduralHandScene(canvas: HTMLCanvasElement, mesh: HandMesh): ProceduralHandScene {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = 0.36;

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(mesh.positions, 3));
  geometry.setAttribute("normal", new BufferAttribute(mesh.normals, 3));
  geometry.setAttribute("occlusion", new BufferAttribute(mesh.occlusion, 1));
  geometry.setAttribute("flow", new BufferAttribute(mesh.flow, 1));
  geometry.setIndex(new BufferAttribute(mesh.indices, 1));
  geometry.computeBoundingSphere();

  const uniforms = {
    reveal: { value: 0 },
    nailCenter: { value: mesh.nails.map((n) => new Vector3(...n.center)) },
    nailLateral: { value: mesh.nails.map((n) => new Vector3(...n.lateral)) },
    nailForward: { value: mesh.nails.map((n) => new Vector3(...n.forward)) },
    nailDorsal: { value: mesh.nails.map((n) => new Vector3(...n.dorsal)) },
    nailSize: { value: mesh.nails.map((n) => new Vector2(...n.size)) },
  };
  const material = new MeshPhysicalMaterial({
    color: new Color(0.84, 0.825, 0.8),
    roughness: 0.52,
    metalness: 0,
    clearcoat: 0.32,
    clearcoatRoughness: 0.38,
    sheen: 0.25,
    sheenRoughness: 0.7,
    sheenColor: new Color(1, 0.98, 0.95),
  });
  material.onBeforeCompile = (program) => {
    Object.assign(program.uniforms, uniforms);
    program.vertexShader = shader.vertexPars + program.vertexShader.replace("#include <begin_vertex>", shader.vertexMain);
    program.fragmentShader = shader.fragmentPars + program.fragmentShader
      .replace("#include <color_fragment>", shader.colorMain)
      .replace("#include <roughnessmap_fragment>", shader.roughnessMain)
      .replace("#include <metalnessmap_fragment>", shader.metalnessMain)
      .replace("#include <normal_fragment_maps>", shader.normalMain)
      .replace("#include <emissivemap_fragment>", shader.emissiveMain)
      .replace("#include <lights_physical_fragment>", shader.lightsMain)
      .replace("#include <aomap_fragment>", shader.occlusionMain);
  };

  const hand = new Mesh(geometry, material);
  hand.castShadow = true;
  hand.receiveShadow = true;
  const model = new Group();
  // Lean the forearm as in the reference; the wrist then brings the hand back upright.
  model.rotation.x = -0.24;
  model.add(hand);
  scene.add(model);

  // Soft studio light: a warm key casting self-shadows, a cool fill, and a rim to separate the silhouette.
  const key = new DirectionalLight(0xfff1e0, 2.9);
  key.position.set(18, 26, 30);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -16;
  key.shadow.camera.right = 16;
  key.shadow.camera.top = 22;
  key.shadow.camera.bottom = -22;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 120;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.05;
  key.shadow.radius = 6;
  const fill = new DirectionalLight(0xdde6ff, 0.55);
  fill.position.set(-30, 4, 14);
  const rim = new DirectionalLight(0xffffff, 1.4);
  rim.position.set(-14, 18, -30);
  scene.add(key, fill, rim, new HemisphereLight(0xffffff, 0xd8d2c8, 0.22));

  const camera = new PerspectiveCamera(28, 1, 1, 200);
  const target = new Vector3(0.6, 5.2, 1.2);
  camera.position.copy(target).add(new Vector3(54, 6, -4));
  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 26;
  controls.maxDistance = 70;
  controls.minPolarAngle = Math.PI * 0.18;
  controls.maxPolarAngle = Math.PI * 0.7;
  controls.rotateSpeed = 0.7;
  controls.autoRotateSpeed = 0.55;
  controls.update();

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let gildStart: number | null = null;
  let frame = 0;
  let visible = true;
  let lost = false;
  let interacting = false;
  let idleSince = performance.now();

  function draw(now: number) {
    frame = 0;
    if (lost || !visible) return;
    controls.autoRotate = !motion.matches && !interacting && now - idleSince > 2500;
    const moving = controls.update();
    if (gildStart !== null) uniforms.reveal.value = motion.matches ? 1 : Math.min(1, (now - gildStart) / gildDurationMs);
    renderer.render(scene, camera);
    const revealing = gildStart !== null && uniforms.reveal.value < 1;
    if (moving || revealing || controls.autoRotate || interacting || now - idleSince <= 2500) schedule();
  }

  function schedule() {
    if (!lost && visible && !frame) frame = requestAnimationFrame(draw);
  }

  function resize() {
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    schedule();
  }

  const onStart = () => { interacting = true; schedule(); };
  const onEnd = () => { interacting = false; idleSince = performance.now(); schedule(); };
  const onChange = () => schedule();
  controls.addEventListener("start", onStart);
  controls.addEventListener("end", onEnd);
  controls.addEventListener("change", onChange);

  const contextLost = (event: Event) => { event.preventDefault(); lost = true; };
  const contextRestored = () => { lost = false; schedule(); };
  canvas.addEventListener("webglcontextlost", contextLost);
  canvas.addEventListener("webglcontextrestored", contextRestored);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) { idleSince = performance.now(); schedule(); }
  });
  visibility.observe(canvas);
  motion.addEventListener("change", onChange);
  resize();

  return {
    gild() {
      if (gildStart !== null) return;
      gildStart = performance.now();
      schedule();
    },
    reset() {
      gildStart = null;
      uniforms.reveal.value = 0;
      schedule();
    },
    dispose() {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
      controls.removeEventListener("change", onChange);
      controls.dispose();
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      motion.removeEventListener("change", onChange);
      geometry.dispose();
      material.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
