# Spec 02 — Componentes del Catálogo

**Fase:** 2
**Estado:** ✅ Completo
**Archivos a crear:**
- `src/components/rental/EquipmentCatalog.astro`
- `src/components/rental/EquipmentCard.astro`

**Depende de:** [01-data-model.md](./01-data-model.md) (usa el tipo `Equipment`)
**Bloquea a:** [03-routes-templates.md](./03-routes-templates.md) (consume ambos)

---

## Objetivo

Crear el **componente catálogo** que renderiza la grilla de maquinarias disponibles en cada sub-ruta. Es la pieza central que el plan original no contemplaba y que se pidió explícitamente.

## Componentes

### 2.1 `EquipmentCatalog.astro`

Wrapper que renderiza la grilla responsiva. Inyecta schema `ItemList`.

**Props:**

```ts
interface Props {
  items: Equipment[];              // Lista de equipos a renderizar
  columns?: 2 | 3 | 4;            // Default: 3
  background?: 'light' | 'dark';  // Default: 'light'
  title?: string;                 // Eyebrow opcional sobre la grilla
  subtitle?: string;              // Subtítulo opcional
}
```

**Markup:**

```astro
---
// src/components/rental/EquipmentCatalog.astro
import EquipmentCard from './EquipmentCard.astro';
import Container from '@/components/ui/Container.astro';
import { itemListSchema } from '@/lib/seo';
import type { Equipment } from '@/data/rental';

interface Props {
  items: Equipment[];
  columns?: 2 | 3 | 4;
  background?: 'light' | 'dark';
  title?: string;
  subtitle?: string;
}

const { items, columns = 3, background = 'light', title, subtitle } = Astro.props;
const sectionId = `catalog-${Math.random().toString(36).slice(2, 9)}`;

const jsonLd = itemListSchema({
  name: title ?? 'Catálogo de equipos',
  items: items.map((item) => ({
    name: item.name,
    url: Astro.url.pathname + '#' + item.slug,
  })),
});
---

<section class:list={['equipment-catalog', `equipment-catalog--${background}`]} id={sectionId}>
  <Container>
    {(title || subtitle) && (
      <header class="equipment-catalog__header">
        {title && <h2 class="equipment-catalog__title">{title}</h2>}
        {subtitle && <p class="equipment-catalog__subtitle">{subtitle}</p>}
      </header>
    )}
    <div class:list={['equipment-catalog__grid', `equipment-catalog__grid--cols-${columns}`]}>
      {items.map((item) => <EquipmentCard item={item} />)}
    </div>
  </Container>
</section>

<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
```

**Estilos (extracto):**

```css
.equipment-catalog {
  padding-block: clamp(48px, 6vw, 80px);
}

.equipment-catalog--dark {
  background-color: var(--color-graphite, #0d1611);
  color: #fff;
}

.equipment-catalog__header {
  text-align: center;
  margin-bottom: clamp(28px, 4vw, 48px);
}

.equipment-catalog__title {
  font-family: var(--font-heading, 'Archivo', sans-serif);
  font-weight: 800;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  letter-spacing: -0.02em;
  margin: 0 0 12px;
}

.equipment-catalog__grid {
  display: grid;
  gap: clamp(20px, 2.5vw, 28px);
}

.equipment-catalog__grid--cols-2 { grid-template-columns: repeat(2, 1fr); }
.equipment-catalog__grid--cols-3 { grid-template-columns: repeat(3, 1fr); }
.equipment-catalog__grid--cols-4 { grid-template-columns: repeat(4, 1fr); }

@media (max-width: 1023px) {
  .equipment-catalog__grid--cols-3,
  .equipment-catalog__grid--cols-4 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 639px) {
  .equipment-catalog__grid { grid-template-columns: 1fr; }
}
```

### 2.2 `EquipmentCard.astro`

Card individual por maquinaria. Es lo que el usuario ve y hace clic.

**Props:**

```ts
interface Props {
  item: Equipment;
  showWhatsappCta?: boolean;  // Default: true
}
```

**Markup:**

```astro
---
// src/components/rental/EquipmentCard.astro
import Icon from '@/components/ui/Icon.astro';
import type { Equipment } from '@/data/rental';

interface Props {
  item: Equipment;
  showWhatsappCta?: boolean;
}

const { item, showWhatsappCta = true } = Astro.props;
const whatsappUrl = `https://wa.me/56956594144?text=${encodeURIComponent(item.whatsappMessage)}`;
const anchorId = item.slug;
---

