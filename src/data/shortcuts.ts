import type { IconName } from '../components/icons';
import type { Lang } from '../i18n/ui';

/**
 * Accesos directos de la columna derecha del escritorio.
 *  - kind 'anchor':   salta a una sección de la portada (target = id sin #).
 *  - kind 'external': otra web (target = URL completa); se abre en pestaña nueva.
 *  - kind 'route':    otra página del sitio (target = slug en español; se traduce solo).
 */
export interface Shortcut {
  id: string;
  icon: IconName;
  label: Record<Lang, string>;
  kind: 'anchor' | 'external' | 'route';
  target: string;
}

export const shortcuts: Shortcut[] = [
  { id: 'contact', icon: 'mail', label: { es: 'Contacto', en: 'Contact' }, kind: 'anchor', target: 'contacto' },
  {
    id: 'linkedin',
    icon: 'briefcase',
    label: { es: 'LinkedIn', en: 'LinkedIn' },
    kind: 'external',
    target: 'https://www.linkedin.com/in/marta-prieto-rodriguez-de-vera',
  },
  {
    id: 'github',
    icon: 'code',
    label: { es: 'GitHub', en: 'GitHub' },
    kind: 'external',
    target: 'https://github.com/Marta-PRV',
  },
  {
    id: 'how',
    icon: 'book',
    label: { es: 'Cómo está hecho', en: 'How it is made' },
    kind: 'route',
    target: 'como-esta-hecho',
  },
];
