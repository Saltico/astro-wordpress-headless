# Spec 01 — Data de sitio unificada (single source of truth)

**Fase:** 1
**Estado:** ⬜ Pendiente
**Archivos a crear:**
- `src/data/site.ts`

**Archivos a modificar:**
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`

**Archivos a eliminar:**
- (ninguno en esta spec)

**Depende de:** nada.
**Bloquea a:** Specs 02, 06, 07, 08, 09 (todas consumen la data).

---

## Objetivo

Centralizar en `src/data/site.ts` toda la información de sitio compartida: topbar, navegación, footer, redes sociales, branding, contacto. El `BaseLayout.astro` importa esta data y la reparte como props a `TopBar`, `Navigation`, `Footer` y otros componentes. **No se elimina la API de props de los componentes** — el template sigue siendo reutilizable para otros proyectos.

## Por qué esto no rompe SEO

Ver sección "A. Footer dinámico + single source of truth" del [README](./README.md). En resumen: el HTML server-rendered es idéntico en todas las páginas porque la data es la misma. Google lo prefiere así.

## Archivo a crear: `src/data/site.ts`

```ts
// src/data/site.ts
// Single source of truth para toda la data de sitio compartida:
// topbar, navegación, footer, branding, contacto, redes sociales.
//
// Este archivo es la única fuente. Los componentes UI reciben esta data
// como props (no la importan directamente) para mantener la reusabilidad.

import type { NavItem } from '@/types/navigation';
import type { FooterColumn, FooterLink, SocialLink } from '@/types/layout';

// ─── Branding ────────────────────────────────────────────────────────────
export const siteBrand = {
  name: 'IP Proyectos Industriales',
  legalName: 'IP Proyectos Industriales SpA',
  tagline: 'La pasión y el valor por un trabajo bien hecho.',
  description:
    'Especialistas en obras civiles, montaje industrial y arriendo de maquinaria de alto tonelaje para la gran minería.',
  logoUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2024/12/logo.png',
  siteUrl: 'ipproyectosindustriales.cl',
};

// ─── Contacto ───────────────────────────────────────────────────────────
export const siteContact = {
  phoneMobile: '+56 9 5659 4144',
  phoneMobileHref: 'tel:+56956594144',
  phoneLandline: '(51) 2 750535',
  phoneLandlineHref: 'tel:+56512750535',
  whatsappNumber: '56956594144',
  email: 'contacto@ipproyectosindustriales.cl',
  address: 'Parcela 110 Lote A-3, Vegas Norte, La Serena',
  schedule: 'Lunes a Viernes, 08:00 – 18:00',
  catalogUrl:
    'https://ipproyectosindustriales.cl/wp-content/uploads/2025/08/IPP-2025.pdf',
};

// ─── TopBar (utility bar) ────────────────────────────────────────────────
export const topbarData = {
  phone: siteContact.phoneMobile,
  email: siteContact.email,
  social: [
    {
      platform: 'linkedin' as const,
      url: 'https://www.linkedin.com/company/ip-proyectos-industrialescqbo',
    },
    {
      platform: 'instagram' as const,
      url: 'https://www.instagram.com/ip.proyectosindustriales/',
    },
    {
      platform: 'facebook' as const,
      url: 'https://web.facebook.com/ipproyectosindustrialescqbo',
    },
  ] satisfies SocialLink[],
  links: [
    { label: 'Canal de Integridad', url: '/canal-integridad' },
    { label: 'Noticias', url: '/noticias' },
  ],
};

