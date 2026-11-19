import { useEffect, useRef, useState } from 'react';

/** IntersectionObserver для появления при скролле. Один раз: после показа отписываемся. */
export function useReveal<T extends HTMLElement>(margin = '0px 0px -80px 0px') {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, shown] as const;
}
