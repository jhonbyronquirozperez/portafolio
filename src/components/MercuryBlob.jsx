import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Planeta cyberpunk estilo Tierra (Three.js).
 *
 * Esfera con continentes/océanos generados por ruido simplex fbm
 * (fractal, varias octavas), relieve real (montañas en tierra, fondo
 * marino plano), casquetes polares, malla de circuito neón cian sobre
 * los continentes, venas de energía (acento naranja de marca) y luces
 * de ciudades parpadeantes en el lado nocturno. Halo atmosférico
 * (shell con back-face + fresnel, pulso sutil) y starfield de fondo.
 * Rotación continua sobre su eje con parallax de mouse y reacción al
 * scroll.
 *
 * Rendimiento: pixelRatio limitado a 2, render pausado cuando la pestaña
 * está oculta o el hero sale del viewport, y un solo frame estático si el
 * usuario pidió movimiento reducido.
 */

// Ruido simplex 3D (Ashima Arts / Stefan Gustavson, MIT) + fbm, compartido
// entre vertex y fragment shader.
const NOISE_GLSL = `
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  float fbm(vec3 p) {
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amp * snoise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return value;
  }
  // Forma de los continentes: ruido de baja frecuencia, umbral ~ costa.
  float continentShape(vec3 p) {
    return fbm(p * 1.05);
  }
  float terrainHeight(vec3 p) {
    float continent = continentShape(p);
    float land = smoothstep(-0.05, 0.18, continent);
    float mountains = fbm(p * 4.5 + 7.7) * 0.5 + 0.5;
    float fineDetail = fbm(p * 13.0 + 2.1) * 0.012;
    float landHeight = mountains * 0.07 + fineDetail;
    float oceanFloor = fbm(p * 2.2 - 3.0) * 0.012 - 0.02;
    return mix(oceanFloor, landHeight, land);
  }
`;

