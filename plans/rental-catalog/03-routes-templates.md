# Spec 03 — Templates de Rutas Dinámicas

**Fases:** 3, 4, 5
**Estado:** ✅ Completo
**Archivos a crear:**
- `src/pages/arriendo/index.astro` (Fase 3 — hub catálogo)
- `src/pages/arriendo/[categoria]/index.astro` (Fase 4 — 4 hubs de categoría)
- `src/pages/arriendo/[categoria]/[subcategoria].astro` (Fase 5 — 22 sub-rutas catálogo)

**Archivos a eliminar (al final):**
- `src/pages/arriendos/*`
- `src/pages/arriendo-maquinaria/*`

**Depende de:**
- [01-data-model.md](./01-data-model.md)
- [02-catalog-components.md](./02-catalog-components.md)
- [04-layout-slots.md](./04-layout-slots.md) — para los slots del `RentalLayout`

**Bloquea a:**
- [06-seo-schema.md](./06-seo-schema.md) — schemas por nivel
- [07-redirects-migration.md](./07-redirects-migration.md) — depende de URLs finales
- [08-site-integration.md](./08-site-integration.md) — linkea a estas URLs

---

## Objetivo

Crear los 3 templates `.astro` que generan las 27 URLs del catálogo mediante `getStaticPaths()`. Cada template lee de `src/data/rental.ts` y renderiza con `RentalLayout`.

## Estructura de archivos

```
src/pages/arriendo/
├── index.astro                          ← Fase 3: hub catálogo
└── [categoria]/
    ├── index.astro                      ← Fase 4: 4 hubs de categoría
    └── [subcategoria].astro             ← Fase 5: 22 sub-rutas
```

---

## Fase 3 — Hub del catálogo (`/arriendo/`)

### Archivo: `src/pages/arriendo/index.astro`

**Responsabilidad:** Página de entrada al catálogo. Muestra las 4 categorías como cards grandes.

**Props de data:**

```ts
import { RENTAL_CATEGORIES } from '@/data/rental';
```

**Markup completo:**

```astro
---
// src/pages/arriendo/index.astro
// Hub principal del catálogo de arriendo

import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/ui/Container.astro';
import Breadcrumbs from '@/components/seo/Breadcrumbs.astro';
import Icon from '@/components/ui/Icon.astro';
import StatsCounter from '@/components/ui/StatsCounter.astro';
import CTABand from '@/components/ui/CTABand.astro';
import heroImg from '@/assets/imgs/hero.jpg';
import { RENTAL_CATEGORIES } from '@/data/rental';
import { collectionPageSchema, breadcrumbSchema, combineSchemas } from '@/lib/seo';

const title = 'Arriendo de Maquinaria y Equipos para Minería | IP Proyectos Industriales';
const description = 'Arriendo de grúas, izaje, movimiento de tierra, transporte y equipos especiales para minería e industria en Chile. Cotiza online.';

const breadcrumbs = [
  { label: 'Empresa', url: '/' },
  { label: 'Arriendo de Equipos', url: '/arriendo' },
];

const jsonLd = combineSchemas(
  collectionPageSchema('Arriendo de Equipos', '/arriendo'),
  breadcrumbSchema(breadcrumbs)
);

const stats = [
  { value: 400, label: 'Toneladas capacidad', suffix: 'Tons', suffixPosition: 'after' as const },
  { value: 100, prefix: '+', label: 'Equipos propios', prefixPosition: 'before' as const },
  { value: 24, label: 'Disponibilidad', suffix: '/7', suffixPosition: 'after' as const },
  { value: 15, prefix: '+', label: 'Años de experiencia', prefixPosition: 'before' as const },
];
---

<BaseLayout title={title} description={description} breadcrumbs={breadcrumbs} jsonLd={jsonLd}>
  <section class="rental-hero">
    <div class="rental-hero__container">
      <Breadcrumbs items={breadcrumbs} variant="hero" />
      <p class="rental-hero__eyebrow">Rental de equipos</p>
      <h1 class="rental-hero__title">Arriendo de maquinaria pesada para minería e industria</h1>
      <p class="rental-hero__subtitle">Grúas, izaje, movimiento de tierra, transporte y equipos especiales con operadores certificados. Disponibilidad 24/7 en zona norte de Chile.</p>
      <div class="rental-hero__ctas">
        <a href="#cotizar" class="rental-hero__btn rental-hero__btn--primary">
          Cotizar
          <Icon name="arrow-right" size={16} />
        </a>
        <a href="/catalogo.pdf" class="rental-hero__btn rental-hero__btn--outline" download>
          <Icon name="download" size={16} />
          Descargar catálogo
        </a>
      </div>
    </div>
  </section>

  <StatsCounter stats={stats} variant="dark" layout="horizontal" columns={4} animated={true} />

  <section class="categories-grid">
    <Container>
      <div class="categories-grid__items">
        {RENTAL_CATEGORIES.map((category, index) => (
          <article class="category-card">
            <div class="category-card__number">0{index + 1} — {category.name}</div>
            <div class="category-card__content">
              <h2 class="category-card__title">{category.name}</h2>
              <p class="category-card__desc">{category.shortDesc}</p>
              <ul class="category-card__sublist">
                {category.subcategories.map((sub) => (
                  <li>
                    <a href={`/arriendo/${category.slug}/${sub.slug}`}>{sub.name}</a>
                  </li>
                ))}
              </ul>
              <a href={`/arriendo/${category.slug}`} class="category-card__link">
                Conocer categoría
                <Icon name="arrow-right" size={18} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </Container>
  </section>

  <div id="cotizar">
    <CTABand
      eyebrow="¿Necesitas equipos para tu faena?"
      title="Arrienda con nosotros"
      subtitle="Contamos con operadores certificados y disponibilidad 24/7."
      showForm={true}
      backgroundImage={heroImg.src}
      contentAlign="center"
      minHeight="sm"
    />
  </div>
</BaseLayout>

<style>
  /* (estilos equivalentes a los actuales en src/pages/arriendos/index.astro) */
</style>
```

