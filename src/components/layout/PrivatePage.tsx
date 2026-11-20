import { connection } from 'next/server';
import { Suspense, type ReactNode } from 'react';

async function Dynamic({ children }: { children: ReactNode }) {
  // Ждём запрос: страница рендерится на каждый запрос и не попадает в CDN-кеш
  // (иначе Cache-Control: s-maxage=31536000 при cacheComponents).
  await connection();
  return children;
}

/**
 * Обёртка для персональных страниц (/checkout, /account): делает их динамическими
 * явно, а не «потому что сейчас в HTML нет данных пользователя». На этапе 2 здесь
 * появятся куки/сессия — кеш между пользователями исключён по построению.
 */
export function PrivatePage({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1240px] px-4 pt-12 text-muted sm:px-6">Загрузка…</div>
      }
    >
      <Dynamic>{children}</Dynamic>
    </Suspense>
  );
}
