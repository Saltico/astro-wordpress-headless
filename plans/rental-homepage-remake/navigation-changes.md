---
feature: Navigation and Site Structure Changes
effort: Low
dependencies: [overview.md]
status: Planned
---

# Navigation, Footer & Site Structure Changes

This document details all changes to the navigation, footer, topbar, and overall site hierarchy to support the rental-first strategy.

---

## 1. Main Navigation (`navigationData` in `site.ts`)

### Current Order
```
1. Servicios (dropdown: Ingeniería, Construcción, Montajes, Infraestructura portuaria)
2. Arriendo (dropdown: Izaje, Movimiento de tierra, Transporte, Equipos especiales)
3. Seguridad
4. Compliance
```

### Proposed Order
```
1. Arriendo (dropdown: Izaje, Movimiento de tierra, Transporte, Equipos especiales)
2. Servicios (dropdown: Ingeniería, Construcción, Montajes, Infraestructura portuaria)
3. Seguridad
4. Compliance
```

### Change
- **Swap positions** of Arriendo and Servicios
- **No changes** to dropdown children or URLs
- **Rationale**: The first nav item receives the most clicks. Rental should be the primary entry point.

### Code Change (site.ts, line ~61)
```typescript
export const navigationData: NavItem[] = [
  {
    label: 'Arriendo',        // ← Moved to position 1
    url: '/arriendo',
    children: [
      { label: 'Izaje', url: '/arriendo/izaje' },
      { label: 'Movimiento de tierra', url: '/arriendo/movimiento-de-tierra' },
      { label: 'Transporte', url: '/arriendo/transporte' },
      { label: 'Equipos especiales', url: '/arriendo/equipos-especiales' },
    ],
  },
  {
    label: 'Servicios',       // ← Moved to position 2
    url: '/servicios',
    children: [
      { label: 'Ingeniería', url: '/servicios/ingenieria' },
      { label: 'Construcción', url: '/servicios/construccion' },
      { label: 'Montajes', url: '/servicios/montajes' },
      { label: 'Infraestructura portuaria', url: '/servicios/infraestructura-portuaria' },
    ],
  },
  { label: 'Seguridad', url: '/seguridad' },
  { label: 'Compliance', url: '/compliance' },
];
```

---

## 2. Footer Columns (`footerData` in `site.ts`)

### Current Order
```
Column 1: Servicios (5 links including "Arriendo de equipos")
Column 2: Arriendo de equipos (5 links)
Column 3: Empresa (4 links)
```

### Proposed Order
```
Column 1: Arriendo de equipos (5 links) ← Moved to first position
Column 2: Servicios (4 links, remove "Arriendo de equipos" from here)
Column 3: Empresa (4 links) ← No change
```

### Change
- **Swap** Column 1 and Column 2
- **Remove** "Arriendo de equipos" link from the Servicios column (it was duplicated)
- **Rationale**: Footer column order should mirror navigation priority

### Code Change (site.ts, line ~98)
```typescript
columns: [
  {
    title: 'Arriendo de equipos',    // ← Now first column
    links: [
      { label: 'Catálogo completo', url: '/arriendo' },
      { label: 'Izaje', url: '/arriendo/izaje' },
      { label: 'Movimiento de tierra', url: '/arriendo/movimiento-de-tierra' },
      { label: 'Transporte', url: '/arriendo/transporte' },
      { label: 'Equipos especiales', url: '/arriendo/equipos-especiales' },
    ],
  },
  {
    title: 'Servicios',               // ← Now second column
    links: [
      { label: 'Ingeniería', url: '/servicios/ingenieria' },
      { label: 'Construcción', url: '/servicios/construccion' },
      { label: 'Montajes', url: '/servicios/montajes' },
      { label: 'Infraestructura portuaria', url: '/servicios/infraestructura-portuaria' },
    ],
  },
  {
    title: 'Empresa',                 // ← Unchanged
    links: [
      { label: 'Nuestra empresa', url: '/nosotros' },
      { label: 'Seguridad y medio ambiente', url: '/seguridad' },
      { label: 'Compliance', url: '/compliance' },
      { label: 'Canal de denuncias', url: '/canal-integridad' },
    ],
  },
],
```

---

## 3. TopBar (`topbarData` in `site.ts`)

### Current
```
Links: [Canal de Integridad, Noticias]
```

### Proposed
```
Links: [Canal de Integridad, Noticias, Cotizador]
```

### Change
- **Add** "Cotizador" link to topbar for quick access to the quote system
- **Rationale**: SK Rental has a prominent "Cotizador" access point. Adding it to the topbar gives it persistent visibility.

---

## 4. Header CTA Button

### Current
The header includes a `QuoteCartBadge` (cart icon with item count) but no explicit CTA button.

### Proposed
Add a "Cotizar" button in the header (desktop only) that links to `/cotizador`.

### Component Change
- In `BaseLayout.astro` or `Header.astro`, add a `Button` component with `variant="primary"` and `size="sm"` linking to `/cotizador`
- Hide on mobile (hamburger menu already has navigation links)

---

## 5. Site Tagline (`siteBrand` in `site.ts`)

### Current
```typescript
tagline: 'La pasión y el valor por un trabajo bien hecho.',
description: 'Especialistas en obras civiles, montaje industrial y arriendo de maquinaria de alto tonelaje para la gran minería.',
```

### Proposed
```typescript
tagline: 'Arriendo de maquinaria pesada para la minería.',
description: 'Arriendo de grúas, movimiento de tierra, transporte y equipos especiales para la gran minería. También ingeniería, construcción y montajes industriales.',
```

### Change
- **Tagline**: Rental-first messaging
- **Description**: Rental mentioned first, services as secondary

---

## 6. Breadcrumb Structure

### Current (on /arriendo pages)
```
Empresa > Arriendo de Equipos
```

### Proposed
```
Inicio > Arriendo de Equipos
```

### Change
- Replace "Empresa" with "Inicio" as the root breadcrumb label
- **Rationale**: "Empresa" implies a corporate site. "Inicio" is neutral and standard.

---

## Summary of All Changes

| File | What Changes | Effort |
|------|-------------|--------|
| `src/data/site.ts` | Nav order, footer order, topbar links, brand tagline | Low |
| `src/layouts/BaseLayout.astro` | Add header CTA button | Low |
| `src/components/layout/Header.astro` | Accept and render CTA button slot | Low |
| `src/pages/arriendo/**/*.astro` | Breadcrumb label "Empresa" → "Inicio" | Low |
