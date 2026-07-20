// src/lib/quoteCart.ts
// Estado del cotizador. Singleton del navegador, persistido en
// localStorage bajo la key 'ip_quote_cart_v1'. Emite CustomEvent
// 'ip-quote-cart-change' en window cuando muta.

import type {
  QuoteCart,
  QuoteCartItem,
  QuoteCartItemCustomization,
} from '@/types/quote';
import {
  QUOTE_CART_MAX_ITEMS,
  QUOTE_CART_STORAGE_KEY,
  QUOTE_ITEM_MAX_QUANTITY,
  QUOTE_PERIOD_MAX_COUNT,
  QUOTE_NOTES_MAX_LENGTH,
  createDefaultCustomization,
} from '@/types/quote';
import type { Equipment } from '@/data/rental';
import { RENTAL_CATEGORIES } from '@/data/rental';

// ─────────────────────────────────────────────────────────────
// Constantes runtime
// ─────────────────────────────────────────────────────────────

const EVENT_NAME = 'ip-quote-cart-change';

// ─────────────────────────────────────────────────────────────
// Equipo con ubicación
// ─────────────────────────────────────────────────────────────

export interface EquipmentLocation extends Equipment {
  categorySlug: string;
  categoryName: string;
  subcategorySlug: string;
  subcategoryName: string;
}

// ─────────────────────────────────────────────────────────────
// Funciones puras
// ─────────────────────────────────────────────────────────────

/** Crea un carrito vacío. */
export function createEmptyCart(): QuoteCart {
  return {
    version: 1,
    updatedAt: new Date(0).toISOString(),
    items: [],
  };
}

