import { CanvasTexture, SRGBColorSpace } from 'three';
import { brands } from '@/data/brands';

const family = (v: string, fallback: string) => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  return raw || fallback;
};

const initials = (n: string) =>
  n
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** Разбивка названия на строки по ширине (максимум 3 строки). */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

/**
 * Лицо карточки: плитка с инициалами (как .nx-logo), название и «от [ЦЕНА]».
 * Рисуем 2D-canvas'ом — шрифты Unbounded/Inter уже загружены страницей, сеть не нужна.
 */
export async function makeCardTexture(slug: string, name: string, priceText: string, glow: string) {
  const display = family('--font-unbounded', 'sans-serif');
  const sans = family('--font-inter', 'sans-serif');
  try {
    await Promise.all([
      document.fonts.load(`700 48px ${display}`),
      document.fonts.load(`500 28px ${sans}`),
    ]);
  } catch {
    /* шрифт не загрузился — нарисуем запасным */
  }

  const W = 512;
  const H = 696;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;

  // неоновая рамка по контуру карточки (её подхватывает Bloom)
  ctx.strokeStyle = glow;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(5, 5, W - 10, H - 10, 36);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';

  // плитка логотипа: знак бренда на светлой плитке или инициалы
  const brand = brands[slug];
  ctx.beginPath();
  ctx.roundRect(48, 52, 136, 136, 34);
  if (brand) {
    ctx.fillStyle = '#F4F2FF';
    ctx.fill();
    ctx.save();
    ctx.translate(48 + 68 - 41, 52 + 68 - 41);
    ctx.scale(82 / 24, 82 / 24);
    ctx.fillStyle = brand.color;
    ctx.fill(new Path2D(brand.path));
    ctx.restore();
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#fff';
    ctx.font = `700 54px ${display}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials(name), 116, 124);
  }
  ctx.fillStyle = '#fff';

  // название
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `700 46px ${display}`;
  const lines = wrap(ctx, name, W - 96);
  const lineH = 56;
  let y = H - 96 - (lines.length - 1) * lineH;
  for (const l of lines) {
    ctx.fillText(l, 48, y);
    y += lineH;
  }
  ctx.font = `500 32px ${sans}`;
  ctx.fillStyle = '#E4E0F5';
  ctx.fillText(priceText, 48, H - 48);

  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
