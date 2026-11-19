'use client';

import { useUiStore } from '@/store/ui';

/** aria-live регион: скринридер озвучит тосты («Текст скопирован»). Без Framer — чистый CSS. */
export function Toaster() {
  const toasts = useUiStore((s) => s.toasts);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="nx-glass nx-toast rounded-nx-14 px-5 py-3 text-sm font-medium shadow-[0_10px_40px_-10px_rgba(255,46,136,0.5)]"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
