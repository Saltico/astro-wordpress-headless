# Resultados del Baseline Validation

> **Fecha:** 31 de julio de 2026  
> **Estado:** Completado  
> **Build:** Exitoso (51 páginas en 9.11s)

---

## 1. Inventario de Rutas

### Rutas generadas (51 total)

**Páginas principales:**
- `/` (homepage)
- `/nosotros`
- `/contacto`
- `/cotizador` (noindex)
- `/seguridad`
- `/compliance`
- `/canal-integridad`

**Servicios:**
- `/servicios`
- `/servicios/ingenieria`
- `/servicios/construccion`
- `/servicios/montajes`
- `/servicios/infraestructura-portuaria`
- `/servicios-industriales`
- `/servicios-industriales/montaje-industrial`
- `/servicios-industriales/obras-civiles`

**Arriendo (catálogo):**
- `/arriendo`
- `/arriendo/izaje` (7 equipos)
- `/arriendo/movimiento-de-tierra` (3 equipos)
- `/arriendo/transporte` (3 equipos)
- `/arriendo/equipos-especiales` (7 equipos)

**Noticias:**
- `/noticias`
- 3 artículos individuales

**Proyectos:**
- `/proyectos`
- 1 proyecto individual

**Legales:**
- `/aviso-legal`
- `/privacidad`
- `/cookies`
- `/gracias`
- `/404`
- `/500`

### Clasificación de indexación

| Ruta | Indexación | Motivo |
|------|-----------|--------|
| `/` | index | Homepage |
| `/nosotros` | index | Institucional |
| `/contacto` | index | Contacto |
| `/cotizador` | **noindex, follow** | Herramienta utilitaria |
| `/servicios/*` | index | Comercial |
| `/arriendo/*` | index | Catálogo |
| `/noticias/*` | index | Contenido editorial |
| `/proyectos/*` | index | Casos |
| `/aviso-legal` | noindex | Legal |
| `/privacidad` | noindex | Legal |
| `/cookies` | noindex | Legal |
| `/gracias` | noindex | Confirmación |
| `/404` | noindex | Error |
| `/500` | noindex | Error |

---

## 2. Inventario de Componentes

### Total: 52 componentes

**Por categoría:**
- UI: 22 componentes
- Quote: 9 componentes
- Rental: 5 componentes
- Layout: 5 componentes
- SEO: 3 componentes

### Componentes candidatos a retiro

| Componente | Ruta | Estado | Uso confirmado |
|------------|------|--------|----------------|
| TrustBand | `src/components/ui/TrustBand.astro` | ❌ No importado | Pendiente validación |
| Marquee | `src/components/ui/Marquee.astro` | ❌ No importado | Pendiente validación |
| ClientsGrid | `src/components/ui/ClientsGrid.astro` | ❌ No importado | Pendiente validación |
| Select | `src/components/ui/Select.astro` | ❌ No importado | Pendiente validación |
| QuoteForm | `src/components/ui/QuoteForm.astro` | ❌ Reemplazado por QuoteFormAdvanced | Pendiente validación |
| SpecsGrid | `src/components/rental/SpecsGrid.astro` | ❌ No importado | Pendiente validación |

**Resultado del grep:** NO se encontraron imports de estos 6 componentes en ningún archivo `.astro`, `.ts`, `.tsx` o `.js`. Solo se encontraron referencias a `QuoteFormAdvanced` (que es el reemplazo).

**Clasificación:** Los 6 componentes son **candidatos confirmados a retiro**, pero requieren revisión manual antes de eliminar para verificar:
- No hay imports dinámicos
- No hay referencias en documentación
- No hay dependencias CSS/assets huérfanos

---

## 3. Inventario de Assets

### Videos (25.72 MB total)

| Archivo | Tamaño | Estado |
|---------|--------|--------|
| `servicios.mp4` | 8.36 MB | 🔴 Crítico |
| `seguridad.mp4` | 8.68 MB | 🔴 Crítico |
| `arriendos.mp4` | 8.68 MB | 🔴 Crítico |
| `servicios-poster.jpg` | 0.37 MB | ✅ OK |
| `seguridad-poster.jpg` | 0.18 MB | ✅ OK |
| `arriendos-poster.jpg` | 0.18 MB | ✅ OK |

**Total videos:** 25.72 MB  
**Objetivo:** ≤ 6 MB (reducción del 77%)

### Imágenes (src/assets/imgs)

