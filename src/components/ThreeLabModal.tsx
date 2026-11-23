import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {
  Atom,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Compass,
  Dna,
  Layers,
  Magnet,
  RotateCcw,
  RotateCw,
  Sigma,
  Trophy,
  X,
} from 'lucide-react';
import {SubjectId} from '../data/pcmbData';
import {playCheckSound, playOmrBubbleSound} from '../utils/soundEffects';

export type ThreeSceneId = SubjectId | 'trophy';

interface SceneMeta {
  id: ThreeSceneId;
  shortLabel: string;
  label: string;
  modelName: string;
  subtitle: string;
  formula: string;
}

const SCENE_CATALOG: SceneMeta[] = [
  {
    id: 'physics',
    shortLabel: 'Phy',
    label: 'Physics 042',
    modelName: 'Galvanometer',
    subtitle: 'Moving-Coil Galvanometer · Radial Magnetic Field',
    formula: 'τ = N·I·A·B = k·θ',
  },
  {
    id: 'chemistry',
    shortLabel: 'Chm',
    label: 'Chemistry 043',
    modelName: '[ML₆] Complex',
    subtitle: 'Octahedral Coordination Complex [ML₆]',
    formula: 'Δ₀ = (3/5 + 2/5) · 10 Dq',
  },
  {
    id: 'biology',
    shortLabel: 'Bio',
    label: 'Biology 044',
    modelName: 'DNA Helix',
    subtitle: 'Double-Helix DNA Macromolecule (B-Form)',
    formula: 'A = T (2 H-bonds) · G ≡ C (3 H-bonds)',
  },
  {
    id: 'maths',
    shortLabel: 'Mth',
    label: 'Maths 041',
    modelName: 'a × b & Cone',
    subtitle: 'Vector Cross Product (a × b) & Conic Bench',
    formula: '|a × b| = |a||b| sin θ · n̂',
  },
  {
    id: 'trophy',
    shortLabel: 'Win',
    label: 'Grandmaster',
    modelName: 'Mastery Trophy',
    subtitle: 'Quadra 12 Board Mastery Medallion',
    formula: '50 / 50 NCERT Chapters · 4 / 4 SQPs',
  },
];

type CameraPreset = 'hero' | 'top' | 'side';

