# Spec 04 — Slots en `RentalLayout`

**Fase:** 6
**Estado:** ✅ Completo
**Archivos a modificar:**
- `src/layouts/RentalLayout.astro`

**Archivos a crear:**
- (ninguno nuevo, solo refactor del layout existente)

**Depende de:** [01-data-model.md](./01-data-model.md)
**Bloquea a:** [03-routes-templates.md](./03-routes-templates.md), [05-secondary-components.md](./05-secondary-components.md)

---

## Objetivo

Refactorizar `RentalLayout.astro` para que las sub-rutas puedan inyectar contenido variable (catálogo, specs, related, FAQ) sin duplicar el layout ni perder el hero + features + CTA existentes.

## Estado actual

`src/layouts/RentalLayout.astro` tiene:
- Hero con imagen, breadcrumbs, título, subtítulo, CTAs
- Bloque "qué incluye" con lista de features
- CTA band de cotización

No soporta contenido adicional entre el bloque de features y el CTA. Para añadir el catálogo, hay que duplicar el layout.

## Diseño del refactor

### Estrategia: añadir slots nombrados

Conservar el comportamiento actual por defecto (los slots son opcionales) para mantener compatibilidad con las páginas existentes (ninguna usa slots aún, pero los existentes `/arriendos/izaje`, etc., se eliminarán tras Spec 07).

### Slots a añadir

| Slot | Contenido esperado | Posición |
|---|---|---|
| `catalog` | `<EquipmentCatalog />` | Entre features y specs |
| `specs` | `<SpecsGrid />` | Entre catálogo y related |
| `related` | `<RelatedEquipment />` | Antes del FAQ |
| `faq` | `<FAQSection />` | Antes del CTA |

### Nuevas props opcionales

```ts
interface Props {
  // ... props existentes
  showSpecs?: boolean;            // Mostrar SpecsGrid automáticamente
  showRelated?: boolean;          // Mostrar RelatedEquipment automáticamente
  showFaq?: boolean;              // Mostrar FAQSection automáticamente
  catalogItems?: Equipment[];     // Atajo para inyectar catálogo sin slot
  specs?: { label: string; value: string }[];
  relatedItems?: Array<{ name: string; href: string; shortDesc: string }>;
  faqItems?: Array<{ question: string; answer: string }>;
}
```

**Decisión:** soportar ambos mecanismos (slots Y props) para flexibilidad. Las páginas simples pueden usar props; las que necesitan más control usan slots.

## Markup refactorizado

