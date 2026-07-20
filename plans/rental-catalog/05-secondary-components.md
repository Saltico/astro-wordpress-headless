# Spec 05 — Componentes Secundarios

**Fase:** 7
**Estado:** ✅ Completo
**Archivos a crear:**
- `src/components/rental/SpecsGrid.astro`
- `src/components/rental/RelatedEquipment.astro`
- `src/components/rental/FAQSection.astro`

**Depende de:**
- [01-data-model.md](./01-data-model.md)
- [04-layout-slots.md](./04-layout-slots.md) (los slots ya están listos)

**Bloquea a:** [10-acceptance-criteria.md](./10-acceptance-criteria.md) (DoD completo)

---

## Objetivo

Crear los 3 componentes complementarios que enriquecen cada sub-ruta: tabla de specs técnicas, equipos relacionados, y FAQ. Se renderizan en los slots del `RentalLayout`.

---

## 5.1 `SpecsGrid.astro`

Muestra las specs técnicas clave del equipo en una grilla de "badges" visualmente atractivas.

**Props:**

```ts
interface Props {
  specs: { label: string; value: string }[];
  background?: 'light' | 'dark';  // default 'light'
  title?: string;                  // default "Especificaciones técnicas"
}
```

**Markup:**

```astro
---
// src/components/rental/SpecsGrid.astro
import Container from '@/components/ui/Container.astro';
import Icon from '@/components/ui/Icon.astro';

interface Props {
  specs: { label: string; value: string }[];
  background?: 'light' | 'dark';
  title?: string;
}

const { specs, background = 'light', title = 'Especificaciones técnicas' } = Astro.props;
---

<section class:list={['specs-grid', `specs-grid--${background}`]}>
  <Container>
    <header class="specs-grid__header">
      <h2 class="specs-grid__title">{title}</h2>
    </header>
    <div class="specs-grid__items">
      {specs.map((spec) => (
        <div class="specs-grid__item">
          <p class="specs-grid__label">{spec.label}</p>
          <p class="specs-grid__value">{spec.value}</p>
        </div>
      ))}
    </div>
  </Container>
</section>

<style>
  .specs-grid {
    padding-block: clamp(48px, 6vw, 80px);
  }

  .specs-grid--light {
    background-color: var(--color-surface-alt, #f7f9f7);
  }

  .specs-grid--dark {
    background-color: var(--color-graphite, #0d1611);
    color: #fff;
  }

  .specs-grid__header {
    margin-bottom: clamp(24px, 3vw, 36px);
  }

  .specs-grid__title {
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-weight: 800;
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    letter-spacing: -0.02em;
    margin: 0;
    line-height: 1.2;
  }

  .specs-grid__items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
  }

  .specs-grid__item {
    background-color: var(--color-surface, #fff);
    border: 1px solid var(--color-line, #e5e7eb);
    border-radius: 12px;
    padding: 20px 24px;
    transition: border-color 0.2s ease, transform 0.2s ease;
  }

  .specs-grid--dark .specs-grid__item {
    background-color: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .specs-grid__item:hover {
    border-color: var(--color-brand, #1a9c4a);
    transform: translateY(-2px);
  }

  .specs-grid__label {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-ink-500, #6b7280);
    margin: 0 0 8px;
    font-weight: 600;
  }

  .specs-grid--dark .specs-grid__label {
    color: rgba(255, 255, 255, 0.6);
  }

  .specs-grid__value {
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-weight: 800;
    font-size: 1.4rem;
    line-height: 1.1;
    margin: 0;
    color: var(--color-ink, #1a1a1a);
  }

  .specs-grid--dark .specs-grid__value {
    color: #fff;
  }
</style>
```

---

## 5.2 `RelatedEquipment.astro`

Muestra equipos relacionados (sub-rutas hermanas de la misma categoría) en grilla de cards simples.

**Props:**

```ts
interface RelatedItem {
  name: string;
  shortDesc: string;
  href: string;
  badge?: string;  // ej: "60 t" o "Ver detalle"
}

interface Props {
  items: RelatedItem[];
  background?: 'light' | 'dark';  // default 'dark'
  title?: string;                  // default "Equipos relacionados"
}
```

**Markup:**