// ─── Navegación principal (sin "Empresa", se accede por el logo) ────────
export const navigationData: NavItem[] = [
  {
    label: 'Servicios',
    url: '/servicios',
    children: [
      { label: 'Ingeniería', url: '/servicios/ingenieria' },
      { label: 'Construcción', url: '/servicios/construccion' },
      { label: 'Montajes', url: '/servicios/montajes' },
      {
        label: 'Infraestructura portuaria',
        url: '/servicios/infraestructura-portuaria',
      },
    ],
  },
  {
    label: 'Arriendo',
    url: '/arriendo',
    children: [
      { label: 'Izaje', url: '/arriendo/izaje' },
      { label: 'Movimiento de tierra', url: '/arriendo/movimiento-de-tierra' },
      { label: 'Transporte', url: '/arriendo/transporte' },
      { label: 'Equipos especiales', url: '/arriendo/equipos-especiales' },
    ],
  },
  { label: 'Seguridad', url: '/seguridad' },
  { label: 'Compliance', url: '/compliance' },
  { label: 'Contacto', url: '/contacto' },
];

// ─── Footer ──────────────────────────────────────────────────────────────
export const footerData: {
  columns: FooterColumn[];
  legal: FooterLink[];
  catalogUrl: string;
  catalogLabel: string;
} = {
  columns: [
    {
      title: 'Servicios',
      links: [
        { label: 'Ingeniería', url: '/servicios/ingenieria' },
        { label: 'Construcción', url: '/servicios/construccion' },
        { label: 'Montajes', url: '/servicios/montajes' },
        {
          label: 'Infraestructura portuaria',
          url: '/servicios/infraestructura-portuaria',
        },
        { label: 'Arriendo de equipos', url: '/arriendo' },
      ],
    },
    {
      title: 'Arriendo de equipos',
      links: [
        { label: 'Catálogo completo', url: '/arriendo' },
        { label: 'Izaje', url: '/arriendo/izaje' },
        { label: 'Movimiento de tierra', url: '/arriendo/movimiento-de-tierra' },
        { label: 'Transporte', url: '/arriendo/transporte' },
        { label: 'Equipos especiales', url: '/arriendo/equipos-especiales' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Nuestra empresa', url: '/' },
        { label: 'Seguridad y medio ambiente', url: '/seguridad' },
        { label: 'Compliance', url: '/compliance' },
        { label: 'Canal de denuncias', url: '/canal-integridad' },
      ],
    },
  ],
  legal: [
    { label: 'Aviso Legal', url: '/aviso-legal' },
    { label: 'Política de Privacidad', url: '/privacidad' },
    { label: 'Cookies', url: '/cookies' },
  ],
  catalogUrl: siteContact.catalogUrl,
  catalogLabel: 'Descargar catálogo 2025',
};
```

## Cambios en `src/layouts/BaseLayout.astro`

Reemplazar el bloque de defaults inline (líneas 74-165) por imports desde `site.ts`. Eliminar los `defaultNavItems`, `defaultFooterColumns`, `defaultLegalLinks` que están hardcodeados.

```astro
---
import '@/styles/base.css';
import type { NavItem } from '@/types/navigation';
import type { FooterColumn, FooterLink, SocialLink } from '@/types/layout';
import type { BaseLayoutProps } from '@/types/layout';
import type { BreadcrumbItem } from '@/types/seo';
import SkipLink from '@/components/layout/SkipLink.astro';
import TopBar from '@/components/layout/TopBar.astro';
import Header from '@/components/layout/Header.astro';
import Navigation from '@/components/layout/Navigation.astro';
import Footer from '@/components/layout/Footer.astro';
import MetaTags from '@/components/seo/MetaTags.astro';
import Breadcrumbs from '@/components/seo/Breadcrumbs.astro';
import JsonLd from '@/components/seo/JsonLd.astro';
import { organizationSchema, websiteSchema, getSiteUrl } from '@/lib/seo';
import { siteBrand, siteContact, topbarData, navigationData, footerData } from '@/data/site';
import logoImg from '@/assets/logos/logo_ipproyectosindustriales.png';
import Icon from '@/components/ui/Icon.astro';

// Las props siguen siendo opcionales. Si la página no pasa nada,
// se usa la data canónica de site.ts. Si pasa override, gana.
const props = Astro.props as BaseLayoutProps & {
  topbar?: typeof topbarData;
  navigation?: { items: NavItem[]; ariaLabel?: string };
  footer?: {
    columns: FooterColumn[];
    legal: FooterLink[];
    brand: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: string;
    schedule?: string;
    social?: SocialLink[];
    logoUrl?: string;
    logoAlt?: string;
    catalogUrl?: string;
    catalogLabel?: string;
    siteUrl?: string;
  };
  headerVariant?: 'default' | 'brand';
  ogImage?: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  showTopBar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
};

const {
  title,
  description,
  canonical: canonicalProp,
  ogImage,
  noindex = false,
  breadcrumbs,
  jsonLd,
  showTopBar = true,
  showHeader = true,
  showFooter = true,
  topbar = topbarData,
  navigation = { items: navigationData },
  footer,
  headerVariant = 'brand',
} = props;

const canonical = canonicalProp ?? getSiteUrl(Astro.url.pathname);

// Footer canónico derivado de site.ts; el override (si existe) gana.
const effectiveFooter = {
  columns: footer?.columns ?? footerData.columns,
  legal: footer?.legal ?? footerData.legal,
  brand: footer?.brand ?? siteBrand.name,
  description: footer?.description ?? siteBrand.description,
  phone: footer?.phone ?? siteContact.phoneMobile,
  email: footer?.email ?? siteContact.email,
  address: footer?.address ?? siteContact.address,
  schedule: footer?.schedule ?? siteContact.schedule,
  social: footer?.social ?? topbarData.social,
  logoUrl: footer?.logoUrl ?? siteBrand.logoUrl,
  logoAlt: footer?.logoAlt ?? siteBrand.name,
  catalogUrl: footer?.catalogUrl ?? footerData.catalogUrl,
  catalogLabel: footer?.catalogLabel ?? footerData.catalogLabel,
  siteUrl: footer?.siteUrl ?? siteBrand.siteUrl,
};

const baseSchemas = [organizationSchema(), websiteSchema()];
const pageSchemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
const allSchemas = [...baseSchemas, ...pageSchemas];
---

<!doctype html>
<html lang="es">
  <head>
    <!-- ... sin cambios ... -->
  </head>
  <body>
    <SkipLink targetId="main-content" />

    {showTopBar && <TopBar {...topbar} />}

    {
      showHeader && (
        <Header variant={headerVariant}>
          <a href="/" slot="logo" class="header-logo" aria-label="IP Proyectos Industriales - Inicio">
            <img src={logoImg.src} alt="IP Proyectos Industriales" ... />
          </a>
          <Navigation slot="navigation" items={navigation.items} aria-label={navigation.ariaLabel} variant={headerVariant} />
          <a slot="cta" href="/contacto" class:list={['header-cta', headerVariant === 'brand' && 'header-cta--on-brand']}>
            <span class="header-cta__text">Solicitar cotización</span>
            <span class="header-cta__text-short">Cotizar</span>
            <Icon name="arrow-right" size={13} class="header-cta__icon" />
          </a>
        </Header>
      )
    }

    <main id="main-content" tabindex="-1">
      <slot />
    </main>

    {
      showFooter && (
        <Footer
          columns={effectiveFooter.columns}
          legal={effectiveFooter.legal}
          brand={effectiveFooter.brand}
          description={effectiveFooter.description}
          phone={effectiveFooter.phone}
          email={effectiveFooter.email}
          address={effectiveFooter.address}
          schedule={effectiveFooter.schedule}
          social={effectiveFooter.social}
          logoUrl={effectiveFooter.logoUrl}
          logoAlt={effectiveFooter.logoAlt}
          catalogUrl={effectiveFooter.catalogUrl}
          catalogLabel={effectiveFooter.catalogLabel}
          siteUrl={effectiveFooter.siteUrl}
        />
      )
    }
  </body>
</html>
```

## Cambios en `src/pages/index.astro`

Eliminar el bloque `footer={{...}}` (líneas 149-190). Ahora hereda el footer canónico automáticamente.

```diff
 <BaseLayout
   title={title}
   description={description}
   headerVariant="brand"
-  footer={{
-    columns: [
-      { title: 'Servicios', links: [...] },
-      { title: 'Empresa', links: [...] },
-    ],
-    legal: [...],
-    brand: 'IP Proyectos Industriales',
-    description: 'La pasión y el valor por un trabajo bien hecho.',
-    phone: '+56 9 5659 4144',
-    email: 'contacto@ipproyectosindustriales.cl',
-    address: 'Parcela 110 Lote A-3, Vegas Norte, La Serena',
-    social: [...],
-    logoUrl: '...',
-    catalogUrl: '...',
-    siteUrl: 'ipproyectosindustriales.cl',
-  }}
 >
```

## Decisiones de diseño

1. **Override explícito sigue siendo posible**: una página puede pasar `footer={...}` si necesita un footer especial (ej. una landing de campaña). Se documenta en el código con un comentario.

2. **No se eliminan los `defaults` hasta que todas las páginas estén migradas**: en este PR solo se cambia el origen de los datos. Cualquier página que pase `footer` propio sigue funcionando.

3. **`satisfies` en lugar de `as`**: el array `topbarData.social` usa `satisfies SocialLink[]` para validar el tipo sin perder el literal (mejor para narrowing en componentes).

4. **No se introduce `useConfig` / `getConfig()` runtime**: el archivo se importa estáticamente. Tree-shaking sigue funcionando; el bundle no crece.

5. **Brand legal name y nombre visible**: separados porque en documentos legales / Compliance se usa el nombre legal. La mayoría de las páginas usa el nombre comercial.

## Tareas

- [ ] Crear `src/data/site.ts` con las constantes exportadas.
- [ ] Editar `BaseLayout.astro`: importar de `@/data/site`, eliminar los `defaultNavItems`, `defaultFooterColumns`, `defaultLegalLinks` inline.
- [ ] Aplicar la lógica de override (`footer` prop gana si está presente).
- [ ] Eliminar el `footer={{...}}` de `src/pages/index.astro`.
- [ ] Auditar con `grep -rn "defaultFooterColumns\|defaultNavItems" src/` y limpiar.
- [ ] Verificar con `npm run build` que el HTML del footer es idéntico entre `dist/index.html` y `dist/seguridad/index.html`.
- [ ] Confirmar visualmente que no aparece "doble footer" en ninguna página.

## Definition of Done

- [ ] `src/data/site.ts` existe y exporta `siteBrand`, `siteContact`, `topbarData`, `navigationData`, `footerData`.
- [ ] `BaseLayout.astro` no contiene arrays de nav/footer hardcodeados.
- [ ] `index.astro` no pasa `footer` propio (usa el canónico).
- [ ] Todas las páginas del sitio muestran el mismo footer (mismas columnas, mismos links, mismo catálogo, mismas redes, misma dirección).
- [ ] El HTML estático del footer es idéntico entre páginas (verificable con `diff` o `Get-Content`).
- [ ] Una página puede pasar `footer={...}` y override funciona (regresión testeable).
- [ ] `npm run build` compila sin warnings.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Páginas que aún pasan `footer` propio quedan inconsistentes | Auditoría con grep; PR por separado para limpiar call-sites que ya no aplican |
| Cambio de tipo de `siteContact` rompe el tipado del `Footer` | `Footer` ya recibe `phone?: string`; los strings del nuevo site.ts son compatibles |
| `social: SocialLink[]` no matchea con el mapa de iconos del Footer | El Footer ya hace `socialIconMap[link.platform]`. El nuevo array usa los mismos 3 platform keys (linkedin, instagram, facebook) |
