import type { IconName } from '../components/icons';

/**
 * Lenguajes y tecnologías de la ventana "Mis tecnologías".
 *
 * PARA AÑADIR UNA: copia una línea, cámbiale `id`, `name`, `mark` y `color`. Nada más.
 *  - mark:  1 a 3 caracteres que se dibujan en el azulejo. Letras MAYÚSCULAS, números
 *           y los símbolos  #  +  <  >  /  (las minúsculas no existen en la mini fuente).
 *  - color: color de fondo del azulejo (propio, no el logo oficial de cada marca).
 *  - ink:   'dark' si el fondo es claro y el monograma debe ir oscuro (por defecto, blanco).
 *  - icon:  opcional; si pones un nombre de icons.ts, se usa ese icono en lugar del monograma.
 * El orden del array es el orden en pantalla.
 */
export interface Tech {
  id: string;
  name: string;
  mark: string;
  color: string;
  ink?: 'light' | 'dark';
  icon?: IconName;
}

export const tech: Tech[] = [
  { id: 'csharp', name: 'C#', mark: 'C#', color: '#7b4fd6' },
  { id: 'python', name: 'Python', mark: 'PY', color: '#3f7fbf' },
  { id: 'javascript', name: 'JavaScript', mark: 'JS', color: '#f0c93a', ink: 'dark' },
  { id: 'typescript', name: 'TypeScript', mark: 'TS', color: '#2f6fcf' },
  { id: 'html-css', name: 'HTML/CSS', mark: '</>', color: '#d9502a' },
  { id: 'react', name: 'React', mark: 'RE', color: '#4cc3de', ink: 'dark' },
  { id: 'node', name: 'Node.js', mark: 'ND', color: '#4a9a3a' },
  { id: 'express', name: 'Express', mark: 'EX', color: '#5a5f73' },
  { id: 'unity', name: 'Unity', mark: 'UN', color: '#3b3f4f' },
  { id: 'sql', name: 'SQL', mark: 'SQL', color: '#d9822b', ink: 'dark' },
  { id: 'git', name: 'Git', mark: 'GIT', color: '#c0392b' },
];
