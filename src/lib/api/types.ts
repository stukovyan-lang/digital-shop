import type { CartItem } from '@/store/cart';

export type OrderStatus = 'created' | 'paid' | 'delivering' | 'done' | 'failed';
export type PaymentMethod = 'crypto' | 'balance';

export type Quote = {
  /** null → цена ещё не известна, UI показывает [ЦЕНА] */
  price: number | null;
  fee: number | null;
};

export type Order = {
  id: string;
  status: OrderStatus;
  items: CartItem[];
  contact: string;
  createdAt: number;
};

export type AuthUser = {
  id: string;
  firstName: string;
  username: string | null;
  /** null → баланс ещё не известен, UI показывает [N] */
  balance: number | null;
};

export interface OrdersApi {
  quote(productSlug: string, optionId?: string, amount?: number): Promise<Quote>;
  createOrder(cart: CartItem[], contact: string): Promise<Order>;
  /** Статус опрашивается раз в 3 с */
  getOrder(id: string): Promise<Order | null>;
  listOrders(): Promise<Order[]>;
}

export interface PaymentProvider {
  /** Возвращает URL, на который нужно перенаправить покупателя */
  createPayment(orderId: string, method: PaymentMethod): Promise<{ redirectUrl: string }>;
}

export interface AuthProvider {
  getUser(): Promise<AuthUser | null>;
  /** Данные из Telegram Login Widget; подпись проверяет сервер (/api/auth/telegram) */
  signIn(payload?: Record<string, string>): Promise<AuthUser>;
  signOut(): Promise<void>;
}
