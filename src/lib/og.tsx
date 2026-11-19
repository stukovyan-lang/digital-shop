import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { site } from '@/config/site';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

// Путь от корня проекта; для деплоя файлы включены в трассировку (next.config.ts)
const load = async (name: string) => {
  const buf = await readFile(path.join(process.cwd(), 'src/assets/fonts', name));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
};

/**
 * Единый рендер OG-картинки в стиле сайта. Шрифты — локальные woff (Unbounded 800,
 * Inter 500; кириллица + латиница), сеть при сборке не нужна.
 */
export async function renderOg({ title, subtitle }: { title: string; subtitle?: string }) {
  const [dCyr, dLat, iCyr, iLat] = await Promise.all([
    load('unbounded-cyrillic-800-normal.woff'),
    load('unbounded-latin-800-normal.woff'),
    load('inter-cyrillic-500-normal.woff'),
    load('inter-latin-500-normal.woff'),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        color: '#F4F2FF',
        background:
          'radial-gradient(700px 500px at 90% -10%, rgba(59,130,246,0.35), transparent 60%), radial-gradient(700px 500px at 0% 10%, rgba(255,46,136,0.32), transparent 60%), #07060D',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: 'linear-gradient(100deg, #E0106F, #2563EB)',
          }}
        />
        <div style={{ fontFamily: 'Unbounded, UnboundedLat', fontSize: 32, fontWeight: 800 }}>
          {site.name}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            fontFamily: 'Unbounded, UnboundedLat',
            fontWeight: 800,
            fontSize: title.length > 28 ? 64 : 84,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontFamily: 'Inter, InterLat',
              fontSize: 34,
              color: '#A8A3C2',
              fontWeight: 500,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: 'Unbounded', data: dCyr, weight: 800, style: 'normal' },
        { name: 'UnboundedLat', data: dLat, weight: 800, style: 'normal' },
        { name: 'Inter', data: iCyr, weight: 500, style: 'normal' },
        { name: 'InterLat', data: iLat, weight: 500, style: 'normal' },
      ],
    },
  );
}
