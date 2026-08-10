---
feature: Rental-First Homepage — Design Brief
mode: Persuade
visitor: Jefe de faena / supervisor de operaciones
status: Refined
date: 2026-08-09
---

# Design Brief — Rental-First Homepage Remake

## 1. Job and Audience

**Who arrives:**
- **Primary**: Jefe de faena / supervisor de operaciones que **ya sabe qué equipo necesita** y quiere cotizar rápido (estado: prisa, tarea concreta)
- **Secondary**: Prospecto nuevo que llegó por SEO buscando "arriendo grúa minería Chile" o "arriendo camión tolva Antofagasta" (estado: exploración, evaluación)

**Context:**
- Esta web es **100% rental**. La web corporativa (www.ipproyectosindustriales.cl) existe aparte para servicios de ingeniería/construcción.
- El visitante llega desde Google, redes sociales, o link directo. No tiene tiempo para scroll largo ni narrativa corporativa.
- Necesita: encontrar su equipo → cotizar → cerrar trato por WhatsApp/email.

**Visitor mode:** **Persuade** — el visitante decide y actúa. El homepage es la vitrina de una tienda de rental, no una landing corporativa.

---

## 2. Outcome and Proof

**Primary action:** Cotizar equipos vía `/cotizador` (wizard de 3 pasos que envía WhatsApp/email).

**Success looks like:**
- Visitante encuentra su equipo en <10 segundos (vía search o navegación por categorías)
- Agrega equipos al cotizador sin fricción
- Envía cotización por WhatsApp/email

**Product-specific truth:**
- Flota propia de 100+ equipos (grúas hasta 400 tons, camiones, movimiento de tierra, equipos especiales)
- Disponibilidad 24/7 en zona norte de Chile (Atacama, Coquimbo, Antofagasta)
- 15+ años de experiencia en minería
- Cotización rápida sin precios públicos (modelo B2B)

---

## 3. Selected Direction