const PLANET_VERTEX = `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  varying vec3 vObjectPosition;
  varying vec2 vUv;

  ${NOISE_GLSL}

  void main() {
    vObjectPosition = position;
    vUv = uv;
    vec3 displaced = position + normal * terrainHeight(position);

    vec3 tangentA = normalize(cross(normal, vec3(0.0, 1.0, 0.0)) + cross(normal, vec3(1.0, 0.0, 0.0)));
    vec3 tangentB = normalize(cross(normal, tangentA));
    float eps = 0.008;
    vec3 pA = position + tangentA * eps;
    vec3 pB = position + tangentB * eps;
    pA += normal * terrainHeight(pA);
    pB += normal * terrainHeight(pB);
    vec3 objectNormal = normalize(cross(pA - displaced, pB - displaced));

    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * objectNormal);

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const EXPLOSION_COUNT = 6;

// Uniforms nombrados individualmente (uExplosion0Point/Age, uExplosion1...)
// en vez de arrays: los uniform arrays no llegaban a la GPU de forma
// fiable en algunos entornos, mientras que los uniforms sueltos (mismo
// patrón que uHoverPoint) sí funcionan siempre.
const explosionUniformDecls = Array.from(
  { length: EXPLOSION_COUNT },
  (_, i) => `uniform vec3 uExplosion${i}Point;\n  uniform float uExplosion${i}Age;`
).join('\n  ');

const explosionSumExpr = Array.from(
  { length: EXPLOSION_COUNT },
  (_, i) => `explosionContribution(uExplosion${i}Point, uExplosion${i}Age)`
).join('\n      + ');

const PLANET_FRAGMENT = `
  uniform vec3 uLightDir;
  uniform vec3 uCameraPos;
  uniform float uTime;
  uniform vec3 uHoverPoint;
  uniform float uHoverStrength;
  ${explosionUniformDecls}

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  varying vec3 vObjectPosition;
  varying vec2 vUv;

  ${NOISE_GLSL}

  // Líneas de circuito tipo placa base, malla holográfica sobre tierra.
  float circuitGrid(vec2 uv) {
    vec2 cellUv = uv * vec2(30.0, 15.0);
    vec2 g = abs(fract(cellUv) - 0.5);
    float line = min(g.x, g.y);
    return 1.0 - smoothstep(0.0, 0.045, line);
  }

  // Explosión: flash + onda de choque pequeña y contenida junto al punto
  // de clic (no recorre todo el planeta), de blanco incandescente a
  // naranja mientras se enfría.
  vec3 explosionContribution(vec3 point, float age) {
    if (age >= 1.0) return vec3(0.0);
    float d = length(vObjectPosition - point);
    float ringRadius = 0.55 * (1.0 - exp(-age * 6.0));
    float ringWidth = 0.05 + age * 0.12;
    float ring = smoothstep(ringWidth, 0.0, abs(d - ringRadius));
    float core = smoothstep(0.32, 0.0, d) * smoothstep(0.3, 0.0, age);
    float fade = smoothstep(1.0, 0.0, age);
    vec3 col = mix(vec3(1.0, 0.98, 0.92), vec3(1.0, 0.24, 0.02), smoothstep(0.0, 0.2, age));
    return col * (ring * 2.2 + core * 3.0) * fade;
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(uCameraPos - vWorldPosition);
    vec3 L = normalize(uLightDir);
    vec3 objDir = normalize(vObjectPosition);

    float continent = continentShape(vObjectPosition);
    float land = smoothstep(-0.05, 0.18, continent);
    float coastGlow = 1.0 - smoothstep(0.0, 0.035, abs(continent + 0.05));
    float landDetail = fbm(vObjectPosition * 6.0 + 5.0);
    float polar = smoothstep(0.76, 0.93, abs(objDir.y));
    float equatorBand = 1.0 - smoothstep(0.0, 0.012, abs(objDir.y));

    // --- Paleta cyberpunk: oceano oscuro, tierra circuito, hielo cian. ---
    vec3 oceanDeep = vec3(0.012, 0.035, 0.065);
    vec3 oceanShallow = vec3(0.02, 0.28, 0.34);
    vec3 landBase = vec3(0.05, 0.058, 0.075);
    vec3 landHigh = vec3(0.16, 0.175, 0.21);
    vec3 gridColor = vec3(0.15, 0.98, 0.95);
    vec3 energyColor = vec3(1.0, 0.361, 0.122);
    vec3 iceColor = vec3(0.72, 0.94, 1.0);
    vec3 cityColor = vec3(1.0, 0.72, 0.32);

    vec3 ocean = mix(oceanDeep, oceanShallow, smoothstep(-0.5, -0.02, continent));
    vec3 landColor = mix(landBase, landHigh, smoothstep(-0.2, 0.5, landDetail));

    // Malla de circuito solo sobre tierra firme (aditiva para que resalte).
    float grid = circuitGrid(vUv) * land;
    landColor += gridColor * grid * 0.55;

    // Venas de energía (acento de marca), pulso lento.
    float ridge = abs(fbm(vObjectPosition * 5.0 - 2.1));
    float veins = smoothstep(0.045, 0.0, ridge) * land;
    veins *= 0.6 + 0.4 * sin(uTime * 0.8 + continent * 4.0);
    landColor = mix(landColor, energyColor, veins * 0.9);

    vec3 base = mix(ocean, landColor, land);
    base = mix(base, gridColor * 0.6, coastGlow * 0.5); // costa luminosa
    base = mix(base, iceColor, polar);
    base = mix(base, gridColor, equatorBand * 0.35); // anillo ecuatorial holográfico

    float diff = max(dot(N, L), 0.0);
    float wrap = diff * 0.5 + 0.5;
    vec3 ambient = base * 0.1;
    vec3 lit = base * (0.14 + wrap * 1.0);

    // Especular: brillo estrecho y frío en el océano, difuso en tierra.
    vec3 H = normalize(L + V);
    float specPower = mix(90.0, 14.0, land);
    float spec = pow(max(dot(N, H), 0.0), specPower) * mix(0.85, 0.18, land);
    vec3 specColor = mix(vec3(0.5, 0.95, 1.0), vec3(1.0), land) * spec;

    // Luces de ciudades en el lado nocturno de tierra firme.
    float night = smoothstep(0.22, -0.15, diff);
    float cityNoise = fbm(vObjectPosition * 80.0 + 13.0);
    float cityMask = step(0.83, cityNoise) * land * night;
    vec3 cityGlow = cityColor * cityMask * 1.8;

    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.5);
    vec3 rim = mix(gridColor, energyColor, 0.3) * fresnel * 0.4;

    // Escáner interactivo: resplandor + anillos de energía en el punto
    // donde el cursor toca la superficie.
    float hoverDist = length(vObjectPosition - uHoverPoint);
    float hoverGlow = smoothstep(0.4, 0.0, hoverDist) * uHoverStrength;
    float ringDecay = smoothstep(1.1, 0.0, hoverDist);
    float ringPattern = smoothstep(0.82, 1.0, sin(hoverDist * 11.0 - uTime * 3.5));
    vec3 hoverColor = mix(gridColor, vec3(1.0), 0.4);
    vec3 hoverFx = hoverColor * hoverGlow * 0.9
      + hoverColor * ringPattern * ringDecay * uHoverStrength * 1.1;

    vec3 explosionFx = ${explosionSumExpr};

    gl_FragColor = vec4(ambient + lit + specColor + cityGlow + rim + hoverFx + explosionFx, 1.0);
  }
