# Spec 04 — Página del Cotizador (`/cotizador`)

**Fase:** 4
**Estado:** ⬜ Pendiente
**Archivos a crear:**
- `src/pages/cotizador.astro`
- `src/components/quote/QuoteCartLine.astro`
- `src/components/quote/QuoteCartSummary.astro`
- `src/components/quote/QuoteTransportToggle.astro`

**Depende de:** Specs 01, 02, 03
**Bloquea a:** spec 05 (formulario de datos)

---

## Objetivo

Construir la página `/cotizador` (HTML estático + script de hidratación) donde el usuario revisa, personaliza y edita su selección antes de continuar al formulario de datos (spec 05) o enviar por WhatsApp (spec 06). Es el **centro de gravedad** del cotizador: el estado vacío con CTA al catálogo, la lista de items con campos editables in-place, el resumen de totales y los botones de acción.

## Por qué importa

- Es la **única página** de la feature donde el usuario interactúa con la selección completa.
- Sin un buen empty state, el usuario abandona al ver `/cotizador` vacío.
- La edición inline (cantidad, periodo, fecha, notas) **reduce fricción** vs un modal separado.
- El "subtotal" en días/semanas/meses no es monetario (no hay precios), pero **orienta al ejecutivo** sobre la duración del arriendo.

## Estructura visual

```
┌───────────────────────────────────────────────────────┐
│  Header (con QuoteCartBadge)                          │
├───────────────────────────────────────────────────────┤
│  HERO compacto: "Tu cotizador" + subtítulo            │
│  + 2 botones: [Ver catálogo] [Limpiar]               │
├───────────────────────────────────────────────────────┤
│                                                       │
│  ╔═══ LISTA DE ITEMS ════════════════════════════╗   │
│  ║ ┌───────────────────────────────────────┐     ║   │
│  ║ │ [img] Grove GMK 4100 (100 t)          │     ║   │
│  ║ │  Cant: [- 1 +]  Periodo: [Mensual v]  │     ║   │
│  ║ │  Periodos: [3]  Inicio: [2026-08-15]  │     ║   │
│  ║ │  Notas: [textarea]                     │     ║   │
│  ║ │  Traslado: [Sí/No] + [dirección]      │     ║   │
│  ║ │  [Quitar del cotizador]               │     ║   │
│  ║ └───────────────────────────────────────┘     ║   │
│  ║  (repetir por cada item)                      ║   │
│  ╚══════════════════════════════════════════════╝   │
│                                                       │
│  Notas globales: [textarea]                           │
│                                                       │
│  ╔═══ RESUMEN ═══════════════════════════════════╗   │
│  ║  2 equipos, 3 unidades en total              ║   │
│  ║  Mayor inicio: 2026-08-20                    ║   │
│  ║  Total días: 30 (5 semanas)                  ║   │
│  ║  Total meses: 3                              ║   │
│  ╚══════════════════════════════════════════════╝   │
│                                                       │
│  [ Continuar a mis datos → ]                          │
│  [ Enviar por WhatsApp ahora ]                        │
│                                                       │
├───────────────────────────────────────────────────────┤
│  Footer                                               │
└───────────────────────────────────────────────────────┘
```

### Estado vacío (carrito = 0)

```
┌──────────────────────────────────────────┐
│         Tu cotizador está vacío          │
│                                          │
│   Agrega equipos desde el catálogo       │
│   para armar una solicitud consolidada.  │
│                                          │
│   [ Ver catálogo de arriendo → ]         │
└──────────────────────────────────────────┘
```

## Archivos

### `src/pages/cotizador.astro`

