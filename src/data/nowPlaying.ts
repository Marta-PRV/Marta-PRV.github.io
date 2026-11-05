import type { Lang } from '../i18n/ui';

/**
 * Ventana decorativa "Escuchando ahora". NO reproduce audio: es solo ambiente.
 * Título genérico a propósito (sin artistas ni canciones reales, para no usar nombres con derechos).
 */
export const nowPlaying: { title: Record<Lang, string>; time: string } = {
  title: {
    es: 'Música para programar (en bucle)',
    en: 'Music to code to (on loop)',
  },
  time: '02:31',
};