| Archivo | Tamaño |
|---------|--------|
| `faena-izaje.jpg` | 385.5 KB |
| `edificio.jpg` | 284.8 KB |
| `hero.jpg` | 237.0 KB |
| `serv-ingenieria.jpg` | 206.7 KB |
| `serv-montajes.jpg` | 155.5 KB |
| `serv-construccion.jpg` | 151.2 KB |
| `serv-izaje.jpg` | 172.3 KB |
| `apoyo.jpg` | 164.4 KB |
| `izaje.jpg` | 104.3 KB |
| `ingenieria.jpg` | 98.2 KB |
| `portuaria.jpg` | 93.7 KB |
| `gruas.jpg` | 92.7 KB |
| `construccion.jpg` | 88.6 KB |
| `montajes.jpg` | 89.2 KB |

**Total imágenes:** ~2.5 MB  
**Formato:** JPG (sin WebP/AVIF)  
**Recomendación:** Convertir a WebP/AVIF para reducir ~40%

### Logos (src/assets/logos)

| Archivo | Tamaño | Formato |
|---------|--------|---------|
| `logo-adv.png` | 20.1 KB | PNG |
| `logo_ipproyectosindustriales.png` | 4.3 KB | PNG |
| `logo_mecamin.png` | 2.7 KB | PNG |
| `logo_energiadelvalle.avif` | 7.5 KB | AVIF ✅ |
| `logo-famesa.svg` | 1.8 KB | SVG ✅ |
| `logo-codelco.svg` | 0.4 KB | SVG ✅ |
| `logo-mutual.svg` | 0.4 KB | SVG ✅ |
| `logo-komatsu.svg` | 0.3 KB | SVG ✅ |
| `logo-cap.svg` | 0.3 KB | SVG ✅ |

**Observación:** 3 logos PNG podrían optimizarse. El resto está en formatos eficientes.

### Fuentes (public/fonts)

| Archivo | Tamaño |
|---------|--------|
| `inter-var-latin.woff2` | 47.1 KB |
| `archivo-var-latin.woff2` | 34.1 KB |

**Total fuentes:** 81.2 KB ✅ Excelente

### PDF

| Archivo | Tamaño | Estado |
|---------|--------|--------|
| `catalogo.pdf` | 0.6 KB | 🔴 Sospechoso |

**Problema:** El PDF pesa solo 586 bytes, lo que sugiere que es un placeholder corrupto o vacío.

---

## 4. Análisis de SEO en HTML Generado

### Homepage (`/index.html`)

**Problemas críticos:**

| Elemento | Estado | Valor actual |
|----------|--------|--------------|
| `<title>` | ❌ **AUSENTE** | No existe |
| `<meta name="description">` | ❌ **AUSENTE** | No existe |
| `<link rel="canonical">` | 🔴 Dominio incorrecto | `https://orangered-deer-742907.hostingersite.com/` |
| `<meta property="og:title">` | ✅ Presente | "IP Proyectos Industriales \| Ingeniería, montajes y grúas..." |
| `<meta property="og:description">` | ✅ Presente | Descripción correcta |
| `<meta property="og:image">` | 🔴 **Archivo no existe** | `https://orangered-deer-742907.hostingersite.com/og-default.jpg` |
| `<meta name="robots">` | ✅ Correcto | `index, follow, max-image-preview:large` |
| H1 | 🔴 **AUSENTE** | No hay H1 en la homepage |

**Conclusión:** La homepage NO tiene title, description ni H1. Esto es un problema SEO crítico bloqueante.

### Cotizador (`/cotizador/index.html`)

| Elemento | Estado | Valor actual |
|----------|--------|--------------|
| `<title>` | ❌ **AUSENTE** | No existe |
| `<meta name="description">` | ❌ **AUSENTE** | No existe |
| `<link rel="canonical">` | 🔴 Dominio incorrecto | `https://orangered-deer-742907.hostingersite.com/cotizador` |
| `<meta name="robots">` | 🟡 Incorrecto | `noindex, nofollow` (debería ser `noindex, follow`) |
| `<meta property="og:title">` | ✅ Presente | "Cotizador en línea \| IP Proyectos Industriales" |

**Problema:** El cotizador usa `noindex, nofollow` pero debería ser `noindex, follow` para permitir que Google procese la directiva noindex y siga los enlaces internos.

---

## 5. Validación de robots.txt y sitemap

### robots.txt

```
User-agent: *
Allow: /

Sitemap: https://ipproyectosindustriales.cl/sitemap-index.xml
```

**Estado:** ✅ Correcto  
**Observación:** El robots.txt apunta al dominio correcto `ipproyectosindustriales.cl`, pero el sitemap generado usa el dominio antiguo.

### sitemap-index.xml

