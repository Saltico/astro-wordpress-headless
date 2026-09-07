---
feature: Banner Promocional (§1)
effort: Alto
dependencies: [src/data/promotions.ts, src/assets/imgs/banners/]
status: Planificado
---

# Banner Promocional (§1)

## Overview

Reemplazo del hero split actual (`d-hero`) por un componente de banner/slider promocional inspirado en skrental.com. El banner mostrará imágenes promocionales rotativas con transiciones suaves, dots de navegación y opcionalmente flechas laterales. **Altura máxima controlada (~280-340px desktop)** para preservar la visibilidad del catálogo.

## Contexto del Cambio

| Aspecto | Antes (Hero Split) | Después (Banner) |
|---------|-------------------|------------------|
| Altura | 70svh (~600-750px) | 280-340px desktop |
| Contenido | Título SEO + Buscador | Imágenes promocionales |
| Interacción | Estática | Slider automático + manual |
| Responsive | Stack vertical | Altura reducida proporcional |

## Requisitos Funcionales

1. **Slider de imágenes** con rotación automática (intervalo configurable, default 5s)
2. **Navegación manual** vía dots (indicadores) y flechas laterales (opcionales en mobile)
3. **Cada slide** puede tener: imagen de fondo, texto superpuesto (título promocional + CTA)
4. **Pausa al hover** para facilitar la lectura del contenido
5. **Responsive**: altura adaptativa (desktop: ~320px, tablet: ~260px, mobile: ~200px)
6. **Lazy loading** para slides 2+ (solo la primera imagen carga eagerly)
7. **Accesibilidad**: `aria-roledescription="carousel"`, `aria-label`, `role="group"` en cada slide
8. **Prefers-reduced-motion**: desactivar auto-rotación y transiciones

## Modelo de Datos

```typescript
// src/data/promotions.ts

export interface PromoBanner {
  id: string;
  image: string;           // Ruta de la imagen (import de Astro asset)
  imageAlt: string;
  title?: string;          // Texto promocional superpuesto (opcional)
  subtitle?: string;
  ctaText?: string;        // Texto del botón CTA
  ctaUrl?: string;         // URL del CTA
  backgroundColor: string; // Color de fondo como fallback mientras carga la imagen
  overlayOpacity?: number; // 0-1, opacidad del overlay oscuro sobre la imagen
}

export type BannerType = 'showcase' | 'promotion';

export interface PromoBanner {
  id: string;
  type: BannerType;           // 'showcase' = capacidad estable, 'promotion' = oferta temporal
  image: string;              // Ruta de la imagen (import de Astro asset)
  imageAlt: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  backgroundColor: string;    // Color de fondo como fallback mientras carga
  discount?: string;          // Solo para type='promotion'. ej: "15% OFF"
  badge?: string;             // Solo para type='promotion'. ej: "OFERTA", "NUEVO"
  validUntil?: string;        // Solo para type='promotion'. ISO date para auto-hide
}

export const promoBanners: PromoBanner[] = [
  // ═══ PROMOTIONS PRIMERO (mayor prioridad comercial) ═══
  // Promoción activa (contenido temporal, se agrega/quita según vigencia)
  // {
  //   id: 'promo-gruas-junio',
  //   type: 'promotion',
  //   image: '/assets/imgs/banners/promo-gruas-junio.avif',
  //   imageAlt: '...',
  //   title: 'Grúas 60 toneladas',
  //   subtitle: 'Disponibilidad inmediata con tarifa especial',
  //   ctaText: 'Cotizar ahora',
  //   ctaUrl: '/arriendo/izaje/gruas-60-toneladas',
  //   backgroundColor: '#0d1611',
  //   discount: '15% OFF',
  //   badge: 'OFERTA',
  //   validUntil: '2026-07-31',
  // },

  // ═══ SHOWCASES DESPUÉS (contenido estable, 3 slides iniciales) ═══
  {
    id: 'capacidad-izaje',
    type: 'showcase',
    image: '/assets/imgs/hero/arriendo/izaje/izaje.avif',
    imageAlt: 'Grúas y equipos de izaje para minería y construcción',
    title: 'Grúas de hasta 250 toneladas',
    subtitle: 'Flota de izaje para minería y construcción en el norte de Chile',
    ctaText: 'Ver catálogo',
    ctaUrl: '/arriendo/izaje',
    backgroundColor: '#0d1611',
  },
  {
    id: 'capacidad-movimiento-tierra',
    type: 'showcase',
    image: '/assets/imgs/hero/arriendo/movimiento-de-tierra/movimiento-de-tierra.avif',
    imageAlt: 'Equipos de movimiento de tierra para faenas mineras',
    title: 'Movimiento de tierra',
    subtitle: 'Camiones tolva, retroexcavadoras y minicargadores para tu faena',
    ctaText: 'Ver catálogo',
    ctaUrl: '/arriendo/movimiento-de-tierra',
    backgroundColor: '#0d1611',
  },
  {
    id: 'capacidad-transporte',
    type: 'showcase',
    image: '/assets/imgs/hero/arriendo/transporte/transporte.avif',
    imageAlt: 'Flota de transporte pesado para faenas y obras',
    title: 'Transporte pesado',
    subtitle: 'Tracto camiones, cama-baja y semiremolques para tu operación',
    ctaText: 'Ver catálogo',
    ctaUrl: '/arriendo/transporte',
    backgroundColor: '#0d1611',
  },
];

// Convención: el orden del array define el orden de los slides.
// Las promociones activas (type='promotion') van primero.
// Los showcases (type='showcase') van después.
// 3 slides iniciales (15s de ciclo a 5s por slide).
```

