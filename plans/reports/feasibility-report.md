---
report: Análisis de Viabilidad Técnica
date: 2026-09-06
---

# Reporte de Viabilidad Técnica — Renovación Visual Homepage

## Evaluación General

| Criterio | Estado | Observación |
|----------|--------|-------------|
| Viabilidad técnica | ✅ **Alta** | Todos los cambios son CSS/HTML/JS vanilla, sin dependencias externas nuevas |
| Riesgo de regresión | 🟡 **Medio** | Reestructuración del index.astro afecta múltiples componentes |
| Impacto SEO | 🟢 **Bajo** | h1 preservado, JSON-LD sin cambios, meta tags intactos |
| Impacto performance | 🟡 **Medio** | Slider añade imágenes; mitigado con lazy loading y AVIF |
| Impacto accesibilidad | 🟢 **Bajo** | Nuevos componentes diseñados con ARIA desde el inicio |

---

## Análisis por Feature

### §1 — Banner Promocional

| Aspecto | Evaluación |
|---------|------------|
| **Tecnología** | CSS scroll-snap o JS vanilla. Sin librerías externas. ✅ |
| **Performance** | 3-5 imágenes AVIF (~50-80KB c/u). Solo slide 1 con `fetchpriority="high"`. LCP estimado: similar al hero actual. |
| **Riesgo LCP** | 🟡 Medio. El hero actual precarga 1 imagen. El banner precarga la primera + lazy para el resto. Potencial mejora si la imagen del banner es más ligera que la del hero actual. |
| **CLS** | 🟢 Bajo. Altura fija con `clamp()` previene layout shifts. |
| **Accesibilidad** | ✅ `aria-roledescription="carousel"`, `aria-live`, keyboard navigation, `prefers-reduced-motion`. |
| **Complejidad JS** | 🟡 Medio. Autoplay, pause on hover, dots navigation, keyboard support. ~100 líneas de JS vanilla. |

**Veredicto**: ✅ **Viable**. Componente estándar de la industria, implementable sin librerías externas.

### §2 — Sección Título + Buscador

| Aspecto | Evaluación |
|---------|------------|
| **Tecnología** | Extracción directa del hero actual. `EquipmentSearch` se reutiliza sin cambios. ✅ |
| **SEO** | 🟢 Bajo riesgo. El `h1` se mantiene como único h1 de la página. Google no penaliza la posición relativa del h1. |
| **Performance** | 🟢 Neutro. Se elimina la imagen de fondo del hero (1 request menos), se añade el fondo sólido del SearchHero. |
| **Complejidad** | 🟢 Baja. Principalmente trabajo de CSS y reorganización de markup. |

**Veredicto**: ✅ **Altamente viable**. Esencialmente un "refactor" del hero actual.

### §4 — Category Showcase Renovado

| Aspecto | Evaluación |
|---------|------------|
| **Card Promociones** | ✅ Viable. Nuevo item en el grid con datos de `promotions.ts`. Sin lógica compleja. |
| **CSS compacto** | ✅ Viable. Cambios de aspect-ratio, padding, font-size. CSS puro. |
| **Grid con 5 items** | 🟡 Requiere decisión de diseño. 5 items en grid de 2 columnas → última card sola en una fila. Opciones: centrada, full-width, o grid de 3 columnas. |
| **Responsive** | 🟢 Bajo riesgo. Mobile ya es 1 columna, el cambio de aspect-ratio se adapta bien. |

**Veredicto**: ✅ **Viable**. La complejidad está en el refinamiento visual del grid con 5 items.

### §6 — Servicios Compacto

| Aspecto | Evaluación |
|---------|------------|
| **CSS** | 🟢 Baja complejidad. Cambios de aspect-ratio, padding y line-clamp. |
| **Imágenes** | 🟢 Sin cambios. Las mismas imágenes se recortan con `object-fit: cover` al nuevo ratio. |
| **Riesgo** | 🟢 Mínimo. Cambios puramente cosméticos. |

**Veredicto**: ✅ **Altamente viable**. Cambio CSS trivial.

---

## Análisis de Riesgos Globales

### Riesgo 1: Degradación del LCP

