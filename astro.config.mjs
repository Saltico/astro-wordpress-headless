// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// TODO: reemplazar por dominio final antes de produccion
const SITE_URL = 'https://ipproyectosindustriales.cl';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  output: 'static',
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es',
        },
      },
      filter: (page) => {
        const noIndexPaths = ['/gracias', '/404', '/500', '/aviso-legal', '/privacidad', '/cookies'];
        return !noIndexPaths.some((path) => page.includes(path));
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
