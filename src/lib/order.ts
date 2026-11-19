import { PH } from '@/config/placeholders';
import { formatPrice, getProduct } from '@/data/products';
import type { CartItem } from '@/store/cart';
import type { OrderStatus } from '@/lib/api';

export const describeItem = (item: CartItem) => {
  const product = getProduct(item.slug);
  const option = product?.options?.find((o) => o.id === item.optionId);
  return {
    product,
    option,
    name: product?.name ?? item.slug,
    price: option?.price ?? null,
    recipient: Object.values(item.recipient).filter(Boolean).join(', '),
  };
};

/** Сумма: если цена хотя бы одной позиции неизвестна — показываем плейсхолдер. */
export const totalLabel = (items: CartItem[]) => {
  const prices = items.map((i) => describeItem(i).price);
  if (prices.length === 0 || prices.some((p) => p === null)) return PH.PRICE;
  return formatPrice((prices as number[]).reduce((a, b) => a + b, 0));
};

export const STATUS_STEPS: { id: OrderStatus; label: string }[] = [
  { id: 'created', label: 'Создан' },
  { id: 'paid', label: 'Оплачен' },
  { id: 'delivering', label: 'Выдаётся' },
  { id: 'done', label: 'Готово' },
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  created: 'Создан',
  paid: 'Оплачен',
  delivering: 'Выдаётся',
  done: 'Готово',
  failed: 'Ошибка',
};
