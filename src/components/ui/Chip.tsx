import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

type Props = ComponentProps<'button'> & { on?: boolean };

/** Переключатель-чип (фильтры). aria-pressed обязателен для a11y. */
export function Chip({ on = false, className, ...rest }: Props) {
  return (
    <button
      type="button"
      aria-pressed={on}
      className={cn('nx-chip', on && 'is-on', className)}
      {...rest}
    />
  );
}

/** Выбираемая опция (тариф, сумма, регион). */
export function Option({ on = false, className, ...rest }: Props) {
  return (
    <button
      type="button"
      aria-pressed={on}
      className={cn('nx-opt', on && 'is-on', className)}
      {...rest}
    />
  );
}