const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createRadialShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.08,
    size / 2,
    size / 2,
    size * 0.48,
  );
  grad.addColorStop(0, 'rgba(18, 14, 10, 0.52)');
  grad.addColorStop(0.55, 'rgba(18, 14, 10, 0.2)');
  grad.addColorStop(1, 'rgba(18, 14, 10, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createBrushedRoughnessTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y++) {
    const wave = Math.sin(y * 0.35) * 14 + Math.cos(y * 0.9) * 8;
    const v = Math.max(90, Math.min(165, Math.floor(126 + wave)));
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(0, y, size, 1);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function createGalvanometerDialTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const w = 1024;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#F7F2E8';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#3B332B';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.92, 360, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();

  ctx.font = 'bold 38px monospace';
  ctx.fillStyle = '#1E1B18';
  ctx.textAlign = 'center';
  for (let i = -3; i <= 3; i++) {
    const angle = Math.PI * 1.5 + i * 0.28;
    const x1 = w / 2 + Math.cos(angle) * 330;
    const y1 = h * 0.92 + Math.sin(angle) * 330;
    const x2 = w / 2 + Math.cos(angle) * 380;
    const y2 = h * 0.92 + Math.sin(angle) * 380;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = i === 0 ? '#A64B33' : '#1E1B18';
    ctx.lineWidth = i === 0 ? 8 : 5;
    ctx.stroke();

    const lx = w / 2 + Math.cos(angle) * 276;
    const ly = h * 0.92 + Math.sin(angle) * 276;
    ctx.fillStyle = i === 0 ? '#A64B33' : '#1E1B18';
    ctx.fillText(String(i * 10), lx, ly);
  }
  ctx.font = 'bold 42px sans-serif';
  ctx.fillStyle = '#575048';
  ctx.fillText('μA · GALVANOMETER', w / 2, h * 0.78);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function createCartesianGridTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#EDE6D8';
  ctx.fillRect(0, 0, size, size);

  const step = size / 10;
  for (let i = 0; i <= 10; i++) {
    const pos = i * step;
    ctx.strokeStyle = i === 5 ? '#A64B33' : 'rgba(55,48,40,0.22)';
    ctx.lineWidth = i === 5 ? 5 : 2;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(size, pos);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

interface ExplodablePart {
  object: THREE.Object3D;
  restPos: THREE.Vector3;
  explodeOffset: THREE.Vector3;
}

interface BuiltSceneResult {
  group: THREE.Group;
  explodables: ExplodablePart[];
  animateFn?: (elapsed: number) => void;
}

function buildPhysicsGalvanometer(
  roughMap: THREE.CanvasTexture,
  maxAnisotropy: number,
): BuiltSceneResult {
  const group = new THREE.Group();
  const explodables: ExplodablePart[] = [];

  const registerExplodable = (
    obj: THREE.Object3D,
    dx: number,
    dy: number,
    dz: number,
  ) => {
    explodables.push({
      object: obj,
      restPos: obj.position.clone(),
      explodeOffset: new THREE.Vector3(dx, dy, dz),
    });
  };

  const walnutMat = new THREE.MeshStandardMaterial({
    color: 0x3b281e,
    roughness: 0.72,
    metalness: 0.06,
    roughnessMap: roughMap,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4a456,
    roughness: 0.18,
    metalness: 0.92,
    roughnessMap: roughMap,
  });
  const northPoleMat = new THREE.MeshStandardMaterial({
    color: 0xa64b33,
    roughness: 0.36,
    metalness: 0.32,
  });
  const southPoleMat = new THREE.MeshStandardMaterial({
    color: 0x31506e,
    roughness: 0.36,
    metalness: 0.32,
  });
  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xc86d44,
    roughness: 0.22,
    metalness: 0.88,
  });
  const softIronMat = new THREE.MeshStandardMaterial({
    color: 0x52565c,
    roughness: 0.3,
    metalness: 0.85,
  });

  // 1. Plinth base (72 segments for glass-smooth rim)
  const base = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.2, 0.28, 72), walnutMat);
  base.position.y = 0.14;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  // 2. Machined brass collar ring
  const collar = new THREE.Mesh(new THREE.TorusGeometry(1.92, 0.055, 24, 96), brassMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.29;
  group.add(collar);
  registerExplodable(collar, 0, 0.18, 0);

  // 3. Curved magnet poles (high curveSegments & bevelSegments so arcs are completely smooth)
  const createPoleShape = () => {
    const s = new THREE.Shape();
    s.absarc(0, 0, 1.55, -0.58, 0.58, false);
    s.absarc(0, 0, 1.05, 0.58, -0.58, true);
    s.closePath();
    return s;
  };
  const poleGeo = new THREE.ExtrudeGeometry(createPoleShape(), {
    depth: 1.25,
    curveSegments: 64,
    steps: 2,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 6,
  });
  poleGeo.rotateX(-Math.PI / 2);

  const northPole = new THREE.Mesh(poleGeo, northPoleMat);
  northPole.position.set(0, 0.34, 0);
  northPole.castShadow = true;
  group.add(northPole);
  registerExplodable(northPole, 0.85, 0.2, 0);

  const southPole = new THREE.Mesh(poleGeo, southPoleMat);
  southPole.rotation.y = Math.PI;
  southPole.position.set(0, 0.34, 0);
  southPole.castShadow = true;
  group.add(southPole);
  registerExplodable(southPole, -0.85, 0.2, 0);

  // 4. Soft iron cylindrical core
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.15, 64), softIronMat);
  core.position.y = 0.96;
  core.castShadow = true;
  group.add(core);
  registerExplodable(core, 0, 0.35, 0);

  // 5. Rotating helical coil assembly + pointer
  const coilGroup = new THREE.Group();
  coilGroup.position.y = 0.96;
  const frameGeo = new THREE.TorusGeometry(0.62, 0.035, 24, 80);
  const coilRing = new THREE.Mesh(frameGeo, copperMat);
  coilRing.scale.set(0.95, 1.12, 1);
  coilGroup.add(coilRing);

  const coilRing2 = new THREE.Mesh(frameGeo, copperMat);
  coilRing2.rotation.y = 0.14;
  coilRing2.scale.set(0.88, 1.06, 1);
  coilGroup.add(coilRing2);

  const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.85, 28), brassMat);
  spindle.position.y = 0.22;
  coilGroup.add(spindle);

  const pointer = new THREE.Mesh(new THREE.ConeGeometry(0.035, 1.05, 24), northPoleMat);
  pointer.rotation.x = Math.PI / 2;
  pointer.position.set(0, 0.92, 0.45);
  coilGroup.add(pointer);

  group.add(coilGroup);
  registerExplodable(coilGroup, 0, 0.95, 0);

  // 6. Calibrated dial plate
  const dialTex = createGalvanometerDialTexture(maxAnisotropy);
  const dialMat = new THREE.MeshStandardMaterial({
    map: dialTex,
    roughness: 0.6,
    metalness: 0.05,
  });
  const dialPlate = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 1.05), dialMat);
  dialPlate.position.set(0, 1.82, 0.55);
  dialPlate.rotation.x = -0.22;
  dialPlate.castShadow = true;
  group.add(dialPlate);
  registerExplodable(dialPlate, 0, 1.45, 0.35);

  // 7. Terminal binding posts
  [-0.95, 0.95].forEach((xOffset) => {
    const post = new THREE.Group();
    const baseCap = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.16, 36), brassMat);
    const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 6), brassMat);
    nut.position.y = 0.14;
    post.add(baseCap, nut);
    post.position.set(xOffset, 0.36, 1.48);
    group.add(post);
    registerExplodable(post, xOffset * 0.2, 0.35, 0.35);
  });

  return {
    group,
    explodables,
    animateFn: (elapsed: number) => {
      coilGroup.rotation.y = Math.sin(elapsed * 1.4) * 0.42;
    },
  };
}

