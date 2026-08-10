---
feature: Implementation Guide - Step-by-Step
effort: Medium-High
dependencies: [design-brief.md, all plan documents]
status: Ready for execution
date: 2026-08-09
---

# Guía de Implementación — Rental-First Homepage Remake

Esta guía proporciona el paso a paso detallado para ejecutar el rediseño del homepage con enfoque rental-first. Sigue las fases en orden para minimizar riesgos y maximizar eficiencia.

---

## Antes de Empezar

### Pre-requisitos
- [ ] Node.js >= 22.12.0 instalado
- [ ] Git working tree limpio (sin cambios pendientes)
- [ ] Branch de feature creado: `git checkout -b feature/rental-homepage-remake`
- [ ] Dev server funcionando: `npm run dev`
- [ ] Navegador abierto en http://localhost:4321

### Backup
```bash
# Crear tag de backup antes de empezar
git tag pre-rental-remake
git push origin pre-rental-remake
```

---

## Fase 1: Data & Configuration (1.5 horas)

**Objetivo:** Actualizar la configuración del sitio para reflejar el enfoque rental-first.

### Paso 1.1: Actualizar siteBrand (15 min)

**Archivo:** `src/data/site.ts`

**Qué hacer:**
```typescript
// ANTES
export const siteBrand = {
  name: 'IP Proyectos Industriales',
  legalName: 'IP Proyectos Industriales SpA',
  tagline: 'La pasión y el valor por un trabajo bien hecho.',
  description: 'Especialistas en obras civiles, montaje industrial y arriendo de maquinaria de alto tonelaje para la gran minería.',
  // ...
};

// DESPUÉS
export const siteBrand = {
  name: 'IP Proyectos Industriales',
  legalName: 'IP Proyectos Industriales SpA',
  tagline: 'Arriendo de maquinaria pesada para la minería.',
  description: 'Arriendo de grúas, movimiento de tierra, transporte y equipos especiales para la gran minería. También ingeniería, construcción y montajes industriales.',
  // ...
};
```

**Verificación:**
- [ ] El tagline aparece en el footer
- [ ] La descripción se usa en meta tags

---

### Paso 1.2: Reordenar navigationData (10 min)

**Archivo:** `src/data/site.ts`

**Qué hacer:** Mover "Arriendo" a la primera posición.

```typescript
export const navigationData: NavItem[] = [
  {
    label: 'Arriendo',        // ← PRIMERO
    url: '/arriendo',
    children: [
      { label: 'Izaje', url: '/arriendo/izaje' },
      { label: 'Movimiento de tierra', url: '/arriendo/movimiento-de-tierra' },
      { label: 'Transporte', url: '/arriendo/transporte' },
      { label: 'Equipos especiales', url: '/arriendo/equipos-especiales' },
    ],
  },
  {
    label: 'Servicios',       // ← SEGUNDO
    url: '/servicios',
    children: [
      { label: 'Ingeniería', url: '/servicios/ingenieria' },
      { label: 'Construcción', url: '/servicios/construccion' },
      { label: 'Montajes', url: '/servicios/montajes' },
      { label: 'Infraestructura portuaria', url: '/servicios/infraestructura-portuaria' },
    ],
  },
  { label: 'Seguridad', url: '/seguridad' },
  { label: 'Compliance', url: '/compliance' },
];
```

**Verificación:**
- [ ] En el navegador, "Arriendo" aparece primero en el menú
- [ ] El dropdown de Arriendo funciona correctamente

---

### Paso 1.3: Reordenar footerData (10 min)

**Archivo:** `src/data/site.ts`

**Qué hacer:** Intercambiar las columnas 1 y 2 del footer.

