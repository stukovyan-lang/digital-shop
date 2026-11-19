'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { site } from '@/config/site';
import { useCartCount } from '@/store/cart';

export function Header() {
  const count = useCartCount();
  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6">
      <div className="nx-glass mx-auto flex max-w-[1240px] items-center justify-between gap-3 rounded-nx-18 px-3 py-2 sm:px-4">
        <Link
          href="/"
          aria-label={`${site.name} — на главную`}
          className="flex min-h-11 items-center gap-3 text-[var(--nx-text)] no-underline hover:text-white"
        >
          <span
            aria-hidden
            className="block h-9 w-9 shrink-0 rounded-nx-12"
            style={{
              background: 'var(--nx-grad)',
              boxShadow: '0 0 24px -4px rgba(255,46,136,.7)',
            }}
          />
          <span className="nx-display text-[15px] font-bold max-[760px]:hidden">{site.name}</span>
        </Link>

        <nav aria-label="Основная" className="flex items-center gap-1 max-[760px]:hidden">
          {[
            { href: '/#catalog', label: 'Каталог' },
            { href: '/faq', label: 'FAQ' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex min-h-11 items-center rounded-nx-12 px-4 text-sm font-medium text-muted no-underline transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 whitespace-nowrap">
          <Button href="/account" variant="ghost" size="sm">
            Кабинет
          </Button>
          <Button
            href="/checkout"
            size="sm"
            data-cart-target
            aria-label={`Корзина, товаров: ${count}`}
          >
            Корзина · {count}
          </Button>
        </div>
      </div>
    </header>
  );
}
