---
feature: Refinamiento visual del hero y primer paso del cotizador
effort: High
dependencies:
  - src/pages/cotizador.astro
  - src/components/quote/QuoteHero.astro
  - src/components/quote/EquipmentPicker.astro
  - src/components/quote/EquipmentPickerCard.astro
  - src/components/quote/QuoteStepSelect.astro
  - src/components/layout/Header.astro
  - src/components/layout/Navigation.astro
status: Planned
---

# Refinamiento visual del hero y primer paso del cotizador

## Overview

La primera vista actual combina un hero visual con la herramienta de búsqueda y el carrito. Para un flujo operativo, el hero añade altura y compite por atención con los equipos seleccionados. La propuesta sustituye el hero por una superficie compacta de transición que mantenga el navbar legible y estable, sin presentar una imagen ni una segunda llamada a la acción.

El primer paso conserva dos columnas en desktop:

- **Columna izquierda, estrecha:** “Agregar equipos”, búsqueda, filtros y resultados.
- **Columna derecha, amplia:** “Equipos seleccionados”, edición de líneas, acciones y estado vacío.

En mobile, el orden recomendado es selección actual primero cuando existen equipos; si el carrito está vacío, el buscador aparece primero para permitir la acción inicial.

## Requisitos funcionales

1. El cotizador no debe mostrar el hero fotográfico actual.
2. Debe existir una superficie superior sólida que cubra visualmente el área detrás del navbar transparente.
3. El botón “Descargar catálogo” debe aparecer como acción directa en el header de “Agregar equipos”.
4. El botón debe conservar su descarga directa, `target` y accesibilidad actuales.
5. La búsqueda y sus filtros deben continuar funcionando sin alterar el estado del carrito.
6. En desktop, la búsqueda debe ocupar menos ancho que los equipos seleccionados.
7. Los resultados del buscador deben presentarse en una card por fila.
8. Los equipos seleccionados deben conservar acciones de editar, eliminar, expandir y continuar.
9. Los estados vacío, loading, filtrado sin resultados y límite de equipos deben seguir siendo comprensibles.
10. En mobile no debe producirse overflow horizontal ni botones inaccesibles.

## Dirección propuesta

### A. Sustituir el hero

No se recomienda eliminar el espacio superior sin reemplazo, porque `Header.astro` inicia transparente y utiliza texto claro. Se propone una de estas implementaciones, en este orden de preferencia:

1. **Preferida:** pasar `headerVariant="brand"` a `BaseLayout` solo para `/cotizador` y añadir una franja compacta de contexto debajo del header con el título “Cotizador” o el stepper.
2. **Alternativa:** mantener el header transparente, pero crear una superficie de fondo sólido desde el inicio de `main`, con padding superior equivalente a `topbar + header`.

La primera opción reduce acoplamiento entre el contenido del cotizador y la posición visual del navbar. La selección final debe conservar la identidad de marca y no introducir una nueva imagen.

### B. Header de búsqueda

Modificar `EquipmentPicker.astro` para que su encabezado contenga:

- Ícono de búsqueda.
- Título “Agregar equipos”.
- Conteo de equipos disponibles.
- Acción directa “Descargar catálogo”, alineada en desktop y apilada en mobile si el ancho no alcanza.

La acción debe ser secundaria frente a buscar/agregar, pero siempre visible. No debe depender de abrir filtros ni de un estado del carrito.

### C. Jerarquía de columnas

Modificar el layout de `QuoteStepSelect.astro`:

```text
Desktop:
┌──────────────────────┬───────────────────────────────────────┐
│ Agregar equipos      │ Equipos seleccionados                  │
│ búsqueda estrecha    │ columna dominante                      │
│ 1 card por fila      │ cards editables y acciones principales │
└──────────────────────┴───────────────────────────────────────┘

Mobile:
┌───────────────────────────────────────────────────────────────┐
│ Equipos seleccionados                                         │
├───────────────────────────────────────────────────────────────┤
│ Agregar equipos / búsqueda                                    │
└───────────────────────────────────────────────────────────────┘
```

La prioridad mobile debe depender del estado:

- Con equipos: selección primero, porque contiene información crítica.
- Sin equipos: búsqueda primero, porque es el siguiente paso accionable.

### D. Cards de resultados

El grid de `.picker__results` debe pasar a una columna por fila en todos los breakpoints del cotizador. La card puede reorganizarse internamente en horizontal en desktop estrecho —imagen, datos y CTA— para evitar una lista excesivamente alta, siempre que la legibilidad sea superior a la card vertical.

Decisión recomendada para el MVP: **una card horizontal por fila dentro de la columna de búsqueda**, con:

- Thumbnail compacta.
- Nombre, categoría y capacidad.
- CTA “Agregar”.
- Estado “En el cotizador” o límite alcanzado.

En mobile la card puede volver a una composición vertical si el ancho no permite mantener una fila cómoda.

## Cambios por archivo

### `src/pages/cotizador.astro`

- Retirar `QuoteHero` y el asset `heroImg` de esta página.
- Retirar `siteContact` si solo se utilizaba para el CTA del hero.
- Pasar la variante de header o clase de página necesaria para estabilizar el fondo bajo el navbar.
- Actualizar la descripción de página para que describa el flujo sin prometer una experiencia hero.
- Mantener intacta la composición del wizard y sus slots.

### `src/components/quote/QuoteHero.astro`

