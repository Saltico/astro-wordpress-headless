# Spec 08 — SEO y Analítica

**Fase:** 8
**Estado:** ⬜ Pendiente
**Archivos a crear:**
- `src/lib/quoteAnalytics.ts`

**Archivos a modificar:**
- `astro.config.mjs` (filtro del sitemap)
- `src/pages/cotizador.astro` (ya tiene `noindex`; verificar)
- `src/pages/cotizador/datos.astro` (ya tiene `noindex`; verificar)
- `src/components/quote/*.astro` (instrumentar `data-event` donde aplique)

**Depende de:** Specs 02, 03, 04, 05
**Bloquea a:** spec 09 (DoD)

---

## Objetivo

Asegurar que el cotizador **no degrade el SEO** del sitio (URLs transaccionales con `noindex`, fuera del sitemap) y que el equipo comercial pueda **medir conversiones** vía Google Analytics 4 (eventos custom: `quote_add_item`, `quote_submit_whatsapp`, `quote_submit_email`, etc.).

## Por qué importa

- Una URL como `/cotizador` indexada con contenido dinámico o vacío **diluye la autoridad** del sitio y aparece en SERPs irrelevantes.
- Sin eventos de analytics, el equipo no puede saber **cuántos leads llegan**, **qué canal prefieren** (WhatsApp vs email) ni **qué equipo del catálogo convierte más**.
- Los UTM parameters se pierden si no se propagan al payload REST o al mensaje de WhatsApp.

## SEO: `noindex` y sitemap

### `astro.config.mjs`

El filtro del sitemap ya excluye `/gracias`, `/404`, `/500`, `/aviso-legal`, `/privacidad`, `/cookies`. Se debe extender para incluir `/cotizador` y `/cotizador/datos`.

```js
// astro.config.mjs (modificación)
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const SITE_URL = 'https://ipproyectosindustriales.cl';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  output: 'static',
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es' },
      },
      filter: (page) => {
        const noIndexPaths = [
          '/gracias',
          '/404',
          '/500',
          '/aviso-legal',
          '/privacidad',
          '/cookies',
          '/cotizador',
          '/cotizador/datos',
        ];
        return !noIndexPaths.some((path) => page.includes(path));
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
```

### `<meta name="robots">` en cada página

| Página | `noindex` | `canonical` |
|---|:---:|---|
| `/arriendo/*` | ❌ | self |
| `/cotizador` | ✅ | self (a `/cotizador`) |
| `/cotizador/datos` | ✅ | self (a `/cotizador/datos`) |
| `/gracias` | ✅ | self (a `/gracias`) |

Las páginas `/cotizador*` ya pasan `noindex={true}` a `BaseLayout`, que renderiza `<meta name="robots" content="noindex">` en `MetaTags.astro`. Verificar que `BaseLayout.astro` soporte la prop correctamente (ya lo hace según `src/layouts/BaseLayout.astro` línea 24).

### Verificación manual

```bash
# 1. Build
npm run build

# 2. Verificar sitemap
Get-Content dist/sitemap-0.xml | Select-String "/cotizador"
# Expected: 0 matches

# 3. Verificar noindex en HTML
Get-Content dist/cotizador/index.html | Select-String "noindex"
# Expected: 1 match
```

## `src/lib/quoteAnalytics.ts` (nuevo)

```ts
// src/lib/quoteAnalytics.ts
// Wrapper de GA4. Si gtag no está disponible, loguea a console (dev).

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type QuoteEvent =
  | { name: 'quote_add_item'; params: { slug: string; quantity: number } }
  | { name: 'quote_remove_item'; params: { slug: string } }
  | { name: 'quote_update_item'; params: { slug: string; field: string } }
  | { name: 'quote_open_cart'; params: { itemCount: number } }
  | { name: 'quote_clear'; params: Record<string, never> }
  | { name: 'quote_submit_whatsapp'; params: { itemCount: number; hasContactData?: boolean } }
  | { name: 'quote_submit_email'; params: { itemCount: number } }
  | { name: 'quote_submit_success'; params: { channel: 'whatsapp' | 'email'; leadId?: number | null } }
  | { name: 'quote_submit_error'; params: { channel: 'whatsapp' | 'email'; code: string } };

export function trackEvent<E extends QuoteEvent['name']>(
  name: E,
  params: Extract<QuoteEvent, { name: E }>['params']
): void {
  if (typeof window === 'undefined') return;
  const w = window as Window & { gtag?: (...args: unknown[]) => void };

  if (typeof w.gtag === 'function') {
    w.gtag('event', name, params);
  } else if (process.env.NODE_ENV !== 'production') {
    console.debug('[quote-analytics]', name, params);
  }
  // Siempre empujar al dataLayer para GTM si existe
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...params });
  }
}
```

## Integración de GA4 (sitio)

Asumir que el snippet de GA4 ya está en `BaseLayout.astro` (verificar). Si no está, agregarlo en el `<head>` o vía `<slot name="head" />`.

