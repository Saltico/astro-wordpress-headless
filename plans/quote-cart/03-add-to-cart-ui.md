# Spec 03 — UI de "Agregar al Cotizador"

**Fase:** 3
**Estado:** ⬜ Pendiente
**Archivos a crear:**
- `src/components/quote/QuoteAddButton.astro`
- `src/components/quote/QuoteCartBadge.astro`
- `src/components/quote/QuoteCartFloatingButton.astro`

**Archivos a modificar:**
- `src/components/rental/EquipmentCard.astro` (reemplazar el CTA unitario por `<QuoteAddButton>`)
- `src/components/layout/Header.astro` o `BaseLayout.astro` (insertar `<QuoteCartBadge>` en el slot `cta` o como hermano)

**Depende de:** Specs 01, 02
**Bloquea a:** spec 04 (página /cotizador)

---

## Objetivo

Reemplazar el CTA unitario "Cotizar este equipo" (que abre WhatsApp directo) por un botón **"Agregar al cotizador"** que añade el equipo al carrito (spec 02), y añadir **dos indicadores de estado** del carrito: un **badge en el header** (desktop) y un **botón flotante** (mobile). Estos son los puntos de contacto que ven los usuarios en cada navegación del catálogo.

## Por qué importa

- **Punto de entrada** al cotizador: si este botón no existe o falla, la feature no existe.
- **Feedback inmediato** ("Agregado", "Ya en el cotizador", "Error localStorage") es la única forma de que el usuario sepa que su selección se guardó.
- El badge y el floating button **se sincronizan** entre páginas vía el `CustomEvent` `quote-cart:change` (spec 02), por lo que pueden montarse en cada página sin estado global.

## Cambios en `EquipmentCard.astro`

Reemplazar el bloque `{showWhatsappCta && ( ... <a href={whatsappUrl}> ... </a> ... )}` por:

```astro
---
// src/components/rental/EquipmentCard.astro (NUEVO frontmatter)
import Icon from '@/components/ui/Icon.astro';
import QuoteAddButton from '@/components/quote/QuoteAddButton.astro';
import type { Equipment } from '@/data/rental';

export interface Props {
  item: Equipment;
  showAddToQuote?: boolean; // reemplaza showWhatsappCta
}

const { item, showAddToQuote = true } = Astro.props;

// Necesitamos categorySlug y subcategorySlug para equipmentToLocation.
// Los recibimos como prop extra o los derivamos desde la URL actual.

const pathParts = Astro.url.pathname.split('/').filter(Boolean);
// pathParts esperado: ['arriendo', '{categoria}', '{subcategoria}', '{equipment}']
const categorySlug = pathParts[1] ?? '';
const subcategorySlug = pathParts[2] ?? '';
const sourceUrl = Astro.url.pathname;
---

<!-- En el body, reemplazar el bloque WhatsApp CTA por: -->
{showAddToQuote && (
  <QuoteAddButton
    equipmentSlug={item.slug}
    name={item.name}
    capacity={item.capacity}
    image={item.image}
    categorySlug={categorySlug}
    subcategorySlug={subcategorySlug}
    sourceUrl={sourceUrl}
  />
)}
```

> ⚠️ **Importante:** el `Astro.url.pathname` solo funciona correctamente si `EquipmentCard` se renderiza dentro de `/arriendo/[categoria]/[subcategoria].astro`. Si en el futuro se renderiza en otra ruta, pasar `categorySlug` y `subcategorySlug` como props explícitas (ver `props` de `EquipmentCatalog`).

## `QuoteAddButton.astro` (componente principal)

