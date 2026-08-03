---
status: implemented
depends_on: [00-baseline-validation, 02-performance-assets]
implemented: 2026-07-31
---
# 03 — Sistema de diseño

> **Estado:** ✅ Implementado el 2026-07-31  
> **Resultados:** [`results/03-design-system-results.md`](./results/03-design-system-results.md)

## Principios

- mobile first;
- WCAG 2.2 AA;
- `src/styles/tokens.css` como fuente oficial;
- consolidación conservadora, preservando la apariencia antes de refactorizar;
- `--spacing-*` como nomenclatura canónica y `--space-*` como alias temporal.

## Responsive

Validar 320, 375, 768, 1024 y 1280 px, cubriendo rangos de móvil pequeño, móvil, tablet, desktop compacto y desktop amplio. Cada componente documentará estructura, overflow, foco, imágenes, video y texto largo.

## Layout

- `--container-max-width` para contenido estándar;
- `--container-full-width` para secciones amplias;
- reemplazar `1360px` hardcodeado por tokens tras auditoría visual;
- introducir un token wide adicional solo si la evidencia lo requiere;
- evitar unificar todo automáticamente a 1200px.

## Componentes

Después de estabilizar tokens y layout:

1. consolidar `Eyebrow`;
2. documentar variantes de Hero y consolidarlas sin perder casos válidos;
3. centralizar overlays;
4. extraer `.reveal` y `.sr-only` duplicados;
5. respetar `prefers-reduced-motion`.

## Criterios de aceptación

- no hay colores, spacing o max-width nuevos hardcodeados sin justificación;
- todos los estados interactivos tienen foco visible;
- no existe scroll horizontal accidental en la matriz responsive;
- contraste, controles y formularios cumplen WCAG 2.2 AA.
