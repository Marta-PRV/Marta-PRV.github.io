import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { iconNames } from './components/icons';

/**
 * Colección de proyectos.
 *
 * Cada proyecto son DOS archivos MDX (uno por idioma) con el mismo nombre:
 *   src/content/projects/es/mi-proyecto.mdx
 *   src/content/projects/en/mi-proyecto.mdx
 *
 * El nombre del archivo (sin extensión) es el `slug` y sale en la URL.
 * Si falta un campo obligatorio o tiene un tipo incorrecto, `npm run build`
 * falla con un mensaje claro: así no se publica un proyecto a medias.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Una frase para la tarjeta y para el SEO (máx. ~160 caracteres). */
      summary: z.string().max(200),
      /** Categoría principal; se usa para el icono y el filtro. */
      category: z.enum(['web', 'ia', 'videojuegos', 'vr']),
      /** Icono pixel del escritorio (nombre de src/components/icons.ts: zombie, artpalette, idcard, vr...). */
      icon: z.enum(iconNames),
      /** Nombre corto bajo el icono del escritorio (máx. ~12 caracteres). Si falta, se usa el título. */
      iconLabel: z.string().max(14).optional(),
      /** Tecnologías y herramientas, en el orden en que quieres mostrarlas. */
      tech: z.array(z.string()).min(1),
      /** URL del repositorio en GitHub. */
      repo: z.string().url(),
      /** ID del vídeo de YouTube (lo que va tras `youtu.be/`). Opcional. */
      video: z.string().optional(),
      /** Miniatura LOCAL del vídeo (descárgala una vez a src/assets/video/). Se muestra antes de pulsar play. */
      videoPoster: image().optional(),
      /** Imagen de portada. Va en src/assets y se optimiza sola. Opcional. */
      cover: image().optional(),
      /** Texto alternativo de la portada (obligatorio si hay portada). */
      coverAlt: z.string().optional(),
      /** Orden en la lista: número menor = más arriba. */
      order: z.number().default(100),
      /** Año del proyecto. Opcional. */
      year: z.number().int().optional(),
      /** Con `draft: true` el proyecto no se publica. */
      draft: z.boolean().default(false),
    }).refine((d) => !d.cover || d.coverAlt, {
      message: 'Si hay `cover`, añade también `coverAlt` (accesibilidad).',
      path: ['coverAlt'],
    }),
});

export const collections = { projects };
