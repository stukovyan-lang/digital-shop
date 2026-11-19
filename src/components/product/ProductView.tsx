'use client';

import { ViewTransition, useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Glass } from '@/components/ui/Glass';
import { Input } from '@/components/ui/Input';
import { LogoTile } from '@/components/ui/LogoTile';
import { Option } from '@/components/ui/Chip';
import { PH } from '@/config/placeholders';
import { site } from '@/config/site';
import { flowOf, formatPrice, type Product } from '@/data/products';
import { ordersApi, type Quote } from '@/lib/api';
import { flyToCart } from '@/lib/fly';
import { FIELDS } from '@/lib/recipient';
import { useCartStore } from '@/store/cart';
import { toast } from '@/store/ui';

const initials = (n: string) =>
  n
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export function ProductView({ product }: { product: Product }) {
  const flow = flowOf(product);
  const options = product.options ?? [];
  const add = useCartStore((s) => s.add);

  const [optionId, setOptionId] = useState(options[0]?.id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [attempted, setAttempted] = useState(false);
  const [added, setAdded] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    let cancelled = false;
    void ordersApi.quote(product.slug, optionId).then((q) => {
      if (!cancelled) setQuote(q);
    });
    return () => {
      cancelled = true;
    };
  }, [product.slug, optionId]);

  const option = options.find((o) => o.id === optionId);
  const price = formatPrice(quote?.price ?? option?.price ?? null);
  const errors = Object.fromEntries(
    product.recipientFields.map((f) => [f, FIELDS[f].validate(values[f] ?? '')]),
  );
  const firstInvalid = product.recipientFields.find((f) => errors[f]);

  const onAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (firstInvalid) {
      setAttempted(true);
      document.getElementById(`f-${firstInvalid}`)?.focus();
      return;
    }
    add({ slug: product.slug, optionId, recipient: values });
    flyToCart(e.currentTarget, initials(product.name));
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  };

  // Текст для менеджера (сценарий manual, в том числе pending)
  const message = [
    `Здравствуйте! Хочу заказать: ${product.name}${option ? ` — ${option.label}` : ''}.`,
    ...product.recipientFields.map(
      (f) => `${FIELDS[f].label}: ${values[f]?.trim() || `[${FIELDS[f].label.toLowerCase()}]`}`,
    ),
    `Цена: ${price}`,
  ].join('\n');

  const onManager = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast('Текст скопирован');
    } catch {
      toast('Не удалось скопировать — выделите текст вручную');
    }
  };

  const facts = [
    ['Срок выдачи', PH.TERM],
    ['Комиссия', PH.FEE],
    ['Условия', PH.TERMS],
    ['Валюты / регионы', PH.CURRENCIES],
  ];

  return (
    <div className="mx-auto max-w-[1240px] px-4 pt-8 pb-4 sm:px-6 lg:pt-12">
      <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        {/* Слева: карточка товара и «Что нужно знать» */}
        <div className="flex flex-col gap-6">
          <Glass className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-5">
              <ViewTransition name={`logo-${product.slug}`} share="morph" default="none">
                <LogoTile name={product.name} size={88} />
              </ViewTransition>
              <div className="min-w-0">
                <Badge delivery={product.delivery} />
                <ViewTransition name={`title-${product.slug}`} share="morph" default="none">
                  <h1 className="nx-display mt-3 text-[clamp(1.6rem,3.6vw,2.6rem)] leading-tight font-extrabold">
                    {product.name}
                  </h1>
                </ViewTransition>
              </div>
            </div>
            <p className="mt-5 text-muted">{product.description}</p>
          </Glass>

          <Glass className="p-6 sm:p-8">
            <h2 className="nx-display text-lg font-bold">Что нужно знать</h2>
            <dl className="mt-4 grid gap-3">
              {facts.map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0"
                >
                  <dt className="text-sm text-muted">{k}</dt>
                  <dd className="text-right text-sm font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-muted">
              {flow === 'auto'
                ? 'Проверьте данные получателя перед оплатой.'
                : 'Заказ оформляется в чате с менеджером в Telegram.'}
            </p>
          </Glass>
        </div>

        {/* Справа: панель оформления (sticky на десктопе) */}
        <aside
          aria-label="Оформление"
          className="nx-glass rounded-nx-28 p-6 sm:p-8 lg:sticky lg:top-28"
          style={{ boxShadow: '0 30px 80px -30px rgba(255,46,136,.55)' }}
        >
          <h2 className="nx-display text-xl font-bold">
            {flow === 'auto' ? 'Оформление' : 'Заказ через менеджера'}
          </h2>

          {product.recipientFields.length > 0 && (
            <div className="mt-5 grid gap-4">
              {product.recipientFields.map((f) => (
                <Input
                  key={f}
                  id={`f-${f}`}
                  label={FIELDS[f].label}
                  type={FIELDS[f].type}
                  placeholder={FIELDS[f].placeholder}
                  autoComplete={FIELDS[f].autoComplete}
                  hint={FIELDS[f].hint}
                  value={values[f] ?? ''}
                  error={flow === 'auto' && attempted ? (errors[f] ?? undefined) : undefined}
                  onChange={(e) => setValues((v) => ({ ...v, [f]: e.target.value }))}
                />
              ))}
            </div>
          )}

          {options.length > 0 && (
            <fieldset className="mt-6">
              <legend className="mb-3 text-sm font-medium text-muted">
                {product.slug === 'steam-region' ? 'Регион' : 'Тариф'}
              </legend>
              <div className="grid grid-cols-2 gap-3">
                {options.map((o) => (
                  <Option
                    key={o.id}
                    on={o.id === optionId}
                    onClick={() => setOptionId(o.id)}
                    className="flex flex-col items-center justify-center px-3 py-2"
                  >
                    <span>{o.label}</span>
                    <span className="text-xs text-muted">{formatPrice(o.price)}</span>
                  </Option>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-6 flex items-baseline justify-between border-t border-line pt-5">
            <span className="text-muted">Цена</span>
            <span className="nx-display text-2xl font-extrabold">{price}</span>
          </div>

          {flow === 'auto' ? (
            <div className="mt-5 grid gap-3">
              <Button onClick={onAdd} className="w-full" aria-live="polite">
                {added ? 'Добавлено ✓' : 'В корзину'}
              </Button>
              {added && (
                <Button href="/checkout" variant="ghost" className="w-full">
                  Перейти в корзину
                </Button>
              )}
            </div>
          ) : (
            <div className="mt-5 grid gap-3">
              <div>
                <div className="mb-2 text-sm font-medium text-muted">Сообщение менеджеру</div>
                <pre className="rounded-nx-14 border border-line bg-black/35 p-4 font-sans text-sm leading-relaxed whitespace-pre-wrap">
                  {message}
                </pre>
              </div>
              <Button href={site.supportUrl} onClick={onManager} className="w-full">
                Написать менеджеру
              </Button>
              <p className="text-center text-xs text-muted">
                Текст копируется автоматически — вставьте его в чат {PH.SUPPORT}.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
