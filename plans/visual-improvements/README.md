# Plan de Mejoras Visuales y Funcionales (v1)

## Objetivo

Iterar sobre el sitio actual `ipproyectosindustriales.cl` (Astro + WordPress headless en Hostinger) para mejorar componentes UI y páginas existentes, con foco en:

- **Consistencia visual** (mismo footer, mismo header, mismo topbar en todas las páginas).
- **Reusabilidad** (la data vive en un único archivo; los componentes son templates que reciben props).
- **Accesibilidad** (roles ARIA, focus visible, contraste, semántica de landmarks).
- **SEO técnico** (HTML consistente, JSON-LD correcto, schema por nivel, canonical self-referencing).
- **Conversión B2B** (formulario de cotización robusto, páginas de contacto / compliance / seguridad orientadas a faena minera e industrial).

## Decisiones arquitectónicas transversales

### A. Footer dinámico + single source of truth

**Conclusión: NO genera problemas de SEO**, siempre que la data sea server-rendered (lo cual Astro hace por defecto en SSG).

| Argumento | Aclaración |
|---|---|
| **Mismo HTML en todas las páginas** | Si todos los `BaseLayout` importan la misma `site.footer` desde `src/data/site.ts`, el HTML emitido en cada `<footer>` es idéntico. Google ve el mismo footer en toda la web, lo que es lo que el algoritmo espera. |
| **Server-rendered** | Astro genera HTML estático en build. No hay JS en cliente que decida qué footer pintar → 0 impacto en Core Web Vitals ni en indexación. |
| **Reusable como template** | El componente `<Footer>` recibe props (`columns`, `legal`, `brand`, `social`, `logoUrl`, etc.). Eso permite que un futuro proyecto del mismo repo (o un fork) cambie solo `src/data/site.ts` y obtenga un footer distinto, sin tocar el componente. |
| **Override explícito sigue siendo posible** | Si una página quiere un footer especial, puede pasar `footer={...}` como prop. La página debe ser explícita (no implícita). |
| **Canonical y OG** | El footer no afecta canonical ni Open Graph; esos viven en `<head>`. |

**Regla de oro:** si una página pasa un `footer` prop distinto del canónico, debe justificarlo en el código (comentario) y mantener los **mismos `legal` links y `brand`**. Cambiar links o marca en el footer produce inconsistencias que Google detecta como thin signals.

### B. Data de sitio centralizada

Toda la data compartida (footer, topbar, navegación, redes, contacto, branding) vive en `src/data/site.ts`. Se importa en `BaseLayout.astro` y se reparte a los componentes como props. Los componentes no hacen `import` directo de `site.ts` — siempre reciben la data por props. Esto preserva la reusabilidad.

### C. StatsCounter no cambia su grid

El componente mantiene `display: flex` con `flex: 1 1` por item. La regla es:

- Layout siempre horizontal (`stats--horizontal`).
- Máximo 4 contadores (`columns: 4`).
- El ancho visual de cada item se calcula con `flex: 1 1 calc(25% - 1px)`.
- **Sí se extiende el tipo** `StatItem.value` para aceptar `number | string`, de modo que pueda mostrar valores no numéricos ("24/7", "Incluido") sin cambiar la grilla.

### D. Sección "Especificaciones técnicas" se elimina del flujo de sub-rutas

- El componente `SpecsGrid.astro` **se mantiene en el repositorio** (reusable, no se rompe la API).
- El slot `specs` del `RentalLayout.astro` **se elimina**.
- El campo `specs` del tipo `RentalSubcategory` **se mantiene** (es la fuente de datos para el `StatsCounter`).
- En `[categoria]/[subcategoria].astro` se sustituye `<SpecsGrid>` por `<StatsCounter stats={...}>` con los datos de `subcategory.specs`.

### E. Sin renombrar `QuoteFormAdvanced`

Se mantiene el nombre del archivo y del componente. Los cambios son internos: estructura HTML, CSS, props. El call-site en `CTABand.astro` no cambia.

### F. Eliminar `compliance/[tema].astro`

Las páginas `/compliance/hseq` y `/compliance/certificaciones` ya no existen en el nuevo diseño (los documentos se sirven como cards con descarga directa en `/compliance`). El archivo se elimina. Si hay backlinks externos, se agrega una regla 301 en `public/.htaccess` (en línea con `plans/rental-catalog/07-redirects-migration.md`).

### G. Fuente distinta para el cuerpo de noticias

- News body: serif (recomendado **Lora** o **Source Serif 4**).
- News headings: se mantiene `Plateia Bold` (display de la marca) para cohesión de marca.
- La fuente se sirve localmente desde `public/fonts/news-body.woff2` para evitar CLS y dependencias externas.

### H. TopBar desaparece al hacer scroll

