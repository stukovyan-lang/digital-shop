import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export function GradientText({ className, ...rest }: ComponentProps<'span'>) {
  return <span className={cn('nx-gtext', className)} {...rest} />;
}