**Visual authority:** El sistema visual incumbente se **preserva y expande**:
- Tema oscuro industrial (graphite #0d1611)
- Acento verde (#1a9c4a)
- Tipografía: Archivo (headings) + Inter (body)
- Cards con border-radius 16px, hover elevation, border verde en hover
- Componentes existentes (EquipmentCard, StatsCounter, LogoCarousel, CTABand) se reutilizan

**Structural thesis:** El homepage se convierte en un **catálogo navegable con search-first**, no en una landing corporativa. La jerarquía visual prioriza:
1. **Search bar** (puerta de entrada al catálogo)
2. **Categorías visuales** (navegación rápida)
3. **Featured equipment** (curación comercial)
4. **Trust signals** (stats + logos + cobertura geográfica)

**Sequence (top to bottom):**

| # | Section | Purpose | Component |
|---|---------|---------|-----------|
| 1 | **Hero + Search** | Rental messaging + search bar + geographic subtitle | HeroMedia + EquipmentSearch (new) |
| 2 | **Category Showcase** | 4 categorías con imágenes + subcategorías como pills | CategoryShowcase (new) |
| 3 | **Featured Equipment** | 3-6 equipos curados manualmente | FeaturedEquipment (new) |
| 4 | **Stats Counter** | Credibilidad: 400 tons, 100+ equipos, 24/7, 15+ años | StatsCounter (existing) |
| 5 | **Coverage Map** | Zonas de cobertura en norte de Chile (SEO geo) | CoverageSection (new) |
| 6 | **Client Logos** | Trust signals compacto | LogoCarousel (existing) |
| 7 | **Services Compact** | Links rápidos a servicios (guía a web corporativa) | ServicesCompact (new) |
| 8 | **CTA Band** | "Cotiza tu equipo ahora" | CTABand (existing) |

**Focal moment:** El **search bar en el hero** — es la puerta de entrada al catálogo. El jefe de faena que sabe lo que busca lo usa inmediatamente.

**Implementation consequence:**
- 5 componentes nuevos (EquipmentSearch, CategoryShowcase, FeaturedEquipment, CoverageSection, ServicesCompact)
- Homepage assembly: reemplazar secciones corporativas (SplitSection, ServicesGrid bento, NewsGrid) con secciones rental
- Navigation reorder: Arriendo primero, Servicios segundo (link interno a /servicios)
- Footer reorder: Arriendo primero
- Servicios: página interna compacta (/servicios) que presenta rápidamente los 4 servicios y guía a la web corporativa

---

## 4. Scope and Boundaries

**Fidelity:** Production-ready homepage con todos los componentes funcionales.

**Breadth:** Homepage + navigation + footer + 4 nuevos componentes. **No incluye** cambios a:
- `/arriendo/*` subcategory pages (ya bien estructuradas)
- `/cotizador` (intocable)
- `/servicios/*` (link-out a web corporativa)
- `/nosotros`, `/seguridad`, `/compliance` (sin cambios)

**Interactivity:**
- Search bar: client-side fuzzy search (equipos + categorías + subcategorías)
- Featured carousel: horizontal scroll con scroll-snap
- Category cards: hover elevation + pill navigation
- Todo responsive (mobile-first)

**What remains untouched:**
- Paleta de colores (#1a9c4a verde, graphite oscuro)
- Logo
- Cotizador (/cotizador) y sus componentes
- Rental data model (rental.ts)
- Componentes existentes (EquipmentCard, StatsCounter, LogoCarousel, CTABand, NewsGrid)

**Anti-goals:**
- No es una landing corporativa (no "Quiénes somos", no "HSEC/Safety" en homepage)
- No es un e-commerce con precios (modelo B2B, cotización por WhatsApp/email)
- No es multi-país (solo Chile, zona norte)

---

## 5. States and Ranges

**Content ranges:**
- **Equipment catalog**: ~40 equipos en 22 subcategorías, 4 categorías
- **Featured equipment**: 3-6 equipos curados manualmente (hardcoded en site.ts)
- **Client logos**: 12 logos (Barrick, CMP, Aura Minerals, etc.)
- **Coverage zones**: 3-5 zonas (Atacama, Coquimbo, Antofagasta, + ciudades)
- **Services**: 4 servicios (Ingeniería, Construcción, Montajes, Infraestructura portuaria)

**Material states:**
- **Search**: empty → typing → results (up to 8) → no results → fallback "Ver catálogo completo"
- **Featured carousel**: 3-6 cards, horizontal scroll, scroll-snap
- **Category cards**: 4 cards en 2x2 grid (desktop), 1-column stack (mobile)
- **Coverage section**: Lista de zonas con keywords SEO

---

## 6. Interaction and Layout

**Hero:**
- Background: Imagen estática de equipo en faena (src/assets/imgs/hero/arriendo/arriendo.avif)
- Overlay: Gradiente oscuro (rgba(13,22,17,0.5) → rgba(13,22,17,0.96))
- Content: Eyebrow + H1 + subtitle con zonas geográficas + search bar + CTA button
- Search bar: Input con icono de búsqueda, placeholder "Encuentra tu máquina... (ej: grúa 100 toneladas)"
- Search results: Dropdown con hasta 8 resultados, cada uno muestra nombre + capacidad + categoría, link a subcategoría

**Category Showcase:**
- Layout: 2-column grid (desktop), 1-column stack (mobile)
- Each card: Imagen de categoría (16:9 aspect ratio) + título + descripción + subcategorías como pills + "Ver categoría →" link
- Pills: Clickable, link a `/arriendo/{category}/{subcategory}`
- Hover: Elevación sutil + border verde

**Featured Equipment:**
- Layout: Horizontal scroll con scroll-snap (3 cards visibles en desktop, 1.5 en mobile)
- Each card: Reutiliza EquipmentCard component + badge "Destacado"
- Badge: Absolute-positioned pill en top-right de imagen
- "Cotizar" button: Link a `/cotizador` (o agrega al cart directamente)

**Coverage Section:**
- Layout: Single-row con título + lista de zonas
- Content: "Cobertura en el norte de Chile" + lista de ciudades/zonas (Atacama, Coquimbo, Antofagasta, Calama, Copiapó, La Serena, etc.)
- Purpose: SEO keywords + información de disponibilidad

**Responsive behavior:**
- Mobile (<768px): Hero full-width, search bar full-width, categories 1-column, featured 1.5 cards visible
- Tablet (768-1024px): Categories 2-column, featured 2 cards visible
- Desktop (>1024px): Categories 2-column, featured 3 cards visible, search bar max 500px

---

## 7. Constraints and Open Decisions

**Platform:** Astro 7 (static output), Tailwind CSS v4 (Vite plugin), TypeScript.

**Delivery:** Static site deployed to Hostinger. No SSR, no backend search.

**Accessibility:**
- Search bar: `role="combobox"`, `aria-expanded`, `aria-activedescendant`, keyboard navigation (arrow keys, Enter, Escape)
- All components: WCAG 2.2 AA compliance (contrast, focus states, semantic HTML)
- Reduced motion: Respetar `prefers-reduced-motion`

**Localization:** Español (Chile) only. No i18n.

**Reusable components:**
- EquipmentCard (existing) — reutilizado en FeaturedEquipment
- StatsCounter (existing) — reutilizado con stats actualizados
- LogoCarousel (existing) — reutilizado sin cambios
- CTABand (existing) — reutilizado con texto actualizado
- Button (existing) — reutilizado en hero + CTAs

**Choices a builder must not invent:**
- No new color palette (use existing tokens)
- No new typography (use Archivo + Inter)
- No new border-radius values (use 16px for cards, 999px for pills)
- No new spacing scale (use existing CSS custom properties)

---

## 8. SEO Geographic Strategy

**Hero subtitle:** "Disponibilidad 24/7 en Atacama, Coquimbo y Antofagasta. Arriendo de maquinaria pesada para minería e industria en el norte de Chile."

**Coverage section:** Lista explícita de zonas con keywords:
- "Arriendo de grúas y equipos en **Atacama** (Copiapó, Caldera, Vallenar)"
- "Arriendo de maquinaria en **Coquimbo** (La Serena, Coquimbo, Ovalle)"
- "Arriendo de equipos pesados en **Antofagasta** (Antofagasta, Calama, Tocopilla)"

**Meta tags:** Título y descripción incluyen "norte de Chile", "Atacama", "Coquimbo", "Antofagasta".

**JSON-LD:** LocalBusiness schema con `areaServed` incluyendo las 3 regiones.

---

## 9. Services Strategy

**Navigation:** "Servicios" en segundo lugar (después de "Arriendo"), con dropdown a:
- Ingeniería → `/servicios/ingenieria` (link interno)
- Construcción → `/servicios/construccion` (link interno)
- Montajes → `/servicios/montajes` (link interno)
- Infraestructura portuaria → `/servicios/infraestructura-portuaria` (link interno)

**Homepage:** Sección ServicesCompact (§7) — fila compacta de 4 cards con icono + nombre + flecha, cada una link a `/servicios/*`.

**Servicios pages (`/servicios/*`):** Páginas internas compactas que presentan rápidamente cada servicio (1-2 párrafos + imagen + CTA) y guían a la web corporativa (www.ipproyectosindustriales.cl) para más información.

**Footer:** Columna "Servicios" con links internos a `/servicios/*`.

**Rationale:** Mantiene la arquitectura de información completa dentro del sitio rental, mejora el SEO interno, y ofrece un puente claro a la web corporativa para quien necesite más detalle sobre servicios.

---

## 10. Featured Equipment Curation

**Data source:** Nuevo array `featuredEquipment` en `src/data/site.ts`:

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
  // ... 3-6 items total, curated by commercial team
];
```

**No pricing:** El cotizador genera envío de correo/WhatsApp con lista de equipos seleccionados. No hay precios públicos en la web.

**No stock logic:** "Disponible" es un badge manual, no refleja stock real. El equipo comercial actualiza el array según disponibilidad.

---

## 11. Implementation Phases

| Phase | Tasks | Effort | Duration |
|-------|-------|--------|----------|
| **Phase 1** | Data & config (site.ts, rental.ts) | Low | 1.5 hours |
| **Phase 2** | Navigation + footer reorder | Low | 1 hour |
| **Phase 3** | New components (EquipmentSearch, CategoryShowcase, FeaturedEquipment, CoverageSection) | Medium-High | 13.5 hours |
| **Phase 4** | Homepage assembly (index.astro rewrite) | Medium | 7.5 hours |
| **Phase 5** | QA & SEO validation | Low | 3.5 hours |
| **Total** | | **Medium-High** | **~27 hours (5-7 days)** |

---

## 12. Success Metrics

**Primary:**
- Time-to-quote: Visitante agrega equipo al cotizador en <30 segundos desde homepage
- Quote completion rate: % de visitantes que inician cotizador y envían cotización

**Secondary:**
- Search usage: % de visitantes que usan el search bar
- Category navigation: % de visitantes que navegan por categorías vs. search
- Bounce rate: Reducción vs. homepage actual (esperado: -15-20%)

**SEO:**
- Ranking para keywords: "arriendo grúa minería Chile", "arriendo camión tolva Antofagasta", etc.
- Organic traffic: +30-50% en 3 meses post-launch
- Indexed pages: Mantener 130+ páginas indexadas

---

## 13. Open Questions (Resolved)

✅ **Q1: ¿Quién es el visitante primario?** → Jefe de faena con prisa + SEO prospectos
✅ **Q2: ¿Cuál es la conversión primaria?** → Cotizador online (/cotizador)
✅ **Q3: ¿Rental es el negocio principal?** → Sí, 100% rental (servicios en web aparte)
✅ **Q4: ¿Qué hace un equipo "featured"?** → Curado manualmente por equipo comercial
✅ **Q5: ¿Search busca equipos o solo categorías?** → Busca en todo (equipos + categorías + subcategorías)
✅ **Q6: ¿SEO geográfico en homepage?** → Mencionar zonas en hero subtitle + sección de cobertura
✅ **Q7: ¿Qué assets visuales hay?** → Usar existentes en src/assets/imgs/rental/
✅ **Q8: ¿Qué NO debe cambiar?** → Paleta, logo, cotizador, componentes existentes

---

## 14. Related Documents

- [overview.md](./overview.md) — Executive summary original
- [homepage-sections.md](./homepage-sections.md) — Wireframe detallado de secciones
- [navigation-changes.md](./navigation-changes.md) — Cambios a navigation + footer
- [new-components.md](./new-components.md) — Especificación de 4 componentes nuevos
- [implementation-flow.mmd](./implementation-flow.mmd) — Diagrama de implementación
- [effort-analysis.md](./effort-analysis.md) — Breakdown de tareas y esfuerzo

---

**Status:** Brief refinado listo para confirmación. Pendiente: aprobación del usuario para proceder a implementación.
