# Spec 02 — Estado del Carrito y Almacenamiento

**Fase:** 2
**Estado:** ⬜ Pendiente
**Archivos a crear:** `src/lib/quoteCart.ts`
**Depende de:** Spec 01 (tipos)
**Bloquea a:** specs 03, 04, 05, 06

---

## Objetivo

Implementar el **núcleo de estado** del cotizador: una API en `src/lib/quoteCart.ts` que maneja el carrito como singleton del navegador, persiste en `localStorage` con la key `ip_quote_cart_v1`, expone mutadores (`addItem`, `updateItem`, `removeItem`, `clear`, `setGlobalNotes`) y notifica cambios vía `CustomEvent` para sincronizar badge, contador, página `/cotizador` y botón flotante **sin** importar un framework reactivo.

## Por qué importa

- Es el **único punto** que toca `localStorage`. Componentes y páginas consumen la API, no el storage directo.
- Permite **sincronización cross-tab** vía el evento `storage` del navegador.
- Permite **hidratar el badge en cada navegación** sin un estado global: el script del badge lee el storage al cargar.
- La validación, el cap, la deduplicación y la sanitización viven aquí, no dispersos en componentes.

## API pública (`src/lib/quoteCart.ts`)

```ts
// src/lib/quoteCart.ts
// Estado del cotizador cotizador. Singleton del navegador, persistido en
// localStorage bajo la key 'ip_quote_cart_v1'. Emite CustomEvent
// 'quote-cart:change' en window cuando muta.

import type {
  QuoteCart,
  QuoteCartItem,
  QuoteCartItemCustomization,
  RenterContactData,
  EquipmentLocation,
} from '@/types/quote';
import {
  QUOTE_CART_MAX_ITEMS,
  QUOTE_CART_HARD_MAX_ITEMS,
  QUOTE_ITEM_MAX_QUANTITY,
  QUOTE_PERIOD_MAX_COUNT,
  QUOTE_NOTES_MAX_LENGTH,
  QUOTE_GLOBAL_NOTES_MAX_LENGTH,
} from '@/types/quote';

// ─────────────────────────────────────────────────────────────
// Constantes runtime
// ─────────────────────────────────────────────────────────────

export const STORAGE_KEY = 'ip_quote_cart_v1';
export const EVENT_NAME = 'quote-cart:change';

// ─────────────────────────────────────────────────────────────
// Resultado de mutación
// ─────────────────────────────────────────────────────────────

/** Códigos de error en mutaciones. */
export type QuoteCartError =
  | 'STORAGE_UNAVAILABLE'
  | 'CART_FULL'
  | 'INVALID_QUANTITY'
  | 'INVALID_PERIOD_COUNT'
  | 'INVALID_PERIOD_TYPE'
  | 'INVALID_DATE'
  | 'ITEM_NOT_FOUND'
  | 'NOTES_TOO_LONG'
  | 'PARSE_ERROR';

export interface QuoteCartMutationResult {
  ok: boolean;
  cart: QuoteCart;
  error?: QuoteCartError;
  errorMessage?: string;
}

// ─────────────────────────────────────────────────────────────
// Funciones puras (exportadas para tests y para quoteMessage.ts)
// ─────────────────────────────────────────────────────────────

/** Crea un carrito vacío. */
export function createEmptyCart(): QuoteCart;

/** Parsea y valida el JSON de localStorage. Si falla, retorna carrito vacío. */
export function parseCartFromStorage(): QuoteCart;

/** Persiste el carrito. Retorna true si escribió OK. */
export function saveCartToStorage(cart: QuoteCart): boolean;

/** Normaliza notas: trim + colapsa saltos de línea. */
export function sanitizeNotes(value: string, maxLength: number): string;

// ─────────────────────────────────────────────────────────────
// Mutadores (side effects: storage + CustomEvent)
// ─────────────────────────────────────────────────────────────

/**
 * Agrega un item al carrito. Si el `equipmentSlug` ya existe,
 * incrementa la cantidad en `1` y actualiza `updatedAt`.
 * Si excede QUOTE_CART_MAX_ITEMS en items únicos, retorna error CART_FULL.
 * Si excede QUOTE_ITEM_MAX_QUANTITY al mergear, retorna error INVALID_QUANTITY.
 */
export function addItem(
  equipment: EquipmentLocation,
  sourceUrl: string,
  options?: { quantity?: number }
): QuoteCartMutationResult;

/**
 * Actualiza la personalización de un item existente por `equipmentSlug`.
 * Retorna error ITEM_NOT_FOUND si no existe.
 */
export function updateItem(
  equipmentSlug: string,
  patch: Partial<QuoteCartItemCustomization>
): QuoteCartMutationResult;

/** Elimina un item por slug. */
export function removeItem(equipmentSlug: string): QuoteCartMutationResult;

/** Vacía el carrito completo. */
export function clearCart(): QuoteCartMutationResult;

/** Actualiza las notas globales del carrito. */
export function setGlobalNotes(notes: string): QuoteCartMutationResult;

// ─────────────────────────────────────────────────────────────
// Lectura
// ─────────────────────────────────────────────────────────────

/** Lee el carrito actual desde storage. */
export function getCart(): QuoteCart;

/** Cuenta items únicos (no quantity). */
export function getItemCount(): number;

/** Suma de quantity de todos los items. */
export function getTotalQuantity(): number;

/** Verifica si el carrito está vacío. */
export function isEmpty(): boolean;

/** Verifica si el carrito está en el cap (>= MAX). */
export function isAtCap(): boolean;

/** Encuentra un item por slug. */
export function findItem(equipmentSlug: string): QuoteCartItem | undefined;

// ─────────────────────────────────────────────────────────────
// Suscripción (sincronización entre componentes)
// ─────────────────────────────────────────────────────────────

/** Suscribe un listener a cambios del carrito. Retorna función de unsubscribe. */
export function subscribe(listener: (cart: QuoteCart) => void): () => void;

/** Emite el evento 'quote-cart:change' manualmente. */
export function emitChange(cart: QuoteCart): void;

// ─────────────────────────────────────────────────────────────
// Validación
// ─────────────────────────────────────────────────────────────

/** Valida que un item personalizado cumpla los rangos. */
export function validateCustomization(c: QuoteCartItemCustomization): {
  ok: boolean;
  errors: { field: string; message: string }[];
};

/** Normaliza la fecha a YYYY-MM-DD (acepta Date o string). */
export function normalizeDate(value: string | Date): string;

// ─────────────────────────────────────────────────────────────
// Sincronización cross-tab
// ─────────────────────────────────────────────────────────────

/** Inicializa el listener de `window.storage` para sincronizar entre pestañas. */
export function initStorageSync(): void;
```

