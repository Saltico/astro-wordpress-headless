# Spec 06 — Schemas SEO

**Fase:** 8
**Estado:** ✅ Completo
**Archivos a modificar:**
- `src/lib/seo.ts` (extender `productSchema()`, añadir `itemListSchema()`)
- `src/pages/arriendo/index.astro` (usar `collectionPageSchema`)
- `src/pages/arriendo/[categoria]/index.astro` (usar `serviceSchema`)
- `src/pages/arriendo/[categoria]/[subcategoria].astro` (usar `productSchema` extendido)

**Depende de:** [01-data-model.md](./01-data-model.md), [03-routes-templates.md](./03-routes-templates.md)
**Bloquea a:** [09-sitemap.md](./09-sitemap.md), [10-acceptance-criteria.md](./10-acceptance-criteria.md)

---

## Objetivo

Implementar los schemas JSON-LD correctos para cada nivel del catálogo y extender los helpers de `src/lib/seo.ts` para soportar las nuevas entidades (`Product` con `Offer` y `priceRange`, `ItemList`).

## Estado actual de `src/lib/seo.ts`

Ya tiene:
- `organizationSchema()`
- `websiteSchema()`
- `serviceSchema(name, description, url, provider)`
- `productSchema(name, description, url, image)` — versión simple
- `projectSchema()`
- `articleSchema()`
- `newsArticleSchema()`
- `aboutPageSchema()`
- `contactPageSchema()`
- `breadcrumbSchema(items)`
- `faqPageSchema(questions)`
- `collectionPageSchema(name, url)`
- `combineSchemas(...schemas)`

Lo que falta:
- `productSchema()` extendido (con `offers: { priceRange, priceCurrency, availability }`)
- `itemListSchema(items)`

## Cambios a `src/lib/seo.ts`

### 6.1 Extender `productSchema()`

Reemplazar la firma actual por:

```ts
export interface ProductSchemaOptions {
  name: string;
  description: string;
  url: string;
  image?: string;
  sku?: string;
  mpn?: string;
  brand?: string;
  offers?: {
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'BackOrder';
    priceCurrency?: string;        // 'CLP'
    price?: number;
    priceRange?: string;           // 'Consultar'
    validFrom?: string;            // ISO date
  };
}

export function productSchema(options: ProductSchemaOptions): Record<string, unknown> {
  const { name, description, url, image, sku, mpn, brand, offers } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    ...(image && { image }),
    ...(sku && { sku }),
    ...(mpn && { mpn }),
    ...(brand && { brand: { '@type': 'Brand', name: brand } }),
    offers: {
      '@type': 'Offer',
      url,
      availability: `https://schema.org/${offers?.availability ?? 'InStock'}`,
      priceCurrency: offers?.priceCurrency ?? 'CLP',
      ...(offers?.price !== undefined && { price: offers.price }),
      ...(offers?.priceRange && { priceRange: offers.priceRange }),
      ...(offers?.validFrom && { validFrom: offers.validFrom }),
      seller: organizationSchema(),
    },
  };
}
```

**Compatibilidad retroactiva:** la firma anterior `(name, description, url, image)` se elimina. Hay que actualizar todos los call-sites existentes.

Call-sites a actualizar (búsqueda previa):

```bash
grep -r "productSchema(" src/ --include="*.astro" --include="*.ts"
```

Actualizar cada call-site al nuevo formato:

```ts
// Antes:
productSchema('Grúas Grove GMK', description, url, image)

// Después:
productSchema({
  name: 'Grúas Grove GMK',
  description,
  url,
  image,
  offers: { availability: 'InStock', priceCurrency: 'CLP', priceRange: 'Consultar' },
})
```

### 6.2 Añadir `itemListSchema()`

```ts
export interface ItemListItem {
  name: string;
  url: string;
  image?: string;
  description?: string;
  position?: number;
}

export function itemListSchema(opts: {
  name: string;
  items: ItemListItem[];
  url?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: opts.name,
    ...(opts.url && { url: opts.url }),
    itemListElement: opts.items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position ?? index + 1,
      name: item.name,
      url: item.url,
      ...(item.image && { image: item.image }),
      ...(item.description && { description: item.description }),
    })),
  };
}
```

### 6.3 (Opcional) Reforzar `serviceSchema()`

Mantener firma actual pero añadir `areaServed` y `serviceType` opcionales:

```ts
export function serviceSchema(
  name: string,
  description: string,
  url: string,
  provider = organizationSchema(),
  options?: {
    serviceType?: string;
    areaServed?: string[];
  }
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider,
    ...(options?.serviceType && { serviceType: options.serviceType }),
    ...(options?.areaServed && { areaServed: options.areaServed }),
  };
}
```

## Schemas por nivel de página

### Hub del catálogo (`/arriendo/`)

```ts
import { collectionPageSchema, breadcrumbSchema, combineSchemas } from '@/lib/seo';

const jsonLd = combineSchemas(
  collectionPageSchema('Arriendo de Equipos', Astro.url.pathname),
  breadcrumbSchema([
    { label: 'Empresa', url: '/' },
    { label: 'Arriendo de Equipos', url: '/arriendo' },
  ])
);
```

**Schema aplicado:** `CollectionPage` + `BreadcrumbList`.

### Hub de categoría (`/arriendo/izaje/`)

```ts
import { serviceSchema, breadcrumbSchema, combineSchemas } from '@/lib/seo';

