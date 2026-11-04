import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BOOKS, BOOK_ORDER } from '../../data/books';
import type { CoverAsset } from '../../lib/coverArt';
import { BookMesh } from './Book';

export interface PointerState {
  x: number;
  y: number;
  active: boolean;
  lastMove: number;
}

interface BookSceneProps {
  covers: CoverAsset[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  pointer: React.RefObject<PointerState>;
  reducedMotion: boolean;
  coarse: boolean;
}

const K = 70;
const C = 12.5;
const SUBSTEPS = 4;
const MAX_DT = 0.05;

const ROW_X0 = 4;
const ROW_XSTEP = 0.55;
const ROW_Y0 = -3.43;
const ROW_YSTEP = -0.034;
const ROW_Z0 = 1;
const ROW_ZSTEP = 0.11;
const CAMERA_X = -3.6;
const CAMERA_Z = 9.6;

function bookPosition(index: number): [number, number, number] {
  return [
    ROW_X0 - index * ROW_XSTEP,
    ROW_Y0 + index * ROW_YSTEP,
    ROW_Z0 - index * ROW_ZSTEP,
  ];
}

function bookFacing(index: number): number {
  const [x, , z] = bookPosition(index);
  return Math.atan2(CAMERA_X - x, CAMERA_Z - z) * 0.72;
}

function makePageTexture(horizontal: boolean): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#efe7d6';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < size; i += 2) {
      const a = 0.05 + (Math.sin(i * 12.9898) * 0.5 + 0.5) * 0.12;
      ctx.fillStyle = `rgba(96, 67, 41, ${a.toFixed(3)})`;
      if (horizontal) ctx.fillRect(0, i, size, 1);
      else ctx.fillRect(i, 0, 1, size);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function StudioEnvironment() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const environmentScene = new RoomEnvironment();
    const target = pmrem.fromScene(environmentScene, 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.55;
    pmrem.dispose();
    (environmentScene as THREE.Scene & { dispose?: () => void }).dispose?.();

    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene]);

  return null;
}

function CameraRig() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(1, size.height);
    const fov = aspect < 0.8 ? 38 : size.width < 1100 ? 33 : 30;
    cam.fov = fov;
    cam.near = 0.1;
    cam.far = 80;
    cam.position.set(-3.6, 0, 9.6);
    cam.lookAt(-3.6, -1.5, 0);
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

interface BookRowProps {
  covers: CoverAsset[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  pointer: React.RefObject<PointerState>;
  reducedMotion: boolean;
  coarse: boolean;
  isMobile: boolean;
}

function BookRow({
  covers,
  selectedId,
  onSelect,
  pointer,
  reducedMotion,
  coarse,
}: BookRowProps) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const springs = useRef(
    BOOK_ORDER.map(() => ({ y: -3, vy: 0, z: 0, vz: 0 })),
  );
  const elapsed = useRef(0);
  const mountTime = useRef(performance.now());
  const projected = useMemo(() => new THREE.Vector3(), []);
  const anchorA = useMemo(() => new THREE.Vector3(), []);
  const anchorB = useMemo(() => new THREE.Vector3(), []);
  const facings = useMemo(
    () => BOOK_ORDER.map((_, index) => bookFacing(index)),
    [],
  );

  const pageSide = useMemo(() => makePageTexture(true), []);
  const pageTop = useMemo(() => makePageTexture(false), []);
  const anisotropy = useMemo(
    () => Math.min(8, gl.capabilities.getMaxAnisotropy()),
    [gl],
  );

