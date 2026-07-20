# Spec 01 — Modelo de Datos (Data Layer)

**Fase:** 1
**Estado:** ⬜ Pendiente
**Archivos a crear:** `src/types/quote.ts`
**Depende de:** Spec 00
**Bloquea a:** specs 02, 04, 05, 06, 07

---

## Objetivo

Definir los **tipos TypeScript canónicos** del cotizador y el **contrato de almacenamiento** en `localStorage`. Esta spec es la fuente única de verdad para todos los módulos que tocan el carrito: `quoteCart.ts` (spec 02), `QuoteCartLine.astro` (spec 04), `QuoteRequestForm.astro` (spec 05), `quoteMessage.ts` (spec 06) y el endpoint REST (spec 07).

Nada de lo que se defina aquí debe duplicar lo que ya existe en `src/data/rental.ts`. El carrito **referencia** los equipos por `equipmentSlug` y guarda **snapshots** inmutables del nombre, capacidad e imagen, de modo que si el catálogo cambia, el carrito del usuario siga siendo legible.

## Por qué importa

- Sin tipos claros, cada componente redefine el shape y los wire-ups rompen en runtime.
- El versionado (`version: 1`) y el cap (`QUOTE_CART_MAX_ITEMS`) viven aquí; cambiarlos después requiere migración.
- El payload REST y el snapshot del carrito **comparten el mismo shape**: una decisión aquí se propaga al backend (spec 07).

## Tipos exportados

Todos los tipos viven en `src/types/quote.ts` y se importan como `@/types/quote`. Cero dependencias de runtime.

