---
status: implemented
depends_on: [00-baseline-validation]
implemented: 2026-07-31
---
# 01 — SEO técnico y dominio

> **Estado:** ✅ Implementado el 2026-07-31  
> **Resultados:** [`results/01-seo-foundations-results.md`](./results/01-seo-foundations-results.md)

## Requisitos

- Resolver `PUBLIC_SITE_URL` durante el build.
- Generar `<title>` y `<meta name="description">` reales para toda página indexable.
- Derivar canonical, OG, Twitter y JSON-LD de la misma metadata.
- Mantener títulos/descriptions únicos y fallback controlado.
- Usar `trailingSlash: 'never'` y redirecciones permanentes para URLs antiguas.
- Mantener `https://ipproyectosindustriales.cl` como valor de producción actual.
- Generar sitemap solo con URLs públicas, canónicas, 200 e indexables.
- Permitir rastrear `/cotizador` para que Google lea `noindex, follow`; excluirlo del sitemap.
- Añadir favicon y verificar `og-default.jpg`.
- Validar schemas contra contenido visible: Organization, WebSite, BreadcrumbList, Service, Product, NewsArticle, FAQPage y otros solo cuando correspondan.
- Crear inventario `index`, `noindex`, redirección o eliminación por ruta.

## Contenido

Crear keyword mapping por URL; no inventar keywords. El propietario completará intención, keyword principal, secundarias y objetivo de conversión.

## Cotizador

`/cotizador`: `noindex, follow`, canonical autorreferente, fuera del sitemap. El contenido SEO sobre cotizaciones debe vivir en URLs separadas e indexables.

## Criterios de aceptación

- ninguna página indexable carece de title, description, H1 y canonical;
- dominio único en configuración, HTML, sitemap, robots, OG y JSON-LD;
- Rich Results Test sin errores críticos;
- no existen cadenas internas hacia redirecciones conocidas;
- páginas thin tienen decisión explícita.