**Problema crítico:** El sitemap usa el dominio antiguo:

```xml
<loc>https://orangered-deer-742907.hostingersite.com</loc>
<loc>https://orangered-deer-742907.hostingersite.com/arriendo</loc>
...
```

**Impacto:** Google indexará URLs con el dominio de staging en lugar del dominio de producción.

**Causa:** `astro.config.mjs` tiene `SITE_URL = 'https://orangered-deer-742907.hostingersite.com'`

---

## 6. Diferencias entre tokens.css, base.css y estilos scoped

### tokens.css

**Variables definidas:**
- `--container-max-width: 1200px`
- `--container-full-width: 1440px`
- `--spacing-*` (escala de 0.25rem a 7.5rem)
- `--space-*` (aliases de --spacing-*)
- Colores: `--color-brand`, `--color-ink`, `--color-surface`, etc.
- Tipografías: `--font-heading`, `--font-body`

### base.css

**Uso de tokens:**
- Usa `var(--container-max-width)` correctamente
- Usa `var(--container-full-width)` correctamente
- Usa `var(--spacing-*)` correctamente

### Estilos scoped (componentes)

**Problema identificado:** Múltiples componentes hardcodean `max-width: 1360px` en lugar de usar tokens:

**Archivos afectados:**
- `Footer.astro` (2 veces)
- `Header.astro` (1 vez)
- `ServiceLayout.astro` (1 vez)
- `RentalLayout.astro` (1 vez)
- `ClientsGrid.astro` (1 vez)
- `TopBar.astro` (1 vez)
- `Container.astro` (1 vez)
- `CTABand.astro` (1 vez)
- `index.astro` (1 vez)
- `QuoteHero.astro` (1 vez)
- `seguridad.astro` (1 vez)
- `LogoCarousel.astro` (1 vez)
- `NewsGrid.astro` (1 vez)
- `PageHero.astro` (1 vez)
- `ServicesGrid.astro` (1 vez)

**Total:** 17 ocurrencias de `max-width: 1360px` hardcodeado

**Recomendación:** Reemplazar por `var(--container-full-width)` o crear un token `--container-wide-width` si 1440px es demasiado ancho.

---

## 7. Medición Inicial de Performance

### Tamaños de build

| Tipo | Tamaño | Archivos | Estado |
|------|--------|----------|--------|
| HTML total | 2.46 MB | 51 | ✅ Aceptable |
| JS total | 83 KB | 10 | ✅ Excelente |
| CSS total | 111.2 KB | 9 | 🟡 Mejorable |

### Observaciones

- **JS:** 83 KB es excelente, está dentro del presupuesto de 100 KB.
- **CSS:** 111.2 KB supera ligeramente el presupuesto de 100 KB. Requiere optimización.
- **HTML:** 2.46 MB para 51 páginas es razonable (~48 KB por página en promedio).

### Problemas de performance identificados

1. **Videos sin optimizar:** 25.72 MB (deberían ser ≤ 6 MB)
2. **Imágenes en JPG:** Sin WebP/AVIF (reducción posible ~40%)
3. **CSS duplicado:** ServiceLayout y RentalLayout comparten ~200 líneas
4. **Múltiples IntersectionObservers:** 4+ en homepage
5. **Logos externos:** 12 logos desde WordPress CDN (12 requests DNS + TLS)

---

## 8. Matriz de Hallazgos Clasificados

### 🔴 Críticos (bloquean indexación/ranking)

| ID | Hallazgo | Archivo | Línea | Estado |
|----|----------|---------|-------|--------|
| H-001 | No hay `<title>` en ninguna página | `src/components/seo/MetaTags.astro` | 32-67 | ✅ Confirmado |
| H-002 | No hay `<meta name="description">` | `src/components/seo/MetaTags.astro` | 32-67 | ✅ Confirmado |
| H-003 | Sitemap usa dominio antiguo | `astro.config.mjs` | 7 | ✅ Confirmado |
| H-004 | Canonical usa dominio antiguo | `src/components/seo/MetaTags.astro` | 32-67 | ✅ Confirmado |
| H-005 | Homepage sin H1 | `src/pages/index.astro` | - | ✅ Confirmado |
| H-006 | Falta `og-default.jpg` | `public/` | - | ✅ Confirmado |
| H-007 | Cotizador usa `noindex, nofollow` | `src/pages/cotizador.astro` | - | ✅ Confirmado |

### 🟠 Alto impacto

