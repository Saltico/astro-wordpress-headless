// src/lib/analytics.ts
// Modulo de analytics: escucha eventos del DOM y los reenvia al dataLayer de GTM.
// Respetar Consent Mode: trackEvent solo empuja a dataLayer; GTM decide si el tag corre.

export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export function initAnalytics() {
  // 1. quote_add_item ya se dispara desde QuoteAddButton.astro
  window.addEventListener('quote_add_item', (e: Event) => {
    const detail = (e as CustomEvent).detail ?? {};
    trackEvent('quote_add_item', { item_slug: detail.slug });
  });

  // 2. Delegacion de clics: WhatsApp, tel, mailto, descargas, outbound
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement)?.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.startsWith('https://wa.me')) {
      trackEvent('whatsapp_click', { link_type: 'whatsapp' });
    } else if (href.startsWith('tel:')) {
      trackEvent('phone_click', { link_type: 'phone' });
    } else if (href.startsWith('mailto:')) {
      trackEvent('email_click', { link_type: 'email' });
    } else if (/\.(pdf)($|\?)/i.test(href)) {
      trackEvent('catalog_download', { file_type: 'pdf' });
    } else if (a.hostname && a.hostname !== location.hostname) {
      trackEvent('outbound_link', { link_domain: a.hostname });
    }
  });
}
