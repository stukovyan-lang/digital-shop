'use client';

import type { ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/cn';

/**
 * Появление при скролле (SPEC п.4): въезд снизу на 60px, blur 6→0, scale .97→1.
 * IntersectionObserver + CSS-transition (.nx-reveal) — без Framer, чтобы не раздувать
 * первый JS. На мобильных blur отключён, при reduced-motion — только opacity.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, shown] = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn('nx-reveal', shown && 'is-in', className)}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
