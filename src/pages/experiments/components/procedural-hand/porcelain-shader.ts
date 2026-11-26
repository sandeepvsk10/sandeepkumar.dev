// GLSL injected into MeshPhysicalMaterial. Cracks live in the model's rest space,
// so they stay fixed to the porcelain however the hand is turned.

export const vertexPars = /* glsl */ `
attribute float occlusion;
attribute float flow;
varying float vOcclusion;
varying float vFlow;
varying vec3 vRest;
varying vec3 vRestNormal;
`;

export const vertexMain = /* glsl */ `
#include <begin_vertex>
vRest = position;
vRestNormal = objectNormal;
vOcclusion = occlusion;
vFlow = flow;
`;

export const fragmentPars = /* glsl */ `
uniform float reveal;
uniform vec3 nailCenter[5];
uniform vec3 nailLateral[5];
uniform vec3 nailForward[5];
uniform vec3 nailDorsal[5];
uniform vec2 nailSize[5];
varying float vOcclusion;
varying float vFlow;
varying vec3 vRest;
varying vec3 vRestNormal;

float hash1(vec3 p) {
  p = fract(p * vec3(.1031, .1030, .0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}

vec3 hash3(vec3 p) {
  p = fract(p * vec3(.1031, .1030, .0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}

float valueNoise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(mix(hash1(i), hash1(i + vec3(1, 0, 0)), f.x), mix(hash1(i + vec3(0, 1, 0)), hash1(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash1(i + vec3(0, 0, 1)), hash1(i + vec3(1, 0, 1)), f.x), mix(hash1(i + vec3(0, 1, 1)), hash1(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}

vec3 warp(vec3 p) {
  // Kept gentle enough that the warp never folds space, which would close cracks into rings.
  return p + .16 * vec3(valueNoise(p * 1.3), valueNoise(p * 1.3 + 17.3), valueNoise(p * 1.3 + 41.9))
           + .035 * vec3(valueNoise(p * 6.1), valueNoise(p * 6.1 + 5.1), valueNoise(p * 6.1 + 9.7));
}

// Distance across the skin to the nearest Voronoi border that is kept as a crack.
// Each border is shared by two cells; hashing the pair decides whether it has broken.
// The 3D distance is divided by the sine between border plane and skin, so a border
// lying nearly tangent to the surface fades instead of smearing into a wide band.
float crackDistance(vec3 x, float keep, vec3 surfaceNormal) {
  vec3 n = floor(x), f = fract(x);
  vec3 mg, mr;
  float md = 8.;
  for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec3 g = vec3(i, j, k);
    vec3 r = g + hash3(n + g) - f;
    float d = dot(r, r);
    if (d < md) { md = d; mr = r; mg = g; }
  }
  md = 8.;
  for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec3 g = mg + vec3(i, j, k);
    vec3 r = g + hash3(n + g) - f;
    vec3 a = n + mg, b = n + g;
    if (dot(mr - r, mr - r) < 1e-5 || hash1(a + b + .37 * abs(a - b)) > keep) continue;
    vec3 borderNormal = normalize(r - mr);
    float crossing = sqrt(max(1. - pow(dot(borderNormal, surfaceNormal), 2.), .0025));
    md = min(md, dot(.5 * (mr + r), borderNormal) / crossing);
  }
  return md;
}

// Fingernails are drawn rather than modelled: a plate too thin for the mesh to hold.
// Returns the plate mask and writes a height for the bump: the raised plate with
// faint ridges, grooves along the cuticle and side folds, and the free edge at the tip.
float nail(vec3 p, vec3 n, out float height, out float freeEdge) {
  float mask = 0.;
  height = 0.;
  freeEdge = 0.;
  for (int i = 0; i < 5; i++) {
    vec3 q = p - nailCenter[i];
    float facing = dot(n, nailDorsal[i]);
    // Only the skin just around the plate: neighbouring fingers share its projection, not its depth.
    float depth = abs(dot(q, nailDorsal[i]));
    if (facing < .05 || depth > .34 || dot(q, q) > 9.) continue;
    vec2 uv = vec2(dot(q, nailLateral[i]), dot(q, nailForward[i])) / nailSize[i];
    // A squarish oval whose tip end runs past the fingertip, where the dorsal facing fades it out.
    float e = pow(pow(abs(uv.x), 2.8) + pow(abs(min(uv.y, .0) * 1.08) + max(uv.y, 0.) * .78, 2.8), 1. / 2.8);
    float aa = max(fwidth(e), 1e-3);
    float near = smoothstep(.12, .4, facing) * (1. - smoothstep(.2, .34, depth));
    float plate = (1. - smoothstep(1. - aa, 1. + aa, e)) * near;
    float fold = exp(-pow((e - 1.08) / .07, 2.)) * near;
    float tip = smoothstep(.55, .95, uv.y) * plate;
    height += plate * (.022 + .01 * (1. - uv.x * uv.x) + .0003 * sin(uv.x * 40.)) - fold * .022 * (1. - tip);
    freeEdge = max(freeEdge, tip);
    mask = max(mask, plate);
  }
  return mask;
}

// Lines thinner than a pixel are drawn a pixel wide at reduced strength, so they stay continuous.
float crackLine(float distance, float width) {
  float aa = max(fwidth(distance), 1e-4);
  float drawn = max(width, aa * .75);
  return (1. - smoothstep(drawn - aa, drawn + aa, distance)) * min(1., width / drawn);
}

// Bump mapping from a scalar height field (after three's perturbNormalArb).
vec3 perturbHeight(vec3 surfacePosition, vec3 n, float height, float faceDirection) {
  vec3 dx = dFdx(surfacePosition), dy = dFdy(surfacePosition);
  vec3 r1 = cross(dy, n), r2 = cross(n, dx);
  float det = dot(dx, r1) * faceDirection;
  vec3 gradient = sign(det) * (dFdx(height) * r1 + dFdy(height) * r2);
  return normalize(abs(det) * n - gradient);
}
`;