```typescript
export const footerData = {
  columns: [
    {
      title: 'Arriendo de equipos',    // ← PRIMERA COLUMNA
      links: [
        { label: 'Catálogo completo', url: '/arriendo' },
        { label: 'Izaje', url: '/arriendo/izaje' },
        { label: 'Movimiento de tierra', url: '/arriendo/movimiento-de-tierra' },
        { label: 'Transporte', url: '/arriendo/transporte' },
        { label: 'Equipos especiales', url: '/arriendo/equipos-especiales' },
      ],
    },
    {
      title: 'Servicios',               // ← SEGUNDA COLUMNA
      links: [
        { label: 'Ingeniería', url: '/servicios/ingenieria' },
        { label: 'Construcción', url: '/servicios/construccion' },
        { label: 'Montajes', url: '/servicios/montajes' },
        { label: 'Infraestructura portuaria', url: '/servicios/infraestructura-portuaria' },
      ],
    },
    {
      title: 'Empresa',                 // ← TERCERA COLUMNA (sin cambios)
      links: [
        { label: 'Nuestra empresa', url: '/nosotros' },
        { label: 'Seguridad y medio ambiente', url: '/seguridad' },
        { label: 'Compliance', url: '/compliance' },
        { label: 'Canal de denuncias', url: '/canal-integridad' },
      ],
    },
  ],
  // ...
};
```

**Verificación:**
- [ ] En el footer, "Arriendo de equipos" es la primera columna
- [ ] Todos los links funcionan

---

### Paso 1.4: Agregar "Cotizador" al topbar (5 min)

**Archivo:** `src/data/site.ts`

**Qué hacer:**
```typescript
export const topbarData = {
  phone: siteContact.phoneMobile,
  email: siteContact.email,
  social: [ /* ... */ ],
  links: [
    { label: 'Canal de Integridad', url: '/canal-integridad' },
    { label: 'Noticias', url: '/noticias' },
    { label: 'Cotizador', url: '/cotizador' },  // ← NUEVO
  ],
};
```

**Verificación:**
- [ ] "Cotizador" aparece en la topbar
- [ ] El link funciona

---

### Paso 1.5: Crear featuredEquipment (30 min)

**Archivo:** `src/data/site.ts` (o nuevo archivo `src/data/featured.ts`)

**Qué hacer:** Agregar array de equipos destacados.

```typescript
export const featuredEquipment = [
  {
    categorySlug: 'izaje',
    subcategorySlug: 'gruas-100-toneladas',
    badge: 'Más solicitado',
  },
  {
    categorySlug: 'movimiento-de-tierra',
    subcategorySlug: 'camiones-tolva',
    badge: 'Disponible',
  },
  {
    categorySlug: 'izaje',
    subcategorySlug: 'camion-pluma',
    badge: 'Nuevo',
  },
  // Agregar 3-6 items según criterio comercial
];
```

**Nota:** Este array será usado por el componente `FeaturedEquipment`. El equipo comercial puede actualizarlo manualmente.

**Verificación:**
- [ ] Los slugs coinciden con equipos existentes en `rental.ts`
- [ ] No hay errores de TypeScript

---

### Paso 1.6: Agregar coverageZones (15 min)

**Archivo:** `src/data/site.ts`

**Qué hacer:**
```typescript
export const coverageZones = [
  { region: 'Atacama', cities: ['Copiapó', 'Caldera', 'Vallenar'] },
  { region: 'Coquimbo', cities: ['La Serena', 'Coquimbo', 'Ovalle'] },
  { region: 'Antofagasta', cities: ['Antofagasta', 'Calama', 'Tocopilla'] },
];
```

**Verificación:**
- [ ] No hay errores de TypeScript

---

### Paso 1.7: Verificar imágenes de categorías (20 min)

**Archivo:** `src/data/rental.ts`

**Qué hacer:** Verificar que cada categoría en `RENTAL_CATEGORIES` tenga una imagen hero asignada.

```typescript
// Verificar que cada categoría tenga heroImage
{
  slug: 'izaje',
  name: 'Izaje',
  heroImage: izajeHero,  // ← Debe existir
  // ...
}
```

**Si faltan imágenes:**
- Usar imágenes existentes de `src/assets/imgs/hero/arriendo/`
- O usar la misma imagen para todas temporalmente

