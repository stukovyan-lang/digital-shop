# Магазин цифровых товаров («игровой неон»)

Полное ТЗ — `SPEC.md`, эталон стилей — `neon-theme.css` (перенесён в `src/styles/neon.css`).
Этап 1: весь интерфейс на мок-данных. Этап 2: реальные `OrdersApi`, `PaymentProvider`, `AuthProvider`.

## Запуск

```bash
npm install
npm run dev        # разработка
npm run build && npm start
npm run lint && npm run typecheck && npm run format:check
```

Переменные окружения — `.env.example` (ники, URL сайта, токен бота). Без них ссылки на Telegram ведут на `#`,
а `metadataBase` — на `http://localhost:3000`: перед деплоем задайте `NEXT_PUBLIC_SITE_URL`.

## Где что лежит

- `src/config/placeholders.ts` — все плейсхолдеры (`[ЦЕНА]`, `[СРОК]` …). Цены, ники, отзывы не выдумываем.
- `src/data/products.ts` — каталог. `delivery: 'pending'` пока ведёт себя как `manual` (`flowOf`).
- `src/lib/api/` — интерфейсы и моки; единственная точка подключения реализаций — `index.ts`.
- `src/components/three/` — R3F-сцена hero (грузится лениво поверх CSS-фолбэка).

## 3D: уровни качества

`high` (Bloom, transmission, DPR ≤ 1.75) → `medium` (без Bloom/transmission, DPR ≤ 1.25) → `low` (CSS-фолбэк).
Стартовый уровень зависит от `hardwareConcurrency`, `deviceMemory`, `saveData`, `prefers-reduced-motion` и наличия
аппаратного WebGL; дальше `PerformanceMonitor` может только понижать (понижение помним в сессии).
Параметры для проверки: `?q=high|medium|low` (уровень), `?nopre` (без прелоадера, для Lighthouse).
Вне экрана и на скрытой вкладке canvas переходит в `frameloop="demand"`.
