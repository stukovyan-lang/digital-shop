import { PH } from './placeholders';

const tg = (username: string | undefined) =>
  username ? `https://t.me/${username.replace(/^@/, '')}` : '#';

/** Все URL, ники и ключи берутся из .env (см. .env.example). */
export const site = {
  name: PH.NAME,
  description: 'Цифровые товары с быстрой выдачей: Telegram, Steam, подписки и сервисы.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  supportUrl: tg(process.env.NEXT_PUBLIC_SUPPORT_USERNAME),
  botUrl: tg(process.env.NEXT_PUBLIC_BOT_USERNAME),
  channelUrl: tg(process.env.NEXT_PUBLIC_CHANNEL_USERNAME),
} as const;
