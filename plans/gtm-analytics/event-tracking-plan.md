---
title: Plan de eventos de tracking (dataLayer)
feature: event-tracking
effort: Medium
dependencies: [gtm-core]
status: Planned
---

# Plan de eventos de tracking para SEM y leads

El `dataLayer` es la fuente única de eventos. GTM los transforma en tags de GA4/Google Ads.
Todos los eventos usan `window.dataLayer.push({event: '...', ...})`.

## Esquema base del dataLayer

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'site_context',
  page_type: 'cotizador',          // home | arriendo | servicio | contacto | cotizador | gracias | noticia
  content_group: 'arriendo_izaje', // categoría/subcategoría para segmentar
  locale: 'es-CL'
});
```

## Eventos de conversión (priorizados para SEM)

| # | Evento | Cuándo disparar | Valor SEM | Esfuerzo |
|---|--------|----------------|-----------|----------|
| 1 | `quote_submit_success` | Respuesta exitosa de `POST /api/quote-email` | **Conversión primaria** | Medium |
| 2 | `quote_add_item` | Ya existe `CustomEvent('quote_add_item',{slug})` → reenviar a dataLayer | Micro-conversión | Low |
| 3 | `whatsapp_click` | Click en cualquier enlace `wa.me` | Micro-conversión de intención | Low |
| 4 | `phone_click` | Click en `tel:` | Micro-conversión | Low |
| 5 | `email_click` | Click en `mailto:` | Micro-conversión | Low |
| 6 | `catalog_download` | Click en link del PDF `IPP-2025.pdf` | Micro-conversión | Low |
| 7 | `quote_form_start` | Foco en 1er campo del wizard paso 2 o del `QuoteFormAdvanced` | Señal intención | Low |
| 8 | `form_submit_success` | Respuesta exitosa de un formulario con endpoint verificado | Conversión secundaria/primaria | Medium |
| 9 | `quote_step_view` | Cambio de paso en `QuoteWizard` (hook `quote-wizard-navigate`) | Funnel | Low |
| 10 | `internal_search` | Búsqueda en `EquipmentSearch` | Intención | Low |
| 11 | `cta_click` | Cualquier `CTABand`/botón primario con `data-cta` | Engagement | Low |
| 12 | `file_download` | Cualquier descarga de archivo | Engagement | Low |
| 13 | `outbound_link` | Click a dominio externo (WordPress/news, LinkedIn) | Atribución | Low |

## Cómo cablear los eventos existentes (sin tocar lógica de negocio)

El proyecto ya emite `CustomEvent`s. Los aprovechamos con un único listener global
en un módulo `src/lib/analytics.ts` importado por `BaseLayout`:

```ts
// src/lib/analytics.ts
export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export function initAnalytics() {
  // quote_add_item ya se dispara desde QuoteAddButton.astro
  window.addEventListener('quote_add_item', (e: Event) => {
    const { slug } = (e as CustomEvent).detail ?? {};
    trackEvent('quote_add_item', { item_slug: slug });
  });

  // WhatsApp / tel / mailto / descargas: delegación de clics
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement)?.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.startsWith('https://wa.me')) trackEvent('whatsapp_click', { link_type: 'whatsapp' });
    else if (href.startsWith('tel:')) trackEvent('phone_click', { link_type: 'phone' });
    else if (href.startsWith('mailto:')) trackEvent('email_click', { link_type: 'email' });
    else if (/\.pdf($|\?)/i.test(href)) trackEvent('catalog_download', { file_type: 'pdf' });
    else if (a.hostname && a.hostname !== location.hostname)
      trackEvent('outbound_link', { link_domain: a.hostname });
  });
}
```

> **Nota:** respetar Consent Mode — `trackEvent` solo empuja a `dataLayer`; GTM decide
> si el tag corre según el consentimiento (ver `consent-management.md`).

## Evento de conversión primaria con valor

Después de que `QuoteReview.astro` reciba `response.ok && result.success` desde
`POST /api/quote-email`, empujar:

```js
dataLayer.push({
  event: 'quote_submit_success',
  lead_type: 'cotizador',          // cotizador | contacto
  service: 'izaje',                // categoría principal
  value: 0,                        // estimado; ver sem-strategy (offline import)
  currency: 'CLP'
});
```

Para SEM avanzado se recomienda **asignar un valor estimado** (p. ej. ticket promedio
por categoría) para habilitar *value-based bidding* (ver `sem-strategy.md`).

## Mapeo a GA4 / Google Ads

| dataLayer event | GA4 event | Google Ads conversion |
|-----------------|-----------|------------------------|
| `quote_submit_success` | `generate_lead` | **Conversión primaria** |
| `whatsapp_click` | `contact_whatsapp` | Conversión secundaria |
| `phone_click` | `contact_phone` | Conversión secundaria |
| `catalog_download` | `file_download` | Conversión secundaria |
| `quote_add_item` | `add_to_cart` (lead) | Señal de audiencia |

Ver funnel en [`flows/quote-lead-funnel.mmd`](./flows/quote-lead-funnel.mmd) y
secuencia en [`flows/data-layer-flow.mmd`](./flows/data-layer-flow.mmd).
