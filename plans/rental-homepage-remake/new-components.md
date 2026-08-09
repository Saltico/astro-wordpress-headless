---
feature: New Components for Rental Homepage
effort: Medium-High
dependencies: [overview.md, homepage-sections.md]
status: Planned
---

# New Components to Build

This document specifies each new component needed for the rental-first homepage remake, including props, behavior, and implementation notes.

---

## Component Inventory

| # | Component | File | Effort | Replaces |
|---|-----------|------|--------|----------|
| 1 | `EquipmentSearch` | `src/components/rental/EquipmentSearch.astro` | Medium | Nothing (new) |
| 2 | `CategoryShowcase` | `src/components/rental/CategoryShowcase.astro` | Medium | `ServicesGrid` on homepage |
| 3 | `FeaturedEquipment` | `src/components/rental/FeaturedEquipment.astro` | Medium | Nothing (new) |
| 4 | `ServicesCompact` | `src/components/ui/ServicesCompact.astro` | Low | `ServicesGrid` + `SplitSection` on homepage |

---

## 1. EquipmentSearch

### Purpose
Client-side search bar that lets visitors find equipment by name, category, or subcategory. Inspired by SK Rental's "Encuentra tu máquina" search.

### File
`src/components/rental/EquipmentSearch.astro`

### Props
```typescript
interface EquipmentSearchProps {
  placeholder?: string;       // Default: "Encuentra tu máquina..."
  class?: string;             // CSS class override
}
```

### Data Source
Imports `RENTAL_CATEGORIES` from `@/data/rental` and builds a flat search index at build time:

```typescript
interface SearchItem {
  name: string;           // e.g., "Grúa Grove RT 765-E"
  category: string;       // e.g., "Izaje"
  subcategory: string;    // e.g., "Grúas 60 toneladas"
  url: string;            // e.g., "/arriendo/izaje/gruas-60-toneladas"
  capacity?: string;      // e.g., "60 t"
}
```

### Behavior
1. **Input**: Text input with search icon
2. **Debounced search** (200ms): Filters `SearchItem[]` by fuzzy match on `name`, `category`, `subcategory`
3. **Results dropdown**: Shows up to 8 matching items grouped by category
4. **Each result**: Shows name + capacity + category badge, links to subcategory page
5. **Empty state**: "No se encontraron equipos. Ver catálogo completo →" linking to `/arriendo`
6. **Keyboard navigation**: Arrow keys to navigate results, Enter to select, Escape to close
7. **Mobile**: Full-width input, results overlay

### Client-Side Script
```typescript
// Embedded <script> tag in the component
// - Builds search index from serialized JSON (injected at build time)
// - Listens to input events with debounce
// - Renders results dropdown
// - Handles keyboard navigation
// - Closes on outside click
```

### Accessibility
- `role="combobox"` on input
- `role="listbox"` on results container
- `aria-expanded` toggles with dropdown visibility
- `aria-activedescendant` tracks focused result
- Screen reader announcements for result count

### Styling
- Dark theme consistent with site design system
- Search icon (reuse `Icon` component with `search` icon)
- Results card with `var(--theme-bg-elevated)` background
- Hover state with brand color accent

---

## 2. CategoryShowcase

### Purpose
Visual grid of all rental categories with images and subcategory pills. The centerpiece of the rental-first homepage.

### File
`src/components/rental/CategoryShowcase.astro`

### Props
```typescript
interface CategoryShowcaseProps {
  eyebrow?: string;           // Default: "Nuestro catálogo"
  title?: string;             // Default: "Equipos en arriendo"
  subtitle?: string;          // Optional description
  class?: string;
}
```

### Data Source
Imports `RENTAL_CATEGORIES` from `@/data/rental`.

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Eyebrow: "Nuestro catálogo"                            │
│  Title: "Equipos en arriendo para minería e industria"  │
│  Subtitle: (optional)                                   │
├────────────────────────┬────────────────────────────────┤
│  ┌──────────────────┐  │  ┌──────────────────┐          │
│  │  Category Image   │  │  │  Category Image   │          │
│  │  ─────────────── │  │  │  ─────────────── │          │
│  │  Category Name   │  │  │  Category Name   │          │
│  │  Short desc      │  │  │  Short desc      │          │
│  │  [pill] [pill]   │  │  │  [pill] [pill]   │          │
│  │  [pill] [pill]   │  │  │  [pill] [pill]   │          │
│  │  Ver categoría → │  │  │  Ver categoría → │          │
│  └──────────────────┘  │  └──────────────────┘          │
│  ┌──────────────────┐  │  ┌──────────────────┐          │
│  │  Category Image   │  │  │  Category Image   │          │
│  │  ...              │  │  │  ...              │          │
│  └──────────────────┘  │  └──────────────────┘          │
└────────────────────────┴────────────────────────────────┘
```

### Category Card Structure
Each card renders:
1. **Image**: Category hero image from `rental.ts` (e.g., `izajeHero` for Izaje)
2. **Title**: Category name as `<h2>`
3. **Description**: `category.shortDesc`
4. **Subcategory pills**: Each subcategory as a clickable pill linking to `/arriendo/{category.slug}/{sub.slug}`
5. **CTA link**: "Ver categoría →" linking to `/arriendo/{category.slug}`

### Responsive
- **Desktop (>1024px)**: 2-column grid
- **Tablet (768-1024px)**: 2-column grid (smaller cards)
- **Mobile (<768px)**: Single column, full-width cards

### Styling
- Card background: `var(--theme-bg-elevated)`
- Image: Aspect ratio 16:9, object-fit cover, rounded top corners
- Pills: Same style as existing `/arriendo/index.astro` subcategory pills
- Hover: Subtle elevation + border color change

### Note
This component is similar to the existing category grid on `/arriendo/index.astro` but with a more visual layout (images included). The existing `/arriendo` page uses a text-only numbered list layout. This new component adds images for the homepage where visual impact matters more.

---

## 3. FeaturedEquipment

### Purpose
Carousel of 3-6 promoted equipment items with badges (e.g., "Más solicitado", "Disponible", "Nuevo").

### File
`src/components/rental/FeaturedEquipment.astro`

### Props
```typescript
interface FeaturedEquipmentProps {
  eyebrow?: string;           // Default: "Destacados"
  title?: string;             // Default: "Equipos más solicitados"
  items: FeaturedItem[];
  class?: string;
}

