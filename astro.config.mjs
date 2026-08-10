// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// Dominio canónico de producción
const SITE_URL = 'https://ipproyectosindustriales.cl';

// https://docs.astro.build/en/guides/integrations-guide/node/
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
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
        const noIndexPaths = ['/gracias', '/404', '/500', '/aviso-legal', '/privacidad', '/cookies', '/cotizador'];
        return !noIndexPaths.some((path) => page.includes(path));
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
