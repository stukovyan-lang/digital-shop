import type { Metadata } from 'next';
import { FaqView } from '@/components/legal/FaqView';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Частые вопросы о заказе, оплате и выдаче.',
  alternates: { canonical: '/faq' },
  openGraph: { title: 'FAQ' },
};

export default function FaqPage() {
  return <FaqView />;
}