Snippet típico (no incluir aquí; el sitio lo tiene aparte):

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Eventos de analytics por componente

| Componente | Evento | Trigger |
|---|---|---|
| `QuoteAddButton.astro` | `quote_add_item` | `addItem` exitoso (cantidad incrementada o nuevo item) |
| `QuoteAddButton.astro` | `quote_add_item_error` (futuro) | `addItem` retorna `CART_FULL` |
| `QuoteCartLine.astro` / `cotizador.astro` | `quote_update_item` | `updateItem` exitoso (cualquier campo de customization) |
| `cotizador.astro` | `quote_remove_item` | `removeItem` confirmado |
| `cotizador.astro` | `quote_clear` | `clearCart` confirmado |
| `cotizador.astro` | `quote_open_cart` | al cargar `/cotizador` (ya instrumentado) |
| `cotizador.astro` | `quote_submit_whatsapp` | click en "Enviar por WhatsApp ahora" |
| `QuoteRequestForm.astro` | `quote_submit_whatsapp` | submit WhatsApp con datos completos |
| `QuoteRequestForm.astro` | `quote_submit_email` | submit email con datos completos |
| `QuoteRequestForm.astro` | `quote_submit_success` | respuesta `ok: true` del endpoint |
| `QuoteRequestForm.astro` | `quote_submit_error` | respuesta con `code !== ok` |

### Implementación

Los eventos ya se invocan desde specs 02-05. Esta spec **consolida** el wrapper y verifica que cada call-site use `trackEvent` en lugar de `gtag` directo.

#### En `QuoteAddButton.astro` (spec 03)

```ts
import { trackEvent } from '@/lib/quoteAnalytics';

const result = addItem(equipment, btn.dataset.sourceUrl!);
if (result.ok) {
  const inCart = isInCart(slug);
  paintState(btn, inCart ? 'added' : 'idle');
  if (inCart) {
    trackEvent('quote_add_item', { slug, quantity: result.cart.items.find((i) => i.equipmentSlug === slug)?.customization.quantity ?? 1 });
  }
}
```

#### En `cotizador.astro` (spec 04)

```ts
import { trackEvent } from '@/lib/quoteAnalytics';

linesEl!.querySelectorAll<HTMLInputElement>('[data-line-field]').forEach((input) => {
  input.addEventListener('change', () => {
    const slug = input.dataset.lineSlug!;
    const field = input.dataset.lineField!;
    const value = input.type === 'number' ? Number(input.value) : input.value;
    updateItem(slug, { [field]: value });
    trackEvent('quote_update_item', { slug, field });
  });
});

clearBtn.addEventListener('click', () => {
  if (confirm('¿Vaciar todo el cotizador?')) {
    clearCart();
    trackEvent('quote_clear');
  }
});

waBtn.addEventListener('click', () => {
  const cart = getCart();
  const url = buildWhatsAppUrl(cart, { withContactData: false });
  trackEvent('quote_submit_whatsapp', { itemCount: cart.items.length, hasContactData: false });
  window.open(url, '_blank', 'noopener,noreferrer');
});

trackEvent('quote_open_cart', { itemCount: getCart().items.length });
```

#### En `QuoteRequestForm.astro` (spec 05)

```ts
import { trackEvent } from '@/lib/quoteAnalytics';

if (channel === 'whatsapp') {
  // ... buildWhatsAppUrl ...
  trackEvent('quote_submit_whatsapp', { itemCount: cart.items.length, hasContactData: true });
  setTimeout(() => { window.location.href = '/gracias?channel=whatsapp'; }, 400);
  return;
}

const result = await submitQuote(payload);
if (result.ok) {
  trackEvent('quote_submit_email', { itemCount: cart.items.length });
  trackEvent('quote_submit_success', { channel: 'email', leadId: result.leadId });
  window.location.href = '/gracias?channel=email';
} else {
  trackEvent('quote_submit_error', { channel: 'email', code: result.code });
}
```

## UTM propagation

### En el cliente (`buildQuoteRequest`)

Ya implementado en spec 06: lee `utm_source`, `utm_medium`, etc. de `window.location.search` y los incluye en `meta.utm` del payload.

### En el servidor (WordPress)

El plugin (spec 07) guarda los UTM en `_utm_source`, `_utm_medium`, etc. (meta del CPT). Opcionalmente, en el email al ejecutivo se pueden listar al final:

```php
// en class-mailer.php
if ( ! empty( $p['meta']['utm'] ) ) {
    $lines[] = '';
    $lines[] = 'UTM: ' . json_encode( $p['meta']['utm'] );
}
```

## Atribución: sourceUrl

El frontend guarda `sourceUrl` en cada item (`sourceUrl` de la primera página donde se agregó el equipo). Esto se usa para atribuir el lead a la página de catálogo de origen.

| Caso | sourceUrl |
|---|---|
| Agregar desde `/arriendo/izaje/gruas-100-toneladas` | esa URL |
| Recargar y volver a la misma página | la misma URL |
| Agregar desde otra página | se sobrescribe con la nueva URL (snapshot) |

