import { CountUp } from '@/components/ui/CountUp';
import { Glass } from '@/components/ui/Glass';

// Показываем только реальные данные. Пока их нет — value: null → [N].
const STATS: { label: string; value: number | null }[] = [
  { label: 'выданных заказов', value: null },
  { label: 'довольных покупателей', value: null },
  { label: 'минут — среднее время выдачи', value: null },
];

export function Stats() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="grid gap-4 sm:grid-cols-3">
        {STATS.map((s) => (
          <Glass key={s.label} className="p-5">
            <div className="nx-display nx-gtext text-3xl font-extrabold">
              <CountUp value={s.value} />
            </div>
            <div className="mt-2 text-sm text-muted">{s.label}</div>
          </Glass>
        ))}
      </div>
      <Glass className="flex flex-col justify-center p-6">
        <div className="nx-display text-lg font-bold">Отзывы</div>
        <p className="mt-2 text-sm text-muted">
          Здесь появятся реальные отзывы покупателей после запуска. До этого мы ничего не
          придумываем.
        </p>
      </Glass>
    </div>
  );
}