## Implementación de referencia (esquema)

```ts
// Fragmento central: el save+emit que todas las mutaciones llaman.

function commit(cart: QuoteCart, error?: QuoteCartError, errorMessage?: string): QuoteCartMutationResult {
  if (!error) {
    saveCartToStorage(cart);
  }
  const result: QuoteCartMutationResult = { ok: !error, cart, error, errorMessage };
  // Solo emite si no hubo error O si el error es de validación (la UI debe enterarse igual)
  if (error === undefined || error === 'INVALID_QUANTITY' || error === 'INVALID_DATE' || error === 'NOTES_TOO_LONG') {
    emitChange(cart);
  }
  return result;
}

export function addItem(
  equipment: EquipmentLocation,
  sourceUrl: string,
  options: { quantity?: number } = {}
): QuoteCartMutationResult {
  if (!isStorageAvailable()) {
    return { ok: false, cart: getCart(), error: 'STORAGE_UNAVAILABLE', errorMessage: 'No se pudo acceder al almacenamiento del navegador.' };
  }
  const current = getCart();
  const existing = current.items.find((i) => i.equipmentSlug === equipment.slug);
  const addQty = options.quantity ?? 1;

  if (existing) {
    // Deduplicación: incrementa quantity
    const next = clampQuantity(existing.customization.quantity + addQty);
    if (next === existing.customization.quantity) {
      return { ok: false, cart: current, error: 'INVALID_QUANTITY', errorMessage: `Cantidad máxima por equipo: ${QUOTE_ITEM_MAX_QUANTITY}` };
    }
    const updated: QuoteCartItem = {
      ...existing,
      customization: { ...existing.customization, quantity: next },
      updatedAt: new Date().toISOString(),
    };
    return commit({ ...current, items: replaceItem(current.items, updated), updatedAt: updated.updatedAt });
  }

  if (current.items.length >= QUOTE_CART_HARD_MAX_ITEMS) {
    return { ok: false, cart: current, error: 'CART_FULL', errorMessage: `Máximo ${QUOTE_CART_MAX_ITEMS} equipos por cotización.` };
  }

  const now = new Date().toISOString();
  const newItem: QuoteCartItem = {
    equipmentSlug: equipment.slug,
    name: equipment.name,
    capacity: equipment.capacity,
    height: equipment.height,
    image: equipment.image,
    sourceUrl,
    customization: {
      quantity: clampQuantity(addQty),
      periodType: 'diario',
      periodCount: 1,
      startDate: defaultStartDate(),
      notes: '',
      transport: { required: false },
    },
    addedAt: now,
    updatedAt: now,
  };
  return commit({ ...current, items: [...current.items, newItem], updatedAt: now });
}
```