function buildChemistryComplex(roughMap: THREE.CanvasTexture): BuiltSceneResult {
  const group = new THREE.Group();
  const explodables: ExplodablePart[] = [];
  const registerExplodable = (obj: THREE.Object3D, dx: number, dy: number, dz: number) => {
    explodables.push({
      object: obj,
      restPos: obj.position.clone(),
      explodeOffset: new THREE.Vector3(dx, dy, dz),
    });
  };

  const plinthMat = new THREE.MeshStandardMaterial({
    color: 0x24201c,
    roughness: 0.7,
    metalness: 0.25,
    roughnessMap: roughMap,
  });
  const metalCoreMat = new THREE.MeshStandardMaterial({
    color: 0xe6b17a,
    roughness: 0.14,
    metalness: 0.94,
  });
  const eqLigandMat = new THREE.MeshStandardMaterial({
    color: 0x3d6b4f,
    roughness: 0.36,
    metalness: 0.18,
  });
  const axLigandMat = new THREE.MeshStandardMaterial({
    color: 0xa64b33,
    roughness: 0.34,
    metalness: 0.2,
  });
  const rodMat = new THREE.MeshStandardMaterial({
    color: 0xc9c1b2,
    roughness: 0.22,
    metalness: 0.85,
  });
  const orbitalMat = new THREE.MeshPhysicalMaterial({
    color: 0x7ab88f,
    roughness: 0.18,
    metalness: 0.1,
    transparent: true,
    opacity: 0.45,
    clearcoat: 1.0,
  });

  // Base pedestal
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 0.22, 72), plinthMat);
  base.position.y = 0.11;
  base.receiveShadow = true;
  base.castShadow = true;
  group.add(base);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 1.45, 48), rodMat);
  stem.position.y = 0.94;
  group.add(stem);

  // Molecule Assembly centered at y=1.85
  const moleculeCenter = new THREE.Group();
  moleculeCenter.position.y = 1.85;
  group.add(moleculeCenter);

  // Smooth indexed SphereGeometry instead of flat-faceted IcosahedronGeometry
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.42, 64, 48), metalCoreMat);
  core.castShadow = true;
  moleculeCenter.add(core);

  const ligandDirs: [number, number, number, boolean][] = [
    [1.32, 0, 0, false],
    [-1.32, 0, 0, false],
    [0, 1.32, 0, true],
    [0, -1.32, 0, true],
    [0, 0, 1.32, false],
    [0, 0, -1.32, false],
  ];

  const bondGeo = new THREE.CylinderGeometry(0.055, 0.055, 1.25, 32);
  const ligandGeo = new THREE.SphereGeometry(0.27, 48, 36);
  const collarGeo = new THREE.TorusGeometry(0.28, 0.032, 24, 64);

  ligandDirs.forEach(([x, y, z, isAxial]) => {
    const unit = new THREE.Group();
    const dir = new THREE.Vector3(x, y, z);
    const len = dir.length();
    const dirNorm = dir.clone().normalize();

    const bond = new THREE.Mesh(bondGeo, rodMat);
    bond.position.copy(dirNorm).multiplyScalar(len * 0.5);
    bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirNorm);
    unit.add(bond);

    const ligand = new THREE.Mesh(ligandGeo, isAxial ? axLigandMat : eqLigandMat);
    ligand.position.copy(dir);
    ligand.castShadow = true;
    unit.add(ligand);

    const ring = new THREE.Mesh(collarGeo, metalCoreMat);
    ring.position.copy(dir);
    ring.lookAt(0, 0, 0);
    unit.add(ring);

    moleculeCenter.add(unit);
    registerExplodable(unit, x * 0.45, y * 0.45, z * 0.45);
  });

  // Crystal field orbital rings
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.028, 24, 120), orbitalMat);
  ring1.rotation.x = Math.PI / 2;
  moleculeCenter.add(ring1);
  registerExplodable(ring1, 0, 0.5, 0);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.028, 24, 120), orbitalMat);
  ring2.rotation.y = Math.PI / 4;
  moleculeCenter.add(ring2);
  registerExplodable(ring2, 0, -0.5, 0);

  return {
    group,
    explodables,
    animateFn: (elapsed: number) => {
      moleculeCenter.rotation.y = elapsed * 0.42;
    },
  };
}

