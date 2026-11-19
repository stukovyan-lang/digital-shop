import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Публичная оферта',
  alternates: { canonical: '/offer' },
  openGraph: { title: 'Публичная оферта' },
};

export default function OfferPage() {
  return <LegalPage title="Публичная оферта" />;
}
