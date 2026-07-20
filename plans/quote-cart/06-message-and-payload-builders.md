# Spec 06 — Generadores de Mensaje y Payload

**Fase:** 6
**Estado:** ⬜ Pendiente
**Archivos a crear:** `src/lib/quoteMessage.ts`
**Depende de:** Specs 01, 02
**Bloquea a:** spec 07 (consume el payload) + spec 05 (consume el WhatsApp URL)

---

## Objetivo

Centralizar en un solo módulo (`src/lib/quoteMessage.ts`) las funciones puras que:

1. Construyen la **URL de WhatsApp** con el mensaje consolidado (rama WhatsApp).
2. Construyen el **payload JSON** que se envía al endpoint REST (rama email).
3. Calculan los **totales agregados** del carrito (para mostrar en la UI).
4. Sanitizan y normalizan los strings que van al mensaje (escape de caracteres, longitudes, etc.).

Este módulo es **puro** (sin side effects, sin DOM, sin storage), lo que permite **testearlo en Node** sin browser. Las specs 04, 05 y 07 lo consumen.

## Por qué importa

- Si la lógica del mensaje vive en el componente, cambiar el formato requiere editar JSX. Aquí, un cambio es un PR de 1 línea.
- El payload del REST y el mensaje de WhatsApp comparten la mayor parte del formato: un solo módulo evita duplicación.
- La sanitización (escape de HTML, control de longitud, normalización de saltos de línea) es **crítica**: un item con `;` o `\n` en notas puede romper el WhatsApp.

## API pública (`src/lib/quoteMessage.ts`)

```ts
// src/lib/quoteMessage.ts
// Generadores puros: URL de WhatsApp, payload REST, totales y sanitización.

import type {
  QuoteCart,
  QuoteCartItem,
  RenterContactData,
  QuoteRequest,
  QuoteRequestMeta,
  QuoteRequestResponse,
  PeriodType,
} from '@/types/quote';

// ─────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────

export const WHATSAPP_PHONE = '56965593202';
export const WHATSAPP_BASE_URL = 'https://wa.me/';

export const WHATSAPP_MAX_CHARS = 2000;
export const WHATSAPP_HARD_MAX_CHARS = 65000; // wa.me real limit
export const WHATSAPP_TRUNCATE_AFTER_ITEMS = 4;

// ─────────────────────────────────────────────────────────────
// Sanitización
// ─────────────────────────────────────────────────────────────

/** Escapa caracteres que rompen el formato del mensaje (no HTML). */
export function sanitizePlainText(s: string | undefined | null, maxLength = 500): string;

/** Normaliza saltos de línea y colapsa espacios múltiples. */
export function normalizeMultiline(s: string): string;

/** Convierte a número de días calendario aprox para el tipo de periodo. */
export function periodToDays(periodType: PeriodType, periodCount: number): number;

// ─────────────────────────────────────────────────────────────
// Mensaje WhatsApp
// ─────────────────────────────────────────────────────────────

export interface BuildWhatsAppOptions {
  /** Si true, incluye el bloque de datos del cliente al final. */
  withContactData?: boolean;
  /** Datos del cliente (requerido si withContactData=true). */
  contact?: RenterContactData;
  /** Si excede el límite, truncar items y agregar nota. Default true. */
  truncate?: boolean;
}

export interface BuildWhatsAppResult {
  /** URL lista para `window.open`. */
  url: string;
  /** Mensaje decodificado (útil para preview o logging). */
  message: string;
  /** Tamaño del mensaje en chars. */
  charCount: number;
  /** Si el mensaje fue truncado. */
  truncated: boolean;
  /** Si el mensaje excede el límite práctico y se recomienda email. */
  exceedsRecommended: boolean;
}

/** Construye la URL wa.me con el mensaje consolidado. */
export function buildWhatsAppUrl(
  cart: QuoteCart,
  options?: BuildWhatsAppOptions
): BuildWhatsAppResult;

// ─────────────────────────────────────────────────────────────
// Payload REST
// ─────────────────────────────────────────────────────────────

export interface BuildQuoteRequestOptions {
  contact: RenterContactData;
  /** URL de la página actual. Default: window.location.href. */
  sourceUrl?: string;
  /** UTM params. */
  utm?: QuoteRequestMeta['utm'];
  /** Honeypot (default: ''). */
  honeypot?: string;
}

/** Construye el payload que se POSTea al endpoint REST. */
export function buildQuoteRequest(
  cart: QuoteCart,
  options: BuildQuoteRequestOptions
): QuoteRequest;

// ─────────────────────────────────────────────────────────────
// Totales
// ─────────────────────────────────────────────────────────────

export interface CartTotals {
  /** Cantidad de items únicos. */
  distinctItems: number;
  /** Suma de `quantity` de todos los items. */
  totalQuantity: number;
  /** Fecha de inicio más tardía (YYYY-MM-DD), o null si no hay items. */
  latestStartDate: string | null;
  /** Suma de días calendario (aprox) según periodos. */
  totalCalendarDays: number;
  /** Total en meses-equivalentes (para resumen ejecutivo). */
  totalMonthEquivalents: number;
}

/** Calcula totales agregados del carrito. */
export function buildTotals(cart: QuoteCart): CartTotals;

// ─────────────────────────────────────────────────────────────
// Builders internos (pueden ser útiles para tests)
// ─────────────────────────────────────────────────────────────

/** Renderiza la sección "items" del mensaje. */
export function buildItemsSection(cart: QuoteCart, maxItems?: number): string;

/** Renderiza la sección "datos del cliente" del mensaje. */
export function buildContactSection(contact: RenterContactData): string;

/** Renderiza la sección "notas globales" del mensaje. */
export function buildGlobalNotesSection(notes: string | undefined): string;

/** Renderiza el header del mensaje. */
export function buildHeader(): string;
```

