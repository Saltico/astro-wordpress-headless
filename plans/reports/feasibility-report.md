---
report: Factibilidad — refinamiento visual del cotizador
effort: High
dependencies:
  - Astro static build
  - Existing quote wizard
  - Existing Header variant API
status: Planned
---

# Informe de factibilidad

## Veredicto

La propuesta es **técnicamente factible con riesgo bajo a medio**. El cambio es principalmente de composición, CSS y markup de componentes existentes. No requiere nuevas dependencias, cambios de backend ni modificaciones al estado del carrito.

## Hallazgos

- `src/pages/cotizador.astro` monta `QuoteHero` antes del wizard.
- `QuoteHero.astro` contiene la imagen, el texto y el CTA de catálogo.
- `BaseLayout.astro` ya expone `headerVariant?: 'default' | 'brand'`.
- `Header.astro` tiene comportamiento transparente inicial y fondo oscuro al hacer scroll.
- `EquipmentPicker.astro` concentra búsqueda, filtros, URL params, estados y render SSR/cliente.
- La versión actual del picker ya usa un `<details>` y puede conservar su comportamiento.
- `QuoteStepSelect.astro` contiene el layout de columnas y la lista de selección.
- El sistema no necesita un nuevo modelo de datos.

## Factibilidad por área

| Área | Evaluación | Comentario |
|---|---|---|
| Retirar hero | Alta | Se puede quitar el call-site y conservar el componente hasta verificar usos globales |
| Estabilizar navbar | Alta | Existe `headerVariant="brand"`; es preferible a hacks de z-index o fondos absolutos |
| Mover CTA catálogo | Alta | El componente `Button` y `siteContact.catalogUrl` ya existen |
| Dos columnas asimétricas | Alta | El layout está encapsulado en `QuoteStepSelect.astro` |
| Una card por fila | Alta | Solo afecta `.picker__results` y la geometría de `picker-card` |
| Mantener SSR/cliente | Media | Deben actualizarse tanto `EquipmentPickerCard.astro` como `renderCard()` |
| Prioridad dinámica mobile | Media | Requiere decidir si se resuelve por markup, CSS o una clase de estado |
| Accesibilidad | Alta | El markup actual ya tiene labels y live region; requiere regresión visual/teclado |

## Enfoque recomendado

1. Aplicar primero el fondo/header estable.
2. Retirar el hero del call-site sin borrar aún el componente.
3. Añadir el CTA al header del picker.
4. Cambiar las proporciones del layout.
5. Cambiar la lista a una card por fila.
6. Auditar equivalencia SSR/cliente.
7. Validar estados y responsive.

## Dependencias externas

No se identifican dependencias externas nuevas. La descarga del catálogo depende de la URL ya presente en `siteContact.catalogUrl`.

## Bloqueadores

No hay bloqueadores técnicos. La única decisión de implementación que debe confirmarse durante desarrollo es si el fondo estable se logra con `headerVariant="brand"` o con una superficie sólida específica de página. Se recomienda `headerVariant="brand"` por menor acoplamiento.

## Riesgos de producto

Eliminando el hero se reduce contexto editorial, pero esto es coherente con el modo Operate y con la prioridad declarada: buscar, revisar y seleccionar equipos. El título y la orientación pueden vivir en el stepper o en una superficie compacta, sin recuperar un hero completo.