```astro
---
// src/components/rental/RelatedEquipment.astro
import Container from '@/components/ui/Container.astro';
import Icon from '@/components/ui/Icon.astro';

interface RelatedItem {
  name: string;
  shortDesc: string;
  href: string;
  badge?: string;
}

interface Props {
  items: RelatedItem[];
  background?: 'light' | 'dark';
  title?: string;
}

const { items, background = 'dark', title = 'Equipos relacionados' } = Astro.props;
---

<section class:list={['related-equipment', `related-equipment--${background}`]}>
  <Container>
    <header class="related-equipment__header">
      <h2 class="related-equipment__title">{title}</h2>
    </header>
    <div class="related-equipment__grid">
      {items.map((item) => (
        <a href={item.href} class="related-card">
          <div class="related-card__header">
            {item.badge && <span class="related-card__badge">{item.badge}</span>}
            <h3 class="related-card__title">{item.name}</h3>
          </div>
          <p class="related-card__desc">{item.shortDesc}</p>
          <span class="related-card__cta">
            Ver detalle
            <Icon name="arrow-right" size={16} />
          </span>
        </a>
      ))}
    </div>
  </Container>
</section>

<style>
  .related-equipment {
    padding-block: clamp(48px, 6vw, 80px);
  }

  .related-equipment--dark {
    background-color: var(--color-graphite, #0d1611);
    color: #fff;
  }

  .related-equipment__header {
    margin-bottom: clamp(24px, 3vw, 36px);
  }

  .related-equipment__title {
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-weight: 800;
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    letter-spacing: -0.02em;
    margin: 0;
  }

  .related-equipment__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
  }

  .related-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 24px;
    background-color: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
  }

  .related-equipment--light .related-card {
    background-color: var(--color-surface, #fff);
    border-color: var(--color-line, #e5e7eb);
  }

  .related-card:hover {
    border-color: var(--color-brand, #1a9c4a);
    background-color: rgba(26, 156, 74, 0.08);
    transform: translateY(-2px);
  }

  .related-card__header {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .related-card__badge {
    display: inline-block;
    padding: 4px 10px;
    background-color: var(--color-brand, #1a9c4a);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 999px;
  }

  .related-card__title {
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-weight: 800;
    font-size: 1.1rem;
    margin: 0;
    line-height: 1.2;
  }

  .related-card__desc {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.75);
    flex: 1;
  }

  .related-equipment--light .related-card__desc {
    color: var(--color-ink-700, #374151);
  }

  .related-card__cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--color-brand, #1a9c4a);
    font-weight: 700;
    font-size: 0.875rem;
  }
</style>
```

**Selector de "related" (lógica para Spec 03):**

El template de la sub-ruta debe armar `relatedItems` excluyendo la sub-ruta actual. Estrategia:

```ts
const relatedItems = category.subcategories
  .filter((s) => s.slug !== subcategory.slug)
  .slice(0, 4)
  .map((s) => ({
    name: s.name,
    shortDesc: s.shortDesc,
    href: `/arriendo/${category.slug}/${s.slug}`,
    badge: s.catalog[0]?.capacity,  // capacidad del primer modelo
  }));
```

---

## 5.3 `FAQSection.astro`

Sección de preguntas frecuentes con schema `FAQPage` inyectado automáticamente.

**Props:**

```ts
interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
  background?: 'light' | 'dark';  // default 'light'
  title?: string;                  // default "Preguntas frecuentes"
}
```

**Markup:**

