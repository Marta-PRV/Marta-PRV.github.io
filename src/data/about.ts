import type { Lang } from '../i18n/ui';

/**
 * Texto de `sobre_mi.txt` (el Bloc de notas de la portada).
 * BORRADOR: Marta lo ajustará. Cada elemento de `paragraphs` es un párrafo.
 * `name` es la primera línea (en grande, como el título del documento).
 */
export const about: Record<Lang, { name: string; paragraphs: string[] }> = {
  es: {
    name: 'Marta Prieto',
    paragraphs: [
      'Soy graduada en Ingeniería de Software.',
      'Me dedico al desarrollo web, sobre todo frontend aunque también full stack, y me apasionan la inteligencia artificial y la programación de videojuegos.',
      'Aquí tienes mis proyectos: cada icono abre una página con lo que hice yo, las tecnologías que usé y el código en GitHub.',
    ],
  },
  en: {
    name: 'Marta Prieto',
    paragraphs: [
      'I hold a degree in Software Engineering.',
      'I work in web development, mostly frontend but also full stack, and I am passionate about artificial intelligence and video game programming.',
      'Here are my projects: each icon opens a page with what I did myself, the technologies I used and the code on GitHub.',
    ],
  },
};