## Implementación de referencia

```ts
// src/lib/quoteMessage.ts (extractos clave)

const HEADER = 'Hola IP Proyectos Industriales, quisiera cotizar el siguiente arriendo:';

export function sanitizePlainText(s: string | undefined | null, maxLength = 500): string {
  if (s == null) return '';
  let out = String(s).trim();
  // colapsa saltos de línea múltiples
  out = out.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  // corta a maxLength
  if (out.length > maxLength) out = out.slice(0, maxLength).trim();
  return out;
}

export function periodToDays(periodType: PeriodType, periodCount: number): number {
  const unit = periodType === 'diario' ? 1 : periodType === 'semanal' ? 7 : 30;
  return Math.max(0, unit * periodCount);
}

export function buildItemsSection(cart: QuoteCart, maxItems = cart.items.length): string {
  const lines: string[] = [];
  const items = cart.items.slice(0, maxItems);
  items.forEach((item) => {
    const c = item.customization;
    const cap = item.capacity ? ` (${item.capacity})` : '';
    lines.push(`- ${c.quantity} x ${sanitizePlainText(item.name)}${cap}`);
    lines.push(`  Periodo: ${c.periodType} x ${c.periodCount} -> inicio ${c.startDate}`);
    const notes = sanitizePlainText(c.notes, 280);
    lines.push(`  Notas: ${notes || '-'}`);
    if (c.transport.required) {
      const addr = sanitizePlainText(c.transport.address, 120);
      lines.push(`  Traslado: Sí - ${addr || '-'}`);
    } else {
      lines.push(`  Traslado: No`);
    }
  });
  if (cart.items.length > maxItems) {
    lines.push(`(se omitieron ${cart.items.length - maxItems} equipos, ver resumen completo en https://ipproyectosindustriales.cl/cotizador)`);
  }
  return lines.join('\n');
}

export function buildContactSection(contact: RenterContactData): string {
  const lines: string[] = ['Datos del cliente:'];
  lines.push(`  Nombre: ${sanitizePlainText(contact.name, 80)}`);
  lines.push(`  Empresa: ${sanitizePlainText(contact.company, 80)}`);
  if (contact.rut) lines.push(`  RUT: ${sanitizePlainText(contact.rut, 12)}`);
  lines.push(`  Email: ${sanitizePlainText(contact.email, 120)}`);
  lines.push(`  Teléfono: ${sanitizePlainText(contact.phone, 20)}`);
  lines.push(`  Región: ${sanitizePlainText(contact.region, 40)}`);
  lines.push(`  Comuna: ${sanitizePlainText(contact.commune, 40)}`);
  lines.push(`  Lugar de atención: ${sanitizePlainText(contact.workplace, 120)}`);
  lines.push(`  Método preferido: ${contact.contactMethod}`);
  if (contact.message) {
    const m = sanitizePlainText(contact.message, 1000);
    if (m) lines.push('', `Mensaje: ${m}`);
  }
  return lines.join('\n');
}

