'use client';

import { useRef, type ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * Карточка с неоновой рамкой. Подъём, конусная рамка и свечение — CSS (.nx-card).
 * 3D-tilt ±8° за курсором — на внутренней обёртке (.nx-tilt), чтобы не конфликтовать
 * с CSS-transform hover. Только для мыши; на тач — scale при нажатии (CSS).
 * Без Framer: углы пишем в CSS-переменные, сглаживает CSS transition.
 */
export function NeonCard({
  className,
  children,
  tilt = true,
  ...rest
}: ComponentProps<'div'> & { tilt?: boolean }) {
  const inner = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const set = (tx: number, ty: number) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      inner.current?.style.setProperty('--tx', `${tx}deg`);
      inner.current?.style.setProperty('--ty', `${ty}deg`);
    });
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tilt || e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    set(-y * 16, x * 16);
  };

  return (
    <div
      className={cn('nx-card', className)}
      onPointerMove={onMove}
      onPointerLeave={() => set(0, 0)}
      {...rest}
    >
      <div ref={inner} className={cn('h-full rounded-[inherit]', tilt && 'nx-tilt')}>
        {children}
      </div>
    </div>
  );
}