  if (pageSide.anisotropy !== anisotropy) {
    pageSide.anisotropy = anisotropy;
    pageTop.anisotropy = anisotropy;
    pageSide.needsUpdate = true;
    pageTop.needsUpdate = true;
  }

  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1.5, 0.1), []);

  useEffect(() => {
    return () => {
      pageSide.dispose();
      pageTop.dispose();
      geometry.dispose();
    };
  }, [geometry, pageSide, pageTop]);

  useEffect(() => {
    if (reducedMotion) {
      springs.current = BOOK_ORDER.map(() => ({ y: 0, vy: 0, z: 0, vz: 0 }));
    }
  }, [reducedMotion]);

  const screenPoint = (mesh: THREE.Mesh) => {
    mesh.localToWorld(projected.set(0, 0.1, 0));
    projected.project(camera);
    return {
      x: (projected.x * 0.5 + 0.5) * window.innerWidth,
      y: (-projected.y * 0.5 + 0.5) * window.innerHeight,
    };
  };

  useFrame((_, delta) => {
    const dt = Math.min(delta, MAX_DT);
    elapsed.current += dt;

    if (reducedMotion) {
      BOOK_ORDER.forEach((_, index) => {
        const mesh = meshRefs.current[index];
        const group = groupRefs.current[index];
        if (!mesh || !group) return;
        mesh.position.set(0, 0, 0);
        mesh.rotation.x = 0;
        group.rotation.y = facings[index];
      });
      return;
    }

    const now = performance.now();
    const pointerState = pointer.current;
    const interactionPaused = selectedId !== null;
    const idleAfter = 4000;
    const idle =
      !interactionPaused &&
      (coarse || now - Math.max(pointerState.lastMove, mountTime.current) > idleAfter);

    let dx = 0;
    let dy = 0;
    let hasCursor = false;

    if (!interactionPaused) {
      if (pointerState.active && !idle) {
        dx = pointerState.x;
        dy = pointerState.y;
        hasCursor = true;
      } else if (idle) {
        const a = meshRefs.current[Math.min(27, meshRefs.current.length - 1)];
        const b = meshRefs.current[Math.min(1, meshRefs.current.length - 1)];
        if (a && b) {
          const pa = screenPoint(a);
          const pb = screenPoint(b);
          anchorA.set(pa.x, pa.y, 0);
          anchorB.set(pb.x, pb.y, 0);
          const u = (Math.sin(elapsed.current * 0.45) + 1) / 2;
          dx = anchorA.x + (anchorB.x - anchorA.x) * u;
          dy = anchorA.y + (anchorB.y - anchorA.y) * u;
          hasCursor = true;
        }
      }
    }

    const radius = Math.max(window.innerWidth, window.innerHeight) * 0.085;
    const radiusSq = radius * radius;

    BOOK_ORDER.forEach((bookId, index) => {
      const mesh = meshRefs.current[index];
      const group = groupRefs.current[index];
      if (!mesh || !group) return;

      const spring = springs.current[index];
      const startAt = 0.25 + (BOOK_ORDER.length - index) * 0.035;
      const started = elapsed.current > startAt;
      const selected = selectedId === bookId;

      let influence = 0;
      if (hasCursor && started) {
        const point = screenPoint(mesh);
        const xd = point.x - dx;
        const yd = (point.y - dy) * 0.55;
        influence = Math.exp(-(xd * xd + yd * yd) / radiusSq);
      }

      let targetY = -3;
      let targetZ = 0;

      if (started) {
        const lift = influence * 0.78;
        targetY = selected ? Math.max(lift, 1.12) : lift;
        targetZ = selected ? 1.35 : lift * 0.35;
      }

      const h = dt / SUBSTEPS;
      for (let step = 0; step < SUBSTEPS; step += 1) {
        spring.vy += ((targetY - spring.y) * K - spring.vy * C) * h;
        spring.y += spring.vy * h;
        spring.vz += ((targetZ - spring.z) * K - spring.vz * C) * h;
        spring.z += spring.vz * h;
      }

      mesh.position.y = spring.y;
      mesh.position.z = spring.z;
      mesh.rotation.x = -spring.vy * 0.012;

      const targetRotation = selected
        ? facings[index] * 0.35
        : facings[index];
      group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetRotation, 6, dt);
    });
  });

  return (
    <group>
      {BOOK_ORDER.map((bookId, index) => {
        const book = BOOKS[bookId];
        const cover = covers[bookId];
        if (!book || !cover) return null;
        return (
          <BookMesh
            key={book.id}
            book={book}
            cover={cover}
            geometry={geometry}
            pageSide={pageSide}
            pageTop={pageTop}
            groupRef={(group) => {
              groupRefs.current[index] = group;
            }}
            meshRef={(mesh) => {
              meshRefs.current[index] = mesh;
            }}
            onSelect={onSelect}
            position={bookPosition(index)}
            rotationY={facings[index]}
            anisotropy={anisotropy}
          />
        );
      })}
    </group>
  );
}

function SceneContent(props: BookRowProps) {
  return (
    <>
      <CameraRig />
      <StudioEnvironment />
      <ambientLight intensity={0.12} />
      <directionalLight
        color="#fff3e4"
        intensity={2.4}
        position={[-4, 6, 6]}
        castShadow={!props.isMobile}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-22}
        shadow-camera-right={9}
        shadow-camera-top={8}
        shadow-camera-bottom={-6}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-bias={-0.0005}
      />
      <directionalLight color="#bfd2ff" intensity={1.1} position={[6, 3, -4]} />
      <BookRow {...props} />
    </>
  );
}

export default function BookScene({
  covers,
  selectedId,
  onSelect,
  pointer,
  reducedMotion,
  coarse,
}: BookSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = wrapRef.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(
      (entries) => setVisible(entries[0]?.isIntersecting ?? true),
      { threshold: 0.01 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="book-scene__canvas" ref={wrapRef}>
      <Canvas
        dpr={[1, 2]}
        shadows
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [3.6, 2.15, 7.4], fov: 19.5, near: 0.1, far: 80 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        style={{ touchAction: 'pan-y' }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          scene.background = null;
        }}
        onPointerMissed={() => {
          document.body.style.cursor = '';
        }}
      >
        <Suspense fallback={null}>
          <SceneContent
            covers={covers}
            selectedId={selectedId}
            onSelect={onSelect}
            pointer={pointer}
            reducedMotion={reducedMotion}
            coarse={coarse}
            isMobile={coarse}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
