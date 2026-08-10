# Plan de Mejora: Inconsistencias y Optimizaciones Pendientes

**Fecha:** 2026-08-10
**Estado:** Pendiente de iteración
**Prioridad general:** Media-Baja (no bloquea producción)

---

## Contexto

Este documento recoge las inconsistencias de diseño y recomendaciones de rendimiento identificadas durante la auditoría global del sitio (comando `$impeccable polish`). No son bloqueantes ni afectan la funcionalidad actual, pero su resolución mejorará la mantenibilidad, consistencia del design system y performance del sitio.

El objetivo es iterar sobre estos puntos en futuras sesiones de trabajo, priorizando por impacto y esfuerzo.

---

## 1. Inconsistencias de diseño (no críticas)

### 1.1 Eyebrow duplicado en 6 componentes

**Problema:** Existe el componente `<Eyebrow>` en `src/components/ui/Eyebrow.astro`, pero 6 componentes reimplementan el patrón inline con CSS propio:

- `src/components/ui/HeroSection.astro` (`.hero-section__eyebrow`)
- `src/components/ui/PageHero.astro` (`.page-hero__eyebrow`)
- `src/components/ui/CTABand.astro` (`.cta-band__eyebrow`)
- `src/components/ui/SplitSection.astro` (`.split-section__eyebrow`)
- `src/components/ui/LogoCarousel.astro` (`.logo-carousel__eyebrow`)
- `src/pages/index.astro` (`.services-section__eyebrow`)

**Riesgo:** Drift visual. Si se cambia el patrón eyebrow (ej. grosor de línea, espaciado, color), hay que actualizar 7 lugares en vez de 1.

**Solución propuesta:**
1. Migrar los 6 componentes para usar `<Eyebrow text="..." />` como fuente única.
2. Eliminar el CSS inline duplicado en cada componente.
3. Verificar que el componente `<Eyebrow>` soporta todos los casos de uso actuales (alineación center en CTABand, variantes de color en contextos oscuros).

**Archivos afectados:**
- `src/components/ui/HeroSection.astro`
- `src/components/ui/PageHero.astro`
- `src/components/ui/CTABand.astro`
- `src/components/ui/SplitSection.astro`
- `src/components/ui/LogoCarousel.astro`
- `src/pages/index.astro`
- `src/components/ui/Eyebrow.astro` (posibles extensiones)

**Estimación:** 2-3 horas de trabajo.

---

### 1.2 Footer usa `rgba()` en vez de tokens semánticos

**Problema:** El footer (`src/components/layout/Footer.astro`) usa valores hardcoded como `rgba(255, 255, 255, 0.72)` para texto y `rgba(255, 255, 255, 0.52)` para texto legal, en vez de consumir tokens semánticos como `--color-on-dark-muted` o `--theme-text-muted`.

**Impacto:** Si se cambia el tema o se ajusta la paleta de grises, hay que buscar y reemplazar valores rgba en todo el footer.

**Solución propuesta:**
1. Definir tokens semánticos específicos en `src/styles/tokens.css`:
   ```css
   --color-on-dark-subtle: rgba(255, 255, 255, 0.52);
   --color-on-dark-body: rgba(255, 255, 255, 0.78);
   ```
2. Reemplazar los `rgba()` hardcoded en el footer por estos tokens.
3. Extender el patrón a otros componentes si usan `rgba(255, 255, 255, *)` repetidamente.

**Archivos afectados:**
- `src/styles/tokens.css`
- `src/components/layout/Footer.astro`

**Estimación:** 30 minutos.

---

### 1.3 Service cards usa SVG inline en vez de `<Icon>`

**Problema:** En `src/pages/index.astro`, el `.service-card__link-cta` usa un SVG inline hardcoded en vez del componente `<Icon name="arrow-right" />`.

```astro
<!-- Actual -->
<span class="service-card__link-cta" aria-hidden="true">
  Conocer más
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <path d="M5 12h14M13 5l7 7-7 7"/>
  </svg>
</span>

<!-- Propuesto -->
<span class="service-card__link-cta" aria-hidden="true">
  Conocer más
  <Icon name="arrow-right" size={14} />
</span>
```

**Impacto:** Inconsistencia con el resto del sitio que usa `<Icon>`. Si se cambia el estilo del ícono arrow-right, hay que actualizar en múltiples lugares.

**Solución propuesta:**
1. Importar `<Icon>` en `src/pages/index.astro` (ya está importado, verificar).
2. Reemplazar el SVG inline por `<Icon name="arrow-right" size={14} />`.
3. Ajustar el CSS de `.service-card__link-cta svg` para que funcione con el componente `<Icon>`.

**Archivos afectados:**
- `src/pages/index.astro`

**Estimación:** 10 minutos.

---

## 2. Recomendaciones de rendimiento

### 2.1 P2: Self-hosting de logos de clientes

**Problema:** Los 12 logos de clientes en `src/pages/index.astro` se cargan desde URLs externas del WordPress CDN:

```js
{ src: 'https://ipproyectosindustriales.cl/wp-content/uploads/2025/08/barrick.jpg', alt: 'Barrick' },
{ src: 'https://ipproyectosindustriales.cl/wp-content/uploads/2025/08/cmpchile_logo.jpeg', alt: 'CMP' },
// ... 10 más
```