<article class="equipment-card" id={anchorId}>
  <div class="equipment-card__image-wrapper">
    <img
      src={item.image}
      alt={item.name}
      class="equipment-card__image"
      loading="lazy"
    />
    {item.capacity && <span class="equipment-card__badge">{item.capacity}</span>}
  </div>
  <div class="equipment-card__body">
    <h3 class="equipment-card__title">{item.name}</h3>
    {item.height && <p class="equipment-card__meta">Altura máx: {item.height}</p>}
    <p class="equipment-card__desc">{item.shortDesc}</p>
    <ul class="equipment-card__features">
      {item.features.slice(0, 3).map((feature) => (
        <li class="equipment-card__feature">
          <Icon name="check" size={14} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    {showWhatsappCta && (
      <a
        href={whatsappUrl}
        class="equipment-card__cta"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Cotizar arriendo de ${item.name} por WhatsApp`}
      >
        Cotizar este equipo
        <Icon name="arrow-right" size={16} />
      </a>
    )}
  </div>
</article>
```

**Estilos (extracto):**

```css
.equipment-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface, #fff);
  border: 1px solid var(--color-line, rgba(255, 255, 255, 0.1));
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.equipment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: var(--color-brand, #1a9c4a);
}

.equipment-catalog--dark .equipment-card {
  background-color: #182520;
  border-color: rgba(255, 255, 255, 0.08);
}

.equipment-card__image-wrapper {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background-color: var(--color-graphite, #0d1611);
}

.equipment-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.equipment-card:hover .equipment-card__image {
  transform: scale(1.05);
}

.equipment-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  background-color: var(--color-brand, #1a9c4a);
  color: #fff;
  font-family: var(--font-heading, 'Archivo', sans-serif);
  font-weight: 700;
  font-size: 0.8125rem;
  border-radius: 999px;
  letter-spacing: 0.02em;
}

.equipment-card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 22px 22px;
  flex: 1;
}

.equipment-card__title {
  font-family: var(--font-heading, 'Archivo', sans-serif);
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin: 0;
  color: var(--color-ink, #1a1a1a);
}

.equipment-catalog--dark .equipment-card__title {
  color: #fff;
}

.equipment-card__meta {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-brand, #1a9c4a);
  font-weight: 600;
}

.equipment-card__desc {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-ink-700, #374151);
}

.equipment-catalog--dark .equipment-card__desc {
  color: rgba(255, 255, 255, 0.75);
}

.equipment-card__features {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.equipment-card__feature {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--color-ink-700, #374151);
}

.equipment-catalog--dark .equipment-card__feature {
  color: rgba(255, 255, 255, 0.85);
}

.equipment-card__feature :global(svg) {
  flex-shrink: 0;
  color: var(--color-brand, #1a9c4a);
  margin-top: 2px;
}

.equipment-card__cta {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding: 12px 18px;
  background-color: var(--color-brand, #1a9c4a);
  color: #fff;
  font-family: var(--font-heading, 'Archivo', sans-serif);
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  border-radius: 999px;
  transition: background-color 0.18s ease, transform 0.18s ease;
}

.equipment-card__cta:hover,
.equipment-card__cta:focus {
  background-color: var(--color-brand-700, #15803d);
  transform: translateY(-1px);
}
```

## Decisiones de diseño

1. **`id={item.slug}` en la card** — permite que el redirect de `/arriendo-maquinaria/gruas-grove-gmk` aterrice en `/arriendo/izaje/gruas-100-toneladas#grua-grove-gmk-4100` haciendo scroll al modelo exacto.
2. **`ItemList` schema** — mejora CTR en SERP con thumbnails y listados enriquecidos (Google puede mostrar hasta 3-4 cards en mobile).
3. **Badge de capacidad** — visible incluso sin imagen, refuerza el dato más buscado.
4. **Hover lift** — microinteracción estándar de catálogo (4px translateY + sombra).
5. **WhatsApp pre-armado** — la card tiene CTA directo a WhatsApp con el modelo específico en el mensaje.

## Tareas

- [ ] Crear `src/components/rental/EquipmentCatalog.astro` con markup y estilos
- [ ] Crear `src/components/rental/EquipmentCard.astro` con markup y estilos
- [ ] Verificar que importan correctamente `Equipment` desde `@/data/rental`
- [ ] Verificar que `Icon` component ya existe en `@/components/ui/Icon.astro`
- [ ] Probar en una página de prueba con datos mock (3 items)
- [ ] Verificar responsividad: 1 col mobile, 2 cols tablet, 3-4 desktop

## Definition of Done

- [ ] Los 2 componentes existen y compilan sin errores
- [ ] `EquipmentCatalog` recibe `items: Equipment[]` y los renderiza como grilla
- [ ] `EquipmentCard` muestra: imagen, badge de capacidad, nombre, altura (opcional), descripción, 3 features y CTA WhatsApp
- [ ] Cada card tiene `id={item.slug}` para deep-linking
- [ ] La grilla es responsiva (1/2/3-4 columnas según viewport)
- [ ] El schema `ItemList` se inyecta correctamente
- [ ] El hover muestra lift + shadow
- [ ] El WhatsApp pre-armado tiene el mensaje específico del equipo

## Dependencias externas (a crear en otras specs)

- `itemListSchema()` → [06-seo-schema.md](./06-seo-schema.md) (Spec 06)
- `Equipment` type → [01-data-model.md](./01-data-model.md) (Spec 01)
- `Icon` component → ya existe en `src/components/ui/Icon.astro`
- `Container` component → ya existe en `src/components/ui/Container.astro`

## Referencias

- README: [./README.md](./README.md)
- Spec 01: [./01-data-model.md](./01-data-model.md) — tipo `Equipment`
- Spec 03: [./03-routes-templates.md](./03-routes-templates.md) — consume `EquipmentCatalog`
- Spec 06: [./06-seo-schema.md](./06-seo-schema.md) — `itemListSchema()`
