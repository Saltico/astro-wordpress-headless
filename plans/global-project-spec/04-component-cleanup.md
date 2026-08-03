---
status: implemented
depends_on: [00-baseline-validation, 03-design-system]
implemented: 2026-07-31
---
# 04 — Limpieza de componentes

> **Estado:** ✅ Implementado el 2026-07-31  
> **Resultados:** [`results/04-component-cleanup-results.md`](./results/04-component-cleanup-results.md)

## Candidatos

- `src/components/ui/TrustBand.astro`
- `src/components/ui/Marquee.astro`
- `src/components/ui/ClientsGrid.astro`
- `src/components/ui/Select.astro`
- `src/components/ui/QuoteForm.astro`
- `src/components/rental/SpecsGrid.astro`

## Procedimiento obligatorio

1. buscar imports estáticos y dinámicos;
2. revisar layouts, páginas, documentación, ejemplos y scripts;
3. comprobar dependencias CSS/assets;
4. identificar reemplazos, especialmente `QuoteFormAdvanced`;
5. revisar historial Git si la intención no es clara;
6. marcar cada componente como conservar, migrar, deprecado o eliminar;
7. eliminar únicamente tras build y revisión de rutas;
8. registrar la decisión en esta spec y `DECISIONS.md`.

## Criterios de aceptación

- no se elimina funcionalidad usada;
- `npm run build` continúa exitoso;
- no quedan imports rotos ni assets huérfanos por la eliminación;
- el inventario final refleja solo componentes confirmados.
