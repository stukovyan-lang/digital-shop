'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LogoTile } from '@/components/ui/LogoTile';
import { PH } from '@/config/placeholders';
import { getProduct } from '@/data/products';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { detectQuality, lower, rememberQuality, type Quality } from '@/hooks/useQuality';
import { cn } from '@/lib/cn';

// R3F-сцена грузится лениво и только на клиенте (SPEC разд. 6)
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

const PINK = '#ff2e88';
const BLUE = '#3b82f6';
const VIOLET = '#a855f7';

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
    hex: BLUE,
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
    hex: PINK,
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
    hex: VIOLET,
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
    hex: PINK,
  },
  {
    slug: 'ps-plus-turkey',
    x: 0.5,
    y: 0.8,
    z: 60,
    r: -3,
    ry: -6,
    glow: 'rgba(59,130,246,.65)',
    hex: BLUE,
  },
  { slug: 'xbox', x: 1, y: 1, z: 120, r: -7, ry: -10, glow: 'rgba(168,85,247,.6)', hex: VIOLET },
] as const;

const sceneCards = CARDS.map((c) => ({
  slug: c.slug,
  name: getProduct(c.slug)!.name,
  priceText: `от ${PH.PRICE}`,
  glow: c.hex,
}));

/**
 * Правая часть hero. Сначала — CSS-фолбэк (3D-карточки на transform, сетка, звёзды):
 * он же LCP-безопасный вариант и запасной путь для слабых устройств. Следом лениво
 * подгружается R3F-сцена; когда она отрисовала первые кадры — плавно проявляется поверх.
 * Настоящие ссылки остаются в DOM (sr-only), даже когда видна canvas-сцена.
 */
export function HeroStage() {
  const router = useRouter();
  const orbit = useRef<HTMLDivElement>(null);
  const tilt = useRef({ x: 0, y: 0 });
  const compact = useMediaQuery('(max-width: 760px)');
  const stage = useRef<HTMLDivElement>(null);
  const bornAt = useRef(0);
  const [quality, setQuality] = useState<Quality | null>(null); // null — ещё не определён
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  // 3D только на high/medium; low = CSS-фолбэк
  const want3d = quality === 'high' || quality === 'medium';
  const active = inView && tabVisible; // вне экрана или на скрытой вкладке — frameloop="demand"

  // Определяем уровень и грузим сцену после отрисовки первого экрана (в простое)
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const start = () => {
      bornAt.current = performance.now();
      setQuality(detectQuality());
    };
    // Не конкурируем с загрузкой страницы: ждём window.load, затем простой потока
    let cancelIdle = () => {};
    const schedule = () => {
      if (w.requestIdleCallback) {
        const id = w.requestIdleCallback(start, { timeout: 2500 });
        cancelIdle = () => w.cancelIdleCallback?.(id);
      } else {
        const id = window.setTimeout(start, 1200);
        cancelIdle = () => clearTimeout(id);
      }
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      window.removeEventListener('load', schedule);
      cancelIdle();
    };
  }, []);

  // Гироскоп на тач-устройствах: наклон телефона = наклон сцены
  useEffect(() => {
    if (!want3d || !window.matchMedia('(pointer: coarse)').matches) return;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      tilt.current.x = clamp(e.gamma / 30);
      tilt.current.y = clamp((e.beta - 45) / 30);
    };
    window.addEventListener('deviceorientation', onOrient);
    return () => window.removeEventListener('deviceorientation', onOrient);
  }, [want3d]);

  // Пауза: hero вне экрана / вкладка скрыта → canvas не рендерит кадры
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    const onVis = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  // Просадка FPS → понижаем уровень (high → medium → low). Первые 3 с игнорируем:
  // компиляция шейдеров даёт ложную просадку.
  const onDecline = () => {
    if (performance.now() - bornAt.current < 3000) return;
    setQuality((q) => {
      if (!q || q === 'low') return q;
      const next = lower(q);
      rememberQuality(next);
      if (next === 'low') setReady(false);
      return next;
    });
  };

  // iOS требует разрешения на датчики — запрашиваем по первому касанию
  const askMotion = () => {
    const D = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    void D?.requestPermission?.().catch(() => undefined);
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (ready || e.pointerType !== 'mouse' || !orbit.current) return;
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
        ref={stage}
        className="nx-stage relative h-[430px] w-full sm:h-[540px]"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onTouchStart={want3d ? askMotion : undefined}
      >
        {/* CSS-фолбэк: уходит, когда сцена готова. inert — не фокусируется и не читается */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: ready ? 0 : 1 }}
          aria-hidden={ready || undefined}
          inert={ready || undefined}
        >
          <div className="nx-stars" aria-hidden />
          <div
            className="nx-orb"
            aria-hidden
            style={{
              width: 280,
              height: 280,
              left: '8%',
              top: '10%',
              background: 'var(--nx-pink)',
            }}
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
                  <LogoTile name={p.name} slug={p.slug} size={52} />
                  <div>
                    <div className="nx-display text-base leading-tight font-bold">{p.name}</div>
                    <div className="mt-1 text-xs text-muted">
                      от <span className="text-ink">{PH.PRICE}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* R3F-сцена. Декоративная: доступные ссылки — в списке ниже */}
        {want3d && (
          <div
            className="nx-scene-mask absolute inset-0 transition-opacity duration-700"
            style={{ opacity: ready ? 1 : 0, pointerEvents: ready ? 'auto' : 'none' }}
            aria-hidden
          >
            <HeroScene
              key={quality}
              cards={sceneCards}
              compact={compact}
              quality={quality}
              active={active}
              tilt={tilt}
              onReady={() => setReady(true)}
              onDecline={onDecline}
              onSelect={(slug) => router.push(`/product/${slug}`)}
            />
          </div>
        )}

        {ready && (
          <ul className="sr-only">
            {CARDS.map((c) => {
              const p = getProduct(c.slug)!;
              return (
                <li key={c.slug}>
                  <Link href={`/product/${c.slug}`}>{p.name}</Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
