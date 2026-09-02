const globeParticleVertex = `
attribute float a_size;
attribute float a_layer;

uniform float u_time;
uniform float u_pointSize;

varying float v_layer;
varying float v_depth;
varying float v_falloff;

void main() {
  vec3 pos = position;
  float breathe = 1.0 + sin(u_time * 0.65 + a_layer * 4.0) * 0.012;
  pos *= breathe;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = u_pointSize * a_size * (1.0 / max(0.18, -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;

  v_layer = a_layer;
  v_depth = smoothstep(-1.8, 1.8, pos.z);
  v_falloff = smoothstep(2.45, 0.25, length(pos));
}
`;

const globeParticleFragment = `
precision highp float;

uniform vec3 u_coreColor;
uniform vec3 u_accentColor;

varying float v_layer;
varying float v_depth;
varying float v_falloff;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float alpha = smoothstep(0.5, 0.0, d);
  alpha *= alpha;

  vec3 color = mix(u_coreColor, u_accentColor, smoothstep(0.35, 1.0, v_layer));
  color += vec3(1.0) * v_depth * 0.08;
  color = mix(color * 0.42, color, clamp(v_falloff + v_layer * 0.28, 0.0, 1.0));
  alpha *= mix(0.52, 1.0, clamp(v_falloff + v_layer * 0.24, 0.0, 1.0));

  gl_FragColor = vec4(color, alpha);
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

function buildGlobeParticleGeometry(options = {}) {
  const sphereCount = options.sphereCount || 2600;
  const ringCount = options.ringCount || 1300;
  const radius = options.radius || 1.35;
  const ringRadius = options.ringRadius || 2.05;
  const ringThickness = options.ringThickness || 0.12;
  const total = sphereCount + ringCount;

  const positions = new Float32Array(total * 3);
  const sizes = new Float32Array(total);
  const layers = new Float32Array(total);

  for (let i = 0; i < sphereCount; i++) {
    const z = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const r = radius * (0.58 + Math.pow(Math.random(), 0.42) * 0.42);
    const root = Math.sqrt(1 - z * z);
    const index = i * 3;

    positions[index] = Math.cos(theta) * root * r;
    positions[index + 1] = Math.sin(theta) * root * r;
    positions[index + 2] = z * r;
    sizes[i] = 0.72 + Math.random() * 0.72;
    layers[i] = Math.random() * 0.28;
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
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("a_size", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("a_layer", new THREE.BufferAttribute(layers, 1));
  return geometry;
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

  const geometry = buildGlobeParticleGeometry(options);
  const material = new THREE.ShaderMaterial({
    vertexShader: globeParticleVertex,
    fragmentShader: globeParticleFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      u_time: { value: 0 },
      u_pointSize: { value: options.pointSize || 18 },
      u_coreColor: { value: new THREE.Color(options.coreColor || 0xf8fafc) },
      u_accentColor: { value: accent },
    },
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const positionAttribute = geometry.getAttribute("position");
  const positions = positionAttribute.array;
  const basePositions = Float32Array.from(positions);
  const displacement = new Float32Array(positions.length);
  const total = positionAttribute.count;
  const seeds = buildRepelSeeds(total);

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
  };
  particles.rotation.x = state.tiltX;
  particles.rotation.z = state.tiltZ;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = new THREE.Vector2(0, 0);
  let rafId = 0;

  const raycaster = new THREE.Raycaster();
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
        }
      }

      // Each particle eases toward its target at its own rate, so the
      // patch doesn't snap back in lockstep once the cursor moves away.
      const rate = Math.min(1, Math.max(0.006, state.repelEase * (1 + seeds.returnDev[i] * roughness * 1.4)));
      displacement[i3] += (tx - displacement[i3]) * rate;
      displacement[i3 + 1] += (ty - displacement[i3 + 1]) * rate;
      displacement[i3 + 2] += (tz - displacement[i3 + 2]) * rate;

      positions[i3] = bx + displacement[i3];
      positions[i3 + 1] = by + displacement[i3 + 1];
      positions[i3 + 2] = bz + displacement[i3 + 2];
    }

    positionAttribute.needsUpdate = true;
  }

  function render(time = 0) {
    const t = time * 0.001;
    material.uniforms.u_time.value = t;

    const breath = reduceMotion ? 0 : Math.sin(t * 0.55) * 0.045;
    particles.rotation.y = t * state.rotationSpeed;
    particles.rotation.x = state.tiltX + pointer.y * state.mouseStrength;
    particles.rotation.z = state.tiltZ + pointer.x * state.mouseStrength;
    particles.scale.setScalar(1 + breath);
    particles.updateMatrixWorld();

    if (hovering) {
      raycaster.setFromCamera(ndcPointer, camera);
      raycaster.ray.intersectPlane(repelPlane, mouseWorld);
    }
    mouseLocal.copy(mouseWorld);
    particles.worldToLocal(mouseLocal);

    updateRepelSimulation();

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
    renderer.dispose();
  };

  // Live tuning: only fields present in `patch` are touched.
  destroy.update = (patch = {}) => {
    if (patch.pointSize !== undefined) material.uniforms.u_pointSize.value = patch.pointSize;
    if (patch.coreColor !== undefined) material.uniforms.u_coreColor.value.set(patch.coreColor);
    if (patch.accentColor !== undefined) material.uniforms.u_accentColor.value.set(patch.accentColor);
    if (patch.cameraDistance !== undefined) camera.position.setZ(patch.cameraDistance);
    if (patch.repelRadius !== undefined) state.repelRadius = patch.repelRadius;
    if (patch.repelStrength !== undefined) state.repelMax = patch.repelStrength;
    if (patch.repelEase !== undefined) state.repelEase = patch.repelEase;
    if (patch.roughness !== undefined) state.roughness = patch.roughness;
    if (patch.rotationSpeed !== undefined) state.rotationSpeed = patch.rotationSpeed;
    if (patch.mouseStrength !== undefined) state.mouseStrength = patch.mouseStrength;
    if (patch.tiltX !== undefined) state.tiltX = patch.tiltX;
    if (patch.tiltZ !== undefined) state.tiltZ = patch.tiltZ;
  };

  return destroy;
}
