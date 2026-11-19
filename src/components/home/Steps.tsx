'use client';

import { useEffect, useRef } from 'react';

const STEPS = [
  { n: '01', title: 'Выберите товар', text: 'Откройте нужный товар и укажите данные получателя.' },
  { n: '02', title: 'Оплатите', text: 'Криптовалютой или с баланса на сайте.' },
  {
    n: '03',
    title: 'Получите',
    text: 'Автоматически или через менеджера — статус виден на странице заказа.',
  },
];

/** «3 шага»: линия прогресса и появление шагов привязаны к скроллу (GSAP ScrollTrigger). */
export function Steps() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      line.current?.style.setProperty('--p', '1');
      return;
    }
    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    // GSAP грузится динамически — не входит в первый JS
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled || !root.current) return;
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.fromTo(
            line.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: root.current,
                start: 'top 75%',
                end: 'bottom 60%',
                scrub: 0.6,
              },
            },
          );
          gsap.utils.toArray<HTMLElement>('[data-step]').forEach((el, i) => {
            gsap.from(el, {
              opacity: 0.25,
              y: 24,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
              delay: i * 0.06,
            });
          });
        }, root);
      },
    );

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={root}>
      <div className="nx-track-bar hidden md:block" aria-hidden>
        <div ref={line} className="nx-track-fill" style={{ transform: 'scaleX(0)' }} />
      </div>
      <ol className="mt-0 grid list-none gap-4 p-0 md:mt-8 md:grid-cols-3 md:gap-6">
        {STEPS.map((s) => (
          <li key={s.n} data-step className="nx-glass rounded-nx-24 p-6">
            <span className="nx-display nx-gtext text-3xl font-extrabold">{s.n}</span>
            <h3 className="nx-display mt-3 text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
