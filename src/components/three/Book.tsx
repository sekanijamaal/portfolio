import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { Book } from '../../data/books';
import type { CoverAsset } from '../../lib/coverArt';

interface BookMeshProps {
  book: Book;
  cover: CoverAsset;
  geometry: THREE.BufferGeometry;
  pageSide: THREE.Texture;
  pageTop: THREE.Texture;
  groupRef: (group: THREE.Group | null) => void;
  meshRef: (mesh: THREE.Mesh | null) => void;
  onSelect: (id: number) => void;
  position: [number, number, number];
  rotationY: number;
  anisotropy: number;
}

export function BookMesh({
  book,
  cover,
  geometry,
  pageSide,
  pageTop,
  groupRef,
  meshRef,
  onSelect,
  position,
  rotationY,
  anisotropy,
}: BookMeshProps) {
  const coverTexture = useMemo(() => {
    const texture = new THREE.CanvasTexture(cover.canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = anisotropy;
    texture.needsUpdate = true;
    return texture;
  }, [cover.canvas, anisotropy]);

  const materials = useMemo(() => {
    const spineColor = new THREE.Color(book.spine).multiplyScalar(0.62);
    const foreEdge = new THREE.MeshStandardMaterial({
      map: pageSide,
      roughness: 0.9,
      metalness: 0,
    });
    const spine = new THREE.MeshPhysicalMaterial({
      color: spineColor,
      roughness: 0.55,
      metalness: 0,
      clearcoat: 0.3,
      clearcoatRoughness: 0.5,
    });
    const top = new THREE.MeshStandardMaterial({
      map: pageTop,
      roughness: 0.9,
      metalness: 0,
    });
    const bottom = new THREE.MeshStandardMaterial({
      map: pageTop,
      roughness: 0.9,
      metalness: 0,
    });
    const coverMaterial = new THREE.MeshPhysicalMaterial({
      map: coverTexture,
      roughness: 0.42,
      metalness: 0,
      clearcoat: 0.55,
      clearcoatRoughness: 0.35,
    });
    const back = new THREE.MeshStandardMaterial({
      color: spineColor,
      roughness: 0.6,
      metalness: 0,
    });
    return [foreEdge, spine, top, bottom, coverMaterial, back];
  }, [book.spine, coverTexture, pageSide, pageTop]);

  useEffect(() => {
    return () => {
      materials.forEach((material) => material.dispose());
      coverTexture.dispose();
    };
  }, [materials, coverTexture]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, rotationY, 0]}
    >
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={materials}
        castShadow
        receiveShadow
        frustumCulled={false}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = '';
        }}
        onClick={(event) => {
          event.stopPropagation();
          if (event.delta !== undefined && event.delta > 8) return;
          document.body.style.cursor = '';
          onSelect(book.id);
        }}
      />
    </group>
  );
}
