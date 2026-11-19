'use client';

import { useEffect, useState, type ReactNode } from 'react';

// true после первого монтирования: все следующие экземпляры template — это клиентские переходы
let mounted = false;

/**
 * Вход страницы (SPEC п.6): fade + translateY 28px + blur — только при переходах между
 * страницами. На первой загрузке контент виден сразу: анимация с opacity:0 откладывала
 * LCP (в Lighthouse +2,5 с). Первый рендер и гидратация совпадают (оба без класса).
 */
export default function Template({ children }: { children: ReactNode }) {
  const [animate] = useState(() => mounted);
  useEffect(() => {
    mounted = true;
  }, []);
  return (
    <main id="main" className={animate ? 'nx-enter' : undefined}>
      {children}
    </main>
  );
}
