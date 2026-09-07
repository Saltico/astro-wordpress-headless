---
feature: Category Showcase Renovado (§4)
effort: Alto
dependencies: [src/data/promotions.ts, CategoryShowcase.astro]
status: Planificado
---

# Category Showcase Renovado (§4)

## Overview

Modificación del componente `CategoryShowcase` existente para:
1. **Agregar una card inicial "Promociones"** con estilo destacado y datos dinámicos
2. **Reducir el tamaño de las cards** de categorías existentes (aspect-ratio más compacto, padding reducido)
3. Mantener la estructura de pills de subcategorías pero con tamaño ajustado

## Contexto del Cambio

| Aspecto | Antes | Después |
|---------|-------|---------|
| Primera card | Izaje (primera categoría) | **Promociones** (card especial) |
| Aspect-ratio imagen | 16:9 | **16:7** (más compacto) |
| Padding content | 20px 22px 22px | **16px 18px 18px** |
| Título card | 1.4rem | **1.2rem** |
| Descripción | Visible completa | **Line-clamp: 2** |
| Grid | 2 columnas | 2 columnas (mantener) |

## Requisitos Funcionales

### Card "Promociones"

1. **Primera posición** en el grid (antes de las categorías de rental)
2. **Estilo visual diferenciado**: borde verde de marca, gradiente sutil de fondo
3. **Contenido dinámico**: toma datos de `src/data/promotions.ts` (entry point genérico)
4. **Pills de categorías**: muestra las 3 categorías principales (Izaje, Mov. Tierra, Transporte)
5. **CTA temporal**: enlaza al hub `/arriendo` por ahora. La card es informativa — muestra las promos disponibles pero sin página dedicada. Cuando se active el CPT en WordPress, se creará la página `/arriendo/promociones` como subcategoría dentro de arriendo y se actualizará el enlace.
6. **Badge visual**: pequeño tag "PROMO" en la esquina superior izquierda de la imagen
7. **Sin eyebrow**: el título "Promociones" es suficiente, no necesita un eyebrow adicional. El badge "PROMO" ya comunica urgencia comercial.

> **Decisión tomada**: Solo badge "PROMO" en la imagen, sin eyebrow sobre el título. El título "Promociones" es directo y claro. Menos elementos visuales = más limpio.

### Cards de Categoría (compactas)

1. **Aspect-ratio reducido**: de 16:9 a 16:7 (imagen más baja)
2. **Padding content reducido**: de `20px 22px 22px` a `16px 18px 18px`
3. **Título más pequeño**: de `1.4rem` a `1.2rem`
4. **Descripción truncada**: `-webkit-line-clamp: 2` para mantener uniformidad
5. **Pills**: padding reducido de `6px 14px` a `5px 12px`, font-size `0.82rem`
6. **Gap interno**: de `12px` a `10px`
7. **Hover**: mantener el `translateY(-4px)` y escala de imagen

## Modelo de Datos para Promociones

```typescript
// src/data/promotions.ts (extensión)

// ═══ BANNER SLIDES (para PromoBanner §1) ═══
// Exportado como promoSlides — ver banner-promocional.md

// ═══ CARD PROMOCIONES (para CategoryShowcase §4) ═══
// Entry point genérico al catálogo. No lista promos específicas por ahora.
// Cuando se active el CPT en WordPress, se poblará con datos reales.

export interface PromoCategory {
  title: string;
  description: string;
  heroImage: string;
  imageAlt: string;
  url: string;
  badge: string;
  pills: PromoCategoryPill[];
}

export interface PromoCategoryPill {
  label: string;
  url: string;
}

export const promoCategory: PromoCategory = {
  title: 'Promociones',
  description: 'Descubre nuestras ofertas en toda la flota de arriendo para minería e industria',
  heroImage: '/assets/imgs/hero/arriendo/arriendo.avif',
  imageAlt: 'Flota de maquinaria pesada en arriendo',
  url: '/arriendo',
  badge: 'PROMO',
  pills: [
    { label: 'Izaje', url: '/arriendo/izaje' },
    { label: 'Movimiento de tierra', url: '/arriendo/movimiento-de-tierra' },
    { label: 'Transporte', url: '/arriendo/transporte' },
  ],
};
```

> **Decisión tomada**: La card es un entry point genérico al catálogo. Los pills enlazan a categorías principales, no a equipos con descuento específicos. Cuando se active el CPT en WordPress, se poblará con datos reales de promociones vigentes.

## Modificaciones CSS en CategoryShowcase.astro

### Card de Promociones (nueva)

```css
.category-card--promo {
  position: relative;
  border-color: var(--color-brand, #308f40);
  background: linear-gradient(
    135deg,
    rgba(48, 143, 64, 0.04) 0%,
    var(--theme-bg-elevated) 50%
  );
}

.category-card--promo .category-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  padding: 4px 12px;
  background-color: var(--color-brand, #308f40);
  color: var(--color-on-brand, #fff);
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 999px;
}
```

### Cards Compactas (modificación)

