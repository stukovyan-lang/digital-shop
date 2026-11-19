import type { PaymentProvider } from '../types';
import { delay } from './storage';

/** Провайдер не выбран ([ШЛЮЗ]). Мок сразу «оплачивает» и ведёт на страницу статуса. */
export const mockPayment: PaymentProvider = {
  async createPayment(orderId) {
    await delay(400);
    return { redirectUrl: `/order/${orderId}` };
  },
};