```astro
---
// src/pages/cotizador.astro
// Página del cotizador. Estática: el contenido se hidrata con <script>.

import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/ui/Container.astro';
import SectionLayout from '@/components/ui/SectionLayout.astro';
import Icon from '@/components/ui/Icon.astro';
import { getSiteUrl } from '@/lib/seo';

// SEO: noindex, no canonical duplicado
const title = 'Cotizador | IP Proyectos Industriales';
const description = 'Revisa y personaliza los equipos que deseas arrendar.';
const canonical = getSiteUrl('/cotizador');
---

<BaseLayout
  title={title}
  description={description}
  canonical={canonical}
  noindex={true}
  breadcrumbs={[
    { label: 'Empresa', url: '/' },
    { label: 'Cotizador', url: '/cotizador' },
  ]}
>
  <SectionLayout spacing="md" background="light">
    <Container>
      <header class="quote-page__header">
        <div>
          <p class="quote-page__eyebrow">Tu selección</p>
          <h1 class="quote-page__title">Cotizador</h1>
        </div>
        <div class="quote-page__header-actions">
          <a href="/arriendo" class="quote-page__link">
            <Icon name="arrow-left" size={16} />
            Seguir agregando equipos
          </a>
          <button
            type="button"
            class="quote-page__clear"
            data-quote-clear
            hidden
            aria-label="Limpiar todo el cotizador"
          >
            <Icon name="close" size={14} />
            Limpiar cotizador
          </button>
        </div>
      </header>

      <!-- Estado vacío (se muestra si cart.items.length === 0) -->
      <div class="quote-page__empty" data-quote-empty hidden>
        <Icon name="file-text" size={48} class="quote-page__empty-icon" />
        <h2 class="quote-page__empty-title">Tu cotizador está vacío</h2>
        <p class="quote-page__empty-desc">
          Agrega equipos desde el catálogo para armar una solicitud consolidada.
        </p>
        <a href="/arriendo" class="quote-page__empty-cta">
          Ver catálogo de arriendo
          <Icon name="arrow-right" size={16} />
        </a>
      </div>

      <!-- Lista de items (se hidrata con el carrito) -->
      <div data-quote-lines hidden>
        <!-- Cada item se inyecta desde <script> usando la plantilla en QuoteCartLine -->
      </div>

      <!-- Notas globales -->
      <section class="quote-page__global" data-quote-global hidden>
        <label for="quote-global-notes" class="quote-page__label">
          Notas globales (opcional)
        </label>
        <textarea
          id="quote-global-notes"
          class="quote-page__textarea"
          rows="3"
          maxlength="500"
          placeholder="Información adicional que aplique a toda la cotización…"
          data-quote-global-notes
        ></textarea>
      </section>

      <!-- Resumen -->
      <aside class="quote-page__summary" data-quote-summary hidden>
        <!-- Inyectado por <script> -->
      </aside>

      <!-- Acciones -->
      <div class="quote-page__actions" data-quote-actions hidden>
        <a href="/cotizador/datos" class="quote-page__primary" data-quote-continue>
          Continuar a mis datos
          <Icon name="arrow-right" size={16} />
        </a>
        <button type="button" class="quote-page__whatsapp" data-quote-whatsapp>
          <Icon name="whatsapp" size={18} />
          Enviar por WhatsApp ahora
        </button>
      </div>
    </Container>
  </SectionLayout>
</BaseLayout>

<script>
  import { getCart, subscribe, removeItem, updateItem, clearCart, setGlobalNotes } from '@/lib/quoteCart';
  import { buildWhatsAppUrl, buildSummary, buildTotals } from '@/lib/quoteMessage';
  import { trackEvent } from '@/lib/quoteAnalytics';

  const linesEl = document.querySelector<HTMLElement>('[data-quote-lines]');
  const emptyEl = document.querySelector<HTMLElement>('[data-quote-empty]');
  const globalEl = document.querySelector<HTMLElement>('[data-quote-global]');
  const globalNotesEl = document.querySelector<HTMLTextAreaElement>('[data-quote-global-notes]');
  const summaryEl = document.querySelector<HTMLElement>('[data-quote-summary]');
  const actionsEl = document.querySelector<HTMLElement>('[data-quote-actions]');
  const clearBtn = document.querySelector<HTMLButtonElement>('[data-quote-clear]');
  const waBtn = document.querySelector<HTMLButtonElement>('[data-quote-whatsapp]');

  if (!linesEl || !emptyEl || !summaryEl || !actionsEl || !clearBtn || !waBtn) {
    throw new Error('quote-page: required elements missing');
  }

  function render() {
    const cart = getCart();
    const empty = cart.items.length === 0;

    emptyEl!.hidden = !empty;
    linesEl!.hidden = empty;
    globalEl!.hidden = empty;
    summaryEl!.hidden = empty;
    actionsEl!.hidden = empty;
    clearBtn!.hidden = empty;

    if (empty) return;

    if (globalNotesEl && globalNotesEl.value !== (cart.globalNotes ?? '')) {
      globalNotesEl.value = cart.globalNotes ?? '';
    }

    linesEl!.innerHTML = '';
    cart.items.forEach((item) => {
      const line = document.createElement('div');
      line.className = 'quote-cart-line';
      line.innerHTML = renderLine(item);
      linesEl!.appendChild(line);
    });

    summaryEl!.innerHTML = renderSummary(cart);

    // Event delegation para campos editables
    linesEl!.querySelectorAll<HTMLInputElement>('[data-line-field]').forEach((input) => {
      input.addEventListener('change', () => {
        const slug = input.dataset.lineSlug!;
        const field = input.dataset.lineField!;
        const value = input.type === 'number' ? Number(input.value) : input.value;
        updateItem(slug, { [field]: value });
        trackEvent('quote_update_item', { slug, field });
      });
    });
    linesEl!.querySelectorAll<HTMLTextAreaElement>('[data-line-notes]').forEach((ta) => {
      ta.addEventListener('change', () => {
        const slug = ta.dataset.lineSlug!;
        updateItem(slug, { notes: ta.value });
        trackEvent('quote_update_item', { slug, field: 'notes' });
      });
    });
    linesEl!.querySelectorAll<HTMLButtonElement>('[data-line-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slug = btn.dataset.lineSlug!;
        if (confirm('¿Quitar este equipo del cotizador?')) {
          removeItem(slug);
          trackEvent('quote_remove_item', { slug });
        }
      });
    });
  }

  // Plantilla HTML de cada item (string template; se escapa en el server).
  // El campo customization.* se inyecta con textContent en inputs.
  // (Ver "renderLine template" abajo.)

  // Resumen (HTML string)
  function renderSummary(cart) {
    const totals = buildTotals(cart);
    return `
      <h3 class="quote-page__summary-title">Resumen</h3>
      <dl class="quote-page__summary-list">
        <dt>Equipos distintos</dt><dd>${cart.items.length}</dd>
        <dt>Unidades totales</dt><dd>${totals.totalQuantity}</dd>
        <dt>Mayor inicio</dt><dd>${totals.latestStartDate}</dd>
        <dt>Días calendario</dt><dd>${totals.totalCalendarDays}</dd>
        <dt>Total meses-equivalentes</dt><dd>${totals.totalMonthEquivalents}</dd>
      </dl>
    `;
  }

  // Event wiring
  clearBtn.addEventListener('click', () => {
    if (confirm('¿Vaciar todo el cotizador? Esta acción no se puede deshacer.')) {
      clearCart();
      trackEvent('quote_clear');
    }
  });

  globalNotesEl?.addEventListener('change', () => {
    if (globalNotesEl) setGlobalNotes(globalNotesEl.value);
  });

  waBtn.addEventListener('click', () => {
    const cart = getCart();
    const url = buildWhatsAppUrl(cart, { withContactData: false });
    trackEvent('quote_submit_whatsapp', { itemCount: cart.items.length });
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  // Inicial + suscripción
  render();
  subscribe(render);

  // Al entrar a la página, track open
  trackEvent('quote_open_cart', { itemCount: getCart().items.length });
</script>

<style>
  .quote-page__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .quote-page__eyebrow {
    margin: 0 0 0.25rem;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-brand, #1a9c4a);
  }

  .quote-page__title {
    margin: 0;
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-weight: 800;
    font-size: clamp(1.8rem, 3.5vw, 2.5rem);
    letter-spacing: -0.02em;
    color: var(--color-ink, #1a1a1a);
  }

  .quote-page__header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .quote-page__link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--color-brand, #1a9c4a);
    font-weight: 600;
    text-decoration: none;
  }

  .quote-page__clear {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.875rem;
    background: transparent;
    color: var(--color-ink-700, #374151);
    border: 1px solid var(--color-line, rgba(0, 0, 0, 0.1));
    border-radius: 999px;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
  }

  .quote-page__clear:hover {
    color: #b91c1c;
    border-color: #b91c1c;
  }

  .quote-page__empty {
    text-align: center;
    padding: 3rem 1rem;
    background-color: var(--color-surface, #fff);
    border: 1px solid var(--color-line, rgba(0, 0, 0, 0.08));
    border-radius: 16px;
  }

  .quote-page__empty-icon {
    color: var(--color-brand, #1a9c4a);
    margin-bottom: 1rem;
  }

  .quote-page__empty-title {
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-size: 1.4rem;
    margin: 0 0 0.5rem;
  }

  .quote-page__empty-desc {
    color: var(--color-ink-700, #374151);
    margin: 0 0 1.5rem;
  }

  .quote-page__empty-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    background-color: var(--color-brand, #1a9c4a);
    color: #fff;
    font-weight: 700;
    border-radius: 999px;
    text-decoration: none;
  }

  .quote-page__empty-cta:hover {
    background-color: var(--color-brand-700, #15803d);
  }

  .quote-page__global {
    margin: 1.5rem 0;
  }

  .quote-page__label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--color-ink-700, #374151);
    margin-bottom: 0.5rem;
  }

  .quote-page__textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-line, rgba(0, 0, 0, 0.1));
    border-radius: 8px;
    font-family: var(--font-body, system-ui);
    font-size: 0.95rem;
    resize: vertical;
    min-height: 80px;
  }

  .quote-page__textarea:focus {
    outline: 2px solid var(--color-brand, #1a9c4a);
    outline-offset: 2px;
  }

  .quote-page__summary {
    margin: 1.5rem 0;
    padding: 1.25rem 1.5rem;
    background-color: var(--color-surface, #fff);
    border: 1px solid var(--color-line, rgba(0, 0, 0, 0.08));
    border-radius: 12px;
  }

  .quote-page__summary-title {
    margin: 0 0 0.75rem;
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-size: 1.1rem;
  }

  .quote-page__summary-list {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.4rem 1rem;
    margin: 0;
  }

  .quote-page__summary-list dt {
    color: var(--color-ink-700, #374151);
    font-size: 0.9rem;
  }

  .quote-page__summary-list dd {
    margin: 0;
    font-weight: 700;
    font-size: 0.95rem;
    text-align: right;
  }

  .quote-page__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 2rem;
  }

  .quote-page__primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.75rem;
    background-color: var(--color-brand, #1a9c4a);
    color: #fff;
    font-weight: 700;
    border-radius: 999px;
    text-decoration: none;
  }

  .quote-page__primary:hover {
    background-color: var(--color-brand-700, #15803d);
  }

  .quote-page__whatsapp {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.75rem;
    background-color: transparent;
    color: var(--color-brand, #1a9c4a);
    font-weight: 700;
    border: 1.5px solid var(--color-brand, #1a9c4a);
    border-radius: 999px;
    cursor: pointer;
  }

  .quote-page__whatsapp:hover {
    background-color: rgba(26, 156, 74, 0.08);
  }
</style>
```

