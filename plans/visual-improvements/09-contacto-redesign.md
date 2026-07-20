# Spec 09 — /contacto B2B + SEO industrial/minero

**Fase:** 7
**Estado:** ⬜ Pendiente
**Archivos a crear:**
- (ninguno nuevo; todo se construye sobre `BaseLayout` + `QuoteFormAdvanced` + componentes existentes)

**Archivos a modificar:**
- `src/pages/contacto/index.astro`

**Depende de:** Spec 01 (data de contacto en `site.ts`), Spec 05 (QuoteFormAdvanced con bug fix).
**Bloquea a:** ninguna.

---

## Objetivo

1. Rediseñar `/contacto` como una página orientada a **conversión B2B** para el rubro industrial/minero.
2. Estructura en 2 bloques principales:
   - **Izquierda (60%)**: el `<QuoteFormAdvanced>` con `preselectedServices` vacío (no se preselecciona nada; el usuario elige). Anchor `#cotizar` para deep-links desde otras páginas.
   - **Derecha (40%)**: tarjetas de contacto (WhatsApp, teléfono fijo, email, dirección) + CTA "Descargar catálogo".
3. Schema `ContactPage` + `LocalBusiness` con `areaServed`, `openingHours`, `telephone`, `address` para SEO local.
4. Meta description orientada a conversión: tiempo de respuesta, sectores, ubicación.
5. Hero compacto sin imagen de fondo (sobrio, tipográfico).

## Estado actual

`src/pages/contacto/index.astro` (30 líneas): placeholder con un `<h1>` y un párrafo. Usa `contactPageSchema()` pero sin data de LocalBusiness.

## Cambios en `src/pages/contacto/index.astro`

```astro
---
// src/pages/contacto/index.astro
// Página de contacto B2B.
// Estructura: hero compacto + 2 columnas (form | info de contacto).
// El form es el QuoteFormAdvanced; el bloque derecho lista canales.

import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/ui/Container.astro';
import QuoteFormAdvanced from '@/components/ui/QuoteFormAdvanced.astro';
import Icon from '@/components/ui/Icon.astro';
import { siteContact, siteBrand } from '@/data/site';
import { localBusinessSchema, contactPageSchema, breadcrumbSchema, combineSchemas } from '@/lib/seo';
import { getSiteUrl } from '@/lib/seo';

const title = 'Contacto y cotizaciones | IP Proyectos Industriales';
const description =
  'Cotiza arriendo de maquinaria pesada y servicios industriales para faenas mineras en Atacama, Coquimbo y Antofagasta. Respuesta en menos de 48 horas. WhatsApp +56 9 5659 4144.';

const breadcrumbs = [
  { label: 'Inicio', url: '/' },
  { label: 'Contacto' },
];

const jsonLd = combineSchemas(
  contactPageSchema(),
  localBusinessSchema({
    name: siteBrand.legalName,
    description: siteBrand.description,
    telephone: siteContact.phoneMobile,
    email: siteContact.email,
    address: {
      streetAddress: 'Parcela 110 Lote A-3, Vegas Norte',
      addressLocality: 'La Serena',
      addressRegion: 'Coquimbo',
      addressCountry: 'CL',
    },
    areaServed: ['Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso', 'Metropolitana'],
    openingHours: ['Mo-Fr 08:00-18:00'],
  }),
  breadcrumbSchema(breadcrumbs)
);

const whatsappLink = `https://wa.me/${siteContact.whatsappNumber}?text=Hola%20IP%20Proyectos%20Industriales%2C%20quisiera%20solicitar%20una%20cotizaci%C3%B3n.`;
---

<BaseLayout
  title={title}
  description={description}
  breadcrumbs={breadcrumbs}
  jsonLd={jsonLd}
  ogType="website"
