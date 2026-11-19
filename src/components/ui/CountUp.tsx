'use client';

import { useEffect, useRef, useState } from 'react';
import { PH } from '@/config/placeholders';

/**
 * Плавный счётчик (count-up при появлении). Показываем только реальные данные:
 * value === null → плейсхолдер [N].
 */
export function CountUp({ value, suffix = '' }: { value: number | null; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (value === null || !ref.current) return;
    const el = ref.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      if (reduce) return setShown(value);
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / 1400, 1);
        setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref}>{value === null ? PH.N : `${shown.toLocaleString('ru-RU')}${suffix}`}</span>
  );
}
