import { Catalog } from '@/components/home/Catalog';
import { FaqTeaser } from '@/components/home/FaqTeaser';
import { Hero } from '@/components/home/Hero';
import { Marquee } from '@/components/home/Marquee';
import { Stats } from '@/components/home/Stats';
import { Steps } from '@/components/home/Steps';
import { TelegramBlock } from '@/components/home/TelegramBlock';
import { Reveal } from '@/components/ui/Reveal';
import type { ReactNode } from 'react';

const wrap = 'mx-auto max-w-[1240px] px-4 sm:px-6';

function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section
      id={id}
      className={`${wrap} mt-20 scroll-mt-24 sm:mt-28`}
      aria-labelledby={`${id ?? title}-h`}
    >
      <Reveal>
        <h2 id={`${id ?? title}-h`} className="nx-display mb-8 text-2xl font-extrabold sm:text-4xl">
          {title}
        </h2>
        {children}
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <section
        id="catalog"
        className={`${wrap} mt-16 scroll-mt-24 sm:mt-24`}
        aria-labelledby="catalog-h"
      >
        <h2 id="catalog-h" className="nx-display mb-8 text-2xl font-extrabold sm:text-4xl">
          Каталог
        </h2>
        <Catalog />
      </section>
      <Section id="steps" title="Три шага">
        <Steps />
      </Section>
      <Section id="trust" title="Цифры и отзывы">
        <Stats />
      </Section>
      <Section id="faq" title="Частые вопросы">
        <FaqTeaser />
      </Section>
      <div className={`${wrap} mt-20 sm:mt-28`}>
        <Reveal>
          <TelegramBlock />
        </Reveal>
      </div>
    </>
  );
}
