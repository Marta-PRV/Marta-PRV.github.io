import { getCollection, type CollectionEntry } from 'astro:content';
import { tech, type Tech } from './tech';
import type { Lang } from '../i18n/ui';

/**
 * Relación tecnología ↔ proyectos, calculada desde el campo `tech` de cada MDX:
 * al añadir un proyecto (o una tecnología en tech.ts) todo se actualiza solo.
 */
const norm = (s: string) => s.trim().toLowerCase();

/** La tecnología de tech.ts a la que corresponde un nombre escrito en un proyecto (o undefined). */
export function findTech(name: string): Tech | undefined {
  const n = norm(name);
  return tech.find((t) => norm(t.name) === n || t.aliases?.some((a) => norm(a) === n));
}

/** Proyectos publicados de un idioma, ordenados. */
export async function getProjects(lang: Lang): Promise<CollectionEntry<'projects'>[]> {
  return (await getCollection('projects', ({ id, data }) => id.startsWith(`${lang}/`) && !data.draft)).sort(
    (a, b) => a.data.order - b.data.order,
  );
}

/** id de tecnología -> proyectos que la usan. */
export async function projectsByTech(lang: Lang): Promise<Record<string, CollectionEntry<'projects'>[]>> {
  const projects = await getProjects(lang);
  return Object.fromEntries(
    tech.map((t) => [t.id, projects.filter((p) => p.data.tech.some((name) => findTech(name)?.id === t.id))]),
  );
}