## Helper: `equipmentToLocation`

Convierte un `Equipment` a `EquipmentLocation` con sus slugs de categoría y subcategoría. **No** toca storage.

```ts
// src/lib/quoteCart.ts
import { RENTAL_CATEGORIES, findEquipment, findSubcategory, findCategory } from '@/data/rental';

/** Ubica un equipo por slug en el catálogo. */
export function equipmentToLocation(equipmentSlug: string): EquipmentLocation | undefined {
  for (const category of RENTAL_CATEGORIES) {
    for (const subcategory of category.subcategories) {
      const equipment = subcategory.catalog.find((e) => e.slug === equipmentSlug);
      if (equipment) {
        return {
          ...equipment,
          categorySlug: category.slug,
          categoryName: category.name,
          subcategorySlug: subcategory.slug,
          subcategoryName: subcategory.name,
        };
      }
    }
  }
  return undefined;
}
```

## Comportamiento de eventos

### `CustomEvent` en `window`

```ts
export function emitChange(cart: QuoteCart): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(EVENT_NAME, { detail: { cart, source: 'mutation' } })
  );
}
```

### `storage` event cross-tab

```ts
export function initStorageSync(): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    if (event.newValue === null) {
      // El carrito fue limpiado en otra pestaña
      emitChange(createEmptyCart());
      return;
    }
    const cart = parseCartFromString(event.newValue);
    emitChange(cart);
  });
}
```

### Patrón de suscripción

```ts
// Desde un componente Astro <script>:
import { getCart, subscribe } from '@/lib/quoteCart';

const update = () => {
  const cart = getCart();
  // actualizar badge, contador, etc.
};

subscribe(update);
update(); // lectura inicial
```

## SSR safety

Todas las funciones públicas verifican `typeof window === 'undefined'` antes de tocar storage o `window`. Esto permite que el código se importe en componentes `.astro` sin romper el build estático.

```ts
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const probe = '__quote_cart_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}
```

## Helpers de fecha

```ts
/** Devuelve hoy en formato YYYY-MM-DD (timezone del navegador). */
export function defaultStartDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1); // mañana
  return d.toISOString().slice(0, 10);
}

export function normalizeDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  // Asume YYYY-MM-DD; si no, intenta parsear.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) throw new Error('Invalid date');
  return parsed.toISOString().slice(0, 10);
}
```

## Default customization (al agregar)

| Campo | Default | Razón |
|---|---|---|
| `quantity` | `1` | el usuario ajusta después |
| `periodType` | `'diario'` | el más común para arriendos cortos |
| `periodCount` | `1` | el más conservador |
| `startDate` | mañana (`defaultStartDate()`) | evita fechas inválidas |
| `notes` | `''` | opcional |
| `transport.required` | `false` | se activa explícitamente |

## Cap de items

```ts
export function isAtCap(): boolean {
  return getCart().items.length >= QUOTE_CART_MAX_ITEMS;
}
```

