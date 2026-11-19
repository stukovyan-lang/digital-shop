/**
 * Единственная точка подключения реализаций. Этап 2: заменить моки на реальные
 * OrdersApi / PaymentProvider / AuthProvider — остальной код не меняется.
 */
import type { AuthProvider, OrdersApi, PaymentProvider } from './types';
import { mockAuth } from './mock/auth';
import { mockOrders } from './mock/orders';
import { mockPayment } from './mock/payment';

export const ordersApi: OrdersApi = mockOrders;
export const paymentProvider: PaymentProvider = mockPayment;
export const authProvider: AuthProvider = mockAuth;

export * from './types';
