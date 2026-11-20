import { brands } from '@/data/brands';
import { cn } from '@/lib/cn';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/**
 * Плитка логотипа. Если для slug есть знак в `brands` — рисуем его в фирменном цвете
 * на светлой плитке (знак не перекрашиваем и не обрабатываем, свечение — только вокруг плитки).
 * Иначе — инициалы.
 */
export function LogoTile({
  name,
  slug,
  size = 56,
  className,
}: {
  name: string;
  slug?: string;
  size?: number;
  className?: string;
}) {
  const brand = slug ? brands[slug] : undefined;
  if (brand) {
    return (
      <div
        className={cn('nx-logo nx-logo-brand shrink-0', className)}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill={brand.color}>
          <path d={brand.path} />
        </svg>
      </div>
    );
  }
  return (
    <div
      className={cn('nx-logo shrink-0', className)}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
