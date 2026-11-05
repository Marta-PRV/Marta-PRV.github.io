/**
 * Email público, partido en dos trozos. Se codifica en entidades HTML al
 * construir la página (los navegadores lo muestran normal, pero los robots que
 * buscan "algo@dominio" en el HTML no lo encuentran tan fácilmente). Es una
 * protección básica, no infalible.
 */
export const email = { user: 'martaprieto.rv', domain: 'gmail.com' };

/** Convierte un texto a entidades numéricas hexadecimales (&#x6d;&#x61;...). */
export function encodeEntities(text: string): string {
  return [...text].map((c) => `&#x${c.codePointAt(0)!.toString(16)};`).join('');
}
