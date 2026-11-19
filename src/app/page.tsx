'use client';

import { useState } from 'react';
import { Accordion } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Chip, Option } from '@/components/ui/Chip';
import { GradientText } from '@/components/ui/GradientText';
import { Glass } from '@/components/ui/Glass';
import { Input } from '@/components/ui/Input';
import { LogoTile } from '@/components/ui/LogoTile';
import { NeonCard } from '@/components/ui/NeonCard';
import { PH } from '@/config/placeholders';
import { toast } from '@/store/ui';

/** ВРЕМЕННО: витрина UI-кита для проверки шага 2. Заменяется главной на шаге 4. */
export default function Home() {
  const [chip, setChip] = useState('all');
  const [opt, setOpt] = useState('a');
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6">
      <h1 className="nx-display text-4xl font-extrabold sm:text-5xl">
        Пополняй и подписывайся <GradientText>со скоростью света</GradientText>
      </h1>
      <p className="mt-4 max-w-xl text-muted">UI-кит · {PH.NAME}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button>Открыть каталог</Button>
        <Button variant="ghost">Telegram-бот</Button>
        <Button onClick={() => toast('Текст скопирован')}>Тост</Button>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {['all', 'telegram', 'games'].map((c) => (
          <Chip key={c} on={chip === c} onClick={() => setChip(c)}>
            {c}
          </Chip>
        ))}
      </div>

      <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
        {['a', 'b'].map((o) => (
          <Option key={o} on={opt === o} onClick={() => setOpt(o)}>
            {PH.PRICE}
          </Option>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <NeonCard className="p-6">
          <LogoTile name="Telegram Stars" />
          <div className="nx-display mt-4 text-lg font-bold">Telegram Stars</div>
          <Badge delivery="auto" className="mt-3" />
        </NeonCard>
        <NeonCard className="p-6">
          <LogoTile name="PS Plus" />
          <div className="nx-display mt-4 text-lg font-bold">PS Plus Турция</div>
          <Badge delivery="manual" className="mt-3" />
        </NeonCard>
        <NeonCard className="p-6">
          <LogoTile name="Steam Region" />
          <div className="nx-display mt-4 text-lg font-bold">Смена региона Steam</div>
          <Badge delivery="pending" className="mt-3" />
        </NeonCard>
      </div>

      <Glass className="mt-8 max-w-md p-6">
        <Input label="Логин Steam" placeholder="login" hint="Подсказка" />
      </Glass>

      <Accordion
        className="mt-8 max-w-2xl"
        items={[
          { id: '1', q: 'Вопрос 1', a: 'Ответ-заглушка.' },
          { id: '2', q: 'Вопрос 2', a: 'Ответ-заглушка.' },
        ]}
      />
    </div>
  );
}
