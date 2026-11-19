import { site } from '@/config/site';
import { ogContentType, ogSize, renderOg } from '@/lib/og';

export const alt = site.name;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    title: 'Цифровые товары со скоростью света',
    subtitle: 'Telegram, Steam, AI-сервисы и музыка',
  });
}
