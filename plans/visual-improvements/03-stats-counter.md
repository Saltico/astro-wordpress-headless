# Spec 03 — StatsCounter + remover "Especificaciones técnicas" de sub-rutas

**Fase:** 3
**Estado:** ⬜ Pendiente
**Archivos a modificar:**
- `src/components/ui/StatsCounter.astro`
- `src/components/rental/SpecsGrid.astro` (sin cambios, pero se documenta)
- `src/pages/arriendo/[categoria]/[subcategoria].astro`
- `src/layouts/RentalLayout.astro`

**Depende de:** nada.
**Bloquea a:** Spec 07 (`/seguridad` usa `StatsCounter`).

---

## Objetivo

1. **Simetría lateral** del `StatsCounter` en cualquier variante (horizontal, 4 columnas, 3 columnas, 2 columnas).
2. **Extender el tipo** `StatItem.value` para aceptar `number | string`. Esto permite pasar datos no numéricos (ej. "24/7", "Incluido") sin cambiar la grilla horizontal.
3. **Eliminar la sección "Especificaciones técnicas"** del flujo de sub-rutas de arriendo. El componente `SpecsGrid.astro` **se mantiene en el repositorio** (es reusable, la API no se rompe). El slot `specs` del `RentalLayout.astro` **se elimina** y el call-site en `[subcategoria].astro` se reemplaza por `<StatsCounter>`.

## Por qué NO se cambia la grilla

El usuario pidió que `StatsCounter` mantenga siempre una sola línea horizontal, hasta 4 contadores. Esto preserva el patrón de la home y de las páginas de servicio. Los datos de `subcategory.specs` (capacidad, altura, operador, disponibilidad) son 4 valores — encajan perfecto.

Si en el futuro se necesita un layout de cards (2x2), se introduce una nueva variante (ej. `variant="card-grid"`) en otro spec. No se modifica este componente.

## Cambios en `src/components/ui/StatsCounter.astro`