function buildBiologyHelix(roughMap: THREE.CanvasTexture): BuiltSceneResult {
  const group = new THREE.Group();
  const explodables: ExplodablePart[] = [];
  const registerExplodable = (obj: THREE.Object3D, dx: number, dy: number, dz: number) => {
    explodables.push({
      object: obj,
      restPos: obj.position.clone(),
      explodeOffset: new THREE.Vector3(dx, dy, dz),
    });
  };

  const standMat = new THREE.MeshStandardMaterial({
    color: 0x22201d,
    roughness: 0.72,
    metalness: 0.25,
    roughnessMap: roughMap,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4a456,
    roughness: 0.2,
    metalness: 0.9,
  });
  const strandAMat = new THREE.MeshStandardMaterial({
    color: 0xa64b33,
    roughness: 0.28,
    metalness: 0.24,
  });
  const strandBMat = new THREE.MeshStandardMaterial({
    color: 0x3d6b4f,
    roughness: 0.28,
    metalness: 0.24,
  });
  const atBaseMat = new THREE.MeshStandardMaterial({
    color: 0xe6b17a,
    roughness: 0.45,
    metalness: 0.12,
  });
  const gcBaseMat = new THREE.MeshStandardMaterial({
    color: 0x486581,
    roughness: 0.45,
    metalness: 0.12,
  });

  // Base pedestal
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.38, 0.22, 72), standMat);
  plinth.position.y = 0.11;
  plinth.receiveShadow = true;
  group.add(plinth);

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 0.25, 48), brassMat);
  collar.position.y = 0.34;
  group.add(collar);

  const helixRoot = new THREE.Group();
  helixRoot.position.y = 0.5;
  group.add(helixRoot);

  const turns = 1.65;
  const height = 2.9;
  const radius = 0.78;
  const pointsCount = 120;
  const ptsA: THREE.Vector3[] = [];
  const ptsB: THREE.Vector3[] = [];

  for (let i = 0; i <= pointsCount; i++) {
    const t = i / pointsCount;
    const angle = t * Math.PI * 2 * turns;
    const y = t * height;
    ptsA.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    ptsB.push(
      new THREE.Vector3(
        Math.cos(angle + Math.PI) * radius,
        y,
        Math.sin(angle + Math.PI) * radius,
      ),
    );
  }

  const strandGroupA = new THREE.Group();
  const strandA = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsA), 180, 0.075, 24, false),
    strandAMat,
  );
  strandA.castShadow = true;
  const capGeo = new THREE.SphereGeometry(0.075, 24, 18);
  const capA0 = new THREE.Mesh(capGeo, strandAMat);
  capA0.position.copy(ptsA[0]);
  const capA1 = new THREE.Mesh(capGeo, strandAMat);
  capA1.position.copy(ptsA[ptsA.length - 1]);
  strandGroupA.add(strandA, capA0, capA1);
  helixRoot.add(strandGroupA);
  registerExplodable(strandGroupA, 0.55, 0, 0);

  const strandGroupB = new THREE.Group();
  const strandB = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsB), 180, 0.075, 24, false),
    strandBMat,
  );
  strandB.castShadow = true;
  const capB0 = new THREE.Mesh(capGeo, strandBMat);
  capB0.position.copy(ptsB[0]);
  const capB1 = new THREE.Mesh(capGeo, strandBMat);
  capB1.position.copy(ptsB[ptsB.length - 1]);
  strandGroupB.add(strandB, capB0, capB1);
  helixRoot.add(strandGroupB);
  registerExplodable(strandGroupB, -0.55, 0, 0);

  const rungsCount = 11;
  const halfGeo = new THREE.CylinderGeometry(0.045, 0.045, radius * 0.92, 24);
  const bondKnobGeo = new THREE.SphereGeometry(0.068, 32, 24);

  for (let i = 1; i < rungsCount; i++) {
    const t = i / rungsCount;
    const angle = t * Math.PI * 2 * turns;
    const y = t * height;
    const rungGroup = new THREE.Group();
    rungGroup.position.set(0, y, 0);
    rungGroup.rotation.y = -angle;

    const isGC = i % 2 === 0;
    const leftHalf = new THREE.Mesh(halfGeo, isGC ? gcBaseMat : atBaseMat);
    leftHalf.rotation.z = Math.PI / 2;
    leftHalf.position.x = radius * 0.46;

    const rightHalf = new THREE.Mesh(halfGeo, isGC ? strandBMat : strandAMat);
    rightHalf.rotation.z = Math.PI / 2;
    rightHalf.position.x = -radius * 0.46;

    const hBond = new THREE.Mesh(bondKnobGeo, brassMat);

    rungGroup.add(leftHalf, rightHalf, hBond);
    helixRoot.add(rungGroup);
    registerExplodable(rungGroup, 0, (t - 0.5) * 0.9, 0);
  }

  return {
    group,
    explodables,
    animateFn: (elapsed: number) => {
      helixRoot.rotation.y = elapsed * 0.45;
    },
  };
}

function buildMathsVectorBench(
  roughMap: THREE.CanvasTexture,
  maxAnisotropy: number,
  isSoftwareGl: boolean,
): BuiltSceneResult {
  const group = new THREE.Group();
  const explodables: ExplodablePart[] = [];
  const registerExplodable = (obj: THREE.Object3D, dx: number, dy: number, dz: number) => {
    explodables.push({
      object: obj,
      restPos: obj.position.clone(),
      explodeOffset: new THREE.Vector3(dx, dy, dz),
    });
  };

  // 1. Precision Coordinate Grid Plinth
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 0.16, 3.5),
    new THREE.MeshStandardMaterial({
      color: 0x2c2722,
      roughness: 0.72,
      metalness: 0.15,
      roughnessMap: roughMap,
    }),
  );
  plinth.position.y = 0.08;
  plinth.receiveShadow = true;
  group.add(plinth);

  const gridPlate = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 3.2),
    new THREE.MeshStandardMaterial({
      map: createCartesianGridTexture(maxAnisotropy),
      roughness: 0.65,
      metalness: 0.05,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    }),
  );
  gridPlate.rotation.x = -Math.PI / 2;
  gridPlate.position.y = 0.165;
  gridPlate.receiveShadow = true;
  group.add(gridPlate);

  // Origin Pivot
  const originGroup = new THREE.Group();
  originGroup.position.set(0, 0.2, 0);
  group.add(originGroup);

  const axisMat = new THREE.MeshStandardMaterial({
    color: 0x575048,
    roughness: 0.35,
    metalness: 0.65,
  });

  const makeArrow = (
    vec: THREE.Vector3,
    mat: THREE.Material,
    radius = 0.045,
  ) => {
    const arrowGroup = new THREE.Group();
    const len = vec.length();
    const shaftLen = Math.max(0.2, len - 0.24);
    const dir = vec.clone().normalize();

    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, shaftLen, 32),
      mat,
    );
    shaft.position.copy(dir).multiplyScalar(shaftLen * 0.5);
    shaft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    shaft.castShadow = true;

    const head = new THREE.Mesh(new THREE.ConeGeometry(radius * 2.5, 0.26, 36), mat);
    head.position.copy(dir).multiplyScalar(shaftLen + 0.12);
    head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    head.castShadow = true;

    arrowGroup.add(shaft, head);
    return arrowGroup;
  };

  const vecA = new THREE.Vector3(1.45, 0.35, 0.55);
  const vecB = new THREE.Vector3(-0.35, 0.45, 1.35);
  const vecCross = new THREE.Vector3().crossVectors(vecA, vecB).normalize().multiplyScalar(2.15);

  const arrowA = makeArrow(
    vecA,
    new THREE.MeshStandardMaterial({color: 0xa64b33, roughness: 0.28, metalness: 0.35}),
    0.055,
  );
  originGroup.add(arrowA);
  registerExplodable(arrowA, 0.45, 0, 0.2);

  const arrowB = makeArrow(
    vecB,
    new THREE.MeshStandardMaterial({color: 0xd4a456, roughness: 0.2, metalness: 0.8}),
    0.055,
  );
  originGroup.add(arrowB);
  registerExplodable(arrowB, -0.2, 0, 0.45);

  const arrowCross = makeArrow(
    vecCross,
    new THREE.MeshStandardMaterial({color: 0x3d6b4f, roughness: 0.26, metalness: 0.45}),
    0.065,
  );
  originGroup.add(arrowCross);
  registerExplodable(arrowCross, 0, 0.8, 0);

  // Translucent parallelogram span
  const spanGeo = new THREE.BufferGeometry();
  const p0 = new THREE.Vector3(0, 0, 0);
  const p1 = vecA;
  const p2 = new THREE.Vector3().addVectors(vecA, vecB);
  const p3 = vecB;
  const vertices = new Float32Array([
    p0.x, p0.y, p0.z,
    p1.x, p1.y, p1.z,
    p2.x, p2.y, p2.z,
    p0.x, p0.y, p0.z,
    p2.x, p2.y, p2.z,
    p3.x, p3.y, p3.z,
  ]);
  spanGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  spanGeo.computeVertexNormals();

  const spanMesh = new THREE.Mesh(
    spanGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xe6b17a,
      roughness: 0.22,
      metalness: 0.05,
      transparent: true,
      opacity: isSoftwareGl ? 0.38 : 0.45,
      side: THREE.DoubleSide,
    }),
  );
  originGroup.add(spanMesh);
  registerExplodable(spanMesh, 0, 0.35, 0);

  // Axis frame markers
  const axisX = makeArrow(new THREE.Vector3(1.5, 0, 0), axisMat, 0.022);
  const axisZ = makeArrow(new THREE.Vector3(0, 0, 1.5), axisMat, 0.022);
  originGroup.add(axisX, axisZ);

  // Smooth Double-nappe Lathe cone accent (72 radial segments)
  const lathePts = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(0.45, 0),
    new THREE.Vector2(0.02, 0.55),
    new THREE.Vector2(0.45, 1.1),
    new THREE.Vector2(0.01, 1.1),
  ];
  const doubleCone = new THREE.Mesh(
    new THREE.LatheGeometry(lathePts, 72),
    new THREE.MeshPhysicalMaterial({
      color: 0x486581,
      roughness: 0.12,
      metalness: 0.1,
      transparent: true,
      opacity: isSoftwareGl ? 0.48 : 0.68,
      clearcoat: 1.0,
    }),
  );
  doubleCone.position.set(-1.1, 0.2, -1.05);
  group.add(doubleCone);
  registerExplodable(doubleCone, -0.45, 0.5, -0.45);

  return {
    group,
    explodables,
  };
}