### `renderLine` template (función auxiliar)

```ts
// Pegar en el mismo <script> de cotizador.astro o extraer a quoteMessage.ts.
function renderLine(item: QuoteCartItem): string {
  const c = item.customization;
  const safeName = escapeHtml(item.name);
  const safeNotes = escapeHtml(c.notes ?? '');
  return `
    <article class="quote-cart-line__inner" data-line-slug="${item.equipmentSlug}">
      <div class="quote-cart-line__head">
        <img src="${escapeAttr(item.image)}" alt="${safeName}" class="quote-cart-line__image" loading="lazy" />
        <div class="quote-cart-line__title">
          <h3>${safeName}</h3>
          <span class="quote-cart-line__capacity">${escapeHtml(item.capacity)}${item.height ? ' · ' + escapeHtml(item.height) : ''}</span>
        </div>
        <button type="button" class="quote-cart-line__remove" data-line-remove data-line-slug="${item.equipmentSlug}" aria-label="Quitar ${safeName}">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div class="quote-cart-line__grid">
        <div class="quote-cart-line__field">
          <label>Cantidad</label>
          <input type="number" min="1" max="50" value="${c.quantity}" data-line-field="quantity" data-line-slug="${item.equipmentSlug}" inputmode="numeric" />
        </div>
        <div class="quote-cart-line__field">
          <label>Tipo de periodo</label>
          <select data-line-field="periodType" data-line-slug="${item.equipmentSlug}">
            <option value="diario" ${c.periodType === 'diario' ? 'selected' : ''}>Diario</option>
            <option value="semanal" ${c.periodType === 'semanal' ? 'selected' : ''}>Semanal</option>
            <option value="mensual" ${c.periodType === 'mensual' ? 'selected' : ''}>Mensual</option>
          </select>
        </div>
        <div class="quote-cart-line__field">
          <label>Cantidad de periodos</label>
          <input type="number" min="1" max="365" value="${c.periodCount}" data-line-field="periodCount" data-line-slug="${item.equipmentSlug}" inputmode="numeric" />
        </div>
        <div class="quote-cart-line__field">
          <label>Fecha de inicio</label>
          <input type="date" value="${c.startDate}" min="${todayIso()}" data-line-field="startDate" data-line-slug="${item.equipmentSlug}" />
        </div>
        <div class="quote-cart-line__field quote-cart-line__field--full">
          <label>Notas del equipo (opcional)</label>
          <textarea rows="2" maxlength="280" placeholder="Información específica de este equipo…" data-line-notes data-line-slug="${item.equipmentSlug}">${safeNotes}</textarea>
        </div>
        <div class="quote-cart-line__field quote-cart-line__field--full">
          <label class="quote-cart-line__checkbox-label">
            <input type="checkbox" data-line-field="transportRequired" data-line-slug="${item.equipmentSlug}" ${c.transport.required ? 'checked' : ''} />
            <span>Requiere traslado a la faena</span>
          </label>
          <input
            type="text"
            class="quote-cart-line__address"
            placeholder="Dirección de entrega (opcional)"
            value="${escapeAttr(c.transport.address ?? '')}"
            data-line-field="transportAddress"
            data-line-slug="${item.equipmentSlug}"
            ${c.transport.required ? '' : 'disabled'}
          />
        </div>
      </div>
    </article>
  `;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]!));
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
```