**Verificación:**
- [ ] Todas las categorías tienen `heroImage` asignada
- [ ] `npm run dev` no muestra errores

---

### Commit de Fase 1
```bash
git add src/data/site.ts src/data/rental.ts
git commit -m "feat(data): update site config for rental-first homepage

- Reorder navigation (Arriendo first)
- Reorder footer columns
- Add Cotizador to topbar
- Update siteBrand tagline and description
- Add featuredEquipment array
- Add coverageZones data
- Verify category hero images"
```

---

## Fase 2: Navigation & Header (1 hora)

**Objetivo:** Agregar botón CTA en el header y actualizar breadcrumbs.

### Paso 2.1: Agregar slot CTA a Header.astro (30 min)

**Archivo:** `src/components/layout/Header.astro`

**Qué hacer:** Agregar un slot para el botón CTA.

```astro
---
// Header.astro
export interface Props {
  variant?: 'default' | 'brand';
}

const { variant = 'default' } = Astro.props;
---

<header class="header" data-variant={variant}>
  <div class="header__container">
    <slot name="logo" />
    <slot name="navigation" />
    <div class="header__actions">
      <slot name="cta" />
    </div>
  </div>
</header>
```

**CSS:** Agregar estilos para `.header__actions` si no existen.

```css
.header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 768px) {
  .header__actions {
    display: none; /* Ocultar en mobile, el menú hamburguesa lo tiene */
  }
}
```

**Verificación:**
- [ ] El slot `cta` se renderiza en desktop
- [ ] Se oculta en mobile

---

### Paso 2.2: Renderizar botón "Cotizar" en BaseLayout (15 min)

**Archivo:** `src/layouts/BaseLayout.astro`

**Qué hacer:** Agregar el botón CTA en el slot del header.

```astro
<Header variant={headerVariant}>
  <a href="/" slot="logo" class="header-logo">
    <!-- ... -->
  </a>
  <Navigation slot="navigation" items={navItems} />
  <Fragment slot="cta">
    <Button href="/cotizador" variant="primary" size="sm" icon="arrow-right" iconPosition="right">
      Cotizar
    </Button>
    <ThemeToggle />
    <QuoteCartBadge />
  </Fragment>
</Header>
```

**Verificación:**
- [ ] El botón "Cotizar" aparece en el header (desktop)
- [ ] El botón link a `/cotizador`
- [ ] Se oculta en mobile

---

### Paso 2.3: Actualizar breadcrumbs en páginas de arriendo (20 min)

**Archivos:** `src/pages/arriendo/**/*.astro`

**Qué hacer:** Cambiar el label "Empresa" por "Inicio" en todos los breadcrumbs.

```typescript
// ANTES
const breadcrumbs = [
  { label: 'Empresa', url: '/' },
  { label: 'Arriendo de Equipos', url: '/arriendo' },
];

// DESPUÉS
const breadcrumbs = [
  { label: 'Inicio', url: '/' },
  { label: 'Arriendo de Equipos', url: '/arriendo' },
];
```

**Nota:** Esto afecta ~22 archivos de subcategorías. Usar búsqueda y reemplazo global.

**Comando útil:**
```bash
# Buscar archivos que contienen "Empresa" en breadcrumbs
grep -r "label: 'Empresa'" src/pages/arriendo/ --include="*.astro" -l
```

**Verificación:**
- [ ] En `/arriendo/izaje`, el breadcrumb dice "Inicio > Arriendo > Izaje"
- [ ] En `/arriendo/izaje/gruas-100-toneladas`, el breadcrumb dice "Inicio > Arriendo > Izaje > Grúas 100 toneladas"

---

### Commit de Fase 2
```bash
git add src/components/layout/Header.astro src/layouts/BaseLayout.astro src/pages/arriendo/
git commit -m "feat(header): add CTA button and update breadcrumbs

- Add CTA slot to Header component
- Render 'Cotizar' button in BaseLayout (desktop only)
- Update breadcrumb label 'Empresa' → 'Inicio' in all rental pages"
```

