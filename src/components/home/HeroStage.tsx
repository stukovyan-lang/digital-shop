'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { LogoTile } from '@/components/ui/LogoTile';
import { getProduct } from '@/data/products';
import { cn } from '@/lib/cn';

// 6 карточек: slug, позиция (доли свободного места), глубина, наклон, свечение
const CARDS = [
  {
    slug: 'telegram-stars',
    x: 0,
    y: 0,
    mx: 0,
    my: 0,
    z: 40,
    r: -6,
    ry: 10,
    glow: 'rgba(59,130,246,.65)',
  },
  {
    slug: 'steam-topup',
    x: 0.5,
    y: 0.1,
    mx: 1,
    my: 0.06,
    z: 80,
    r: 3,
    ry: -8,
    glow: 'rgba(255,46,136,.6)',
  },
  {
    slug: 'chatgpt',
    x: 1,
    y: 0.02,
    mx: 0,
    my: 1,
    z: 20,
    r: 6,
    ry: -12,
    glow: 'rgba(168,85,247,.6)',
  },
  {
    slug: 'spotify',
    x: 0,
    y: 0.92,
    mx: 1,
    my: 1,
    z: 100,
    r: 5,
    ry: 8,
    glow: 'rgba(255,46,136,.6)',
  },
  { slug: 'ps-plus-turkey', x: 0.5, y: 0.8, z: 60, r: -3, ry: -6, glow: 'rgba(59,130,246,.65)' },
  { slug: 'xbox', x: 1, y: 1, z: 120, r: -7, ry: -10, glow: 'rgba(168,85,247,.6)' },
] as const;

/**
 * CSS-фолбэк первого экрана (SPEC п.6): 3D-карточки на transform, synthwave-сетка,
 * свечения и звёзды. На слабых устройствах и пока грузится R3F-сцена показывается он.
 * Наклон сцены за курсором — только мышь и без reduced-motion.
 */
export function HeroStage() {
  const orbit = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !orbit.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    orbit.current.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 12}deg)`;
  };
  const onLeave = () => {
    if (orbit.current) orbit.current.style.transform = '';
  };

  return (
    <div className="nx-stagewrap">
      <div
        className="nx-stage relative h-[430px] w-full sm:h-[540px]"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <div className="nx-stars" aria-hidden />
        <div
          className="nx-orb"
          aria-hidden
          style={{ width: 280, height: 280, left: '8%', top: '10%', background: 'var(--nx-pink)' }}
        />
        <div
          className="nx-orb"
          aria-hidden
          style={{
            width: 300,
            height: 300,
            right: '0%',
            bottom: '6%',
            background: 'var(--nx-blue)',
          }}
        />
        <div className="nx-grid" aria-hidden />

        <div ref={orbit} className="nx-orbit">
          {CARDS.map((c, i) => {
            const p = getProduct(c.slug)!;
            return (
              <Link
                key={c.slug}
                href={`/product/${c.slug}`}
                className={cn(
                  'nx-fcard text-ink no-underline hover:text-white',
                  !('mx' in c) && 'max-[760px]:hidden',
                )}
                aria-label={p.name}
                style={
                  {
                    '--x': c.x,
                    '--y': c.y,
                    '--mx': 'mx' in c ? c.mx : c.x,
                    '--my': 'my' in c ? c.my : c.y,
                    '--z': `${c.z}px`,
                    '--r': `${c.r}deg`,
                    '--ry': `${c.ry}deg`,
                    '--glow': c.glow,
                    animationDelay: `${-i * 1.1}s`,
                  } as React.CSSProperties
                }
              >
                <LogoTile name={p.name} size={52} />
                <div>
                  <div className="nx-display text-base leading-tight font-bold">{p.name}</div>
                  <div className="mt-1 text-xs text-muted">
                    от <span className="text-ink">{'[ЦЕНА]'}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