/** Genera un lineId único (suficiente para v1). */
function generateLineId(): string {
  return `l_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Ubica un equipo en el catálogo. */
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

/** Verifica si localStorage está disponible. */
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const probe = '__ip_quote_cart_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/** Verifica si la forma del carrito es válida. */
function isValidCartShape(value: unknown): value is QuoteCart {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<QuoteCart>;
  return (
    v.version === 1 &&
    typeof v.updatedAt === 'string' &&
    Array.isArray(v.items)
  );
}

/** Parsea un string JSON de storage. */
function parseCartFromString(raw: string | null): QuoteCart {
  if (raw == null) return createEmptyCart();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    if (typeof console !== 'undefined') {
      console.warn('quote cart: parse error, resetting');
    }
    return createEmptyCart();
  }
  if (!isValidCartShape(parsed)) {
    if (typeof console !== 'undefined') {
      console.warn('quote cart: invalid shape, resetting');
    }
    return createEmptyCart();
  }
  // Defensive: cada item debe tener lineId
  parsed.items = (parsed.items as QuoteCartItem[]).filter(
    (i): i is QuoteCartItem =>
      typeof i === 'object' &&
      i !== null &&
      typeof i.equipmentSlug === 'string' &&
      typeof i.lineId === 'string'
  );
  return parsed;
}

/** Lee el carrito desde storage. */
function readCartFromStorage(): QuoteCart {
  if (typeof window === 'undefined') return createEmptyCart();
  try {
    return parseCartFromString(window.localStorage.getItem(QUOTE_CART_STORAGE_KEY));
  } catch {
    return createEmptyCart();
  }
}

/** Persiste el carrito. */
function writeCartToStorage(cart: QuoteCart): boolean {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(QUOTE_CART_STORAGE_KEY, JSON.stringify(cart));
    return true;
  } catch {
    return false;
  }
}

/** Emite el evento de cambio. */
function emitChange(cart: QuoteCart): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: cart }));
}

/** Inicializa listener de storage para sync cross-tab. */
export function initStorageSync(): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('storage', (event) => {
    if (event.key !== QUOTE_CART_STORAGE_KEY) return;
    if (event.newValue === null) {
      emitChange(createEmptyCart());
      return;
    }
    emitChange(parseCartFromString(event.newValue));
  });
}

/** Sanitiza notas. */
function sanitizeNotes(value: string | undefined, max: number): string {
  if (!value) return '';
  let out = value.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  out = out.trim();
  if (out.length > max) out = out.slice(0, max).trim();
  return out;
}

// ─────────────────────────────────────────────────────────────
// API pública
// ─────────────────────────────────────────────────────────────

/** Lee el carrito actual. SSR-safe: retorna carrito vacío si no hay window. */
export function getCart(): QuoteCart {
  return readCartFromStorage();
}

/** Suma de `quantity` de todos los items. 0 si vacío. */
export function getItemCount(): number {
  return readCartFromStorage().items.reduce((sum, i) => sum + i.customization.quantity, 0);
}

/** Cantidad de items únicos. */
export function getItemUniqueCount(): number {
  return readCartFromStorage().items.length;
}

/** Verifica si el carrito ya tiene un equipo por slug. */
export function hasEquipment(equipmentSlug: string): boolean {
  return readCartFromStorage().items.some((i) => i.equipmentSlug === equipmentSlug);
}

/** Suscribe un listener a cambios del carrito. Retorna la función de unsubscribe. */
export function subscribe(callback: (cart: QuoteCart) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const handler = (event: Event) => {
    const e = event as CustomEvent<QuoteCart>;
    callback(e.detail);
  };
  window.addEventListener(EVENT_NAME, handler);
  // Cross-tab
  const storageHandler = (event: StorageEvent) => {
    if (event.key !== QUOTE_CART_STORAGE_KEY) return;
    callback(parseCartFromString(event.newValue));
  };
  window.addEventListener('storage', storageHandler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', storageHandler);
  };
}

/** Resultado de mutación. */
export interface MutationResult {
  ok: boolean;
  reason?: 'max_items' | 'not_found' | 'invalid' | 'storage_unavailable';
}

/** Limpia el carrito. */
export function clearCart(): MutationResult {
  if (!isStorageAvailable()) return { ok: false, reason: 'storage_unavailable' };
  const empty = createEmptyCart();
  empty.updatedAt = new Date().toISOString();
  writeCartToStorage(empty);
  emitChange(empty);
  return { ok: true };
}

/** Remueve un item por lineId. */
export function removeItem(lineId: string): MutationResult {
  const current = readCartFromStorage();
  const next = current.items.filter((i) => i.lineId !== lineId);
  if (next.length === current.items.length) return { ok: false, reason: 'not_found' };
  const updated: QuoteCart = {
    ...current,
    items: next,
    updatedAt: new Date().toISOString(),
  };
  writeCartToStorage(updated);
  emitChange(updated);
  return { ok: true };
}

/** Actualiza la personalización de un item. */
export function updateItem(
  lineId: string,
  patch: Partial<QuoteCartItemCustomization>
): MutationResult {
  const current = readCartFromStorage();
  const idx = current.items.findIndex((i) => i.lineId === lineId);
  if (idx === -1) return { ok: false, reason: 'not_found' };
  const existing = current.items[idx];
  if (!existing) return { ok: false, reason: 'not_found' };
  const merged: QuoteCartItemCustomization = {
    ...existing.customization,
    ...patch,
    transport: patch.transport ?? existing.customization.transport,
    transportAddress: patch.transportAddress ?? existing.customization.transportAddress,
    notes:
      patch.notes !== undefined
        ? sanitizeNotes(patch.notes, QUOTE_NOTES_MAX_LENGTH)
        : existing.customization.notes,
  };
  // Clamp de rangos.
  if (merged.quantity > QUOTE_ITEM_MAX_QUANTITY) merged.quantity = QUOTE_ITEM_MAX_QUANTITY;
  if (merged.periodCount > QUOTE_PERIOD_MAX_COUNT) merged.periodCount = QUOTE_PERIOD_MAX_COUNT;
  if (merged.transport === 'no') merged.transportAddress = undefined;

  const updatedItem: QuoteCartItem = { ...existing, customization: merged };
  const nextItems = [...current.items];
  nextItems[idx] = updatedItem;
  const updated: QuoteCart = {
    ...current,
    items: nextItems,
    updatedAt: new Date().toISOString(),
  };
  writeCartToStorage(updated);
  emitChange(updated);
  return { ok: true };
}

/** Agrega un item al carrito. */
export function addItem(equipment: Equipment, sourceUrl: string): MutationResult {
  const current = readCartFromStorage();
  const existing = current.items.find((i) => i.equipmentSlug === equipment.slug);
  if (existing) {
    // Deduplicación: incrementa quantity en 1.
    const next = Math.min(QUOTE_ITEM_MAX_QUANTITY, existing.customization.quantity + 1);
    if (next === existing.customization.quantity) {
      return { ok: false, reason: 'invalid' };
    }
    return updateItem(existing.lineId, { quantity: next });
  }
  if (current.items.length >= QUOTE_CART_MAX_ITEMS) {
    return { ok: false, reason: 'max_items' };
  }
  const location = equipmentToLocation(equipment.slug);
  const now = new Date().toISOString();
  const newItem: QuoteCartItem = {
    lineId: generateLineId(),
    equipmentSlug: equipment.slug,
    name: equipment.name,
    capacity: equipment.capacity,
    height: equipment.height,
    image: equipment.image,
    categorySlug: location?.categorySlug ?? '',
    subcategorySlug: location?.subcategorySlug ?? '',
    sourceUrl,
    customization: createDefaultCustomization(equipment, sourceUrl),
    addedAt: now,
  };
  const updated: QuoteCart = {
    ...current,
    items: [...current.items, newItem],
    updatedAt: now,
  };
  writeCartToStorage(updated);
  emitChange(updated);
  return { ok: true };
}