```ts
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

/** Métodos de contacto preferidos que el cliente declara. */
export const CONTACT_METHODS = ['whatsapp', 'email', 'phone'] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

// ─────────────────────────────────────────────────────────────
// Validación (rangos, caps, regex)
// ─────────────────────────────────────────────────────────────

/** Cap blando de items en el carrito. Superarlo muestra warning. */
export const QUOTE_CART_MAX_ITEMS = 5;

/** Cap duro para submit (rechaza si excede). Coincide con el blando en v1. */
export const QUOTE_CART_HARD_MAX_ITEMS = 5;

/** Cantidad mínima y máxima por item. */
export const QUOTE_ITEM_MIN_QUANTITY = 1;
export const QUOTE_ITEM_MAX_QUANTITY = 50;

/** Cantidad de periodos mínima y máxima por item. */
export const QUOTE_PERIOD_MIN_COUNT = 1;
export const QUOTE_PERIOD_MAX_COUNT = 365;

/** Largo máximo de notas por item y de notas globales. */
export const QUOTE_NOTES_MAX_LENGTH = 280;
export const QUOTE_GLOBAL_NOTES_MAX_LENGTH = 500;

/** Regex de RUT chileno (sin puntos con miles; los puntos se normalizan antes). */
export const RUT_REGEX = /^\d{7,8}-[0-9Kk]$/;

/** Longitud mínima de campos de texto libre. */
export const RENTER_NAME_MIN = 3;
export const RENTER_COMPANY_MIN = 2;
export const RENTER_REGION_MIN = 3;
export const RENTER_COMMUNE_MIN = 3;
export const RENTER_WORKPLACE_MIN = 3;

/** Regex de teléfono chileno: acepta +56 9 ... o 9 ... con 9 dígitos totales. */
export const PHONE_DIGITS_REGEX = /^\+?56?9?\d{8}$/;

// ─────────────────────────────────────────────────────────────
// Item: snapshot del equipo + personalización
// ─────────────────────────────────────────────────────────────

/** Traslado opcional por item. */
export interface QuoteCartItemTransport {
  /** El cliente requiere transporte a la faena. */
  required: boolean;
  /** Dirección de entrega (opcional, requerida si `required = true`). */
  address?: string;
}

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
  /** Traslado del equipo a la faena. */
  transport: QuoteCartItemTransport;
}

/** Item completo del cotizador. */
export interface QuoteCartItem {
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
  /** URL de la página de catálogo desde donde se agregó. */
  sourceUrl: string;
  /** Personalización del item. */
  customization: QuoteCartItemCustomization;
  /** ISO 8601 timestamp de agregado. */
  addedAt: string;
  /** ISO 8601 timestamp de última edición. */
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────
// Carrito: contenedor con versionado
// ─────────────────────────────────────────────────────────────

/** Carrito cotizador completo, persistido en localStorage. */
export interface QuoteCart {
  /** Versión del schema. Incrementar ante cambio incompatible. */
  version: 1;
  /** ISO 8601 timestamp de la última operación. */
  updatedAt: string;
  /** Lista de items en orden de agregado. */
  items: QuoteCartItem[];
  /** Notas globales (opcional, max 500 chars). */
  globalNotes?: string;
}

// ─────────────────────────────────────────────────────────────
// Datos del solicitante (form paso 2)
// ─────────────────────────────────────────────────────────────

/** Datos del solicitante del arriendo. Mapea a `contact` en el payload REST. */
export interface RenterContactData {
  /** Nombre y apellido. Requerido, min 3, max 80. */
  name: string;
  /** Empresa. Requerido, min 2, max 80. */
  company: string;
  /** RUT empresa. Opcional, regex /^\d{7,8}-[0-9Kk]$/. */
  rut?: string;
  /** Email. Requerido, formato email. */
  email: string;
  /** Teléfono. Requerido, 9 dígitos con prefijo +56 opcional. */
  phone: string;
  /** Región. Requerido, libre, min 3. */
  region: string;
  /** Comuna. Requerido, libre, min 3. */
  commune: string;
  /** Lugar de atención (faena o dirección). Requerido, min 3. */
  workplace: string;
  /** Método de contacto preferido. */
  contactMethod: ContactMethod;
  /** Mensaje libre adicional. Opcional, max 1000. */
  message?: string;
  /** Acepta términos. Debe ser true. */
  terms: boolean;
}

// ─────────────────────────────────────────────────────────────
// Payload REST (POST /wp-json/ip/v1/quote-request)
// ─────────────────────────────────────────────────────────────

/** Metadatos técnicos del payload (atribución, UA, UTM). */
export interface QuoteRequestMeta {
  /** URL de la página de origen (última navegación). */
  sourceUrl: string;
  /** User-Agent del navegador. */
  userAgent: string;
  /** ISO 8601 timestamp de submit (cliente). */
  submittedAt: string;
  /** UTM parameters (opcional, propagados si existen). */
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}

/** Payload completo que el frontend POSTea al endpoint de WP. */
export interface QuoteRequest {
  /** Versión del contrato REST. */
  version: '1';
  /** Items del carrito (post-personalización). */
  items: QuoteCartItem[];
  /** Datos del solicitante. */
  contact: RenterContactData;
  /** Notas globales opcionales. */
  globalNotes?: string;
  /** Metadatos técnicos. */
  meta: QuoteRequestMeta;
  /** Honeypot: bots lo llenan; humanos no lo ven. Debe ir vacío. */
  honeypot: string;
}

// ─────────────────────────────────────────────────────────────
// Respuesta REST
// ─────────────────────────────────────────────────────────────

/** Resultado de validación por campo. */
export interface QuoteFieldError {
  /** Path del campo en formato punto (ej: "items.0.startDate"). */
  field: string;
  /** Mensaje legible (en español, mostrado en UI). */
  message: string;
}

/** Respuesta exitosa del endpoint. */
export interface QuoteRequestSuccess {
  ok: true;
  /** ID del lead guardado (si CPT activado); null si solo email. */
  leadId: number | null;
  /** Mensaje de confirmación. */
  message: string;
}

/** Respuesta de error del endpoint. */
export interface QuoteRequestError {
  ok: false;
  /** Código de error legible por máquina. */
  code:
    | 'validation_error'
    | 'rate_limited'
    | 'honeypot_triggered'
    | 'unknown_equipment'
    | 'server_error';
  /** Mensaje de error (en español). */
  message: string;
  /** Errores por campo (solo para `validation_error`). */
  fieldErrors?: QuoteFieldError[];
}

/** Union: el endpoint siempre retorna una de estas dos. */
export type QuoteRequestResponse = QuoteRequestSuccess | QuoteRequestError;

// ─────────────────────────────────────────────────────────────
// Helpers de derivación (re-exportar desde quoteCart.ts)
// ─────────────────────────────────────────────────────────────

/** Tipo derivado: `Equipment` aplanado con su category+subcategory. */
export interface EquipmentLocation extends Equipment {
  categorySlug: string;
  categoryName: string;
  subcategorySlug: string;
  subcategoryName: string;
}
```

## Esquema JSON de `localStorage`