**Decisiones:**
- Mantiene el diseño actual del hub `/arriendos/` (hero + stats + grilla de categorías)
- Lista las sub-rutas dentro de cada card de categoría (cross-linking interno fuerte)
- Schema: `CollectionPage` + `BreadcrumbList`

---

## Fase 4 — Hubs de categoría (`/arriendo/izaje/`, etc.)

### Archivo: `src/pages/arriendo/[categoria]/index.astro`

**Responsabilidad:** Hub de cada categoría. Muestra las sub-rutas como cards.

**`getStaticPaths()`:**

```ts
export function getStaticPaths() {
  return RENTAL_CATEGORIES.map((category) => ({
    params: { categoria: category.slug },
    props: { category },
  }));
}
```

**Markup completo:**

```astro
---
// src/pages/arriendo/[categoria]/index.astro
// Hub de cada categoría (izaje, movimiento-de-tierra, transporte, equipos-especiales)

import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/ui/Container.astro';
import Breadcrumbs from '@/components/seo/Breadcrumbs.astro';
import Icon from '@/components/ui/Icon.astro';
import CTABand from '@/components/ui/CTABand.astro';
import { RENTAL_CATEGORIES, findCategory } from '@/data/rental';
import { serviceSchema, breadcrumbSchema, combineSchemas } from '@/lib/seo';

export function getStaticPaths() {
  return RENTAL_CATEGORIES.map((category) => ({
    params: { categoria: category.slug },
    props: { category },
  }));
}

const { category } = Astro.props;
const { categoria } = Astro.params;

const breadcrumbs = [
  { label: 'Empresa', url: '/' },
  { label: 'Arriendo de Equipos', url: '/arriendo' },
  { label: category.name, url: `/arriendo/${category.slug}` },
];

const jsonLd = combineSchemas(
  serviceSchema(category.name, category.description, Astro.url.pathname),
  breadcrumbSchema(breadcrumbs)
);
---

<BaseLayout
  title={category.seoTitle}
  description={category.seoDescription}
  breadcrumbs={breadcrumbs}
  jsonLd={jsonLd}
>
  <section class="cat-hero">
    <div class="cat-hero__container">
      <Breadcrumbs items={breadcrumbs} variant="hero" />
      <p class="cat-hero__eyebrow">Arriendo · {category.name}</p>
      <h1 class="cat-hero__title">{category.name}</h1>
      <p class="cat-hero__subtitle">{category.description}</p>
    </div>
  </section>

  <section class="cat-list">
    <Container>
      <div class="cat-list__items">
        {category.subcategories.map((sub, index) => (
          <article class="cat-list__item">
            <div class="cat-list__number">0{index + 1}</div>
            <div class="cat-list__content">
              <h2 class="cat-list__title">{sub.name}</h2>
              <p class="cat-list__desc">{sub.shortDesc}</p>
              <div class="cat-list__meta">
                {sub.specs?.slice(0, 2).map((s) => (
                  <span class="cat-list__spec"><strong>{s.label}:</strong> {s.value}</span>
                ))}
                <span class="cat-list__count">{sub.catalog.length} modelos disponibles</span>
              </div>
              <a href={`/arriendo/${category.slug}/${sub.slug}`} class="cat-list__link">
                Ver {sub.name.toLowerCase()}
                <Icon name="arrow-right" size={18} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </Container>
  </section>

  <CTABand
    eyebrow="¿Necesitas {category.name.toLowerCase()} para tu faena?"
    title="Cotiza tu {category.name.toLowerCase()}"
    subtitle="Respuesta operativa en menos de 48 horas."
    showForm={true}
    contentAlign="center"
    minHeight="sm"
  />
</BaseLayout>

<style>
  .cat-hero {
    background-color: var(--color-graphite, #0d1611);
    min-height: 280px;
    display: flex;
    align-items: flex-end;
    padding: 60px 0 56px;
  }
  /* ... resto de estilos equivalentes al hub */
</style>
```

