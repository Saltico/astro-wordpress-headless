// src/lib/analytics.ts
// Módulo de analytics: push de eventos al dataLayer de GTM.
// Respetar Consent Mode: trackEvent solo empuja a dataLayer; GTM decide si el tag corre.
// Convención de nombres: snake_case consistente con GA4.
// NUNCA enviar PII (RUT, nombre, email, teléfono, dirección, notas).

// ─── Core ────────────────────────────────────────────────────

/** Push genérico al dataLayer. Todos los eventos pasan por aquí. */
export function trackEvent(event: string, params: Record<string, unknown> = {}): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

// ─── Eventos del cotizador (funnel) ─────────────────────────

export function trackQuoteWizardStart(cartItemsCount: number, hasSavedCart: boolean): void {
  trackEvent('quote_wizard_start', { cart_items_count: cartItemsCount, has_saved_cart: hasSavedCart });
}

export function trackQuoteWizardStep(stepNumber: number, stepName: string, cartItemsCount: number): void {
  trackEvent('quote_wizard_step', {
    step_number: stepNumber,
    step_name: stepName,
    cart_items_count: cartItemsCount,
  });
}

export function trackQuoteWizardAbandon(lastStep: number, cartItemsCount: number, timeSpentSeconds: number): void {
  trackEvent('quote_wizard_abandon', {
    last_step: lastStep,
    cart_items_count: cartItemsCount,
    time_spent_seconds: timeSpentSeconds,
  });
}

export function trackQuoteAddItem(params: {
  itemSlug: string;
  itemName: string;
  itemCategory: string;
  itemSubcategory: string;
  itemCapacity?: string;
  sourcePage: string;
}): void {
  trackEvent('quote_add_item', {
    item_slug: params.itemSlug,
    item_name: params.itemName,
    item_category: params.itemCategory,
    item_subcategory: params.itemSubcategory,
    item_capacity: params.itemCapacity ?? '',
    source_page: params.sourcePage,
  });
}

export function trackQuoteRemoveItem(params: {
  itemSlug: string;
  itemName: string;
  itemCategory: string;
}): void {
  trackEvent('quote_remove_item', {
    item_slug: params.itemSlug,
    item_name: params.itemName,
    item_category: params.itemCategory,
  });
}

export function trackQuoteUpdateItem(itemSlug: string, fieldChanged: string): void {
  trackEvent('quote_update_item', { item_slug: itemSlug, field_changed: fieldChanged });
}

export function trackQuoteCartView(params: {
  cartItemsCount: number;
  totalUnits: number;
  totalDays: number;
  uniqueCategories: number;
}): void {
  trackEvent('quote_cart_view', {
    cart_items_count: params.cartItemsCount,
    total_units: params.totalUnits,
    total_days: params.totalDays,
    unique_categories: params.uniqueCategories,
  });
}

export function trackQuoteSendWhatsApp(params: {
  cartItemsCount: number;
  totalUnits: number;
  uniqueCategories: number;
  hasCompanyData: boolean;
}): void {
  trackEvent('quote_send_whatsapp', {
    cart_items_count: params.cartItemsCount,
    total_units: params.totalUnits,
    unique_categories: params.uniqueCategories,
    has_company_data: params.hasCompanyData,
  });
}

export function trackQuoteSendEmail(params: {
  cartItemsCount: number;
  totalUnits: number;
  uniqueCategories: number;
}): void {
  trackEvent('quote_send_email', {
    cart_items_count: params.cartItemsCount,
    total_units: params.totalUnits,
    unique_categories: params.uniqueCategories,
  });
}

export function trackQuoteEmailSuccess(params: {
  cartItemsCount: number;
  totalUnits: number;
}): void {
  trackEvent('quote_email_success', {
    cart_items_count: params.cartItemsCount,
    total_units: params.totalUnits,
  });
}

export function trackQuoteEmailError(errorType: string): void {
  trackEvent('quote_email_error', { error_type: errorType });
}

export function trackQuoteCartClear(itemsClearedCount: number): void {
  trackEvent('quote_cart_clear', { items_cleared_count: itemsClearedCount });
}

// ─── Eventos de catálogo y búsqueda ─────────────────────────

export function trackEquipmentSearch(query: string, resultsCount: number, searchType: string): void {
  trackEvent('equipment_search', {
    search_query: query,
    results_count: resultsCount,
    search_type: searchType,
  });
}

export function trackEquipmentSearchSelect(resultName: string, resultUrl: string, resultType: string, searchQuery: string): void {
  trackEvent('equipment_search_select', {
    result_name: resultName,
    result_url: resultUrl,
    result_type: resultType,
    search_query: searchQuery,
  });
}

export function trackCategoryView(categorySlug: string, categoryName: string, equipmentCount: number): void {
  trackEvent('category_view', {
    category_slug: categorySlug,
    category_name: categoryName,
    equipment_count: equipmentCount,
  });
}

export function trackSubcategoryView(categorySlug: string, subcategorySlug: string, subcategoryName: string, equipmentCount: number): void {
  trackEvent('subcategory_view', {
    category_slug: categorySlug,
    subcategory_slug: subcategorySlug,
    subcategory_name: subcategoryName,
    equipment_count: equipmentCount,
  });
}

export function trackCatalogDownload(pageUrl: string): void {
  trackEvent('catalog_download', { file_type: 'pdf', page_url: pageUrl });
}

// ─── Eventos de contacto y canales directos ─────────────────

export function trackWhatsAppClick(location: string, pageUrl: string): void {
  trackEvent('whatsapp_click', { link_location: location, page_url: pageUrl });
}

