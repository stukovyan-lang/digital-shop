'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';

export type AccordionItem = { id: string; q: string; a: string };

/** Один открытый пункт за раз. aria-expanded / aria-controls на кнопке. */
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const base = useId();
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {items.map((it) => {
        const isOpen = open === it.id;
        const panel = `${base}-${it.id}`;
        return (
          <div key={it.id} className="nx-glass rounded-nx-18">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panel}
              onClick={() => setOpen(isOpen ? null : it.id)}
              className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold"
            >
              <span>{it.q}</span>
              <span
                aria-hidden
                className="shrink-0 text-xl text-pink-t transition-transform duration-300"
                style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
              >
                +
              </span>
            </button>
            <div
              id={panel}
              role="region"
              hidden={!isOpen}
              className={cn('px-5 pb-5 text-muted', isOpen && 'nx-acc-body')}
            >
              {it.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