export function buildGlobalNotesSection(notes: string | undefined): string {
  const n = sanitizePlainText(notes, 500);
  if (!n) return '';
  return ['Notas globales:', n].join('\n');
}

export function buildHeader(): string {
  return HEADER;
}

export function buildWhatsAppUrl(
  cart: QuoteCart,
  options: BuildWhatsAppOptions = {}
): BuildWhatsAppResult {
  const { withContactData = false, contact, truncate = true } = options;

  let itemsSection = buildItemsSection(cart);

  // Truncado defensivo
  let truncated = false;
  if (truncate && itemsSection.length > 1200) {
    itemsSection = buildItemsSection(cart, WHATSAPP_TRUNCATE_AFTER_ITEMS);
    truncated = true;
  }

  const sections: string[] = [buildHeader(), '', itemsSection];
  if (withContactData && contact) {
    sections.push('', buildContactSection(contact));
  }
  if (cart.globalNotes) {
    sections.push('', buildGlobalNotesSection(cart.globalNotes));
  }
  // Pie con URL de origen
  if (cart.items[0]?.sourceUrl) {
    sections.push('', `Origen: ${cart.items[0].sourceUrl}`);
  }

  let message = sections.join('\n');
  let exceedsRecommended = false;
  if (truncate && message.length > WHATSAPP_MAX_CHARS) {
    // Truncar más agresivamente a 4 items
    itemsSection = buildItemsSection(cart, WHATSAPP_TRUNCATE_AFTER_ITEMS);
    sections[2] = itemsSection;
    message = sections.join('\n');
    truncated = true;
  }
  if (message.length > WHATSAPP_MAX_CHARS) {
    exceedsRecommended = true;
  }

  const url = `${WHATSAPP_BASE_URL}${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  return { url, message, charCount: message.length, truncated, exceedsRecommended };
}

export function buildQuoteRequest(
  cart: QuoteCart,
  options: BuildQuoteRequestOptions
): QuoteRequest {
  const sourceUrl = options.sourceUrl ?? (typeof window !== 'undefined' ? window.location.href : '');
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const utm = options.utm ?? (typeof window !== 'undefined' ? readUtmFromUrl() : undefined);

  const meta: QuoteRequestMeta = {
    sourceUrl,
    userAgent,
    submittedAt: new Date().toISOString(),
    utm,
  };

  return {
    version: '1',
    items: cart.items,
    contact: options.contact,
    globalNotes: cart.globalNotes,
    meta,
    honeypot: options.honeypot ?? '',
  };
}

function readUtmFromUrl(): QuoteRequestMeta['utm'] | undefined {
  if (typeof window === 'undefined') return undefined;
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  ['source', 'medium', 'campaign', 'term', 'content'].forEach((k) => {
    const v = params.get(`utm_${k}`);
    if (v) utm[k] = v;
  });
  return Object.keys(utm).length > 0 ? (utm as QuoteRequestMeta['utm']) : undefined;
}

export function buildTotals(cart: QuoteCart): CartTotals {
  if (cart.items.length === 0) {
    return {
      distinctItems: 0,
      totalQuantity: 0,
      latestStartDate: null,
      totalCalendarDays: 0,
      totalMonthEquivalents: 0,
    };
  }
  const distinctItems = cart.items.length;
  const totalQuantity = cart.items.reduce((sum, i) => sum + i.customization.quantity, 0);
  const latestStartDate = cart.items
    .map((i) => i.customization.startDate)
    .sort()
    .pop() ?? null;
  const totalCalendarDays = cart.items.reduce(
    (sum, i) => sum + periodToDays(i.customization.periodType, i.customization.periodCount) * i.customization.quantity,
    0
  );
  const totalMonthEquivalents = Math.round((totalCalendarDays / 30) * 10) / 10;
  return { distinctItems, totalQuantity, latestStartDate, totalCalendarDays, totalMonthEquivalents };
}
```

## Ejemplo de mensaje WhatsApp (2 items, con datos del cliente)

**Input:** carrito con Grove GMK 4100 + Plataforma Telescópica 25 m, datos completos.

```text
Hola IP Proyectos Industriales, quisiera cotizar el siguiente arriendo:

- 1 x Grove GMK 4100 (100 t)
  Periodo: mensual x 3 -> inicio 2026-08-15
  Notas: faena Candelaria
  Traslado: Sí - Ruta 5 km al norte de Caldera

- 2 x Plataforma Telescópica 25 m (230 kg)
  Periodo: semanal x 2 -> inicio 2026-08-20
  Notas: -

Datos del cliente:
  Nombre: Juan Pérez
  Empresa: Minera Atacama S.A.
  RUT: 76.123.456-7
  Email: juan.perez@minera-atacama.cl
  Teléfono: +56987654321
  Región: Atacama
  Comuna: Caldera
  Lugar de atención: Faena Candelaria, km 12
  Método preferido: whatsapp
  Mensaje: Requerimos disponibilidad para el primer turno del lunes.

Notas globales:
  Coordinar ingreso a faena con anticipación.

Origen: https://ipproyectosindustriales.cl/arriendo/izaje/gruas-100-toneladas
```

**Output `buildWhatsAppUrl`:** `{ url: 'https://wa.me/56965593202?text=...', message: ..., charCount: 894, truncated: false, exceedsRecommended: false }`.

## Ejemplo de payload REST

```json
{
  "version": "1",
  "items": [
    {
      "equipmentSlug": "grua-grove-gmk-4100",
      "name": "Grove GMK 4100",
      "capacity": "100 t",
      "height": "88 m",
      "image": "/_astro/hero.abc123.webp",
      "sourceUrl": "https://ipproyectosindustriales.cl/arriendo/izaje/gruas-100-toneladas",
      "customization": {
        "quantity": 1,
        "periodType": "mensual",
        "periodCount": 3,
        "startDate": "2026-08-15",
        "notes": "faena Candelaria",
        "transport": { "required": true, "address": "Ruta 5 km al norte de Caldera" }
      },
      "addedAt": "2026-07-15T10:25:00.000Z",
      "updatedAt": "2026-07-15T10:28:00.000Z"
    }
  ],
  "contact": {
    "name": "Juan Pérez",
    "company": "Minera Atacama S.A.",
    "rut": "76123456-7",
    "email": "juan.perez@minera-atacama.cl",
    "phone": "+56987654321",
    "region": "Atacama",
    "commune": "Caldera",
    "workplace": "Faena Candelaria, km 12",
    "contactMethod": "whatsapp",
    "message": "Requerimos disponibilidad para el primer turno del lunes.",
    "terms": true
  },
  "globalNotes": "Coordinar ingreso a faena con anticipación.",
  "meta": {
    "sourceUrl": "https://ipproyectosindustriales.cl/cotizador/datos",
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15...",
    "submittedAt": "2026-07-15T10:30:00.000Z",
    "utm": {
      "source": "google",
      "medium": "cpc",
      "campaign": "arriendo-gruas-100t"
    }
  },
  "honeypot": ""
}
```

## Comportamiento de truncado

| chars totales | Acción |
|---|---|
| ≤ 1500 | Enviar completo |
| 1500 - 2000 | Truncar a 4 items, agregar nota "(se omitieron N equipos, ver resumen completo en /cotizador)" |
| 2000 - 65000 | Truncar a 4 items + marca `exceedsRecommended: true` (la UI debe advertir) |
| > 65000 | Caso patológico: la UI debe bloquear el submit WhatsApp y sugerir email |

(En v1 no se implementa el caso > 65000, porque `QUOTE_CART_HARD_MAX_ITEMS = 5` lo hace prácticamente imposible.)

## Test unitario de referencia (Node)

```ts
// tests/quoteMessage.test.ts (ejecutar con vitest o similar; no incluido en este plan)
import { describe, it, expect } from 'vitest';
import { buildWhatsAppUrl, buildQuoteRequest, buildTotals } from '@/lib/quoteMessage';

describe('buildWhatsAppUrl', () => {
  it('genera URL con mensaje consolidado', () => {
    const cart = { version: 1, updatedAt: '', items: [
      { equipmentSlug: 'grua-x', name: 'Grove X', capacity: '100 t', image: '', sourceUrl: 'https://example.com',
        customization: { quantity: 1, periodType: 'mensual', periodCount: 3, startDate: '2026-08-15', notes: '', transport: { required: false } },
        addedAt: '', updatedAt: '' },
    ], globalNotes: '' };
    const r = buildWhatsAppUrl(cart);
    expect(r.url).toMatch(/^https:\/\/wa\.me\/56965593202\?text=/);
    expect(r.message).toContain('Grove X');
    expect(r.message).toContain('Periodo: mensual x 3 -> inicio 2026-08-15');
  });

  it('trunca a 4 items si excede 1500 chars', () => {
    // cart con 5 items de 1000 chars cada uno en notas
    // esperar que el resultado tenga solo 4 items
  });
});

describe('buildTotals', () => {
  it('suma cantidades y días', () => {
    const cart = { version: 1, updatedAt: '', items: [
      { /* ... */ customization: { quantity: 1, periodType: 'mensual', periodCount: 3, /* ... */ } },
      { /* ... */ customization: { quantity: 2, periodType: 'semanal', periodCount: 1, /* ... */ } },
    ] };
    const t = buildTotals(cart);
    expect(t.totalQuantity).toBe(3);
    expect(t.totalCalendarDays).toBe(30 * 3 * 1 + 7 * 1 * 2);
  });
});
```

## Sanitización: casos cubiertos

| Input | Output | Razón |
|---|---|---|
| `"  texto  con  espacios  "` | `"texto con espacios"` | trim + colapsar |
| `"linea1\n\n\nlinea2"` | `"linea1\n\nlinea2"` | colapsar saltos |
| `""` (string vacío) | `""` | preserva |
| `undefined` | `""` | explícito |
| `"a".repeat(1000)` (length 1000, max 500) | primeros 500 chars | corte por maxLength |
| `"<script>alert(1)</script>"` | `"<script>alert(1)</script>"` | **se mantiene literal** porque el destino es texto plano (WhatsApp/email) |

> **Nota:** en WhatsApp y en email de texto plano no se interpreta HTML; no se necesita escape `&lt;`. Pero si el HTML se inyecta en un `<pre>` o en una vista admin, se debe escapar ahí. El spec 07 incluye el `wp_kses_post` server-side.

## Tareas

- [ ] Crear `src/lib/quoteMessage.ts` con todas las funciones públicas.
- [ ] Implementar `sanitizePlainText`, `normalizeMultiline`, `periodToDays`.
- [ ] Implementar `buildItemsSection`, `buildContactSection`, `buildGlobalNotesSection`, `buildHeader`.
- [ ] Implementar `buildWhatsAppUrl` con truncado defensivo.
- [ ] Implementar `buildQuoteRequest` con UTM.
- [ ] Implementar `buildTotals`.
- [ ] (Opcional) Tests con vitest: 5-6 casos clave.
- [ ] Verificar que las funciones son **puras** (sin acceso a `window` o `localStorage`).
- [ ] Verificar que el bundle no incluye `quoteMessage.ts` en partes innecesarias del sitio (las páginas de catálogo no lo cargan; solo `/cotizador*`).

## Definition of Done

- [ ] `src/lib/quoteMessage.ts` existe y compila.
- [ ] Las 10 funciones públicas están exportadas.
- [ ] `buildWhatsAppUrl` retorna `{ url, message, charCount, truncated, exceedsRecommended }`.
- [ ] `buildWhatsAppUrl` trunca a 4 items si excede 1500 chars.
- [ ] `buildWhatsAppUrl` marca `exceedsRecommended` si > 2000 chars.
- [ ] `buildQuoteRequest` incluye `meta.utm` si hay UTM en la URL.
- [ ] `buildQuoteRequest` es 100% puro (no accede a `window`).
- [ ] `buildTotals` retorna números correctos (verificable con tests manuales).
- [ ] El módulo no tiene side effects.
- [ ] El módulo no toca `localStorage` ni `document`.

## Referencias

- Spec 01: [./01-data-model.md](./01-data-model.md) — tipos de input.
- Spec 04: [./04-cart-page.md](./04-cart-page.md) — consume `buildWhatsAppUrl` y `buildTotals`.
- Spec 05: [./05-renter-data-form.md](./05-renter-data-form.md) — consume `buildQuoteRequest` y `buildWhatsAppUrl`.
- Spec 07: [./07-backend-wordpress.md](./07-backend-wordpress.md) — recibe el `QuoteRequest`.
- `src/data/rental.ts` — para la conversión de `equipmentSlug` → nombre canónico si fuera necesario (en este spec se usa el snapshot).
