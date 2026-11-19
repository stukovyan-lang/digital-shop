import type { Delivery } from '@/data/products';
import { cn } from '@/lib/cn';

const MAP = {
  auto: { cls: 'nx-badge-auto', label: 'Автовыдача' },
  manual: { cls: 'nx-badge-man', label: 'Через менеджера' },
  pending: { cls: 'nx-badge-wait', label: 'Выдача уточняется' },
} as const;

export function Badge({ delivery, className }: { delivery: Delivery; className?: string }) {
  const { cls, label } = MAP[delivery];
  return (
    <span className={cn('nx-badge', cls, className)}>
      <span className="nx-dot" aria-hidden />
      {label}
    </span>
  );
}
