import type { Metadata } from 'next';
import { Suspense } from 'react';
import { OrderStatusView } from '@/components/order/OrderStatusView';

export const metadata: Metadata = { title: 'Статус заказа', robots: { index: false } };

async function Content({ params }: { params: PageProps<'/order/[id]'>['params'] }) {
  const { id } = await params;
  return <OrderStatusView id={id} />;
}

export default function OrderPage({ params }: PageProps<'/order/[id]'>) {
  return (
    <Suspense
      fallback={<div className="mx-auto max-w-[880px] px-4 pt-12 text-muted">Загрузка…</div>}
    >
      <Content params={params} />
    </Suspense>
  );
}