- No eliminar automáticamente durante la primera implementación.
- Marcarlo como candidato a deprecación si no tiene otros usos.
- Eliminarlo solo después de verificar con búsqueda global que no existen otros call-sites.

### `src/components/quote/EquipmentPicker.astro`

- Añadir el CTA de catálogo al `.picker__head`.
- Reorganizar el header con `justify-content: space-between` y wrapping controlado.
- Mantener `data-picker-total`, filtros, URL params, live region y acciones existentes.
- Cambiar el grid de resultados a una sola columna.
- Evaluar renderizado horizontal de `picker-card` para aprovechar la columna estrecha.
- Mantener la card SSR y la card generada por JavaScript semánticamente equivalentes.

### `src/components/quote/EquipmentPickerCard.astro`

- Ajustar la estructura visual a la nueva card de una fila.
- Mantener el CTA, badge, `data-*`, `aria-label` y enlaces existentes.
- Asegurar que el layout no dependa únicamente de `:hover`.

### `src/components/quote/QuoteStepSelect.astro`

- Revisar `quote-page__columns` y sus proporciones.
- Definir una columna dominante para el carrito y una columna estrecha para el picker.
- Revisar sticky behavior para que no tape acciones ni el stepper.
- En mobile, ordenar dinámicamente o mediante estructura CSS según el estado vacío/con equipos.

### `src/components/layout/Header.astro` / `src/layouts/BaseLayout.astro`

- Reutilizar `headerVariant="brand"` si se confirma como solución para el navbar.
- No modificar el comportamiento global del header.
- Verificar que el logo, navegación, theme toggle y badge del carrito mantengan contraste.

## Flujo de interacción

Ver: [cotizador-layout-flow.mmd](../flows/cotizador-layout-flow.mmd).

1. El usuario entra al cotizador.
2. El navbar aparece sobre una superficie sólida y legible.
3. El usuario ve el primer paso sin hero fotográfico.
4. Si no hay selección, busca un equipo en la columna dominante de acción inicial.
5. Si ya hay selección, la columna de equipos seleccionados ocupa la mayor atención.
6. El usuario puede descargar el catálogo directamente desde “Agregar equipos”.
7. Los filtros actualizan una lista de cards de una fila.
8. Al agregar un equipo, la selección se actualiza sin perder el contexto de búsqueda.
9. El usuario continúa al paso de datos de empresa.

## Criterios de aceptación

- [ ] No aparece la imagen hero ni el CTA de catálogo en la antigua ubicación.
- [ ] El navbar no queda sobre texto ilegible ni sobre una imagen no controlada.
- [ ] “Descargar catálogo” está visible junto a “Agregar equipos” y funciona con click y teclado.
- [ ] La columna de equipos seleccionados es visualmente más ancha que la búsqueda en desktop.
- [ ] El buscador muestra una card por fila.
- [ ] La búsqueda, filtros, URL params y ocultamiento de equipos ya agregados siguen funcionando.
- [ ] Los estados de carrito vacío, selección existente, sin resultados y límite se mantienen accesibles.
- [ ] En mobile no hay scroll horizontal.
- [ ] El orden visual prioriza selección existente cuando hay equipos.
- [ ] El wizard continúa avanzando al paso de datos sin regresiones.
- [ ] `npm run build` finaliza correctamente.

## Estrategia de pruebas

### Funcionales

- Entrar con carrito vacío.
- Entrar con uno, tres y cinco equipos.
- Buscar por nombre, capacidad y altura.
- Aplicar categoría y subcategoría.
- Descargar catálogo desde el nuevo CTA.
- Agregar, eliminar y editar un equipo.
- Confirmar que los filtros no pierden el foco tras actualizar resultados.
- Revisar URL params y recarga.

### Visuales

- Desktop amplio: 1440 px.
- Desktop intermedio: 1024 px.
- Tablet: 768 px.
- Mobile: 390 px.
- Light y dark mode.
- Header en estado inicial y después de scroll.
- Picker con una card, varias cards y sin resultados.

### Accesibilidad

- Navegación completa por teclado.
- Orden de foco coherente entre header, búsqueda y selección.
- CTA de catálogo con nombre accesible.
- Live region anunciando resultados filtrados.
- Contraste de header, botón, inputs y estados.
- Respeto a `prefers-reduced-motion`.

## Riesgos y mitigación

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El navbar transparente pierde contraste sin hero | Alto | Usar `headerVariant="brand"` o una superficie sólida superior antes de retirar el hero |
| Las cards horizontales se vuelven demasiado pequeñas | Medio | Mantener composición vertical en mobile y probar en 1024/768 px |
| El carrito pierde visibilidad por el cambio de orden | Alto | Darle columna dominante en desktop y prioridad en mobile cuando tenga items |
| SSR y render cliente difieren | Medio | Mantener el mismo contrato de markup y estados en `EquipmentPickerCard` y `renderCard()` |
| El CTA de catálogo compite con “Agregar” | Bajo | Tratarlo como acción secundaria en el header, no dentro de cada card |
| Se rompe otro uso de `QuoteHero` | Medio | Buscar call-sites antes de eliminar el componente |

## Timeline

Total estimado: **3–5 días de desarrollo y validación**.

- Estructura y header: 0.5–1 día.
- Layout de columnas: 0.5–1 día.
- Cards de búsqueda de una fila: 1 día.
- Responsive, estados y accesibilidad: 0.5–1 día.
- QA visual y build: 0.5–1 día.
