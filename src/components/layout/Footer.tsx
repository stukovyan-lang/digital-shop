import Link from 'next/link';
import { PH } from '@/config/placeholders';
import { site } from '@/config/site';

const link =
  'text-muted flex min-h-11 items-center text-sm no-underline transition-colors hover:text-white';

export function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-[1240px] px-4 pb-10 sm:px-6">
      <div className="nx-glass flex flex-col gap-8 rounded-nx-24 p-6 sm:flex-row sm:justify-between sm:p-8">
        <div className="max-w-sm">
          <div className="nx-display text-lg font-bold">{site.name}</div>
          <p className="mt-2 text-sm text-muted">{site.description}</p>
        </div>
        <nav aria-label="Футер" className="flex flex-wrap gap-x-8 gap-y-1">
          <Link href="/#catalog" className={link}>
            Каталог
          </Link>
          <Link href="/faq" className={link}>
            FAQ
          </Link>
          <Link href="/offer" className={link}>
            Оферта
          </Link>
          <Link href="/privacy" className={link}>
            Конфиденциальность
          </Link>
          <a href={site.supportUrl} className={link} rel="noopener noreferrer" target="_blank">
            {PH.SUPPORT}
          </a>
        </nav>
      </div>
      <p className="mt-6 text-center text-xs text-muted">
        © {PH.NAME} · {PH.DOMAIN}
      </p>
    </footer>
  );
}
