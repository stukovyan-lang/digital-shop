import { PH } from '@/config/placeholders';

export type Delivery = 'auto' | 'manual' | 'pending';
export type Category = 'telegram' | 'games' | 'ai' | 'music';
export type RecipientField = 'steamLogin' | 'tgUsername' | 'email';

export type Product = {
  slug: string;
  name: string;
  category: Category;
  delivery: Delivery;
  logo: string; // '' → плитка с инициалами, пока нет официального SVG в /public/brands/
  description: string;
  recipientFields: RecipientField[];
  options?: { id: string; label: string; price: number | null }[]; // тарифы, сроки, суммы
  priceFrom: number | null; // null → «[ЦЕНА]»
};

export const categories: { id: Category; label: string }[] = [
  { id: 'telegram', label: 'Telegram' },
  { id: 'games', label: 'Игры' },
  { id: 'ai', label: 'AI-сервисы' },
  { id: 'music', label: 'Музыка' },
];

/**
 * Сценарий оформления. `pending` («выдача уточняется») пока рендерится как `manual`:
 * когда способ выдачи будет решён (вручную или плагин) — меняем только здесь.
 */
export type Flow = 'auto' | 'manual';
export const flowOf = (p: Pick<Product, 'delivery'>): Flow =>
  p.delivery === 'auto' ? 'auto' : 'manual';

/** Все цены — null до этапа 2 (цены придут из API). Числа не выдумываем. */
const slot = (id: string, label: string) => ({ id, label, price: null });

export const products: Product[] = [
  {
    slug: 'telegram-stars',
    name: 'Telegram Stars',
    category: 'telegram',
    delivery: 'auto',
    logo: '',
    description: 'Пополнение Telegram Stars на аккаунт получателя.',
    recipientFields: ['tgUsername'],
    options: [
      slot('pack-1', `${PH.N} звёзд`),
      slot('pack-2', `${PH.N} звёзд`),
      slot('pack-3', `${PH.N} звёзд`),
    ],
    priceFrom: null,
  },
  {
    slug: 'telegram-premium',
    name: 'Telegram Premium',
    category: 'telegram',
    delivery: 'auto',
    logo: '',
    description: 'Подписка Telegram Premium для аккаунта получателя.',
    recipientFields: ['tgUsername'],
    options: [slot('term-1', PH.TERM), slot('term-2', PH.TERM), slot('term-3', PH.TERM)],
    priceFrom: null,
  },
  {
    slug: 'steam-topup',
    name: 'Пополнение Steam',
    category: 'games',
    delivery: 'auto',
    logo: '',
    description: 'Пополнение кошелька Steam по логину.',
    recipientFields: ['steamLogin'],
    options: [slot('sum-1', PH.N), slot('sum-2', PH.N), slot('sum-3', PH.N)],
    priceFrom: null,
  },
  {
    slug: 'steam-region',
    name: 'Смена региона Steam',
    category: 'games',
    delivery: 'pending',
    logo: '',
    description: 'Смена региона аккаунта Steam. Способ выдачи уточняется.',
    recipientFields: ['steamLogin'],
    options: [slot('kz', 'Казахстан (KZ)'), slot('ua', 'Украина (UA)')],
    priceFrom: null,
  },
  {
    slug: 'chatgpt',
    name: 'ChatGPT Plus / Go',
    category: 'ai',
    delivery: 'auto',
    logo: '',
    description: 'Подписка ChatGPT на email получателя.',
    recipientFields: ['email'],
    options: [slot('plus', 'Plus'), slot('go', 'Go')],
    priceFrom: null,
  },
  {
    slug: 'google-ai',
    name: 'Google AI Plus / Gemini',
    category: 'ai',
    delivery: 'auto',
    logo: '',
    description: 'Подписка Google AI Plus / Gemini на аккаунт получателя.',
    recipientFields: ['email'],
    options: [slot('6m', '6 мес.')],
    priceFrom: null,
  },
  {
    slug: 'spotify',
    name: 'Spotify',
    category: 'music',
    delivery: 'auto',
    logo: '',
    description: 'Подписка Spotify Premium на аккаунт получателя.',
    recipientFields: ['email'],
    options: [slot('term-1', PH.TERM), slot('term-2', PH.TERM)],
    priceFrom: null,
  },
  {
    slug: 'ps-plus-turkey',
    name: 'PS Plus Турция',
    category: 'games',
    delivery: 'manual',
    logo: '',
    description: 'Подписка PlayStation Plus (турецкий регион). Оформляется через менеджера.',
    recipientFields: [],
    options: [slot('tier-1', PH.TERM), slot('tier-2', PH.TERM), slot('tier-3', PH.TERM)],
    priceFrom: null,
  },
  {
    slug: 'xbox',
    name: 'Xbox',
    category: 'games',
    delivery: 'manual',
    logo: '',
    description: 'Подписка и пополнение Xbox. Оформляется через менеджера.',
    recipientFields: [],
    options: [slot('term-1', PH.TERM), slot('term-2', PH.TERM)],
    priceFrom: null,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** Цена для показа: null → плейсхолдер [ЦЕНА]. */
export const formatPrice = (price: number | null) => (price === null ? PH.PRICE : String(price));
