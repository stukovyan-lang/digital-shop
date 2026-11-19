'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, type ShaderMaterial } from 'three';

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// Неоновая сетка: розовые поперечные и синие продольные линии, бегут к камере, тают вдаль и по краям
const fragment = /* glsl */ `
varying vec2 vUv;
uniform float uTime;
uniform vec3 uPink;
uniform vec3 uBlue;
void main() {
  vec2 p = vUv * vec2(60.0, 50.0);
  p.y += uTime * 1.1;
  vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
  float lx = 1.0 - min(g.x, 1.0);
  float ly = 1.0 - min(g.y, 1.0);
  float far = pow(1.0 - vUv.y, 1.6);
  float side = smoothstep(0.0, 0.35, vUv.x) * smoothstep(1.0, 0.65, vUv.x);
  vec3 col = uPink * ly + uBlue * lx;
  float a = max(lx, ly) * far * side;
  gl_FragColor = vec4(col * 1.8, a);
}`;

export function SynthGrid({ y = -2.9 }: { y?: number }) {
  const mat = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPink: { value: [1.0, 0.18, 0.53] },
      uBlue: { value: [0.23, 0.51, 0.96] },
    }),
    [],
  );
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh position={[0, y, -22]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[60, 50]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}
