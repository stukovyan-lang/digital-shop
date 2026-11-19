'use client';

import Link from 'next/link';
import { Accordion } from '@/components/ui/Accordion';
import { allFaq } from '@/data/faq';

export function FaqTeaser() {
  return (
    <div>
      <Accordion items={allFaq.slice(0, 4)} />
      <Link
        href="/faq"
        className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-blue-t no-underline hover:text-[#b3ccff]"
      >
        Все вопросы <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