---

## Fase 3: Nuevos Componentes (14.5 horas)

**Objetivo:** Construir los 5 componentes nuevos necesarios para el homepage.

### Paso 3.1-3.3: EquipmentSearch (5 horas)

**Archivo:** `src/components/rental/EquipmentSearch.astro`

**Referencia:** Ver [new-components.md](./new-components.md) sección 1 para especificación completa.

**Sub-pasos:**

#### 3.1 Markup + Styling (2 horas)
- Crear estructura HTML del search bar
- Estilos para input, icono, dropdown de resultados
- Responsive (full-width en mobile, max 500px en desktop)

#### 3.2 Client-side Search Logic (2 horas)
- Importar `RENTAL_CATEGORIES` de `rental.ts`
- Construir índice de búsqueda flat (equipos + categorías + subcategorías)
- Implementar fuzzy search (normalizar diacríticos, partial match)
- Debounce de 200ms
- Renderizar resultados agrupados por categoría

#### 3.3 Keyboard Navigation + A11y (1 hora)
- `role="combobox"` en input
- `role="listbox"` en resultados
- `aria-expanded`, `aria-activedescendant`
- Arrow keys para navegar, Enter para seleccionar, Escape para cerrar
- Screen reader announcements

**Verificación:**
- [ ] Escribir "grúa" muestra resultados
- [ ] Escribir "100 toneladas" muestra resultados
- [ ] Escribir "tolva" muestra camiones tolva
- [ ] Keyboard navigation funciona
- [ ] Empty state muestra "Ver catálogo completo"

---

### Paso 3.4-3.5: CategoryShowcase (3 horas)

**Archivo:** `src/components/rental/CategoryShowcase.astro`

**Referencia:** Ver [new-components.md](./new-components.md) sección 2.

**Sub-pasos:**

#### 3.4 Markup + Responsive Grid (2 horas)
- 2-column grid en desktop, 1-column en mobile
- Cada card: imagen (16:9) + título + descripción + pills + link
- Hover elevation + border verde

#### 3.5 Subcategory Pills + Links (1 hora)
- Renderizar pills de subcategorías
- Cada pill link a `/arriendo/{category}/{subcategory}`
- Hover state con brand color

**Verificación:**
- [ ] 4 categorías se renderizan
- [ ] Imágenes se cargan correctamente
- [ ] Pills de subcategorías funcionan
- [ ] Responsive en mobile/tablet/desktop

---

### Paso 3.6-3.7: FeaturedEquipment (3 horas)

**Archivo:** `src/components/rental/FeaturedEquipment.astro`

**Referencia:** Ver [new-components.md](./new-components.md) sección 3.

**Sub-pasos:**

#### 3.6 Carousel + Scroll Snap (2 horas)
- Horizontal scroll con `scroll-snap-type: x mandatory`
- 3 cards visibles en desktop, 1.5 en mobile
- Smooth snap a cada card

#### 3.7 Badge + EquipmentCard Integration (1 hora)
- Importar `featuredEquipment` de `site.ts`
- Buscar equipos en `RENTAL_CATEGORIES` por slug
- Renderizar `EquipmentCard` con badge "Destacado"
- Badge absolute-positioned en top-right

**Verificación:**
- [ ] 3-6 equipos se renderizan
- [ ] Badges se muestran
- [ ] Carousel scroll funciona
- [ ] "Cotizar" button en cada card funciona

---

### Paso 3.8: CoverageSection (1 hora)

**Archivo:** `src/components/ui/CoverageSection.astro`

**Referencia:** Ver [new-components.md](./new-components.md) sección 4.

**Qué hacer:**
- Importar `coverageZones` de `site.ts`
- Renderizar lista de zonas con keywords SEO
- Estilos simples (region en bold, cities en muted)

**Verificación:**
- [ ] 3 zonas se renderizan
- [ ] Keywords SEO visibles (Atacama, Coquimbo, Antofagasta)

---

### Paso 3.9: ServicesCompact (1.5 horas)

