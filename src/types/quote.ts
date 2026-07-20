// src/types/quote.ts
// Tipos del cotizador. Una sola fuente de verdad para el frontend
// (Astro, TS) y el contrato JSON del endpoint REST de WordPress
// (POST /wp-json/ip/v1/quote-request).

import type { Equipment } from '@/data/rental';

// ─────────────────────────────────────────────────────────────
// Catálogo y períodos
// ─────────────────────────────────────────────────────────────

/** Tipos de periodo de arriendo aceptados en v1. */
export const PERIOD_TYPES = ['diario', 'semanal', 'mensual'] as const;
export type PeriodType = (typeof PERIOD_TYPES)[number];

/** Etiqueta visible por periodo (para UI). */
export const PERIOD_TYPE_LABELS: Record<PeriodType, string> = {
  diario: 'Diario',
  semanal: 'Semanal',
  mensual: 'Mensual',
};

// ─────────────────────────────────────────────────────────────
// Validación (rangos, caps, regex)
// ─────────────────────────────────────────────────────────────

/** Cap blando de items en el carrito. Superarlo muestra warning. */
export const QUOTE_CART_MAX_ITEMS = 5;

/** Cantidad mínima y máxima por item. */
export const QUOTE_ITEM_MIN_QUANTITY = 1;
export const QUOTE_ITEM_MAX_QUANTITY = 50;

/** Cantidad de periodos mínima y máxima por item. */
export const QUOTE_PERIOD_MIN_COUNT = 1;
export const QUOTE_PERIOD_MAX_COUNT = 365;

/** Largo máximo de notas por item y de notas globales. */
export const QUOTE_NOTES_MAX_LENGTH = 280;
export const QUOTE_GLOBAL_NOTES_MAX_LENGTH = 500;

/** Storage key (constante compartida con quoteCart.ts). */
export const QUOTE_CART_STORAGE_KEY = 'ip_quote_cart_v1';

// ─────────────────────────────────────────────────────────────
// Item: snapshot del equipo + personalización
// ─────────────────────────────────────────────────────────────

/** Personalización de un item del cotizador. */
export interface QuoteCartItemCustomization {
  /** Cantidad de unidades. Default 1, rango [1, 50]. */
  quantity: number;
  /** Tipo de periodo de arriendo. */
  periodType: PeriodType;
  /** Cantidad de periodos (ej: 3 con periodType='mensual' = 3 meses). */
  periodCount: number;
  /** Fecha de inicio del arriendo. Formato 'YYYY-MM-DD' (date-only). */
  startDate: string;
  /** Notas libres del item. Opcional, max 280 chars. */
  notes?: string;
  /** Traslado a la faena. */
  transport: 'si' | 'no';
  /** Dirección de entrega (requerida si `transport = 'si'`). */
  transportAddress?: string;
}

/** Item completo del cotizador. */
export interface QuoteCartItem {
  /** Identificador único de la línea. */
  lineId: string;
  /** Slug del equipo en RENTAL_CATEGORIES. FK hacia Equipment. */
  equipmentSlug: string;
  /** Snapshot del nombre al momento de agregar. */
  name: string;
  /** Snapshot de la capacidad (ej: "100 t"). */
  capacity: string;
  /** Snapshot de la altura máxima (opcional). */
  height?: string;
  /** Snapshot de la URL de imagen. */
  image: string;
  /** Slug de la categoría (snapshot). */
  categorySlug: string;
  /** Slug de la subcategoría (snapshot). */
  subcategorySlug: string;
  /** URL de la página de catálogo desde donde se agregó. */
  sourceUrl: string;
  /** Personalización del item. */
  customization: QuoteCartItemCustomization;
  /** ISO 8601 timestamp de agregado. */
  addedAt: string;
}

// ─────────────────────────────────────────────────────────────
// Carrito: contenedor con versionado
// ─────────────────────────────────────────────────────────────

/** Carrito cotizador completo, persistido en localStorage. */
export interface QuoteCart {
  /** Versión del schema. */
  version: 1;
  /** ISO 8601 timestamp de la última operación. */
  updatedAt: string;
  /** Lista de items en orden de agregado. */
  items: QuoteCartItem[];
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Deriva la fecha de inicio por defecto: hoy + 7 días, en YYYY-MM-DD. */
function defaultStartDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Crea una personalización por defecto para un equipo recién agregado. */
export function createDefaultCustomization(
  _equipment: Equipment,
  _sourceUrl: string
): QuoteCartItemCustomization {
  return {
    quantity: 1,
    periodType: 'mensual',
    periodCount: 1,
    startDate: defaultStartDate(),
    transport: 'no',
  };
}

/** Resultado de validación. */
export interface CustomizationValidation {
  valid: boolean;
  errors: Record<string, string>;
}

/** Valida una personalización contra los rangos definidos. */
export function validateCustomization(c: QuoteCartItemCustomization): CustomizationValidation {
  const errors: Record<string, string> = {};
  if (!Number.isFinite(c.quantity) || c.quantity < QUOTE_ITEM_MIN_QUANTITY) {
    errors.quantity = `La cantidad mínima es ${QUOTE_ITEM_MIN_QUANTITY}.`;
  } else if (c.quantity > QUOTE_ITEM_MAX_QUANTITY) {
    errors.quantity = `La cantidad máxima es ${QUOTE_ITEM_MAX_QUANTITY}.`;
  }
  if (!PERIOD_TYPES.includes(c.periodType)) {
    errors.periodType = 'Tipo de periodo no válido.';
  }
  if (!Number.isFinite(c.periodCount) || c.periodCount < QUOTE_PERIOD_MIN_COUNT) {
    errors.periodCount = `La cantidad de periodos mínima es ${QUOTE_PERIOD_MIN_COUNT}.`;
  } else if (c.periodCount > QUOTE_PERIOD_MAX_COUNT) {
    errors.periodCount = `La cantidad de periodos máxima es ${QUOTE_PERIOD_MAX_COUNT}.`;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(c.startDate)) {
    errors.startDate = 'Fecha inválida (YYYY-MM-DD).';
  }
  if (c.notes && c.notes.length > QUOTE_NOTES_MAX_LENGTH) {
    errors.notes = `Las notas no pueden superar ${QUOTE_NOTES_MAX_LENGTH} caracteres.`;
  }
  if (c.transport !== 'si' && c.transport !== 'no') {
    errors.transport = 'Opción de traslado no válida.';
  }
  if (c.transport === 'si' && (!c.transportAddress || !c.transportAddress.trim())) {
    errors.transportAddress = 'Indica la dirección de traslado.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

/** Convierte un periodo a días calendario aproximados. */
export function customizationToDays(c: QuoteCartItemCustomization): number {
  const unit = c.periodType === 'diario' ? 1 : c.periodType === 'semanal' ? 7 : 30;
  return Math.max(0, unit * c.periodCount);
}