```astro
---
// src/components/quote/QuoteAddButton.astro
// Botón que agrega el equipo al cotizador. Muestra 3 estados visuales:
// 'idle' (Agregar), 'added' (Ya en el cotizador), 'error' (No se pudo guardar).
// El estado se sincroniza con el carrito vía CustomEvent.

import Icon from '@/components/ui/Icon.astro';

export interface Props {
  equipmentSlug: string;
  name: string;
  capacity: string;
  image: string;
  categorySlug: string;
  subcategorySlug: string;
  sourceUrl: string;
}

const {
  equipmentSlug,
  name,
  capacity,
  image,
  categorySlug,
  subcategorySlug,
  sourceUrl,
} = Astro.props;
---

<button
  type="button"
  class="quote-add-btn"
  data-quote-add
  data-equipment-slug={equipmentSlug}
  data-name={name}
  data-capacity={capacity}
  data-image={image}
  data-category-slug={categorySlug}
  data-subcategory-slug={subcategorySlug}
  data-source-url={sourceUrl}
  aria-label={`Agregar ${name} al cotizador`}
>
  <span class="quote-add-btn__icon" data-state="idle">
    <Icon name="check" size={16} />
  </span>
  <span class="quote-add-btn__label" data-state="idle">Agregar al cotizador</span>
  <span class="quote-add-btn__label" data-state="added" hidden>Ya en el cotizador</span>
  <span class="quote-add-btn__label" data-state="error" hidden>Reintentar</span>
</button>

<script>
  import { addItem, subscribe, isAtCap, getCart } from '@/lib/quoteCart';

  function paintState(btn: HTMLButtonElement, state: 'idle' | 'added' | 'error') {
    btn.dataset.state = state;
    btn.querySelectorAll<HTMLElement>('[data-state]').forEach((el) => {
      el.hidden = el.dataset.state !== state;
    });
    btn.classList.toggle('is-added', state === 'added');
    btn.classList.toggle('is-error', state === 'error');
  }

  function isInCart(slug: string): boolean {
    return getCart().items.some((i) => i.equipmentSlug === slug);
  }

  document.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement | null;
    const btn = target?.closest<HTMLButtonElement>('[data-quote-add]');
    if (!btn) return;

    event.preventDefault();
    const slug = btn.dataset.equipmentSlug!;
    const payload = {
      slug,
      name: btn.dataset.name!,
      capacity: btn.dataset.capacity!,
      image: btn.dataset.image!,
      categorySlug: btn.dataset.categorySlug!,
      categoryName: '',
      subcategorySlug: btn.dataset.subcategorySlug!,
      subcategoryName: '',
      // nota: categoryName/subcategoryName los resuelve equipmentToLocation,
      // pero como el botón solo necesita añadir, el handler los rellena.
    };

    if (isAtCap() && !isInCart(slug)) {
      // Cap alcanzado y este item no está ya → toast + no agregar.
      window.dispatchEvent(
        new CustomEvent('quote-cart:toast', {
          detail: { kind: 'warning', message: `Máximo 5 equipos por cotización.` },
        })
      );
      return;
    }

    // Llamamos a equipmentToLocation por slug, no por data-attribute,
    // para mantener el botón libre de strings largos.
    const { equipmentToLocation } = await import('@/lib/quoteCart');
    const equipment = equipmentToLocation(slug);
    if (!equipment) {
      paintState(btn, 'error');
      return;
    }

    const result = addItem(equipment, btn.dataset.sourceUrl!);
    if (result.ok) {
      paintState(btn, isInCart(slug) ? 'added' : 'idle');
    } else if (result.error === 'CART_FULL') {
      window.dispatchEvent(
        new CustomEvent('quote-cart:toast', {
          detail: { kind: 'warning', message: result.errorMessage! },
        })
      );
    } else {
      paintState(btn, 'error');
    }
  });

  // Estado inicial: si el item ya está en el carrito, mostrar "Ya en el cotizador"
  document.querySelectorAll<HTMLButtonElement>('[data-quote-add]').forEach((btn) => {
    const slug = btn.dataset.equipmentSlug!;
    paintState(btn, isInCart(slug) ? 'added' : 'idle');
  });

  // Re-pintar al cambiar el carrito (ej: al volver de /cotizador)
  subscribe((cart) => {
    document.querySelectorAll<HTMLButtonElement>('[data-quote-add]').forEach((btn) => {
      const slug = btn.dataset.equipmentSlug!;
      paintState(btn, cart.items.some((i) => i.equipmentSlug === slug) ? 'added' : 'idle');
    });
  });
</script>

<style>
  .quote-add-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 8px;
    padding: 12px 18px;
    background-color: var(--color-brand, #1a9c4a);
    color: #fff;
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-weight: 700;
    font-size: 0.9rem;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    transition: background-color 0.18s ease, transform 0.18s ease;
    width: 100%;
  }

  .quote-add-btn:hover:not(:disabled),
  .quote-add-btn:focus-visible {
    background-color: var(--color-brand-700, #15803d);
    transform: translateY(-1px);
  }

  .quote-add-btn:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
  }

  .quote-add-btn.is-added {
    background-color: transparent;
    color: var(--color-brand, #1a9c4a);
    border: 1.5px solid var(--color-brand, #1a9c4a);
  }

  .quote-add-btn.is-added:hover {
    background-color: rgba(26, 156, 74, 0.08);
  }

  .quote-add-btn.is-error {
    background-color: #b91c1c;
  }

  .quote-add-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .quote-add-btn__icon[data-state='idle'] {
    display: none;
  }
</style>
```

