import { site } from '@/config/site';

/**
 * Прелоадер — чистый CSS-оверлей поверх уже отрисованного контента (LCP не страдает).
 * Видим только при html[data-pre], который ставит inline-скрипт из layout
 * (первый заход в сессию, нет ?nopre, нет reduced-motion). Через 2.6 с он
 * уже visibility:hidden. Серверный компонент — JS не нужен.
 */
export function Preloader() {
  return (
    <div className="nx-pre" aria-hidden>
      <div className="nx-pre-in">
        <div className="nx-pre-mark" />
        <div className="nx-pre-bar" />
        <span className="nx-display text-sm text-muted">{site.name}</span>
      </div>
    </div>
  );
}

/** Выполняется в <head> до первого paint. sessionStorage — «один раз за сессию». */
export const preloaderScript = `(function(){try{
var d=document.documentElement;d.setAttribute('data-js','');var q=location.search.indexOf('nopre')>-1,
r=matchMedia('(prefers-reduced-motion: reduce)').matches,k='nx-pre-seen';
if(q||r||sessionStorage.getItem(k))return;
sessionStorage.setItem(k,'1');d.setAttribute('data-pre','');
setTimeout(function(){d.removeAttribute('data-pre')},2700);
}catch(e){}})();`;
