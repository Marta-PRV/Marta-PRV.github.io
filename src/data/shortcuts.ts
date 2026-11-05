import type { IconName } from '../components/icons';
import type { Lang } from '../i18n/ui';

/**
 * Accesos directos de la columna DERECHA del escritorio (hoy solo "Cómo está hecho").
 * Contacto, LinkedIn y GitHub ya no son iconos: son ventanas ("Contacto", "Mis redes").
 *  - kind 'route':    otra página del sitio (target = slug en español; se traduce solo).
 *  - kind 'external': otra web (target = URL completa); se abre en pestaña nueva.
 */
export interface Shortcut {
  id: string;
  icon: IconName;
  label: Record<Lang, string>;
  kind: 'external' | 'route';
  target: string;
}

export const shortcuts: Shortcut[] = [
  {
    id: 'how',
    icon: 'book',
    label: { es: 'Cómo está hecho', en: 'How it is made' },
    kind: 'route',
    target: 'como-esta-hecho',
  },
];
