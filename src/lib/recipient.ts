import type { RecipientField } from '@/data/products';

type FieldDef = {
  label: string;
  placeholder: string;
  type: 'text' | 'email';
  autoComplete: string;
  hint?: string;
  validate: (v: string) => string | null;
};

/** Поля получателя: подписи, подсказки и проверка. Набор полей задаёт товар (recipientFields). */
export const FIELDS: Record<RecipientField, FieldDef> = {
  steamLogin: {
    label: 'Логин Steam',
    placeholder: 'login',
    type: 'text',
    autoComplete: 'off',
    hint: 'Логин для входа, не никнейм профиля.',
    validate: (v) => (/^[A-Za-z0-9_.-]{2,64}$/.test(v.trim()) ? null : 'Введите логин Steam'),
  },
  tgUsername: {
    label: 'Telegram username',
    placeholder: '@username',
    type: 'text',
    autoComplete: 'off',
    validate: (v) =>
      /^@?[A-Za-z0-9_]{5,32}$/.test(v.trim()) ? null : 'Введите username вида @username',
  },
  email: {
    label: 'Email получателя',
    placeholder: 'name@example.com',
    type: 'email',
    autoComplete: 'email',
    validate: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Введите корректный email',
  },
};
