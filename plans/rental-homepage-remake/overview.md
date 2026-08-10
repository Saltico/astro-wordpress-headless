---
feature: Rental-First Homepage Remake
effort: High
dependencies: [rental-catalog, quote-cart, site-data]
status: Brief refined (awaiting confirmation)
reference: https://www.skrental.com/tiendaonline/webapp/home
discovery: Completed 2026-08-09
---

# Rental-First Homepage Remake

## Executive Summary

This website is **100% rental**. A separate corporate site (www.ipproyectosindustriales.cl) handles engineering/construction services. The current homepage incorrectly treats rental as one of five equal service lines. The goal is to **restructure the homepage into a catalog-first experience** where a mine-site supervisor can find and quote equipment in under 30 seconds.

**Primary visitor**: Jefe de faena / supervisor de operaciones — knows what they need, wants to quote fast.
**Secondary visitor**: SEO prospect searching "arriendo grúa minería Chile" or "arriendo camión tolva Antofagasta".
**Conversion**: Cotizador online → WhatsApp/email (no public pricing, B2B model).

### Current State (Services-First)

```
Homepage flow:
1. Hero video → Corporate messaging ("La pasión y el valor por un trabajo bien hecho")
2. Stats counter → 25 years, 100+ equipment, 400 tons, 5 service lines
3. Who we are → Company description
4. Client logos → Trust signals
5. Services bento grid → 4 services + 1 rental (equal weight)
6. HSEC/Safety → Safety culture
7. CTA band → Generic "cotización rápida"
8. News grid → Blog articles
```

**Problem**: A visitor looking to rent equipment must scroll past 5 sections or navigate to `/arriendo` through a dropdown. The rental catalog is buried as the 5th tile in a bento grid, competing equally with engineering and construction services.

### Target State (Rental-First)

```
Homepage flow:
1. Hero → Rental messaging + geographic subtitle + equipment search bar
2. Equipment categories grid → All 4 categories with images + subcategory pills
3. Featured equipment → 3-6 manually curated equipment cards
4. Stats counter → Rental-specific stats (tons, equipment count, 24/7)
5. Coverage section → Geographic zones in northern Chile (SEO keywords)
6. Client logos → Trust signals compacto
7. Services compact → Links rápidos a servicios (guía a web corporativa)
8. CTA band → Direct to cotizador
```

