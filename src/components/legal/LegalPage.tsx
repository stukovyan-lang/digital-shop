import type { ReactNode } from 'react';
import { PH } from '@/config/placeholders';

/** Текстовая заглушка юридических страниц. Реальный текст — на этапе 2. */
export function LegalPage({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-[880px] px-4 pt-8 sm:px-6 lg:pt-12">
      <h1 className="nx-display text-3xl font-extrabold sm:text-4xl">{title}</h1>
      <div className="nx-glass mt-8 rounded-nx-24 p-6 sm:p-8">
        {children ?? (
          <p className="text-muted">
            Здесь будет текст документа. Условия: {PH.TERMS}. Сайт: {PH.DOMAIN}.
          </p>
        )}
      </div>
    </div>
  );
}
