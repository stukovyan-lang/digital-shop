'use client';

import { Float, RoundedBox, useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { Group, Texture } from 'three';
import { makeCardTexture } from './cardTexture';

export type SceneQuality = 'high' | 'medium';

type Props = {
  name: string;
  priceText: string;
  glow: string;
  position: [number, number, number];
  rotation: [number, number, number];
  floatSpeed: number;
  quality: SceneQuality;
  onSelect: () => void;
};

const W = 1.5;
const H = 2.0;

/** Стеклянная карточка сервиса: MeshPhysicalMaterial (transmission + iridescence) и лицо из canvas-текстуры. */
export function GlassCard({
  name,
  priceText,
  glow,
  position,
  rotation,
  floatSpeed,
  quality,
  onSelect,
}: Props) {
  const group = useRef<Group>(null);
  const [tex, setTex] = useState<Texture | null>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useEffect(() => {
    let cancelled = false;
    let made: Texture | null = null;
    void makeCardTexture(name, priceText, glow).then((t) => {
      if (cancelled) t.dispose();
      else {
        made = t;
        setTex(t);
      }
    });
    return () => {
      cancelled = true;
      made?.dispose();
    };
  }, [name, priceText, glow]);

  // плавный hover-подъём
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const target = hovered ? 1.07 : 1;
    const k = 1 - Math.exp(-dt * 10);
    g.scale.setScalar(g.scale.x + (target - g.scale.x) * k);
  });

  const high = quality === 'high';

  return (
    <group position={position} rotation={rotation}>
      <Float
        speed={floatSpeed}
        rotationIntensity={0.5}
        floatIntensity={0.9}
        floatingRange={[-0.12, 0.12]}
      >
        <group
          ref={group}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {/* неоновое свечение за стеклом — его подхватывает Bloom */}
          <mesh position={[0, 0, -0.09]} scale={1.03}>
            <planeGeometry args={[W, H]} />
            <meshBasicMaterial
              color={glow}
              transparent
              opacity={hovered ? 0.4 : 0.14}
              toneMapped={false}
            />
          </mesh>

          <RoundedBox args={[W, H, 0.12]} radius={0.1} smoothness={4}>
            <meshPhysicalMaterial
              color="#ffffff"
              roughness={0.15}
              metalness={0}
              transmission={high ? 0.92 : 0}
              thickness={0.6}
              ior={1.4}
              transparent={!high}
              opacity={high ? 1 : 0.32}
              iridescence={1}
              iridescenceIOR={1.3}
              iridescenceThicknessRange={[120, 520]}
              clearcoat={1}
              clearcoatRoughness={0.1}
              envMapIntensity={1.4}
            />
          </RoundedBox>

          {tex && (
            <mesh position={[0, 0, 0.07]}>
              <planeGeometry args={[W * 0.96, H * 0.96]} />
              <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
            </mesh>
          )}
        </group>
      </Float>
    </group>
  );
}