function buildGrandmasterTrophy(roughMap: THREE.CanvasTexture): BuiltSceneResult {
  const group = new THREE.Group();
  const explodables: ExplodablePart[] = [];
  const registerExplodable = (obj: THREE.Object3D, dx: number, dy: number, dz: number) => {
    explodables.push({
      object: obj,
      restPos: obj.position.clone(),
      explodeOffset: new THREE.Vector3(dx, dy, dz),
    });
  };

  const obsidianMat = new THREE.MeshStandardMaterial({
    color: 0x1e1b18,
    roughness: 0.55,
    metalness: 0.2,
    roughnessMap: roughMap,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xe6b17a,
    roughness: 0.16,
    metalness: 0.94,
    roughnessMap: roughMap,
  });
  const enamelMat = new THREE.MeshStandardMaterial({
    color: 0xa64b33,
    roughness: 0.28,
    metalness: 0.15,
  });
  const emeraldCoreMat = new THREE.MeshPhysicalMaterial({
    color: 0x3d6b4f,
    roughness: 0.1,
    metalness: 0.2,
    clearcoat: 1.0,
  });

  // 1. Stepped plinth
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.35, 0.28, 72), obsidianMat);
  base.position.y = 0.14;
  base.receiveShadow = true;
  base.castShadow = true;
  group.add(base);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.05, 24, 96), goldMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.29;
  group.add(rim);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 0.6, 48), goldMat);
  neck.position.y = 0.58;
  group.add(neck);
  registerExplodable(neck, 0, 0.25, 0);

  // 2. Octagonal crest medallion assembly
  const crest = new THREE.Group();
  crest.position.y = 1.75;
  group.add(crest);

  const octShape = new THREE.Shape();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const x = Math.cos(a) * 0.95;
    const y = Math.sin(a) * 0.95;
    if (i === 0) octShape.moveTo(x, y);
    else octShape.lineTo(x, y);
  }
  octShape.closePath();

  const frameGeo = new THREE.ExtrudeGeometry(octShape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 6,
  });
  frameGeo.center();
  const frameMesh = new THREE.Mesh(frameGeo, goldMat);
  frameMesh.castShadow = true;
  crest.add(frameMesh);

  const innerDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.24, 64), enamelMat);
  innerDisc.rotation.x = Math.PI / 2;
  crest.add(innerDisc);
  registerExplodable(innerDisc, 0, 0, 0.45);

  const laurelRing = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.045, 24, 96), goldMat);
  laurelRing.position.z = 0.13;
  crest.add(laurelRing);
  registerExplodable(laurelRing, 0, 0, 0.7);

  const jewelCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 0), emeraldCoreMat);
  jewelCore.position.z = 0.16;
  crest.add(jewelCore);
  registerExplodable(jewelCore, 0, 0, 0.95);

  return {
    group,
    explodables,
    animateFn: (elapsed: number) => {
      crest.rotation.y = Math.sin(elapsed * 0.8) * 0.55;
      jewelCore.rotation.z = elapsed * 0.9;
    },
  };
}

