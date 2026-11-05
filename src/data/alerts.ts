import type { IconName } from '../components/icons';
import type { Lang } from '../i18n/ui';

/**
 * Diálogos de aviso en cascada del escritorio (humor ligero). BORRADOR: edítalos a tu gusto.
 *  - Van de atrás hacia delante: el ÚLTIMO queda delante y es el único cuyo texto se ve entero.
 *  - icon: 'warning' | 'error' | 'info'.
 *  - buttons: etiquetas de los botones; cualquiera de ellos cierra el aviso.
 *  - Regla: nada de datos falsos sobre ti (cifras, empleos, logros) ni mensajes que parezcan errores reales del sitio.
 */
export interface Alert {
  id: string;
  icon: Extract<IconName, 'warning' | 'error' | 'info'>;
  title: Record<Lang, string>;
  text: Record<Lang, string>;
  buttons: Record<Lang, string[]>;
}

export const alerts: Alert[] = [
  {
    id: 'aviso-info',
    icon: 'info',
    title: { es: 'Información', en: 'Information' },
    text: {
      es: 'Este escritorio no tiene virus. Solo demasiadas ventanas abiertas.',
      en: 'This desktop has no viruses. Just too many windows open.',
    },
    buttons: { es: ['Vale'], en: ['Fair enough'] },
  },
  {
    id: 'aviso-error',
    icon: 'error',
    title: { es: 'Error', en: 'Error' },
    text: {
      es: 'No se puede cerrar el portfolio: quedan proyectos por descubrir.',
      en: 'Cannot close the portfolio: there are projects left to discover.',
    },
    buttons: { es: ['Aceptar'], en: ['OK'] },
  },
  {
    id: 'aviso-warning',
    icon: 'warning',
    title: { es: 'Aviso', en: 'Warning' },
    text: {
      es: 'Se ha detectado un exceso de entusiasmo por el frontend. ¿Continuar de todos modos?',
      en: 'Excess frontend enthusiasm detected. Continue anyway?',
    },
    buttons: { es: ['Sí', 'Sí, con ganas'], en: ['Yes', 'Yes, gladly'] },
  },
];