`;

const ATMOSPHERE_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const ATMOSPHERE_FRAGMENT = `
  uniform vec3 uCameraPos;
  uniform float uTime;
  uniform float uHoverStrength;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 V = normalize(uCameraPos - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), V), 0.0), 2.6);
    vec3 glow = mix(vec3(0.15, 0.85, 1.0), vec3(1.0, 0.36, 0.12), 0.22);
    float pulse = 0.85 + 0.15 * sin(uTime * (1.2 + uHoverStrength * 1.8));
    float boost = 1.0 + uHoverStrength * 0.5;
    gl_FragColor = vec4(glow, fresnel * 0.7 * pulse * boost);
  }
`;

export function MercuryBlob({ reducedMotion }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    // ----------------------------------------------------------------
    // Escena base.
    // ----------------------------------------------------------------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ----------------------------------------------------------------
    // Planeta: esfera con relieve de cráteres + iluminación direccional.
    // ----------------------------------------------------------------
    const sharedUniforms = {
      uTime: { value: 0 },
      uLightDir: { value: new THREE.Vector3(0.55, 0.35, 0.9).normalize() },
      uCameraPos: { value: camera.position.clone() },
      uHoverPoint: { value: new THREE.Vector3(9999, 9999, 9999) },
      uHoverStrength: { value: 0 },
    };
    for (let i = 0; i < EXPLOSION_COUNT; i++) {
      sharedUniforms[`uExplosion${i}Point`] = { value: new THREE.Vector3(9999, 9999, 9999) };
      sharedUniforms[`uExplosion${i}Age`] = { value: 999 };
    }

    const planetMaterial = new THREE.ShaderMaterial({
      uniforms: sharedUniforms,
      vertexShader: PLANET_VERTEX,
      fragmentShader: PLANET_FRAGMENT,
    });
    const planetGeo = new THREE.SphereGeometry(1.55, 128, 128);
    const planet = new THREE.Mesh(planetGeo, planetMaterial);

    // Halo atmosférico: shell ligeramente más grande, back-face + fresnel.
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: sharedUniforms,
      vertexShader: ATMOSPHERE_VERTEX,
      fragmentShader: ATMOSPHERE_FRAGMENT,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereGeo = new THREE.SphereGeometry(1.55 * 1.06, 64, 64);
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMaterial);

    const planetGroup = new THREE.Group();
    planetGroup.rotation.z = 0.38; // inclinación axial, look "planeta".
    planetGroup.add(planet, atmosphere);
    scene.add(planetGroup);

    // ----------------------------------------------------------------
    // Starfield de fondo: capa densa de puntos con brillo variable +
    // un puñado de estrellas grandes con halo suave.
    // ----------------------------------------------------------------
    const COUNT = 1000;
    const positions = new Float32Array(COUNT * 3);
    const starColors = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3;
      const brightness = 0.35 + Math.random() * 0.65;
      starColors[i * 3] = brightness;
      starColors[i * 3 + 1] = brightness;
      starColors[i * 3 + 2] = brightness;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const particleMat = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.02,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Sprite radial (canvas) para las estrellas grandes con halo.
    function createStarGlowTexture() {
      const size = 64;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.35, 'rgba(255,255,255,0.7)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(canvas);
    }
    const starGlowTexture = createStarGlowTexture();
    const BRIGHT_COUNT = 36;
    const brightPositions = new Float32Array(BRIGHT_COUNT * 3);
    for (let i = 0; i < BRIGHT_COUNT; i++) {
      brightPositions[i * 3] = (Math.random() - 0.5) * 22;
      brightPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      brightPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4;
    }
    const brightGeo = new THREE.BufferGeometry();
    brightGeo.setAttribute('position', new THREE.BufferAttribute(brightPositions, 3));
    const brightMat = new THREE.PointsMaterial({
      map: starGlowTexture,
      size: 0.14,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const brightStars = new THREE.Points(brightGeo, brightMat);
    scene.add(brightStars);

    // ----------------------------------------------------------------
    // Satélites: cuerpo + paneles solares de bajo poligonaje que
    // derivan despacio por la escena, con una luz que parpadea.
    // ----------------------------------------------------------------
    function createSatellite() {
      const group = new THREE.Group();
      const bodyMat = new THREE.MeshBasicMaterial({ color: 0xc7d1cb });
      const panelMat = new THREE.MeshBasicMaterial({ color: 0x0c2b2f });
      const edgeMat = new THREE.MeshBasicMaterial({ color: 0x26faf2 });

      group.add(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.09), bodyMat));

      [-1, 1].forEach((side) => {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.005, 0.06), panelMat);
        panel.position.x = side * 0.14;
        group.add(panel);
        const edge = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.006, 0.006), edgeMat);
        edge.position.set(side * 0.14, 0, 0.03);
        group.add(edge);
      });

      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.05, 4), bodyMat);
      antenna.rotation.z = Math.PI / 2.4;
      antenna.position.set(0, 0.03, -0.05);
      group.add(antenna);

      const light = new THREE.Mesh(
        new THREE.SphereGeometry(0.008, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0xff5a1f, transparent: true })
      );
      light.position.set(0, 0, 0.05);
      group.add(light);
      group.userData.light = light;

      return group;
    }

    const SATELLITE_COUNT = 5;
    const satelliteBounds = { x: 7.5, y: 5, zMin: -4, zMax: 3.5 };
    const satellites = Array.from({ length: SATELLITE_COUNT }, () => {
      const sat = createSatellite();
      sat.scale.setScalar(1.9 + Math.random() * 0.8);
      sat.position.set(
        (Math.random() - 0.5) * satelliteBounds.x * 2,
        (Math.random() - 0.5) * satelliteBounds.y * 2,
        satelliteBounds.zMin + Math.random() * (satelliteBounds.zMax - satelliteBounds.zMin)
      );
      sat.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      sat.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.02
      );
      sat.userData.spin = new THREE.Vector3(
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.5) * 0.15
      );
      sat.userData.blinkOffset = Math.random() * Math.PI * 2;
      scene.add(sat);
      return sat;
    });

    // ----------------------------------------------------------------
    // Interacción: mouse (parallax), scroll y hover (raycast) sobre el
    // planeta. El listener vive en window (no en el canvas) porque
    // .hero-content se superpone visualmente al mismo espacio con mayor
    // z-index; el raycast ignora esa jerarquía DOM y prueba contra la
    // esfera 3D real, así que el "hueco" de las letras outline también
    // dispara el efecto al pasar el cursor sobre el planeta que se ve
    // a través de ellas.
    // ----------------------------------------------------------------
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let scrollRatio = 0;

    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2(9999, 9999);
    const localHoverPoint = new THREE.Vector3();
    let hoverStrength = 0;
    let isHovering = false;

    const onPointerMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);

      const rect = container.getBoundingClientRect();
      pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const onPointerLeaveWindow = () => {
      pointerNDC.set(9999, 9999);
    };
    const onScroll = () => {
      scrollRatio = Math.min(window.scrollY / window.innerHeight, 1);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onPointerLeaveWindow, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // ----------------------------------------------------------------
    // Clic: pequeña explosión nuclear en el punto exacto de impacto
    // (flash + onda de choque en el shader) más una ráfaga de escombros
    // en 3D y un breve sacudido de cámara.
    // ----------------------------------------------------------------
    const explosionStartTimes = new Array(EXPLOSION_COUNT).fill(-9999);
    let nextExplosionSlot = 0;
    let cameraShake = 0;

    const debrisSystems = [];
    const DEBRIS_MAX_SYSTEMS = 5;
    const DEBRIS_COUNT = 28;

    function spawnDebris(worldPoint, normalWorld, planetCenter) {
      const positions = new Float32Array(DEBRIS_COUNT * 3);
      const velocities = new Float32Array(DEBRIS_COUNT * 3);
      const upHelper = Math.abs(normalWorld.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
      const tangent = new THREE.Vector3().crossVectors(upHelper, normalWorld).normalize();
      const bitangent = new THREE.Vector3().crossVectors(normalWorld, tangent);
      const dir = new THREE.Vector3();

      for (let i = 0; i < DEBRIS_COUNT; i++) {
        positions[i * 3] = worldPoint.x;
        positions[i * 3 + 1] = worldPoint.y;
        positions[i * 3 + 2] = worldPoint.z;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.45;
        dir
          .set(0, 0, 0)
          .addScaledVector(normalWorld, Math.cos(phi))
          .addScaledVector(tangent, Math.cos(theta) * Math.sin(phi))
          .addScaledVector(bitangent, Math.sin(theta) * Math.sin(phi))
          .normalize();
        const speed = 0.9 + Math.random() * 1.6;
        velocities[i * 3] = dir.x * speed;
        velocities[i * 3 + 1] = dir.y * speed;
        velocities[i * 3 + 2] = dir.z * speed;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: 0xffcf8f,
        size: 0.07,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const pts = new THREE.Points(geo, mat);
      scene.add(pts);

      if (debrisSystems.length >= DEBRIS_MAX_SYSTEMS) {
        const old = debrisSystems.shift();
        scene.remove(old.pts);
        old.geo.dispose();
        old.mat.dispose();
      }
      debrisSystems.push({
        pts,
        geo,
        mat,
        positions,
        velocities,
        planetCenter: planetCenter.clone(),
        spawnTime: sharedUniforms.uTime.value,
        life: 1.1,
      });
    }

    const tmpWorldPoint = new THREE.Vector3();
    const tmpNormal = new THREE.Vector3();
    const tmpLocalPoint = new THREE.Vector3();
    const tmpPlanetCenter = new THREE.Vector3();

    const onClick = (e) => {
      const rect = container.getBoundingClientRect();
      const clickNDC = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      planetGroup.updateMatrixWorld(true);
      raycaster.setFromCamera(clickNDC, camera);
      const hits = raycaster.intersectObject(planet, false);
      if (hits.length === 0) return;

      tmpWorldPoint.copy(hits[0].point);
      planet.getWorldPosition(tmpPlanetCenter);
      tmpNormal.copy(tmpWorldPoint).sub(tmpPlanetCenter).normalize();
      tmpLocalPoint.copy(tmpWorldPoint);
      planet.worldToLocal(tmpLocalPoint);

      explosionStartTimes[nextExplosionSlot] = sharedUniforms.uTime.value;
      sharedUniforms[`uExplosion${nextExplosionSlot}Point`].value.copy(tmpLocalPoint);
      nextExplosionSlot = (nextExplosionSlot + 1) % EXPLOSION_COUNT;

      spawnDebris(tmpWorldPoint, tmpNormal, tmpPlanetCenter);
      cameraShake = 0.09;
    };
    window.addEventListener('click', onClick);

    // ----------------------------------------------------------------
    // Layout responsivo: planeta a la derecha en desktop, centrado en móvil.
    // ----------------------------------------------------------------
    function layout() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      if (w > 860) {
        planetGroup.position.set(2.1, 0, 0);
        planetGroup.scale.setScalar(1);
      } else {
        planetGroup.position.set(0, 0.9, -1);
        planetGroup.scale.setScalar(0.72);
      }
    }
    layout();
    window.addEventListener('resize', layout, { passive: true });

    // ----------------------------------------------------------------
    // Loop con guardas de rendimiento.
    // ----------------------------------------------------------------
    const clock = new THREE.Clock();
    let isVisible = true;
    let rafId = null;

    let planetSpin = 0;
    let raycastFrame = 0;

    function renderFrame() {
      const delta = clock.getDelta();
      const t = (sharedUniforms.uTime.value += delta);

      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      // Raycast contra el planeta para detectar el hover del cursor.
      // A media frecuencia (30fps efectivos): imperceptible en un glow
      // que ya se suaviza con lerp, y ahorra un test contra ~33k tris
      // en la mitad de los frames.
      raycastFrame += 1;
      if (raycastFrame % 2 === 0) {
        planetGroup.updateMatrixWorld(true);
        raycaster.setFromCamera(pointerNDC, camera);
        const hits = raycaster.intersectObject(planet, false);
        isHovering = hits.length > 0;
        if (isHovering) {
          localHoverPoint.copy(hits[0].point);
          planet.worldToLocal(localHoverPoint);
          sharedUniforms.uHoverPoint.value.copy(localHoverPoint);
        }
      }
      hoverStrength += ((isHovering ? 1 : 0) - hoverStrength) * 0.08;
      sharedUniforms.uHoverStrength.value = hoverStrength;

      // Edades de las explosiones activas (alimenta flash + onda de choque).
      for (let i = 0; i < EXPLOSION_COUNT; i++) {
        sharedUniforms[`uExplosion${i}Age`].value = t - explosionStartTimes[i];
      }

      // Escombros: integra velocidad + gravedad leve hacia el centro del
      // planeta y desvanece la opacidad hasta desaparecer.
      for (let s = debrisSystems.length - 1; s >= 0; s--) {
        const ds = debrisSystems[s];
        const age = t - ds.spawnTime;
        if (age > ds.life) {
          scene.remove(ds.pts);
          ds.geo.dispose();
          ds.mat.dispose();
          debrisSystems.splice(s, 1);
          continue;
        }
        const { positions, velocities, planetCenter } = ds;
        for (let i = 0; i < positions.length; i += 3) {
          const gx = planetCenter.x - positions[i];
          const gy = planetCenter.y - positions[i + 1];
          const gz = planetCenter.z - positions[i + 2];
          const glen = Math.hypot(gx, gy, gz) || 1;
          velocities[i] += (gx / glen) * delta * 0.6;
          velocities[i + 1] += (gy / glen) * delta * 0.6;
          velocities[i + 2] += (gz / glen) * delta * 0.6;
          positions[i] += velocities[i] * delta;
          positions[i + 1] += velocities[i + 1] * delta;
          positions[i + 2] += velocities[i + 2] * delta;
        }
        ds.geo.attributes.position.needsUpdate = true;
        ds.mat.opacity = Math.max(0, 1 - age / ds.life);
      }

      // Rotación continua sobre su eje, como un planeta real (más rápida
      // mientras el cursor lo "escanea").
      planetSpin += delta * (0.16 + hoverStrength * 0.22);
      planet.rotation.y = planetSpin + mouse.x * 0.3;
      planetGroup.rotation.x = mouse.y * 0.2 + scrollRatio * 0.9;
      planetGroup.position.y +=
        ((window.innerWidth > 860 ? 0 : 0.9) + scrollRatio * 1.4 - planetGroup.position.y) * 0.05;

      const hoverScale = 1 + hoverStrength * 0.035;
      planet.scale.setScalar(hoverScale);
      atmosphere.scale.setScalar(hoverScale);

      particles.rotation.y = t * 0.015;
      brightStars.rotation.y = t * 0.015;

      // Satélites: deriva lenta + tumbo + luz que parpadea.
      satellites.forEach((sat) => {
        sat.position.addScaledVector(sat.userData.velocity, delta);
        sat.rotation.x += sat.userData.spin.x * delta;
        sat.rotation.y += sat.userData.spin.y * delta;
        sat.rotation.z += sat.userData.spin.z * delta;

        if (sat.position.x > satelliteBounds.x) sat.position.x = -satelliteBounds.x;
        if (sat.position.x < -satelliteBounds.x) sat.position.x = satelliteBounds.x;
        if (sat.position.y > satelliteBounds.y) sat.position.y = -satelliteBounds.y;
        if (sat.position.y < -satelliteBounds.y) sat.position.y = satelliteBounds.y;
        if (sat.position.z > satelliteBounds.zMax) sat.position.z = satelliteBounds.zMin;
        if (sat.position.z < satelliteBounds.zMin) sat.position.z = satelliteBounds.zMax;

        const blink = Math.sin(t * 3 + sat.userData.blinkOffset) * 0.5 + 0.5;
        sat.userData.light.material.opacity = 0.3 + blink * 0.7;
      });

      camera.position.x += (mouse.x * 0.35 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 0.25 - camera.position.y) * 0.03;

      // Sacudido de cámara al impactar, aplicado como offset tras el parallax.
      if (cameraShake > 0.0005) {
        camera.position.x += (Math.random() - 0.5) * cameraShake;
        camera.position.y += (Math.random() - 0.5) * cameraShake;
        cameraShake *= Math.exp(-delta * 6);
      } else {
        cameraShake = 0;
      }

      camera.lookAt(scene.position);
      sharedUniforms.uCameraPos.value.copy(camera.position);

      renderer.render(scene, camera);
    }

    function loop() {
      renderFrame();
      rafId = requestAnimationFrame(loop);
    }
    function start() {
      if (rafId === null && isVisible && !document.hidden) {
        clock.start();
        rafId = requestAnimationFrame(loop);
      }
    }
    function stop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    const onVisibility = () => (document.hidden ? stop() : start());
    let observer = null;

    if (reducedMotion) {
      // Un frame estático: la escena se ve, pero no consume CPU/GPU.
      renderFrame();
    } else {
      document.addEventListener('visibilitychange', onVisibility);
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) start();
          else stop();
        },
        { threshold: 0 }
      );
      observer.observe(container);
      start();
    }

    // ----------------------------------------------------------------
    // Cleanup completo (clave en React: evita fugas y contextos WebGL
    // acumulados entre montajes).
    // ----------------------------------------------------------------
    return () => {
      stop();
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('mouseleave', onPointerLeaveWindow);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', layout);
      window.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVisibility);
      if (observer) observer.disconnect();

      debrisSystems.forEach((ds) => {
        scene.remove(ds.pts);
        ds.geo.dispose();
        ds.mat.dispose();
      });

      satellites.forEach((sat) => {
        scene.remove(sat);
        sat.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) obj.material.dispose();
        });
      });

      planetGeo.dispose();
      planetMaterial.dispose();
      atmosphereGeo.dispose();
      atmosphereMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      brightGeo.dispose();
      brightMat.dispose();
      starGlowTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  return <div className="hero-canvas" id="hero-canvas" ref={containerRef} aria-hidden="true" />;
}

export default MercuryBlob;
