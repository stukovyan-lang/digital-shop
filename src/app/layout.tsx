import type { Metadata, Viewport } from 'next';
import { Inter, Unbounded } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { MotionProvider } from '@/components/layout/MotionProvider';
import { Preloader, preloaderScript } from '@/components/layout/Preloader';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { StoreHydrator } from '@/components/layout/StoreHydrator';
import { Toaster } from '@/components/ui/Toaster';
import { site } from '@/config/site';
import './globals.css';

const unbounded = Unbounded({
  variable: '--font-unbounded',
  subsets: ['cyrillic', 'latin'],
  weight: ['500', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, locale: 'ru_RU', type: 'website' },
};

export const viewport: Viewport = {
  themeColor: '#07060D',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
      </head>
      <body>
        <div className="nx-bg" aria-hidden />
        <a
          href="#main"
          className="fixed top-2 left-2 z-[70] -translate-y-20 rounded-lg bg-bg px-4 py-3 text-ink focus:translate-y-0"
        >
          К содержимому
        </a>
        <MotionProvider>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </MotionProvider>
        <StoreHydrator />
        <SmoothScroll />
        <Preloader />
      </body>
    </html>
  );
}