```astro
---
// src/layouts/RentalLayout.astro
// Layout reutilizable para páginas de rental/arriendos (v2 — con slots)

import BaseLayout from './BaseLayout.astro';
import Container from '@/components/ui/Container.astro';
import Breadcrumbs from '@/components/seo/Breadcrumbs.astro';
import Icon from '@/components/ui/Icon.astro';
import CTABand from '@/components/ui/CTABand.astro';
import EquipmentCatalog from '@/components/rental/EquipmentCatalog.astro';
import SpecsGrid from '@/components/rental/SpecsGrid.astro';
import RelatedEquipment from '@/components/rental/RelatedEquipment.astro';
import FAQSection from '@/components/rental/FAQSection.astro';
import heroImg from '@/assets/imgs/hero.jpg';
import type { Equipment } from '@/data/rental';

export interface Props {
  // Existentes (sin cambios)
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  category: string;
  features: string[];
  breadcrumbs: Array<{ label: string; url: string }>;
  whatsappMessage: string;
  catalogUrl?: string;
  catalogLabel?: string;

  // Nuevas (todas opcionales)
  showSpecs?: boolean;
  showRelated?: boolean;
  showFaq?: boolean;
  catalogItems?: Equipment[];
  catalogColumns?: 2 | 3 | 4;
  specs?: { label: string; value: string }[];
  relatedItems?: Array<{ name: string; href: string; shortDesc: string }>;
  faqItems?: Array<{ question: string; answer: string }>;
}

const {
  title,
  subtitle,
  description,
  heroImage,
  heroImageAlt,
  category,
  features,
  breadcrumbs,
  whatsappMessage,
  catalogUrl = '/catalogo.pdf',
  catalogLabel = 'Descargar catálogo',
  showSpecs = false,
  showRelated = false,
  showFaq = false,
  catalogItems,
  catalogColumns = 3,
  specs,
  relatedItems,
  faqItems,
} = Astro.props;

const hasCatalogSlot = Astro.slots.has('catalog');
const hasSpecsSlot = Astro.slots.has('specs');
const hasRelatedSlot = Astro.slots.has('related');
const hasFaqSlot = Astro.slots.has('faq');

const showCatalog = hasCatalogSlot || (catalogItems && catalogItems.length > 0);
---

<BaseLayout
  title={title}
  description={description}
  breadcrumbs={breadcrumbs}
>
  <!-- Hero (sin cambios) -->
  <section class="rental-hero">
    <img src={heroImage} alt={heroImageAlt} class="rental-hero__bg" loading="eager" fetchpriority="high" />
    <div class="rental-hero__overlay"></div>
    <div class="rental-hero__container">
      <Breadcrumbs items={breadcrumbs} variant="hero" />
      <p class="rental-hero__category">{category}</p>
      <h1 class="rental-hero__title">{title}</h1>
      <p class="rental-hero__subtitle">{subtitle}</p>
      <div class="rental-hero__ctas">
        <a href="#cotizar" class="rental-hero__btn rental-hero__btn--primary">
          Cotizar
          <Icon name="arrow-right" size={16} />
        </a>
        <a href={catalogUrl} class="rental-hero__btn rental-hero__btn--outline" download>
          <Icon name="download" size={16} />
          {catalogLabel}
        </a>
      </div>
    </div>
  </section>

  <!-- Contenido principal: features + slots opcionales -->
  <section class="rental-content">
    <Container>
      <div class="rental-content__grid">
        <div class="rental-content__image-wrapper">
          <img src={heroImage} alt={heroImageAlt} class="rental-content__image" loading="lazy" />
        </div>
        <div class="rental-content__main">
          <p class="rental-content__eyebrow">Qué incluye</p>
          <h2 class="rental-content__title">{description}</h2>
          <ul class="rental-content__list">
            {features.map((item) => (
              <li class="rental-content__list-item">
                <Icon name="check" size={20} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  </section>

  <!-- Catálogo (nuevo) -->
  {hasCatalogSlot ? (
    <slot name="catalog" />
  ) : catalogItems ? (
    <EquipmentCatalog items={catalogItems} columns={catalogColumns} />
  ) : null}

  <!-- Specs (nuevo) -->
  {(hasSpecsSlot || (showSpecs && specs && specs.length > 0)) && (
    <section class="rental-specs">
      <Container>
        {hasSpecsSlot ? <slot name="specs" /> : <SpecsGrid specs={specs} />}
      </Container>
    </section>
  )}

  <!-- Related equipment (nuevo) -->
  {(hasRelatedSlot || (showRelated && relatedItems && relatedItems.length > 0)) && (
    <section class="rental-related">
      {hasRelatedSlot ? <slot name="related" /> : <RelatedEquipment items={relatedItems} />}
    </section>
  )}

  <!-- FAQ (nuevo) -->
  {(hasFaqSlot || (showFaq && faqItems && faqItems.length > 0)) && (
    <section class="rental-faq">
      {hasFaqSlot ? <slot name="faq" /> : <FAQSection items={faqItems} />}
    </section>
  )}

  <!-- CTA de cotización (sin cambios) -->
  <div id="cotizar">
    <CTABand
      eyebrow="¿Necesitas equipos para tu faena?"
      title="Arrienda con nosotros"
      subtitle="Contamos con operadores certificados y disponibilidad 24/7 para tu proyecto."
      showForm={true}
      backgroundImage={heroImg.src}
      contentAlign="center"
      minHeight="sm"
    />
  </div>
</BaseLayout>

<style>
  /* (estilos existentes del hero, content, etc.) */

  .rental-specs,
  .rental-related,
  .rental-faq {
    padding-block: clamp(48px, 6vw, 80px);
    background-color: var(--color-surface, #fff);
  }

  .rental-related {
    background-color: var(--color-graphite, #0d1611);
  }
</style>
```

## Cambios específicos vs versión actual

| Cambio | Razón |
|---|---|
| Importar 4 componentes nuevos (catalog, specs, related, faq) | Soporte directo sin slots |
| Añadir 9 props nuevas | Atajo para usar layout sin slots |
| Añadir 4 slots nombrados | Inyección de contenido desde páginas |
| Añadir wrappers `<section>` con padding | Espaciado consistente |
| Mantener todo lo demás idéntico | Compatibilidad retroactiva |

## Backward compatibility

Las páginas que actualmente usan `RentalLayout` (las viejas `/arriendos/*.astro` que se eliminarán en Spec 07) **siguen funcionando idéntico** porque:
- No pasan ninguna de las props nuevas
- No usan slots
- El bloque hero + features + CTA se renderiza igual

No hay riesgo de regresión.

## Uso desde Spec 03 (sub-rutas catálogo)

```astro
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
>
  <EquipmentCatalog
    slot="catalog"
    items={subcategory.catalog}
    columns={3}
  />
</RentalLayout>
```

## Tareas

- [ ] Abrir `src/layouts/RentalLayout.astro`
- [ ] Añadir los 4 imports (`EquipmentCatalog`, `SpecsGrid`, `RelatedEquipment`, `FAQSection`)
- [ ] Añadir las 9 props nuevas a la `interface Props`
- [ ] Añadir los 4 slots nombrados
- [ ] Añadir los 4 wrappers `<section>` para specs/related/faq
- [ ] Verificar que `npm run build` sigue compilando
- [ ] (Opcional) Probar en una página de prueba pasando `<EquipmentCatalog slot="catalog" />`

## Definition of Done

- [ ] `RentalLayout.astro` tiene los 4 slots nombrados
- [ ] Las 9 props nuevas son opcionales (no rompen el uso actual)
- [ ] El layout sigue funcionando idéntico sin slots ni props nuevas
- [ ] Compila sin errores TypeScript
- [ ] Las páginas existentes (`/arriendos/*.astro`) siguen renderizando igual

## Referencias

- README: [./README.md](./README.md)
- Spec 01: [./01-data-model.md](./01-data-model.md) — tipo `Equipment`
- Spec 02: [./02-catalog-components.md](./02-catalog-components.md) — `EquipmentCatalog`
- Spec 03: [./03-routes-templates.md](./03-routes-templates.md) — consume slots
- Spec 05: [./05-secondary-components.md](./05-secondary-components.md) — componentes para slots