const jsonLd = combineSchemas(
  serviceSchema(
    category.name,
    category.description,
    Astro.url.pathname,
    undefined,
    { serviceType: 'Arriendo de equipos', areaServed: ['CL-II', 'CL-III', 'CL-IV'] }
  ),
  breadcrumbSchema(breadcrumbs)
);
```

**Schema aplicado:** `Service` (con `serviceType` y `areaServed`) + `BreadcrumbList`.

### Sub-ruta catálogo (`/arriendo/izaje/gruas-100-toneladas/`)

```ts
import { productSchema, breadcrumbSchema, combineSchemas } from '@/lib/seo';

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
```

**Schema aplicado:** `Product` + `Offer` + `BreadcrumbList`.

Adicionalmente, el `EquipmentCatalog` inyecta `ItemList` (ver Spec 02).

## Title tags y meta descriptions (plantillas por nivel)

| Nivel | Title pattern | Description pattern |
|---|---|---|
| Hub catálogo | `Arriendo de Maquinaria y Equipos para Minería \| IP Proyectos Industriales` | `Arriendo de grúas, izaje, movimiento de tierra, transporte y equipos especiales para minería e industria en Chile. Cotiza online.` |
| Hub categoría | `Arriendo de {nombre} en Chile \| IP Proyectos Industriales` | `Arriendo de {nombre} para minería e industria. Equipos con operador certificado. Disponibilidad 24/7. Cotiza online.` |
| Sub-ruta catálogo | `Arriendo de {nombre} en Chile \| IP Proyectos Industriales` | `Arriendo de {nombre} con operador certificado en Chile. {spec destacada}. Cotiza online o por WhatsApp.` |

**Límites:**
- Title: 55-60 caracteres visibles en SERP
- Description: 150-160 caracteres

Todos los `seoTitle` y `seoDescription` se pre-computan en `src/data/rental.ts` (Spec 01) y se pasan directamente al template.

## Heading structure (plantilla por sub-ruta)

```html
<h1>Arriendo de {subcategory.name}</h1>
  <h2>Qué incluye el arriendo</h2>     <!-- RentalLayout -->
  <h2>{subcategory.name} disponibles</h2>  <!-- EquipmentCatalog -->
  <h2>Especificaciones técnicas</h2>   <!-- SpecsGrid -->
  <h2>Equipos relacionados</h2>        <!-- RelatedEquipment -->
  <h2>Preguntas frecuentes</h2>        <!-- FAQSection -->
  <h2>Cotiza este equipo</h2>          <!-- CTABand -->
```

Un solo `<h1>` por página, contiene la keyword principal.

## Canonical tags

`BaseLayout.astro` ya debe tener el slot de canonical. Verificar que:

```astro
<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site).toString()} />
```

**No incluir** canonical que apunte a la versión vieja (`/arriendos/...`).

## Open Graph y Twitter Cards

`BaseLayout.astro` debería tener defaults. Verificar que cada página pase:
- `og:title` ← `seoTitle`
- `og:description` ← `seoDescription`
- `og:image` ← `heroImage` (o default `/og-default.jpg`)
- `og:url` ← `Astro.url.pathname`
- `og:type` ← `product` para sub-rutas catálogo, `website` para hubs

## Tareas

- [ ] Editar `src/lib/seo.ts`:
  - [ ] Reemplazar `productSchema()` con la versión extendida (nueva firma con `ProductSchemaOptions`)
  - [ ] Añadir `itemListSchema()` con la firma propuesta
  - [ ] (Opcional) Reforzar `serviceSchema()` con `serviceType` y `areaServed`
- [ ] Buscar call-sites existentes de `productSchema()` y migrarlos al nuevo formato
- [ ] En `src/pages/arriendo/index.astro`: usar `collectionPageSchema` + `breadcrumbSchema`
- [ ] En `src/pages/arriendo/[categoria]/index.astro`: usar `serviceSchema` + `breadcrumbSchema`
- [ ] En `src/pages/arriendo/[categoria]/[subcategoria].astro`: usar `productSchema` extendido + `breadcrumbSchema`
- [ ] En `src/components/rental/EquipmentCatalog.astro`: usar `itemListSchema`
- [ ] Verificar que el JSON-LD valida en https://validator.schema.org/

## Definition of Done

- [ ] `productSchema()` tiene la nueva firma con `ProductSchemaOptions`
- [ ] `itemListSchema()` existe y exporta correctamente
- [ ] Todos los call-sites existentes de `productSchema()` están migrados
- [ ] Cada nivel del catálogo (hub, categoría, sub-ruta) emite el schema correcto
- [ ] El JSON-LD aparece en el HTML estático de cada página (no requiere JS)
- [ ] El validador de Schema.org no reporta errores para ninguna URL del catálogo
- [ ] El canonical tag es self-referencing en cada página
- [ ] OG/Twitter tags se generan correctamente por nivel

## Validación

```powershell
npm run build
Get-Content dist\arriendo\izaje\gruas-100-toneladas\index.html | Select-String "application/ld\+json"
# Debe devolver 2 ocurrencias: Product + ItemList (del EquipmentCatalog)
```

Validar online con https://validator.schema.org/ copiando el JSON-LD de una página.

## Referencias

- README: [./README.md](./README.md)
- Spec 01: [./01-data-model.md](./01-data-model.md) — datos SEO pre-computados
- Spec 02: [./02-catalog-components.md](./02-catalog-components.md) — usa `itemListSchema`
- Spec 03: [./03-routes-templates.md](./03-routes-templates.md) — emite schemas por nivel
- Spec 05: [./05-secondary-components.md](./05-secondary-components.md) — usa `faqPageSchema`
- Schema.org Product: https://schema.org/Product
- Schema.org ItemList: https://schema.org/ItemList
- Schema.org Offer: https://schema.org/Offer