>
  <!-- Hero compacto -->
  <section class="contact-hero">
    <Container>
      <p class="contact-hero__eyebrow">Contacto</p>
      <h1 class="contact-hero__title">Hablemos de tu proyecto</h1>
      <p class="contact-hero__subtitle">
        Cuéntanos sobre tu faena y te respondemos a la brevedad. Elige el canal
        que prefieras: WhatsApp, teléfono o el formulario de cotización.
      </p>
    </Container>
  </section>

  <!-- Bloque principal: form + info -->
  <section class="contact-main">
    <Container>
      <div class="contact-grid">
        <!-- Form -->
        <div class="contact-grid__form" id="cotizar">
          <header class="contact-form__header">
            <h2 class="contact-form__title">Solicita tu cotización</h2>
            <p class="contact-form__subtitle">
              Completa lo que aplique a tu faena. Al enviar, te contactamos a la brevedad.
            </p>
          </header>
          <QuoteFormAdvanced preselectedServices={[]} />
        </div>

        <!-- Sidebar info -->
        <aside class="contact-grid__sidebar" aria-label="Canales de contacto">
          <div class="contact-card contact-card--featured">
            <div class="contact-card__icon" aria-hidden="true">
              <Icon name="whatsapp" size={24} />
            </div>
            <h3 class="contact-card__title">WhatsApp</h3>
            <p class="contact-card__text">Respuesta rápida, sin formularios.</p>
            <a
              href={whatsappLink}
              class="contact-card__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteContact.phoneMobile}
              <Icon name="arrow-right" size={16} />
            </a>
          </div>

          <div class="contact-card">
            <div class="contact-card__icon" aria-hidden="true">
              <Icon name="phone" size={24} />
            </div>
            <h3 class="contact-card__title">Teléfono</h3>
            <p class="contact-card__text">Lunes a viernes, 08:00 – 18:00.</p>
            <a href={siteContact.phoneMobileHref} class="contact-card__link">
              {siteContact.phoneMobile}
            </a>
            <a href={siteContact.phoneLandlineHref} class="contact-card__sublink">
              {siteContact.phoneLandline}
            </a>
          </div>

          <div class="contact-card">
            <div class="contact-card__icon" aria-hidden="true">
              <Icon name="email" size={24} />
            </div>
            <h3 class="contact-card__title">Correo</h3>
            <p class="contact-card__text">Respuesta en menos de 24 h hábiles.</p>
            <a href={`mailto:${siteContact.email}`} class="contact-card__link">
              {siteContact.email}
            </a>
          </div>

          <div class="contact-card contact-card--address">
            <div class="contact-card__icon" aria-hidden="true">
              <Icon name="location" size={24} />
            </div>
            <h3 class="contact-card__title">Oficina</h3>
            <address class="contact-card__address">
              {siteContact.address}<br>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteContact.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                class="contact-card__sublink"
              >
                Ver en Google Maps
                <Icon name="arrow-right" size={14} />
              </a>
            </address>
          </div>

          <!-- CTA Catálogo -->
          <a
            href={siteContact.catalogUrl}
            class="contact-catalog"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="download" size={20} />
            <div>
              <strong>Descargar catálogo 2025</strong>
              <span>PDF · Nuestra flota completa</span>
            </div>
          </a>
        </aside>
      </div>
    </Container>
  </section>

  <!-- Confianza inferior: zonas de cobertura -->
  <section class="contact-coverage">
    <Container>
      <h2 class="contact-coverage__title">Cobertura</h2>
      <p class="contact-coverage__subtitle">
        Operamos en las principales regiones mineras e industriales de Chile.
      </p>
      <ul class="contact-coverage__list" role="list">
        <li><Icon name="map-pin" size={18} /><span>Antofagasta</span></li>
        <li><Icon name="map-pin" size={18} /><span>Atacama</span></li>
        <li><Icon name="map-pin" size={18} /><span>Coquimbo</span></li>
        <li><Icon name="map-pin" size={18} /><span>Valparaíso</span></li>
        <li><Icon name="map-pin" size={18} /><span>Metropolitana</span></li>
      </ul>
    </Container>
  </section>
</BaseLayout>

