import { LogoTile } from '@/components/ui/LogoTile';
import { products } from '@/data/products';

const items = products.map((p) => ({ slug: p.slug, name: p.name }));

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex gap-[18px]" aria-hidden={hidden || undefined}>
      {items.map((n) => (
        <div
          key={n.slug}
          className="nx-glass flex min-h-14 shrink-0 items-center gap-3 rounded-nx-18 py-2 pr-5 pl-2"
        >
          <LogoTile name={n.name} slug={n.slug} size={40} />
          <span className="text-sm font-semibold whitespace-nowrap">{n.name}</span>
        </div>
      ))}
    </div>
  );
}

/** Бегущая строка сервисов; на hover — пауза (CSS). Дубль ряда скрыт от скринридеров. */
export function Marquee() {
  return (
    <div className="nx-marquee py-4" aria-label="Сервисы">
      <div className="nx-track">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
