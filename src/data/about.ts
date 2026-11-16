import type { Lang } from '../i18n/ui';

/**
 * Texto de `sobre_mi.txt` (el Bloc de notas de la portada).
 * BORRADOR: Marta lo ajustará. Cada elemento de `paragraphs` es un párrafo.
 * `name` es la primera línea (en grande, como el título del documento).
 */
export type AboutPart = string | { open: string; text: string };

/**
 * Un párrafo es una lista de trozos: texto normal o un enlace que abre una ventana del escritorio
 * (`open` = id de la ventana, p. ej. 'proyectos'; `text` = lo que se lee).
 */
export const about: Record<Lang, { name: string; paragraphs: AboutPart[][] }> = {
  es: {
    name: 'Marta Prieto',
    paragraphs: [
      ['Soy graduada en Ingeniería de Software.'],
      ['Me dedico al desarrollo web, sobre todo frontend aunque también full stack, y me apasionan la inteligencia artificial y la programación de videojuegos.'],
      [
        'Aquí tienes ',
        { open: 'proyectos', text: 'mis proyectos' },
        ': cada uno tiene su página con lo que hice yo, las tecnologías que usé y el código en GitHub.',
      ],
    ],
  },
  en: {
    name: 'Marta Prieto',
    paragraphs: [
      ['I hold a degree in Software Engineering.'],
      ['I work in web development, mostly frontend but also full stack, and I am passionate about artificial intelligence and video game programming.'],
      [
        'Here are ',
        { open: 'proyectos', text: 'my projects' },
        ': each one has a page with what I did myself, the technologies I used and the code on GitHub.',
      ],
    ],
  },
};