```json
{
  "version": 1,
  "updatedAt": "2026-07-15T10:30:00.000Z",
  "globalNotes": "",
  "items": [
    {
      "equipmentSlug": "grua-grove-gmk-4100",
      "name": "Grove GMK 4100",
      "capacity": "100 t",
      "height": "88 m",
      "image": "/_astro/hero.hash.webp",
      "sourceUrl": "https://ipproyectosindustriales.cl/arriendo/izaje/gruas-100-toneladas",
      "customization": {
        "quantity": 1,
        "periodType": "mensual",
        "periodCount": 3,
        "startDate": "2026-08-15",
        "notes": "faena Candelaria",
        "transport": {
          "required": true,
          "address": "Ruta 5 km al norte de Caldera"
        }
      },
      "addedAt": "2026-07-15T10:25:00.000Z",
      "updatedAt": "2026-07-15T10:28:00.000Z"
    }
  ]
}
```

### Versionado y migración

- **Storage key:** `ip_quote_cart_v1`. La parte `_v1` es **fija**; cambiar el schema es romper la key, no bumpear la key. Si la key cambia, los usuarios con la v1 siguen viendo el carrito perdido (y se les muestra el estado vacío).
- **`version` interno:** campo dentro del JSON, igual a `1` en v1.
- **Migración futura:** al parsear, si `parsed.version !== 1` se descarta el carrito y se loguea en consola (`console.warn('quote cart: version mismatch, resetting')`).
- **Nunca** se hace `JSON.parse` directo desde `localStorage` sin pasar por la función de validación (spec 02).

## Convenciones

### Slugs y nombres

- **`equipmentSlug`** es la FK; debe existir en `RENTAL_CATEGORIES[].subcategories[].catalog[].slug`.
- **`name`, `capacity`, `height`, `image`** son **snapshots** inmutables al momento de agregar; el carrito nunca consulta el catálogo para renderizar (así sobrevive a renombres).
- **`sourceUrl`** se usa en analytics y como pie del mensaje WhatsApp.

### Cantidades y períodos

- `quantity` siempre `>= 1`; si el usuario escribe `0` o negativo, se rechaza con error `INVALID_QUANTITY`.
- `periodCount` siempre `>= 1`; máximo 365 (un año de períodos diarios).
- `periodType` ∈ `{diario, semanal, mensual}`; cualquier otro valor falla validación.
- `startDate` es **date-only** (`YYYY-MM-DD`); no se almacena hora.

### Teléfono y RUT

- **Frontend:** se acepta `+56 9 1234 5678`, `9 1234 5678`, `912345678`. Se normaliza a `+56912345678` antes de submit.
- **Backend:** valida con `PHONE_DIGITS_REGEX` (sin puntos ni espacios).
- **RUT:** se acepta `12.345.678-5` o `12345678-5`; se normaliza a `12345678-5`.

### Strings libres

- `notes` (item), `message` (contacto), `globalNotes` (carrito) → trim + colapsar saltos de línea múltiples a uno + cap por longitud máxima.
- Se permite tildes, eñes, comas y puntos. No se permite HTML (`<` `>`); se escapan al renderizar en WhatsApp/email.

## Funciones de validación puras (referencia; implementación en spec 02)

```ts
// Estas funciones son PURE (sin side effects), se importan desde quoteCart.ts.

import {
  QUOTE_CART_MAX_ITEMS,
  QUOTE_ITEM_MIN_QUANTITY,
  QUOTE_ITEM_MAX_QUANTITY,
  QUOTE_PERIOD_MIN_COUNT,
  QUOTE_PERIOD_MAX_COUNT,
  RUT_REGEX,
  PHONE_DIGITS_REGEX,
  PERIOD_TYPES,
  type QuoteCartItem,
  type QuoteCart,
  type RenterContactData,
  type PeriodType,
} from '@/types/quote';

/** Resultado de validación: ok=true o lista de errores por campo. */
export interface ValidationResult {
  ok: boolean;
  fieldErrors: { field: string; message: string }[];
}

export function validateItem(item: QuoteCartItem): ValidationResult;
export function validateCart(cart: QuoteCart): ValidationResult;
export function validateContact(contact: RenterContactData): ValidationResult;

export function isValidPeriodType(value: unknown): value is PeriodType;
export function isValidRut(value: string): boolean;
export function isValidPhoneCL(value: string): boolean;
export function isValidEmail(value: string): boolean;
export function isFutureDate(value: string): boolean; // YYYY-MM-DD >= hoy

export function normalizePhoneCL(value: string): string; // "+56 9 1234 5678" -> "+56912345678"
export function normalizeRut(value: string): string;    // "12.345.678-5" -> "12345678-5"
```

## Diagrama de relaciones