**Archivo:** `src/components/ui/ServicesCompact.astro`

**Referencia:** Ver [new-components.md](./new-components.md) sección 5.

**Qué hacer:**
- 4 cards compactas (icon + name + shortDesc + arrow)
- 4 columns en desktop, 2x2 en tablet, 1-column en mobile
- Links a `/servicios/*`

**Verificación:**
- [ ] 4 servicios se renderizan
- [ ] Icons se muestran (puede que falten, ver 3.10)
- [ ] Links funcionan
- [ ] Responsive

---

### Paso 3.10: Agregar Icons Faltantes (30 min)

**Archivo:** `src/lib/icons.ts`

**Qué hacer:** Agregar icons si faltan: `search`, `blueprint`, `building`, `anchor`.

```typescript
export const icons = {
  // ... existing icons
  search: `<svg>...</svg>`,
  blueprint: `<svg>...</svg>`,
  building: `<svg>...</svg>`,
  anchor: `<svg>...</svg>`,
};
```

**Nota:** Si no quieres agregar icons nuevos, usa icons existentes o texto.

**Verificación:**
- [ ] Icons se renderizan en ServicesCompact

---

### Commit de Fase 3
```bash
git add src/components/rental/ src/components/ui/ src/lib/icons.ts
git commit -m "feat(components): add 5 new components for rental homepage

- EquipmentSearch: client-side fuzzy search with a11y
- CategoryShowcase: visual grid with images + pills
- FeaturedEquipment: horizontal carousel with badges
- CoverageSection: geographic zones for SEO
- ServicesCompact: compact service links
- Add missing icons (search, blueprint, building, anchor)"
```

---

## Fase 4: Homepage Assembly (8 horas)

**Objetivo:** Reescribir `index.astro` con las nuevas secciones.

### Paso 4.1: Eliminar secciones antiguas (1 hora)

**Archivo:** `src/pages/index.astro`

**Qué eliminar:**
- Hero con video corporativo (líneas ~163-184)
- SplitSection "Quiénes somos" (líneas ~197-208)
- ServicesGrid bento (líneas ~222-228)
- SplitSection HSEC/Safety (líneas ~231-247)
- NewsGrid (líneas ~266-273)

**Qué mantener:**
- StatsCounter (actualizar props)
- LogoCarousel
- CTABand (actualizar props)

---

### Paso 4.2-4.8: Agregar nuevas secciones (4 horas)

**Orden de secciones (top to bottom):**

```astro
<BaseLayout title={title} description={description}>
  <!-- §1: Hero + Search -->
  <section class="hero">
    <HeroMedia image={rentalHeroImg} />
    <div class="hero__content">
      <Eyebrow>Arriendo de maquinaria pesada</Eyebrow>
      <h1>Arriendo de equipos y maquinaria para construcción y minería</h1>
      <p>Grúas de hasta 400 toneladas... Disponibilidad 24/7 en Atacama, Coquimbo y Antofagasta.</p>
      <EquipmentSearch />
    </div>
  </section>

  <!-- §2: Category Showcase -->
  <CategoryShowcase />

  <!-- §3: Featured Equipment -->
  <FeaturedEquipment items={featuredEquipment} />

  <!-- §4: Stats Counter -->
  <StatsCounter stats={rentalStats} />

  <!-- §5: Coverage Section -->
  <CoverageSection zones={coverageZones} />

  <!-- §6: Client Logos -->
  <LogoCarousel logos={clientLogos} />

  <!-- §7: Services Compact -->
  <ServicesCompact />

  <!-- §8: CTA Band -->
  <CTABand
    eyebrow="Cotiza tu equipo ahora"
    title="¿Necesitas arrendar maquinaria? Cotiza en minutos"
    buttons={[
      { label: 'Ir al cotizador', href: '/cotizador', variant: 'primary' },
      { label: 'WhatsApp', href: 'https://wa.me/...', variant: 'outline' },
    ]}
  />
</BaseLayout>
```