- `QUOTE_CART_MAX_ITEMS = 5` → usado por la UI para **deshabilitar el botón "Agregar"** a partir del 5° item.
- `QUOTE_CART_HARD_MAX_ITEMS = 5` → usado por `addItem` para **rechazar** el 6° intento.

(En v1 ambos son 5; se separan para permitir UI más generosa en el futuro.)

## Compatibilidad de versiones

```ts
export function parseCartFromString(raw: string): QuoteCart {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return createEmptyCart();
  }
  if (!isValidCartShape(parsed)) {
    console.warn('quote cart: invalid shape, resetting');
    return createEmptyCart();
  }
  if (parsed.version !== 1) {
    console.warn(`quote cart: version mismatch (got ${parsed.version}), resetting`);
    return createEmptyCart();
  }
  return parsed;
}

function isValidCartShape(value: unknown): value is QuoteCart {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<QuoteCart>;
  return (
    typeof v.version === 'number' &&
    typeof v.updatedAt === 'string' &&
    Array.isArray(v.items)
  );
}
```

## Tareas

- [ ] Crear `src/lib/quoteCart.ts` con todas las funciones exportadas.
- [ ] Implementar `parseCartFromStorage` y `saveCartToStorage` con `try/catch` defensivo.
- [ ] Implementar `initStorageSync` y llamarlo desde el primer `<script>` del sitio (e.g., en `BaseLayout.astro` o en el header).
- [ ] Implementar los validadores `validateCustomization` y los helpers de fecha.
- [ ] Implementar `equipmentToLocation` que recorre `RENTAL_CATEGORIES`.
- [ ] Verificar que el bundle no incluye código que toque `localStorage` durante el build estático (SSR safety).
- [ ] Smoke test manual en consola del navegador:
  ```js
  const { addItem, getCart } = await import('/src/lib/quoteCart.ts');
  addItem({ slug: 'grua-grove-gmk-4100', name: 'Grove', capacity: '100 t', image: '', categorySlug: 'izaje', categoryName: 'Izaje', subcategorySlug: 'gruas-100-toneladas', subcategoryName: 'Grúas de 100t' }, window.location.href);
  console.log(getCart());
  ```

## Definition of Done

- [ ] `src/lib/quoteCart.ts` existe y compila sin warnings.
- [ ] Las 13 funciones públicas están exportadas.
- [ ] `addItem` deduplica por `equipmentSlug` (incrementa `quantity`).
- [ ] `addItem` rechaza cuando `items.length >= QUOTE_CART_HARD_MAX_ITEMS` con `CART_FULL`.
- [ ] `parseCartFromStorage` retorna carrito vacío en cualquier error de parse.
- [ ] `initStorageSync` se llama una vez al cargar la primera página.
- [ ] El evento `quote-cart:change` se dispara en `window` después de cada mutación exitosa.
- [ ] `localStorage.getItem('ip_quote_cart_v1')` contiene JSON válido con `version: 1`.
- [ ] El cap `QUOTE_CART_MAX_ITEMS = 5` se aplica correctamente.
- [ ] No hay `console.error` en operaciones normales.
- [ ] El bundle es < 4 KB minificado.

## Referencias

- [README del plan](./README.md) — convenciones, glosario.
- Spec 01: [./01-data-model.md](./01-data-model.md) — tipos `QuoteCart`, `QuoteCartItem`, `QuoteCartItemCustomization`.
- Spec 03: [./03-add-to-cart-ui.md](./03-add-to-cart-ui.md) — `QuoteAddButton` consume `addItem`.
- Spec 04: [./04-cart-page.md](./04-cart-page.md) — `/cotizador` consume `getCart`, `updateItem`, `removeItem`.
- Spec 08: [./08-seo-analytics.md](./08-seo-analytics.md) — `subscribe` se usa desde `quoteAnalytics.ts` para emitir eventos GA4.
- `src/data/rental.ts` — `RENTAL_CATEGORIES` consumido por `equipmentToLocation`.
- `src/components/layout/Header.astro` — lugar natural para invocar `initStorageSync()` en un `<script>`.