## `QuoteCartBadge.astro` (contador en el header)

```astro
---
// src/components/quote/QuoteCartBadge.astro
// Badge con el conteo de items en el header. Desktop y mobile.
// Se sincroniza con quote-cart:change.

import Icon from '@/components/ui/Icon.astro';
---

<a
  href="/cotizador"
  class="quote-badge"
  data-quote-badge
  aria-label="Abrir cotizador"
>
  <Icon name="file-text" size={20} class="quote-badge__icon" />
  <span class="quote-badge__label">Cotizador</span>
  <span class="quote-badge__count" data-quote-badge-count hidden>0</span>
</a>

<script>
  import { subscribe, getItemCount, getTotalQuantity } from '@/lib/quoteCart';

  function paint() {
    const count = getItemCount();
    const total = getTotalQuantity();
    const el = document.querySelector<HTMLElement>('[data-quote-badge]');
    const countEl = document.querySelector<HTMLElement>('[data-quote-badge-count]');
    if (!el || !countEl) return;

    if (count === 0) {
      el.classList.remove('has-items');
      countEl.hidden = true;
    } else {
      el.classList.add('has-items');
      countEl.hidden = false;
      countEl.textContent = String(total);
    }
  }

  paint();
  subscribe(paint);
</script>

<style>
  .quote-badge {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 2.5rem;
    padding: 0.5rem 0.875rem;
    color: #fff;
    text-decoration: none;
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-weight: 700;
    font-size: 0.875rem;
    border: 1.5px solid rgba(255, 255, 255, 0.35);
    border-radius: 999px;
    transition: background-color 0.15s ease, transform 0.15s ease;
  }

  .quote-badge:hover,
  .quote-badge:focus-visible {
    background-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-1px);
  }

  .quote-badge:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
  }

  .quote-badge__label {
    display: none;
  }

  @media (min-width: 768px) {
    .quote-badge__label {
      display: inline;
    }
  }

  .quote-badge__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.4rem;
    background-color: var(--color-brand, #1a9c4a);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 800;
    border-radius: 999px;
    line-height: 1;
  }
</style>
```

### Integración en `Header.astro`

Insertar como hermano del slot `cta` (no dentro, para no romper el estilo de `header__cta`):

```astro
---
// src/components/layout/Header.astro (modificación)
// Añadir import + render al final del <header>, antes del cierre </header>:
import QuoteCartBadge from '@/components/quote/QuoteCartBadge.astro';
---

<!-- ... existing markup ... -->
<QuoteCartBadge />
```

