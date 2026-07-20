# Spec 04 — LogoCarousel (logos grandes, separación, título SEO)

**Fase:** 3
**Estado:** ⬜ Pendiente
**Archivos a modificar:**
- `src/components/ui/LogoCarousel.astro`
- `src/pages/index.astro` (call-site: añadir título y subtítulo)

**Depende de:** nada.
**Bloquea a:** ninguna.

---

## Objetivo

1. Logos más grandes y con más separación (mejor presencia visual, mejor legibilidad).
2. **Título SEO** "Confían en nosotros" (h2) + subtítulo corto sobre el carrusel. Esto da contexto semántico (accesibilidad), permite indexar la keyword "confían en nosotros" y refuerza social proof.
3. Variantes de fondo adicionales (incluir `muted`).
4. Mejorar el efecto de hover (la transición grayscale → color se siente como la convención de la industria).

## Cambios en `src/components/ui/LogoCarousel.astro`

```astro
---
// src/components/ui/LogoCarousel.astro
// Carrusel horizontal de logos con efecto grayscale → color en hover.
// Con título y subtítulo SEO para dar contexto a los crawlers y a11y.

export interface LogoItem {
  src: string;
  alt: string;
  url?: string;
  width?: number;
  height?: number;
}

export interface Props {
  logos: LogoItem[];
  title?: string;                    // ej. "Confían en nosotros"
  subtitle?: string;                 // ej. "Empresas líderes de la gran minería"
  speed?: 'slow' | 'normal' | 'fast';
  backgroundColor?: string;
  backgroundVariant?: 'white' | 'muted' | 'dark';
  pauseOnHover?: boolean;
  className?: string;
}

const {
  logos,
  title,
  subtitle,
  speed = 'normal',
  backgroundColor,
  backgroundVariant = 'white',
  pauseOnHover = true,
  className = '',
} = Astro.props;

const speedDurations = {
  slow: '60s',
  normal: '40s',
  fast: '25s',
};

const duration = speedDurations[speed];

const bgClass = `logo-carousel--bg-${backgroundVariant}`;
---

<section
  class:list={['logo-carousel', `logo-carousel--pause-hover-${pauseOnHover}`, bgClass, className]}
  aria-label={title || 'Clientes'}
>
  {(title || subtitle) && (
    <header class="logo-carousel__header">
      {title && <h2 class="logo-carousel__title">{title}</h2>}
      {subtitle && <p class="logo-carousel__subtitle">{subtitle}</p>}
    </header>
  )}

  <div
    class="logo-carousel__track"
    role="list"
    style={`animation-duration: ${duration};`}
  >
    {[0, 1].map(() => (
      <div class="logo-carousel__group" role="presentation">
        {logos.map((logo) => (
          <div class="logo-carousel__item" role="listitem">
            {logo.url ? (
              <a
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                class="logo-carousel__link"
                aria-label={`${logo.alt} (abre en nueva pestaña)`}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  loading="lazy"
                  decoding="async"
                  class="logo-carousel__img"
                />
              </a>
            ) : (
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                loading="lazy"
                decoding="async"
                class="logo-carousel__img"
              />
            )}
          </div>
        ))}
      </div>
    ))}
  </div>
</section>

<style>
  .logo-carousel {
    padding: clamp(48px, 6vw, 80px) 0;
    border-block: 1px solid var(--color-line, rgba(0, 0, 0, 0.08));
  }

  .logo-carousel--bg-white {
    background-color: var(--color-surface, #fff);
  }

  .logo-carousel--bg-muted {
    background-color: var(--color-surface-alt, #f7f9f7);
  }

  .logo-carousel--bg-dark {
    background-color: var(--color-graphite, #0d1611);
    color: #fff;
  }

  .logo-carousel__header {
    max-width: var(--container-max-width, 1360px);
    margin-inline: auto;
    padding-inline: var(--container-padding, 20px);
    text-align: center;
    margin-bottom: clamp(28px, 4vw, 48px);
  }

  .logo-carousel__title {
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: clamp(1.5rem, 2.8vw, 2.2rem);
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 8px;
  }

  .logo-carousel--bg-dark .logo-carousel__title {
    color: #fff;
  }

  .logo-carousel__subtitle {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--color-ink-500, #6b7280);
  }

  .logo-carousel--bg-dark .logo-carousel__subtitle {
    color: rgba(255, 255, 255, 0.7);
  }

  .logo-carousel__track {
    display: flex;
    width: max-content;
    animation: logo-carousel-scroll linear infinite;
  }

  @keyframes logo-carousel-scroll {
    to {
      transform: translateX(-50%);
    }
  }

  .logo-carousel__group {
    display: flex;
    align-items: center;
    gap: clamp(64px, 8vw, 96px);
    padding-right: clamp(64px, 8vw, 96px);
  }

  .logo-carousel__item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .logo-carousel__link {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }

  .logo-carousel__img {
    max-height: clamp(72px, 8vw, 96px);
    max-width: clamp(160px, 18vw, 220px);
    width: auto;
    height: auto;
    object-fit: contain;
    filter: grayscale(100%);
    opacity: 0.75;
    transition: filter 0.3s var(--ease-out, ease),
      opacity 0.3s var(--ease-out, ease),
      transform 0.3s var(--ease-out, ease);
  }

  .logo-carousel__item:hover .logo-carousel__img,
  .logo-carousel__item:focus-within .logo-carousel__img {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.05);
  }

  .logo-carousel--pause-hover-true:hover .logo-carousel__track,
  .logo-carousel--pause-hover-true:focus-within .logo-carousel__track {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    .logo-carousel__track {
      animation: none;
    }
    .logo-carousel__img {
      transition: none;
    }
  }
</style>
```

