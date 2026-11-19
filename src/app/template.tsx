import type { ReactNode } from 'react';

/**
 * Вход страницы на чистом CSS (.nx-enter) — Framer не попадает в первый JS.
 * Exit и shared layout (layoutId) добавим на странице товара, где они нужны.
 * template.tsx перемонтируется при каждой навигации → анимация играет заново.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="nx-enter">
      {children}
    </main>
  );
}