> **Decisión visual:** el badge reemplaza **parcialmente** al CTA "Solicitar cotización" existente en `BaseLayout.astro`. En desktop se muestra **ambos** (badge + CTA de contacto). En mobile, el badge aparece **antes** del hamburger menu.

## `QuoteCartFloatingButton.astro` (botón flotante mobile)

```astro
---
// src/components/quote/QuoteCartFloatingButton.astro
// Botón flotante solo visible en mobile (< 768px).
// Fixed bottom-right; muestra el conteo de items.

import Icon from '@/components/ui/Icon.astro';
---

<a
  href="/cotizador"
  class="quote-fab"
  data-quote-fab
  hidden
  aria-label="Ver cotizador"
>
  <Icon name="file-text" size={22} />
  <span class="quote-fab__count" data-quote-fab-count>0</span>
</a>

<script>
  import { subscribe, getItemCount, getTotalQuantity } from '@/lib/quoteCart';

  function paint() {
    const count = getItemCount();
    const total = getTotalQuantity();
    const fab = document.querySelector<HTMLElement>('[data-quote-fab]');
    const countEl = document.querySelector<HTMLElement>('[data-quote-fab-count]');
    if (!fab || !countEl) return;

    if (count === 0) {
      fab.hidden = true;
    } else {
      fab.hidden = false;
      countEl.textContent = String(total);
    }
  }

  paint();
  subscribe(paint);
</script>

<style>
  .quote-fab {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 90;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background-color: var(--color-brand, #1a9c4a);
    color: #fff;
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-weight: 700;
    font-size: 0.95rem;
    text-decoration: none;
    border-radius: 999px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
    transition: transform 0.15s ease, background-color 0.15s ease;
  }

  .quote-fab:hover,
  .quote-fab:focus-visible {
    background-color: var(--color-brand-700, #15803d);
    transform: translateY(-2px);
  }

  .quote-fab__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.4rem;
    background-color: #fff;
    color: var(--color-brand, #1a9c4a);
    font-size: 0.8rem;
    font-weight: 800;
    border-radius: 999px;
    line-height: 1;
  }

  @media (min-width: 768px) {
    .quote-fab {
      display: none;
    }
  }
</style>
```

### Integración

Insertar **al final del `BaseLayout.astro`** (después del footer), sin condicional:

```astro
<QuoteCartFloatingButton />
```

## Toast component (utilidad opcional)

Para mensajes como "Máximo 5 equipos", se usa un CustomEvent `quote-cart:toast`. En v1 el handler se puede inline-ear en `BaseLayout.astro` con un mini-snippet (no requiere componente nuevo). Ejemplo:

```astro
<script>
  (function () {
    const layer = document.createElement('div');
    layer.setAttribute('data-toast-layer', '');
    layer.style.cssText = 'position:fixed;bottom:5.5rem;right:1rem;z-index:95;display:flex;flex-direction:column;gap:0.5rem;pointer-events:none;';
    document.body.appendChild(layer);

    window.addEventListener('quote-cart:toast', (event) => {
      const e = event as CustomEvent<{ kind: 'info' | 'warning' | 'error'; message: string }>;
      const toast = document.createElement('div');
      toast.textContent = e.detail.message;
      toast.setAttribute('role', 'status');
      const bg = e.detail.kind === 'warning' ? '#f59e0b' : e.detail.kind === 'error' ? '#b91c1c' : 'var(--color-brand, #1a9c4a)';
      toast.style.cssText = `padding:0.75rem 1rem;background-color:${bg};color:#fff;font-weight:600;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.2);opacity:0;transition:opacity 0.2s ease;pointer-events:auto;max-width:320px;font-size:0.9rem;`;
      layer.appendChild(toast);
      requestAnimationFrame(() => { toast.style.opacity = '1'; });
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 250);
      }, 2500);
    });
  })();
