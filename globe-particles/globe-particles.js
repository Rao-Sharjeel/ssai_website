const globeParticleVertex = `
attribute float a_size;
attribute float a_layer;
attribute float a_landNoise;
attribute float a_glow;

uniform float u_time;
uniform float u_pointSize;
uniform float u_landThreshold;
uniform float u_landSoftness;
uniform float u_landElevation;
uniform float u_depthNear;
uniform float u_depthFar;

varying float v_layer;
varying float v_depth;
varying float v_falloff;
varying float v_land;
varying float v_landNoise;
varying float v_glow;

void main() {
  vec3 pos = position;
  float breathe = 1.0 + sin(u_time * 0.65 + a_layer * 4.0) * 0.012;
  pos *= breathe;

  float land = smoothstep(u_landThreshold - u_landSoftness, u_landThreshold + u_landSoftness, a_landNoise);
  pos *= 1.0 + land * u_landElevation;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = u_pointSize * a_size * (1.0 + land * 0.4) * (1.0 + a_glow * 0.18) * (1.0 / max(0.18, -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;

  // True camera-relative depth (not local-space z, which stays fixed as the
  // globe rotates and would mark the wrong hemisphere as "near"). 0 = closest
  // to camera, 1 = farthest.
  float viewDepth = -mvPosition.z;
  v_layer = a_layer;
  v_land = land;
  v_landNoise = a_landNoise;
  v_glow = a_glow;
  v_depth = smoothstep(u_depthNear, u_depthFar, viewDepth);
  v_falloff = smoothstep(2.45, 0.25, length(pos));
}
`;

const globeParticleFragment = `
precision highp float;

uniform vec3 u_oceanShallow;
uniform vec3 u_oceanMid;
uniform vec3 u_oceanDeep;
uniform vec3 u_landLow;
uniform vec3 u_landMid;
uniform vec3 u_landHigh;
uniform vec3 u_accentColor;
uniform vec3 u_glowColor;
uniform float u_glowIntensity;
uniform float u_landThreshold;
uniform float u_landGradientRange;
uniform float u_oceanGradientRange;
uniform float u_depthDim;

varying float v_layer;
varying float v_depth;
varying float v_falloff;
varying float v_land;
varying float v_landNoise;
varying float v_glow;

vec3 triGradient(vec3 a, vec3 b, vec3 c, float t) {
  vec3 lower = mix(a, b, clamp(t * 2.0, 0.0, 1.0));
  return mix(lower, c, clamp(t * 2.0 - 1.0, 0.0, 1.0));
}

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float alpha = smoothstep(0.5, 0.0, d);
  alpha *= alpha;
  // Tight hot center, separate from the soft outer halo above — used to
  // concentrate the hover-glow into a small bright point (like a lit LED)
  // instead of blooming the whole soft disc into a big blurry blob.
  float core = smoothstep(0.2, 0.0, d);

  // Both gradients ride the same continent noise: higher above the
  // coastline reads as higher land, lower below it reads as deeper ocean.
  float landT = clamp((v_landNoise - u_landThreshold) / max(0.0001, u_landGradientRange), 0.0, 1.0);
  float oceanT = clamp((u_landThreshold - v_landNoise) / max(0.0001, u_oceanGradientRange), 0.0, 1.0);
  vec3 landColor = triGradient(u_landLow, u_landMid, u_landHigh, landT);
  vec3 oceanColor = triGradient(u_oceanShallow, u_oceanMid, u_oceanDeep, oceanT);

  vec3 surface = mix(oceanColor, landColor, v_land);
  vec3 color = mix(surface, u_accentColor, smoothstep(0.35, 1.0, v_layer));
  color = mix(color * 0.6, color, clamp(v_falloff + v_layer * 0.28, 0.0, 1.0));
  alpha *= mix(0.6, 1.0, clamp(v_falloff + v_layer * 0.24, 0.0, 1.0));

  // Near-camera particles render at full brightness; far-side particles
  // fade toward u_depthDim so the sphere reads with real depth.
  float depthVisibility = mix(1.0, u_depthDim, v_depth);
  color *= depthVisibility;
  alpha *= depthVisibility;

  // Particles disturbed by the cursor glow, then fade back to their
  // original color as they settle (v_glow rides the same per-particle
  // return rate as the displacement itself). Concentrated into the core
  // so it reads as a small hot point rather than a big soft blob.
  color += u_glowColor * core * v_glow * u_glowIntensity;
  alpha = clamp(alpha + core * v_glow * 0.5, 0.0, 1.0);

  gl_FragColor = vec4(color, alpha);
}
`;

