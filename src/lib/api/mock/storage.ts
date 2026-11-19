/** Безопасный localStorage: в приватном режиме или SSR просто ничего не делает. */
export const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const write = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
};

export const delay = (ms = 250) => new Promise<void>((r) => setTimeout(r, ms));