```css
/* Antes */
.category-card__image-wrapper {
  aspect-ratio: 16 / 9;
}

/* Después */
.category-card__image-wrapper {
  aspect-ratio: 16 / 7;
}

/* Antes */
.category-card__content {
  padding: 20px 22px 22px;
  gap: 12px;
}

/* Después */
.category-card__content {
  padding: 16px 18px 18px;
  gap: 10px;
}

/* Antes */
.category-card__title {
  font-size: 1.4rem;
}

/* Después */
.category-card__title {
  font-size: 1.2rem;
}

/* Antes */
.category-card__desc {
  /* sin clamp */
}

/* Después */
.category-card__desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Pills: tamaño reducido */
.category-card__pill {
  padding: 5px 12px;
  font-size: 0.82rem;
}
```

## Integración en CategoryShowcase.astro

```diff
  <div class="category-showcase__grid">
+   <!-- Card Promociones (primera) -->
+   <article class="category-card category-card--promo">
+     <span class="category-card__badge">{promoCategory.badge}</span>
+     <div class="category-card__image-wrapper">
+       <img src={promoCategory.heroImage} alt={promoCategory.imageAlt} ... />
+     </div>
+     <div class="category-card__content">
+       <h3>{promoCategory.title}</h3>
+       <p>{promoCategory.description}</p>
+       <div class="category-card__pills">
+         {promoCategory.promotions.slice(0, 3).map(...)}
+       </div>
+       <a href={promoCategory.url}>Ver promociones →</a>
+     </div>
+   </article>
+
    <!-- Categorías existentes (compactas) -->
    {RENTAL_CATEGORIES.map((category) => (
      <article class="category-card">...</article>
    ))}
  </div>
```

## Layout: Promociones como Banner Full-Width + Grid 2×2

La card de Promociones **NO** es un item del grid de categorías. Se convierte en una **franja horizontal full-width** (hero-mini) ubicada **antes** del grid 2×2 de categorías.

```
┌───────────────────────────────────────┐
│   🎯 PROMOCIONES (full-width banner)  │
│   Imagen izq + texto der + pills + CTA│
├──────────────┬────────────────────────┤
│    Izaje     │    Mov. de Tierra      │
├──────────────┼────────────────────────┤
│  Transporte  │    Equipos Especiales   │
└──────────────┴────────────────────────┘
```

### Estructura HTML del Banner de Promociones

```html
<!-- Banner Promociones (full-width, fuera del grid) -->
<article class="promo-banner-card">
  <div class="promo-banner-card__image">
    <img src="..." alt="..." />
    <span class="promo-banner-card__badge">PROMO</span>
  </div>
  <div class="promo-banner-card__content">
    <h3>Promociones</h3>
    <p>Ofertas especiales en arriendo de equipos...</p>
    <div class="promo-banner-card__pills">
      <!-- 3 subcategorías en promo -->
    </div>
    <a href="/arriendo/promociones" class="promo-banner-card__cta">
      Ver promociones →
    </a>
  </div>
</article>

<!-- Grid 2×2 de categorías (sin cambios en estructura) -->
<div class="category-showcase__grid">
  {RENTAL_CATEGORIES.map(...)}
</div>
```

### CSS del Banner de Promociones

```css
.promo-banner-card {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 0;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(48, 143, 64, 0.06) 0%,
    var(--theme-bg-elevated) 60%
  );
  border: 1px solid var(--color-brand, #308f40);
  margin-bottom: 24px;
}

.promo-banner-card__image {
  aspect-ratio: 16 / 9;
  position: relative;
}

.promo-banner-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  background-color: var(--color-brand, #308f40);
  color: white;
  font-weight: 800;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 999px;
}

@media (max-width: 768px) {
  .promo-banner-card {
    grid-template-columns: 1fr;
  }
}
```

> **Decisión tomada**: Promociones como banner full-width independiente, grid de categorías mantiene 2×2 limpio.

## Testing Strategy

- [ ] Verificar card "Promociones" en primera posición con badge visible
- [ ] Confirmar que las cards compactas se ven bien con textos largos y cortos
- [ ] Validar truncamiento de descripción a 2 líneas
- [ ] Testear hover effects en todas las cards
- [ ] Verificar grid en desktop (2 col), tablet (2 col), mobile (1 col)
- [ ] Validar que los pills de promociones enlazan correctamente

## Riesgos & Mitigación

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Card de promociones sin datos | Medio | Fallback con datos estáticos quemados inicialmente |
| Cards demasiado pequeñas en mobile | Medio | En mobile (1 columna) mantener aspecto original |
| Imagen de promociones no disponible | Bajo | Placeholder con gradiente de marca |
| Grid desbalanceado con 5 items | Bajo | Última card ocupa full-width o centrar con justify-items |

## Timeline

**Total: 1.5-2 días**
- Crear modelo de datos de promociones: 1h
- Implementar card "Promociones": 3h
- Compactar cards existentes (CSS): 2h
- Ajustes de grid y responsive: 2h
- Testing y refinamiento visual: 2h
