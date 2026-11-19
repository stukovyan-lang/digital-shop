import type { AuthProvider, AuthUser } from '../types';
import { delay, read, write } from './storage';

const KEY = 'shop-mock-user';

/** Мок-пользователь: без выдуманных ников и цифр (username/balance = null → плейсхолдеры). */
const MOCK_USER: AuthUser = { id: 'mock', firstName: 'Гость', username: null, balance: null };

export const mockAuth: AuthProvider = {
  async getUser() {
    return read<AuthUser | null>(KEY, null);
  },
  async signIn() {
    await delay(300);
    write(KEY, MOCK_USER);
    return MOCK_USER;
  },
  async signOut() {
    write(KEY, null);
  },
};
