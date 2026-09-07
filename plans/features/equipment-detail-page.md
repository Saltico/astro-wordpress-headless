---
feature: Página de Detalle de Equipo + Modificación de EquipmentCard
effort: High
dependencies: [data-model-extension, button-system]
status: Implemented ✅
date: 2026-09-07
---

# Página de Detalle de Equipo + Modificación de EquipmentCard

## 1. Resumen Ejecutivo

Esta feature tiene dos objetivos principales:

1. **Modificar la `EquipmentCard`** en las subcategorías de arriendo para incluir un segundo botón "Ver detalle" (variante ghost/outline) junto al botón existente "Agregar al cotizador" (variante primary).
2. **Crear una nueva página de detalle de equipo** siguiendo el patrón de diseño de [SK Rental - Detalle de producto](https://www.skrental.com/tiendaonline/webapp/detalles/camion-articulado-a45-g/426), con:
   - Sección hero con imagen principal + datos primordiales + CTA "Agregar al cotizador" + descargable de ficha técnica (PDF).
   - Sección de acordeones para "Especificaciones" (tabla Atributo/Propiedades) y "Descripción" (texto + equipos relacionados).

---

## 2. Análisis del Estado Actual

### 2.1 Componentes existentes involucrados

| Componente | Ruta | Rol actual |
|---|---|---|
| `EquipmentCard.astro` | `src/components/rental/EquipmentCard.astro` | Card individual de maquinaria con un solo CTA (`QuoteAddButton`) |
| `EquipmentCatalog.astro` | `src/components/rental/EquipmentCatalog.astro` | Grilla que renderiza las `EquipmentCard` |
| `QuoteAddButton.astro` | `src/components/quote/QuoteAddButton.astro` | Botón "Agregar al cotizador" con 3 estados (idle/added/error) |
| `RelatedEquipment.astro` | `src/components/rental/RelatedEquipment.astro` | Grilla de equipos complementarios (sub-rutas hermanas) |
| `FAQSection.astro` | `src/components/rental/FAQSection.astro` | Acordeón con `<details>/<summary>` y animaciones CSS |
| `RentalLayout.astro` | `src/layouts/RentalLayout.astro` | Layout con slots para hero, catalog, stats, related, faq |

### 2.2 Modelo de datos actual (`Equipment`)

```typescript
// src/data/rental.ts
export interface Equipment {
  slug: string;
  name: string;
  capacity: string;
  height?: string;
  shortDesc: string;
  features: string[];
  image: string;
  whatsappMessage: string;
}
```

**Campos faltantes para la página de detalle:**
- `description` — Descripción larga del equipo (para acordeón "Descripción")
- `specs` — Array de especificaciones técnicas `{ attribute: string; value: string }` (para tabla en acordeón "Especificaciones")
- `techSheetUrl` — URL de la ficha técnica PDF descargable
- `brand` — Marca del equipo (ej: "Grove", "Volvo")
- `gallery` — Array de imágenes adicionales (galería)
- `relatedEquipment` — Equipos relacionados (slugs de otros equipos)

### 2.3 Estructura de rutas actual

```
src/pages/arriendo/
├── index.astro                          → /arriendo
├── [categoria]/
│   ├── index.astro                      → /arriendo/izaje
│   └── [subcategoria].astro             → /arriendo/izaje/gruas-60-toneladas
```

**Nueva ruta necesaria:**
```
src/pages/arriendo/
├── [categoria]/
│   └── [subcategoria]/
│       └── [equipo].astro               → /arriendo/izaje/gruas-60-toneladas/grua-grove-rt-765-e
```

---

## 3. Referencia de Diseño (SK Rental)

### 3.1 Estructura de la página de detalle de SK Rental

Analizada de: `https://www.skrental.com/tiendaonline/webapp/detalles/camion-articulado-a45-g/426`

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumbs: Home > Camiones > Camión Articulado            │
├──────────────────────────────────┬──────────────────────────┤
│                                  │  MARCA (VOLVO)           │
│  GALERÍA DE IMÁGENES             │  # NOMBRE EQUIPO         │
│  (carousel/thumbnails)           │  Código: 237             │
│  - Imagen principal              │                          │
│  - Thumbnails navegables         │  • Modelo A45G           │
│  - Badge "Imagen referencial"    │  • Tolva 25,1 m3         │
│                                  │  • Tracción 6x6          │
│                                  │  • Capacidad 41000 kg    │
│                                  │                          │
│                                  │  [AGREGAR AL COTIZADOR]  │
│                                  │                          │
│                                  │  📄 DOCUMENTOS PDF       │
│                                  │     └─ ficha-tecnica.pdf │
├──────────────────────────────────┴──────────────────────────┤
│ ▼ ESPECIFICACIONES                                          │
│ ┌──────────────────┬──────────────────────────────────────┐ │
│ │ Atributo         │ Propiedades                          │ │
│ ├──────────────────┼──────────────────────────────────────┤ │
│ │ Potencia         │ 470 HP                               │ │
│ │ Motor            │ VOLVO                                │ │
│ │ ...              │ ...                                  │ │
│ └──────────────────┴──────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ▼ DESCRIPCIÓN                                               │
│   Texto descriptivo del equipo (2-3 párrafos)               │
│   Disclaimer legal                                          │
├─────────────────────────────────────────────────────────────┤
│ PRODUCTOS RELACIONADOS                                      │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│ │ Card 1   │  │ Card 2   │  │ Card 3   │  │ Card 4   │    │
│ │ img+name │  │ img+name │  │ img+name │  │ img+name │    │
│ └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Diferencias con nuestro contexto

| Aspecto | SK Rental | Nuestro proyecto |
|---|---|---|
| Precios | Tarifas diarias/semanales/mensuales | No aplica (cotización personalizada) |
| Login | Requerido para cotizar | No requerido |
| Galería | Carousel con thumbnails | Imagen principal (v1), galería (v2) |
| SKU/Código | Código numérico visible | Slug como identificador |
| Servicios opcionales | Sección de implementos | No aplica en v1 |
| Equipos relacionados | Cards con "cotizar" | Cards con "Ver detalle" + "Agregar al cotizador" |

---

## 4. Plan de Implementación

### Fase 1 — Extensión del Modelo de Datos (Effort: Medium)

**Objetivo:** Agregar los campos necesarios al interface `Equipment` y poblar los datos para al menos un equipo de prueba.

#### 4.1.1 Nuevo interface `Equipment`

```typescript
export interface EquipmentSpec {
  attribute: string;
  value: string;
}

export interface Equipment {
  // Campos existentes (sin cambios)
  slug: string;
  name: string;
  capacity: string;
  height?: string;
  shortDesc: string;
  features: string[];
  image: string;
  whatsappMessage: string;

  // Campos nuevos (todos opcionales para no romper cards existentes)
  brand?: string;                    // Marca del equipo
  description?: string;              // Descripción larga (párrafos HTML o texto)
  specs?: EquipmentSpec[];           // Tabla de especificaciones
  techSheetUrl?: string;             // URL de ficha técnica PDF
  gallery?: string[];                // URLs de imágenes adicionales
  relatedSlugs?: string[];           // Slugs de equipos relacionados
  seoTitle?: string;                 // Title tag personalizado
  seoDescription?: string;           // Meta description personalizado
}
```

#### 4.1.2 Datos de ejemplo (Grove RT 765 E)

```typescript
{
  slug: 'grua-grove-rt-765-e',
  name: 'Grove RT 765 E',
  brand: 'Grove',
  capacity: '60 t',
  height: '43 m',
  shortDesc: 'Grúa compacta para montaje industrial...',
  description: 'La Grove RT 765 E es una grúa rough terrain de 60 toneladas diseñada para... [3-4 párrafos]',
  features: ['Motor Tier 4 Final', 'Plumín de 15 m', '4 ejes direccionales'],
  specs: [
    { attribute: 'Capacidad máxima', value: '60 t' },
    { attribute: 'Pluma principal', value: '11.6 – 43 m' },
    { attribute: 'Plumín telescópico', value: '7.6 – 15 m' },
    { attribute: 'Motor', value: 'Cummins QSB 5.9 Tier 4' },
    { attribute: 'Potencia', value: '209 kW / 280 HP' },
    { attribute: 'Peso operativo', value: '43.6 t' },
    { attribute: 'Ejes', value: '4 ejes direccionales' },
    { attribute: 'Velocidad máxima', value: '40 km/h' },
  ],
  image: GRUA_GROVE_60T,
  gallery: [GRUA_GROVE_60T],  // v1: misma imagen; v2: múltiples ángulos
  techSheetUrl: '/docs/fichas/grua-grove-rt-765-e.pdf',
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Grove RT 765 E (60 t).',
  relatedSlugs: ['grua-terex-rt-780-e', 'grua-grove-gmk-4100'],
}
```

#### 4.1.3 Función helper para buscar equipos

```typescript
// src/data/rental.ts
export function findEquipmentBySlug(slug: string): {
  category: RentalCategory;
  subcategory: RentalSubcategory;
  equipment: Equipment;
} | undefined {
  for (const category of RENTAL_CATEGORIES) {
    for (const subcategory of category.subcategories) {
      const equipment = subcategory.catalog.find((e) => e.slug === slug);
      if (equipment) return { category, subcategory, equipment };
    }
  }
  return undefined;
}
```

---

### Fase 2 — Modificación de EquipmentCard (Effort: Low)

**Objetivo:** Agregar botón "Ver detalle" como variante ghost/outline junto al "Agregar al cotizador".

#### 4.2.1 Cambios en `EquipmentCard.astro`

```astro
---
// Añadir prop para la URL de detalle
export interface Props {
  item: Equipment;
  showAddToQuote?: boolean;
  showDetailLink?: boolean;   // NUEVO
  detailHref?: string;        // NUEVO
}

const { item, showAddToQuote = true, showDetailLink = true, detailHref } = Astro.props;

// Construir URL de detalle si no se provee
const href = detailHref ?? `#${item.slug}`;  // Fallback al anchor actual
---

<!-- En el body de la card, reemplazar el bloque de CTAs: -->
<div class="equipment-card__actions">
  {showDetailLink && (
    <a href={href} class="equipment-card__btn equipment-card__btn--ghost">
      <Icon name="eye" size={14} />
      Ver detalle
    </a>
  )}
  {showAddToQuote && (
    <QuoteAddButton item={item} sourceUrl={Astro.url.pathname} />
  )}
</div>
```

#### 4.2.2 Estilos para los botones de la card

```css
.equipment-card__actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.equipment-card__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.8rem;
  border-radius: 999px;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: all 0.18s var(--ease-out);
  text-decoration: none;
  flex: 1;
}