```
┌─────────────────┐
│  RENTAL_CATEGORIES (src/data/rental.ts)
│  ├─ category
│  │   └─ subcategories[]
│  │       └─ catalog: Equipment[]
└────────┬────────┘
         │ FK: equipmentSlug
         ▼
┌─────────────────┐
│ QuoteCartItem   │
│  ├─ equipmentSlug ───┘
│  ├─ name (snapshot)
│  ├─ capacity (snapshot)
│  ├─ image (snapshot)
│  ├─ sourceUrl
│  └─ customization
│      ├─ quantity
│      ├─ periodType
│      ├─ periodCount
│      ├─ startDate
│      ├─ notes
│      └─ transport
└────────┬────────┘
         │ 1..5 items
         ▼
┌─────────────────┐
│ QuoteCart       │
│  ├─ version     │   ← persistido en localStorage
│  ├─ updatedAt   │
│  ├─ globalNotes │
│  └─ items[]     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ QuoteRequest    │
│  ├─ version     │   ← POST a /wp-json/ip/v1/quote-request
│  ├─ items[]     │
│  ├─ contact     │
│  ├─ globalNotes │
│  ├─ meta        │
│  └─ honeypot    │
└─────────────────┘
```

## Tareas

- [ ] Crear `src/types/quote.ts` con todos los tipos anteriores.
- [ ] Exportar las constantes (`QUOTE_CART_MAX_ITEMS`, `PERIOD_TYPES`, etc.) para que `quoteCart.ts` las use.
- [ ] Verificar que los tipos compilan con `astro check` o equivalente (TS strict).
- [ ] Confirmar que `EquipmentLocation` se exporta también desde `rental.ts` (helper existente o nuevo).
- [ ] No duplicar tipos de `rental.ts`; importar `Equipment` desde ahí.

## Definition of Done

- [ ] `src/types/quote.ts` existe y compila sin warnings.
- [ ] Las 8 interfaces principales están exportadas: `QuoteCartItemTransport`, `QuoteCartItemCustomization`, `QuoteCartItem`, `QuoteCart`, `RenterContactData`, `QuoteRequestMeta`, `QuoteRequest`, `QuoteRequestResponse` (con `QuoteRequestSuccess` y `QuoteRequestError`).
- [ ] Las constantes `QUOTE_CART_MAX_ITEMS`, `QUOTE_CART_HARD_MAX_ITEMS`, `QUOTE_ITEM_MIN_QUANTITY`, `QUOTE_ITEM_MAX_QUANTITY`, `QUOTE_PERIOD_MIN_COUNT`, `QUOTE_PERIOD_MAX_COUNT`, `QUOTE_NOTES_MAX_LENGTH`, `QUOTE_GLOBAL_NOTES_MAX_LENGTH`, `RUT_REGEX`, `PHONE_DIGITS_REGEX` están exportadas.
- [ ] Los tipos `PeriodType` y `ContactMethod` están derivados de tuplas `as const`.
- [ ] El archivo importa `Equipment` desde `@/data/rental` (no duplica).
- [ ] El shape del JSON de `localStorage` está documentado en este spec.
- [ ] `astro check` (o `npx tsc --noEmit`) pasa sin errores.

## Ejemplo de uso (referencia para spec 02)

```ts
import type { QuoteCart, QuoteCartItem } from '@/types/quote';
import { QUOTE_CART_MAX_ITEMS } from '@/types/quote';

const empty: QuoteCart = {
  version: 1,
  updatedAt: new Date().toISOString(),
  items: [],
};

const sample: QuoteCartItem = {
  equipmentSlug: 'grua-grove-gmk-4100',
  name: 'Grove GMK 4100',
  capacity: '100 t',
  height: '88 m',
  image: '/_astro/hero.hash.webp',
  sourceUrl: 'https://ipproyectosindustriales.cl/arriendo/izaje/gruas-100-toneladas',
  customization: {
    quantity: 1,
    periodType: 'mensual',
    periodCount: 3,
    startDate: '2026-08-15',
    notes: 'faena Candelaria',
    transport: { required: true, address: 'Ruta 5 km al norte de Caldera' },
  },
  addedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

## Referencias

- [README del plan](./README.md) — convenciones globales, glosario.
- Spec 00: [./00-functional-definition.md](./00-functional-definition.md) — decisiones D-01..D-20.
- Spec 02: [./02-cart-state-and-storage.md](./02-cart-state-and-storage.md) — implementa `quoteCart.ts` con estos tipos.
- Spec 06: [./06-message-and-payload-builders.md](./06-message-and-payload-builders.md) — usa `QuoteRequest` para construir el payload.
- Spec 07: [./07-backend-wordpress.md](./07-backend-wordpress.md) — endpoint REST valida contra este mismo shape.
- `src/data/rental.ts` — fuente de verdad del catálogo; `Equipment` se importa acá.
- `src/types/quote.ts` — archivo a crear.
