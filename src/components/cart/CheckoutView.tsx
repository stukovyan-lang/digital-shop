'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Glass } from '@/components/ui/Glass';
import { Input } from '@/components/ui/Input';
import { LogoTile } from '@/components/ui/LogoTile';
import { Option } from '@/components/ui/Chip';
import { PH } from '@/config/placeholders';
import { formatPrice } from '@/data/products';
import { ordersApi, paymentProvider, type PaymentMethod } from '@/lib/api';
import { describeItem, totalLabel } from '@/lib/order';
import { useCartReady, useCartStore } from '@/store/cart';

const METHODS: { id: PaymentMethod; title: string; note: string }[] = [
  { id: 'crypto', title: 'Криптовалюта', note: `Шлюз: ${PH.GATEWAY}` },
  { id: 'balance', title: 'Баланс на сайте', note: `Доступно: ${PH.N}` },
];

export function CheckoutView() {
  const router = useRouter();
  const ready = useCartReady();
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  const [contact, setContact] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('crypto');
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactError = contact.trim().length < 3 ? 'Укажите @username в Telegram или email' : null;

  const pay = async () => {
    setAttempted(true);
    if (contactError) {
      document.getElementById('contact')?.focus();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const order = await ordersApi.createOrder(items, contact.trim());
      const { redirectUrl } = await paymentProvider.createPayment(order.id, method);
      clear();
      router.push(redirectUrl);
    } catch {
      setError('Не удалось создать заказ. Попробуйте ещё раз.');
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1240px] px-4 pt-8 sm:px-6 lg:pt-12">
      <h1 className="nx-display text-3xl font-extrabold sm:text-4xl">Корзина</h1>

      {!ready ? (
        <div className="mt-8 h-40 animate-pulse rounded-nx-24 bg-white/5" aria-hidden />
      ) : items.length === 0 ? (
        <Glass className="mt-8 flex flex-col items-start gap-4 p-8">
          <p className="text-muted">В корзине пока ничего нет.</p>
          <Button href="/#catalog">Открыть каталог</Button>
        </Glass>
      ) : (
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="grid gap-6">
            <ul className="grid list-none gap-3 p-0">
              {items.map((item) => {
                const d = describeItem(item);
                return (
                  <li key={item.id} className="nx-glass flex items-center gap-4 rounded-nx-18 p-4">
                    <LogoTile name={d.name} slug={d.product?.slug} size={52} />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">{d.name}</div>
                      <div className="truncate text-sm text-muted">
                        {[d.option?.label, d.recipient].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                    <div className="font-semibold whitespace-nowrap">{formatPrice(d.price)}</div>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label={`Удалить: ${d.name}`}
                      className="grid size-11 shrink-0 place-items-center rounded-nx-12 text-muted transition-colors hover:text-white"
                    >
                      <span aria-hidden className="text-xl">
                        ✕
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <Glass className="p-6">
              <Input
                id="contact"
                label="Контакт для статуса заказа"
                placeholder="@username или email"
                autoComplete="off"
                hint="Сюда придёт статус заказа."
                value={contact}
                error={attempted ? (contactError ?? undefined) : undefined}
                onChange={(e) => setContact(e.target.value)}
              />
            </Glass>

            <fieldset>
              <legend className="mb-3 text-sm font-medium text-muted">Способ оплаты</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {METHODS.map((m) => (
                  <Option
                    key={m.id}
                    on={method === m.id}
                    onClick={() => setMethod(m.id)}
                    className="flex flex-col items-start px-5 py-4 text-left"
                  >
                    <span className="font-semibold">{m.title}</span>
                    <span className="text-xs text-muted">{m.note}</span>
                  </Option>
                ))}
              </div>
            </fieldset>
          </div>

          <aside
            aria-label="Итог"
            className="nx-glass rounded-nx-28 p-6 lg:sticky lg:top-28"
            style={{ boxShadow: '0 30px 80px -30px rgba(255,46,136,.55)' }}
          >
            <h2 className="nx-display text-lg font-bold">Итог</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Позиций</dt>
                <dd>{items.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Комиссия</dt>
                <dd>{PH.FEE}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-4">
                <dt className="text-muted">К оплате</dt>
                <dd className="nx-display text-2xl font-extrabold">{totalLabel(items)}</dd>
              </div>
            </dl>
            <Button onClick={pay} disabled={busy} className="mt-6 w-full">
              {busy ? 'Создаём заказ…' : 'Оплатить'}
            </Button>
            {error && (
              <p role="alert" className="mt-3 text-sm text-pink-t">
                {error}
              </p>
            )}
            <p className="mt-4 text-xs text-muted">
              Оплата демонстрационная: на первом этапе платёжный шлюз не подключён.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
