'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Glass } from '@/components/ui/Glass';
import { PH } from '@/config/placeholders';
import { authProvider, ordersApi, type AuthUser, type Order } from '@/lib/api';
import { describeItem, STATUS_LABEL, totalLabel } from '@/lib/order';

type Load = { user: AuthUser | null; orders: Order[] } | null;

export function AccountView() {
  const [data, setData] = useState<Load>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([authProvider.getUser(), ordersApi.listOrders()]).then(([user, orders]) => {
      if (!cancelled) setData({ user, orders });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = async () => {
    setBusy(true);
    const user = await authProvider.signIn();
    setData((d) => ({ user, orders: d?.orders ?? [] }));
    setBusy(false);
  };
  const signOut = async () => {
    await authProvider.signOut();
    setData((d) => ({ user: null, orders: d?.orders ?? [] }));
  };

  return (
    <div className="mx-auto max-w-[1240px] px-4 pt-8 sm:px-6 lg:pt-12">
      <h1 className="nx-display text-3xl font-extrabold sm:text-4xl">Кабинет</h1>

      {!data ? (
        <div className="mt-8 h-40 animate-pulse rounded-nx-24 bg-white/5" aria-hidden />
      ) : !data.user ? (
        <Glass className="mt-8 flex max-w-xl flex-col items-start gap-4 p-8">
          <h2 className="nx-display text-xl font-bold">Вход через Telegram</h2>
          <p className="text-muted">
            Войдите, чтобы видеть баланс и историю заказов. На первом этапе вход демонстрационный
            (Telegram Login Widget подключим на втором).
          </p>
          <Button onClick={signIn} disabled={busy}>
            {busy ? 'Входим…' : 'Войти через Telegram'}
          </Button>
        </Glass>
      ) : (
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Glass className="p-6 sm:p-8">
            <div className="text-sm text-muted">Вы вошли как</div>
            <div className="nx-display mt-1 text-xl font-bold">{data.user.firstName}</div>
            <div className="text-sm text-muted">{data.user.username ?? `@[ник]`}</div>
            <div className="mt-6 border-t border-line pt-5">
              <div className="text-sm text-muted">Баланс</div>
              <div className="nx-display nx-gtext text-3xl font-extrabold">
                {data.user.balance ?? PH.N}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut} className="mt-6">
              Выйти
            </Button>
          </Glass>

          <Glass className="p-6 sm:p-8">
            <h2 className="nx-display text-lg font-bold">История заказов</h2>
            {data.orders.length === 0 ? (
              <p className="mt-4 text-muted">Заказов пока нет.</p>
            ) : (
              <ul className="mt-4 grid list-none gap-3 p-0">
                {data.orders.map((o) => (
                  <li key={o.id}>
                    <Link
                      href={`/order/${o.id}`}
                      className="flex min-h-14 items-center justify-between gap-4 rounded-nx-14 border border-line bg-white/[0.03] px-4 py-3 text-ink no-underline transition-colors hover:border-white/30 hover:text-white"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">
                          {o.items.map((i) => describeItem(i).name).join(', ')}
                        </span>
                        <span className="text-xs text-muted">
                          № {o.id} · {new Date(o.createdAt).toLocaleString('ru-RU')}
                        </span>
                      </span>
                      <span className="text-right whitespace-nowrap">
                        <span className="nx-badge nx-badge-wait">{STATUS_LABEL[o.status]}</span>
                        <span className="mt-1 block text-xs text-muted">{totalLabel(o.items)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Glass>
        </div>
      )}
    </div>
  );
}