interface FeaturedItem {
  categorySlug: string;
  subcategorySlug: string;
  badge?: string;             // e.g., "Más solicitado", "Disponible ahora"
  highlight?: boolean;        // Larger card variant
}
```

### Data Source
A new `featuredEquipment` array in `src/data/site.ts` or a dedicated `src/data/featured.ts`. References existing equipment from `rental.ts` by slug.

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Eyebrow: "Destacados"                                   │
│  Title: "Equipos más solicitados"                        │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  → scroll    │
│  │  [badge]  │  │  [badge]  │  │  [badge]  │             │
│  │  Image    │  │  Image    │  │  Image    │             │
│  │  Name     │  │  Name     │  │  Name     │             │
│  │  Capacity │  │  Capacity │  │  Capacity │             │
│  │  Cotizar  │  │  Cotizar  │  │  Cotizar  │             │
│  └──────────┘  └──────────┘  └──────────┘               │
└─────────────────────────────────────────────────────────┘
```

### Behavior
- **Desktop**: 3 cards visible, horizontal scroll for more
- **Mobile**: 1.5 cards visible (peek next), horizontal scroll
- **Each card**: Reuses `EquipmentCard` component from `src/components/rental/`
- **Badge**: Absolute-positioned pill on top-right of card image
- **"Cotizar" button**: Links to `/cotizador` with pre-selected equipment (via URL params or query string)

### Styling
- Horizontal scroll with `scroll-snap-type: x mandatory`
- Smooth snap to each card
- Scroll indicators (dots or arrows) optional for v1

---

## 4. ServicesCompact

### Purpose
Compact, single-row section that acknowledges the company also offers engineering/construction services without competing with the rental focus.

### File
`src/components/ui/ServicesCompact.astro`

### Props
```typescript
interface ServicesCompactProps {
  eyebrow?: string;           // Default: "También hacemos"
  title?: string;             // Default: "Ingeniería, construcción y montajes"
  services: CompactService[];
  class?: string;
}

interface CompactService {
  name: string;
  icon: string;               // Icon name from icons.ts
  url: string;
  shortDesc: string;          // 1 line max
}
```

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Eyebrow: "También hacemos"                              │
│  Title: "Ingeniería, construcción y montajes"            │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  [icon]   │ │  [icon]   │ │  [icon]   │ │  [icon]   │   │
│  │  Name     │ │  Name     │ │  Name     │ │  Name     │   │
│  │  1 line   │ │  1 line   │ │  1 line   │ │  1 line   │   │
│  │  →        │ │  →        │ │  →        │ │  →        │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Services Data
```typescript
const compactServices = [
  { name: 'Ingeniería', icon: 'blueprint', url: '/servicios/ingenieria', shortDesc: 'Diseño y gestión de proyectos' },
  { name: 'Construcción', icon: 'building', url: '/servicios/construccion', shortDesc: 'Obras civiles e industriales' },
  { name: 'Montajes', icon: 'wrench', url: '/servicios/montajes', shortDesc: 'Electromecánico y estructural' },
  { name: 'Infraestructura portuaria', icon: 'anchor', url: '/servicios/infraestructura-portuaria', shortDesc: 'Obras marítimas y muelles' },
];
```

### Responsive
- **Desktop**: 4 columns in a row
- **Tablet**: 2x2 grid
- **Mobile**: Single column stack

### Styling
- Minimal, link-card style
- No images — icon + text only
- Subtle border, hover elevation
- Dark background variant

---

## Component Dependency Graph

```
index.astro (homepage)
├── HeroMedia (existing) — hero background
├── EquipmentSearch (NEW) — search bar in hero
├── CategoryShowcase (NEW) — main catalog grid
├── FeaturedEquipment (NEW) — promoted equipment
│   └── EquipmentCard (existing) — individual cards
├── StatsCounter (existing) — rental stats
├── LogoCarousel (existing) — client logos
├── ServicesCompact (NEW) — compact services links
├── CTABand (existing) — conversion CTA
└── NewsGrid (existing) — blog articles
```

---

## Reusable Existing Components (No Changes Needed)

| Component | Used In | Notes |
|-----------|---------|-------|
| `HeroMedia` | §1 Hero | May swap video for image, but component supports both |
| `StatsCounter` | §4 Stats | Just update stat values |
| `LogoCarousel` | §5 Logos | No changes |
| `CTABand` | §7 CTA | Just update text props |
| `NewsGrid` | §8 News | No changes |
| `Button` | Various | No changes |
| `Icon` | Various | May need new icons: `search`, `blueprint`, `building`, `anchor` |
| `EquipmentCard` | §3 Featured | Reused inside FeaturedEquipment |
