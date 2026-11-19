export type Quality = 'high' | 'medium' | 'low';

const ORDER: Quality[] = ['low', 'medium', 'high'];
const KEY = 'nx-quality';

const isQuality = (v: unknown): v is Quality =>
  typeof v === 'string' && ORDER.includes(v as Quality);
const min = (a: Quality, b: Quality) => ORDER[Math.min(ORDER.indexOf(a), ORDER.indexOf(b))];

/** Следующий уровень вниз (high → medium → low). */
export const lower = (q: Quality): Quality => (q === 'high' ? 'medium' : 'low');

export const rememberQuality = (q: Quality) => {
  try {
    sessionStorage.setItem(KEY, q);
  } catch {
    /* ignore */
  }
};

/**
 * Программный WebGL (SwiftShader, llvmpipe) или его отсутствие = слабое устройство:
 * failIfMajorPerformanceCaveat возвращает null, если рендер идёт не на GPU.
 */
function noHardwareGl(): boolean {
  try {
    const c = document.createElement('canvas');
    const opts = { failIfMajorPerformanceCaveat: true };
    const gl = c.getContext('webgl2', opts) ?? c.getContext('webgl', opts);
    if (!gl) return true;
    (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
    return false;
  } catch {
    return true;
  }
}

/**
 * Стартовый уровень качества 3D (SPEC разд. 6):
 *  low    — нет смысла грузить 3D: reduced-motion, экономия трафика, ≤2 ядер или ≤2 ГБ памяти,
 *           нет аппаратного WebGL → CSS-фолбэк
 *  medium — без transmission и Bloom, DPR до 1.25: ≤4 ядер или ≤4 ГБ, либо тач-устройство без запаса
 *  high   — Bloom, transmission, DPR до 1.75
 * Дальше уровень может только понижаться (PerformanceMonitor), понижение помним в сессии.
 * ?q=low|medium|high — ручное переопределение для проверки.
 */
export function detectQuality(): Quality {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  const forced = new URLSearchParams(location.search).get('q');
  if (isQuality(forced)) return forced;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'low';

  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory; // только Chromium; в Safari/Firefox undefined
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  let q: Quality = 'high';
  if (nav.connection?.saveData || cores <= 2 || (mem !== undefined && mem <= 2) || noHardwareGl())
    q = 'low';
  else if (cores <= 4 || (mem !== undefined && mem <= 4) || (coarse && cores < 8)) q = 'medium';

  try {
    const saved = sessionStorage.getItem(KEY);
    if (isQuality(saved)) q = min(q, saved);
  } catch {
    /* ignore */
  }
  return q;
}
