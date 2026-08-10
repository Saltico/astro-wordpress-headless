---
feature: Homepage Sections Wireframe
effort: Medium
dependencies: [overview.md]
status: Planned
---

# New Homepage — Section-by-Section Wireframe

This document describes each section of the proposed rental-first homepage, top to bottom, with content, behavior, and component mapping.

---

## Section Map (Top to Bottom)

```
┌─────────────────────────────────────────────────┐
│  §1  HERO — Rental Focus + Search Bar           │
├─────────────────────────────────────────────────┤
│  §2  EQUIPMENT CATEGORIES GRID                  │
├─────────────────────────────────────────────────┤
│  §3  FEATURED / PROMOTED EQUIPMENT              │
├─────────────────────────────────────────────────┤
│  §4  STATS COUNTER (Rental-focused)             │
├─────────────────────────────────────────────────┤
│  §5  CLIENT LOGOS (Trust Signals)               │
├─────────────────────────────────────────────────┤
│  §6  SERVICES COMPACT                           │
├─────────────────────────────────────────────────┤
│  §7  CTA BAND — Cotizador                       │
└─────────────────────────────────────────────────┘
```

---

## §1 — Hero: Rental Focus + Search Bar

### Purpose
Immediately communicate that this is an equipment rental company and provide a direct path to browse the catalog.

### Content
| Element | Current | Proposed |
|---------|---------|----------|
| **Eyebrow** | "Desde el año 2000 junto a la Gran Minería" | "Arriendo de maquinaria pesada para minería e industria" |
| **Title (H1)** | "La pasión y el valor por un trabajo bien hecho" | "Arriendo de equipos y maquinaria para construcción y minería" |
| **Subtitle** | "Ingeniería, construcción, montajes y Rental de equipos..." | "Grúas de hasta 400 toneladas, movimiento de tierra, transporte y equipos especiales. Disponibilidad 24/7 en zona norte de Chile." |
| **Background** | Corporate services video | Equipment/faena image (or carousel of equipment in action) |
| **CTA** | None on hero | Search bar + "Ver catálogo" button |

### New Element: Search Bar
- **Position**: Below subtitle, inside hero content area
- **Placeholder**: "Encuentra tu máquina... (ej: grúa 100 toneladas)"
- **Behavior**: Client-side fuzzy search across all equipment names, categories, and subcategories from `rental.ts`
- **Results**: Dropdown with matching equipment items, each linking to its subcategory page
- **Fallback**: If no results, show "Ver todos los equipos →" link to `/arriendo`

### Component Mapping
- **Background**: Reuse `HeroMedia` (with image instead of video, or keep video as optional)
- **Search bar**: New component `EquipmentSearch.astro` (see [new-components.md](./new-components.md))
- **CTA button**: Reuse `Button` component

### Visual Reference (SK Rental)
SK Rental uses a hero carousel with promotional banners + a prominent search bar below the nav. We adapt this with a single hero image (simpler, better performance) and an integrated search bar.

---

## §2 — Equipment Categories Grid

### Purpose
Show all rental categories at a glance with subcategory pills for quick navigation. This is the **core CTA section** of the homepage — the rental equivalent of SK Rental's homepage grid.

### Content
Renders all 4 categories from `RENTAL_CATEGORIES` in `rental.ts`:

| Category | Subcategories |
|----------|---------------|
| **Izaje** | Grúas 60t, 80t, 100t, 250t, Camión pluma, Alza hombre, Grúa horquilla |
| **Movimiento de tierra** | Camiones tolva, Retroexcavadoras, Minicargadores |
| **Transporte** | Tracto camiones, Cama baja, Semiremolques |
| **Equipos especiales** | Torres iluminación, Bombas hormigón, Compresores, Generadores, Termofusionadoras, Rodillos, Placas, Alisadora, Vibropisón, Mezcladoras, Canastillos |

### Layout
- **Desktop**: 2-column grid of category cards
- **Mobile**: Single column stack
- Each card shows:
  - Category image (from existing hero images in `rental.ts`)
  - Category name (H2)
  - Short description
  - Subcategory pills (clickable, linking to `/arriendo/{category}/{subcategory}`)
  - "Ver categoría →" link to `/arriendo/{category}`

### Component Mapping
- **New component**: `CategoryShowcase.astro` (see [new-components.md](./new-components.md))
- Reuses the same data structure as the existing `/arriendo/index.astro` category grid but with a more visual, card-based layout (image + pills)

### Visual Reference (SK Rental)
SK Rental shows each category as a card with:
- Category image (350x350)
- Category name as heading
- Subcategory list as links below
- "Ver categoría" link

We follow this pattern but adapt to our design system (dark theme, Tailwind v4).

---

## §3 — Featured / Promoted Equipment

### Purpose
Highlight specific equipment models or categories that are promotional, newly available, or high-demand. Drives direct engagement with the quote system.

### Content
A horizontally scrollable carousel of 3-6 equipment cards, each showing:
- Equipment image
- Name + capacity
- "Cotizar" button (adds to quote cart or links to `/cotizador`)