**Services**: Sección compacta en homepage con links internos a /servicios/*. Páginas internas presentan rápidamente cada servicio y guían a www.ipproyectosindustriales.cl para más información.

**News/Blog**: Eliminado del homepage. La página /noticias permanece pero no se muestra en homepage.

---

## Gap Analysis: Current vs. Target

| Aspect | Current | Target | Gap |
|--------|---------|--------|-----|
| **Hero** | Corporate video, generic tagline | Rental image, geographic subtitle, search bar | Major |
| **Primary CTA** | "Conocer la empresa" / generic quote | Search equipment / Cotizar equipo | Major |
| **Equipment visibility** | 1 of 5 bento tiles (20% weight) | Full-page category grid (100% weight) | Major |
| **Search** | None | Prominent "Encuentra tu máquina" full-text search | New feature |
| **Categories on home** | None visible | All 4 categories with images + subcategory pills | Major |
| **Navigation order** | Servicios → Arriendo → Seguridad → Compliance | Arriendo → Servicios (external) → Seguridad → Compliance | Minor |
| **Featured equipment** | None | 3-6 manually curated cards with badges | New feature |
| **Services section** | Full bento grid (5 tiles) | Removed — external links to corporate site only | Redesign |
| **Coverage/geo SEO** | None | Dedicated section + hero subtitle + meta tags | New feature |
| **Company info** | Full "Quiénes somos" section | Removed from homepage (exists on corporate site) | Redesign |
| **Safety section** | Full split section with mini-stats | Removed from homepage (link to /seguridad only) | Redesign |
| **Category hub** (/arriendo) | Text-only numbered list | Visual cards with images + engaging layout | Redesign |

---

## Scope

### In Scope

1. **Homepage (`index.astro`)** — Complete restructure of sections and content order
2. **Navigation (`site.ts`)** — Reorder nav items, promote Arriendo to first position; Servicios remains as internal links to /servicios/*
3. **New component: Equipment search bar** — Client-side fuzzy search across equipment names + categories + subcategories
4. **New component: Category showcase grid** — Visual category cards with images + subcategory pills
5. **New component: Featured equipment carousel** — 3-6 manually curated equipment cards
6. **New component: Coverage section** — Geographic zones in northern Chile (SEO keywords)
7. **New component: Services compact** — Compact row of 4 service links (icon + name + arrow)
8. **Footer (`site.ts`)** — Reorder columns to prioritize rental
9. **Hero section** — New rental-focused hero with geographic subtitle + search bar
10. **`/arriendo/index.astro` (category hub)** — Improve visual presentation: add category images, more engaging layout (currently text-only numbered list)
11. **SEO geographic strategy** — Hero subtitle, coverage section, meta tags, JSON-LD with areaServed
12. **Remove News from homepage** — NewsGrid section removed from homepage (page /noticias remains)

### Out of Scope (No Changes)

- `/arriendo/[categoria]/[subcategoria]` — Subcategory pages remain as-is
- `/cotizador` — Existing quote wizard is **untouchable**
- `/nosotros`, `/seguridad`, `/compliance` — Unchanged
- `/noticias` — Page remains but removed from homepage
- Rental data model (`rental.ts`) — No structural changes needed
- SEO schemas — Existing Product/CollectionPage schemas remain valid
- All existing component internals — Reuse as-is (EquipmentCard, StatsCounter, LogoCarousel, CTABand)
- Color palette (#1a9c4a green, graphite dark) — **Untouchable**
- Logo — **Untouchable**

---

## Documents in This Plan

| Document | Purpose |
|----------|---------|
| [**design-brief.md**](./design-brief.md) | **Refined design brief** — full direction after discovery interview |
| [overview.md](./overview.md) | This document — executive summary and scope |
| [homepage-sections.md](./homepage-sections.md) | Section-by-section wireframe of the new homepage |
| [navigation-changes.md](./navigation-changes.md) | Navigation, footer, and topbar restructure |
| [new-components.md](./new-components.md) | New components to build (search, category grid, featured, coverage) |
| [implementation-flow.mmd](./implementation-flow.mmd) | Mermaid implementation flow diagram |
| [effort-analysis.md](./effort-analysis.md) | Task breakdown with effort estimates |

---

## Key Decisions (Resolved via Discovery)

| # | Decision | Rationale | Source |
|---|----------|-----------|--------|
| 1 | **100% rental focus** — services become compact section with internal links to /servicios/* | Separate corporate site exists; this site is purely rental but maintains service visibility | User Q3 |
| 2 | **Search-first hero** — search bar as primary interaction, not video or corporate messaging | Jefe de faena knows what they need, wants to find it fast | User Q1, Q2 |
| 3 | **Full-text search** — searches equipment names + categories + subcategories | More useful for both specific and exploratory queries | User Q5 |
| 4 | **Featured = manually curated** — hardcoded array in site.ts, no stock/pricing logic | Commercial team controls which equipment to promote; no public pricing | User Q4 |
| 5 | **Geographic SEO in UI** — zones mentioned in hero subtitle + dedicated coverage section | SEO strategy for northern Chile (Atacama, Coquimbo, Antofagasta) | User Q6 |
| 6 | **Existing assets only** — use images from src/assets/imgs/rental/ and hero/ | User will update images later; no new asset production needed | User Q7 |
| 7 | **Untouchable**: palette, logo, cotizador, existing component internals | User confirmed these are sacred | User Q8 |
| 8 | **Category hub improvement** — /arriendo/index.astro gets visual upgrade (currently text-only) | User explicitly requested more engaging category presentation | User Q8 |
| 9 | **Services Compact section on homepage** — compact row of 4 service links guiding to corporate site | User confirmed this section is valuable as a bridge to corporate site | User feedback |
| 10 | **Static hero image** — use existing arriendo.avif, not video | No new video production; user will update images later | User Q7 |
| 11 | **Remove News/Blog from homepage** — /noticias page remains but not shown on homepage | User confirmed blog is unnecessary on rental-focused homepage | User feedback |

---

## Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| SEO ranking loss from homepage restructure | High | Medium | Keep existing URLs, update meta tags, maintain internal linking, add geographic keywords |
| Search bar edge cases (diacritics, partial matches, empty states) | Medium | Medium | Thorough client-side testing with real equipment names; fallback to "Ver catálogo completo" |
| Category hub (/arriendo) redesign breaks existing SEO | Medium | Low | Keep same URL structure and JSON-LD schemas; only change visual presentation |
| Featured equipment array becomes stale | Low | High | Document curation process in code comments; commercial team updates site.ts |
| Hero image quality insufficient for full-width hero | Medium | Medium | Use existing arriendo.avif as placeholder; user will replace with better images later |
| Breaking existing quote cart flow | High | Low | No changes to /cotizador or quote components — explicitly untouchable |

---

## Timeline Estimate

| Phase | Tasks | Effort | Duration |
|-------|-------|--------|----------|
| **Phase 1** | Data & config (site.ts reorder, featuredEquipment, coverage data) | Low | 0.5 day |
| **Phase 2** | Navigation + footer reorder + header CTA button | Low | 0.5 day |
| **Phase 3** | EquipmentSearch component (search + keyboard nav + a11y) | Medium-High | 1.5 days |
| **Phase 4** | CategoryShowcase component (visual grid with images + pills) | Medium | 1 day |
| **Phase 5** | FeaturedEquipment component (carousel + badges) | Medium | 1 day |
| **Phase 6** | CoverageSection component (geographic zones) | Low | 0.5 day |
| **Phase 7** | Homepage assembly (index.astro rewrite + responsive QA) | Medium | 1.5 days |
| **Phase 8** | /arriendo/index.astro visual upgrade | Medium | 1 day |
| **Phase 9** | SEO meta updates + geographic keywords + testing | Low | 0.5 day |
| **Total** | | **Medium-High** | **~7-8 days** |

---

## Related Documents

- [SK Rental Analysis](../skrental-analysis/FINAL-REPORT.md) — Competitive reference
- [Rental Catalog Spec](../rental-catalog/) — Existing catalog implementation
- [Quote Cart Spec](../quote-cart/) — Existing quote system
- [Global Project Analysis](../global-project-analysis.md) — Overall project state