**Decisiones:**
- Schema: `Service` + `BreadcrumbList`
- Lista cada sub-ruta con: número, nombre, descripción, 1-2 specs destacadas, conteo de modelos
- Cross-linking fuerte (el hub de categoría es punto de paso natural para distribuir autoridad)

---

## Fase 5 — Sub-rutas catálogo (`/arriendo/izaje/gruas-100-toneladas/`, etc.)

### Archivo: `src/pages/arriendo/[categoria]/[subcategoria].astro`

**Responsabilidad:** Página principal de cada sub-ruta. Renderiza el catálogo completo.

**`getStaticPaths()`:**

```ts
export function getStaticPaths() {
  return RENTAL_CATEGORIES.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      params: {
        categoria: category.slug,
        subcategoria: subcategory.slug,
      },
      props: { category, subcategory },
    }))
  );
}
```

**Markup completo:**

```astro
---
// src/pages/arriendo/[categoria]/[subcategoria].astro
// Página de sub-ruta con catálogo de equipos

import RentalLayout from '@/layouts/RentalLayout.astro';
import EquipmentCatalog from '@/components/rental/EquipmentCatalog.astro';
import Icon from '@/components/ui/Icon.astro';
import { RENTAL_CATEGORIES } from '@/data/rental';
import { productSchema, breadcrumbSchema, combineSchemas } from '@/lib/seo';

export function getStaticPaths() {
  return RENTAL_CATEGORIES.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      params: {
        categoria: category.slug,
        subcategoria: subcategory.slug,
      },
      props: { category, subcategory },
    }))
  );
}

const { category, subcategory } = Astro.props;

const breadcrumbs = [
  { label: 'Empresa', url: '/' },
  { label: 'Arriendo de Equipos', url: '/arriendo' },
  { label: category.name, url: `/arriendo/${category.slug}` },
  { label: subcategory.name, url: Astro.url.pathname },
];

const jsonLd = combineSchemas(
  productSchema({
    name: subcategory.name,
    description: subcategory.seoDescription,
    url: Astro.url.pathname,
    image: subcategory.heroImage,
    offers: {
      availability: 'InStock',
      priceCurrency: 'CLP',
      priceRange: 'Consultar',
    },
  }),
  breadcrumbSchema(breadcrumbs)
);
---

<RentalLayout
  title={subcategory.seoTitle}
  description={subcategory.seoDescription}
  heroImage={subcategory.heroImage}
  heroImageAlt={subcategory.name}
  category={`Arriendo · ${category.name}`}
  features={subcategory.features}
  description_heading={subcategory.shortDesc}
  breadcrumbs={breadcrumbs}
  whatsappMessage={subcategory.whatsappMessage}
  jsonLd={jsonLd}
>
  <EquipmentCatalog
    slot="catalog"
    items={subcategory.catalog}
    columns={subcategory.catalog.length >= 4 ? 3 : 2}
    background="light"
    title={`Modelos disponibles de ${subcategory.name.toLowerCase()}`}
    subtitle={`${subcategory.catalog.length} equipos en arriendo con operador certificado.`}
  />
  <!-- Slots adicionales se llenan en Spec 05 (SpecsGrid, RelatedEquipment, FAQSection) -->
</RentalLayout>
```