## Especificación del Componente

**Archivo**: `src/components/rental/PromoBanner.astro`

### Layout: Imagen + Texto Lateral

Cada slide tiene un **layout split horizontal**: imagen a un lado y bloque de texto (título + subtítulo + CTA) al otro. El texto NO se superpone sobre la imagen — ocupa su propia columna, garantizando legibilidad sin depender del contenido de la imagen.

```
Desktop:
┌──────────────────────────────────────────────┐
│  Título promocional  │                       │
│  Subtítulo descript. │     [Imagen]          │
│  [Botón CTA]         │                       │
│            ● ○ ○ ○   │                       │
└──────────────────────────────────────────────┘
~320px desktop | ~260px tablet | ~200px mobile (stack)
```

En **mobile**, el layout cambia a stack vertical: imagen arriba (recortada) + texto abajo.

### Props

```typescript
export interface Props {
  banners?: PromoBanner[];
  autoPlayInterval?: number;  // ms, default 5000
  class?: string;
}
```

### Estructura HTML

```html
<section class="promo-banner" aria-roledescription="carousel" aria-label="Promociones destacadas">
  <div class="promo-banner__track">
    <article class="promo-banner__slide promo-banner__slide--active"
             role="group" aria-roledescription="slide" aria-label="Slide 1 de N">
      <div class="promo-banner__text">
        <h2 class="promo-banner__title">Título promocional</h2>
        <p class="promo-banner__subtitle">Subtítulo descriptivo</p>
        <a href="/cta" class="promo-banner__cta">Cotizar ahora →</a>
      </div>
      <div class="promo-banner__image-wrapper">
        <img src="..." alt="..." loading="eager|lazy" fetchpriority="high|auto" />
      </div>
    </article>
  </div>

  <!-- Controles: solo dots (sin flechas laterales) -->
  <div class="promo-banner__controls">
    <button class="promo-banner__dot promo-banner__dot--active"
            aria-label="Ir a slide 1" aria-current="true"></button>
    <button class="promo-banner__dot" aria-label="Ir a slide 2"></button>
    <button class="promo-banner__dot" aria-label="Ir a slide 3"></button>
  </div>
</section>
```

> **Decisión tomada**: Solo dots como controles visuales (sin flechas laterales). Navegación manual vía dots, keyboard (←/→) y swipe táctil en mobile.

> **Decisión tomada**: Banner full-width (edge-to-edge del viewport). La imagen se extiende hasta los bordes de la pantalla con `object-fit: cover`. La columna de texto respeta el padding interno (`clamp(20px, 3vw, 48px)`) pero no tiene `max-width` de container.

### CSS Clave

```css
.promo-banner {
  height: clamp(200px, 28vw, 320px);
  position: relative;
  overflow: hidden;
  background-color: var(--color-graphite, #0d1611);
  margin-top: calc(-1 * (var(--topbar-height, 40px) + var(--header-height, 80px)));
}

.promo-banner__slide {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.promo-banner__slide--active {
  opacity: 1;
  pointer-events: auto;
  z-index: 1;
}

/* Columna de texto: fondo sólido oscuro (graphite) — sin overlay */
.promo-banner__text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(20px, 3vw, 48px);
  background-color: var(--color-graphite, #0d1611);
  z-index: 2;
}

/* Columna de imagen: ocupa su espacio sin overlays */
.promo-banner__image-wrapper {
  position: relative;
  overflow: hidden;
}

.promo-banner__image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .promo-banner__slide {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  /* En mobile: imagen arriba (aspect-ratio compacto), texto abajo con fondo sólido */
  .promo-banner__image-wrapper {
    aspect-ratio: 21 / 9;
  }
}

/* Dots posicionados sobre la imagen, esquina inferior derecha */
.promo-banner__controls {
  position: absolute;
  bottom: 16px;
  right: 20px;
  z-index: 10;
  display: flex;
  gap: 8px;
  /* Fondo semi-transparente para garantizar visibilidad sobre cualquier imagen */
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 999px;
  backdrop-filter: blur(4px);
}

.promo-banner__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.promo-banner__dot--active {
  background: #fff;
  transform: scale(1.2);
}
```

