import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

type Common = { variant?: 'primary' | 'ghost'; size?: 'md' | 'sm' };

type AsButton = Common & ComponentProps<'button'> & { href?: undefined };
type AsLink = Common & Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

const cls = (variant: Common['variant'] = 'primary', size: Common['size'] = 'md') =>
  cn(variant === 'primary' ? 'nx-btn' : 'nx-btn-ghost', size === 'sm' && 'nx-btn-sm');

/** Настоящие <button>/<a>. Внешние ссылки (http…) открываются в новой вкладке. */
export function Button(props: AsButton | AsLink) {
  const { variant, size, className, ...rest } = props;
  const c = cn(cls(variant, size), className);

  if (typeof rest.href === 'string') {
    const { href, ...linkRest } = rest as Omit<AsLink, keyof Common>;
    const external = /^https?:\/\//.test(href);
    return external ? (
      <a
        href={href}
        className={c}
        target="_blank"
        rel="noopener noreferrer"
        {...(linkRest as ComponentProps<'a'>)}
      />
    ) : (
      <Link href={href} className={c} {...linkRest} />
    );
  }
  return <button type="button" className={c} {...(rest as ComponentProps<'button'>)} />;
}
