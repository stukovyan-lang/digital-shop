import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[880px] px-4 pt-16 sm:px-6">
      <p className="nx-display nx-gtext text-6xl font-extrabold">404</p>
      <h1 className="nx-display mt-4 text-2xl font-extrabold">Страница не найдена</h1>
      <p className="mt-2 text-muted">Возможно, ссылка устарела или товар убран из каталога.</p>
      <Button href="/" className="mt-6">
        На главную
      </Button>
    </div>
  );
}
