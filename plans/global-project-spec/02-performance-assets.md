---
status: implemented
depends_on: [00-baseline-validation, 01-seo-foundations]
implemented: 2026-07-31
---
# 02 — Performance, renderización y assets

> **Estado:** ✅ Implementado el 2026-07-31  
> **Resultados:** [`results/02-performance-assets-results.md`](./results/02-performance-assets-results.md)

## Objetivos

- LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 y TTFB objetivo ≤ 800 ms.
- JS propio inicial ≤ 100 KB comprimidos y CSS inicial ≤ 100 KB comprimidos como presupuesto inicial.
- No bloquear el primer viewport con videos ni scripts externos.

## Videos

- tratarlos como decorativos y opcionales;
- poster optimizado como experiencia base;
- `preload="none"` o carga posterior cuando no sea primer plano;
- WebM + MP4 fallback;
- desactivar o reducir en móviles/conexiones lentas;
- respetar `prefers-reduced-motion`;
- objetivo orientativo ≤ 2 MB por video optimizado.

## Imágenes

Usar:

```text
src/assets/images/{brand,heroes,services,rental,projects,news,social}/
```

Astro procesa imágenes de `src/assets`; `public/` queda para URLs directas. Generar AVIF/WebP y responsive sizes, mantener fallback cuando proceda, exigir `alt`, dimensiones, propósito y OG 1200×630.

## Otras acciones

- medir y optimizar logos externos;
- validar `catalogo.pdf`;
- revisar IntersectionObservers y consolidar solo tras medir;
- revisar Tailwind instalado pero no usado;
- extraer CSS duplicado sin cambiar visuales accidentalmente.

## Criterios de aceptación

- no hay asset crítico sin dimensiones o alt;
- no se descarga video antes del contenido crítico;
- Lighthouse móvil cumple objetivos o documenta excepciones;
- cada excepción incluye impacto y plan posterior.
