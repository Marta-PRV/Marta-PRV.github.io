import { defaultLang, ui, type Lang, type UiKey } from './ui';

/** Segmentos de URL que cambian de nombre entre idiomas (español -> inglés). */
const segmentsEsToEn: Record<string, string> = {
  proyectos: 'projects',
  'como-esta-hecho': 'how-its-made',
};
const segmentsEnToEs = Object.fromEntries(Object.entries(segmentsEsToEn).map(([es, en]) => [en, es]));

/** Idioma según la URL: `/en/...` es inglés; todo lo demás, español. */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first === 'en' ? 'en' : defaultLang;
}

/** Devuelve la función `t('clave')` para un idioma. */
export function useTranslations(lang: Lang) {
  return (key: UiKey): string => ui[lang][key] ?? ui[defaultLang][key];
}

/** Ruta localizada: localePath('en', 'projects/x') -> /en/projects/x/ */
export function localePath(lang: Lang, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  const prefix = lang === defaultLang ? '' : `/${lang}`;
  return clean ? `${prefix}/${clean}/` : `${prefix}/`;
}

/** Slug de sección con su nombre en cada idioma. */
export function sectionSlug(lang: Lang, esSlug: keyof typeof segmentsEsToEn): string {
  return lang === 'es' ? esSlug : segmentsEsToEn[esSlug];
}

/** La misma página en el otro idioma (para el botón de idioma y hreflang). */
export function alternatePath(url: URL, to: Lang): string {
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts[0] === 'en') parts.shift();
  // Si vamos a inglés, el primer segmento está en español (y al revés).
  const map = to === 'en' ? segmentsEsToEn : segmentsEnToEs;
  const translated = parts.map((p, i) => (i === 0 ? (map[p] ?? p) : p));
  return localePath(to, translated.join('/'));
}