**Verificación:**
- [ ] Todas las secciones se renderizan en orden
- [ ] No hay errores de import
- [ ] `npm run dev` funciona

---

### Paso 4.9: Actualizar Meta Tags + JSON-LD (30 min)

**Archivo:** `src/pages/index.astro`

**Qué hacer:**
```typescript
const title = 'Arriendo de Maquinaria Pesada en el Norte de Chile | IP Proyectos Industriales';
const description = 'Arriendo de grúas, movimiento de tierra, transporte y equipos especiales para minería e industria. Disponibilidad 24/7 en Atacama, Coquimbo y Antofagasta. Cotiza online.';

const jsonLd = combineSchemas(
  organizationSchema(),
  websiteSchema(),
  localBusinessSchema({
    name: siteBrand.name,
    address: siteContact.address,
    areaServed: ['Atacama', 'Coquimbo', 'Antofagasta'],
  }),
);
```

**Verificación:**
- [ ] Title tag incluye "norte de Chile"
- [ ] Description incluye zonas geográficas
- [ ] JSON-LD se renderiza en `<head>`

---

### Paso 4.10: Actualizar Assets (1 hora)

**Qué hacer:**
- Verificar que `src/assets/imgs/hero/arriendo/arriendo.avif` existe
- Si no, usar otra imagen de rental existente
- El usuario actualizará imágenes después

---

### Paso 4.11: Responsive QA (2 horas)

**Qué verificar:**
- [ ] Mobile (<768px): todas las secciones se apilan correctamente
- [ ] Tablet (768-1024px): grids de 2 columnas funcionan
- [ ] Desktop (>1024px): layout completo se ve bien
- [ ] Search bar funciona en todos los breakpoints
- [ ] Carousel de featured funciona en mobile

---

### Commit de Fase 4
```bash
git add src/pages/index.astro
git commit -m "feat(homepage): rewrite with rental-first structure

- Remove corporate sections (SplitSection, ServicesGrid, NewsGrid)
- Add Hero with EquipmentSearch
- Add CategoryShowcase, FeaturedEquipment, CoverageSection
- Add ServicesCompact
- Update StatsCounter and CTABand props
- Update meta tags with geographic keywords
- Add LocalBusiness JSON-LD with areaServed"
```

---

## Fase 5: Category Hub Improvement (5 horas)

**Objetivo:** Mejorar la presentación visual de `/arriendo/index.astro`.

### Paso 5.1-5.3: Rediseñar Category Hub

**Archivo:** `src/pages/arriendo/index.astro`

**Estado actual:** Lista de texto con números (01 — Izaje, 02 — Movimiento de tierra, etc.)

**Estado objetivo:** Cards visuales con imágenes + pills de subcategorías (similar a CategoryShowcase del homepage).

**Qué hacer:**
- Reemplazar la lista de texto con cards visuales
- Cada card: imagen de categoría + título + descripción + pills
- Reutilizar estilos de CategoryShowcase si es posible
- Mantener la misma estructura de datos

**Verificación:**
- [ ] 4 categorías se renderizan con imágenes
- [ ] Pills de subcategorías funcionan
- [ ] Responsive en mobile/tablet/desktop
- [ ] SEO schemas se mantienen (CollectionPage)

---

### Commit de Fase 5
```bash
git add src/pages/arriendo/index.astro
git commit -m "feat(arriendo): improve category hub visual presentation

- Replace text-only list with visual cards
- Add category images
- Improve responsive layout
- Maintain SEO schemas"
```

---

## Fase 6: QA & SEO Validation (3.5 horas)

**Objetivo:** Validar que todo funciona correctamente antes de deploy.

### Paso 6.1: Build Test (15 min)
```bash
npm run build
```
**Verificación:**
- [ ] Build completa sin errores
- [ ] No hay warnings críticos

---

### Paso 6.2: Validar Links Internos (30 min)
**Qué verificar:**
- [ ] Todos los links del navigation funcionan
- [ ] Todos los links del footer funcionan
- [ ] Pills de subcategorías en homepage funcionan
- [ ] Botón "Cotizar" en header funciona
- [ ] Links de ServicesCompact funcionan

