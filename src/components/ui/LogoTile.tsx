import { cn } from '@/lib/cn';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/**
 * Плитка логотипа. Пока в /public/brands/ нет официальных SVG — инициалы.
 * Свечение — только вокруг плитки, сам знак не трогаем (разд. 8 SPEC).
 */
export function LogoTile({
  name,
  size = 56,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
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
