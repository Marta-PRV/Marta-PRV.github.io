/**
 * Perfiles de la ventana "Mis redes". Para añadir otra red: nueva entrada aquí, su
 * componente de logo en src/components/brand/ y sus textos en src/i18n/ui.ts.
 *
 * REGLAS DE MARCA (resumen): los logos se usan solo para enlazar a TUS perfiles, sin
 * deformarlos, recolorearlos ni combinarlos con otros elementos, y sin dar a entender
 * que LinkedIn o GitHub respaldan esta web.
 */
export interface Social {
  id: 'linkedin' | 'github';
  /** Nombre visible (marca). */
  name: string;
  href: string;
  /** Clave de i18n del texto del botón. */
  cta: 'redes.linkedin' | 'redes.github';
}

export const socials: Social[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/marta-prieto-rodriguez-de-vera',
    cta: 'redes.linkedin',
  },
  { id: 'github', name: 'GitHub', href: 'https://github.com/Marta-PRV', cta: 'redes.github' },
];
