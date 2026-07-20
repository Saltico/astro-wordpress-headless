# Spec 07 — /seguridad aplica StatsCounter

**Fase:** 6
**Estado:** ⬜ Pendiente
**Archivos a modificar:**
- `src/pages/seguridad.astro`

**Archivos a eliminar (estilos):**
- Las clases locales `.safety-stats`, `.safety-stats__grid`, `.safety-stat`, `.safety-stat b`, `.safety-stat small` (líneas 218-256 actual).

**Depende de:** Spec 03 (`StatsCounter` con `value: number | string`).
**Bloquea a:** ninguna.

---

## Objetivo

Reemplazar el bloque local de stats en `/seguridad` (`.safety-stats` con `miniStats` hardcodeados) por el componente reutilizable `<StatsCounter>`. Esto unifica la presentación con la home y las sub-rutas, y elimina estilos duplicados.

## Estado actual

`seguridad.astro:75-86`:

```astro
<!-- Mini Stats -->
<section class="safety-stats">
  <Container>
    <div class="safety-stats__grid">
      {miniStats.map((stat) => (
        <div class="safety-stat">
          <b>{stat.value}</b>
          <small>{stat.label}</small>
        </div>
      ))}
    </div>
  </Container>
</section>
```

Con `miniStats`:

```ts
const miniStats = [
  { value: '460.000', label: 'Horas hombre trabajadas' },
  { value: '0,93%', label: 'Tasa de cotización (R12)' },
  { value: 'Bajo', label: 'Riesgo psicosocial' },
];
```

Los valores son strings (no animables). El componente `StatsCounter` ya acepta `value: number | string` desde Spec 03.

## Cambios en `src/pages/seguridad.astro`

```diff
 ---
 import BaseLayout from '@/layouts/BaseLayout.astro';
 import Container from '@/components/ui/Container.astro';
 import SplitSection from '@/components/ui/SplitSection.astro';
 import CTABand from '@/components/ui/CTABand.astro';
 import Breadcrumbs from '@/components/seo/Breadcrumbs.astro';
 import Icon from '@/components/ui/Icon.astro';
+import StatsCounter from '@/components/ui/StatsCounter.astro';
+import type { StatItem } from '@/components/ui/StatsCounter.astro';
 import heroImg from '@/assets/imgs/hero.jpg';

 const title = 'Seguridad | HSEC — IP Proyectos Industriales';
 const description = 'Seguridad, salud y medio ambiente. El cuidado de las personas es nuestro primer estándar.';

-const miniStats = [
-  { value: '460.000', label: 'Horas hombre trabajadas' },
-  { value: '0,93%', label: 'Tasa de cotización (R12)' },
-  { value: 'Bajo', label: 'Riesgo psicosocial' },
-];
+const miniStats: StatItem[] = [
+  { value: '460.000', label: 'Horas hombre trabajadas' },
+  { value: '0,93%', label: 'Tasa de cotización (R12)' },
+  { value: 'Bajo', label: 'Riesgo psicosocial' },
+];
```

```diff
-  <!-- Mini Stats -->
-  <section class="safety-stats">
-    <Container>
-      <div class="safety-stats__grid">
-        {miniStats.map((stat) => (
-          <div class="safety-stat">
-            <b>{stat.value}</b>
-            <small>{stat.label}</small>
-          </div>
-        ))}
-      </div>
-    </Container>
-  </section>
+  <!-- Stats HSEC -->
+  <StatsCounter
+    stats={miniStats}
+    variant="dark"
+    layout="horizontal"
+    columns={3}
+    animated={false}
+    showDividers={true}
+  />
```

Y eliminar los estilos locales:

```diff
-  /* Stats */
-  .safety-stats {
-    background-color: var(--color-graphite, #0d1611);
-    padding-block: clamp(40px, 6vw, 60px);
-    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
-  }
-
-  .safety-stats__grid {
-    display: grid;
-    grid-template-columns: repeat(3, 1fr);
-    gap: 30px;
-  }
-
-  @media (max-width: 640px) {
-    .safety-stats__grid {
-      grid-template-columns: 1fr;
-      gap: 20px;
-    }
-  }
-
-  .safety-stat {
-    text-align: center;
-  }
-
-  .safety-stat b {
-    display: block;
-    font-family: var(--font-heading, 'Archivo', sans-serif);
-    font-weight: 900;
-    font-size: clamp(2rem, 4vw, 3rem);
-    color: #fff;
-    letter-spacing: -0.02em;
-    line-height: 1;
-  }
-
-  .safety-stat small {
-    display: block;
-    color: var(--color-ink-400, rgba(255, 255, 255, 0.6));
-    font-size: 0.9rem;
-    margin-top: 8px;
-  }
```

## Decisiones de diseño

1. **`animated={false}`**: los stats son strings (no numéricos). `StatsCounter` los renderiza tal cual. Esto es coherente con el comportamiento de Spec 03 para sub-rutas de arriendo.

2. **`showDividers={true}`**: con 3 items y valores largos como "460.000", los divisores verticales dan respiro visual.

3. **`columns={3}`**: los 3 stats de seguridad caben en 3 columnas. Si en el futuro se añade un cuarto stat, se debe reconsiderar (el componente slicea a 4).

4. **Sin cambios en pilares ni SplitSection**: la sección de pilares (líneas 89-109) y el `SplitSection` (líneas 112-120) no se tocan. Mantienen su diseño porque son contenido único de esta página.

5. **Eliminar todos los estilos locales**: el componente `StatsCounter` se encarga. Se reduce el CSS en `~40 líneas`.

## Tareas

- [ ] Reemplazar el bloque local de stats por `<StatsCounter>`.
- [ ] Eliminar los estilos `.safety-stats`, `.safety-stats__grid`, `.safety-stat`, `.safety-stat b`, `.safety-stat small`.
- [ ] Verificar que `miniStats` se pasa como `StatItem[]` con `value: string`.
- [ ] Confirmar en `npm run dev` que la página `/seguridad` se ve igual que antes (o mejor).

## Definition of Done

- [ ] El bloque de stats de `/seguridad` usa el componente `<StatsCounter>`.
- [ ] Los estilos locales de stats están eliminados.
- [ ] El HTML del bloque de stats es idéntico al de la home (mismo componente = mismo markup).
- [ ] Los 3 stats se ven centrados, con divisores, en una sola línea horizontal.
- [ ] `npm run build` compila sin warnings.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Cambio visual perceptible (ancho, padding) | Comparar antes/después con screenshot. Ajustar `--color-surface-alt` si el fondo no coincide |
| Los stats quedan muy juntos al pilar (sin aire) | `StatsCounter` tiene `padding: clamp(28px, 4vw, 48px)` por item; ajustar márgenes del contenedor padre si hace falta |