.equipment-card__btn--ghost {
  background: transparent;
  color: var(--color-brand, #308f40);
  border-color: var(--color-brand, #308f40);
}

.equipment-card__btn--ghost:hover {
  background: var(--color-brand, #308f40);
  color: var(--color-on-brand, #fff);
}
```

#### 4.2.3 Actualizar `EquipmentCatalog.astro`

El catálogo necesita pasar la URL de detalle a cada card:

```astro
<div class:list={['equipment-catalog__grid', `equipment-catalog__grid--cols-${columns}`]}>
  {items.map((item) => (
    <EquipmentCard
      item={item}
      detailHref={`/arriendo/${currentCategory}/${currentSubcategory}/${item.slug}`}
    />
  ))}
</div>
```

---

### Fase 3 — Creación de la Página de Detalle (Effort: High)

**Objetivo:** Crear la ruta `[equipo].astro` y los componentes de la página de detalle.

#### 4.3.1 Nueva ruta: `src/pages/arriendo/[categoria]/[subcategoria]/[equipo].astro`

```astro
---
export const prerender = true;

import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/ui/Container.astro';
import EquipmentDetailHero from '@/components/rental/EquipmentDetailHero.astro';
import EquipmentSpecsAccordion from '@/components/rental/EquipmentSpecsAccordion.astro';
import EquipmentDescription from '@/components/rental/EquipmentDescription.astro';
import RelatedEquipment from '@/components/rental/RelatedEquipment.astro';
import { RENTAL_CATEGORIES, findEquipmentBySlug } from '@/data/rental';
import { productSchemaExtended, breadcrumbSchema, combineSchemas } from '@/lib/seo';

export function getStaticPaths() {
  return RENTAL_CATEGORIES.flatMap((category) =>
    category.subcategories.flatMap((subcategory) =>
      subcategory.catalog.map((equipment) => ({
        params: {
          categoria: category.slug,
          subcategoria: subcategory.slug,
          equipo: equipment.slug,
        },
        props: { category, subcategory, equipment },
      }))
    )
  );
}

const { category, subcategory, equipment } = Astro.props;

const breadcrumbs = [
  { label: 'Inicio', url: '/' },
  { label: 'Arriendo de Equipos', url: '/arriendo' },
  { label: category.name, url: `/arriendo/${category.slug}` },
  { label: subcategory.name, url: `/arriendo/${category.slug}/${subcategory.slug}` },
  { label: equipment.name, url: Astro.url.pathname },
];

// Schema.org
const mainProductSchema = productSchemaExtended({
  name: `${equipment.brand ?? ''} ${equipment.name}`.trim(),
  description: equipment.seoDescription ?? equipment.shortDesc,
  url: Astro.url.pathname,
  image: equipment.image,
  brand: equipment.brand ?? 'IP Proyectos Industriales',
  offers: {
    availability: 'InStock',
    priceCurrency: 'CLP',
    priceRange: 'Consultar',
  },
});

const jsonLd = combineSchemas(mainProductSchema, breadcrumbSchema(breadcrumbs));

// Equipos relacionados
const relatedItems = (equipment.relatedSlugs ?? [])
  .map((slug) => {
    // Buscar equipo por slug en todo el catálogo
    const found = findEquipmentBySlug(slug);
    if (!found) return null;
    return {
      name: found.equipment.name,
      shortDesc: found.equipment.shortDesc,
      href: `/arriendo/${found.category.slug}/${found.subcategory.slug}/${found.equipment.slug}`,
      badge: found.equipment.capacity,
      image: found.equipment.image,
    };
  })
  .filter(Boolean);
---

<BaseLayout
  title={equipment.seoTitle ?? `Arriendo de ${equipment.name} | IP Proyectos`}
  description={equipment.seoDescription ?? equipment.shortDesc}
  breadcrumbs={breadcrumbs}
  jsonLd={jsonLd}
>
  <EquipmentDetailHero
    slot="hero"
    equipment={equipment}
    breadcrumbs={breadcrumbs}
    subcategoryName={subcategory.name}
  />

  <EquipmentSpecsAccordion
    slot="specs"
    specs={equipment.specs ?? []}
  />

  <EquipmentDescription
    slot="description"
    description={equipment.description ?? ''}
  />

  {relatedItems.length > 0 && (
    <RelatedEquipment
      slot="related"
      items={relatedItems}
      title="Equipos relacionados"
      background="dark"
    />
  )}
</BaseLayout>
```

#### 4.3.2 Componente: `EquipmentDetailHero.astro`

```
┌──────────────────────────────────┬──────────────────────────┐
│                                  │  Breadcrumbs             │
│  IMAGEN PRINCIPAL                │  MARCA                   │
│  (aspect-ratio 4:3, bg oscuro)   │  # NOMBRE DEL EQUIPO     │
│                                  │  Capacidad | Altura      │
│                                  │                          │
│                                  │  • Feature 1             │
│                                  │  • Feature 2             │
│                                  │  • Feature 3             │
│                                  │                          │
│                                  │  [AGREGAR AL COTIZADOR]  │
│                                  │  [📄 Ficha técnica PDF]  │
└──────────────────────────────────┴──────────────────────────┘
```

**Props:**
```typescript
interface Props {
  equipment: Equipment;
  breadcrumbs: Array<{ label: string; url: string }>;
  subcategoryName: string;
}
```

**Elementos clave:**
- Imagen principal con aspect-ratio 4:3, fondo grafito
- Badge de marca (si existe)
- Título H1 con nombre del equipo
- Meta datos: capacidad, altura (si existen)
- Features como bullets con iconos check
- CTA primario: `QuoteAddButton` (tamaño grande, full-width en mobile)
- Botón secundario: descarga de ficha técnica PDF (si `techSheetUrl` existe)
- En mobile: layout en columna (imagen arriba, datos abajo)

#### 4.3.3 Componente: `EquipmentSpecsAccordion.astro`

Reutiliza el patrón de acordeón de `FAQSection.astro` pero con contenido de tabla:

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ ESPECIFICACIONES                                          │
│ ┌──────────────────┬──────────────────────────────────────┐ │
│ │ Atributo         │ Propiedades                          │ │
│ ├──────────────────┼──────────────────────────────────────┤ │
│ │ Capacidad máx.   │ 60 t                                 │ │
│ │ Pluma principal  │ 11.6 – 43 m                          │ │
│ │ Motor            │ Cummins QSB 5.9 Tier 4               │ │
│ │ ...              │ ...                                  │ │
│ └──────────────────┴──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Props:**
```typescript
interface Props {
  specs: EquipmentSpec[];
  background?: 'light' | 'dark';
}
```

**Estructura HTML:**
```html
<details class="specs-accordion__details" open>
  <summary class="specs-accordion__header">
    <span>Especificaciones técnicas</span>
    <Icon name="chevron-down" />
  </summary>
  <div class="specs-accordion__content">
    <table class="specs-table">
      <thead>
        <tr>
          <th>Atributo</th>
          <th>Propiedades</th>
        </tr>
      </thead>
      <tbody>
        {specs.map(spec => (
          <tr>
            <td>{spec.attribute}</td>
            <td>{spec.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</details>
```

#### 4.3.4 Componente: `EquipmentDescription.astro`

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ DESCRIPCIÓN                                               │
│                                                             │
│   Párrafo 1 del equipo...                                   │
│   Párrafo 2 del equipo...                                   │
│   Párrafo 3 del equipo...                                   │
│                                                             │
│   Disclaimer legal (texto más pequeño, color muted)         │
└─────────────────────────────────────────────────────────────┘
```

**Props:**
```typescript
interface Props {
  description: string;
  background?: 'light' | 'dark';
}
```

---

### Fase 4 — Integración y Layout (Effort: Medium)

#### 4.4.1 Opción A: Usar `RentalLayout.astro` con nuevos slots

Extender `RentalLayout.astro` con slots adicionales:
- `slot="detail-hero"` — Hero de detalle (imagen + datos)
- `slot="specs"` — Acordeón de especificaciones
- `slot="description"` — Acordeón de descripción

#### 4.4.2 Opción B (Recomendada): Usar `BaseLayout.astro` directamente

La página de detalle tiene una estructura diferente a las subcategorías. Usar `BaseLayout` directamente permite mayor flexibilidad sin inflar el `RentalLayout` con slots que solo se usan en un contexto.

**Estructura de la página:**
```
BaseLayout
├── EquipmentDetailHero (imagen + datos + CTA)
├── EquipmentSpecsAccordion (tabla de specs)
├── EquipmentDescription (texto descriptivo)
├── RelatedEquipment (equipos relacionados)
└── CTABand (cta de cotización — reutilizado)
```

#### 4.4.3 Actualizar `EquipmentCatalog.astro`

Necesita recibir la ruta base para construir URLs de detalle:

```typescript
export interface Props {
  items: Equipment[];
  columns?: 2 | 3 | 4;
  background?: 'light' | 'dark';
  title?: string;
  categorySlug?: string;      // NUEVO
  subcategorySlug?: string;   // NUEVO
}
```

---

### Fase 5 — SEO y Schema (Effort: Low)

#### 4.5.1 Schema.org Product

Cada página de detalle genera un schema `Product` con:
- `name`, `description`, `image`, `brand`
- `offers` con `availability: InStock`, `priceCurrency: CLP`
- `areaServed` para las regiones de cobertura

#### 4.5.2 Breadcrumbs

Ya implementado en la ruta con `breadcrumbSchema()`.

#### 4.5.3 Meta tags

- `title`: `Arriendo de {brand} {name} | IP Proyectos Industriales`
- `description`: `equipment.seoDescription ?? equipment.shortDesc`
- `og:image`: `equipment.image`

---

## 5. Diagrama de Flujo de Implementación

Ver: `plans/flows/equipment-detail-flow.mmd`

---

## 6. Testing Strategy

### 6.1 Build verification
- `npm run build` debe completar sin errores
- Todas las rutas de detalle deben generarse estáticamente

### 6.2 Visual verification
- EquipmentCard con 2 botones en subcategorías
- Página de detalle con layout responsive (mobile-first)
- Acordeones con animaciones suaves
- Tabla de especificaciones legible en mobile

### 6.3 Functional verification
- "Ver detalle" navega a la página correcta
- "Agregar al cotizador" funciona desde la página de detalle
- Descarga de ficha técnica PDF funciona (si existe URL)
- Equipos relacionados navegan correctamente
- Breadcrumbs funcionan y son clickeables

### 6.4 SEO verification
- Schema.org Product valido en cada página de detalle
- Breadcrumbs schema correcto
- Meta tags completos
- Lighthouse SEO ≥ 90

---

## 7. Risks & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Datos insuficientes para poblar specs/description | Alto | Empezar con 1 equipo de prueba (Grove RT 765 E), expandir gradualmente |
| URLs de fichas técnicas PDF no disponibles | Medio | Hacer `techSheetUrl` opcional, ocultir botón si no existe |
| Galería de imágenes no disponible en v1 | Bajo | Usar imagen principal como única imagen, preparar estructura para galería futura |
| `relatedSlugs` requiere función de búsqueda global | Bajo | Implementar `findEquipmentBySlug()` helper en `rental.ts` |
| Regresión visual en EquipmentCard actual | Medio | Mantener `showDetailLink` como prop opcional (default: true) |
| Performance con muchas rutas estáticas | Bajo | ~40-50 equipos = ~50 páginas estáticas, Astro lo maneja sin problema |

---

## 8. Timeline Estimado

| Fase | Esfuerzo | Duración estimada |
|---|---|---|
| Fase 1: Extensión modelo de datos | Medium | 2-3 horas |
| Fase 2: Modificación EquipmentCard | Low | 1-2 horas |
| Fase 3: Página de detalle + componentes | High | 6-8 horas |
| Fase 4: Integración y layout | Medium | 2-3 horas |
| Fase 5: SEO y schema | Low | 1 hora |
| Testing y ajustes | Medium | 2-3 horas |
| **Total** | **High** | **~2-3 días** |

---

## 9. Criterios de Aceptación

- [ ] `EquipmentCard` muestra 2 botones: "Ver detalle" (ghost) + "Agregar al cotizador" (primary)
- [ ] Botón "Ver detalle" navega a `/arriendo/[categoria]/[subcategoria]/[equipo]`
- [ ] Página de detalle tiene hero con imagen + datos + CTA + descarga PDF
- [ ] Acordeón "Especificaciones" muestra tabla Atributo/Propiedades
- [ ] Acordeón "Descripción" muestra texto descriptivo
- [ ] Sección "Equipos relacionados" muestra cards navegables
- [ ] Layout responsive (mobile-first)
- [ ] Schema.org Product en cada página de detalle
- [ ] `npm run build` verde
- [ ] No regresión en páginas de subcategoría existentes

---

## 10. Decisiones Tomadas ✅

| # | Decisión | Respuesta | Implementación |
|---|---|---|---|
| 1 | ¿Layout de la página de detalle? | **A** — `BaseLayout` directo | Más flexible, no inflar RentalLayout |
| 2 | ¿Galería de imágenes en v1? | **B** — Sí, carousel con thumbnails | Misma imagen repetida + lightbox al click |
| 3 | ¿Poblar datos de todos los equipos? | **B** — Sí, todos los ~50 equipos | Specs genéricas basadas en datos existentes |
| 4 | ¿Ficha técnica PDF disponible? | **A** — Botón visible, sin funcionalidad | Placeholder visual, no descarga ni abre |
| 5 | ¿Acordeón de specs abierto por defecto? | **B** — No, cerrado | Usuario decide abrir |
| 6 | ¿"Ver detalle" en todas las cards? | **B** — Solo en subcategorías | No en categorías (index.astro) |