> **Decisión tomada**: Dots sobre la imagen (esquina inferior derecha) con fondo pill semi-transparente (`rgba(0,0,0,0.3)` + blur). No consumen altura extra del banner. Visibilidad garantizada sobre cualquier imagen.

> **Decisión tomada**: Fondo sólido oscuro (`var(--color-graphite)`) en la columna de texto. Sin overlays ni gradientes. Legibilidad garantizada AAA con texto claro sobre fondo oscuro.

> **Decisión tomada**: CTA como botón pill `primary` (verde de marca), reutilizando `Button.astro` con `variant="primary"`. Máxima visibilidad y coherencia con el design system.

## Edge Case: 1 Slide Activo

Si `promoSldies.length === 1`:
- **Dots se ocultan** (`display: none` en `.promo-banner__controls`)
- **Autoplay deshabilitado** (no se inicia `setInterval`)
- **Slide se renderiza estático** (sin clase `--active`, siempre visible)
- **El banner funciona como imagen promocional fija**, no como carousel

```javascript
if (slides.length === 1) {
  controls.style.display = 'none';
  slides[0].classList.add('promo-banner__slide--static');
  // No iniciar setInterval
}
```

> **Decisión tomada**: Con 1 slide activo, el carousel se degrada gracefulmente a banner estático. Sin dots, sin autoplay. El usuario ve el contenido sin indicadores rotos.

## Script del Cliente (JS vanilla)

```javascript
// Lógica del carousel:
//
// 1. Auto-rotación con setInterval (5000ms por slide)
// 2. goToSlide(n): agrega/remueve clase '--active', actualiza dots
// 3. Click en dot → goToSlide(n) + reiniciar timer
// 4. Pausa en hover: mouseenter → clearInterval, mouseleave → setInterval
// 5. Pausa en focus: focusin → clearInterval, focusout → setInterval
// 6. Keyboard: ArrowLeft/ArrowRight → prev/next slide
// 7. prefers-reduced-motion: si matchMedia, deshabilitar autoplay + transition instantánea
// 8. Swipe táctil en mobile:
//    - touchstart → captura X inicial
//    - touchend → calcula deltaX
//    - Si |deltaX| > 50px → nextSlide() o prevSlide()
//    - Después de un swipe: pausa el autoplay por 10s (usuario leyendo)
//
// ~120 líneas de JS vanilla, sin dependencias externas.
```

## Accesibilidad

- `aria-roledescription="carousel"` en el contenedor
- `aria-roledescription="slide"` en cada slide
- `aria-live="polite"` en la región de slides (anuncia cambios)
- Dots con `aria-label="Ir a slide N"` y `aria-current="true"` en el activo
- `prefers-reduced-motion`: deshabilitar auto-rotación, transición instantánea
- Focus visible en todos los controles interactivos

## Imágenes

| Slot | Formato | Dimensiones sugeridas | Loading |
|------|---------|----------------------|---------|
| Slide 1 | AVIF | 1920×540 (16:4.5) | `eager`, `fetchpriority="high"` |
| Slide 2+ | AVIF | 1920×540 | `lazy` |
| Fallback | Gradiente de color sólido (`backgroundColor`) | — | — |

## Testing Strategy

- [ ] Verificar altura máxima en desktop (1440px), tablet (768px), mobile (375px)
- [ ] Confirmar auto-rotación funciona y pausa en hover
- [ ] Validar navegación por keyboard (Tab, Left, Right)
- [ ] Verificar `prefers-reduced-motion` deshabilita animaciones
- [ ] Testear con 1, 3 y 5 banners
- [ ] Validar que el LCP no se degrade (slide 1 debe cargar rápido)

## Riesgos & Mitigación

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| LCP degradado por imagen del banner | Alto | Usar `fetchpriority="high"` en slide 1, AVIF, precarga con `<link rel="preload">` |
| Slider pesado con muchas imágenes | Medio | Limitar a 3-5 banners máximo, lazy loading en slides 2+ |
| Contenido promocional no disponible | Bajo | Fallback con gradiente + color sólido, banners configurables en data file |

## Timeline

**Total: 1-2 días**
- Setup componente + estructura HTML: 3h
- CSS responsive + altura controlada: 2h
- JS del slider (autoplay, dots, flechas): 3h
- Accesibilidad + reduced-motion: 1h
- Integración en index.astro + testing: 2h
