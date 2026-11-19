import { useId, type ComponentProps } from 'react';
import { cn } from '@/lib/cn';

type Props = ComponentProps<'input'> & { label?: string; hint?: string; error?: string };

export function Input({ label, hint, error, id, className, ...rest }: Props) {
  const auto = useId();
  const inputId = id ?? auto;
  const noteId = `${inputId}-note`;
  const note = error ?? hint;
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn('nx-input', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={note ? noteId : undefined}
        {...rest}
      />
      {note && (
        <p id={noteId} className={cn('text-xs', error ? 'text-pink-t' : 'text-muted')}>
          {note}
        </p>
      )}
    </div>
  );
}