```astro
---
// src/components/ui/StatsCounter.astro
// Contador horizontal de 2-4 items.
// value acepta number | string. Los strings se renderizan tal cual (sin animar).

export interface StatItem {
  value: number | string;
  label: string;
  prefix?: string;
  suffix?: string;
  prefixPosition?: 'before' | 'after';
  suffixPosition?: 'before' | 'after';
  formatNumber?: boolean;
}

export interface Props {
  stats: StatItem[];
  variant?: 'light' | 'dark' | 'brand' | 'minimal';
  layout?: 'horizontal' | 'vertical' | 'grid';
  columns?: 2 | 3 | 4 | 5;
  animated?: boolean;
  duration?: number;
  className?: string;
  showDividers?: boolean;
}

const {
  stats,
  variant = 'dark',
  layout = 'horizontal',
  columns = 4,
  animated = true,
  duration = 1500,
  className = '',
  showDividers = false,
} = Astro.props;

// Truncar a 4 items (regla del producto: max 4 contadores).
const safeStats = stats.slice(0, 4);

const variantClasses = {
  light: 'stats--light',
  dark: 'stats--dark',
  brand: 'stats--brand',
  minimal: 'stats--minimal',
};

const layoutClasses = {
  horizontal: 'stats--horizontal',
  vertical: 'stats--vertical',
  grid: 'stats--grid',
};

const columnsClass = `stats--cols-${columns}`;
---

<div
  class={`stats ${variantClasses[variant]} ${layoutClasses[layout]} ${columnsClass} ${showDividers ? 'stats--dividers' : ''} ${className}`.trim()}
  role="list"
  aria-label="Estadísticas clave"
>
  {safeStats.map((stat) => {
    const prefix = stat.prefix || '';
    const suffix = stat.suffix || '';
    const prefixPos = stat.prefixPosition || 'before';
    const suffixPos = stat.suffixPosition || 'after';
    const shouldFormat = stat.formatNumber !== false;
    const isNumeric = typeof stat.value === 'number';
    const displayValue = isNumeric
      ? animated
        ? '0'
        : shouldFormat
          ? (stat.value as number).toLocaleString('es-CL')
          : (stat.value as number).toString()
      : (stat.value as string);

    return (
      <div class="stats__item" role="listitem" data-animate={animated && isNumeric ? 'true' : 'false'}>
        <div class="stats__number-wrapper">
          {prefix && prefixPos === 'before' && (
            <span class="stats__prefix">{prefix}</span>
          )}

          <span
            class="stats__number"
            data-count={isNumeric ? (stat.value as number) : ''}
            data-format={isNumeric ? (shouldFormat ? 'true' : 'false') : 'false'}
            data-duration={duration}
          >
            {displayValue}
          </span>

          {suffix && suffixPos === 'after' && (
            <span class="stats__suffix">{suffix}</span>
          )}
          {suffix && suffixPos === 'before' && (
            <span class="stats__suffix stats__suffix--before">{suffix}</span>
          )}
          {prefix && prefixPos === 'after' && (
            <span class="stats__prefix stats__prefix--after">{prefix}</span>
          )}
        </div>
        <div class="stats__label">{stat.label}</div>
      </div>
    );
  })}
</div>

{animated && (
  <script define:vars={{ duration }}>
    (function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.stats__number[data-count]').forEach((el) => {
          const target = parseInt(el.dataset.count || '0', 10);
          const shouldFormat = el.dataset.format === 'true';
          el.textContent = shouldFormat ? target.toLocaleString('es-CL') : target.toString();
        });
        return;
      }

      function countUp(el) {
        const target = parseInt(el.dataset.count || '0', 10);
        const shouldFormat = el.dataset.format === 'true';
        const dur = parseInt(el.dataset.duration || duration, 10);
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          el.textContent = shouldFormat ? current.toLocaleString('es-CL') : current.toString();
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = shouldFormat ? target.toLocaleString('es-CL') : target.toString();
          }
        }
        requestAnimationFrame(tick);
      }

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.5 }
        );
        document.querySelectorAll('.stats__number[data-count]').forEach((el) => {
          if (el.dataset.count) observer.observe(el);
        });
      } else {
        document.querySelectorAll('.stats__number[data-count]').forEach((el) => {
          const target = parseInt(el.dataset.count || '0', 10);
          const shouldFormat = el.dataset.format === 'true';
          el.textContent = shouldFormat ? target.toLocaleString('es-CL') : target.toString();
        });
      }
    })();
  </script>
)}

<style>
  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    padding: 0;
  }

  .stats--horizontal {
    flex-direction: row;
  }

  .stats--vertical {
    flex-direction: column;
  }

  .stats--grid {
    display: grid;
    grid-template-columns: repeat(var(--columns, 4), 1fr);
    gap: 1px;
  }

  /* Items: 4 columnas por defecto (regla del producto). */
  .stats--horizontal .stats__item,
  .stats--cols-4 .stats__item {
    flex: 1 1 25%;
    min-width: 0;
  }

  .stats--cols-2 .stats__item {
    flex: 1 1 50%;
    min-width: 0;
  }

  .stats--cols-3 .stats__item {
    flex: 1 1 33.333%;
    min-width: 0;
  }

  @media (max-width: 740px) {
    .stats--horizontal .stats__item,
    .stats--cols-3 .stats__item,
    .stats--cols-4 .stats__item {
      flex: 1 1 50%;
    }
  }

  @media (max-width: 480px) {
    .stats--horizontal .stats__item,
    .stats--cols-2 .stats__item,
    .stats--cols-3 .stats__item,
    .stats--cols-4 .stats__item {
      flex: 1 1 100%;
    }
  }

  .stats--light {
    background-color: var(--color-surface, #fff);
  }
  .stats--light .stats__number {
    color: var(--color-ink, #1a1a1a);
  }
  .stats--light .stats__label {
    color: var(--color-ink-500, #6b7280);
  }

  .stats--dark {
    background-color: var(--color-surface-alt, #1a1a1a);
    border-top: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
  }
  .stats--dark .stats__number {
    color: #fff;
  }
  .stats--dark .stats__label {
    color: var(--color-ink-400, rgba(255, 255, 255, 0.6));
  }

  .stats--brand {
    background-color: var(--color-brand, #1a9c4a);
  }
  .stats--brand .stats__number,
  .stats--brand .stats__label {
    color: #fff;
  }

  .stats--minimal {
    background: transparent;
  }

  .stats__item {
    padding: clamp(28px, 4vw, 48px) clamp(16px, 2.5vw, 32px);
    background-color: inherit;
  }

  .stats--dividers .stats__item {
    border-right: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
  }
  .stats--dividers .stats__item:last-child {
    border-right: none;
  }

  .stats__number-wrapper {
    display: flex;
    align-items: baseline;
    gap: 4px;
    flex-wrap: wrap;
  }

  .stats__number {
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-weight: 900;
    font-size: clamp(2.2rem, 4.4vw, 3.6rem);
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .stats__prefix,
  .stats__suffix {
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-weight: 900;
    font-size: clamp(1.5rem, 2.8vw, 2.2rem);
    color: var(--color-brand-300, #4ade80);
    letter-spacing: -0.02em;
  }

  .stats__suffix--before,
  .stats__prefix--after {
    margin-left: 6px;
  }

  .stats__label {
    font-size: 0.9rem;
    margin-top: 10px;
    line-height: 1.4;
  }
</style>
```

