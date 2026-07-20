# Quote Cart — Plan de Implementación (v1)

> Carrito cotizador (lead-capture) que reemplaza el CTA unitario "Cotizar este equipo" de cada `EquipmentCard` por un agrupador multi-equipo con envío consolidado por **WhatsApp** (MVP) y **WordPress REST → email** (producción).

---

## Contexto

El sitio actual (catálogo `/arriendo/*`) tiene **un solo CTA por equipo** que abre WhatsApp con un mensaje específico del modelo. El usuario que quiere cotizar 2 o 3 equipos termina abriendo 2 o 3 chats paralelos con el ejecutivo, lo que diluye la conversación comercial y duplica trabajo de digitación.

El pivote añade una capa de carrito liviano, sin login, sin pago, sin inventario:

1. **Selección** multi-equipo desde cualquier página del catálogo.
2. **Personalización** de cada item (cantidad, tipo de periodo, fecha de inicio, observaciones).
3. **Envío consolidado** por WhatsApp (MVP) o por email vía `POST /wp-json/ip/v1/quote-request` (producción).
4. **Persistencia** en `localStorage` con versionado (`ip_quote_cart_v1`).

Referencia conceptual (no copia): [skrental.com/tiendaonline/webapp/carro](https://www.skrental.com/tiendaonline/webapp/carro).

## Decisiones clave (resumen)

| # | Decisión | Elección | Motivo |
|---|---|---|---|
| 1 | Ruta del cotizador | `/cotizador` | SEO + claridad comercial (vs `/cotizar`, `/carro`) |
| 2 | Canales de envío | WhatsApp (MVP) + email (producción) | WhatsApp funciona sin backend; email captura fuera de horario |
| 3 | Backend email | WordPress REST (`/ip/v1/quote-request`) | Mantener `output: 'static'`; no requiere SSR en Astro |
| 4 | Persistencia | `localStorage` versionado (`ip_quote_cart_v1`) | Sin login, simple, suficiente para un lead-capture |
| 5 | Framework UI | Astro + TypeScript vanilla | El carrito es liviano; no justifica React/Vue en v1 |
| 6 | Estado global | `CustomEvent` + `storage` event | Sin librerías; funciona cross-tab |
| 7 | Max items | 5 (constante `QUOTE_CART_MAX_ITEMS`) | Cap blando; warning a partir del 4° |
| 8 | Antispam | Honeypot + rate limit por IP (transients) | Sin reCAPTCHA en v1; menor fricción |
| 9 | Almacenamiento leads | CPT `quote_request` (opcional) | Habilita panel admin; desactivado por defecto |
| 10 | SEO `/cotizador` | `noindex` | Página transaccional, no canónica |
| 11 | Período de arriendo | Diario / Semanal / Mensual | Match con práctica común de arriendos en Chile |
| 12 | Sitemap | Excluir `/cotizador`, `/gracias` | Mismo tratamiento que `/gracias` actual |

## Especificaciones por área funcional

| # | Spec | Fase | Estado | Archivos principales |
|---|---|---|---|---|
| 00 | [Definición funcional](./00-functional-definition.md) | 0 | ⬜ Pendiente | `plans/quote-cart/*` (este plan) |
| 01 | [Modelo de datos](./01-data-model.md) | 1 | ⬜ Pendiente | `src/types/quote.ts` |
| 02 | [Estado y almacenamiento](./02-cart-state-and-storage.md) | 2 | ⬜ Pendiente | `src/lib/quoteCart.ts` |
| 03 | [UI de "Agregar al cotizador"](./03-add-to-cart-ui.md) | 3 | ⬜ Pendiente | `src/components/quote/QuoteAddButton.astro`, `QuoteCartBadge.astro`, `QuoteCartFloatingButton.astro` |
| 04 | [Página del cotizador](./04-cart-page.md) | 4 | ⬜ Pendiente | `src/pages/cotizador.astro` |
| 05 | [Formulario del solicitante](./05-renter-data-form.md) | 5 | ⬜ Pendiente | `src/components/quote/QuoteRequestForm.astro` |
| 06 | [Mensajes y payloads](./06-message-and-payload-builders.md) | 6 | ⬜ Pendiente | `src/lib/quoteMessage.ts` |
| 07 | [Backend WordPress](./07-backend-wordpress.md) | 7 | ⬜ Pendiente | `wordpress/plugins/ip-quote-api/*` |
| 08 | [SEO y analítica](./08-seo-analytics.md) | 8 | ⬜ Pendiente | `astro.config.mjs` (filtro), `BaseLayout.astro` (noindex) |
| 09 | [Criterios de aceptación](./09-acceptance-criteria.md) | 9 | ⬜ Pendiente | Smoke test + DoD |
| 10 | [Selector de equipos embebido](./10-equipment-selector.md) | 4 (extensión) | ✅ Completo | `src/components/quote/EquipmentPicker.astro`, `EquipmentPickerCard.astro` |

**Leyenda:** ⬜ Pendiente · 🟡 En progreso · ✅ Completo

## Orden de implementación

```
Fase 0 ──► Spec 00 ─ Definición funcional
Fase 1 ──► Spec 01 ─ Tipos y contratos (sin esto, nada compila)
Fase 2 ──► Spec 02 ─ quoteCart.ts (state + storage + eventos)
         ╔══════════════════════════════╗
Fase 3 ──╣ Spec 03 ─ QuoteAddButton + Badge + Floating
         ╚══════════════════════════════╝  ← Checkpoint MVP sin formulario
Fase 4 ──► Spec 04 ─ Página /cotizador (edición inline)
          ╔══════════════════════════════╗
Fase 4b ─╣ Spec 10 ─ Selector embebido (aditiva)  ✅  ← puede implementarse tras Spec 04
          ╚══════════════════════════════╝  sin esperar al backend (Specs 05-09)
Fase 5 ──► Spec 05 ─ Formulario de datos (Datos)
Fase 6 ──► Spec 06 ─ Generadores de mensaje / payload
Fase 7 ──► Spec 07 ─ Plugin WordPress REST
Fase 8 ──► Spec 08 ─ SEO + GA4 events
Fase 9 ──► Spec 09 ─ DoD + smoke test
```

### Alcance MVP (Fases 0-3, sin backend)

Con las specs 00-03 implementadas, el usuario ya puede:
- Agregar equipos al carrito desde el catálogo.
- Ver el contador en el header y el botón flotante mobile.
- Navegar entre páginas sin perder la selección.
- Visitar `/cotizador` (estado vacío con CTA al catálogo).

Este es un **MVP sin envío** y debe validarse antes de invertir en formulario y backend.

### Spec 10 (extensión aditiva de la fase 4)

La spec 10 — **Selector de equipos embebido en `/cotizador`** — es aditiva y **no bloquea** ningún otro trabajo. Se puede implementar tras la spec 04 de forma independiente al formulario (spec 05), el backend (spec 07) y analytics (spec 08). Su único requisito es que las specs 01-04 estén operativas. Equivale a un "MVP+1" que mejora el flujo de selección sin tocar el canal de envío.

> **Implementada** (estado ✅). El selector embebido está activo en `/cotizador`: el usuario puede buscar, filtrar por categoría / subcategoría y agregar equipos al cotizador sin salir de la página. Reutiliza `addItem`, `subscribe`, `getCart` y los eventos de `quoteCart.ts`. La spec 10 sigue siendo aditiva: su ausencia no afecta a specs 05–09.

### Alcance completo (Fases 0-9)

Agrega: edición inline en `/cotizador`, formulario de datos, generación de WhatsApp consolidado, endpoint REST de WordPress, email al ejecutivo, eventos de analytics, SEO correcto.

## Convenciones transversales

- **Identificadores:** inglés (`QuoteCart`, `addItem`, `equipmentSlug`).
- **UI copy:** español de Chile ("Cotizador", "Agregar al cotizador", "Carro vacío").
- **Fechas:** `YYYY-MM-DD` (formato HTML `<input type="date">`).
- **Teléfonos:** 9 dígitos, prefijo opcional `+56`. Se acepta `+56 9 1234 5678`, `912345678`, `9 1234 5678`.
- **RUT chileno:** regex `^\d{7,8}-[0-9Kk]$` (sin puntos con miles; los puntos son opcionales en input, se normalizan server-side).
- **Tema:** se respetan las variables existentes `--color-surface`, `--color-ink`, `--color-ink-700`, `--color-brand`, `--color-brand-700`, `--color-line`, `--color-graphite`.
- **Tipografía:** `--font-heading` (Archivo) y `--font-body` (Bliss Pro) — sin importar familias nuevas.
- **Storage key:** `ip_quote_cart_v1` (incrementar a `v2` solo ante cambio incompatible de schema).
- **Cap de items:** `QUOTE_CART_MAX_ITEMS = 5` (constante exportada en `quoteCart.ts`).
- **Catálogo de equipos:** `src/data/rental.ts` (única fuente de verdad; **no** se duplica en el carrito).
- **Astro:** `output: 'static'` se mantiene. El carrito se hidrata con `<script>` vanilla TS por componente.

## Glosario

| Término | Definición |
|---|---|
| **Cotizador** | Vista/página donde el usuario revisa y edita los equipos seleccionados. Sinónimo de "carrito cotizador". |
| **Item** | Una línea del cotizador: 1 modelo de equipo con su cantidad, periodo y notas. |
| **Periodo** | Unidad de tiempo del arriendo: `diario` / `semanal` / `mensual`. |
| **Cantidad de periodos** | Cuántas unidades del periodo (ej: `3` con `periodo = mensual` → 3 meses). |
| **Traslado** | Si el cliente requiere transporte del equipo a la faena (sí/no + dirección). |
| **Datos del solicitante** | Bloque de campos que el ejecutivo necesita para responder: nombre, empresa, email, teléfono, ubicación. |
| **Honeypot** | Campo HTML invisible para humanos; los bots lo llenan. |
| **CPT** | Custom Post Type de WordPress. `quote_request` almacenará cada lead como entrada. |
| **REST endpoint** | URL de la WP REST API: `POST /wp-json/ip/v1/quote-request`. |
| **Noindex** | Meta `<meta name="robots" content="noindex">` en `/cotizador` y `/gracias`. |
| **MVP** | Minimum Viable Product. Fases 0-3 sin backend; carrito local + persistencia. |
| **Cap blando** | `QUOTE_CART_MAX_ITEMS = 5` se aplica con warning, no con rechazo duro (excepto en submit). |

## Estructura de archivos del proyecto (post-pivot)

```
src/
├── components/
│   ├── quote/                          ← NUEVO (specs 03, 05, 10)
│   │   ├── QuoteAddButton.astro
│   │   ├── QuoteCartBadge.astro
│   │   ├── QuoteCartFloatingButton.astro
│   │   ├── QuoteCartLine.astro
│   │   ├── QuoteCartSummary.astro
│   │   ├── QuoteRequestForm.astro
│   │   ├── QuoteTransportToggle.astro
│   │   ├── EquipmentPicker.astro        ← spec 10 (aditiva, ✅ implementada)
│   │   └── EquipmentPickerCard.astro    ← spec 10 (aditiva, ✅ implementada)
│   └── rental/
│       └── EquipmentCard.astro         ← MODIFICADO: CTA → add-to-cart (spec 03)
├── lib/
│   ├── quoteCart.ts                    ← NUEVO (spec 02)
│   ├── quoteMessage.ts                 ← NUEVO (spec 06)
│   ├── quoteAnalytics.ts               ← NUEVO (spec 08)
│   └── wordpress.ts                    ← SIN CAMBIOS (extender si se necesita)
├── pages/
│   ├── cotizador.astro                 ← NUEVO (spec 04)
│   └── gracias.astro                   ← EXISTENTE (reutilizar para redirect post-submit)
└── types/
    └── quote.ts                        ← NUEVO (spec 01)

public/
├── .htaccess                           ← MODIFICAR: CORS para /wp-json (spec 07)
└── js/                                 ← (opcional, si se extraen chunks)
    └── quote-cart.bundle.js

wordpress/                              ← NUEVO (spec 07)
└── plugins/
    └── ip-quote-api/
        ├── ip-quote-api.php            ← header del plugin
        ├── includes/
        │   ├── class-rest-controller.php
        │   ├── class-validator.php
        │   ├── class-mailer.php
        │   ├── class-rate-limiter.php
        │   └── class-quote-cpt.php
        └── readme.txt
```

## Riesgos transversales y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| `localStorage` no disponible (modo incógnito restrictivo, cookie blockers) | Medio | Fallback: mostrar "No se pudo guardar; inténtalo en una ventana normal" + CTA directo WhatsApp |
| Mensaje WhatsApp > ~2000 chars (límite práctico) | Bajo | Truncar items a 4 y ofrecer "ver resumen completo en /gracias" si se excede |
| Endpoint REST sin HTTPS o con WP mal configurado | Alto | Documentar pre-flight + CORS; recomendar `application_passwords` para auth admin |
| Doble submit | Bajo | Botón "Enviar" se deshabilita al primer click; flag `submitting` en estado |
| Spam en endpoint | Alto | Honeypot + rate limit 5/hora/IP + validación server-side (ver spec 07) |
| Equipo eliminado del catálogo entre sesión y submit | Bajo | Validar `equipmentSlug` contra `RENTAL_CATEGORIES` en submit; rechazar si no existe |
| Diferencia horaria fecha_inicio (cliente en otra zona) | Bajo | Aceptar fecha como date-only (sin hora); ejecutivo confirma por WhatsApp |
| Pérdida de selección al cambiar de navegador | Bajo | Es por diseño; el carrito no sincroniza entre devices en v1 |
| Degradación SEO de `/cotizador` | Bajo | `noindex` + exclusión de sitemap; canonical self-referencing igual |
| Hidratación lenta de scripts en mobile | Bajo | Inline del cart badge (≈2KB TS); defer el resto |

## Fuera de alcance (v1)

- Login de usuarios.
- Precios públicos o calculadora de tarifa en tiempo real.
- Pago online (Webpay, Flow, MercadoPago).
- Inventario en tiempo real / disponibilidad por fecha.
- Workflow de aprobaciones.
- Portal de seguimiento de cotizaciones.
- Integración con CRM (HubSpot, Salesforce).
- Sync cross-device del carrito (sin login).
- Sincronización con ERP propio.
- Notificaciones push o email de seguimiento.
- Multi-idioma (i18n ya está `es` solamente).
- Soporte de varios ejecutivos con asignación por región.

Estos puntos se dejan explícitamente fuera para que el pivote se mantenga como una **herramienta de captación**, no como una plataforma operacional.

## Recomendación de scope (orden sugerido)

### 🥇 MVP (1-2 sprints)
- Specs 00, 01, 02, 03, 04, 06 (solo rama WhatsApp).
- Sin backend, sin formulario de datos, sin analytics.
- **Hito:** el usuario selecciona 2-3 equipos y abre WhatsApp con mensaje consolidado.

### 🥈 Producción (1 sprint adicional)
- Spec 05 (formulario) + Spec 06 (rama email) + Spec 07 (plugin WP).
- **Hito:** el ejecutivo recibe emails con datos completos.

### 🥉 Hardening (sprint opcional)
- Spec 08 (SEO + GA4) + Spec 09 (DoD + smoke test).
- **Hito:** deploy final con monitoreo.

## Referencias

- Análisis original: [../quote-cart-pivot-analysis.md](../quote-cart-pivot-analysis.md)
- Plan del catálogo (vecino): [../rental-catalog/README.md](../rental-catalog/README.md)
- Fuente de datos: `src/data/rental.ts`
- CTAs a modificar: `src/components/rental/EquipmentCard.astro`
- Layout base: `src/layouts/BaseLayout.astro`
- Deploy: `astro.config.mjs`, `deploy-hostinger.mjs`
- Documentación Astro: https://docs.astro.build
- WordPress REST API: https://developer.wordpress.org/rest-api/
- Schema.org QuoteRequest (futuro): https://schema.org/QuoteRequest
