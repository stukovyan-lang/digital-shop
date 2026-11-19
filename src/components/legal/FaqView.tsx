'use client';

import { useMemo, useState } from 'react';
import { Accordion } from '@/components/ui/Accordion';
import { Input } from '@/components/ui/Input';
import { faqSections } from '@/data/faq';

export function FaqView() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const sections = useMemo(
    () =>
      faqSections
        .map((s) => ({
          ...s,
          items: s.items.filter(
            (i) => !q || i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q),
          ),
        }))
        .filter((s) => s.items.length > 0),
    [q],
  );

  return (
    <div className="mx-auto max-w-[880px] px-4 pt-8 sm:px-6 lg:pt-12">
      <h1 className="nx-display text-3xl font-extrabold sm:text-4xl">Частые вопросы</h1>
      <div className="mt-6">
        <Input
          type="search"
          label="Поиск по вопросам"
          placeholder="Например: оплата"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div aria-live="polite" className="mt-8 grid gap-10">
        {sections.length === 0 ? (
          <p className="text-muted">Ничего не найдено. Попробуйте другой запрос.</p>
        ) : (
          sections.map((s) => (
            <section key={s.id} aria-labelledby={`faq-${s.id}`}>
              <h2 id={`faq-${s.id}`} className="nx-display mb-4 text-xl font-bold">
                {s.title}
              </h2>
              <Accordion items={s.items} />
            </section>
          ))
        )}
      </div>
    </div>
  );
}