**Probabilidad**: Media
**Impacto**: Alto (Core Web Vitals)

El hero actual usa una sola imagen con `fetchpriority="high"`. El banner tendrá múltiples imágenes pero solo la primera se precarga.

**Mitigación**:
- `<link rel="preload">` de la primera imagen del banner
- `fetchpriority="high"` solo en slide 1
- Formato AVIF para todas las imágenes
- Dimensiones optimizadas (1920×540 vs la imagen actual del hero)

### Riesgo 2: Regresión visual en otras páginas

**Probabilidad**: Baja
**Impacto**: Medio

Los componentes modificados (`CategoryShowcase`, `EquipmentSearch`) se usan en otras páginas además de la homepage.

**Mitigación**:
- `CategoryShowcase` se usa en homepage y posiblemente en `/arriendo/`. Verificar que los cambios CSS no afecten esas páginas.
- `EquipmentSearch` NO se modifica — se reutiliza tal cual en el nuevo `SearchHero`.
- Considerar props para controlar el modo compacto vs. original.

### Riesgo 3: Contenido de promociones no disponible

**Probabilidad**: Media
**Impacto**: Medio

El banner y la card de promociones requieren imágenes y datos de promociones que aún no existen.

**Mitigación**:
- Iniciar con datos placeholder realistas
- Permitir que `promotions.ts` tenga datos hardcodeados inicialmente
- Diseñar el componente para funcionar bien con 1-5 banners

### Riesgo 4: Compatibilidad con tema claro/oscuro

**Probabilidad**: Baja
**Impacto**: Bajo

El diseño actual es dark-first con soporte para light mode. Los nuevos componentes deben respetar ambos temas.

**Mitigación**:
- Usar tokens semánticos (`--theme-bg`, `--theme-text`) en lugar de colores hardcoded
- Banner: el overlay oscuro funciona bien en ambos temas (las imágenes son el contenido)
- SearchHero: usar `var(--color-graphite-2)` como fondo (ya es un color fijo, no temático)

---

## Dependencias Externas

| Dependencia | Estado | Impacto si falla |
|-------------|--------|-----------------|
| Imágenes promocionales (banner) | ⚠️ Necesarias | Se puede usar placeholder con gradiente |
| Datos de equipos en promoción | ⚠️ Necesarios | Datos de ejemplo en `promotions.ts` |
| `EquipmentSearch.astro` | ✅ Existe | Sin cambios, se reutiliza |
| `RENTAL_CATEGORIES` de `rental.ts` | ✅ Existe | Sin cambios |
| Imágenes de categorías | ✅ Existen | Se mantienen las mismas |

---

## Competencia y Referencias

### skrental.com (referencia principal)
- **Fortalezas**: Slider de promociones prominente, buscador integrado, catálogo visible desde el primer viewport
- **Debilidades**: Diseño anticuado (Bootstrap 3), AngularJS 1.x, carga pesada
- **Diferenciación de iprental**: Diseño moderno, dark theme, tipografía premium (Archivo + Inter), mejor UX de búsqueda (tree view jerárquico)

### Otros referentes del sector rental
- **Sunbelt Rentals**: Hero con video, cards de categorías prominentes, CTA clara
- **United Rentals**: Buscador como elemento central, categorías visuales
- **Herc Rentals**: Slider de promociones + buscador integrado (similar a skrental)

**Conclusión**: La estructura propuesta (banner + buscador + categorías visibles) es un patrón establecido en la industria del rental de equipos pesados. No hay riesgo de diseño experimental.

---

## Recomendación Final

**✅ Proyecto viable** para ejecución en **4-5 días hábiles** con un equipo de 1 desarrollador.

**Prioridad de ejecución**:
1. Preparar datos e imágenes (día 1)
2. Construir `PromoBanner` + `SearchHero` (días 2-3)
3. Integrar en `index.astro` + modificar `CategoryShowcase` (día 3-4)
4. Testing y refinamiento (día 4-5)

**No se requieren**:
- Nuevas dependencias de npm
- Cambios en la configuración de Astro
- Modificaciones al servidor
- Cambios en la base de datos o WordPress
