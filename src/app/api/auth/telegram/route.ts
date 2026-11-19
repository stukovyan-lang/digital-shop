import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

/**
 * Проверка подписи Telegram Login Widget — только на сервере.
 * https://core.telegram.org/widgets/login#checking-authorization
 * Без TELEGRAM_BOT_TOKEN отвечает 501 (на этапе 1 клиент использует мок-пользователя).
 */
export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return Response.json({ ok: false, error: 'not_configured' }, { status: 501 });

  let data: Record<string, string>;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  const { hash, ...rest } = data;
  if (typeof hash !== 'string') {
    return Response.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  const checkString = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join('\n');
  const secret = createHash('sha256').update(token).digest();
  const expected = createHmac('sha256', secret).update(checkString).digest('hex');

  const a = Buffer.from(expected);
  const b = Buffer.from(hash);
  const valid = a.length === b.length && timingSafeEqual(a, b);
  const fresh = Date.now() / 1000 - Number(rest.auth_date) < 86400;

  if (!valid || !fresh) return Response.json({ ok: false, error: 'invalid' }, { status: 401 });
  return Response.json({
    ok: true,
    user: { id: rest.id, firstName: rest.first_name, username: rest.username ?? null },
  });
}