> **Importante:** la dirección de entrega (`transport.address`) y el flag `required` se persisten juntos vía `updateItem` con un patch `{ transport: { required, address } }`. El `QuoteCartLine` lee `c.transport.required` y al cambiar el checkbox, llama a `updateItem` con el patch completo. (El spec 02 define `updateItem(slug, patch: Partial<QuoteCartItemCustomization>)`; se acepta `Partial<QuoteCartItemTransport>` anidado.)

## Reglas de UX

### Edición inline

- `change` event (no `input`) → evita updates por cada keystroke.
- `min` y `max` en `<input type="number">` → previene valores fuera de rango desde el teclado.
- `maxlength` en `<textarea>` → previene exceso.
- El input de fecha tiene `min={today}` → no se puede elegir una fecha pasada.
- El campo de dirección de entrega se **deshabilita** si "Requiere traslado" está en `false`.

### Botón "Continuar a mis datos"

- Apunta a `/cotizador/datos` (la página de spec 05).
- Si el carrito está vacío, **no** se muestra (controlado por `[data-quote-actions][hidden]`).
- Antes de navegar, ejecuta un `validateCart`; si hay errores, los marca y bloquea la navegación (no se implementa en v1; spec 05 lo manejará).

### Botón "Enviar por WhatsApp ahora"

