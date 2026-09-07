---
feature: Sección Título + Buscador (§2)
effort: Medio
dependencies: [EquipmentSearch.astro, Banner Promocional (§1)]
status: Planificado
---

# Sección Título + Buscador (§2)

## Overview

Extracción del título, subtítulo y buscador de equipos del hero split actual hacia una **sección independiente y compacta** ubicada inmediatamente después del banner promocional. Esta sección funciona como "hero semántico" — mantiene el contenido SEO y el buscador como acción primaria, pero sin consumir espacio vertical excesivo.

## Contexto del Cambio

| Aspecto | Antes (dentro del Hero) | Después (Sección independiente) |
|---------|------------------------|-------------------------------|
| Ubicación | Dentro de `d-hero`, panel derecho | Sección `<section>` autónoma |
| Layout | Split grid (texto izq + search der) | Centrado, stack vertical compacto |
| Altura | Parte de los 70svh del hero | ~140-180px máximo |
| Fondo | Imagen de fondo con overlay | Fondo sólido del tema (dark) |

## Requisitos Funcionales

1. **Título SEO** (`h1`) preservado: "Arriendo de equipos y maquinaria para construcción y minería"
2. **Subtítulo** descriptivo mantenido
3. **Buscador de equipos** (`EquipmentSearch`) centrado y prominente
4. **Link al cotizador** ("¿Prefieres cotizar directamente?")
5. **Layout centrado** — texto y buscador en stack vertical, todo centrado
6. **Fondo oscuro** (`--color-graphite` o `--color-graphite-2`) para contraste con el banner
7. **Compacto**: padding vertical reducido, `h1` con tamaño menor que el hero actual
8. **Responsive**: en mobile, el stack se mantiene pero con padding lateral

## Especificación del Componente

**Archivo**: `src/components/rental/SearchHero.astro`

### Layout: Centrado (stack vertical)

Todo el contenido está centrado horizontalmente: título, subtítulo y buscador forman un stack vertical alineado al centro. El buscador queda como elemento focal central debajo del texto SEO.

```
┌────────────────────────────────────────────────┐
│                                                │
│     Arriendo de equipos y maquinaria para      │
│             construcción y minería             │
│                                                │
│     Grúas de hasta 400 toneladas, movimiento   │
│     de tierra, transporte y equipos especiales │
│                                                │
│        ┌──────────────────────────────┐        │
│        │ 🔍 Buscar equipo...          │        │
│        └──────────────────────────────┘        │
│     ¿Prefieres cotizar? Ir al cotizador →      │
│                                                │
└────────────────────────────────────────────────┘
```

**Decisión tomada**: Layout centrado. El `h1` usa `text-wrap: balance` para equilibrar líneas. El buscador ocupa `max-width: 560px` centrado.

### Props

```typescript
export interface Props {
  title: string;
  titleHighlight?: string;    // Parte del título que se resalta en verde
  subtitle: string;
  searchPlaceholder?: string;
  ctaText?: string;
  ctaUrl?: string;
  class?: string;
}
```

### Estructura HTML

```html
<section class="search-hero">
  <div class="search-hero__container">
    <div class="search-hero__text">
      <h1 class="search-hero__title">
        Arriendo de equipos y maquinaria para
        <span>construcción y minería</span>
      </h1>
      <p class="search-hero__subtitle">
        Grúas de hasta 400 toneladas, movimiento de tierra, transporte
        y equipos especiales. Disponibilidad 24/7.
      </p>
    </div>

    <div class="search-hero__search">
      <EquipmentSearch placeholder="Buscar equipo..." />
    </div>

    <p class="search-hero__cta">
      ¿Prefieres cotizar directamente?
      <a href="/cotizador">
        Ir al cotizador →
      </a>
    </p>
  </div>
</section>
```

### CSS Clave

```css
.search-hero {
  padding-block: clamp(28px, 3vw, 48px) clamp(20px, 2.5vw, 36px);
  background-color: var(--color-graphite-2, #15201a);
  text-align: center;
}

.search-hero__container {
  max-width: var(--container-max-width, 1360px);
  margin-inline: auto;
  padding-inline: var(--container-padding, 20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(12px, 1.5vw, 20px);
}

.search-hero__title {
  font-size: clamp(1.5rem, 3vw, 2.4rem);
  /* Reducido vs el hero actual (2.2rem-4.5rem) */
  line-height: 1.05;
  letter-spacing: -0.02em;
  max-width: 24ch;
  text-wrap: balance;
  color: var(--color-on-dark);
}

.search-hero__title span {
  color: var(--color-brand-300, #62bb74);
}

.search-hero__subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: clamp(0.9rem, 0.3vw + 0.85rem, 1.05rem);
  max-width: 60ch;
  line-height: 1.5;
}

.search-hero__search {
  width: 100%;
  max-width: 560px;
  /* Buscador más ancho que en el hero panel (480px → 560px) */
}

.search-hero__cta {
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--text-small);
}

.search-hero__cta a {
  color: var(--color-brand-300, #62bb74);
  font-weight: 600;
  text-decoration: none;
}
```

## Altura Total Estimada

| Viewport | Banner (§1) | SearchHero (§2) | Stats (§3) | Total hasta cards |
|----------|-------------|-----------------|------------|-------------------|
| 1440px | ~340px | ~170px | ~90px | ~720px → cards visibles a 360px |
| 1080px | ~300px | ~155px | ~85px | ~660px → cards visibles a 420px |
| 768px  | ~260px | ~200px (stack) | ~130px | ~710px → cards visibles |
| 375px  | ~200px | ~240px (stack) | ~200px | ~760px → cards visibles |

## Integración en index.astro

```diff
- <!-- §1: HERO SPLIT -->
- <section class="d-hero">...</section>

+ <!-- §1: BANNER PROMOCIONAL -->
+ <PromoBanner banners={promoBanners} />
+
+ <!-- §2: TÍTULO + BUSCADOR -->
+ <SearchHero
+   title="Arriendo de equipos y maquinaria para"
+   titleHighlight="construcción y minería"
+   subtitle="Grúas de hasta 400 toneladas..."
+ />

  <!-- §3: STATS COUNTER (mantener) -->
  <StatsCounter ... />
```

## Impacto SEO

- **`h1` preservado**: El título SEO principal se mantiene como `<h1>` en la nueva sección
- **Posición en DOM**: Sigue siendo uno de los primeros elementos `<h1>` de la página
- **JSON-LD**: Sin cambios (el schema está en el frontmatter, no afectado por layout)
- **Preload de imagen**: Ya no se precarga la imagen del hero (ahora es el banner el que necesita preload)

## Testing Strategy

- [ ] Verificar que el `h1` es único en la página
- [ ] Confirmar que el buscador funciona correctamente fuera del hero
- [ ] Validar altura compacta en todos los breakpoints
- [ ] Verificar que las cards de categorías son visibles sin scroll en 1080p
- [ ] Testear link al cotizador
- [ ] Validar que el texto balance se renderiza correctamente

## Riesgos & Mitigación

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| SEO: mover h1 fuera del hero | Bajo | El h1 sigue siendo el primero y único; Google no penaliza la posición relativa |
| Buscador pierde contexto visual | Bajo | Sección diseñada para que el buscador sea el elemento focal central |
| Altura excesiva en mobile | Medio | Padding y font-size con clamp(), stack compacto |

## Timeline

**Total: 0.5-1 día**
- Crear componente SearchHero: 2h
- Extraer y adaptar estilos del hero actual: 1h
- Integración en index.astro + cleanup hero viejo: 1h
- Testing responsive: 1h
