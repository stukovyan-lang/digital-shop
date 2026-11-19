'use client';

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/cn';
import { categories, products, type Category } from '@/data/products';
import { ProductCard } from './ProductCard';

type Filter = 'all' | Category;
const filters: { id: Filter; label: string }[] = [{ id: 'all', label: 'Все' }, ...categories];
const EASING = 'cubic-bezier(.2,.8,.2,1)';

function Item({
  index,
  children,
  setRef,
}: {
  index: number;
  children: ReactNode;
  setRef: (el: HTMLLIElement | null) => void;
}) {
  const [ref, shown] = useReveal<HTMLLIElement>('0px 0px -60px 0px');
  return (
    <li
      ref={(el) => {
        ref.current = el;
        setRef(el);
      }}
      className={cn('nx-reveal', shown && 'is-in')}
      // каскад 60 мс по колонкам
      style={{ transitionDelay: `${(index % 3) * 0.06}s` }}
    >
      {children}
    </li>
  );
}

/**
 * Каталог с фильтрами. Без Framer (бюджет JS): подложка активного чипа переезжает
 * через transform/transition, карточки перестраиваются через FLIP (Web Animations API).
 */
export function Catalog() {
  const [active, setActive] = useState<Filter>('all');
  const [pill, setPill] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const ready = pill.w > 0; // подложка измерена

  const group = useRef<HTMLDivElement>(null);
  const chips = useRef(new Map<Filter, HTMLButtonElement>());
  const cards = useRef(new Map<string, HTMLLIElement>());
  const before = useRef(new Map<string, DOMRect>());

  const list = active === 'all' ? products : products.filter((p) => p.category === active);

  const select = (id: Filter) => {
    // FLIP, шаг First: запоминаем позиции карточек до перестройки
    before.current = new Map(
      [...cards.current].map(([slug, el]) => [slug, el.getBoundingClientRect()]),
    );
    setActive(id);
  };

  const measure = useCallback(() => {
    const el = chips.current.get(active);
    if (!el) return;
    setPill({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
  }, [active]);

  useLayoutEffect(() => {
    measure();
    const g = group.current;
    if (!g) return;
    const ro = new ResizeObserver(measure);
    ro.observe(g);
    return () => ro.disconnect();
  }, [measure]);

  // FLIP, шаги Last/Invert/Play: оставшиеся карточки плавно переезжают на новые места
  useLayoutEffect(() => {
    if (before.current.size === 0) return;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.current.forEach((el, slug) => {
        const was = before.current.get(slug);
        if (!was) return;
        const now = el.getBoundingClientRect();
        const dx = was.left - now.left;
        const dy = was.top - now.top;
        if (dx || dy) {
          el.animate(
            [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
            { duration: 550, easing: EASING },
          );
        }
      });
    }
    before.current = new Map();
  }, [active]);

  return (
    <div>
      <div
        ref={group}
        role="group"
        aria-label="Категории"
        className="relative flex flex-wrap gap-2"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 rounded-full"
          style={{
            width: pill.w,
            height: pill.h,
            transform: `translate(${pill.x}px, ${pill.y}px)`,
            opacity: ready ? 1 : 0,
            background: 'var(--nx-grad)',
            boxShadow: '0 8px 24px -8px rgba(255,46,136,.7)',
            transition: ready
              ? `transform .45s ${EASING}, width .45s ${EASING}, opacity .3s`
              : 'none',
          }}
        />
        {filters.map((f) => {
          const on = active === f.id;
          return (
            <button
              key={f.id}
              ref={(el) => {
                if (el) chips.current.set(f.id, el);
                else chips.current.delete(f.id);
              }}
              type="button"
              aria-pressed={on}
              onClick={() => select(f.id)}
              // до измерения (SSR/первый кадр) активный чип красит себя сам — без вспышки
              className={cn('nx-chip relative', on && !ready && 'is-on')}
              style={
                on && ready
                  ? { color: '#fff', borderColor: 'transparent', background: 'transparent' }
                  : undefined
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-8 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <Item
            key={p.slug}
            index={i}
            setRef={(el) => {
              if (el) cards.current.set(p.slug, el);
              else cards.current.delete(p.slug);
            }}
          >
            <ProductCard product={p} />
          </Item>
        ))}
      </ul>
    </div>
  );
}