### Cambios clave respecto a la versión actual

1. **`value: number | string`** — extiende el tipo.
2. **`safeStats = stats.slice(0, 4)`** — defensa por si alguien pasa 5+.
3. **`role="list"` y `aria-label`** — accesibilidad.
4. **`data-animate` solo si es numérico** — los strings no animan.
5. **Padding del item**: `clamp(28px, 4vw, 48px)` arriba/abajo y `clamp(16px, 2.5vw, 32px)` a los lados → simetría visual en cualquier resolución.
6. **`flex: 1 1 25%` con `min-width: 0`** — asegura 4 items del mismo ancho sin overflow en el último.
7. **`font-size: clamp(2.2rem, 4.4vw, 3.6rem)`** — escala de tipografía más conservadora para que 4 items quepan en mobile.

## Cambios en `src/layouts/RentalLayout.astro`

```diff
 export interface Props {
   title: string;
   subtitle: string;
   description: string;
   heroImage: string;
   heroImageAlt: string;
   category: string;
   features: string[];
   breadcrumbs: Array<{ label: string; url: string }>;
   whatsappMessage: string;
   catalogUrl?: string;
   catalogLabel?: string;

-  showSpecs?: boolean;
   showRelated?: boolean;
   showFaq?: boolean;
   catalogItems?: Equipment[];
   catalogColumns?: 2 | 3 | 4;
-  specs?: { label: string; value: string }[];
   relatedItems?: Array<{ name: string; href: string; shortDesc: string; badge?: string }>;
   faqItems?: Array<{ question: string; answer: string }>;
 }

 const {
   title,
   subtitle,
   description,
   heroImage,
   heroImageAlt,
   category,
   features,
   breadcrumbs,
   whatsappMessage,
   catalogUrl = '/catalogo.pdf',
   catalogLabel = 'Descargar catálogo',
-  showSpecs = false,
   showRelated = false,
   showFaq = false,
   catalogItems,
   catalogColumns = 3,
-  specs,
   relatedItems,
   faqItems,
 } = Astro.props;

 const hasCatalogSlot = Astro.slots.has('catalog');
-const hasSpecsSlot = Astro.slots.has('specs');
 const hasRelatedSlot = Astro.slots.has('related');
 const hasFaqSlot = Astro.slots.has('faq');
```

Y eliminar el bloque que renderiza el slot specs:

```diff
-  {/* Specs (slot o prop) */}
-  {(hasSpecsSlot || (showSpecs && specs && specs.length > 0)) && (
-    <section class="rental-slot-section rental-slot-section--light">
-      {hasSpecsSlot ? <slot name="specs" /> : null}
-    </section>
-  )}
```

## Cambios en `src/pages/arriendo/[categoria]/[subcategoria].astro`

```diff
 ---
 import RentalLayout from '@/layouts/RentalLayout.astro';
 import EquipmentCatalog from '@/components/rental/EquipmentCatalog.astro';
-import SpecsGrid from '@/components/rental/SpecsGrid.astro';
+import StatsCounter from '@/components/ui/StatsCounter.astro';
 import RelatedEquipment from '@/components/rental/RelatedEquipment.astro';
 import FAQSection from '@/components/rental/FAQSection.astro';
 import Container from '@/components/ui/Container.astro';
 import { RENTAL_CATEGORIES } from '@/data/rental';
 import { productSchemaExtended, breadcrumbSchema, combineSchemas } from '@/lib/seo';
```

