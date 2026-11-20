'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Glass } from '@/components/ui/Glass';
import { LogoTile } from '@/components/ui/LogoTile';
import { formatPrice } from '@/data/products';
import { ordersApi, type Order } from '@/lib/api';
import { cn } from '@/lib/cn';
import { describeItem, STATUS_STEPS, totalLabel } from '@/lib/order';
import { Confetti } from './Confetti';

const POLL_MS = 3000; // опрос статуса раз в 3 с (SPEC разд. 7)

const Check = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="m5 12.5 4.5 4.5L19 7.5"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const Spinner = () => (
  <svg className="nx-spin-ic" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export function OrderStatusView({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading');
  const [celebrate, setCelebrate] = useState(false);
  const prev = useRef<string | null>(null);

  const status = order?.status;
  const finished = status === 'done' || status === 'failed';

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const load = async () => {
      const o = await ordersApi.getOrder(id);
      if (cancelled) return;
      if (!o) return setState('missing');
      // конфетти — только когда статус меняется на «готово» у нас на глазах
      if (prev.current && prev.current !== 'done' && o.status === 'done') setCelebrate(true);
      prev.current = o.status;
      setOrder(o);
      setState('ready');
      if (o.status !== 'done' && o.status !== 'failed') timer = setTimeout(load, POLL_MS);
    };
    void load();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id]);

  const idx = status ? STATUS_STEPS.findIndex((s) => s.id === status) : 0;
  const progress = status === 'done' ? 1 : Math.max(idx, 0) / (STATUS_STEPS.length - 1);

  const title =
    status === 'done'
      ? 'Готово — товар у вас'
      : status === 'failed'
        ? 'Не удалось выдать заказ'
        : 'Заказ выдаётся…';

  return (
    <div className="mx-auto max-w-[880px] px-4 pt-8 sm:px-6 lg:pt-12">
      {celebrate && <Confetti />}

      {state === 'missing' ? (
        <Glass className="flex flex-col items-start gap-4 p-8">
          <h1 className="nx-display text-2xl font-extrabold">Заказ не найден</h1>
          <p className="text-muted">Возможно, он создан в другом браузере или ссылка устарела.</p>
          <Button href="/">На главную</Button>
        </Glass>
      ) : (
        <>
          <p className="text-sm text-muted">Заказ № {id}</p>
          {/* aria-live: скринридер озвучит смену статуса */}
          <div aria-live="polite" aria-atomic="true">
            <h1 className="nx-display mt-1 text-3xl font-extrabold sm:text-4xl">
              {state === 'loading' ? 'Загружаем заказ…' : title}
            </h1>
            <p className="sr-only">
              {status &&
                `Текущий статус: ${STATUS_STEPS.find((s) => s.id === status)?.label ?? status}`}
            </p>
          </div>

          <Glass className="mt-8 p-6 sm:p-8">
            <div
              className="nx-track-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              aria-label="Прогресс заказа"
            >
              <div className="nx-track-fill" style={{ '--p': progress } as React.CSSProperties} />
            </div>
            <ol className="mt-6 grid list-none grid-cols-4 gap-2 p-0">
              {STATUS_STEPS.map((s, i) => {
                const done = status === 'done' || i < idx;
                const now = !done && i === idx && state === 'ready';
                return (
                  <li key={s.id} className="flex flex-col items-center gap-3 text-center">
                    <span className={cn('nx-step-dot', done && 'is-done', now && 'is-now')}>
                      {done ? (
                        <span className="nx-pop">
                          <Check />
                        </span>
                      ) : now && s.id === 'delivering' ? (
                        <Spinner />
                      ) : (
                        <span className="text-sm font-semibold">{i + 1}</span>
                      )}
                    </span>
                    <span
                      className={cn(
                        'text-xs sm:text-sm',
                        done || now ? 'font-semibold text-ink' : 'text-muted',
                      )}
                    >
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </Glass>

          {order && (
            <Glass className="mt-6 p-6 sm:p-8">
              <h2 className="nx-display text-lg font-bold">Состав заказа</h2>
              <ul className="mt-4 grid list-none gap-3 p-0">
                {order.items.map((item) => {
                  const d = describeItem(item);
                  return (
                    <li key={item.id} className="flex items-center gap-4">
                      <LogoTile name={d.name} slug={d.product?.slug} size={44} />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold">{d.name}</div>
                        <div className="truncate text-sm text-muted">
                          {[d.option?.label, d.recipient].filter(Boolean).join(' · ')}
                        </div>
                      </div>
                      <div className="whitespace-nowrap">{formatPrice(d.price)}</div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-5 flex justify-between border-t border-line pt-4">
                <span className="text-muted">Итого</span>
                <span className="font-semibold">{totalLabel(order.items)}</span>
              </div>
              <p className="mt-3 text-sm text-muted">Контакт для статуса: {order.contact}</p>
            </Glass>
          )}

          {finished && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/account">Мои заказы</Button>
              <Button href="/#catalog" variant="ghost">
                В каталог
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