```astro
---
// src/components/rental/FAQSection.astro
import Container from '@/components/ui/Container.astro';
import Icon from '@/components/ui/Icon.astro';
import { faqPageSchema } from '@/lib/seo';

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
  background?: 'light' | 'dark';
  title?: string;
}

const { items, background = 'light', title = 'Preguntas frecuentes' } = Astro.props;
const sectionId = `faq-${Math.random().toString(36).slice(2, 9)}`;
const jsonLd = faqPageSchema(items);
---

<section class:list={['faq-section', `faq-section--${background}`]} id={sectionId}>
  <Container>
    <header class="faq-section__header">
      <h2 class="faq-section__title">{title}</h2>
    </header>
    <ul class="faq-section__list">
      {items.map((item, index) => (
        <li class="faq-item">
          <details class="faq-item__details">
            <summary class="faq-item__question">
              <span>{item.question}</span>
              <Icon name="chevron-down" size={18} class="faq-item__icon" />
            </summary>
            <p class="faq-item__answer">{item.answer}</p>
          </details>
        </li>
      ))}
    </ul>
  </Container>
</section>

<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />

<style>
  .faq-section {
    padding-block: clamp(48px, 6vw, 80px);
  }

  .faq-section--light {
    background-color: var(--color-surface, #fff);
  }

  .faq-section--dark {
    background-color: var(--color-graphite, #0d1611);
    color: #fff;
  }

  .faq-section__header {
    margin-bottom: clamp(24px, 3vw, 36px);
    text-align: center;
  }

  .faq-section__title {
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-weight: 800;
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    letter-spacing: -0.02em;
    margin: 0;
  }

  .faq-section__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 800px;
    margin-inline: auto;
  }

  .faq-item__details {
    background-color: var(--color-surface-alt, #f7f9f7);
    border: 1px solid var(--color-line, #e5e7eb);
    border-radius: 12px;
    padding: 20px 24px;
    transition: border-color 0.2s ease;
  }

  .faq-section--dark .faq-item__details {
    background-color: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .faq-item__details[open] {
    border-color: var(--color-brand, #1a9c4a);
  }

  .faq-item__question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    cursor: pointer;
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-weight: 700;
    font-size: 1.05rem;
    list-style: none;
  }

  .faq-item__question::-webkit-details-marker {
    display: none;
  }

  .faq-item__icon {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .faq-item__details[open] .faq-item__icon {
    transform: rotate(180deg);
  }

  .faq-item__answer {
    margin: 16px 0 0;
    line-height: 1.6;
    color: var(--color-ink-700, #374151);
  }

  .faq-section--dark .faq-item__answer {
    color: rgba(255, 255, 255, 0.75);
  }
</style>
```

**FAQ por defecto (a llenar en Spec 03):**

Para cada sub-ruta, generar 3-5 FAQs automáticamente. Plantilla:

```ts
const faqItems = [
  {
    question: `¿Cuánto cuesta arrendar ${subcategory.name.toLowerCase()} en Chile?`,
    answer: `El precio del arriendo de ${subcategory.name.toLowerCase()} depende de la duración, ubicación y modelo específico. Solicita una cotización personalizada y recibirás respuesta en menos de 48 horas.`,
  },
  {
    question: `¿El operador está incluido en el arriendo?`,
    answer: `Sí, todos nuestros equipos se entregan con operador certificado y planes de izaje o trabajo según el requerimiento.`,
  },
  {
    question: `¿Cuál es la disponibilidad geográfica?`,
    answer: `Tenemos cobertura en zona norte (Atacama, Coquimbo) y centro de Chile. Para otras regiones, consultar.`,
  },
  {
    question: `¿Qué documentos se requieren para arrendar?`,
    answer: `Orden de compra, contrato de arriendo firmado y, según el caso, permiso de trabajo o plan de izaje aprobado.`,
  },
  {
    question: `¿Cuál es el tiempo mínimo de arriendo?`,
    answer: `El arriendo mínimo es de 1 turno (8 horas) para equipos menores y 1 día (24 horas) para grúas de alto tonelaje.`,
  },
];
```

**Personalización opcional:** las FAQs podrían vivir en `rental.ts` por sub-ruta (campo `faqs?: FAQItem[]`). En v1, generar desde plantilla para todas.

## Tareas

- [ ] Crear `src/components/rental/SpecsGrid.astro` con markup y estilos
- [ ] Crear `src/components/rental/RelatedEquipment.astro` con markup y estilos
- [ ] Crear `src/components/rental/FAQSection.astro` con markup y estilos
- [ ] Verificar que `Icon` (chevron-down, check, arrow-right) y `Container` existen
- [ ] Probar renderizando con datos mock en una página temporal

## Definition of Done

- [ ] Los 3 componentes existen y compilan sin errores
- [ ] `SpecsGrid` recibe `specs[]` y renderiza la grilla de badges
- [ ] `RelatedEquipment` recibe `items[]` y renderiza la grilla de cards con link
- [ ] `FAQSection` recibe `items[]` y renderiza acordeón con `<details>`
- [ ] Cada `<details>` se expande/colapsa correctamente
- [ ] El schema `FAQPage` se inyecta automáticamente
- [ ] Los componentes son responsivos (1/2/3-4 columnas según viewport)
- [ ] Funcionan tanto en `background="light"` como `background="dark"`

## Referencias

- README: [./README.md](./README.md)
- Spec 01: [./01-data-model.md](./01-data-model.md) — tipo `Equipment`
- Spec 04: [./04-layout-slots.md](./04-layout-slots.md) — slots que los reciben
- Spec 06: [./06-seo-schema.md](./06-seo-schema.md) — `faqPageSchema()` ya existe
