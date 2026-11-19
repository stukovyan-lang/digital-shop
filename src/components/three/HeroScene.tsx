'use client';

import { Environment, Lightformer, Stars } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useRef } from 'react';
import { MathUtils, type Group } from 'three';
import { GlassCard, type Quality } from './GlassCard';
import { SynthGrid } from './SynthGrid';

export type SceneCard = { slug: string; name: string; priceText: string; glow: string };

type Layout = { pos: [number, number, number]; rot: [number, number, number]; speed: number };

// 3×2 на десктопе, 2×2 на мобильном (как в CSS-фолбэке)
const WIDE: Layout[] = [
  { pos: [-1.75, 1.2, 0.2], rot: [0, 0.18, -0.1], speed: 1.2 },
  { pos: [0, 1.05, 0.6], rot: [0, -0.14, 0.05], speed: 1.5 },
  { pos: [1.75, 1.25, 0], rot: [0, -0.2, 0.1], speed: 1.1 },
  { pos: [-1.75, -1.15, 0.9], rot: [0, 0.14, 0.08], speed: 1.4 },
  { pos: [0, -1.3, 0.5], rot: [0, -0.1, -0.05], speed: 1.3 },
  { pos: [1.75, -1.1, 1.1], rot: [0, -0.18, -0.12], speed: 1.6 },
];
const COMPACT: Layout[] = [
  { pos: [-0.97, 1.25, 0.2], rot: [0, 0.14, -0.08], speed: 1.2 },
  { pos: [0.97, 1.05, 0.5], rot: [0, -0.14, 0.06], speed: 1.5 },
  { pos: [-0.97, -1.25, 0.6], rot: [0, 0.12, 0.07], speed: 1.4 },
  { pos: [0.97, -1.4, 0.9], rot: [0, -0.12, -0.08], speed: 1.3 },
];

type Tilt = { x: number; y: number };

/** Сцена наклоняется за курсором (мышь) или за гироскопом (тач) с плавной интерполяцией. */
function Rig({
  cards,
  compact,
  quality,
  tilt,
  onSelect,
}: {
  cards: SceneCard[];
  compact: boolean;
  quality: Quality;
  tilt: React.RefObject<Tilt>;
  onSelect: (slug: string) => void;
}) {
  const group = useRef<Group>(null);
  const { viewport } = useThree();
  const layout = compact ? COMPACT : WIDE;
  const visible = cards.slice(0, layout.length);
  const scale = compact
    ? Math.min(1.25, viewport.width / 3.9)
    : Math.min(1.15, viewport.width / 6.0);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    // мышь: state.pointer (−1…1); гироскоп пишет в tilt.current
    const t = tilt.current;
    const tx = t.x || state.pointer.x;
    const ty = t.y || state.pointer.y;
    g.rotation.y = MathUtils.damp(g.rotation.y, tx * 0.38, 3.5, dt);
    g.rotation.x = MathUtils.damp(g.rotation.x, -ty * 0.22, 3.5, dt);
  });

  return (
    <group ref={group} scale={scale}>
      {visible.map((c, i) => (
        <GlassCard
          key={c.slug}
          name={c.name}
          priceText={c.priceText}
          glow={c.glow}
          position={layout[i].pos}
          rotation={layout[i].rot}
          floatSpeed={layout[i].speed}
          quality={quality}
          onSelect={() => onSelect(c.slug)}
        />
      ))}
    </group>
  );
}

/** Вызывает onReady после нескольких отрисованных кадров (шейдеры скомпилированы). */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    if (++frames.current === 3) onReady();
  });
  return null;
}

export default function HeroScene({
  cards,
  compact,
  quality,
  active,
  tilt,
  onReady,
  onSelect,
}: {
  cards: SceneCard[];
  compact: boolean;
  quality: Quality;
  active: boolean;
  tilt: React.RefObject<Tilt>;
  onReady: () => void;
  onSelect: (slug: string) => void;
}) {
  const high = quality === 'high';

  return (
    <Canvas
      flat
      dpr={high ? [1, 1.75] : [1, 1.25]}
      frameloop={active ? 'always' : 'demand'}
      camera={{ position: [0, 0.6, 8.2], fov: 40 }}
      gl={{ alpha: true, antialias: !high, powerPreference: 'high-performance' }}
      onCreated={({ camera }) => camera.lookAt(0, -0.2, 0)}
      aria-hidden
    >
      {/* Bloom (postprocessing) не сохраняет альфу — фон сцены совпадает с цветом страницы,
          а края канвы растушёвывает CSS-маска (.nx-scene-mask) */}
      {high && <color attach="background" args={['#07060d']} />}
      <ambientLight intensity={0.35} />
      <pointLight position={[-4, 2.5, 4]} intensity={16} color="#ff2e88" />
      <pointLight position={[4, -1, 4]} intensity={16} color="#3b82f6" />

      {/* процедурное окружение (без загрузки HDR) — даёт стеклу блики */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={3}
          color="#ff5ca3"
          position={[-5, 2, 3]}
          scale={[6, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          color="#7aa7ff"
          position={[5, 0, 3]}
          scale={[6, 3, 1]}
        />
        <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 5, -2]} scale={5} />
      </Environment>

      <Stars
        radius={45}
        depth={40}
        count={high ? 3000 : 1200}
        factor={3}
        saturation={0.4}
        fade
        speed={0.8}
      />
      <SynthGrid />
      <Rig cards={cards} compact={compact} quality={quality} tilt={tilt} onSelect={onSelect} />

      {high && (
        <EffectComposer multisampling={4} enableNormalPass={false}>
          <Bloom intensity={0.9} luminanceThreshold={0.55} luminanceSmoothing={0.2} mipmapBlur />
        </EffectComposer>
      )}
      <ReadySignal onReady={onReady} />
    </Canvas>
  );
}
