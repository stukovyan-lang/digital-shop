import { EASE } from './motion';

/** «Полёт» иконки товара в корзину (SPEC п.8). Только transform/opacity, Web Animations API. */
export function flyToCart(from: HTMLElement, label: string) {
  const target = document.querySelector<HTMLElement>('[data-cart-target]');
  if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);

  const el = document.createElement('div');
  el.textContent = label;
  el.setAttribute('aria-hidden', 'true');
  Object.assign(el.style, {
    position: 'fixed',
    left: `${a.left + a.width / 2 - 20}px`,
    top: `${a.top + a.height / 2 - 20}px`,
    width: '40px',
    height: '40px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '12px',
    background: 'var(--nx-grad)',
    color: '#fff',
    font: '700 13px var(--font-unbounded), sans-serif',
    boxShadow: '0 0 30px rgba(255,46,136,.7)',
    zIndex: '80',
    pointerEvents: 'none',
  });
  document.body.append(el);

  const anim = el.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      {
        transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 90}px) scale(1.2)`,
        opacity: 1,
        offset: 0.45,
      },
      { transform: `translate(${dx}px, ${dy}px) scale(.3)`, opacity: 0.25 },
    ],
    { duration: 750, easing: `cubic-bezier(${EASE.join(',')})` },
  );
  const done = () => el.remove();
  anim.addEventListener('finish', done);
  anim.addEventListener('cancel', done);
}
