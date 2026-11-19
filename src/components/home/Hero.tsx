import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { site } from '@/config/site';
import { HeroStage } from './HeroStage';

/**
 * Заголовок и CTA — обычный серверный HTML вне canvas (это LCP).
 * Правая часть — HeroStage (CSS-фолбэк; R3F-сцена подключится поверх на шаге 6).
 */
export function Hero() {
  return (
    <section className="relative overflow-clip">
      <div className="mx-auto grid max-w-[1240px] items-center gap-6 px-4 pt-10 pb-8 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:pt-16">
        <div className="relative z-10">
          <span className="nx-badge nx-badge-auto">
            <span className="nx-dot" aria-hidden />
            Автовыдача 24/7
          </span>
          <h1 className="nx-display mt-5 text-[clamp(2rem,5.2vw,3.6rem)] leading-[1.06] font-extrabold">
            Пополняй и подписывайся <GradientText>со скоростью света</GradientText>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted">
            Telegram Stars и Premium, Steam, подписки на AI-сервисы и музыку — с понятным статусом
            заказа на каждом шаге.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/#catalog">Открыть каталог</Button>
            <Button href={site.botUrl} variant="ghost">
              Telegram-бот
            </Button>
          </div>
        </div>
        <HeroStage />
      </div>
    </section>
  );
}