// Custom (not built-in LineBasicMaterial/PointsMaterial) shaders for the
// surface network. Built-in vertexColors only scales RGB — alpha stays at
// the material's fixed opacity regardless of vertex color, so an "invisible"
// black segment still writes real alpha into the canvas, which then
// visibly darkens the page background behind a transparent additive canvas.
// Driving alpha itself by the per-vertex visibility value avoids that.
const networkLineVertex = `
attribute float a_visible;
varying float v_visible;
void main() {
  v_visible = a_visible;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const networkLineFragment = `
precision highp float;
uniform vec3 u_color;
uniform float u_opacity;
varying float v_visible;
void main() {
  gl_FragColor = vec4(u_color, u_opacity * v_visible);
}
`;

const networkNodeVertex = `
attribute float a_visible;
uniform float u_size;
varying float v_visible;
void main() {
  v_visible = a_visible;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = u_size * (1.0 / max(0.1, -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;
}
`;

const networkNodeFragment = `
precision highp float;
uniform vec3 u_color;
uniform float u_opacity;
uniform sampler2D u_map;
varying float v_visible;
void main() {
  vec4 tex = texture2D(u_map, gl_PointCoord);
  gl_FragColor = vec4(u_color * tex.rgb, tex.a * u_opacity * v_visible);
}
`;

function hexToRgb01(hex) {
  const clean = hex.replace("#", "").trim();
  const value = clean.length === 3
    ? clean.split("").map((char) => char + char).join("")
    : clean;

  return new THREE.Color(
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255
  );
}

// Deterministic 3D value noise (hashed lattice + trilinear interpolation)
// used to grow continent-shaped blobs on the sphere without any external
// map assets. fBm layers a few octaves for coastline detail.
function hashLattice(x, y, z) {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
  return h - Math.floor(h);
}

function fade(t) {
  return t * t * (3 - 2 * t);
}

function valueNoise3D(x, y, z) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;
  const u = fade(xf);
  const v = fade(yf);
  const w = fade(zf);

  const c000 = hashLattice(xi, yi, zi);
  const c100 = hashLattice(xi + 1, yi, zi);
  const c010 = hashLattice(xi, yi + 1, zi);
  const c110 = hashLattice(xi + 1, yi + 1, zi);
  const c001 = hashLattice(xi, yi, zi + 1);
  const c101 = hashLattice(xi + 1, yi, zi + 1);
  const c011 = hashLattice(xi, yi + 1, zi + 1);
  const c111 = hashLattice(xi + 1, yi + 1, zi + 1);

  const x00 = c000 + (c100 - c000) * u;
  const x10 = c010 + (c110 - c010) * u;
  const x01 = c001 + (c101 - c001) * u;
  const x11 = c011 + (c111 - c011) * u;

  const y0 = x00 + (x10 - x00) * v;
  const y1 = x01 + (x11 - x01) * v;

  return y0 + (y1 - y0) * w;
}

function continentNoise(x, y, z, seedOffset) {
  const sx = x + seedOffset;
  const sy = y + seedOffset * 1.37;
  const sz = z + seedOffset * 0.71;

  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let octave = 0; octave < 4; octave++) {
    sum += valueNoise3D(sx * freq, sy * freq, sz * freq) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.15;
  }
  return (sum / norm) * 2 - 1;
}

function buildGlobeParticleGeometry(options = {}) {
  const sphereCount = options.sphereCount ?? 4200;
  const ringCount = options.ringCount ?? 1800;
  const radius = options.radius ?? 1.35;
  const ringRadius = options.ringRadius ?? 2.05;
  const ringThickness = options.ringThickness ?? 0.12;
  const continentScale = options.continentScale ?? 2.1;
  const continentSeed = options.continentSeed ?? 4.2;
  const total = sphereCount + ringCount;

  const positions = new Float32Array(total * 3);
  const sizes = new Float32Array(total);
  const layers = new Float32Array(total);
  const landNoise = new Float32Array(total);

  for (let i = 0; i < sphereCount; i++) {
    const z = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const r = radius * (0.58 + Math.pow(Math.random(), 0.42) * 0.42);
    const root = Math.sqrt(1 - z * z);
    const index = i * 3;

    const dirX = Math.cos(theta) * root;
    const dirY = Math.sin(theta) * root;
    const dirZ = z;

    positions[index] = dirX * r;
    positions[index + 1] = dirY * r;
    positions[index + 2] = dirZ * r;
    sizes[i] = 0.72 + Math.random() * 0.72;
    layers[i] = Math.random() * 0.28;
    landNoise[i] = continentNoise(dirX * continentScale, dirY * continentScale, dirZ * continentScale, continentSeed);
  }

  for (let i = 0; i < ringCount; i++) {
    const pointIndex = sphereCount + i;
    const angle = Math.random() * Math.PI * 2;
    const r = ringRadius + (Math.random() - 0.5) * ringThickness;
    const y = (Math.random() - 0.5) * ringThickness * 0.58;
    const index = pointIndex * 3;

    positions[index] = Math.cos(angle) * r;
    positions[index + 1] = y;
    positions[index + 2] = Math.sin(angle) * r;
    sizes[pointIndex] = 0.62 + Math.random() * 0.58;
    layers[pointIndex] = 0.72 + Math.random() * 0.28;
    landNoise[pointIndex] = -1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("a_size", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("a_layer", new THREE.BufferAttribute(layers, 1));
  geometry.setAttribute("a_landNoise", new THREE.BufferAttribute(landNoise, 1));
  return geometry;
}

// Building sites are sampled independently from the particle cloud, kept
// only where the same continent noise reads solidly as land, so towers only
// ever rise on land, never over open ocean or the ring.
function buildBuildingAnchors(options = {}) {
  const buildingCount = options.buildingCount ?? 220;
  const radius = options.radius ?? 1.35;
  const continentScale = options.continentScale ?? 2.1;
  const continentSeed = options.continentSeed ?? 4.2;
  const landThreshold = options.landThreshold ?? 0.08;

  const anchors = [];
  let attempts = 0;
  const maxAttempts = buildingCount * 60;

  while (anchors.length < buildingCount && attempts < maxAttempts) {
    attempts++;
    const z = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const root = Math.sqrt(1 - z * z);
    const dirX = Math.cos(theta) * root;
    const dirY = Math.sin(theta) * root;
    const dirZ = z;

    const noise = continentNoise(dirX * continentScale, dirY * continentScale, dirZ * continentScale, continentSeed);
    if (noise < landThreshold + 0.05) continue;

    anchors.push({
      pos: new THREE.Vector3(dirX * radius, dirY * radius, dirZ * radius),
      normal: new THREE.Vector3(dirX, dirY, dirZ),
      quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dirX, dirY, dirZ)),
      maxHeight: 0.05 + Math.random() * Math.random() * 0.26,
      footprint: 0.012 + Math.random() * 0.016,
      rate: 0.02 + Math.random() * 0.12,
      radiusJitter: 0.7 + Math.random() * 0.8,
    });
  }

  return anchors;
}

// A static node/edge graph pinned to the sphere's surface — independent of
// the particle cloud entirely, so it never reacts to the repel/glow state.
// Nodes are spread evenly with a Fibonacci-sphere lattice (rather than
// random placement) so the mesh reads as a clean geometric network like a
// data-globe overlay, not a scatter of stray lines.
function buildSurfaceNetwork(options = {}) {
  const nodeCount = options.networkNodeCount ?? 240;
  const minNeighbors = options.networkMinNeighbors ?? 2;
  const maxNeighbors = options.networkMaxNeighbors ?? 6;
  const longRangeChance = options.networkLongRangeChance ?? 0.25;
  const radius = (options.radius ?? 1.35) * 1.01;

  // Random placement (not an even lattice) so nodes cluster and leave gaps
  // like an organic constellation instead of a uniform geodesic grid.
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    const z = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.max(0, 1 - z * z));
    nodes.push(new THREE.Vector3(Math.cos(theta) * r * radius, Math.sin(theta) * r * radius, z * radius));
  }

  const edgeKeys = new Set();
  const edges = [];

  function addEdge(i, j) {
    if (i === j) return;
    const key = i < j ? `${i}_${j}` : `${j}_${i}`;
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push([i, j]);
  }

  for (let i = 0; i < nodes.length; i++) {
    const distances = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      distances.push([j, nodes[i].distanceToSquared(nodes[j])]);
    }
    distances.sort((a, b) => a[1] - b[1]);

    // Each node gets a random number of links, drawn from a shuffled pool
    // of its nearby candidates (wider than the link count itself) rather
    // than always the strict nearest-K — so the mesh reads as irregular
    // and hand-drawn instead of a clean, uniform triangulation.
    const neighborCount = minNeighbors + Math.floor(Math.random() * (maxNeighbors - minNeighbors + 1));
    const poolSize = Math.min(distances.length, neighborCount + 5);
    const pool = distances.slice(0, poolSize);
    for (let k = pool.length - 1; k > 0; k--) {
      const swapIdx = Math.floor(Math.random() * (k + 1));
      const tmp = pool[k];
      pool[k] = pool[swapIdx];
      pool[swapIdx] = tmp;
    }
    for (let k = 0; k < Math.min(neighborCount, pool.length); k++) {
      addEdge(i, pool[k][0]);
    }

    // Occasional long-range jump across the sphere for visual complexity —
    // without these every edge stays short and local, which still reads
    // as too clean/geometric even with randomized local connectivity.
    if (Math.random() < longRangeChance) {
      addEdge(i, Math.floor(Math.random() * nodes.length));
    }
  }

  return { nodes, edges };
}

function makeGlowSpriteTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.55)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

// Per-particle randomization driving the repel simulation: each particle
// carries its own effective radius, push-direction jitter, push strength,
// and return rate so the disturbed region reads as a rough, torn patch
// instead of a smooth circle, and particles drift back independently
// instead of snapping back in lockstep.
function buildRepelSeeds(total) {
  const radiusDev = new Float32Array(total);
  const pushMulDev = new Float32Array(total);
  const returnDev = new Float32Array(total);
  const dirJitter = new Float32Array(total * 3);

  for (let i = 0; i < total; i++) {
    radiusDev[i] = Math.random() * 2 - 1;
    pushMulDev[i] = Math.random() * 2 - 1;
    returnDev[i] = Math.random() * 2 - 1;
    const j = i * 3;
    dirJitter[j] = Math.random() * 2 - 1;
    dirJitter[j + 1] = Math.random() * 2 - 1;
    dirJitter[j + 2] = Math.random() * 2 - 1;
  }

  return { radiusDev, pushMulDev, returnDev, dirJitter };
}

function initGlobeParticles(canvas, options = {}) {
  if (!canvas) {
    const noop = () => {};
    noop.update = () => {};
    return noop;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options.maxDpr || 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, options.cameraDistance || 5.6);

  const accent = options.accentColor
    ? new THREE.Color(options.accentColor)
    : hexToRgb01(getComputedStyle(document.documentElement).getPropertyValue("--brand-accent").trim() || "#8b5cf6");

  // Depth-fade window: particles within `depthMargin` of the camera distance
  // render at full brightness; beyond it they fade toward u_depthDim.
  let depthMargin = options.depthMargin ?? 2.4;

  const geometry = buildGlobeParticleGeometry(options);
  const material = new THREE.ShaderMaterial({
    vertexShader: globeParticleVertex,
    fragmentShader: globeParticleFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      u_time: { value: 0 },
      u_pointSize: { value: options.pointSize || 12 },
      u_oceanShallow: { value: new THREE.Color(options.oceanColorShallow || 0x3fb8c4) },
      u_oceanMid: { value: new THREE.Color(options.oceanColorMid || 0x2166ac) },
      u_oceanDeep: { value: new THREE.Color(options.oceanColorDeep || 0x0d1f3d) },
      u_landLow: { value: new THREE.Color(options.landColorLow || 0xe8c99b) },
      u_landMid: { value: new THREE.Color(options.landColorMid || 0x8a9a4b) },
      u_landHigh: { value: new THREE.Color(options.landColorHigh || 0x5c4326) },
      u_landGradientRange: { value: options.landGradientRange ?? 0.35 },
      u_oceanGradientRange: { value: options.oceanGradientRange ?? 0.35 },
      u_accentColor: { value: accent },
      u_landThreshold: { value: options.landThreshold ?? 0.08 },
      u_landSoftness: { value: options.landSoftness ?? 0.15 },
      u_landElevation: { value: options.landElevation ?? 0.02 },
      u_depthNear: { value: camera.position.z - depthMargin },
      u_depthFar: { value: camera.position.z + depthMargin },
      u_depthDim: { value: options.depthDim ?? 0.32 },
      u_glowColor: { value: new THREE.Color(options.glowColor ?? 0xffffff) },
      u_glowIntensity: { value: options.glowIntensity ?? 1.4 },
    },
  });

  const glowArray = new Float32Array(geometry.getAttribute("position").count);
  geometry.setAttribute("a_glow", new THREE.BufferAttribute(glowArray, 1));

  const particles = new THREE.Points(geometry, material);

  // Skyscrapers: a separate instanced-box layer anchored to land sites,
  // sharing the same rotation/scale as the particle sphere via `globeGroup`
  // so they stay pinned to the surface as it spins.
  const globeGroup = new THREE.Group();
  globeGroup.add(particles);

  const buildingAnchors = options.buildings === false ? [] : buildBuildingAnchors(options);
  let buildings = null;
  let buildingHeights = null;
  if (buildingAnchors.length > 0) {
    const buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
    buildingGeometry.translate(0, 0.5, 0);
    const buildingMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(options.buildingColor ?? 0xbfe9ff),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    buildings = new THREE.InstancedMesh(buildingGeometry, buildingMaterial, buildingAnchors.length);
    buildingHeights = new Float32Array(buildingAnchors.length);
    globeGroup.add(buildings);
  }

  // Surface network: a static wireframe pinned to the sphere itself — its
  // node/edge positions never move with the repel simulation. What DOES
  // change each frame is per-node/edge brightness, which fades in only
  // near the cursor and back out elsewhere, via a custom shader that drives
  // alpha (not just color) from a per-vertex visibility attribute — the
  // built-in LineBasicMaterial/PointsMaterial only scale RGB via vertexColors
  // and leave alpha at the material's fixed opacity, so an "invisible" black
  // segment would still write real alpha into the transparent canvas and
  // visibly darken the page background behind it.
  const network = options.network === false ? null : buildSurfaceNetwork(options);
  let networkLines = null;
  let networkNodes = null;
  let networkGlowTexture = null;
  let networkNodeVisibleAttr = null;
  let networkLineVisibleAttr = null;
  let networkNodeVisible = null;
  if (network) {
    const linePositions = new Float32Array(network.edges.length * 2 * 3);
    const lineVisible = new Float32Array(network.edges.length * 2);
    network.edges.forEach(([i, j], idx) => {
      const a = network.nodes[i];
      const b = network.nodes[j];
      const base = idx * 6;
      linePositions[base] = a.x;
      linePositions[base + 1] = a.y;
      linePositions[base + 2] = a.z;
      linePositions[base + 3] = b.x;
      linePositions[base + 4] = b.y;
      linePositions[base + 5] = b.z;
    });
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    networkLineVisibleAttr = new THREE.BufferAttribute(lineVisible, 1).setUsage(THREE.DynamicDrawUsage);
    lineGeometry.setAttribute("a_visible", networkLineVisibleAttr);
    const lineMaterial = new THREE.ShaderMaterial({
      vertexShader: networkLineVertex,
      fragmentShader: networkLineFragment,
      uniforms: {
        u_color: { value: new THREE.Color(options.connectionColor ?? 0x8fe9ff) },
        u_opacity: { value: options.connectionOpacity ?? 0.8 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    networkLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    globeGroup.add(networkLines);

    const nodePositions = new Float32Array(network.nodes.length * 3);
    const nodeVisible = new Float32Array(network.nodes.length);
    networkNodeVisible = new Float32Array(network.nodes.length);
    network.nodes.forEach((n, idx) => {
      nodePositions[idx * 3] = n.x;
      nodePositions[idx * 3 + 1] = n.y;
      nodePositions[idx * 3 + 2] = n.z;
    });
    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
    networkNodeVisibleAttr = new THREE.BufferAttribute(nodeVisible, 1).setUsage(THREE.DynamicDrawUsage);
    nodeGeometry.setAttribute("a_visible", networkNodeVisibleAttr);
    networkGlowTexture = makeGlowSpriteTexture();
    const nodeMaterial = new THREE.ShaderMaterial({
      vertexShader: networkNodeVertex,
      fragmentShader: networkNodeFragment,
      uniforms: {
        u_color: { value: new THREE.Color(options.connectionColor ?? 0x8fe9ff) },
        u_opacity: { value: 0.9 },
        u_size: { value: options.networkNodeSize ?? 60 },
        u_map: { value: networkGlowTexture },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    networkNodes = new THREE.Points(nodeGeometry, nodeMaterial);
    globeGroup.add(networkNodes);
  }

  scene.add(globeGroup);

  const positionAttribute = geometry.getAttribute("position");
  const positions = positionAttribute.array;
  const basePositions = Float32Array.from(positions);
  const displacement = new Float32Array(positions.length);
  const total = positionAttribute.count;
  const seeds = buildRepelSeeds(total);
  const glowAttribute = geometry.getAttribute("a_glow");

  // Mutable tuning state, live-editable via the returned handle's .update().
  const state = {
    tiltX: options.tiltX ?? -0.42,
    tiltZ: options.tiltZ ?? 0.22,
    rotationSpeed: options.rotationSpeed ?? 0.12,
    mouseStrength: options.mouseStrength ?? 0.08,
    repelRadius: options.repelRadius ?? 0.55,
    repelMax: options.repelStrength ?? 0.45,
    repelEase: options.repelEase ?? 0.08,
    roughness: options.roughness ?? 0.6,
    buildingHeightScale: options.buildingHeightScale ?? 1,
    connectionOpacity: options.connectionOpacity ?? 0.8,
    networkRadius: options.networkRadius ?? 0.75,
    networkEase: options.networkEase ?? 0.12,
  };
  globeGroup.rotation.x = state.tiltX;
  globeGroup.rotation.z = state.tiltZ;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = new THREE.Vector2(0, 0);
  let rafId = 0;

  const raycaster = new THREE.Raycaster();
  // Repel targeting hits the visible particle shell first (so the particles
  // actually under the cursor react, not just a thin ring at the sphere's
  // silhouette edge), falling back to the center plane for cursor positions
  // that miss the sphere entirely (e.g. hovering over just the ring).
  const repelSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), (options.radius || 1.35) * 1.05);
  const repelPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const ndcPointer = new THREE.Vector2(9999, 9999);
  const mouseWorld = new THREE.Vector3(9999, 9999, 9999);
  const mouseLocal = new THREE.Vector3(9999, 9999, 9999);
  let hovering = false;

  function resize() {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options.maxDpr || 1.6));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function handlePointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    ndcPointer.x = pointer.x;
    ndcPointer.y = -pointer.y;
    hovering = true;
  }

  function handlePointerLeave(event) {
    if (!event.relatedTarget) hovering = false;
  }

  function handleWindowBlur() {
    hovering = false;
  }

  function updateRepelSimulation() {
    const strengthNow = hovering ? state.repelMax : 0;
    const roughness = state.roughness;
    const mx = mouseLocal.x;
    const my = mouseLocal.y;
    const mz = mouseLocal.z;

    for (let i = 0; i < total; i++) {
      const i3 = i * 3;
      const bx = basePositions[i3];
      const by = basePositions[i3 + 1];
      const bz = basePositions[i3 + 2];

      let tx = 0;
      let ty = 0;
      let tz = 0;
      let glowTarget = 0;

      if (strengthNow > 0) {
        const dx = bx - mx;
        const dy = by - my;
        const dz = bz - mz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Per-particle radius jitter tears up the falloff boundary so it
        // no longer reads as a clean sphere/circle around the cursor.
        const effRadius = Math.max(0.001, state.repelRadius * (1 + seeds.radiusDev[i] * roughness * 0.7));

        if (dist < effRadius) {
          const edge = 1 - dist / effRadius;
          const falloff = edge * edge * (3 - 2 * edge);
          const invDist = dist > 0.0001 ? 1 / dist : 0;

          let dirx = dx * invDist + seeds.dirJitter[i3] * roughness * 0.6;
          let diry = dy * invDist + seeds.dirJitter[i3 + 1] * roughness * 0.6;
          let dirz = dz * invDist + seeds.dirJitter[i3 + 2] * roughness * 0.6;
          const dirLen = Math.sqrt(dirx * dirx + diry * diry + dirz * dirz) || 1;
          dirx /= dirLen;
          diry /= dirLen;
          dirz /= dirLen;

          const pushMul = Math.max(0.15, 1 + seeds.pushMulDev[i] * roughness);
          const pushMag = falloff * strengthNow * pushMul;

          tx = dirx * pushMag;
          ty = diry * pushMag;
          tz = dirz * pushMag;
          glowTarget = falloff;
        }
      }

      // Each particle eases toward its target at its own rate, so the
      // patch doesn't snap back in lockstep once the cursor moves away.
      // Glow rides the exact same rate as the displacement, so a particle's
      // color returns to normal in step with its position settling back.
      const rate = Math.min(1, Math.max(0.006, state.repelEase * (1 + seeds.returnDev[i] * roughness * 1.4)));
      displacement[i3] += (tx - displacement[i3]) * rate;
      displacement[i3 + 1] += (ty - displacement[i3 + 1]) * rate;
      displacement[i3 + 2] += (tz - displacement[i3 + 2]) * rate;
      glowArray[i] += (glowTarget - glowArray[i]) * rate;

      positions[i3] = bx + displacement[i3];
      positions[i3 + 1] = by + displacement[i3 + 1];
      positions[i3 + 2] = bz + displacement[i3 + 2];
    }

    positionAttribute.needsUpdate = true;
    glowAttribute.needsUpdate = true;
  }

  const buildingMatrix = new THREE.Matrix4();
  const buildingPos = new THREE.Vector3();
  const buildingScale = new THREE.Vector3();

  function updateBuildings() {
    if (!buildings) return;

    for (let i = 0; i < buildingAnchors.length; i++) {
      const a = buildingAnchors[i];
      let target = 0;

      if (hovering) {
        const dx = a.pos.x - mouseLocal.x;
        const dy = a.pos.y - mouseLocal.y;
        const dz = a.pos.z - mouseLocal.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const effRadius = Math.max(0.001, state.repelRadius * a.radiusJitter * 1.3);

        if (dist < effRadius) {
          const edge = 1 - dist / effRadius;
          const falloff = edge * edge * (3 - 2 * edge);
          target = falloff * a.maxHeight * state.buildingHeightScale;
        }
      }

      const rate = Math.min(1, Math.max(0.01, state.repelEase * (0.6 + a.rate * 3)));
      buildingHeights[i] += (target - buildingHeights[i]) * rate;
      const height = Math.max(0.0008, buildingHeights[i]);

      // Shrink the footprint along with height so a resting building
      // vanishes to a sliver instead of sitting there as a flat tile.
      const growth = Math.min(1, height / a.maxHeight);
      const footprint = a.footprint * Math.max(0.04, growth);

      buildingPos.copy(a.pos);
      buildingScale.set(footprint, height, footprint);
      buildingMatrix.compose(buildingPos, a.quat, buildingScale);
      buildings.setMatrixAt(i, buildingMatrix);
    }

    buildings.instanceMatrix.needsUpdate = true;
  }

  function updateNetwork() {
    if (!network) return;

    const radius = Math.max(0.001, state.networkRadius);
    const radiusSq = radius * radius;
    const ease = state.networkEase;

    for (let i = 0; i < network.nodes.length; i++) {
      let target = 0;
      if (hovering) {
        const n = network.nodes[i];
        const dx = n.x - mouseLocal.x;
        const dy = n.y - mouseLocal.y;
        const dz = n.z - mouseLocal.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < radiusSq) {
          const edge = 1 - Math.sqrt(distSq) / radius;
          target = edge * edge * (3 - 2 * edge);
        }
      }
      networkNodeVisible[i] += (target - networkNodeVisible[i]) * ease;
      networkNodeVisibleAttr.array[i] = networkNodeVisible[i];
    }
    networkNodeVisibleAttr.needsUpdate = true;

    network.edges.forEach(([i, j], idx) => {
      const v = Math.min(networkNodeVisible[i], networkNodeVisible[j]);
      const base = idx * 2;
      networkLineVisibleAttr.array[base] = v;
      networkLineVisibleAttr.array[base + 1] = v;
    });
    networkLineVisibleAttr.needsUpdate = true;
  }

  function render(time = 0) {
    const t = time * 0.001;
    material.uniforms.u_time.value = t;

    const breath = reduceMotion ? 0 : Math.sin(t * 0.55) * 0.045;
    globeGroup.rotation.y = t * state.rotationSpeed;
    globeGroup.rotation.x = state.tiltX + pointer.y * state.mouseStrength;
    globeGroup.rotation.z = state.tiltZ + pointer.x * state.mouseStrength;
    globeGroup.scale.setScalar(1 + breath);
    globeGroup.updateMatrixWorld();

    if (hovering) {
      raycaster.setFromCamera(ndcPointer, camera);
      const hitSurface = raycaster.ray.intersectSphere(repelSphere, mouseWorld);
      if (!hitSurface) raycaster.ray.intersectPlane(repelPlane, mouseWorld);
    }
    mouseLocal.copy(mouseWorld);
    globeGroup.worldToLocal(mouseLocal);

    updateRepelSimulation();
    updateBuildings();
    updateNetwork();

    renderer.render(scene, camera);
    if (!reduceMotion) rafId = requestAnimationFrame(render);
  }

  function handleResize() {
    cancelAnimationFrame(rafId);
    resize();
    render();
  }

  resize();
  render();
  window.addEventListener("resize", handleResize);
  window.addEventListener("pointermove", handlePointerMove);
  document.addEventListener("mouseout", handlePointerLeave);
  window.addEventListener("blur", handleWindowBlur);

  const destroy = () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("mouseout", handlePointerLeave);
    window.removeEventListener("blur", handleWindowBlur);
    geometry.dispose();
    material.dispose();
    if (buildings) {
      buildings.geometry.dispose();
      buildings.material.dispose();
    }
    if (networkLines) {
      networkLines.geometry.dispose();
      networkLines.material.dispose();
      networkNodes.geometry.dispose();
      networkNodes.material.dispose();
      networkGlowTexture.dispose();
    }
    renderer.dispose();
  };

  // Live tuning: only fields present in `patch` are touched.
  destroy.update = (patch = {}) => {
    if (patch.pointSize !== undefined) material.uniforms.u_pointSize.value = patch.pointSize;
    if (patch.glowColor !== undefined) material.uniforms.u_glowColor.value.set(patch.glowColor);
    if (patch.glowIntensity !== undefined) material.uniforms.u_glowIntensity.value = patch.glowIntensity;
    if (patch.oceanColorShallow !== undefined) material.uniforms.u_oceanShallow.value.set(patch.oceanColorShallow);
    if (patch.oceanColorMid !== undefined) material.uniforms.u_oceanMid.value.set(patch.oceanColorMid);
    if (patch.oceanColorDeep !== undefined) material.uniforms.u_oceanDeep.value.set(patch.oceanColorDeep);
    if (patch.landColorLow !== undefined) material.uniforms.u_landLow.value.set(patch.landColorLow);
    if (patch.landColorMid !== undefined) material.uniforms.u_landMid.value.set(patch.landColorMid);
    if (patch.landColorHigh !== undefined) material.uniforms.u_landHigh.value.set(patch.landColorHigh);
    if (patch.landGradientRange !== undefined) material.uniforms.u_landGradientRange.value = patch.landGradientRange;
    if (patch.oceanGradientRange !== undefined) material.uniforms.u_oceanGradientRange.value = patch.oceanGradientRange;
    if (patch.accentColor !== undefined) material.uniforms.u_accentColor.value.set(patch.accentColor);
    if (patch.landThreshold !== undefined) material.uniforms.u_landThreshold.value = patch.landThreshold;
    if (patch.landSoftness !== undefined) material.uniforms.u_landSoftness.value = patch.landSoftness;
    if (patch.landElevation !== undefined) material.uniforms.u_landElevation.value = patch.landElevation;
    if (patch.depthDim !== undefined) material.uniforms.u_depthDim.value = patch.depthDim;
    if (patch.depthMargin !== undefined) depthMargin = patch.depthMargin;
    if (patch.cameraDistance !== undefined) camera.position.setZ(patch.cameraDistance);
    if (patch.cameraDistance !== undefined || patch.depthMargin !== undefined) {
      material.uniforms.u_depthNear.value = camera.position.z - depthMargin;
      material.uniforms.u_depthFar.value = camera.position.z + depthMargin;
    }
    if (patch.repelRadius !== undefined) state.repelRadius = patch.repelRadius;
    if (patch.repelStrength !== undefined) state.repelMax = patch.repelStrength;
    if (patch.repelEase !== undefined) state.repelEase = patch.repelEase;
    if (patch.roughness !== undefined) state.roughness = patch.roughness;
    if (patch.buildingHeightScale !== undefined) state.buildingHeightScale = patch.buildingHeightScale;
    if (patch.buildingColor !== undefined && buildings) buildings.material.color.set(patch.buildingColor);
    if (patch.connectionColor !== undefined && networkLines) {
      networkLines.material.uniforms.u_color.value.set(patch.connectionColor);
      networkNodes.material.uniforms.u_color.value.set(patch.connectionColor);
    }
    if (patch.connectionOpacity !== undefined && networkLines) {
      state.connectionOpacity = patch.connectionOpacity;
      networkLines.material.uniforms.u_opacity.value = patch.connectionOpacity;
    }
    if (patch.networkRadius !== undefined) state.networkRadius = patch.networkRadius;
    if (patch.networkEase !== undefined) state.networkEase = patch.networkEase;
    if (patch.rotationSpeed !== undefined) state.rotationSpeed = patch.rotationSpeed;
    if (patch.mouseStrength !== undefined) state.mouseStrength = patch.mouseStrength;
    if (patch.tiltX !== undefined) state.tiltX = patch.tiltX;
    if (patch.tiltZ !== undefined) state.tiltZ = patch.tiltZ;
  };

  return destroy;
}
