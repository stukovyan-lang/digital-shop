import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export function Glass({ className, ...rest }: ComponentProps<'div'>) {
  return <div className={cn('nx-glass rounded-nx-24', className)} {...rest} />;
}
