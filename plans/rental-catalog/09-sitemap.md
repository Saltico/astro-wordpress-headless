# Spec 09 — Sitemap

**Fase:** 13
**Estado:** ✅ Completo
**Archivos a modificar:**
- `astro.config.mjs` (verificar integración `@astrojs/sitemap`)

**Depende de:**
- [03-routes-templates.md](./03-routes-templates.md) (URLs finales)
- [08-site-integration.md](./08-site-integration.md) (no debe haber links a URLs viejas)
- [07-redirects-migration.md](./07-redirects-migration.md) (post-eliminación de páginas viejas)

**Bloquea a:** [10-acceptance-criteria.md](./10-acceptance-criteria.md) (DoD completo)

---

## Objetivo

Verificar que `@astrojs/sitemap` (ya instalado en el proyecto) genera correctamente el `sitemap-index.xml` y `sitemap-0.xml` con las 27 URLs del nuevo catálogo `/arriendo/*` y excluye las URLs legacy (`/arriendos/*`, `/arriendo-maquinaria/*`).

## Estado actual de la integración

`astro.config.mjs` ya tiene `@astrojs/sitemap` configurado:

```js
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: SITE_URL,
  // ...
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es' },
      },
      filter: (page) => {
        const noIndexPaths = ['/gracias', '/404', '/500', '/aviso-legal', '/privacidad', '/cookies'];
        return !noIndexPaths.some((path) => page.includes(path));
      },
    }),
  ],
});
```

El filtro actual excluye 6 paths administrativos. El catálogo se incluye automáticamente porque está dentro de `src/pages/`.

## Cambios necesarios

### 9.1 Verificar configuración

`astro.config.mjs` **no requiere cambios** siempre que:
- Las 27 URLs de `/arriendo/*` se generan correctamente
- Las URLs legacy `/arriendos/*` y `/arriendo-maquinaria/*` ya están eliminadas de `src/pages/` (post Spec 07)

Si la Spec 07 aún no ha eliminado las páginas legacy, **filtrarlas manualmente** del sitemap:

```js
filter: (page) => {
  const noIndexPaths = [
    '/gracias',
    '/404',
    '/500',
    '/aviso-legal',
    '/privacidad',
    '/cookies',
    '/arriendos',          // ← añadir temporalmente
    '/arriendo-maquinaria', // ← añadir temporalmente
  ];
  return !noIndexPaths.some((path) => page.includes(path));
}
```

Y luego de Spec 07, **remover** `/arriendos` y `/arriendo-maquinaria` del filtro.

### 9.2 (Opcional) Personalizar prioridades

Por defecto, `@astrojs/sitemap` asigna prioridad `0.7` a todas las páginas. Si se quiere priorizar el catálogo:

**Opción A — Custom sitemap endpoint** (recomendado para control fino):

Crear `src/pages/sitemap.xml.ts`:

```ts
// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro';
import { RENTAL_CATEGORIES } from '@/data/rental';

const SITE_URL = 'https://ipproyectosindustriales.cl';

interface UrlEntry {
  loc: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: number;
  lastmod?: string;
}

const staticUrls: UrlEntry[] = [
  { loc: '/', changefreq: 'weekly', priority: 1.0 },
  { loc: '/nosotros', changefreq: 'monthly', priority: 0.8 },
  { loc: '/servicios', changefreq: 'monthly', priority: 0.8 },
  { loc: '/contacto', changefreq: 'monthly', priority: 0.6 },
];

const rentalUrls: UrlEntry[] = [
  { loc: '/arriendo', changefreq: 'weekly', priority: 0.9 },
  ...RENTAL_CATEGORIES.flatMap((category) => [
    {
      loc: `/arriendo/${category.slug}`,
      changefreq: 'weekly' as const,
      priority: 0.8,
    },
    ...category.subcategories.map((sub) => ({
      loc: `/arriendo/${category.slug}/${sub.slug}`,
      changefreq: 'monthly' as const,
      priority: 0.7,
    })),
  ]),
];

export const GET: APIRoute = () => {
  const allUrls = [...staticUrls, ...rentalUrls];
  const today = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
```

Y luego **desactivar** la integración `@astrojs/sitemap` en `astro.config.mjs`:

```js
integrations: [
  // sitemap({ ... }),  // Comentado: usamos custom endpoint
],
```

**Opción B — Mantener la integración default** y aceptar prioridades uniformes (más simple, suficiente para v1).

**Recomendación:** Empezar con Opción B (más simple). Migrar a Opción A si se necesita más control.

### 9.3 Robots.txt

Verificar que `public/robots.txt` (si existe) apunte al sitemap:

```
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://ipproyectosindustriales.cl/sitemap-index.xml
```

Si no existe, crearlo.

## Verificación

### Local (post-build)

```powershell
npm run build
Get-ChildItem -LiteralPath "dist" -Filter "sitemap-*.xml"
# Debe devolver al menos 1 archivo
Get-Content dist/sitemap-0.xml
# Verificar que las 27 URLs de /arriendo/* están listadas
```

### Producción

```bash
curl -s https://ipproyectosindustriales.cl/sitemap-index.xml
curl -s https://ipproyectosindustriales.cl/sitemap-0.xml | grep "/arriendo/"
# Debe devolver 27 líneas
```

### Google Search Console

1. Enviar `https://ipproyectosindustriales.cl/sitemap-index.xml` en Search Console
2. Verificar que Google indexa las 27 URLs nuevas
3. Verificar que las URLs legacy se desindexan tras unos días

## Tareas

- [ ] Decidir entre Opción A (custom endpoint) u Opción B (integración default)
- [ ] Si Opción A: crear `src/pages/sitemap.xml.ts` y comentar la integración
- [ ] Si Opción B: solo verificar que la integración default cubre las 27 URLs
- [ ] Verificar/crear `public/robots.txt` con el pointer al sitemap
- [ ] Hacer `npm run build` y verificar que el sitemap se genera
- [ ] Contar las URLs en `sitemap-0.xml` (deben ser ≥27 para el catálogo)
- [ ] Verificar en producción que el sitemap es accesible públicamente

## Definition of Done

- [ ] `sitemap-index.xml` y `sitemap-0.xml` se generan en `dist/`
- [ ] Las 27 URLs de `/arriendo/*` aparecen en el sitemap
- [x] Las URLs legacy `/arriendos/*` y `/arriendo-maquinaria/*` NO aparecen en el sitemap (post-eliminación)
- [ ] `robots.txt` apunta al sitemap correctamente
- [ ] El sitemap es accesible públicamente en producción
- [ ] Las prioridades reflejan la jerarquía (hub > categoría > sub-ruta) si se usa Opción A
- [ ] Google Search Console acepta el sitemap sin errores

## Referencias

- README: [./README.md](./README.md)
- Spec 03: [./03-routes-templates.md](./03-routes-templates.md) — URLs finales
- Spec 07: [./07-redirects-migration.md](./07-redirects-migration.md) — eliminación de páginas viejas
- Spec 08: [./08-site-integration.md](./08-site-integration.md) — sin links a URLs viejas
- `@astrojs/sitemap` docs: https://docs.astro.build/en/guides/integrations-guide/sitemap/
- Sitemap protocol: https://www.sitemaps.org/protocol.html