### Cambios clave

1. **Logo más grande**: `max-height: clamp(72px, 8vw, 96px)` (antes 60px). `max-width: clamp(160px, 18vw, 220px)` (antes 160px).
2. **Más separación**: `gap: clamp(64px, 8vw, 96px)` (antes 60px).
3. **Título y subtítulo SEO**: opcionales pero por defecto `undefined`. Cuando se pasan, se renderizan como `<h2>` + `<p>`.
4. **Variante de fondo**: `backgroundVariant` con `white | muted | dark`. Reemplaza el `backgroundColor` libre.
5. **Hover más rico**: además de grayscale → color, agrega `transform: scale(1.05)`.
6. **A11y**: `role="list"` en el track, `role="listitem"` en cada item, `aria-label` en cada link con el nombre del cliente.
7. **Refactor del loop**: usa `[0, 1].map(...)` para renderizar los dos grupos idénticos (antes era HTML duplicado inline).

## Cambios en `src/pages/index.astro`

```diff
-  <LogoCarousel
-    logos={clientLogos}
-    speed="normal"
-    backgroundColor="#ffffff"
-    pauseOnHover={true}
-  />
+  <LogoCarousel
+    logos={clientLogos}
+    title="Confían en nosotros"
+    subtitle="Empresas líderes de la gran minería y la industria que han confiado en nuestro trabajo."
+    speed="normal"
+    backgroundVariant="white"
+    pauseOnHover={true}
+  />
```

## Decisiones de diseño

1. **`backgroundVariant` en vez de `backgroundColor` libre**: limita las opciones a tokens del sistema, mantiene coherencia con el resto del sitio. Si se necesita un color ad-hoc, se añade al sistema de tokens, no se permite inline.

2. **Título como h2 (no h3)**: el `LogoCarousel` suele ir después de un hero o una sección de servicios, donde ya hay h1/h2. Usar h2 es coherente. Si la página no tiene h2 anterior, se considera más adelante.

3. **Refactor del loop**: el array `[0, 1].map(() => ...)` es una mejora técnica que reduce 50 líneas de HTML duplicado. Funcionalidad idéntica.

4. **Hover scale 1.05**: pequeño detalle que mejora la sensación de "este logo importa". Combinado con grayscale → color, da feedback claro.

5. **No cambiar el efecto grayscale → color**: es la convención de la industria. Los clientes con logos en color no quieren que su marca se "vea" en todo momento; el grayscale reduce la distracción visual del carrusel en movimiento.

## Tareas

- [ ] Reemplazar `LogoCarousel.astro` con la nueva versión.
- [ ] Actualizar el call-site en `index.astro` con `title` y `subtitle`.
- [ ] Validar en mobile (logos más grandes pero `max-width` clamp no rompe layout).
- [ ] Validar con `prefers-reduced-motion: reduce`: la animación se detiene.
- [ ] Confirmar que los `alt` de los logos son nombres reales de empresas (no "Cliente" genérico — el actual `index.astro` tiene varios "Cliente" que deberían ser los nombres reales).

## Definition of Done

- [ ] Logos se ven al menos 1.5x más grandes que antes.
- [ ] Separación entre logos es visible (no amontonados).
- [ ] El título "Confían en nosotros" aparece sobre el carrusel.
- [ ] El subtítulo aparece bajo el título.
- [ ] El h2 del título tiene jerarquía correcta con el resto de la página.
- [ ] `aria-label="Confían en nosotros"` en el `<section>` del carrusel.
- [ ] Cada logo-link tiene `aria-label` específico.
- [ ] `npm run build` compila sin warnings.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Logos más grandes rompen el layout en mobile | `max-height: clamp(72px, 8vw, 96px)` escala hacia abajo en mobile |
| Algunos logos son SVG y otros JPG, no se ven consistentes | Audit visual con `View Image Info` en DevTools; normalizar alturas manualmente si es necesario |
| El `aria-label` de los links sociales revela "abre en nueva pestaña" | Es buena práctica para screen readers; no genera ruido |
| "Confían en nosotros" no es la keyword más buscada | Investigar con Search Console; ajustar copy si el dato lo sugiere |