export const colorMain = /* glsl */ `
#include <color_fragment>
// Main fractures, then hairline branches that only appear near them.
vec3 restNormal = normalize(vRestNormal);
float mainDistance = crackDistance(warp(vRest * .2), .5, restNormal) / .2;
float hairDistance = crackDistance(warp(vRest * .6 + 11.), .55, restNormal) / .6;
float jitter = (valueNoise(vRest * 9.) - .5) * .012;
float hairNear = exp(-mainDistance * 3.2);
float fissure = max(crackLine(mainDistance + jitter, .026), crackLine(hairDistance + jitter * .5, .011) * hairNear);
float lacquer = max(crackLine(mainDistance + jitter, .075), crackLine(hairDistance + jitter * .5, .024) * hairNear);

float front = reveal * 1.06;
float gilded = (1. - smoothstep(front - .025, front, vFlow)) * step(.001, reveal);
float gold = lacquer * gilded;
float glint = exp(-pow((vFlow - front) / .018, 2.)) * step(.001, reveal) * step(reveal, .999);
float pores = valueNoise(vRest * 38.) * .6 + valueNoise(vRest * 90.) * .4;
float nailHeight, nailEdge;
float nailPlate = nail(vRest, restNormal, nailHeight, nailEdge);
pores *= 1. - .85 * nailPlate;

diffuseColor.rgb *= .985 + .03 * valueNoise(vRest * 2.3);
diffuseColor.rgb *= 1. + .035 * nailPlate + .05 * nailEdge;
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.42, .41, .4), fissure * (1. - gilded));
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1., .74, .34), gold);
`;

export const roughnessMain = /* glsl */ `
#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor + .06 * (pores - .5) - .2 * nailPlate, .2 + .08 * pores, gold);
`;

export const metalnessMain = /* glsl */ `
#include <metalnessmap_fragment>
metalnessFactor = mix(metalnessFactor, 1., gold);
`;

export const normalMain = /* glsl */ `
#include <normal_fragment_maps>
float surfaceHeight = .004 * pores + nailHeight - .03 * fissure * (1. - gilded) + .012 * gold;
normal = perturbHeight(-vViewPosition, normal, surfaceHeight, faceDirection);
`;

export const emissiveMain = /* glsl */ `
#include <emissivemap_fragment>
totalEmissiveRadiance += vec3(1., .66, .24) * (glint * (.9 * lacquer + .05));
`;

export const lightsMain = /* glsl */ `
#include <lights_physical_fragment>
material.clearcoat *= 1. - gold;
`;

export const occlusionMain = /* glsl */ `
float ambientOcclusion = mix(1., vOcclusion, .9);
reflectedLight.indirectDiffuse *= ambientOcclusion;
reflectedLight.directDiffuse *= mix(1., vOcclusion, .35);
#if defined( USE_CLEARCOAT )
  clearcoatSpecularIndirect *= ambientOcclusion;
#endif
#if defined( USE_SHEEN )
  sheenSpecularIndirect *= ambientOcclusion;
#endif
#if defined( USE_ENVMAP ) && defined( STANDARD )
  float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
  reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
#endif
`;
