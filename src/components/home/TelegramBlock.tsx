import { Button } from '@/components/ui/Button';
import { PH } from '@/config/placeholders';
import { site } from '@/config/site';

export function TelegramBlock() {
  return (
    <div
      className="nx-glass relative overflow-hidden rounded-nx-28 p-8 sm:p-12"
      style={{ boxShadow: '0 30px 80px -40px rgba(255,46,136,.6)' }}
    >
      <div
        className="nx-orb"
        aria-hidden
        style={{ width: 320, height: 320, right: -80, top: -120, background: 'var(--nx-blue)' }}
      />
      <div className="relative max-w-xl">
        <h2 className="nx-display text-2xl font-extrabold sm:text-3xl">
          Заказывайте и следите за статусом в <span className="nx-gtext">Telegram</span>
        </h2>
        <p className="mt-3 text-muted">
          Бот {PH.BOT} и канал {PH.CHANNEL}: новости, статусы заказов и поддержка.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={site.botUrl}>Открыть бота</Button>
          <Button href={site.channelUrl} variant="ghost">
            Канал
          </Button>
        </div>
      </div>
    </div>
  );
}