Para conservar **toda** la attribution, en spec 09 se podría extender con un array `sourceUrls[]`; en v1 el snapshot único es suficiente.

## Verificación de eventos

### En dev (sin GA4)

```ts
// localStorage o console:
localStorage.setItem('DEBUG_QUOTE', '1');
// → en trackEvent, loguear a console aunque gtag exista
```

### En prod (con GA4)

1. Abrir DevTools → Network → filtrar por `collect?`.
2. Realizar un flujo completo (agregar, abrir cart, submit email).
3. Verificar que aparecen eventos `quote_add_item`, `quote_open_cart`, `quote_submit_email`, `quote_submit_success` en la consola de DebugView de GA4.

### En prod (con GTM)

1. Abrir `https://tagmanager.google.com/`.
2. Activar `Preview`.
3. Verificar que el `dataLayer.push` se dispara en cada evento.

## Privacidad y consentimiento

- El sitio debe cumplir con la Ley 19.628 (Chile). El banner de cookies ya está en `/cookies`.
- **GA4 se carga solo si el usuario acepta cookies de marketing/analítica.** Si rechaza, `trackEvent` no hace nada (porque `gtag` no existe).
- El endpoint REST **no** envía datos a GA directamente; es el frontend el que controla el consentimiento.

> **Decisión v1:** el frontend usa `gtag` solo si está disponible. Si no, `trackEvent` cae al `console.debug` (en dev) o es no-op (en prod). El sitio ya tiene la lógica de consentimiento en otro lado; esta spec no la duplica.

## Accesibilidad adicional

- Los eventos de analytics **no deben** afectar la accesibilidad. Se ejecutan en paralelo a las acciones del usuario.
- Si un screen reader necesita feedback audible ("agregado al cotizador"), eso se maneja con `aria-live` (spec 04) y **no** con eventos de analytics.

## Tareas

- [ ] Crear `src/lib/quoteAnalytics.ts`.
- [ ] Modificar `astro.config.mjs` para excluir `/cotizador*` del sitemap.
- [ ] Verificar que `BaseLayout.astro` pasa `noindex` a `<MetaTags>`.
- [ ] Verificar que `cotizador.astro` y `cotizador/datos.astro` pasan `noindex={true}`.
- [ ] Reemplazar todos los call-sites donde se usaba `gtag` directo por `trackEvent`.
- [ ] En `dev` (`npm run dev`), validar que la consola loguea los eventos.
- [ ] En prod (después de deploy), validar en GA4 DebugView.
- [ ] Configurar un **goal** en GA4: `quote_submit_success` cuenta como conversión.
- [ ] Configurar un **exploration** en GA4: funnel `quote_open_cart` → `quote_submit_*` → `quote_submit_success`.

## Definition of Done

- [ ] `src/lib/quoteAnalytics.ts` existe y compila.
- [ ] `astro.config.mjs` excluye `/cotizador` y `/cotizador/datos` del sitemap.
- [ ] `<meta name="robots" content="noindex">` está en `/cotizador` y `/cotizador/datos`.
- [ ] El sitemap (`dist/sitemap-0.xml`) no contiene URLs de `/cotizador*`.
- [ ] El sitio carga GA4 correctamente (verificable en DevTools).
- [ ] Los 7 eventos de analytics están instrumentados: `quote_add_item`, `quote_remove_item`, `quote_update_item`, `quote_open_cart`, `quote_submit_whatsapp`, `quote_submit_email`, `quote_submit_success`, `quote_submit_error`.
- [ ] `trackEvent` es **no-op** si `gtag` no está cargado (no rompe el sitio).
- [ ] UTM parameters se propagan al payload REST (verificable con un link `?utm_source=test`).
- [ ] El consentimiento de cookies se respeta (no se trackea si el usuario rechazó).
- [ ] No se loguean emails ni teléfonos a `console` en producción.

## Referencias

- Spec 02: [./02-cart-state-and-storage.md](./02-cart-state-and-storage.md) — fuente de los eventos.
- Spec 03: [./03-add-to-cart-ui.md](./03-add-to-cart-ui.md) — `quote_add_item`.
- Spec 04: [./04-cart-page.md](./04-cart-page.md) — `quote_open_cart`, `quote_update_item`, `quote_remove_item`, `quote_clear`, `quote_submit_whatsapp`.
- Spec 05: [./05-renter-data-form.md](./05-renter-data-form.md) — `quote_submit_*`.
- Spec 06: [./06-message-and-payload-builders.md](./06-message-and-payload-builders.md) — UTM propagation.
- Spec 07: [./07-backend-wordpress.md](./07-backend-wordpress.md) — `leadId` que se trackea.
- `astro.config.mjs` — integrar el filtro del sitemap.
- `src/layouts/BaseLayout.astro` — prop `noindex` (línea 24).
- Google Analytics 4: https://developers.google.com/analytics/devguides/collection/ga4
- GTM dataLayer: https://developers.google.com/tag-manager/devguide
