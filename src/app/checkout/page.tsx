import type { Metadata } from 'next';
import { CheckoutView } from '@/components/cart/CheckoutView';
import { PrivatePage } from '@/components/layout/PrivatePage';

export const metadata: Metadata = { title: 'Корзина', robots: { index: false } };

export default function CheckoutPage() {
  return (
    <PrivatePage>
      <CheckoutView />
    </PrivatePage>
  );
}