---

### Paso 6.3: Validar Meta Tags (30 min)
**Herramienta:** Browser DevTools → Elements → `<head>`

**Qué verificar:**
- [ ] `<title>` incluye "norte de Chile"
- [ ] `<meta name="description">` incluye zonas geográficas
- [ ] Open Graph tags se renderizan
- [ ] Canonical URL es correcta

---

### Paso 6.4: Validar JSON-LD (20 min)
**Herramienta:** [Google Rich Results Test](https://search.google.com/test/rich-results)

**Qué verificar:**
- [ ] Organization schema válido
- [ ] WebSite schema válido
- [ ] LocalBusiness schema válido con `areaServed`

---

### Paso 6.5: Lighthouse Audit (30 min)
**Herramienta:** Chrome DevTools → Lighthouse

**Targets:**
- [ ] Performance: 90+
- [ ] Accessibility: 95+
- [ ] Best Practices: 90+
- [ ] SEO: 95+

---

### Paso 6.6: Test EquipmentSearch (30 min)
**Queries de prueba:**
- [ ] "grúa" → muestra grúas
- [ ] "100 toneladas" → muestra grúa 100t
- [ ] "tolva" → muestra camiones tolva
- [ ] "izaje" → muestra categoría Izaje
- [ ] "xyz123" → muestra empty state
- [ ] Diacríticos: "grua" vs "grúa" → ambos funcionan

---

### Paso 6.7: Test Quote Cart Flow (30 min)
**Flujo completo:**
1. Homepage → buscar equipo → agregar al cotizador
2. Homepage → navegar categoría → agregar equipo al cotizador
3. Homepage → featured equipment → agregar al cotizador
4. Header → botón "Cotizar" → ir al cotizador
5. Cotizador → ver equipos seleccionados → enviar cotización

**Verificación:**
- [ ] Equipos se agregan al cart correctamente
- [ ] Cart badge muestra el conteo
- [ ] Cotizador muestra los equipos seleccionados
- [ ] WhatsApp/email se envía correctamente

---

### Paso 6.8: Cross-Browser Check (30 min)
**Browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Qué verificar:**
- [ ] Layout se ve consistente
- [ ] Search bar funciona
- [ ] Carousel scroll funciona
- [ ] No hay errores en console

---

### Commit Final de Fase 6
```bash
git add -A
git commit -m "chore: final QA and SEO validation

- All tests passed
- Lighthouse scores: Performance 90+, SEO 95+
- Cross-browser compatibility verified
- Quote cart flow tested end-to-end"
```

---

## Deploy

### Paso Final: Deploy a Hostinger
```bash
npm run build
node deploy-hostinger.mjs
```

**Verificación post-deploy:**
- [ ] Sitio live funciona
- [ ] Todos los links funcionan
- [ ] Search bar funciona
- [ ] Cotizador funciona

---

## Rollback Plan

Si algo sale mal:
```bash
# Volver al estado anterior
git checkout pre-rental-remake
npm run build
node deploy-hostinger.mjs
```

---

## Resumen de Commits

1. `feat(data): update site config for rental-first homepage`
2. `feat(header): add CTA button and update breadcrumbs`
3. `feat(components): add 5 new components for rental homepage`
4. `feat(homepage): rewrite with rental-first structure`
5. `feat(arriendo): improve category hub visual presentation`
6. `chore: final QA and SEO validation`

---

## Checklist Final

- [ ] Todas las fases completadas
- [ ] Todos los commits hechos
- [ ] Build pasa sin errores
- [ ] Lighthouse scores alcanzados
- [ ] Cross-browser tested
- [ ] Quote cart flow tested
- [ ] Deploy exitoso
- [ ] Sitio live verificado

---

**Tiempo total estimado:** 33.5 horas (5-6 días de trabajo enfocado)

**Próximo paso:** Comenzar Fase 1 cuando estés listo.