- Llama a `buildWhatsAppUrl(cart, { withContactData: false })` (spec 06).
- Abre `wa.me/...` en nueva pestaña.
- Trackea `quote_submit_whatsapp`.

### Botón "Limpiar cotizador"

- Pide confirmación con `confirm()`.
- Trackea `quote_clear`.
- Vacía el carrito y re-pinta al estado vacío.

## Accesibilidad

- Cada `<input>` y `<select>` tiene su `<label>` asociado.
- El `<button>` de remover tiene `aria-label` con el nombre del equipo.
- El textarea de notas tiene `placeholder` descriptivo.
- Los cambios disparan `aria-live="polite"` en el badge de totales (se agrega `aria-live="polite"` al `summaryEl`).
- Tab order: cantidad → periodo → cantidad de periodos → fecha → notas → traslado → dirección → botón remover.
- En mobile, los inputs tienen `inputmode="numeric"` para teclado numérico.

## Responsive

| Breakpoint | Layout |
|---|---|
| `< 640px` | Items en 1 columna; campos full-width. |
| `640-1023px` | Grid 2 cols para los 4 primeros campos. |
| `>= 1024px` | Grid 4 cols; notas y traslado full-width. |

## Tareas

- [ ] Crear `src/components/quote/QuoteCartLine.astro` con la plantilla y CSS (opcional, se puede inline en la página).
- [ ] Crear `src/components/quote/QuoteCartSummary.astro` con el resumen (opcional, igual).
- [ ] Crear `src/pages/cotizador.astro` con todo el contenido.
- [ ] Verificar que `astro check` pasa.
- [ ] Verificar que el HTML estático (sin hidratación JS) muestra el **estado vacío** con CTA al catálogo (fallback graceful).
- [ ] Probar:
  1. Sin items: ver estado vacío con CTA.
  2. Con 1 item: ver línea editable.
  3. Editar cantidad, periodo, fecha: ver que se guarda en `localStorage`.
  4. Recargar: la edición persiste.
  5. Remover un item: confirmar `confirm()`; el item desaparece; el badge del header actualiza.
  6. Limpiar: confirmar; el carrito queda vacío.
  7. Botón WhatsApp: abre `wa.me/...` con mensaje consolidado (validar formato en spec 06).