- Implementación: `IntersectionObserver` sobre un sentinel posicionado al tope del `Header`.
- Cuando el sentinel sale del viewport (scroll down), se aplica `.is-hidden` al `TopBar` con `transform: translateY(-100%)`.
- Al volver al tope (sentinel visible), se quita la clase con `transform: translateY(0)`.
- Respeta `prefers-reduced-motion`.

## Especificaciones por área

| # | Spec | Fase | Estado | Archivos principales |
|---|---|---|---|---|
| 01 | [Data de sitio unificada](./01-footer-data.md) | 1 | ⬜ Pendiente | `src/data/site.ts` (nuevo), `BaseLayout.astro` |
| 02 | [Header + TopBar](./02-header-topbar.md) | 2 | ⬜ Pendiente | `Header.astro`, `TopBar.astro`, `BaseLayout.astro` |
| 03 | [StatsCounter + remover specs](./03-stats-counter.md) | 3 | ⬜ Pendiente | `StatsCounter.astro`, `RentalLayout.astro`, `[subcategoria].astro` |
| 04 | [LogoCarousel](./04-logo-carousel.md) | 3 | ⬜ Pendiente | `LogoCarousel.astro`, `index.astro` |
| 05 | [CTABand + QuoteFormAdvanced](./05-cta-band-form.md) | 4 | ⬜ Pendiente | `CTABand.astro`, `QuoteFormAdvanced.astro` |
| 06 | [Sistema de noticias](./06-news-system.md) | 5 | ⬜ Pendiente | `NewsGrid.astro`, `noticias/[post].astro`, `noticias/index.astro`, `data/news.ts` (nuevo), `public/fonts/news-body.woff2` (nuevo) |
| 07 | [Seguridad con StatsCounter](./07-seguridad-stats.md) | 6 | ⬜ Pendiente | `seguridad.astro` |
| 08 | [Compliance rediseño](./08-compliance-redesign.md) | 6 | ⬜ Pendiente | `compliance/index.astro`, `data/compliance.ts` (nuevo), eliminar `compliance/[tema].astro` |
| 09 | [Contacto B2B](./09-contacto-redesign.md) | 7 | ⬜ Pendiente | `contacto/index.astro` |

**Leyenda:** ⬜ Pendiente · 🟡 En progreso · ✅ Completo

## Orden de ejecución recomendado

### Sprint 1 — Fundaciones (impacto transversal, sin estas specs las demás quedan inconsistentes)

1. **Spec 01** — Data de sitio unificada → un footer, un topbar, un nav, en todas las páginas.
2. **Spec 02** — Header + TopBar refactor + item Empresa fuera.
3. **Spec 03** — StatsCounter + remover `specs` de sub-rutas.

### Sprint 2 — Componentes UI (mejoran la presentación sin tocar páginas completas)

4. **Spec 04** — LogoCarousel.
5. **Spec 05** — CTABand + QuoteFormAdvanced (bug fix + visual).

### Sprint 3 — Páginas

6. **Spec 06** — Sistema de noticias (el más grande e independiente).
7. **Spec 07** — Seguridad aplica StatsCounter.
8. **Spec 08** — Compliance rediseño.
9. **Spec 09** — Contacto B2B.

## Convenciones del plan

- Cada spec es autocontenida. Define su **objetivo**, **archivos a tocar**, **cambios detallados con código de referencia**, **tareas en checkboxes**, **Definition of Done** y **riesgos**.
- Las specs declaran explícitamente `Depende de` y `Bloquea a`.
- Los cambios de tipos van acompañados de migración de call-sites en la misma spec.
- Ningún spec introduce dependencia nueva (npm) sin justificar.
- Ningún spec elimina archivos sin dejar redirección si la URL cambió.

## Riesgos transversales

| Riesgo | Mitigación |
|---|---|
| Footer inconsistente entre páginas | Spec 01 centraliza data + override explícito solo si se justifica |
| Cambio de tipos en `StatsCounter.value` rompe call-sites | Spec 03 audita todos los call-sites con grep antes de migrar el tipo |
| Eliminar `compliance/[tema].astro` deja backlinks muertos | Regla 301 en `.htaccess` (ver spec 08) |
| Fuente de noticias no disponible localmente | Descargar `.woff2` y alojar en `public/fonts/` con `preload` en `BaseLayout` |
| Cambio de item "Empresa" en nav afecta usuarios con músculo memoria | Mantener redirect interno o label contextual (decisión en spec 02) |

## Referencias

- [Plan de catálogo de arriendo](../rental-catalog/README.md) — sigue el mismo patrón (10 specs iterables).
- [Skill: SEO Audit](../../.agents/skills/seo-audit/SKILL.md) — para validación de cada spec.
- [Skill: Frontend Design](../../.agents/skills/frontend-design/SKILL.md) — para decisiones de diseño en specs UI.
- [Skill: WordPress Pro](../../.agents/skills/wordpress-pro/SKILL.md) — para Spec 06 cuando se conecte a la API real.