| ID | Hallazgo | Archivo | Línea | Estado |
|----|----------|---------|-------|--------|
| H-008 | Videos sin optimizar (25.72 MB) | `src/assets/videos/` | - | ✅ Confirmado |
| H-009 | Imágenes sin WebP/AVIF | `src/assets/imgs/` | - | ✅ Confirmado |
| H-010 | CSS supera presupuesto (111.2 KB) | `dist/_astro/` | - | ✅ Confirmado |
| H-011 | 17 ocurrencias de max-width hardcodeado | Múltiples | - | ✅ Confirmado |
| H-012 | PDF catalogo.pdf sospechoso (0.6 KB) | `public/catalogo.pdf` | - | ✅ Confirmado |
| H-013 | 6 componentes sin usar | `src/components/` | - | ✅ Confirmado |
| H-014 | Logos externos desde WordPress CDN | `src/data/site.ts` | - | ✅ Confirmado |

### 🟡 Medio impacto

| ID | Hallazgo | Archivo | Línea | Estado |
|----|----------|---------|-------|--------|
| H-015 | Patrón "Eyebrow" duplicado en 8+ componentes | Múltiples | - | ✅ Confirmado |
| H-016 | 5 implementaciones de Hero diferentes | Múltiples | - | ✅ Confirmado |
| H-017 | Sistema de espaciado dual (--spacing-* vs --space-*) | `src/styles/tokens.css` | 141-154 | ✅ Confirmado |
| H-018 | Tailwind instalado pero no usado | `astro.config.mjs` | 3 | ✅ Confirmado |
| H-019 | CSS duplicado entre ServiceLayout y RentalLayout | Múltiples | - | ✅ Confirmado |
| H-020 | Múltiples IntersectionObservers | Múltiples | - | ✅ Confirmado |

### 🟢 Bajo impacto

| ID | Hallazgo | Archivo | Línea | Estado |
|----|----------|---------|-------|--------|
| H-021 | Gradientes de overlay inconsistentes | Múltiples | - | ✅ Confirmado |
| H-022 | Animación `.reveal` duplicada | Múltiples | - | ✅ Confirmado |
| H-023 | Clase `.sr-only` duplicada | Múltiples | - | ✅ Confirmado |
| H-024 | Archivo `astro.svg` probablemente no utilizado | `src/assets/astro.svg` | - | Pendiente validación |

---

## 9. Supuestos Invalidados

| Supuesto original | Realidad encontrada |
|-------------------|---------------------|
| "6 componentes no utilizados" | ✅ Confirmado, pero requieren validación manual antes de eliminar |
| "27 MB de videos" | 🟡 Ligeramente menor: 25.72 MB (aún crítico) |
| "~2.5 MB de imágenes" | ✅ Confirmado: ~2.5 MB |
| "Tailwind no usado" | ✅ Confirmado: 0 clases utilitarias |
| "Dominio inconsistente" | ✅ Confirmado: robots.txt usa dominio correcto, pero sitemap y canonical usan dominio antiguo |
| "catalogo.pdf corrupto" | ✅ Confirmado: solo 0.6 KB |

---

## 10. Próximos Pasos

### Inmediatos (antes de release)

1. **Agregar `<title>` y `<meta name="description">` en MetaTags.astro** (10 min)
2. **Unificar dominio a `https://ipproyectosindustriales.cl`** en:
   - `astro.config.mjs`
   - `src/data/site.ts` (si aplica)
   - Cualquier otro archivo de configuración
3. **Crear `og-default.jpg`** 1200×630 px (30 min)
4. **Agregar H1 en homepage** (10 min)
5. **Corregir cotizador a `noindex, follow`** (5 min)
6. **Comprimir videos** (2 horas)

### Primera semana

7. Optimizar imágenes a WebP/AVIF
8. Unificar max-width hardcodeado
9. Eliminar 6 componentes no utilizados (tras validación manual)
10. Mover logos externos a local

### Primer mes

11. Consolidar sistema de diseño
12. Implementar WordPress API (post-MVP)
13. Optimizar CSS

---

## 11. Métricas Finales

| Métrica | Valor | Estado |
|---------|-------|--------|
| Páginas generadas | 51 | ✅ |
| Componentes totales | 52 | ✅ |
| Componentes sin usar | 6 (11.5%) | ⚠️ |
| Videos | 25.72 MB | 🔴 Crítico |
| Imágenes | ~2.5 MB | 🟡 Mejorable |
| JS total | 83 KB | ✅ Excelente |
| CSS total | 111.2 KB | 🟡 Mejorable |
| Problemas SEO críticos | 7 | 🔴 Urgente |
| Problemas performance | 5 | 🟡 Importante |

---

**Fin del documento.**

*Baseline validation completado el 31 de julio de 2026.*