- [ ] Validar en mobile (320px, 375px, 768px) y desktop (1280px).
- [ ] Validar contraste WCAG AA y tab order.

## Definition of Done

- [ ] `src/pages/cotizador.astro` existe y compila.
- [ ] El HTML estático (con carrito vacío en localStorage) muestra el estado vacío con CTA a `/arriendo`.
- [ ] El estado vacío se ve correctamente en SSR (build estático).
- [ ] Con ≥1 item, se renderiza la lista editable.
- [ ] Cada item permite editar: cantidad, tipo de periodo, cantidad de periodos, fecha de inicio, notas, traslado + dirección.
- [ ] Las notas globales se persisten.
- [ ] El resumen muestra: equipos distintos, unidades totales, mayor inicio, días calendario, meses-equivalentes.
- [ ] El botón "Limpiar cotizador" pide confirmación y vacía el carrito.
- [ ] El botón "Continuar a mis datos" apunta a `/cotizador/datos` (página de spec 05).
- [ ] El botón "Enviar por WhatsApp ahora" abre `wa.me/...` con mensaje consolidado.
- [ ] No se exponen credenciales ni tokens en el HTML.
- [ ] WCAG AA: labels asociados, focus visible, contraste.
- [ ] Responsive: 1 col mobile, 2 col tablet, 4 col desktop.

## Referencias

- Spec 01: [./01-data-model.md](./01-data-model.md) — `QuoteCartItem`, `QuoteCartItemCustomization`, `QuoteCartItemTransport`.
- Spec 02: [./02-cart-state-and-storage.md](./02-cart-state-and-storage.md) — `getCart`, `updateItem`, `removeItem`, `clearCart`, `setGlobalNotes`, `subscribe`.
- Spec 05: [./05-renter-data-form.md](./05-renter-data-form.md) — `/cotizador/datos`.
- Spec 06: [./06-message-and-payload-builders.md](./06-message-and-payload-builders.md) — `buildWhatsAppUrl`, `buildTotals`.
- Spec 08: [./08-seo-analytics.md](./08-seo-analytics.md) — `trackEvent` para `quote_open_cart`, `quote_update_item`, `quote_remove_item`, `quote_clear`, `quote_submit_whatsapp`.
- `src/components/ui/SectionLayout.astro` — wrapper de sección.
- `src/components/ui/Container.astro` — wrapper de container.
- `src/components/ui/Icon.astro` — íconos `arrow-left`, `arrow-right`, `close`, `file-text`, `whatsapp`.
- `src/lib/seo.ts` — `getSiteUrl` para canonical.
