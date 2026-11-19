'use client';

import { LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

// domMax (нужен для layout/layoutId) грузится отдельным чанком и не входит в первый JS.
const loadFeatures = () => import('./motion-features').then((mod) => mod.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {/* reducedMotion="user": при prefers-reduced-motion остаются только opacity-переходы */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