**Impacto:**
- Cada logo requiere DNS lookup + connection setup (~200-500ms por dominio).
- Dependencia de un servicio externo (WordPress CDN).
- No se benefician de las optimizaciones de Astro (formato AVIF/WebP, responsive images).

**Solución propuesta:**
1. Descargar los 12 logos a `src/assets/logos/clients/`.
2. Importarlos como assets de Astro en `index.astro`.
3. Astro optimizará automáticamente el formato y generará responsive images.

**Archivos afectados:**
- `src/pages/index.astro`
- Nuevos archivos en `src/assets/logos/clients/`

**Estimación:** 1 hora (descarga + importación + verificación).

---

### 2.2 P2: Optimización del carrusel de logos

**Problema:** El componente `LogoCarousel.astro` duplica el DOM para crear el efecto marquee infinito: 2 grupos × 12 imágenes = 24 requests HTTP.

**Impacto:**
- 24 requests innecesarios en el homepage.
- Animación CSS continua consume CPU/GPU incluso cuando el carrusel no está visible.

**Solución propuesta:**
1. **Opción A (recomendada):** Usar IntersectionObserver para pausar la animación cuando el carrusel no está en viewport.
2. **Opción B:** Cargar solo los logos visibles con `loading="lazy"` (ya está implementado, verificar efectividad).
3. **Opción C:** Consolidar logos en un sprite SVG o imagen combinada (complejidad alta, beneficio marginal).

**Implementación mínima (Opción A):**
```astro
<script>
  const carousel = document.querySelector('.logo-carousel__track');
  const observer = new IntersectionObserver(
    ([entry]) => {
      carousel.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    },
    { threshold: 0 }
  );
  observer.observe(carousel);
</script>
```

**Archivos afectados:**
- `src/components/ui/LogoCarousel.astro`

**Estimación:** 30 minutos.

---

### 2.3 P3: Consolidar scripts inline en BaseLayout

**Problema:** `src/layouts/BaseLayout.astro` tiene 3 bloques `<script>` separados:

1. Anti-FOUC theme toggle (líneas 142-148)
2. IntersectionObserver para animación reveal (líneas 211-229)
3. Toast layer para notificaciones del cotizador (líneas 232-264)

**Impacto:**
- Cada `<script>` inline requiere parse time adicional.
- Dificulta el mantenimiento y debugging.

**Solución propuesta:**
1. Consolidar los 3 scripts en un solo bloque `<script>`.
2. Opcionalmente, mover el script de reveal y toast a archivos externos en `src/scripts/` para mejor cacheabilidad.

**Estructura propuesta:**
```astro
<script>
  // 1. Anti-FOUC (debe ejecutarse antes del primer paint)
  (function() {
    const s = localStorage.getItem('theme-preference');
    const t = s === 'dark' || s === 'light' ? s : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', t);
  })();

  // 2. Reveal animation observer
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(/* ... */);
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  }

  // 3. Toast layer
  (function() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const layer = document.createElement('div');
    layer.setAttribute('data-toast-layer', '');
    // ... resto del código
  })();
</script>
```

**Archivos afectados:**
- `src/layouts/BaseLayout.astro`

**Estimación:** 30 minutos.

---

## 3. Priorización recomendada

| Prioridad | Tarea | Impacto | Esfuerzo | ROI |
|-----------|-------|---------|----------|-----|
| **P2** | Self-hosting logos clientes | Alto (performance + independencia) | 1h | ⭐⭐⭐ |
| **P2** | Optimización carrusel logos | Medio (CPU/GPU) | 30min | ⭐⭐ |
| **P3** | Consolidar scripts BaseLayout | Bajo (parse time) | 30min | ⭐ |
| **P3** | Migrar eyebrows a componente | Medio (mantenibilidad) | 2-3h | ⭐⭐ |
| **P3** | Tokenizar rgba() del footer | Bajo (consistencia) | 30min | ⭐ |
| **P3** | Reemplazar SVG inline por Icon | Bajo (consistencia) | 10min | ⭐ |

**Recomendación:** Iterar en este orden:
1. Self-hosting logos (mayor impacto en performance real)
2. Optimización carrusel (beneficio inmediato en CPU/GPU)
3. Consolidar scripts (quick win)
4. Migrar eyebrows (mantenibilidad a largo plazo)
5. Tokenizar footer + SVG inline (consistencia del design system)

---

## 4. Criterios de aceptación

Para considerar una tarea completada:

- ✅ Build pasa sin errores (`npm run build`)
- ✅ Detector de Impeccable no reporta nuevos hallazgos (`node .agents/skills/impeccable/scripts/detect.mjs --json <archivos>`)
- ✅ No hay regresiones visuales en desktop ni mobile
- ✅ No hay regresiones en accesibilidad (contraste, focus, keyboard navigation)
- ✅ Performance no degrada (verificar con Lighthouse si aplica)

---

## 5. Notas adicionales

- Este documento es vivo. Actualizar conforme se resuelvan tareas o surjan nuevas inconsistencias.
- Las estimaciones son aproximadas y asumen familiaridad con el codebase.
- Antes de iterar, verificar que el codebase no ha cambiado significativamente desde la auditoría (2026-08-10).

---

**Próxima revisión:** Cuando se reserve tiempo para iteración de mantenibilidad o performance.
