import { getProduct } from '@/data/products';
import type { CartItem } from '@/store/cart';
import type { Order, OrderStatus, OrdersApi, Quote } from '../types';
import { delay, read, write } from './storage';

type Stored = Omit<Order, 'status'>;
const KEY = 'shop-mock-orders';

/** Мок проходит по статусам за ~6 с — для демонстрации анимации таймлайна. */
const STEPS: [number, OrderStatus][] = [
  [6000, 'done'],
  [3000, 'delivering'],
  [1500, 'paid'],
  [0, 'created'],
];

const statusAt = (createdAt: number): OrderStatus => {
  const age = Date.now() - createdAt;
  return STEPS.find(([from]) => age >= from)![1];
};

const hydrate = (o: Stored): Order => ({ ...o, status: statusAt(o.createdAt) });

export const mockOrders: OrdersApi = {
  async quote(productSlug, optionId): Promise<Quote> {
    await delay(150);
    const option = getProduct(productSlug)?.options?.find((o) => o.id === optionId);
    return { price: option?.price ?? null, fee: null };
  },

  async createOrder(cart: CartItem[], contact: string) {
    await delay();
    const stored: Stored = {
      id: crypto.randomUUID().replace(/-/g, '').slice(0, 8),
      items: cart,
      contact,
      createdAt: Date.now(),
    };
    write(KEY, [stored, ...read<Stored[]>(KEY, [])]);
    return hydrate(stored);
  },

  async getOrder(id) {
    const found = read<Stored[]>(KEY, []).find((o) => o.id === id);
    return found ? hydrate(found) : null;
  },

  async listOrders() {
    return read<Stored[]>(KEY, []).map(hydrate);
  },
};