### Data Source
New optional field in `rental.ts` or a separate `featuredEquipment` array in `site.ts`:
```typescript
export const featuredEquipment = [
  // References to existing equipment slugs from rental.ts
  { categorySlug: 'izaje', subcategorySlug: 'gruas-100-toneladas', badge: 'Más solicitado' },
  { categorySlug: 'movimiento-de-tierra', subcategorySlug: 'camiones-tolva', badge: 'Disponible' },
  // ...
];
```

### Component Mapping
- **New component**: `FeaturedEquipment.astro` (see [new-components.md](./new-components.md))
- Reuses `EquipmentCard` from `src/components/rental/` for individual cards

### Visual Reference (SK Rental)
SK Rental has "PROMOCIONES" and "DISPONIBILIDAD INMEDIATA" as the first two category blocks. We adapt this as a curated carousel section with badges.

---

## §4 — Stats Counter (Rental-Focused)

### Purpose
Reinforce rental credibility with specific numbers.

### Content (Updated)
| Stat | Current (Homepage) | Proposed |
|------|-------------------|----------|
| 1 | +25 Años de experiencia | +25 Años de experiencia |
| 2 | +100 Equipos propios | +100 Equipos propios |
| 3 | 400 Tons Capacidad de izaje | 400 Tons Capacidad máxima |
| 4 | 5 Líneas de servicio | 24/7 Disponibilidad |

### Component Mapping
- **Reuse**: `StatsCounter.astro` with updated stat items
- **Variant**: `dark`, `horizontal`, 4 columns (same as current)

---

## §5 — Client Logos (Trust Signals)

### Purpose
Social proof — show that major mining companies trust IP Proyectos Industriales.

### Content
Same client logos as current homepage (Barrick, CMP, Aura Minerals, etc.)

### Changes from Current
- **Eyebrow**: "Confían en nosotros" (keep)
- **Title**: Simplified to "Empresas que confían en nuestra flota"
- **Subtitle**: Removed or shortened (the section should be compact)

### Component Mapping
- **Reuse**: `LogoCarousel.astro` — no changes needed
- **Position**: Moved from §4 to §5 (after categories, not before)

---

## §6 — Services Compact

### Purpose
Acknowledge that IP Proyectos Industriales also offers engineering/construction services, without competing with the rental focus. Provides a quick bridge to the corporate site for visitors interested in those services.

### Content
A compact, single-row section with:
- **Eyebrow**: "También hacemos"
- **Title**: "Ingeniería, construcción y montajes industriales"
- **Layout**: Horizontal row of 4 compact service links (icon + name + arrow)
- No images, no descriptions — just quick links to `/servicios/*`

### Component Mapping
- **New component**: `ServicesCompact.astro` (see [new-components.md](./new-components.md))
- Alternatively, could be a simple `<section>` with inline markup in `index.astro`

### What's Removed from Current Homepage
- Full `ServicesGrid` bento layout (5 tiles with images)
- "Quiénes somos" `SplitSection` (moved to `/nosotros` only)
- HSEC/Safety `SplitSection` with mini-stats (moved to `/seguridad` only)

These sections are **not deleted** — they remain on their respective pages. They're just removed from the homepage to make room for rental content.

---

## §7 — CTA Band

### Purpose
Final conversion push — direct visitors to the quote system.

### Content
| Element | Current | Proposed |
|---------|---------|----------|
| **Eyebrow** | "Cotización rápida" | "Cotiza tu equipo ahora" |
| **Title** | "Tu próximo proyecto empieza con una conversación" | "¿Necesitas arrendar maquinaria? Cotiza en minutos" |
| **Buttons** | "Ir al cotizador" + "WhatsApp" | Same (keep both) |
| **Background** | Edificio corporativo | Equipment/faena image |

### Component Mapping
- **Reuse**: `CTABand.astro` with updated props
- **Background image**: Swap to a rental/equipment-focused image

---

## Section Comparison: Before vs. After

| # | Current Section | Proposed Section | Action |
|---|----------------|-----------------|--------|
| 1 | Hero (corporate video) | Hero (rental + search) | **Replace** |
| 2 | Stats counter | Equipment categories grid | **Replace** |
| 3 | Quiénes somos (SplitSection) | Featured equipment | **Replace** |
| 4 | Client logos | Stats counter (rental) | **Move + Update** |
| 5 | Services bento grid | Client logos | **Move** |
| 6 | HSEC/Safety (SplitSection) | Services compact | **Replace** |
| 7 | CTA band | CTA band (rental-focused) | **Update** |
| 8 | News grid | *(removed)* | **Remove** |

### Sections Removed from Homepage (Still Exist on Their Pages)
- "Quiénes somos" SplitSection → `/nosotros`
- HSEC/Safety SplitSection → `/seguridad`
- Full Services bento grid → `/servicios`
- News grid → `/noticias` (page remains, just not on homepage)

---

## Responsive Behavior

| Breakpoint | Categories Grid | Search Bar | Featured Carousel |
|------------|----------------|------------|-------------------|
| **Mobile (<768px)** | 1 column | Full width, below title | Horizontal scroll |
| **Tablet (768-1024px)** | 2 columns | Full width | Horizontal scroll |
| **Desktop (>1024px)** | 2 columns | Max 500px width | Grid (3 visible) |