<style>
  /* Hero */
  .contact-hero {
    background-color: var(--color-graphite, #0d1611);
    color: #fff;
    padding-block: clamp(56px, 7vw, 88px);
  }

  .contact-hero__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: var(--color-brand-300, #4ade80);
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0 0 14px;
  }

  .contact-hero__eyebrow::before {
    content: '';
    width: 42px;
    height: 2px;
    background: var(--color-brand, #1a9c4a);
  }

  .contact-hero__title {
    font-family: var(--font-heading);
    font-weight: 900;
    font-size: clamp(2.2rem, 5vw, 3.6rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: #fff;
    margin: 0 0 14px;
    max-width: 18ch;
  }

  .contact-hero__subtitle {
    font-size: clamp(1rem, 1.4vw, 1.2rem);
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin: 0;
    max-width: 60ch;
  }

  /* Main grid */
  .contact-main {
    background-color: var(--color-surface-alt, #f7f9f7);
    padding-block: clamp(60px, 8vw, 100px);
  }

  .contact-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    align-items: start;
  }

  @media (min-width: 1024px) {
    .contact-grid {
      grid-template-columns: 1.5fr 1fr;
      gap: 56px;
    }
  }

  /* Form column */
  .contact-grid__form {
    background: var(--color-graphite, #0d1611);
    border-radius: 18px;
    padding: clamp(24px, 4vw, 40px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  }

  .contact-form__header {
    margin-bottom: 28px;
  }

  .contact-form__title {
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: clamp(1.4rem, 2.4vw, 1.8rem);
    letter-spacing: -0.02em;
    color: #fff;
    margin: 0 0 8px;
  }

  .contact-form__subtitle {
    margin: 0;
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
  }

  /* Sidebar */
  .contact-grid__sidebar {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .contact-card {
    background: var(--color-surface, #fff);
    border: 1px solid var(--color-line, #e5e7eb);
    border-radius: 14px;
    padding: 20px 22px;
  }

  .contact-card--featured {
    background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
    color: #fff;
    border: 0;
  }

  .contact-card--featured .contact-card__icon,
  .contact-card--featured .contact-card__link {
    color: #fff;
  }

  .contact-card--featured .contact-card__text {
    color: rgba(255, 255, 255, 0.9);
  }

  .contact-card__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--color-brand-050, rgba(26, 156, 74, 0.1));
    color: var(--color-brand, #1a9c4a);
    border-radius: 10px;
    margin-bottom: 12px;
  }

  .contact-card__title {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--color-ink, #1a1a1a);
    margin: 0 0 4px;
  }

  .contact-card--featured .contact-card__title {
    color: #fff;
  }

  .contact-card__text {
    margin: 0 0 12px;
    font-size: 0.85rem;
    color: var(--color-ink-500, #6b7280);
  }

  .contact-card__link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--color-brand, #1a9c4a);
    text-decoration: none;
  }

  .contact-card--featured .contact-card__link {
    color: #fff;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .contact-card__sublink {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    margin-right: 14px;
    font-size: 0.88rem;
    color: var(--color-ink-500, #6b7280);
    text-decoration: none;
  }

  .contact-card__sublink:hover {
    color: var(--color-brand, #1a9c4a);
  }

  .contact-card__address {
    font-style: normal;
    font-size: 0.92rem;
    line-height: 1.5;
    color: var(--color-ink-700, #374151);
    margin: 0;
  }

  /* Catálogo CTA */
  .contact-catalog {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: var(--color-brand, #1a9c4a);
    color: #fff;
    border-radius: 14px;
    text-decoration: none;
    transition: background 0.15s var(--ease-out, ease),
      transform 0.15s var(--ease-out, ease);
  }

  .contact-catalog:hover {
    background: var(--color-brand-700, #15803d);
    transform: translateY(-2px);
  }

  .contact-catalog strong {
    display: block;
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 0.95rem;
  }

  .contact-catalog span {
    display: block;
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.85);
    margin-top: 2px;
  }

  /* Cobertura */
  .contact-coverage {
    background-color: var(--color-graphite, #0d1611);
    color: #fff;
    padding-block: clamp(48px, 6vw, 80px);
  }

  .contact-coverage__title {
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: clamp(1.4rem, 2.6vw, 2rem);
    letter-spacing: -0.02em;
    color: #fff;
    margin: 0 0 8px;
    text-align: center;
  }

  .contact-coverage__subtitle {
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 32px;
  }

  .contact-coverage__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px 24px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .contact-coverage__list li {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 999px;
    font-size: 0.9rem;
    color: #fff;
  }

  .contact-coverage__list li :global(svg) {
    color: var(--color-brand-300, #4ade80);
  }
</style>
```

## Helper nuevo: `localBusinessSchema` en `src/lib/seo.ts`

Si no existe, agregar:

```ts
export interface LocalBusinessSchemaOptions {
  name: string;
  description: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  areaServed?: string[];
  openingHours?: string[];   // formato ISO 8601
  url?: string;
}

export function localBusinessSchema(opts: LocalBusinessSchemaOptions): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: opts.name,
    description: opts.description,
    telephone: opts.telephone,
    email: opts.email,
    url: opts.url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: opts.address.streetAddress,
      addressLocality: opts.address.addressLocality,
      addressRegion: opts.address.addressRegion,
      addressCountry: opts.address.addressCountry,
    },
    ...(opts.areaServed && { areaServed: opts.areaServed }),
    ...(opts.openingHours && { openingHours: opts.openingHours }),
  };
}
```

## Decisiones de diseño

1. **Hero compacto y sobrio**: el rubro industrial/minero valora la sobriedad. Un hero con imagen de fondo puede parecer informal. Aquí el hero es solo tipografía sobre fondo graphite.

2. **Form oscuro, sidebar clara**: el `<QuoteFormAdvanced>` mantiene su diseño oscuro (Spec 05). El sidebar de contacto es claro para que se diferencie visualmente y se sienta "menos formulario, más conversación".

3. **Card de WhatsApp destacada (gradiente verde)**: el canal más rápido para B2B chileno es WhatsApp. Lo destacamos visualmente. La card es la primera del sidebar y tiene el gradiente oficial de WhatsApp.

4. **Schema `LocalBusiness` + `ContactPage` combinados**: Google usa `LocalBusiness` para búsquedas locales y mapas. Con `areaServed: ['Antofagasta', 'Atacama', 'Coquimbo']` y `address` completo, mejoramos la presencia local.

5. **Anchor `#cotizar`** en el form: cualquier CTA externo (ej. botones de la home o de sub-rutas) puede apuntar a `/contacto#cotizar` y el browser hace scroll al form. UX coherente.

6. **Sección de cobertura** con pills: visual rápido de "dónde operamos" sin necesidad de un mapa. Reduce fricción.

7. **Datos dinámicos desde `site.ts`**: ningún dato hardcodeado en la página. Si cambia el teléfono o el email, se actualiza en un solo lugar.

8. **Meta description orientada a conversión**: menciona tiempo de respuesta, sectores, ubicación y canal de WhatsApp. Es lo que Google muestra en SERP.

## Tareas

- [ ] Crear/verificar `localBusinessSchema` en `src/lib/seo.ts`.
- [ ] Reemplazar `src/pages/contacto/index.astro` con la nueva versión.
- [ ] Verificar que el icono `map-pin` existe en `src/lib/icons.ts` (sino, agregarlo).
- [ ] Confirmar con el cliente las regiones de `areaServed`.
- [ ] Probar la URL de WhatsApp con `+56 9 5659 4144` en un dispositivo real.
- [ ] Validar JSON-LD con https://validator.schema.org/ (probar con la URL del sitio en producción).

## Definition of Done

- [ ] La página `/contacto` muestra un hero compacto, 2 columnas (form + sidebar) y sección de cobertura.
- [ ] El form es el `QuoteFormAdvanced` con `preselectedServices=[]`.
- [ ] El sidebar tiene 4 cards: WhatsApp (destacada), Teléfono, Correo, Oficina.
- [ ] El CTA "Descargar catálogo 2025" está visible en el sidebar.
- [ ] El anchor `#cotizar` está en el form (deep-linking funcional).
- [ ] Los schemas `ContactPage` + `LocalBusiness` están presentes y validados.
- [ ] Todos los datos (teléfono, email, dirección) vienen de `src/data/site.ts`.
- [ ] `npm run build` no genera warnings.
- [ ] Lighthouse SEO ≥ 95.
- [ ] Lighthouse Best Practices ≥ 95.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| El número de WhatsApp no está actualizado | Verificar con el cliente. La fuente única es `siteContact.whatsappNumber` en `site.ts` |
| El icono `map-pin` no existe | Agregarlo a `src/lib/icons.ts` (SVG path estándar de mapa con pin) |
| El schema `LocalBusiness` no genera rich results en Chile | El schema es estándar. Google no siempre lo muestra, pero no causa penalización |
| El form oscuro contrasta mal con el fondo `surface-alt` claro | Ajustar el `border` o `box-shadow` de la card del form si se ve "flotando" mal |
| El href del WhatsApp usa `+56 9` pero el formato internacional puede variar | Probar con `https://wa.me/56` (sin el `+` y sin el `9`) si no funciona |