**Decisiones:**
- Usa `RentalLayout` (ya existe) extendido con slots
- Schema: `Product` + `Offer` + `BreadcrumbList`
- El catálogo va en el slot `catalog` (ver Spec 04)
- `columns` se adapta según cantidad de items: ≥4 → 3 cols, 1-3 → 2 cols

---

## Convenciones de `getStaticPaths()`

- **Tipo de retorno:** siempre `Array<{ params, props }>`
- **`params`:** objetos planos, todos los valores como `string`
- **`props`:** cualquier valor serializable (objetos, arrays, primitivos) — NO funciones
- **Validación:** no hace falta — el helper `findCategory` ya filtra slugs inválidos

## Breadcrumbs (estructura)

Todas las sub-rutas siguen este patrón:

```ts
const breadcrumbs = [
  { label: 'Empresa', url: '/' },
  { label: 'Arriendo de Equipos', url: '/arriendo' },
  { label: category.name, url: `/arriendo/${category.slug}` },     // omitir en hub de categoría
  { label: subcategory.name, url: Astro.url.pathname },             // omitir en hub/sub-ruta
];
```

## Tareas

### Fase 3
- [ ] Crear `src/pages/arriendo/index.astro` con el markup completo
- [ ] Importar `RENTAL_CATEGORIES` desde `@/data/rental`
- [ ] Reusar estilos del actual `src/pages/arriendos/index.astro`
- [ ] Verificar que las 4 categorías aparecen como cards

### Fase 4
- [ ] Crear `src/pages/arriendo/[categoria]/index.astro`
- [ ] Implementar `getStaticPaths()` que itera `RENTAL_CATEGORIES`
- [ ] Verificar que las 4 URLs se generan (`/arriendo/izaje/`, etc.)
- [ ] Cada categoría muestra sus sub-rutas con specs destacadas

### Fase 5
- [ ] Crear `src/pages/arriendo/[categoria]/[subcategoria].astro`
- [ ] Implementar `getStaticPaths()` con `flatMap`
- [ ] Verificar que las 22 URLs se generan
- [ ] El slot `catalog` recibe `EquipmentCatalog` con los items de `subcategory.catalog`
- [ ] Schema `Product` se inyecta correctamente

### Fase final (post Spec 07)
- [x] Eliminar `src/pages/arriendos/*` (5 archivos)
- [ ] Eliminar `src/pages/arriendo-maquinaria/*` (3 archivos)
- [ ] Verificar que no hay links rotos con `npm run build`

## Definition of Done

- [ ] Las 3 archivos existen y compilan sin errores
- [ ] `npm run build` genera 27 páginas `.html` en `dist/arriendo/`
- [ ] Cada hub de categoría (4 URLs) lista sus sub-rutas con link funcional
- [ ] Cada sub-ruta (22 URLs) renderiza el `EquipmentCatalog` con el catálogo correcto
- [ ] Los breadcrumbs son correctos en cada nivel
- [ ] Los schemas JSON-LD están presentes en cada página
- [x] Las URLs viejas `/arriendos/*` y `/arriendo-maquinaria/*` ya están eliminadas (post-Spec 07)

## Validación post-implementación

```powershell
npm run build
# Verificar que dist/arriendo/ tiene 27 archivos HTML
Get-ChildItem -LiteralPath "dist\arriendo" -Recurse -Filter "*.html" | Measure-Object
# Debe devolver 27 (o más, considerando redirects)
```

## Referencias

- README: [./README.md](./README.md)
- Spec 01: [./01-data-model.md](./01-data-model.md) — fuente de `RENTAL_CATEGORIES`
- Spec 02: [./02-catalog-components.md](./02-catalog-components.md) — `EquipmentCatalog`
- Spec 04: [./04-layout-slots.md](./04-layout-slots.md) — slots del `RentalLayout`
- Spec 06: [./06-seo-schema.md](./06-seo-schema.md) — `productSchema()`, `combineSchemas()`
- Spec 07: [./07-redirects-migration.md](./07-redirects-migration.md) — eliminación de rutas viejas
