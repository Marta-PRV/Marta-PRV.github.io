// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  // Sitio de usuario en GitHub Pages: sin `base`, vive en la raíz del dominio.
  site: 'https://marta-prv.github.io',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    // Español en `/`, inglés en `/en/`.
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    // Expressive Code debe ir ANTES de mdx() para procesar los bloques de código.
    expressiveCode({
      themes: ['github-dark', 'github-light'],
      // Usamos nuestro propio atributo data-theme (claro/oscuro con botón),
      // en lugar de depender solo de la preferencia del sistema.
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
      styleOverrides: {
        borderRadius: '0',
        codeFontFamily: 'ui-monospace, Consolas, monospace',
      },
    }),
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-ES', en: 'en-GB' } },
    }),
  ],
});