Y reemplazar el slot specs por una sección de StatsCounter:

```diff
-  <Fragment slot="specs">
-    <SpecsGrid specs={subcategory.specs} background="light" />
-  </Fragment>
+  <StatsCounter
+    slot="specs"
+    stats={subcategory.specs.map((s) => ({
+      value: s.value,
+      label: s.label,
+    }))}
+    variant="dark"
+    layout="horizontal"
+    columns={4}
+    animated={false}
+    showDividers={true}
+  />
```

**Importante:** el slot se llama `specs` para no romper la API del `RentalLayout` en esta iteración. En una iteración futura se renombra a `stats` cuando se confirme que nadie más usa el componente.

(Opcional — más limpio: renombrar el slot a `stats` directamente. Decisión en el PR.)

## Decisiones de diseño

1. **`animated={false}` para sub-rutas**: el `StatsCounter` en sub-rutas muestra datos fijos (capacidad, altura, etc.). Animar un número que el usuario ya ve escrito es ruido. La animación solo tiene sentido en stats empresariales de la home (25+ años, 100+ equipos).

2. **`showDividers={true}`**: añade una separación visual entre los 4 items, útil cuando los valores son strings (no hay movimiento que ayude a separar).

3. **Mantener `SpecsGrid` en el repo**: se documenta que es reusable para otros componentes. No se elimina, no se rompe la API.

4. **Slot `specs` se renombra (decisión final en el PR)**: mejor `stats` para semántica. Si hay call-sites externos, dejar `specs` por compatibilidad y documentar la deprecación.

5. **Slice a 4 items**: defensa dura contra errores. El `StatsCounter` siempre debe ser una sola línea de 2-4 contadores. Más de 4 rompe la simetría.

## Tareas

- [ ] Editar `StatsCounter.astro` con la nueva versión (tipo extendido + simetría + a11y + max 4).
- [ ] Auditar call-sites existentes con `grep -rn "StatsCounter" src/` para confirmar que ninguno pasa más de 4 stats.
- [ ] Editar `RentalLayout.astro`: eliminar `showSpecs`, `specs` prop, slot `specs`.
- [ ] Editar `[subcategoria].astro`: cambiar import, reemplazar el slot specs por `<StatsCounter>`.
- [ ] Validar que `subcategory.specs` siempre tiene 4 items (auditar `rental.ts`).
- [ ] En las sub-rutas con specs de 3 (ej. `tracto-camiones` tiene 4: capacidad, cabina, chofer, disponibilidad), confirmar que el componente trunca a 4 y que se ve OK.

## Definition of Done

- [ ] `StatsCounter.astro` acepta `value: number | string`.
- [ ] El padding lateral es simétrico en `horizontal` con `columns={4}`.
- [ ] Las sub-rutas de arriendo ya no muestran la sección "Especificaciones técnicas".
- [ ] Las sub-rutas muestran `<StatsCounter>` con 4 valores derivados de `subcategory.specs`.
- [ ] El componente `SpecsGrid.astro` sigue en el repositorio (no eliminado, no roto).
- [ ] El slot `specs` ya no se renderiza en `RentalLayout.astro`.
- [ ] `npm run build` no genera warnings; `npm run dev` muestra la home con stats animados y sub-rutas con stats estáticos.
- [ ] En mobile, los 4 items colapsan a 2x2 (no se desbordan).

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Una página pasa 5+ stats y se ve mal | `safeStats = stats.slice(0, 4)` trunca. Considerar warning en consola. |
| El cambio de tipo rompe call-sites que pasaban `value: number` | TS acepta `number` como subtipo de `number \| string`. No hay breaking change. |
| `animated={false}` hace que el contador se vea "muerto" en sub-rutas | Es la decisión correcta: la animación distrae en datos técnicos. La animación es para stats narrativos. |
| `SpecsGrid` queda huérfano en el código | Documentar en el header del componente que está "legacy" o "reusable para otros layouts". No eliminar. |
