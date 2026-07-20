# Spec 10 — Selector de Equipos Embebido en `/cotizador`

**Fase:** 4 (extensión)
**Estado:** ⬜ Pendiente
**Archivos a crear:**
- `src/components/quote/EquipmentPicker.astro`
- `src/components/quote/EquipmentPickerCard.astro`
- `src/assets/icons/search.svg` (ícono nuevo — ver "Iconos" abajo)

**Archivos a modificar:**
- `src/lib/icons.ts` (registrar `search` en `ICON_NAMES`)
- `src/pages/cotizador.astro` (insertar `<EquipmentPicker />` entre la lista y el resumen; añadir toggle de topbar)
- `plans/quote-cart/README.md` (agregar spec 10 al índice y al diagrama)

**Depende de:** Specs 01, 02, 03, 04
**Bloquea a:** nada (es aditiva). El selector es independiente del formulario (spec 05) y del backend (spec 07).

---

## Objetivo

Permitir que el usuario **busque, filtre y agregue equipos adicionales al cotizador sin abandonar `/cotizador`**. La página deja de ser un mero editor de líneas para convertirse en un punto de descubrimiento + consolidación: el usuario ve su selección actual, ve equipos sugeridos del catálogo, filtra por categoría o texto, y agrega más con un click.

Referencia conceptual (no copia): [skrental.com/tiendaonline/webapp/carro](https://www.skrental.com/tiendaonline/webapp/carro), específicamente su bloque "Busca tu equipo + productos sugeridos + categorías". La versión IP Proyectos **no replica el modal de vista previa** ni el SKU de arriendo (esos datos no existen en `RENTAL_CATEGORIES` en v1): el selector es **embebido en línea**, con cards compactas y un CTA "Agregar al cotizador" por card.

## Por qué importa

- **Reduce fricción** en el flujo de selección: el usuario que llegó a `/cotizador` con 1 equipo y quiere sumar otro ya no tiene que volver al catálogo, navegar subcategorías, y volver. Un round-trip completo fuera del cotizador.
- **Aumenta el ticket promedio** del cotizador: la fricción cero para agregar hace que el usuario sume 2 o 3 equipos en lugar de 1, lo que se traduce en cotizaciones más jugosas.
- **SEO-friendly de forma pasiva**: la página `/cotizador` noindex (spec 04/08) sigue igual; la feature existe para humanos, no para crawlers.
- **Es zero-backend**: el selector lee de `RENTAL_CATEGORIES` (la misma fuente de verdad del catálogo). No introduce nuevos fetches, dependencias ni latencia.
- **Reutiliza la arquitectura existente**: `quoteCart.addItem`, el evento `ip-quote-cart-change`, el `quote-cart:toast` y los iconos `cart` / `check` ya funcionan; el selector es consumidor de esa API, no un sistema paralelo.

## Diseño visual

### Estado A — Carrito vacío (selector = contenido principal)

```
┌─ /cotizador ────────────────────────────────────────────────┐
│  HERO: "Tu Cotizador"                                       │
│                                                              │
│  ┌─ Carrito vacío ─────────────────────────────────────┐    │
│  │  🛒  Tu cotizador está vacío                         │    │
│  │  Agrega equipos desde el catálogo…                   │    │
│  │  [ Ver catálogo de arriendo → ]                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─ Descubre equipos para tu proyecto ───────────────────┐  │
│  │  ┌─ Buscador ─────────────────────────────────────┐  │  │
│  │  │ 🔍 Busca tu equipo por nombre o capacidad      │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  Categoría: [Todas v]  Subcategoría: [Todas v]        │  │
│  │  [✓] Ocultar equipos ya agregados                    │  │
│  │                                                       │  │
│  │  Resultados (12)                                      │  │
│  │  ┌─ card ─┐ ┌─ card ─┐ ┌─ card ─┐ ┌─ card ─┐        │  │
│  │  │ [img]  │ │ [img]  │ │ [img]  │ │ [img]  │        │  │
│  │  │ Grove  │ │ Tadano │ │ Lieb.  │ │ Grove  │        │  │
│  │  │ 100 t  │ │ 130 t  │ │ 150 t  │ │ 200 t  │        │  │
│  │  │ [ + ]  │ │ [ + ]  │ │ [ + ]  │ │ [ + ]  │        │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘        │  │
│  │  ┌─ card ─┐ ┌─ card ─┐ ┌─ card ─┐ ┌─ card ─┐        │  │
│  │  │ [img]  │ │ [img]  │ │ [img]  │ │ [img]  │        │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘        │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Estado B — Carrito con items (selector colapsado en `<details>`)

```
┌─ /cotizador ────────────────────────────────────────────────┐
│  HERO: "Tu Cotizador"                                       │
│  Topbar: [← Seguir agregando]  [× Limpiar cotizador]        │
│                                                              │
│  ┌─ Tu selección actual ───────────────────────────────┐    │
│  │  [Item 1: img + name + qty + period + start]        │    │
│  │  [Item 2: img + name + qty + period + start]        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ▾ Agregar más equipos (12 disponibles)  [details open]    │
│      ┌─ Buscador ─────────────────────────────────────┐     │
│      │ 🔍 Busca tu equipo por nombre o capacidad     │     │
│      └────────────────────────────────────────────────┘     │
│      Categoría: [Todas v]  Subcategoría: [Todas v]         │
│      [✓] Ocultar equipos ya agregados                       │
│      ┌─ Resultados (10) ─────────────────────────────┐     │
│      │ [card] [card] [card] [card]                    │     │
│      │ [card] [card] [card] [card]                    │     │
│      └────────────────────────────────────────────────┘     │
│      ⚠ Ya tienes 5 equipos en tu cotizador. Quita uno…     │
│                                                              │
│  ┌─ Resumen ──────────────────────────────────────────┐     │
│  │ 2 equipos · 3 unidades · 30 días agregados          │     │
│  │ [× Limpiar]  [📱 Enviar por WhatsApp]              │     │
│  └─────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

El `<details>` arranca **abierto** cuando hay menos de 3 items en el carrito, y **cerrado** en caso contrario (decisión de UX: si el usuario ya tiene varios, el siguiente paso es revisar/editar/enviar, no seguir sumando).

## Comportamiento

### Fuente de datos

- Los equipos se leen desde `RENTAL_CATEGORIES` (`@/data/rental.ts`). El frontmatter de `EquipmentPicker.astro` aplana el árbol en una lista `{ equipment, categorySlug, categoryName, subcategorySlug, subcategoryName }[]`. **No** se fetcha WordPress en v1; la fuente estática es la única verdad.
- El derivado se exporta como prop estática al renderizar, así el HTML inicial ya contiene los `data-` attributes que el script necesita (no requiere JSON injection ni fetch asíncrono para el primer paint).

### Filtros (estado en memoria del `<script>`)

| Filtro | Tipo | Default | Notas |
|---|---|---|---|
| `query` | `string` | `''` | Match contra `equipment.name`, `equipment.capacity`, `equipment.height` (case-insensitive, **accent-insensitive** vía `String.prototype.normalize('NFD').replace(/[\u0300-\u036f]/g, '')`) |
| `categorySlug` | `string \| 'all'` | `'all'` | Dropdown poblado con las 4 categorías de `RENTAL_CATEGORIES` + opción "Todas" |
| `subcategorySlug` | `string \| 'all'` | `'all'` | Dropdown dependiente; si `categorySlug === 'all'`, lista plana de todas las subcategorías con el prefijo `{Categoría} ›`; si hay categoría, solo sus subcategorías |
| `hideAlreadyInCart` | `boolean` | `true` | Cuando `true`, oculta los items ya presentes en el carrito. Toggle "Mostrar ya agregados" lo invierte. |

Debounce del input de búsqueda: **150 ms**.

### URL params (deep-linking)

El selector se inicializa leyendo `URLSearchParams` de la URL actual:

| Param | Efecto |
|---|---|
| `?q=grua` | Prefill del input de búsqueda |
| `?cat=izaje` | Preselecciona categoría |
| `?subcat=gruas-100-toneladas` | Preselecciona subcategoría |
| `?showInCart=1` | Inicializa `hideAlreadyInCart = false` |

Tras cualquier cambio de filtro se llama a `history.replaceState` (nunca `pushState`) para mantener la URL sincronizada sin contaminar el historial del back button.

Si un slug de URL no existe en `RENTAL_CATEGORIES`, se ignora silenciosamente y se trata como `'all'`.

### State management

- El estado vive **en variables locales del `<script>`** de `EquipmentPicker.astro` (no se exporta, no se persiste entre páginas). La fuente de verdad para los items en sí sigue siendo `localStorage` vía `quoteCart.ts`.
- El componente se suscribe a `quoteCart.subscribe` para re-renderizar cuando el carrito cambie.
- Re-render: cada vez que cambia cualquier filtro o el carrito, se reconstruye el bloque `[data-picker-results]` con `innerHTML = ''` + `cardString(...)`. La lista de filtros **no** se re-renderiza (preserva foco y estado del input).

### Add action

Cuando el usuario hace click en "Agregar al cotizador":

1. `addItem(equipment, sourceUrl)` desde `@/lib/quoteCart.ts`. `sourceUrl` se pasa como `Astro.url.pathname` (siempre `/cotizador`).
2. Si `result.ok === true`:
   - Cambiar el label del botón a "¡Agregado!" por **1.5 s** (vuelve al texto original).
   - Re-renderizar resultados (el item recién agregado desaparece si `hideAlreadyInCart === true`).
   - Dispatchar `window.dispatchEvent(new CustomEvent('quote_add_item', { detail: { slug } }))` para analytics futuras.
3. Si `result.reason === 'max_items'`:
   - Mostrar el banner superior: "Ya tienes 5 equipos en tu cotizador. Quita uno para agregar otro."
   - Dispatchar `quote-cart:toast` con `kind: 'warning'`, `message: 'Máximo 5 equipos por cotización.'`.
4. Si `result.reason === 'storage_unavailable'`:
   - Dispatchar `quote-cart:toast` con `kind: 'error'`, `message: 'No se pudo guardar. Intenta en una ventana normal del navegador.'`.

### Cap alcanzado (UX preventiva)

Si `getCart().items.length >= QUOTE_CART_MAX_ITEMS` (constante = 5, en `@/types/quote`):

- Todos los botones "Agregar al cotizador" se renderizan con `aria-disabled="true"`, texto "Máximo alcanzado" y visualmente muteados.
- Aparece un `<div role="status">` sobre la grilla con el mensaje: "Ya tienes 5 equipos en tu cotizador. Quita uno para agregar otro."
- El input de búsqueda, los selects y el toggle siguen funcionando (el usuario puede explorar antes de decidir).

### Empty results

Si los filtros retornan 0 equipos, se muestra un panel en lugar de la grilla:

```
No encontramos equipos con esos filtros.
[ Limpiar filtros ]   [ Volver al catálogo ]
```

El botón "Limpiar filtros" resetea `query`, `categorySlug`, `subcategorySlug` a sus defaults; el toggle "Mostrar ya agregados" se apaga.

## API / Tipos

No se crean nuevos tipos en `@/types/quote`. El selector consume `Equipment` (de `@/data/rental`), `RENTAL_CATEGORIES` (helper existente), y la API pública de `@/lib/quoteCart` (`addItem`, `subscribe`, `getCart`, `hasEquipment`).

Tipos locales (definidos en el frontmatter de `EquipmentPicker.astro` y exportados solo para su uso interno):

```ts
// src/components/quote/EquipmentPicker.astro (frontmatter)
import type { Equipment } from '@/data/rental';
import type { RentalCategory, RentalSubcategory } from '@/data/rental';

/** Equipo aplanado con su ubicación en la jerarquía. */
interface PickerEntry {
  equipment: Equipment;
  categorySlug: string;
  categoryName: string;
  subcategorySlug: string;
  subcategoryName: string;
}

/** Estado de filtros. */
interface PickerState {
  query: string;
  categorySlug: string;
  subcategorySlug: string;
  hideAlreadyInCart: boolean;
}
```

Re-export de `EquipmentLocation` (ya existe en `@/lib/quoteCart.ts:32-37`) se usa en el `addItem` indirectamente; el selector no necesita importarlo porque pasa el `Equipment` completo (la API lo resuelve).

## Markup y estilos

### `src/components/quote/EquipmentPicker.astro`

```astro
---
// src/components/quote/EquipmentPicker.astro
// Selector embebido de equipos. Permite buscar, filtrar por categoría
// y agregar al cotizador sin salir de /cotizador. Self-contained:
// todo el state vive en el <script> del componente.

import Icon from '@/components/ui/Icon.astro';
import EquipmentPickerCard from '@/components/quote/EquipmentPickerCard.astro';
import { RENTAL_CATEGORIES } from '@/data/rental';
import { QUOTE_CART_MAX_ITEMS } from '@/types/quote';

interface PickerEntry {
  equipment: import('@/data/rental').Equipment;
  categorySlug: string;
  categoryName: string;
  subcategorySlug: string;
  subcategoryName: string;
}

// Aplanar RENTAL_CATEGORIES a una lista de equipos con su ubicación.
// Se ejecuta en build time; cero runtime cost.
const ALL_EQUIPMENT: PickerEntry[] = RENTAL_CATEGORIES.flatMap((category) =>
  category.subcategories.flatMap((subcategory) =>
    subcategory.catalog.map((equipment) => ({
      equipment,
      categorySlug: category.slug,
      categoryName: category.name,
      subcategorySlug: subcategory.slug,
      subcategoryName: subcategory.name,
    }))
  )
);

const totalEquipment = ALL_EQUIPMENT.length;
const categories = RENTAL_CATEGORIES.map((c) => ({ slug: c.slug, name: c.name }));

export interface Props {
  /** Default: abierto si el cart tiene < 3 items, cerrado si ≥ 3. */
  defaultOpen?: boolean;
}

const { defaultOpen = true } = Astro.props;
---

<section
  class="picker"
  data-quote-picker
  data-total-equipment={totalEquipment}
  aria-label="Selector de equipos adicionales"
>
  <details class="picker__accordion" open={defaultOpen}>
    <summary class="picker__summary">
      <span class="picker__summary-icon" aria-hidden="true">
        <Icon name="search" size={18} />
      </span>
      <span class="picker__summary-label">
        Agregar más equipos
        <span class="picker__summary-count" data-picker-total>
          ({totalEquipment} disponibles)
        </span>
      </span>
      <span class="picker__summary-chevron" aria-hidden="true">
        <Icon name="chevron-down" size={18} />
      </span>
    </summary>

    <div class="picker__body">
      <div class="picker__cap-warning" data-picker-cap-warning hidden role="status">
        <Icon name="warning" size={16} />
        <span>
          Ya tienes <strong data-picker-cap-count>5</strong> equipos en tu cotizador.
          Quita uno para agregar otro.
        </span>
      </div>

      <div class="picker__filters">
        <div class="picker__search">
          <label for="picker-query" class="picker__label">Busca tu equipo</label>
          <div class="picker__search-input">
            <Icon name="search" size={16} class="picker__search-icon" />
            <input
              type="search"
              id="picker-query"
              class="picker__input"
              placeholder="Nombre, capacidad, altura…"
              autocomplete="off"
              data-picker-query
              aria-describedby="picker-query-hint"
            />
          </div>
          <p id="picker-query-hint" class="picker__hint">
            Ej: "Grove 100", "150 t", "pluma 88 m"
          </p>
        </div>

        <div class="picker__filter">
          <label for="picker-category" class="picker__label">Categoría</label>
          <select id="picker-category" class="picker__select" data-picker-category>
            <option value="all">Todas las categorías</option>
            {categories.map((c) => (
              <option value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div class="picker__filter">
          <label for="picker-subcategory" class="picker__label">Subcategoría</label>
          <select
            id="picker-subcategory"
            class="picker__select"
            data-picker-subcategory
            disabled
          >
            <option value="all">Todas</option>
          </select>
        </div>
      </div>

      <div class="picker__toggle">
        <label class="picker__toggle-label">
          <input
            type="checkbox"
            class="picker__toggle-input"
            data-picker-hide-incart
            checked
          />
          <span>Ocultar equipos ya agregados</span>
        </label>
        <p
          class="picker__live"
          data-picker-live
          aria-live="polite"
          aria-atomic="true"
        ></p>
      </div>

      <div class="picker__results" data-picker-results>
        {/* SSR initial: renderiza todas las cards. El script las reemplaza al hidratar. */}
        {ALL_EQUIPMENT.map((entry) => (
          <EquipmentPickerCard
            entry={entry}
            sourceUrl={Astro.url.pathname}
          />
        ))}
      </div>

      <div class="picker__empty" data-picker-empty hidden>
        <p>No encontramos equipos con esos filtros.</p>
        <div class="picker__empty-actions">
          <button
            type="button"
            class="picker__empty-btn"
            data-picker-action="reset"
          >
            Limpiar filtros
          </button>
          <a href="/arriendo" class="picker__empty-link">
            Volver al catálogo
            <Icon name="arrow-right" size={14} />
          </a>
        </div>
      </div>
    </div>
  </details>
</section>

<script>
  import {
    addItem,
    subscribe,
    getCart,
    QUOTE_CART_MAX_ITEMS_MAX,
  } from '@/lib/quoteCart';
  import { QUOTE_CART_MAX_ITEMS } from '@/types/quote';
  import { RENTAL_CATEGORIES } from '@/data/rental';
  import type { Equipment } from '@/data/rental';

  if (typeof window !== 'undefined') {
    type PickerEntry = {
      equipment: Equipment;
      categorySlug: string;
      categoryName: string;
      subcategorySlug: string;
      subcategoryName: string;
    };

    const root = document.querySelector<HTMLElement>('[data-quote-picker]');
    if (!root) {
      // Selector no presente en esta página; nada que hacer.
    } else {
      const queryEl = root.querySelector<HTMLInputElement>('[data-picker-query]');
      const catEl = root.querySelector<HTMLSelectElement>('[data-picker-category]');
      const subEl = root.querySelector<HTMLSelectElement>('[data-picker-subcategory]');
      const hideToggle = root.querySelector<HTMLInputElement>('[data-picker-hide-incart]');
      const resultsEl = root.querySelector<HTMLElement>('[data-picker-results]');
      const emptyEl = root.querySelector<HTMLElement>('[data-picker-empty]');
      const capWarn = root.querySelector<HTMLElement>('[data-picker-cap-warning]');
      const capCount = root.querySelector<HTMLElement>('[data-picker-cap-count]');
      const liveEl = root.querySelector<HTMLElement>('[data-picker-live]');

      // Aplanar el árbol (cliente) — duplica la lógica del frontmatter
      // pero evita pedir el JSON via data-attributes (sería 1+KB extra).
      const ALL: PickerEntry[] = RENTAL_CATEGORIES.flatMap((c) =>
        c.subcategories.flatMap((s) =>
          s.catalog.map((equipment) => ({
            equipment,
            categorySlug: c.slug,
            categoryName: c.name,
            subcategorySlug: s.slug,
            subcategoryName: s.name,
          }))
        )
      );

      const state = {
        query: '',
        categorySlug: 'all',
        subcategorySlug: 'all',
        hideAlreadyInCart: true,
      };

      // ─── Utilidades ───

      function normalize(s: string): string {
        return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      }

      function readUrlParams(): void {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        const cat = params.get('cat');
        const sub = params.get('subcat');
        const showInCart = params.get('showInCart');
        if (q != null) state.query = q;
        if (cat != null && (cat === 'all' || categories().some((c) => c.slug === cat))) {
          state.categorySlug = cat;
        }
        if (sub != null && (sub === 'all' || allSubcategories().some((s) => s.slug === sub))) {
          state.subcategorySlug = sub;
        }
        if (showInCart === '1') state.hideAlreadyInCart = false;
      }

      function writeUrlParams(): void {
        const params = new URLSearchParams();
        if (state.query) params.set('q', state.query);
        if (state.categorySlug !== 'all') params.set('cat', state.categorySlug);
        if (state.subcategorySlug !== 'all') params.set('subcat', state.subcategorySlug);
        if (!state.hideAlreadyInCart) params.set('showInCart', '1');
        const search = params.toString();
        const next = search ? `?${search}` : window.location.pathname;
        if (next !== window.location.pathname + window.location.search) {
          window.history.replaceState({}, '', next);
        }
      }

      function categories(): { slug: string; name: string }[] {
        return RENTAL_CATEGORIES.map((c) => ({ slug: c.slug, name: c.name }));
      }

      function allSubcategories(): { slug: string; name: string; categorySlug: string; categoryName: string }[] {
        return RENTAL_CATEGORIES.flatMap((c) =>
          c.subcategories.map((s) => ({
            slug: s.slug,
            name: s.name,
            categorySlug: c.slug,
            categoryName: c.name,
          }))
        );
      }

      function availableSubcategories(): { slug: string; name: string; prefix?: string }[] {
        if (state.categorySlug === 'all') {
          return allSubcategories().map((s) => ({
            slug: s.slug,
            name: s.name,
            prefix: s.categoryName,
          }));
        }
        const cat = RENTAL_CATEGORIES.find((c) => c.slug === state.categorySlug);
        if (!cat) return [];
        return cat.subcategories.map((s) => ({ slug: s.slug, name: s.name }));
      }

      function matches(entry: PickerEntry, cart: { items: { equipmentSlug: string }[] }): boolean {
        // Texto libre
        if (state.query) {
          const haystack = normalize(
            [
              entry.equipment.name,
              entry.equipment.capacity,
              entry.equipment.height ?? '',
            ].join(' ')
          );
          const needle = normalize(state.query);
          if (!haystack.includes(needle)) return false;
        }
        // Categoría
        if (state.categorySlug !== 'all' && entry.categorySlug !== state.categorySlug) {
          return false;
        }
        // Subcategoría
        if (state.subcategorySlug !== 'all' && entry.subcategorySlug !== state.subcategorySlug) {
          return false;
        }
        // Hide in cart
        if (state.hideAlreadyInCart) {
          if (cart.items.some((i) => i.equipmentSlug === entry.equipment.slug)) return false;
        }
        return true;
      }

      function escapeHtml(s: string): string {
        return s.replace(/[&<>"']/g, (ch) => {
          const map: Record<string, string> = {
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
          };
          return map[ch] ?? ch;
        });
      }

      function renderCard(entry: PickerEntry, atCap: boolean, inCart: boolean): string {
        const e = entry.equipment;
        const safeName = escapeHtml(e.name);
        const safeCapacity = escapeHtml(e.capacity);
        const safeHeight = e.height ? escapeHtml(e.height) : '';
        const safeSubcategory = escapeHtml(entry.subcategoryName);
        const safeCategory = escapeHtml(entry.categoryName);
        const safeImage = escapeHtml(e.image);

        const label = atCap && !inCart ? 'Máximo alcanzado' : inCart ? 'En el cotizador' : 'Agregar al cotizador';
        const buttonState = atCap && !inCart ? 'cap' : inCart ? 'added' : 'idle';
        const disabled = atCap && !inCart ? 'disabled' : '';

        return `
          <article
            class="picker-card ${inCart ? 'is-in-cart' : ''}"
            data-picker-card
            data-equipment-slug="${escapeHtml(e.slug)}"
            tabindex="0"
            role="article"
            aria-label="${safeName}, capacidad ${safeCapacity}"
          >
            <div class="picker-card__media">
              <img
                src="${safeImage}"
                alt="${safeName}"
                class="picker-card__image"
                loading="lazy"
                width="240"
                height="180"
              />
              ${inCart ? `<span class="picker-card__badge" aria-label="Ya en el cotizador">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                En el cotizador
              </span>` : ''}
            </div>
            <div class="picker-card__body">
              <span class="picker-card__category">${safeCategory} · ${safeSubcategory}</span>
              <h3 class="picker-card__name">${safeName}</h3>
              <p class="picker-card__capacity">
                ${safeCapacity}${safeHeight ? ' · ' + safeHeight : ''}
              </p>
              <button
                type="button"
                class="picker-card__add ${buttonState === 'added' ? 'is-added' : ''} ${buttonState === 'cap' ? 'is-cap' : ''}"
                data-picker-add
                data-equipment-slug="${escapeHtml(e.slug)}"
                data-name="${safeName}"
                data-capacity="${safeCapacity}"
                data-height="${safeHeight}"
                data-image="${safeImage}"
                data-source-url="${escapeHtml(window.location.pathname)}"
                aria-label="Agregar ${safeName} al cotizador"
                aria-disabled="${buttonState === 'cap' ? 'true' : 'false'}"
                ${disabled}
              >
                <span class="picker-card__add-label" data-picker-add-label>
                  ${escapeHtml(label)}
                </span>
              </button>
            </div>
          </article>
        `;
      }

      function renderResults(): void {
        if (!resultsEl) return;
        const cart = getCart();
        const uniqueCount = cart.items.length;
        const atCap = uniqueCount >= QUOTE_CART_MAX_ITEMS;

        const filtered = ALL.filter((entry) => matches(entry, cart));
        const inCartSlugs = new Set(cart.items.map((i) => i.equipmentSlug));

        if (filtered.length === 0) {
          resultsEl.hidden = true;
          if (emptyEl) emptyEl.hidden = false;
        } else {
          resultsEl.hidden = false;
          if (emptyEl) emptyEl.hidden = true;
          resultsEl.innerHTML = filtered
            .map((entry) =>
              renderCard(entry, atCap, inCartSlugs.has(entry.equipment.slug))
            )
            .join('');
        }

        // Banner de cap
        if (capWarn && capCount) {
          if (atCap) {
            capCount.textContent = String(uniqueCount);
            capWarn.hidden = false;
          } else {
            capWarn.hidden = true;
          }
        }

        // ARIA live
        if (liveEl) {
          const filterDesc = [
            state.query && `"${state.query}"`,
            state.categorySlug !== 'all' &&
              categories().find((c) => c.slug === state.categorySlug)?.name,
          ]
            .filter(Boolean)
            .join(', ');
          const suffix = filterDesc ? ` Filtro aplicado: ${filterDesc}.` : '';
          liveEl.textContent = `Mostrando ${filtered.length} equipos.${suffix}`;
        }
      }

      function refreshSubcategoryOptions(): void {
        if (!subEl) return;
        const subs = availableSubcategories();
        if (state.categorySlug === 'all') {
          // Mostrar todas con prefijo de categoría
          subEl.innerHTML =
            `<option value="all">Todas</option>` +
            subs
              .map(
                (s) =>
                  `<option value="${escapeHtml(s.slug)}">${escapeHtml(
                    s.prefix + ' › ' + s.name
                  )}</option>`
              )
              .join('');
        } else {
          subEl.innerHTML =
            `<option value="all">Todas</option>` +
            subs
              .map((s) => `<option value="${escapeHtml(s.slug)}">${escapeHtml(s.name)}</option>`)
              .join('');
        }
        // Si la subcategoría actual no está disponible, reset
        if (state.subcategorySlug !== 'all' && !subs.some((s) => s.slug === state.subcategorySlug)) {
          state.subcategorySlug = 'all';
        }
        subEl.value = state.subcategorySlug;
        subEl.disabled = subs.length === 0;
      }

      function applyStateToInputs(): void {
        if (queryEl) queryEl.value = state.query;
        if (catEl) catEl.value = state.categorySlug;
        if (hideToggle) hideToggle.checked = state.hideAlreadyInCart;
        refreshSubcategoryOptions();
      }

      function debounce<T extends (...args: never[]) => void>(fn: T, ms: number): T {
        let t: ReturnType<typeof setTimeout> | null = null;
        return ((...args: Parameters<T>) => {
          if (t) clearTimeout(t);
          t = setTimeout(() => fn(...args), ms);
        }) as T;
      }

      // ─── Wiring ───

      readUrlParams();
      applyStateToInputs();

      const debouncedQuery = debounce((value: string) => {
        state.query = value;
        writeUrlParams();
        renderResults();
      }, 150);

      queryEl?.addEventListener('input', () => {
        if (queryEl) debouncedQuery(queryEl.value);
      });

      catEl?.addEventListener('change', () => {
        if (catEl) {
          state.categorySlug = catEl.value;
          state.subcategorySlug = 'all';
          refreshSubcategoryOptions();
          writeUrlParams();
          renderResults();
        }
      });

      subEl?.addEventListener('change', () => {
        if (subEl) {
          state.subcategorySlug = subEl.value;
          writeUrlParams();
          renderResults();
        }
      });

      hideToggle?.addEventListener('change', () => {
        if (hideToggle) {
          state.hideAlreadyInCart = hideToggle.checked;
          writeUrlParams();
          renderResults();
        }
      });

      // Click delegation para "Agregar"
      root.addEventListener('click', (event) => {
        const target = event.target as HTMLElement | null;
        if (!target) return;

        // Reset de empty state
        const resetBtn = target.closest<HTMLElement>('[data-picker-action="reset"]');
        if (resetBtn) {
          state.query = '';
          state.categorySlug = 'all';
          state.subcategorySlug = 'all';
          state.hideAlreadyInCart = true;
          applyStateToInputs();
          writeUrlParams();
          renderResults();
          return;
        }

        // Add item
        const addBtn = target.closest<HTMLButtonElement>('[data-picker-add]');
        if (!addBtn || addBtn.disabled || addBtn.getAttribute('aria-disabled') === 'true') return;
        event.preventDefault();

        const slug = addBtn.dataset.equipmentSlug;
        const name = addBtn.dataset.name;
        const capacity = addBtn.dataset.capacity;
        const height = addBtn.dataset.height || undefined;
        const image = addBtn.dataset.image;
        const sourceUrl = addBtn.dataset.sourceUrl;
        if (!slug || !name || !capacity || !image || !sourceUrl) return;

        const equipment: Equipment = {
          slug,
          name,
          capacity,
          height,
          shortDesc: '',
          features: [],
          image,
          whatsappMessage: '',
        };

        const result = addItem(equipment, sourceUrl);
        if (!result.ok) {
          if (result.reason === 'max_items') {
            window.dispatchEvent(
              new CustomEvent('quote-cart:toast', {
                detail: { kind: 'warning', message: 'Máximo 5 equipos por cotización.' },
              })
            );
            return;
          }
          if (result.reason === 'storage_unavailable') {
            window.dispatchEvent(
              new CustomEvent('quote-cart:toast', {
                detail: { kind: 'error', message: 'No se pudo guardar. Intenta en una ventana normal del navegador.' },
              })
            );
            return;
          }
          window.dispatchEvent(
            new CustomEvent('quote-cart:toast', {
              detail: { kind: 'error', message: 'No se pudo agregar el equipo.' },
            })
          );
          return;
        }

        // Feedback inline 1.5s
        const labelEl = addBtn.querySelector<HTMLElement>('[data-picker-add-label]');
        if (labelEl) {
          const prev = labelEl.textContent ?? 'Agregar al cotizador';
          labelEl.textContent = '¡Agregado!';
          window.setTimeout(() => {
            labelEl.textContent = prev;
          }, 1500);
        }

        window.dispatchEvent(new CustomEvent('quote_add_item', { detail: { slug } }));
        // El subscribe() más abajo re-renderiza; no hace falta renderResults() manual.
      });

      // Re-render cuando el carrito cambia
      subscribe(() => {
        renderResults();
      });

      // Pintar estado inicial (los inputs ya están aplicados)
      renderResults();
    }
  }
</script>

<style>
  .picker {
    margin: 1.5rem 0;
  }

  .picker__accordion {
    background-color: var(--color-surface, #fff);
    border: 1px solid var(--color-line, #e2e4e5);
    border-radius: 16px;
    overflow: hidden;
  }

  .picker__summary {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    cursor: pointer;
    list-style: none;
    user-select: none;
    font-family: var(--font-heading, 'Plateia', 'Arial Narrow', sans-serif);
    font-weight: 700;
    font-size: 1rem;
    color: var(--color-ink, #242627);
    transition: background-color 0.15s var(--ease-out, ease);
  }

  .picker__summary::-webkit-details-marker {
    display: none;
  }

  .picker__summary:hover,
  .picker__summary:focus-visible {
    background-color: var(--color-surface-alt, #f6f7f8);
  }

  .picker__summary:focus-visible {
    outline: 2px solid var(--color-brand, #348f41);
    outline-offset: -2px;
  }

  .picker__summary-icon {
    color: var(--color-brand, #348f41);
    display: inline-flex;
  }

  .picker__summary-label {
    flex: 1;
  }

  .picker__summary-count {
    font-weight: 500;
    color: var(--color-ink-700, #3a3d3e);
    margin-left: 0.5rem;
  }

  .picker__summary-chevron {
    color: var(--color-ink-700, #3a3d3e);
    transition: transform 0.2s var(--ease-out, ease);
  }

  .picker__accordion[open] .picker__summary-chevron {
    transform: rotate(180deg);
  }

  .picker__body {
    padding: 1.25rem;
    border-top: 1px solid var(--color-line, #e2e4e5);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .picker__cap-warning {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: #fef3c7;
    color: #92400e;
    border: 1px solid #f59e0b;
    border-radius: 10px;
    font-size: 0.9rem;
  }

  .picker__filters {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }

  @media (min-width: 640px) {
    .picker__filters {
      grid-template-columns: 2fr 1fr 1fr;
    }
  }

  .picker__label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-ink-700, #3a3d3e);
    margin-bottom: 0.375rem;
  }

  .picker__search-input {
    position: relative;
    display: flex;
    align-items: center;
  }

  .picker__search-icon {
    position: absolute;
    left: 0.75rem;
    color: var(--color-ink-700, #3a3d3e);
    pointer-events: none;
  }

  .picker__input {
    width: 100%;
    padding: 0.625rem 0.75rem 0.625rem 2.25rem;
    border: 1px solid var(--color-line, #e2e4e5);
    border-radius: 8px;
    font-family: var(--font-body, 'Bliss Pro', sans-serif);
    font-size: 0.95rem;
    background-color: var(--color-surface, #fff);
  }

  .picker__input:focus {
    outline: 2px solid var(--color-brand, #348f41);
    border-color: var(--color-brand, #348f41);
  }

  .picker__hint {
    margin: 0.375rem 0 0;
    font-size: 0.8rem;
    color: var(--color-ink-500, #6b7072);
  }

  .picker__select {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-line, #e2e4e5);
    border-radius: 8px;
    font-family: var(--font-body, 'Bliss Pro', sans-serif);
    font-size: 0.95rem;
    background-color: var(--color-surface, #fff);
    color: var(--color-ink, #242627);
  }

  .picker__select:focus {
    outline: 2px solid var(--color-brand, #348f41);
    border-color: var(--color-brand, #348f41);
  }

  .picker__select:disabled {
    background-color: var(--color-surface-alt, #f6f7f8);
    color: var(--color-ink-500, #6b7072);
  }

  .picker__toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .picker__toggle-label {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--color-ink, #242627);
    cursor: pointer;
  }

  .picker__toggle-input {
    accent-color: var(--color-brand, #348f41);
  }

  .picker__live {
    margin: 0;
    font-size: 0.85rem;
    color: var(--color-ink-500, #6b7072);
  }

  .picker__live:not(:empty)::before {
    content: '· ';
  }

  .picker__results {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .picker__results {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .picker__results {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }
  }

  .picker__empty {
    padding: 2rem 1rem;
    text-align: center;
    background-color: var(--color-surface-alt, #f6f7f8);
    border: 1px dashed var(--color-line, #e2e4e5);
    border-radius: 12px;
  }

  .picker__empty p {
    margin: 0 0 1rem;
    color: var(--color-ink-700, #3a3d3e);
  }

  .picker__empty-actions {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .picker__empty-btn {
    padding: 0.625rem 1.25rem;
    background-color: transparent;
    color: var(--color-brand, #348f41);
    border: 1.5px solid var(--color-brand, #348f41);
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .picker__empty-btn:hover,
  .picker__empty-btn:focus-visible {
    background-color: var(--color-brand-050, #ebf5ed);
  }

  .picker__empty-btn:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .picker__empty-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--color-ink, #242627);
    font-weight: 600;
    text-decoration: none;
  }

  .picker__empty-link:hover,
  .picker__empty-link:focus-visible {
    color: var(--color-brand, #348f41);
  }

  .picker__empty-link:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
    border-radius: 4px;
  }
</style>
```

### `src/components/quote/EquipmentPickerCard.astro`

Esta card se usa **solo en el SSR inicial** (cuando JS aún no corrió). Una vez que el script de `EquipmentPicker` se hidrata, las cards se re-renderizan con el markup controlado por `renderCard()` (que incluye el estado de cap, el badge "En el cotizador", etc.). Tener el componente Astro aparte permite:

1. **No-JS fallback**: si JS falla, el usuario ve las cards y puede usar los `<button>` que internamente llaman `addItem` vía el `click` listener delegado (definido en `QuoteAddButton.astro`, ya montado globalmente).
2. **Build-time rendering**: el HTML inicial viene con todas las cards renderizadas, evitando layout shift.

```astro
---
// src/components/quote/EquipmentPickerCard.astro
// Card de un equipo en el grid del selector. Pensada para SSR + no-JS fallback;
// la versión interactiva (con estado de cap y badge "en el cotizador") la
// genera EquipmentPicker.astro en el cliente.

import Icon from '@/components/ui/Icon.astro';

export interface Props {
  entry: {
    equipment: import('@/data/rental').Equipment;
    categorySlug: string;
    categoryName: string;
    subcategorySlug: string;
    subcategoryName: string;
  };
  sourceUrl: string;
}

const { entry, sourceUrl } = Astro.props;
const e = entry.equipment;
---

<article
  class="picker-card"
  data-picker-card
  data-equipment-slug={e.slug}
  tabindex="0"
  role="article"
  aria-label={`${e.name}, capacidad ${e.capacity}`}
>
  <div class="picker-card__media">
    <img
      src={e.image}
      alt={e.name}
      class="picker-card__image"
      loading="lazy"
      width="240"
      height="180"
    />
  </div>
  <div class="picker-card__body">
    <span class="picker-card__category">
      {entry.categoryName} · {entry.subcategoryName}
    </span>
    <h3 class="picker-card__name">{e.name}</h3>
    <p class="picker-card__capacity">
      {e.capacity}{e.height ? ` · ${e.height}` : ''}
    </p>
    <button
      type="button"
      class="picker-card__add"
      data-picker-add
      data-equipment-slug={e.slug}
      data-name={e.name}
      data-capacity={e.capacity}
      data-height={e.height ?? ''}
      data-image={e.image}
      data-source-url={sourceUrl}
      aria-label={`Agregar ${e.name} al cotizador`}
    >
      <span class="picker-card__add-icon" aria-hidden="true">
        <Icon name="cart" size={14} />
      </span>
      <span data-picker-add-label>Agregar al cotizador</span>
    </button>
  </div>
</article>

<style>
  .picker-card {
    display: flex;
    flex-direction: column;
    background-color: var(--color-surface, #fff);
    border: 1px solid var(--color-line, #e2e4e5);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.15s var(--ease-out, ease), border-color 0.15s var(--ease-out, ease);
  }

  .picker-card:hover,
  .picker-card:focus-within {
    border-color: var(--color-brand, #348f41);
    transform: translateY(-2px);
  }

  .picker-card:focus-visible {
    outline: 2px solid var(--color-brand, #348f41);
    outline-offset: 2px;
  }

  .picker-card__media {
    position: relative;
    aspect-ratio: 4 / 3;
    background-color: var(--color-graphite, #0d1611);
    overflow: hidden;
  }

  .picker-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .picker-card__badge {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background-color: var(--color-brand, #348f41);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-radius: 999px;
  }

  .picker-card__body {
    padding: 0.875rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    flex: 1;
  }

  .picker-card__category {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-ink-500, #6b7072);
  }

  .picker-card__name {
    margin: 0;
    font-family: var(--font-heading, 'Plateia', 'Arial Narrow', sans-serif);
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--color-ink, #242627);
    line-height: 1.25;
  }

  .picker-card__capacity {
    margin: 0;
    font-size: 0.85rem;
    color: var(--color-ink-700, #3a3d3e);
  }

  .picker-card__add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: auto;
    padding: 0.625rem 1rem;
    background-color: var(--color-brand, #348f41);
    color: var(--color-on-brand, #fff);
    font-family: var(--font-heading, 'Plateia', 'Arial Narrow', sans-serif);
    font-weight: 700;
    font-size: 0.85rem;
    border: 1.5px solid transparent;
    border-radius: 999px;
    cursor: pointer;
    transition: background-color 0.15s var(--ease-out, ease), color 0.15s var(--ease-out, ease),
      border-color 0.15s var(--ease-out, ease);
  }

  .picker-card__add:hover,
  .picker-card__add:focus-visible {
    background-color: var(--color-brand-600, #2c7c37);
  }

  .picker-card__add:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .picker-card__add.is-added {
    background-color: transparent;
    color: var(--color-brand, #348f41);
    border-color: var(--color-brand, #348f41);
  }

  .picker-card__add.is-cap,
  .picker-card__add[aria-disabled='true'] {
    background-color: var(--color-surface-alt, #f6f7f8);
    color: var(--color-ink-500, #6b7072);
    border-color: var(--color-line, #e2e4e5);
    cursor: not-allowed;
  }

  .picker-card__add-icon {
    display: inline-flex;
  }
</style>
```

### Modificaciones a `src/pages/cotizador.astro`

Tres cambios:

1. Importar `EquipmentPicker`.
2. Calcular `defaultOpen` en el frontmatter según el estado del carrito (al renderizar en build, el carrito es 0 — usamos un proxy: siempre abierto por default; el script lo cierra si hay ≥ 3 items).
3. Insertar `<EquipmentPicker />` entre `[data-quote-lines]` y `[data-quote-summary-wrapper]`. Además, añadir el toggle "Limpiar cotizador" en la topbar.

```astro
---
// src/pages/cotizador.astro (NUEVOS imports en el frontmatter)
import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/ui/Container.astro';
import SectionLayout from '@/components/ui/SectionLayout.astro';
import PageHero from '@/components/ui/PageHero.astro';
import Icon from '@/components/ui/Icon.astro';
import QuoteCartLine from '@/components/quote/QuoteCartLine.astro';
import QuoteCartSummary from '@/components/quote/QuoteCartSummary.astro';
import EquipmentPicker from '@/components/quote/EquipmentPicker.astro';
import { getSiteUrl } from '@/lib/seo';

const title = 'Tu Cotizador | IP Proyectos Industriales';
const description = 'Revisa los equipos seleccionados y envía tu cotización por WhatsApp.';
const canonical = getSiteUrl('/cotizador');
const heroImage = 'https://orangered-deer-742907.hostingersite.com/_astro/hero.DtCo2O4l.jpg';
---
```

En la topbar (modificar el bloque `.quote-page__topbar`):

```astro
<div class="quote-page__topbar">
  <a href="/arriendo" class="quote-page__back">
    <Icon name="arrow-left" size={16} />
    Seguir agregando equipos
  </a>
  <button
    type="button"
    class="quote-page__clear"
    data-quote-clear-top
    hidden
    aria-label="Limpiar todo el cotizador"
  >
    <Icon name="close" size={14} />
    Limpiar cotizador
  </button>
</div>
```

Inserción del picker (después de `[data-quote-lines]`, antes del summary):

```astro
<div class="quote-page__lines" data-quote-lines hidden>
  {/* Hydrated from localStorage on the client */}
</div>

<EquipmentPicker defaultOpen={true} />

<div class="quote-page__summary" data-quote-summary-wrapper hidden>
  <QuoteCartSummary />
</div>
```

Y en el `<script>` de la página, agregar al final del bloque `render()`:

```ts
function render(): void {
  if (!linesEl || !emptyEl || !summaryWrapper) return;
  const cart = getCart();
  const empty = cart.items.length === 0;
  emptyEl.hidden = !empty;
  linesEl.hidden = empty;
  summaryWrapper.hidden = empty;
  if (empty) {
    linesEl.innerHTML = '';
    hidePickerTopbarClear();
    return;
  }
  linesEl.innerHTML = cart.items.map((item) => renderLine(item)).join('');
  // Mostrar/ocultar el botón "Limpiar" del topbar
  const topbarClear = document.querySelector<HTMLButtonElement>('[data-quote-clear-top]');
  if (topbarClear) topbarClear.hidden = false;
  // Auto-colapsar el picker si hay ≥ 3 items
  const pickerDetails = document.querySelector<HTMLDetailsElement>('.picker__accordion');
  if (pickerDetails && cart.items.length >= 3) {
    pickerDetails.open = false;
  }
}
```

Más el handler (siguiendo el patrón del `clearBtn` existente en `QuoteCartSummary.astro`):

```ts
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null;
  const topbarClear = target?.closest<HTMLButtonElement>('[data-quote-clear-top]');
  if (topbarClear) {
    if (!confirm('¿Vaciar todo el cotizador? Esta acción no se puede deshacer.')) return;
    clearCart();
  }
});
```

CSS adicional para el topbar (extender `<style>`):

```css
.quote-page__topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.75rem;
}

.quote-page__clear {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.875rem;
  background-color: transparent;
  color: var(--color-ink-700, #3a3d3e);
  border: 1px solid var(--color-line, #e2e4e5);
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}

.quote-page__clear:hover,
.quote-page__clear:focus-visible {
  color: var(--color-danger, #c0392b);
  border-color: var(--color-danger, #c0392b);
}

.quote-page__clear:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

## Accesibilidad

| Elemento | Atributo | Justificación |
|---|---|---|
| `<input type="search">` | `<label for="picker-query">` + `aria-describedby="picker-query-hint"` | Label visible + hint del placeholder. |
| `<select>` de categoría | `<label for="picker-category">` | Label visible. |
| `<select>` de subcategoría | `<label for="picker-subcategory">` + `disabled` cuando no hay subcategorías | Estado deshabilitado comunicado. |
| Toggle "Ocultar ya agregados" | `<label>` envolvente con `<input type="checkbox">` | Label asociado implícitamente. |
| Card | `tabindex="0"` + `role="article"` + `aria-label="{name}, capacidad {capacity}"` | Único elemento focuseable por card; el botón interno hereda foco por tab. |
| Botón "Agregar" | `aria-label="Agregar {name} al cotizador"` + `aria-disabled="true"` cuando `atCap` | Estado deshabilitado accesible. |
| `<details>` accordion | `<summary>` con `aria-expanded` implícito (nativo de `<details>`) | Comportamiento nativo, sin ARIA custom. |
| Banner de cap | `role="status"` | Anuncio políte cuando aparece. |
| `<p data-picker-live>` | `aria-live="polite"` `aria-atomic="true"` | Anuncia cambios en la cantidad de resultados y filtros. |
| Empty state | `role="status"` no (es contenido permanente hasta nuevo render) | Solo aparece cuando hay 0 resultados. |

**Tab order**: search → categoría → subcategoría → toggle → cards (en orden visual) → reset de empty state (si está visible) → resto de la página.

**Focus visible**: cada elemento focuseable tiene `outline: 2px solid currentColor; outline-offset: 2px;`.

**Contraste**: textos principales en `--color-ink` (#242627) sobre `--color-surface` (#fff) — pasa WCAG AA. Banner de cap en `#92400e` sobre `#fef3c7` — pasa AA.

## Casos borde

- **`localStorage` no disponible** (modo incógnito restrictivo, cookie blockers): `addItem` retorna `{ ok: false, reason: 'storage_unavailable' }`. El selector atrapa el caso y dispatcha `quote-cart:toast` con mensaje claro. El selector sigue funcionando visualmente (los filtros, el render, la grilla), solo el botón "Agregar" no persiste. En SSR, `getCart()` retorna `createEmptyCart()` (spec 02).
- **Equipo eliminado del catálogo entre carga y add**: `addItem` (en `quoteCart.ts`) llama internamente a `equipmentToLocation(slug)`; si no lo encuentra, igual agrega el item con `categorySlug: ''` y `subcategorySlug: ''`. El spec 10 no añade validación extra: el catálogo es estático y no se modifica en runtime, así que este caso es esencialmente imposible en v1. Documentado para v2.
- **0 matches en filtro**: empty state con CTA "Limpiar filtros" + "Volver al catálogo" (ver markup arriba).
- **Búsqueda con caracteres especiales** (`ñ`, tildes, mayúsculas): `normalize()` aplica NFD + lowercase antes de comparar. Test: query "Grua" matches "Grúa Grove"; query "GRÚA 100t" matches "Grove GMK 4100 (100 t)".
- **Categoría cambiada pero subcategoría previa incompatible** (ej: estaba en `izaje / gruas-100-toneladas` y el usuario cambia a `energia`): `refreshSubcategoryOptions()` resetea `subcategorySlug` a `'all'` si la subcategoría actual no existe en la nueva categoría. La URL se actualiza al valor reseteado.
- **URL params inválidos** (`?cat=no-existe&subcat=tampoco`): `readUrlParams()` valida contra `categories()` y `allSubcategories()`; si el slug no existe, se ignora silenciosamente y se trata como `'all'`. Sin error visible.
- **`<details>` y prefers-reduced-motion**: la rotación del chevron usa `transform` con `transition`. Se respeta `prefers-reduced-motion: reduce` globalmente (ya está en `src/styles/base.css`).
- **Cap exacto (5 items)**: el botón "Agregar" se muestra deshabilitado pero el banner de cap aparece solo cuando `uniqueCount >= 5`. En el límite, todos los botones que no estén ya en el carrito se desactivan.
- **Re-render durante escritura del usuario**: el input de búsqueda **no** se re-renderiza (solo cambia `state.query` via debounced input); el foco se preserva. Las cards se re-renderizan pero no contienen elementos focuseables con estado (los botones usan `aria-label` y cambian label, no foco).
- **Submit con card ya en el carrito (race condition)**: si el usuario hace doble-click rápido en "Agregar", `addItem` deduplica (incrementa `quantity` en 1). El feedback "¡Agregado!" se muestra ambas veces, lo cual está bien.

## Iconos

### Nuevo: `search.svg`

El proyecto **no tiene** el ícono `search` todavía (ver `src/lib/icons.ts:5-32`). Sigue el mismo formato que `cart.svg` (24×24, `stroke="currentColor"`, fill none, lucide-style). El archivo se crea en `src/assets/icons/search.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
```

Y se registra en `src/lib/icons.ts`:

```ts
// src/lib/icons.ts (modificación)
export const ICON_NAMES = [
  'phone',
  'email',
  'menu',
  'close',
  'chevron-down',
  'chevron-up',
  'arrow-right',
  'arrow-left',
  'download',
  'whatsapp',
  'shield',
  'crane',
  'weight',
  'height',
  'certificate',
  'check',
  'warning',
  'linkedin',
  'instagram',
  'facebook',
  'location',
  'clock',
  'user',
  'file-text',
  'map-pin',
  'cart',
  'search', // ← NUEVO
] as const;
```

### Reutilizados (ya existen)

- `search` (nuevo, este spec)
- `chevron-down` (en el summary del accordion)
- `cart` (en el botón "Agregar" del SSR fallback)
- `warning` (en el banner de cap)
- `arrow-right` (en "Volver al catálogo" del empty state)
- `close` (en el botón "Limpiar cotizador" del topbar)

## Tareas

- [ ] Crear `src/assets/icons/search.svg` con el path indicado arriba.
- [ ] Agregar `'search'` al array `ICON_NAMES` en `src/lib/icons.ts`.
- [ ] Crear `src/components/quote/EquipmentPicker.astro` con todo el frontmatter, markup, script y styles del spec.
- [ ] Crear `src/components/quote/EquipmentPickerCard.astro` con la versión SSR-only.
- [ ] Modificar `src/pages/cotizador.astro`:
  - [ ] Importar `EquipmentPicker`.
  - [ ] Insertar `<EquipmentPicker defaultOpen={true} />` entre `[data-quote-lines]` y `[data-quote-summary-wrapper]`.
  - [ ] Modificar la `.quote-page__topbar` para incluir el botón `[data-quote-clear-top]`.
  - [ ] Agregar el handler de click para `data-quote-clear-top` en el `<script>` existente.
  - [ ] Agregar CSS para `.quote-page__topbar` (flex space-between) y `.quote-page__clear` (botón ghost).
- [ ] Modificar `plans/quote-cart/README.md`:
  - [ ] Agregar fila "10 | Selector embebido | 4 | ⬜ Pendiente | `src/components/quote/EquipmentPicker.astro`" al índice de specs.
  - [ ] Actualizar el diagrama de "Orden de implementación" para incluir spec 10 después de spec 04.
  - [ ] Añadir nota: "Spec 10 es aditiva; no bloquea specs 05-09."
- [ ] Validar con `npx astro check` que no hay errores de TypeScript.
- [ ] Validar con `npm run build` que la build estática pasa.
- [ ] Pruebas manuales (checklist):
  - [ ] Carrito vacío: el selector está **abierto por default** y muestra todas las cards.
  - [ ] Carrito con 1 item: el selector sigue abierto, muestra todas las cards excepto la ya agregada.
  - [ ] Carrito con 3+ items: el selector arranca **colapsado** (script lo cierra).
  - [ ] Escribir "grua" en el buscador → filtra en tiempo real (debounce 150ms).
  - [ ] Seleccionar categoría "Izaje" → solo se ven cards de izaje; subcategoría se actualiza.
  - [ ] Cambiar de categoría a una donde la subcategoría anterior no existe → subcategoría se resetea a "Todas".
  - [ ] Click en "Agregar al cotizador" → label cambia a "¡Agregado!" por 1.5s, luego "En el cotizador"; el item desaparece del grid (si toggle está activo); el badge del header incrementa.
  - [ ] Agregar 5 items → banner amarillo aparece, todos los botones (excepto los ya en el carrito) se deshabilitan con texto "Máximo alcanzado".
  - [ ] URL con `?q=grua&cat=izaje` → al cargar, los inputs ya están prellenados.
  - [ ] Cambiar un filtro → la URL se actualiza con `replaceState` (back button no se llena).
  - [ ] Recargar la página con `?subcat=gruas-100-toneladas` → la grilla filtra correctamente desde el primer paint.
  - [ ] Recargar la página con `?cat=categoria-inexistente` → el selector se trata como "Todas" sin error visible.
  - [ ] Click en "Limpiar cotizador" del topbar → confirma, vacía el carrito, vuelve al empty state.
  - [ ] Mobile (375px): grid de 1 columna, summary arriba del picker (orden natural del DOM).
  - [ ] Tablet (768px): grid de 2 columnas.
  - [ ] Desktop (1280px): grid de hasta 4-5 columnas (auto-fill, minmax 220px).
  - [ ] Tab keyboard: search → categoría → subcategoría → toggle → cards → reset de empty state.
  - [ ] Screen reader (VoiceOver/NVDA): el `aria-live` anuncia "Mostrando N equipos. Filtro aplicado: grúa." tras filtrar.

## Definition of Done

- [ ] `src/components/quote/EquipmentPicker.astro` existe y compila.
- [ ] `src/components/quote/EquipmentPickerCard.astro` existe y compila.
- [ ] `src/assets/icons/search.svg` existe y `src/lib/icons.ts` lo registra.
- [ ] `src/pages/cotizador.astro` muestra el `<EquipmentPicker />` entre la lista de líneas y el resumen, con el toggle "Limpiar cotizador" en el topbar.
- [ ] El selector funciona en estado vacío (abierto por default) y en estado con items (auto-colapsa a las 3+).
- [ ] El input de búsqueda filtra en tiempo real con debounce 150ms.
- [ ] Los selects de categoría y subcategoría filtran correctamente; la subcategoría se resetea cuando es incompatible.
- [ ] El botón "Agregar al cotizador" llama a `addItem()`, da feedback "¡Agregado!" por 1.5s, re-renderiza la grilla, y dispatcha `quote_add_item`.
- [ ] Los items ya en el carrito se ocultan por default; el toggle "Mostrar ya agregados" los revela.
- [ ] Al llegar al cap (5 items), todos los botones (no-en-carrito) se deshabilitan con texto "Máximo alcanzado" y aparece el banner amarillo.
- [ ] La URL se sincroniza con `?q=`, `?cat=`, `?subcat=`, `?showInCart=1` vía `history.replaceState`.
- [ ] Al recargar la página con `?cat=izaje&subcat=gruas-100-toneladas`, el selector se inicializa en ese estado.
- [ ] Empty state aparece con 0 matches y permite reset de filtros o volver al catálogo.
- [ ] `npx astro check` pasa sin errores.
- [ ] `npm run build` pasa con cero errores ni warnings nuevos.
- [ ] Responsive: 1 col mobile, 2 col tablet, auto-fill desktop.
- [ ] Accesibilidad: labels asociados, `aria-disabled` en cap, `aria-live` anunciando cambios, focus visible, contraste WCAG AA.
- [ ] `plans/quote-cart/README.md` actualizado con la fila de spec 10, la nota de aditividad y la nueva línea en el diagrama de orden.

## Referencias

- [README del plan](./README.md) — convenciones globales, decisiones D-01..D-12.
- Spec 01: [./01-data-model.md](./01-data-model.md) — `QuoteCartItem`, `QUOTE_CART_MAX_ITEMS`.
- Spec 02: [./02-cart-state-and-storage.md](./02-cart-state-and-storage.md) — `addItem`, `subscribe`, `getCart`, evento `ip-quote-cart-change`.
- Spec 03: [./03-add-to-cart-ui.md](./03-add-to-cart-ui.md) — patrón de cards con "Agregar al cotizador"; emite `quote_add_item`.
- Spec 04: [./04-cart-page.md](./04-cart-page.md) — la página `/cotizador` que recibe al selector.
- Spec 06: [./06-message-and-payload-builders.md](./06-message-and-payload-builders.md) — el resumen y el mensaje WhatsApp consumen el carrito que el selector ayuda a poblar.
- Spec 08: [./08-seo-analytics.md](./08-seo-analytics.md) — los `quote_add_item` que este spec dispatchea alimentan las conversiones de analytics.
- Plan del catálogo: [../rental-catalog/README.md](../rental-catalog/README.md) — `RENTAL_CATEGORIES` es la fuente de verdad del selector.
- `src/data/rental.ts` — `Equipment`, `RENTAL_CATEGORIES`, `findCategory`, `findSubcategory`.
- `src/lib/quoteCart.ts` — `addItem(equipment, sourceUrl)`, `subscribe(cb)`, `getCart()`, `hasEquipment(slug)`.
- `src/types/quote.ts` — `QUOTE_CART_MAX_ITEMS = 5`, tipos de `QuoteCartItem`.
- `src/components/ui/Icon.astro` + `src/lib/icons.ts` — registro de íconos; hay que añadir `search`.
- `src/assets/icons/cart.svg` — referencia del formato (24×24, stroke currentColor).
- Referencia visual externa: <https://www.skrental.com/tiendaonline/webapp/carro> (no copia; se usa solo para entender el patrón de UX).
