---
report: Análisis de esfuerzo — refinamiento visual del cotizador
effort: High
dependencies:
  - Feature plan: plans/features/cotizador-layout-refinement.md
  - Flow: plans/flows/cotizador-layout-flow.mmd
status: Planned
---

# Análisis de esfuerzo

## Desglose

| ID | Tarea | Esfuerzo | Dependencias |
|---|---|---|---|
| 1 | Auditar call-sites de `QuoteHero` y confirmar eliminación segura | Low | Ninguna |
| 2 | Definir superficie compacta y fondo estable del navbar | Medium | 1 |
| 3 | Retirar `QuoteHero` de `cotizador.astro` y limpiar imports | Low | 2 |
| 4 | Integrar CTA directo de catálogo en `EquipmentPicker` | Medium | 1 |
| 5 | Reproporcionar columnas del primer paso | Medium | 3 |
| 6 | Cambiar resultados a una card por fila | Medium | 4 |
| 7 | Ajustar markup y estilos de `EquipmentPickerCard` | Medium | 6 |
| 8 | Mantener equivalencia SSR/cliente del picker | High | 6, 7 |
| 9 | Resolver orden responsive según estado del carrito | High | 5, 8 |
| 10 | Revisar sticky, foco, live regions y estados vacíos | Medium | 5, 6, 9 |
| 11 | QA visual desktop/mobile/light/dark | Medium | 10 |
| 12 | Ejecutar build y revisión de regresiones | Low | 11 |

## Totales estimados

- **Low:** 3 tareas — 4 a 6 horas.
- **Medium:** 7 tareas — 2 a 3 días.
- **High:** 2 tareas — 1 a 2 días.
- **Total:** 3 a 5 días calendario, dependiendo de la disponibilidad para revisión visual.

## Camino crítico

```text
Fondo/header estable
  → retirada del hero
  → proporción de columnas
  → card de una fila
  → equivalencia SSR/cliente
  → responsive por estado
  → QA visual
```

## Recursos requeridos

- Un desarrollador Astro/CSS.
- Acceso a navegador para pruebas visuales desktop y mobile.
- Validación funcional de una persona responsable del flujo comercial.
- No se requiere backend, diseño gráfico nuevo ni dependencia npm.

## Definition of Done

- El hero fotográfico deja de ocupar espacio en el cotizador.
- El navbar tiene contraste estable desde el primer paint.
- El CTA de catálogo funciona desde el header de búsqueda.
- La búsqueda queda en columna estrecha y la selección en columna dominante.
- Las cards de resultados aparecen una por fila.
- No hay regresiones en búsqueda, filtros, carrito, SSR, teclado o mobile.
- `npm run build` pasa sin errores.