interface ThreeLabModalProps {
  isOpen: boolean;
  initialScene: ThreeSceneId;
  onClose: () => void;
}

export function ThreeLabModal({
  isOpen,
  initialScene,
  onClose,
}: ThreeLabModalProps) {
  const [activeScene, setActiveScene] = useState<ThreeSceneId>(initialScene);
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [sideRailCollapsed, setSideRailCollapsed] = useState(false);

  const mountRef = useRef<HTMLDivElement>(null);
  const activeSceneRef = useRef<ThreeSceneId>(initialScene);
  const explodeTargetRef = useRef(0);
  const autoRotateRef = useRef(true);
  const cameraPresetRequestRef = useRef<CameraPreset | null>(null);

  useEffect(() => {
    setActiveScene(initialScene);
    activeSceneRef.current = initialScene;
  }, [initialScene]);

  useEffect(() => {
    explodeTargetRef.current = explodeFactor;
  }, [explodeFactor]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Lock background page scroll while 3D Studio is open so full viewport is crisp
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const container = mountRef.current;
    const isSoftwareGl = detectSoftwareWebGL();
    const isDark = document.documentElement.classList.contains('dark');
    const bgHex = isDark ? 0x161412 : 0xf5f2eb;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.038);

    const width = Math.max(container.clientWidth, window.innerWidth);
    const height = Math.max(container.clientHeight, window.innerHeight);
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(4.1, 2.85, 4.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(
      isSoftwareGl
        ? Math.min(window.devicePixelRatio || 1, 1.25)
        : Math.min(window.devicePixelRatio || 1, 2),
    );
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Lighting rig: Warm directional key + Cool Hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0xdce8f5, 0x8e7f6b, 0.74);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.1);
    keyLight.position.set(4.5, 7.5, 4.2);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 22;
    const d = 4.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4785e, 0.72);
    rimLight.position.set(-4.5, 3.0, -4.0);
    scene.add(rimLight);

    // Always enable silky-smooth OrbitControls damping across all devices
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.rotateSpeed = 0.85;
    controls.zoomSpeed = 0.9;
    controls.minDistance = 2.4;
    controls.maxDistance = 12;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.target.set(0, 1.15, 0);

    controls.addEventListener('start', () => {
      cameraPresetRequestRef.current = null;
    });

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const roughMap = createBrushedRoughnessTexture(maxAnisotropy);
    const contactShadowTex = createRadialShadowTexture();

    const contactShadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5.6, 5.6),
      new THREE.MeshBasicMaterial({
        map: contactShadowTex,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      }),
    );
    contactShadowPlane.rotation.x = -Math.PI / 2;
    contactShadowPlane.position.y = 0.004;
    scene.add(contactShadowPlane);

    const floorPlane = new THREE.Mesh(
      new THREE.CircleGeometry(18, 72),
      new THREE.MeshStandardMaterial({
        color: bgHex,
        roughness: 0.92,
        metalness: 0.02,
      }),
    );
    floorPlane.rotation.x = -Math.PI / 2;
    floorPlane.receiveShadow = true;
    scene.add(floorPlane);

    let currentBuilt: BuiltSceneResult | null = null;
    let mountedSceneId: ThreeSceneId | null = null;
    let currentExplodeVal = 0;

    const loadSceneModel = (sceneId: ThreeSceneId) => {
      if (currentBuilt) {
        scene.remove(currentBuilt.group);
        currentBuilt.group.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.geometry.dispose();
            const mats = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material];
            mats.forEach((m) => {
              if ('map' in m && m.map && m.map !== roughMap) {
                (m.map as THREE.Texture).dispose();
              }
              m.dispose();
            });
          }
        });
      }

      if (sceneId === 'physics') {
        currentBuilt = buildPhysicsGalvanometer(roughMap, maxAnisotropy);
      } else if (sceneId === 'chemistry') {
        currentBuilt = buildChemistryComplex(roughMap);
      } else if (sceneId === 'biology') {
        currentBuilt = buildBiologyHelix(roughMap);
      } else if (sceneId === 'maths') {
        currentBuilt = buildMathsVectorBench(roughMap, maxAnisotropy, isSoftwareGl);
      } else {
        currentBuilt = buildGrandmasterTrophy(roughMap);
      }

      scene.add(currentBuilt.group);
      mountedSceneId = sceneId;
    };

    loadSceneModel(activeSceneRef.current);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const syncViewportSize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    syncViewportSize();
    window.addEventListener('resize', syncViewportSize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        syncViewportSize();
      });
      resizeObserver.observe(container);
    }

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function tick() {
      if (disposed) return;
      const frameStart = performance.now();
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      if (mountedSceneId !== activeSceneRef.current) {
        loadSceneModel(activeSceneRef.current);
      }

      // Exponentially damped explode animation
      currentExplodeVal = THREE.MathUtils.damp(
        currentExplodeVal,
        explodeTargetRef.current,
        8,
        delta,
      );
      if (currentBuilt) {
        currentBuilt.explodables.forEach((item) => {
          item.object.position
            .copy(item.restPos)
            .addScaledVector(item.explodeOffset, currentExplodeVal);
        });
        currentBuilt.animateFn?.(elapsed);
      }

      // Camera preset damping (pause autoRotate while gliding to target so they never fight)
      const preset = cameraPresetRequestRef.current;
      if (preset) {
        if (preset === 'hero') {
          _targetCamPos.set(4.1, 2.85, 4.6);
          _targetLookAt.set(0, 1.15, 0);
        } else if (preset === 'top') {
          _targetCamPos.set(0.01, 6.2, 0.2);
          _targetLookAt.set(0, 1.1, 0);
        } else {
          _targetCamPos.set(5.4, 1.45, 0.01);
          _targetLookAt.set(0, 1.15, 0);
        }
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCamPos.x, 7, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCamPos.y, 7, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCamPos.z, 7, delta);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetLookAt.x, 7, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetLookAt.y, 7, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetLookAt.z, 7, delta);

        if (
          camera.position.distanceTo(_targetCamPos) < 0.03 &&
          controls.target.distanceTo(_targetLookAt) < 0.02
        ) {
          camera.position.copy(_targetCamPos);
          controls.target.copy(_targetLookAt);
          cameraPresetRequestRef.current = null;
        }
      }

      controls.autoRotate = autoRotateRef.current && cameraPresetRequestRef.current === null;
      controls.autoRotateSpeed = 1.25;
      controls.update();

      renderer.render(scene, camera);

      const renderMs = performance.now() - frameStart;
      // Only pace gently if software rendering actually takes unusually long (>35ms)
      if (isSoftwareGl && renderMs > 35) {
        frameId = window.setTimeout(() => {
          if (!disposed) frameId = requestAnimationFrame(tick);
        }, 16);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', syncViewportSize);
      resizeObserver?.disconnect();
      controls.dispose();
      roughMap.dispose();
      contactShadowTex.dispose();
      envTarget.dispose();
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            const stdMat = m as THREE.MeshStandardMaterial;
            if (stdMat.map && stdMat.map !== contactShadowTex && stdMat.map !== roughMap) {
              stdMat.map.dispose();
            }
            m.dispose();
          });
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const activeMeta =
    SCENE_CATALOG.find((s) => s.id === activeScene) ?? SCENE_CATALOG[0];

  const handleSelectScene = (id: ThreeSceneId) => {
    playCheckSound(true);
    setActiveScene(id);
    activeSceneRef.current = id;
    cameraPresetRequestRef.current = 'hero';
  };

  const getSceneIcon = (id: ThreeSceneId) => {
    switch (id) {
      case 'physics':
        return <Magnet className="w-4 h-4 shrink-0" />;
      case 'chemistry':
        return <Atom className="w-4 h-4 shrink-0" />;
      case 'biology':
        return <Dna className="w-4 h-4 shrink-0" />;
      case 'maths':
        return <Sigma className="w-4 h-4 shrink-0" />;
      case 'trophy':
        return <Trophy className="w-4 h-4 shrink-0" />;
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 w-full h-full overflow-hidden bg-[#F5F2EB] dark:bg-[#161412]"
      role="dialog"
      aria-modal="true"
      aria-label="Quadra 12 3D Study Studio"
    >
      {/* Isolated Full-Bleed WebGL Mount */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Upward Section: Top-Left Active Project Header + Top-Right Exit */}
      <div className="pointer-events-none absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-10 flex items-start justify-between gap-3">
        <div className="pointer-events-auto rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3]/95 dark:bg-[#1E1B18]/95 px-3.5 py-2.5 sm:px-4 shadow-md max-w-[min(440px,calc(100vw-118px))]">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.12em] uppercase text-[#A64B33] dark:text-[#D4785E]">
            {getSceneIcon(activeScene)}
            <span>Quadra 12 · 3D Lab</span>
          </div>
          <h2 className="mt-0.5 text-sm sm:text-base font-semibold text-[#1E1B18] dark:text-[#F5F2EB] leading-snug">
            {activeMeta.subtitle}
          </h2>
          <p className="text-[11px] font-mono text-[#787066] dark:text-[#9C9387] truncate">
            {activeMeta.formula}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            playOmrBubbleSound();
            onClose();
          }}
          aria-label="Exit 3D Studio"
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3]/95 dark:bg-[#1E1B18]/95 text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] hover:bg-[#ECE6D9] dark:hover:bg-[#2C2722] shadow-md transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Exit 3D</span>
        </button>
      </div>

      {/* Side Section: Always-Accessible Project Switcher Rail */}
      <aside
        aria-label="3D Studio Projects"
        className="pointer-events-none absolute left-3 sm:left-4 top-24 bottom-28 z-10 flex items-center"
      >
        {sideRailCollapsed ? (
          <button
            type="button"
            onClick={() => {
              playOmrBubbleSound();
              setSideRailCollapsed(false);
            }}
            aria-label="Show 3D project list"
            className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3]/95 dark:bg-[#1E1B18]/95 text-xs font-medium text-[#1E1B18] dark:text-[#F5F2EB] hover:border-[#A64B33] shadow-lg"
          >
            <Layers className="w-4 h-4 text-[#A64B33] dark:text-[#D4785E]" />
            <span className="hidden sm:inline">Projects</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#787066]" />
          </button>
        ) : (
          <div className="pointer-events-auto max-h-full overflow-y-auto rounded-2xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3]/95 dark:bg-[#1E1B18]/95 p-2 shadow-xl w-[58px] sm:w-56 flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-1.5 pt-0.5 pb-1 border-b border-[#DDD6C7]/70 dark:border-[#332E28]">
              <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.12em] text-[#787066] dark:text-[#9C9387]">
                3D Projects (5)
              </span>
              <span className="sm:hidden text-[9px] font-mono uppercase tracking-wider text-[#787066] dark:text-[#9C9387] mx-auto">
                3D
              </span>
              <button
                type="button"
                onClick={() => {
                  playOmrBubbleSound();
                  setSideRailCollapsed(true);
                }}
                aria-label="Collapse 3D project list"
                title="Hide side project bar"
                className="hidden sm:inline-flex p-1 rounded-md text-[#787066] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] hover:bg-[#ECE6D9] dark:hover:bg-[#2C2722]"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {SCENE_CATALOG.map((item) => {
              const selected = item.id === activeScene;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectScene(item.id)}
                  title={`${item.label} — ${item.modelName}`}
                  aria-current={selected ? 'true' : undefined}
                  className={`w-full flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2.5 px-1.5 sm:px-2.5 py-2 rounded-xl border text-center sm:text-left transition-colors ${
                    selected
                      ? 'bg-[#1E1B18] dark:bg-[#F5F2EB] border-[#1E1B18] dark:border-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18] shadow-xs'
                      : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#575048] dark:text-[#CBC3B6] hover:border-[#A64B33] dark:hover:border-[#D4785E]'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      selected
                        ? 'bg-[#A64B33] text-[#FAF8F3] dark:bg-[#A64B33] dark:text-[#F5F2EB]'
                        : 'bg-[#ECE6D9] dark:bg-[#2C2722] text-[#A64B33] dark:text-[#D4785E]'
                    }`}
                  >
                    {getSceneIcon(item.id)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="sm:hidden text-[9px] font-mono leading-none mt-0.5">
                      {item.shortLabel}
                    </p>
                    <p className="hidden sm:block text-xs font-semibold truncate">
                      {item.label}
                    </p>
                    <p
                      className={`hidden sm:block text-[10px] truncate ${
                        selected
                          ? 'text-[#CBC3B6] dark:text-[#575048]'
                          : 'text-[#787066] dark:text-[#9C9387]'
                      }`}
                    >
                      {item.modelName}
                    </p>
                  </div>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                playOmrBubbleSound();
                setSideRailCollapsed(true);
              }}
              aria-label="Hide side project bar"
              className="sm:hidden mt-0.5 py-1 flex items-center justify-center rounded-lg text-[#787066] hover:bg-[#ECE6D9] dark:hover:bg-[#2C2722]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </aside>

      {/* Collapsible Unified Bottom Camera & Explode Control Dock */}
      <div
        className="absolute bottom-3 sm:bottom-4 left-1/2 z-10 w-[min(640px,calc(100%-24px))] flex flex-col items-center transition-transform duration-300"
        style={{
          transform: dockCollapsed
            ? 'translate(-50%, calc(100% - 34px))'
            : 'translate(-50%, 0)',
        }}
      >
        <button
          type="button"
          onClick={() => {
            playOmrBubbleSound();
            setDockCollapsed((prev) => !prev);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg border border-b-0 border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3]/96 dark:bg-[#1E1B18]/96 text-[11px] font-mono text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Show Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Hide Controls</span>
            </>
          )}
        </button>

        <div className="w-full rounded-xl border border-[#DDD6C7] dark:border-[#332E28] bg-[#FAF8F3]/96 dark:bg-[#1E1B18]/96 px-3.5 py-2.5 shadow-xl space-y-2">
          {/* Camera Preset & Orbit Row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-[#787066] dark:text-[#9C9387]">
              Drag to orbit · Scroll / pinch to zoom
            </span>

            <div className="flex items-center gap-1.5">
              {(['hero', 'top', 'side'] as CameraPreset[]).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    playOmrBubbleSound();
                    cameraPresetRequestRef.current = preset;
                  }}
                  className="px-2 py-1 rounded-md text-[11px] font-mono border border-[#DDD6C7] dark:border-[#332E28] bg-[#F5F2EB] dark:bg-[#24201C] text-[#575048] dark:text-[#CBC3B6] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB] capitalize"
                >
                  {preset === 'hero' ? (
                    <span className="inline-flex items-center gap-1">
                      <Compass className="w-3 h-3" />
                      3/4
                    </span>
                  ) : (
                    preset
                  )}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  playOmrBubbleSound();
                  setAutoRotate((r) => !r);
                }}
                aria-pressed={autoRotate}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                  autoRotate
                    ? 'bg-[#F7EBE7] dark:bg-[#2F1D19] border-[#A64B33] dark:border-[#D4785E] text-[#A64B33] dark:text-[#D4785E]'
                    : 'bg-[#F5F2EB] dark:bg-[#24201C] border-[#DDD6C7] dark:border-[#332E28] text-[#787066]'
                }`}
              >
                <RotateCw className="w-3 h-3" />
                <span>Orbit</span>
              </button>
            </div>
          </div>

          {/* Explode Slider */}
          <div className="flex items-center gap-3 pt-1.5 border-t border-[#DDD6C7]/70 dark:border-[#332E28]">
            <label
              htmlFor="three-explode-slider"
              className="text-[11px] font-mono text-[#575048] dark:text-[#CBC3B6] whitespace-nowrap"
            >
              Explode Model
            </label>
            <input
              id="three-explode-slider"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={explodeFactor}
              onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
              className="flex-1 accent-[#A64B33] dark:accent-[#D4785E] h-1.5 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] font-mono tabular-nums text-[#787066] dark:text-[#9C9387] w-10 text-right">
              {Math.round(explodeFactor * 100)}%
            </span>
            {explodeFactor > 0 && (
              <button
                type="button"
                onClick={() => {
                  playOmrBubbleSound();
                  setExplodeFactor(0);
                }}
                aria-label="Assemble model"
                className="p-1 text-[#787066] hover:text-[#1E1B18] dark:hover:text-[#F5F2EB]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
