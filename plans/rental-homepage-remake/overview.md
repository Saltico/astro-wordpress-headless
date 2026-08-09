---
feature: Rental-First Homepage Remake
effort: High
dependencies: [rental-catalog, quote-cart, site-data]
status: Planned
reference: https://www.skrental.com/tiendaonline/webapp/home
---

# Rental-First Homepage Remake

## Executive Summary

The current homepage of IP Proyectos Industriales is a **corporate B2B site** that leads with services (engineering, construction, assembly, port infrastructure) and treats equipment rental as one of five equal service lines. The goal is to **restructure the homepage and navigation to make equipment rental the primary focus**, inspired by the SK Rental homepage model where the catalog of available equipment is the central CTA.

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
1. Hero → Rental-focused messaging + equipment search bar
2. Equipment categories grid → All categories with subcategories as pills (SK Rental model)
3. Featured/promoted equipment → Highlighted deals or availability
4. Stats counter → Rental-specific stats (tons, equipment count, availability)
5. Trust signals → Client logos (condensed)
6. Services summary → Compact mention of engineering/construction capabilities
7. CTA band → Direct to cotizador
8. News grid → Blog articles
```

---

## Gap Analysis: Current vs. Target

| Aspect | Current | Target (SK Rental Model) | Gap |
|--------|---------|--------------------------|-----|
| **Hero** | Corporate video, generic tagline | Rental-focused, equipment imagery, search bar | Major |
| **Primary CTA** | "Conocer la empresa" / generic quote | Browse equipment / Cotizar equipo | Major |
| **Equipment visibility** | 1 of 5 bento tiles (20% weight) | Full-page category grid (100% weight) | Major |
| **Search** | None | Prominent "Encuentra tu máquina" search | New feature |
| **Categories on home** | None visible | All 4 categories + subcategories as pills | Major |
| **Navigation order** | Servicios → Arriendo → Seguridad → Compliance | Arriendo → Servicios → Seguridad → Compliance | Minor |
| **Promotions section** | None | Promoted equipment / availability highlights | New feature |
| **Services section** | Full bento grid (5 tiles) | Compact summary or link-only | Redesign |
| **Company info** | Full "Quiénes somos" section | Condensed or moved to /nosotros | Redesign |
| **Safety section** | Full split section with mini-stats | Removed from homepage (link only) | Redesign |

---

## Scope

### In Scope

1. **Homepage (`index.astro`)** — Complete restructure of sections and content order
2. **Navigation (`site.ts`)** — Reorder nav items, promote Arriendo to first position
3. **New component: Equipment search bar** — Client-side search across rental catalog
4. **New component: Category showcase grid** — SK Rental-style category cards with subcategory pills
5. **New component: Featured equipment carousel** — Promoted/highlighted equipment
6. **Footer (`site.ts`)** — Reorder columns to prioritize rental
7. **Hero section** — New rental-focused hero (image or carousel instead of corporate video)

### Out of Scope (No Changes)

- `/arriendo/*` pages — Already well-structured, no changes needed
- `/servicios/*` pages — Remain as-is, just demoted in homepage prominence
- `/cotizador` — Existing quote wizard remains functional
- `/nosotros`, `/seguridad`, `/compliance` — Unchanged
- Rental data model (`rental.ts`) — No structural changes needed
- SEO schemas — Existing Product/CollectionPage schemas remain valid
- All component internals — Reuse existing components where possible

---

## Documents in This Plan

| Document | Purpose |
|----------|---------|
| [overview.md](./overview.md) | This document — executive summary and scope |
| [homepage-sections.md](./homepage-sections.md) | Section-by-section wireframe of the new homepage |
| [navigation-changes.md](./navigation-changes.md) | Navigation, footer, and topbar restructure |
| [new-components.md](./new-components.md) | New components to build (search, category grid, featured) |
| [implementation-flow.mmd](./implementation-flow.mmd) | Mermaid implementation flow diagram |
| [effort-analysis.md](./effort-analysis.md) | Task breakdown with effort estimates |

---

## Key Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Keep corporate video as poster/fallback, not autoplay hero | Rental visitors want to see equipment, not corporate messaging |
| 2 | Reuse existing `/arriendo` category grid pattern on homepage | Proven component, consistent UX, less code |
| 3 | Client-side search only (no backend) | Static site, catalog is ~40 items, localStorage-friendly |
| 4 | Services remain accessible but condensed | Don't remove services — just change the hierarchy |
| 5 | Keep existing stats counter component | Reuse with updated rental-focused stats |
| 6 | No changes to rental data model | Existing `rental.ts` has all needed data |

---

## Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| SEO ranking loss from homepage restructure | High | Medium | Keep existing URLs, update meta tags, maintain internal linking |
| Corporate clients confused by rental focus | Medium | Low | Keep services accessible in nav, add compact services section |
| Search bar performance with large catalog | Low | Low | Catalog is ~40 items, client-side filtering is trivial |
| Hero video removal loses brand impact | Medium | Medium | Keep video on /nosotros or as optional background in carousel |
| Breaking existing quote cart flow | High | Low | No changes to /cotizador or quote components |

---

## Timeline Estimate

| Phase | Tasks | Effort | Duration |
|-------|-------|--------|----------|
| **Phase 1** | Navigation + footer reorder | Low | 0.5 day |
| **Phase 2** | New hero section | Medium | 1 day |
| **Phase 3** | Category showcase grid component | Medium | 1-2 days |
| **Phase 4** | Equipment search bar | Medium | 1 day |
| **Phase 5** | Featured equipment section | Medium | 1 day |
| **Phase 6** | Homepage assembly + responsive QA | Medium | 1 day |
| **Phase 7** | SEO meta updates + testing | Low | 0.5 day |
| **Total** | | **Medium-High** | **~6-7 days** |

---

## Related Documents

- [SK Rental Analysis](../skrental-analysis/FINAL-REPORT.md) — Competitive reference
- [Rental Catalog Spec](../rental-catalog/) — Existing catalog implementation
- [Quote Cart Spec](../quote-cart/) — Existing quote system
- [Global Project Analysis](../global-project-analysis.md) — Overall project state
