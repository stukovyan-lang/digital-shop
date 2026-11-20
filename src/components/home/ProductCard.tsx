import Link from 'next/link';
import { ViewTransition } from 'react';
import { Badge } from '@/components/ui/Badge';
import { LogoTile } from '@/components/ui/LogoTile';
import { NeonCard } from '@/components/ui/NeonCard';
import { formatPrice, type Product } from '@/data/products';

/** Вся карточка кликабельна через «растянутую» ссылку на названии. */
export function ProductCard({ product: p }: { product: Product }) {
  return (
    <NeonCard className="h-full">
      <div className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <ViewTransition name={`logo-${p.slug}`} share="morph" default="none">
            <LogoTile name={p.name} slug={p.slug} />
          </ViewTransition>
          <Badge delivery={p.delivery} />
        </div>
        <div>
          <h3 className="nx-display text-lg leading-tight font-bold">
            <ViewTransition name={`title-${p.slug}`} share="morph" default="none">
              <Link
                href={`/product/${p.slug}`}
                className="text-ink no-underline after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] hover:text-white"
              >
                {p.name}
              </Link>
            </ViewTransition>
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted">{p.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm text-muted">
            от <span className="font-semibold text-ink">{formatPrice(p.priceFrom)}</span>
          </span>
          <span aria-hidden className="text-xl text-pink-t">
            →
          </span>
        </div>
      </div>
    </NeonCard>
  );
}