</script>
```

## Accesibilidad

- **Botón:** `<button type="button">` con `aria-label` dinámico que incluye el nombre del equipo.
- **Estado "added":** se anuncia vía `aria-live` políte (se implementa en spec 04; en este spec basta con el cambio visual).
- **Badge:** `<a>` con `aria-label` ("Abrir cotizador con N equipos"); el contador está dentro de un `<span>` con `aria-live="polite"`.
- **FAB:** oculto con `hidden` cuando no hay items, **no** con `display: none` (para que screen readers no lo lean).
- **Color contrast:** todos los estados (verde sobre blanco, blanco sobre verde) cumplen WCAG AA.

## Responsive

| Breakpoint | Badge | FAB |
|---|---|---|
| `< 768px` (mobile) | Solo ícono + count | Visible |
| `>= 768px` (tablet+) | Ícono + "Cotizador" + count | Oculto |

## Tareas

- [ ] Crear `src/components/quote/QuoteAddButton.astro` con la lógica anterior.
- [ ] Crear `src/components/quote/QuoteCartBadge.astro`.
- [ ] Crear `src/components/quote/QuoteCartFloatingButton.astro`.
- [ ] Modificar `src/components/rental/EquipmentCard.astro` para reemplazar el CTA WhatsApp por `<QuoteAddButton>`.
- [ ] Insertar `<QuoteCartBadge>` en `src/components/layout/Header.astro` (o `BaseLayout.astro`).
- [ ] Insertar `<QuoteCartFloatingButton>` al final de `BaseLayout.astro`.
- [ ] Agregar el toast layer en `BaseLayout.astro` (snippet inline).
- [ ] Validar visualmente con un catálogo con 3+ equipos y cross-browser (Chrome, Safari, Firefox, Edge).
- [ ] Validar en mobile (iPhone SE viewport) y desktop (1440px).
- [ ] Probar el flujo:
  1. Agregar equipo A desde `/arriendo/izaje/gruas-100-toneladas`.
  2. Navegar a `/arriendo/izaje/gruas-250-toneladas`.
  3. Confirmar que el botón de A en la nueva página muestra "Ya en el cotizador" (si A está ahí) **o** "Agregar" (si no).
  4. Agregar equipo B.
  5. Verificar que el badge muestra `2`.
  6. Recargar la página; la selección persiste.

## Definition of Done

- [ ] Los 3 componentes existen y compilan.
- [ ] El botón "Cotizar este equipo" antiguo ya **no** aparece en ninguna card del catálogo.
- [ ] El badge aparece en el header y muestra el conteo de unidades (`quantity`) y no el de items únicos.
- [ ] El FAB aparece solo en mobile y solo cuando hay items.
- [ ] El evento `quote-cart:change` re-pinta los 3 componentes sin recargar.
- [ ] El toast "Máximo 5 equipos" se muestra al intentar agregar un 6° item único.
- [ ] El estado "Ya en el cotizador" se persiste entre navegaciones.
- [ ] El estado "Reintentar" se muestra si `localStorage` falla.
- [ ] WCAG AA: contraste y focus visible.
- [ ] El bundle JS adicional (3 scripts) pesa < 6 KB en total (sin gzip).

## Referencias

- Spec 01: [./01-data-model.md](./01-data-model.md) — `QuoteCartItem` shape.
- Spec 02: [./02-cart-state-and-storage.md](./02-cart-state-and-storage.md) — `addItem`, `subscribe`, `isAtCap`, `equipmentToLocation`.
- Spec 04: [./04-cart-page.md](./04-cart-page.md) — recibe la selección que este spec produce.
- Spec 08: [./08-seo-analytics.md](./08-seo-analytics.md) — emite `quote_add_item` desde `addItem`.
- `src/components/rental/EquipmentCard.astro` — card a modificar.
- `src/components/layout/Header.astro` — header a modificar.
- `src/layouts/BaseLayout.astro` — layout a modificar (FAB + toast).
- `src/components/ui/Icon.astro` — íconos `file-text` y `check` ya existen.
- `src/lib/icons.ts` — verificar que `file-text` está registrado.