export function trackPhoneClick(location: string, phoneType: string): void {
  trackEvent('phone_click', { link_location: location, phone_number_type: phoneType });
}

export function trackEmailClick(location: string, pageUrl: string): void {
  trackEvent('email_click', { link_location: location, page_url: pageUrl });
}

export function trackContactFormSubmit(formId: string, pageUrl: string): void {
  trackEvent('contact_form_submit', { form_id: formId, page_url: pageUrl });
}

export function trackContactFormSuccess(formId: string): void {
  trackEvent('contact_form_success', { form_id: formId });
}

export function trackContactFormError(formId: string, errorType: string): void {
  trackEvent('contact_form_error', { form_id: formId, error_type: errorType });
}

// ─── Eventos de engagement ──────────────────────────────────

export function trackScrollDepth(percent: number, pageUrl: string, pageType: string): void {
  trackEvent('scroll_depth', { scroll_percent: percent, page_url: pageUrl, page_type: pageType });
}

export function trackCtaClick(label: string, destination: string, pageUrl: string, pageType: string): void {
  trackEvent('cta_click', { cta_label: label, cta_destination: destination, page_url: pageUrl, page_type: pageType });
}

export function trackNavigationClick(label: string, url: string, level: number, pageUrl: string): void {
  trackEvent('navigation_click', { nav_label: label, nav_url: url, nav_level: level, page_url: pageUrl });
}

export function trackOutboundLink(linkDomain: string, linkUrl: string, pageUrl: string): void {
  trackEvent('outbound_link', { link_domain: linkDomain, link_url: linkUrl, page_url: pageUrl });
}

export function trackQuoteFabClick(cartItemsCount: number, pageUrl: string): void {
  trackEvent('quote_fab_click', { cart_items_count: cartItemsCount, page_url: pageUrl });
}

// ─── Eventos de error y fricción ────────────────────────────

export function trackFormValidationError(formId: string, fieldName: string, errorType: string, pageUrl: string): void {
  trackEvent('form_validation_error', { form_id: formId, field_name: fieldName, error_type: errorType, page_url: pageUrl });
}

export function trackPageError(errorCode: number, referrerUrl: string): void {
  trackEvent('page_error', { error_code: errorCode, referrer_url: referrerUrl });
}

export function trackQuoteCartEmptyContinue(attemptedStep: number): void {
  trackEvent('quote_cart_empty_continue', { attempted_step: attemptedStep });
}

// ─── Delegación de clics (inicialización) ───────────────────

export function initAnalytics(): void {
  // 1. quote_add_item ya se dispara desde QuoteAddButton.astro
  window.addEventListener('quote_add_item', (e: Event) => {
    const detail = (e as CustomEvent).detail ?? {};
    trackEvent('quote_add_item', { item_slug: detail.slug });
  });

  // 2. Delegación de clics con link_location mejorado
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    // CTA tracking (data-cta-label)
    const ctaEl = target.closest<HTMLElement>('[data-cta-label]');
    if (ctaEl) {
      trackCtaClick(
        ctaEl.dataset.ctaLabel ?? '',
        ctaEl.dataset.ctaDestination ?? '',
        location.pathname,
        document.querySelector<HTMLElement>('meta[name="page-type"]')?.getAttribute('content') ?? ''
      );
    }

    // Navigation tracking (data-nav-label)
    const navEl = target.closest<HTMLElement>('[data-nav-label]');
    if (navEl) {
      trackNavigationClick(
        navEl.dataset.navLabel ?? '',
        navEl.dataset.navUrl ?? navEl.getAttribute('href') ?? '',
        Number(navEl.dataset.navLevel ?? 1),
        location.pathname
      );
    }

    // Link delegation
    const a = target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';

    // WhatsApp con ubicación
    if (href.startsWith('https://wa.me')) {
      const waLocation = a.closest<HTMLElement>('[data-wa-location]')?.dataset.waLocation
        ?? a.dataset.waLocation
        ?? 'unknown';
      trackWhatsAppClick(waLocation, location.pathname);
    }
    // Teléfono
    else if (href.startsWith('tel:')) {
      const phoneType = href.includes('569') ? 'mobile' : 'landline';
      trackPhoneClick('inline', phoneType);
    }
    // Email
    else if (href.startsWith('mailto:')) {
      trackEmailClick('inline', location.pathname);
    }
    // PDF download
    else if (/\.(pdf)($|\?)/i.test(href)) {
      trackCatalogDownload(location.pathname);
    }
    // Outbound
    else if (a.hostname && a.hostname !== location.hostname) {
      trackOutboundLink(a.hostname, href, location.pathname);
    }
  });

  // 3. Scroll depth tracking
  initScrollDepthTracking();
}

// ─── Scroll depth con IntersectionObserver ──────────────────

function initScrollDepthTracking(): void {
  const thresholds = [25, 50, 75, 100];
  const reached = new Set<number>();

  const sentinels = thresholds.map((pct) => {
    const el = document.createElement('div');
    el.style.cssText = `position:absolute;left:0;width:1px;height:1px;pointer-events:none;opacity:0;`;
    el.style.top = `${pct}%`;
    el.dataset.scrollPct = String(pct);
    document.body.appendChild(el);
    return el;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const pct = Number((entry.target as HTMLElement).dataset.scrollPct);
        if (reached.has(pct)) return;
        reached.add(pct);
        trackScrollDepth(
          pct,
          location.pathname,
          document.querySelector<HTMLElement>('meta[name="page-type"]')?.getAttribute('content') ?? ''
        );
      });
    },
    { rootMargin: '0px 0px -10% 0px' }
  );

  sentinels.forEach((el) => observer.observe(el));
}
