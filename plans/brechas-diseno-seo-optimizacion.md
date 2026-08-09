# Auditoría Integral: Brechas de Diseño, SEO y Optimización

**Proyecto:** IP Proyectos Industriales (Astro + WordPress headless)  
**Fecha:** 2026-08-09  
**Alcance:** Análisis completo de diseño UI/UX, SEO técnico y on-page, y optimización de performance

---

## Resumen Ejecutivo

El proyecto presenta una **base sólida** con buena arquitectura de componentes, sistema de diseño bien estructurado y una infraestructura SEO robusta. Sin embargo, existen **brechas críticas** en accesibilidad, optimización de imágenes y contenido placeholder que deben abordarse antes del lanzamiento a producción.

### Prioridades Inmediatas (Críticas)

1. **Accesibilidad:** Solo 5 de 32 componentes respetan `prefers-reduced-motion`
2. **Optimización de imágenes:** No se implementa `<picture>` ni `srcset` a pesar de tener variantes JPG/WebP/AVIF
3. **Bug en RentalLayout:** JSON-LD de productos se pierde silenciosamente
4. **Contenido placeholder:** 8 páginas con contenido mínimo o inexistente
5. **Teléfono incorrecto en schema:** `seo.ts` tiene un placeholder `+56 9 0000 0000`

---

## 1. Brechas de Diseño (UI/UX)

### 1.1 Accesibilidad — `prefers-reduced-motion`

**Estado actual:** Solo **5 de 32 componentes** implementan correctamente `prefers-reduced-motion`:
- ✅ TopBar.astro
- ✅ Video.astro
- ✅ LogoCarousel.astro
- ✅ StatsCounter.astro
- ✅ ProjectGrid.astro

**Componentes con brechas:**

| Componente | Severidad | Impacto |
|------------|-----------|---------|
| **Button.astro** | 🔴 CRÍTICA | Componente más reutilizado. Hover/active animations sin override |
| **Navigation.astro** | 🔴 CRÍTICA | Submenu transitions, caret rotation sin override |
| **QuoteFormAdvanced.astro** | 🔴 CRÍTICA | Collapse/expand transitions en formulario de 40+ campos |
| **Input.astro / Textarea.astro** | 🟡 ALTA | Focus transitions sin override |
| **Header.astro** | 🟡 ALTA | Scroll-based transitions sin override |
| **Footer.astro** | 🟡 MEDIA | Social link hover animations sin override |
| **NewsGrid.astro** | 🟡 MEDIA | Card hover lift, image zoom sin override |
| **TeamGrid.astro** | 🟡 MEDIA | Card hover animations sin override |
| **ServicesGrid.astro** | 🟡 MEDIA | Card hover animations sin override |
| **ProjectCard.astro** | 🟡 MEDIA | Hover effects sin override |
| **ThemeToggle.astro** | 🟢 BAJA | Button hover/active sin override |
| **SkipLink.astro** | 🟢 BAJA | Slide-in transition sin override |
| **BaseLayout.astro (reveal observer)** | 🔴 CRÍTICA | Animación global `.reveal` ignora preferencia de motion |

**Recomendación:**  
Agregar `@media (prefers-reduced-motion: reduce)` a todos los componentes con transiciones. Priorizar Button, Navigation, QuoteFormAdvanced y el observer global de BaseLayout.

```css
/* Patrón recomendado */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 1.2 Accesibilidad — ARIA y Estructura Semántica

#### Críticas

**QuoteFormAdvanced.astro (811 líneas)**
- ❌ Labels sin atributo `for` — screen readers no pueden asociar labels con inputs
- ❌ Sin `aria-expanded` en secciones colapsables
- ❌ Sin `aria-controls` para vincular toggles con paneles
- ❌ Sin validación ni estados de error accesibles (`aria-invalid`, `aria-describedby`)
- ❌ Sin `<fieldset>`/`<legend>` para agrupar campos relacionados
- ❌ Sin estado de loading/submitting en botón de envío

**ProjectGrid.astro**
- ❌ Uso incorrecto de `role="tablist"` / `role="tab"` sin implementar el patrón completo:
  - Falta `role="tabpanel"` asociado
  - Falta navegación con flechas (Arrow Left/Right)
  - Falta soporte para Home/End keys
- ✅ **Solución:** Reemplazar con `role="group"` + `aria-pressed` en botones de filtro

**ContactSection.astro**
- ❌ No usa los componentes `Input` y `Textarea` del design system
- ❌ Duplica estilos de formulario inline
- ❌ Sin estados de error accesibles
- ❌ Sin `aria-invalid` ni `role="alert"` para mensajes de error

#### Altas

**Navigation.astro**
- ⚠️ Usa `:focus` en lugar de `:focus-visible` (muestra focus ring en clicks de mouse)
- ⚠️ Sin mecanismo de teclado para toggle de submenús (caret SVG no es interactivo)
- ✅ Buen uso de `<dialog>` nativo para menú móvil
- ✅ `aria-expanded`, `aria-controls`, `aria-current="page"` presentes

**ServicesGrid.astro**
- ⚠️ Cards usan `background-image` en lugar de `<img>` — sin alt text, sin lazy loading
- ⚠️ Texto de enlace "Conocer" no es descriptivo para screen readers
- ✅ **Solución:** Cambiar a "Conocer {service title}"

**BaseLayout.astro**
- ⚠️ Logo usa `filter: brightness(0) invert(1)` — asume logo oscuro sobre transparente
- ⚠️ Toast layer creado vía DOM manipulation imperativa en lugar de componente declarativo

---

### 1.3 Estados de Componentes

| Componente | Hover | Focus | Active | Disabled | Loading | Error |
|------------|-------|-------|--------|----------|---------|-------|
| Button | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Input | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Textarea | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Navigation | ✅ | ✅ | ✅ | N/A | N/A | N/A |
| ServicesGrid | ✅ | ❌ | ❌ | N/A | N/A | N/A |
| ProjectCard | ✅ | ❌ | ❌ | N/A | N/A | N/A |
| TeamGrid | ✅ | ❌ | ❌ | N/A | N/A | N/A |
| NewsGrid | ✅ | ✅ | ❌ | N/A | N/A | N/A |

**Brechas principales:**
- **Loading state:** Ningún componente de formulario tiene estado de loading/submitting
- **Focus visible:** Varios componentes interactivos usan `:focus` en lugar de `:focus-visible`
- **Error states:** QuoteFormAdvanced y ContactSection no tienen manejo de errores accesible

---

### 1.4 Consistencia de Diseño

#### Duplicación de Código

**RentalLayout.astro vs ServiceLayout.astro**
- ~80% de estilos duplicados (hero section, content grid, eyebrow patterns, overlay gradients)
- Ambos usan `top: 120px` hardcodeado para sticky image
- ✅ **Recomendación:** Extraer a un componente base compartido o partial CSS

**Eyebrow Pattern**
- Duplicado inline en: PageHero, HeroSection, CTABand, SplitSection, RentalLayout, ServiceLayout
- Existe componente `Eyebrow.astro` pero no se usa consistentemente
- ✅ **Recomendación:** Unificar uso del componente `Eyebrow.astro`

#### Inconsistencias de Tokens

**Eyebrow.astro**
- Usa `--spacing-3` / `--spacing-4` en lugar de `--space-3` / `--space-4`
- Riesgo de fallo silencioso si variables no están definidas

**HeroSection.astro**
- Color de eyebrow hardcodeado: `#a8d6ae` (debería usar `--theme-eyebrow` o `--color-brand-300`)
- Rompe theming/dark mode

---

### 1.5 Responsive Design

**Estado general:** ✅ Bien implementado en la mayoría de componentes

**Brechas identificadas:**

**Container.astro**
- ⚠️ Breakpoints de padding responsive están **comentados** (TODO sin resolver)
- ⚠️ Modificador `wide` es código muerto (mismo `max-width` que default)

**LogoCarousel.astro**
- ⚠️ Contenido duplicado para loop infinito es leído dos veces por screen readers
- ✅ **Solución:** `role="presentation"` en grupos no suprime `role="listitem"` de hijos

---

## 2. Brechas de SEO

### 2.1 Structured Data (JSON-LD)

#### 🔴 Bug Crítico: RentalLayout Silencia JSON-LD

**Archivo:** `src/layouts/RentalLayout.astro`  
**Problema:** El prop `jsonLd` está declarado en la interfaz Props (línea 37) pero **nunca se desestructura** (líneas 40-58) ni **se reenvía** a BaseLayout (líneas 66-70).

**Impacto:** Todo el structured data de productos en `/arriendo/[categoria]/[subcategoria]` (productSchemaExtended + breadcrumbSchema) se pierde silenciosamente. Google no puede generar rich snippets de productos.

**Solución inmediata:**
```astro
---
const {
  // ... otros props
  jsonLd,  // ← Agregar
} = Astro.props;
---

<BaseLayout
  // ... otros props
  jsonLd={jsonLd}  // ← Reenviar
>
```

---

#### Páginas sin JSON-LD Específico

| Página | Schema Necesario | Estado Actual |
|--------|------------------|---------------|
| `/seguridad` | Article o WebPage | Solo Organization + WebSite |
| `/servicios` (hub) | CollectionPage o ItemList | Solo base schemas |
| `/servicios/ingenieria` | Service | Solo base schemas |
| `/servicios/construccion` | Service | Solo base schemas |
| `/servicios/montajes` | Service | Solo base schemas |
| `/servicios/infraestructura-portuaria` | Service | Solo base schemas |
| `/nosotros` | AboutPage | Solo base schemas |
| `/proyectos` (hub) | CollectionPage o ItemList | Solo base schemas |

**Nota:** ServiceLayout no acepta prop `jsonLd` — debe agregarse a la interfaz y reenviarse.

---

#### Teléfono Incorrecto en Organization Schema

**Archivo:** `src/lib/seo.ts`  
**Problema:** `DEFAULT_CONFIG.phone` es `'+56 9 0000 0000'` (placeholder)  
**Valor correcto:** `'+56 9 5659 4144'` (en `src/data/site.ts`)

**Impacto:** El schema `Organization` en **todas las páginas** tiene un teléfono falso. Google puede mostrar información incorrecta en Knowledge Panel.

**Solución:**
```typescript
// src/lib/seo.ts
const DEFAULT_CONFIG: SiteConfig = {
  // ...
  phone: '+56 9 5659 4144',  // ← Corregir
  // ...
};
```

**Recomendación adicional:** `seo.ts` debería importar de `site.ts` para mantener single source of truth.

---

### 2.2 Meta Tags y OpenGraph

#### Meta Descriptions Muy Cortas

**Páginas de servicios** tienen descriptions de 4-8 palabras (deberían ser 50-160 caracteres):

| Página | Description Actual | Longitud |
|--------|-------------------|----------|
| `/servicios/ingenieria` | "De la idea a la obra, con respaldo tecnico" | 43 chars |
| `/servicios/construccion` | "Construccion con estandares de la gran mineria" | 47 chars |
| `/servicios/montajes` | "Montaje preciso, seguro y a tiempo" | 34 chars |
| `/servicios/infraestructura-portuaria` | "Obras maritimas integrales" | 26 chars |

**Solución:** Expandir a 140-160 caracteres con keywords relevantes y call-to-action.

---

#### OpenGraph Incompleto

**MetaTags.astro** emite correctamente:
- ✅ `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:locale` (es_CL), `og:site_name`
- ✅ `og:video` (condicional)
- ✅ `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

**Faltantes:**
- ❌ `og:image:alt` — importante para accesibilidad en redes sociales
- ❌ `og:image:width` / `og:image:height` — ayuda a plataformas a renderizar correctamente
- ❌ `twitter:site` — no hay handle de Twitter configurado (sitio tiene LinkedIn, Instagram, Facebook)
- ❌ `article:published_time`, `article:modified_time`, `article:section` — para páginas de noticias
- ❌ `fb:app_id` — para Facebook Insights

**Archivo faltante:** `/og-default.jpg` referenciado en MetaTags.astro no existe en `public/`

---

### 2.3 Contenido Placeholder

#### Páginas con Contenido Mínimo o Inexistente

| Página | Estado | Contenido Actual |
|--------|--------|------------------|
| `/aviso-legal` | 🔴 PLACEHOLDER | "Contenido del aviso legal." |
| `/privacidad` | 🔴 PLACEHOLDER | "Contenido de la politica de privacidad." |
| `/cookies` | 🔴 PLACEHOLDER | "Contenido de la politica de cookies." |
| `/canal-integridad` | 🔴 PLACEHOLDER | 1 oración: "Espacio seguro para realizar denuncias..." |
| `/proyectos/[slug]` | 🟡 MÍNIMO | Solo 1 path hardcodeado, contenido mínimo |
| `/servicios-industriales` | 🟡 MÍNIMO | "Hub de servicios industriales para mineria." |
| `/servicios-industriales/[servicio]` | 🟡 MÍNIMO | Solo 2 paths hardcodeados, 1 párrafo |
| `/cotizador` | 🟡 SIN H1 | No hay H1 visible (depende de QuoteWizard) |

**Impacto SEO:**
- Páginas legales placeholder pueden ser penalizadas por Google (thin content)
- Sin contenido real, no hay keywords para rankear
- Experiencia de usuario pobre

**Recomendación:**  
1. Agregar contenido legal real (consultar con abogado para cumplimiento chileno)
2. Integrar formulario externo de denuncias en `/canal-integridad`
3. Expandir `/proyectos/[slug]` con casos de estudio reales
4. Verificar que QuoteWizard renderiza H1 internamente

---

### 2.4 Páginas sin CTA (Call-to-Action)

| Página | Prioridad | Recomendación |
|--------|-----------|---------------|
| `/nosotros` | 🔴 ALTA | Agregar CTA a cotizador o contacto (página clave de conversión) |
| `/noticias/[post]` | 🟡 MEDIA | CTA "¿Necesitas este servicio? Cotiza ahora" |
| `/noticias` (hub) | 🟡 MEDIA | CTA "Suscríbete" o "Contáctanos" |
| `/proyectos/[slug]` | 🟡 MEDIA | CTA "Inicia tu proyecto similar" |
| `/servicios-industriales/*` | 🟢 BAJA | Sección parece abandonada (overlap con `/servicios/`) |

---

### 2.5 Hreflang y Multiidioma

**Estado:** Infraestructura presente pero no utilizada

- ✅ MetaTags.astro soporta prop `hreflang` y emite `x-default`
- ⚠️ Astro config solo define locale `es` con `prefixDefaultLocale: false`
- ❌ BaseLayout nunca pasa prop `hreflang` a MetaTags
- ❌ Ninguna página usa hreflang

**Impacto:** Si el sitio expande a otros idiomas (portugués para Brasil, inglés para inversionistas), la infraestructura está lista pero requiere activación.

---

### 2.6 Sitemap Filter Risk

**Archivo:** `astro.config.mjs` (líneas 29-32)

```javascript
filter: (page) => {
  const noIndexPaths = ['/gracias', '/404', '/500', '/aviso-legal', '/privacidad', '/cookies', '/cotizador'];
  return !noIndexPaths.some((path) => page.includes(path));
}
```

**Problema:** Usa `.includes(path)` (substring matching) en lugar de exact matching.  
**Riesgo:** Una página legítima como `/servicios/gracias-especiales` sería excluida accidentalmente.

**Solución:**
```javascript
filter: (page) => {
  const noIndexPaths = ['/gracias', '/404', '/500', '/aviso-legal', '/privacidad', '/cookies', '/cotizador'];
  return !noIndexPaths.some((path) => page.endsWith(path) || page.includes(path + '/'));
}
```

---

### 2.7 Organization Schema sin `sameAs`

**Archivo:** `src/lib/seo.ts`  
**Problema:** `organizationSchema()` no incluye array `sameAs` con perfiles sociales.

**Impacto:** Google no puede verificar y mostrar enlaces sociales en Knowledge Panel.

**Solución:**
```typescript
export function organizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    // ... campos existentes
    sameAs: [
      'https://www.linkedin.com/company/ip-proyectos-industriales',
      'https://www.instagram.com/ipproyectosindustriales',
      'https://www.facebook.com/ipproyectosindustriales',
    ],
  };
}
```

---

## 3. Brechas de Optimización (Performance)

### 3.1 Imágenes Responsive — 🔴 CRÍTICA

**Estado actual:** No se implementa `<picture>`, `srcset`, ni Astro `<Image>` component.

**Realidad:** El proyecto tiene **139 imágenes** (14.5 MB total) con variantes JPG + WebP + AVIF para el catálogo de rental, pero el código solo importa y usa las versiones AVIF:

```typescript
// src/data/rental.ts
import gruaGrove60t from '@/assets/imgs/rental/izaje/grua/grua-grove-rt-765-e/grua-grove-rt-765-e.avif';
```

**Problemas:**
1. Navegadores sin soporte AVIF (Safari < 16, IE) reciben archivo que no pueden renderizar
2. Variantes WebP y JPG existen en disco pero nunca se sirven (espacio desperdiciado)
3. Sin `srcset` / `sizes`, el navegador descarga la imagen completa aunque el viewport sea pequeño
4. Sin optimización de tamaños para diferentes breakpoints

**Solución recomendada:**

**Opción A: `<picture>` manual**
```astro
<picture>
  <source srcset={imageAvif} type="image/avif" />
  <source srcset={imageWebp} type="image/webp" />
  <img 
    src={imageJpg} 
    alt="Descripción"
    width={1200}
    height={800}
    loading="lazy"
    decoding="async"
  />
</picture>
```

**Opción B: Astro `<Image>` component (recomendado)**
```astro
---
import { Image } from 'astro:assets';
import originalImage from '@/assets/imgs/rental/izaje/grua/grua-grove-rt-765-e/grua-grove-rt-765-e.jpg';
---

<Image 
  src={originalImage}
  alt="Grúa Grove RT-765-E de 60 toneladas"
  width={1200}
  height={800}
  format="avif"
  quality={80}
  loading="lazy"
  decoding="async"
/>
```

**Configuración requerida en `astro.config.mjs`:**
```javascript
import { defineConfig } from 'astro/config';
import sharp from 'sharp';

export default defineConfig({
  // ... config existente
  image: {
    service: sharp,
    domains: ['ipproyectosindustriales.cl'],
  },
});
```

---

### 3.2 Imágenes sin Dimensiones HTML

**Problema:** Muchas imágenes usan CSS `aspect-ratio` pero no tienen atributos `width` / `height` en HTML.

**Impacto:** CLS (Cumulative Layout Shift) antes de que CSS cargue.

**Componentes afectados:**
- EquipmentCard.astro (usa `aspect-ratio: 4/3` pero `<img>` sin width/height)
- HeroMedia.astro (pasa width/height desde props, pero algunos callers pueden omitirlos)
- NewsGrid.astro, ProjectCard.astro, TeamGrid.astro (sin dimensiones explícitas)

**Solución:**
```astro
<img 
  src={image.src}
  alt="Descripción"
  width={image.width}   // ← Agregar
  height={image.height} // ← Agregar
  loading="lazy"
  decoding="async"
/>
```

**Nota:** Astro's imported images exponen `.width` y `.height` automáticamente.

---

### 3.3 Imágenes Root-Level sin Variantes Modernas

**14 imágenes JPG-only** en `src/assets/imgs/` (2.3 MB total):
- `hero.jpg`, `serv-montajes.jpg`, `serv-izaje.jpg`, `serv-ingenieria.jpg`, `serv-construccion.jpg`
- `faena-izaje.jpg`, `edificio.jpg`, `apoyo.jpg`, `portuaria.jpg`, `izaje.jpg`, `gruas.jpg`, `montajes.jpg`, `construccion.jpg`, `ingenieria.jpg`

**Acción:** Generar variantes WebP y AVIF usando sharp o Astro Image service.

---

### 3.4 PNG de 3.3 MB

**Archivo:** `src/assets/imgs/hero/arriendo/arriendo.png` (3,304 KB)  
**Versión AVIF:** 133 KB (96% más pequeña)

**Acción:** Eliminar PNG o re-comprimir. Solo servir AVIF + WebP + JPG fallback.

---

### 3.5 Videos sin Formato WebM

**3 videos MP4** (~7 MB total):
- `seguridad.mp4` (2.5 MB)
- `servicios.mp4` (2.4 MB)
- `arriendos.mp4` (2.3 MB)

**Oportunidad:** WebM ofrece 20-50% de reducción de tamaño.

**Solución:**
```astro
<video autoplay muted loop playsinline preload="metadata">
  <source src={videoWebm} type="video/webm" />
  <source src={videoMp4} type="video/mp4" />
  <img src={poster} alt="Fallback" />
</video>
```

---

### 3.6 Falta `decoding="async"` en Mayoría de Imágenes

**Estado actual:** Solo 3 imágenes tienen `decoding="async"` (hero images + logo).  
**Recomendación:** Agregar a todas las imágenes no-críticas (below-the-fold).

**Beneficio:** Permite al navegador decodificar imágenes en background thread, mejorando TTI (Time to Interactive).

---

### 3.7 Web App Manifest Ausente

**Estado:** No existe `manifest.json` o `manifest.webmanifest`.

**Impacto:**
- ❌ Sin prompt "Add to Home Screen" en móviles
- ❌ Sin theme color para browser chrome
- ❌ Lighthouse PWA audit falla

**Solución:** Crear `public/manifest.webmanifest`:
```json
{
  "name": "IP Proyectos Industriales",
  "short_name": "IP Industrial",
  "description": "Ingeniería, montajes y grúas de alto tonelaje para la minería",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0d1611",
  "theme_color": "#308f40",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Y vincular en `<head>`:
```html
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" content="#308f40" />
```

---

### 3.8 Favicon Incompleto

**Estado actual:**
- ✅ `favicon.ico` (655 B) — legacy
- ✅ `favicon.svg` (749 B) — moderno

**Faltantes:**
- ❌ `apple-touch-icon` (180x180 PNG) — iPhone/iPad home screen
- ❌ `favicon-16x16.png`, `favicon-32x32.png` — control explícito de tamaños
- ❌ `android-chrome-192x192.png`, `android-chrome-512x512.png` — para manifest
- ❌ `safari-pinned-tab.svg` — Safari pinned tabs

**Impacto:** Dispositivos Apple generan ícono de baja calidad automáticamente.

---

### 3.9 Catálogo PDF de 11.5 MB

**Archivo:** `public/catalogo.pdf` (12,102 KB)  
**Problema:** Archivo más grande del proyecto, servido sin compresión.

**Recomendaciones:**
1. Comprimir PDF (objetivo: < 5 MB)
2. Ofrecer descarga por secciones (capítulos)
3. Considerar versión web interactiva (HTML) para mejor SEO
4. Agregar `download` attribute en enlaces: `<a href="/catalogo.pdf" download>`

---

### 3.10 `.htaccess` — Falta `image/avif` en Cache Rules

**Archivo:** `public/.htaccess`

**Problema:** Reglas de compresión DEFLATE y cache Expires no incluyen `image/avif`.

**Solución:**
```apache
# Compresión
AddOutputFilterByType DEFLATE image/avif

# Cache
ExpiresByType image/avif "access plus 1 year"
```

---

### 3.11 Logos PNG Deberían Ser SVG

**Logos rasterizados:**
- `logo-adv.png` (20.6 KB)
- `logo_ipproyectosindustriales.png` (4.4 KB) — **logo principal del header**
- `logo_mecamin.png` (2.7 KB)
- `logo_energiadelvalle.avif` (7.7 KB) — formato inusual para logo

**Problema:** Logos PNG pueden verse borrosos en pantallas high-DPI cuando se redimensionan con CSS.

**Solución:** Convertir a SVG para escalabilidad infinita y menor tamaño.

---

### 3.12 Imágenes de Noticias Externas

**Archivo:** `src/data/news.ts`  
**Problema:** 3 artículos de noticias referencian imágenes de WordPress (`https://ipproyectosindustriales.cl/wp-content/uploads/...`)

**Impacto:**
- Dependencia de backend externo
- Sin optimización de formato (PNG a 1080x675)
- Sin control de cache

**Solución:** Descargar imágenes localmente o implementar fetch en build-time con optimización.

---

## 4. Recomendaciones Priorizadas

### 🔴 CRÍTICAS (Resolver Antes de Producción)

1. **Fix bug en RentalLayout** — JSON-LD de productos se pierde
2. **Corregir teléfono en seo.ts** — Schema Organization tiene placeholder
3. **Agregar `prefers-reduced-motion`** a Button, Navigation, QuoteFormAdvanced, BaseLayout reveal
4. **Implementar imágenes responsive** — `<picture>` o Astro `<Image>` con variantes JPG/WebP/AVIF
5. **Agregar width/height** a todas las imágenes para prevenir CLS
6. **Fix QuoteFormAdvanced accessibility** — labels con `for`, `aria-expanded`, `aria-controls`
7. **Fix ProjectGrid ARIA** — reemplazar `role="tablist"` con `role="group"` + `aria-pressed`
8. **Agregar contenido legal real** — aviso-legal, privacidad, cookies
9. **Eliminar PNG de 3.3 MB** — usar solo AVIF/WebP/JPG

### 🟡 ALTAS (Resolver en Próximo Sprint)

10. **Agregar JSON-LD a páginas faltantes** — servicios, nosotros, proyectos, seguridad
11. **Expandir meta descriptions** de páginas de servicios (50-160 chars)
12. **Agregar CTA a /nosotros** — página clave de conversión
13. **Refactor ContactSection** — usar Input/Textarea components del design system
14. **Agregar `og:image:alt`** — accesibilidad en redes sociales
15. **Crear `/og-default.jpg`** — fallback para social shares
16. **Agregar `sameAs` a Organization schema** — perfiles sociales
17. **Convertir logos PNG a SVG** — escalabilidad en high-DPI
18. **Agregar `decoding="async"`** a imágenes below-the-fold
19. **Fix sitemap filter** — usar exact matching en lugar de substring
20. **Refactor ContactSection** — usar componentes Input/Textarea del design system

### 🟢 MEDIAS (Mejoras Incrementales)

21. **Crear Web App Manifest** — PWA support
22. **Agregar apple-touch-icon** — iOS home screen
23. **Generar WebM videos** — 20-50% más pequeños que MP4
24. **Comprimir catalogo.pdf** — objetivo < 5 MB
25. **Generar variantes WebP/AVIF** para 14 imágenes root-level
26. **Actualizar .htaccess** — agregar `image/avif` a cache rules
27. **Agregar CTA a páginas de noticias** — conversión de lectores
28. **Unificar uso de Eyebrow component** — eliminar duplicación inline
29. **Hostear imágenes de noticias localmente** — independencia de WordPress
30. **Agregar loading state** a botones de formulario

### 🔵 BAJAS (Polish y Optimizaciones Futuras)

31. **Agregar `twitter:site` handle** — si se crea cuenta de Twitter/X
32. **Agregar `fb:app_id`** — Facebook Insights
33. **Agregar `article:published_time`** OG tags — para noticias
34. **Generar múltiples favicon sizes** — 16x16, 32x32, 96x96
35. **Agregar safari-pinned-tab.svg** — Safari pinned tabs
36. **Eliminar código comentado** en RentalLayout (líneas 175-177)
37. **Fix Container.astro** — implementar breakpoints de padding comentados
38. **Refactor RentalLayout/ServiceLayout** — extraer estilos compartidos
39. **Considerar versión web de catálogo PDF** — mejor SEO
40. **Activar fuentes licenciadas** (Plateia, Bliss Pro) cuando estén disponibles

---

## 5. Métricas de Calidad Actual

| Categoría | Score | Estado |
|-----------|-------|--------|
| **Arquitectura de componentes** | 8.5/10 | ✅ Excelente |
| **Sistema de diseño (tokens)** | 9/10 | ✅ Excelente |
| **SEO técnico (meta tags, canonical)** | 8/10 | ✅ Muy bueno |
| **JSON-LD / Structured data** | 6/10 | ⚠️ Brechas significativas |
| **Accesibilidad (ARIA, keyboard)** | 5/10 | ⚠️ Necesita trabajo |
| **prefers-reduced-motion** | 2/10 | 🔴 Crítico |
| **Optimización de imágenes** | 3/10 | 🔴 Crítico |
| **Performance (Core Web Vitals)** | 6/10 | ⚠️ Potencial sin explotar |
| **Contenido (completitud)** | 6/10 | ⚠️ 8 páginas placeholder |
| **Responsive design** | 8.5/10 | ✅ Muy bueno |
| **Code quality (limpieza, DRY)** | 7/10 | ✅ Bueno (duplicación en layouts) |

---

## 6. Próximos Pasos Recomendados

### Sprint 1 (Semana 1-2): Fixes Críticos
- [ ] Fix RentalLayout JSON-LD bug
- [ ] Corregir teléfono en seo.ts
- [ ] Implementar imágenes responsive (top 10 imágenes más pesadas)
- [ ] Agregar prefers-reduced-motion a componentes críticos

### Sprint 2 (Semana 3-4): Accesibilidad y SEO
- [ ] Fix QuoteFormAdvanced accessibility
- [ ] Fix ProjectGrid ARIA
- [ ] Agregar JSON-LD a páginas faltantes
- [ ] Expandir meta descriptions
- [ ] Crear contenido legal real

### Sprint 3 (Semana 5-6): Optimización y Polish
- [ ] Crear Web App Manifest
- [ ] Generar variantes de imágenes (WebP/AVIF) para root-level
- [ ] Comprimir catalogo.pdf
- [ ] Agregar CTAs a páginas faltantes
- [ ] Refactor layouts duplicados

---

## 7. Herramientas Recomendadas para Verificación

### Lighthouse Audits
```bash
# Performance, Accessibility, SEO, PWA
npx lighthouse https://ipproyectosindustriales.cl --view
```

### Validación de Structured Data
- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Schema Validator:** https://validator.schema.org/

### Core Web Vitals
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **WebPageTest:** https://www.webpagetest.org/

### Accesibilidad
- **axe DevTools:** Extensión de Chrome/Firefox
- **WAVE:** https://wave.webaim.org/

### SEO Técnico
- **Screaming Frog:** Crawl completo del sitio
- **Ahrefs Site Audit:** Análisis SEO comprehensivo

---

## 8. Conclusión

El proyecto tiene una **base técnica sólida** con buena arquitectura, sistema de diseño bien pensado y una infraestructura SEO robusta. Las brechas identificadas son **subsanables** y siguen patrones comunes en proyectos de esta escala.

**Fortalezas clave:**
- ✅ Componentes bien estructurados y reutilizables
- ✅ Sistema de tokens CSS comprehensive
- ✅ Infraestructura SEO (MetaTags, JsonLd, Breadcrumbs) bien diseñada
- ✅ Lazy loading implementado correctamente en mayoría de imágenes
- ✅ Responsive design bien ejecutado

**Áreas de mejora prioritarias:**
- 🔴 Accesibilidad (prefers-reduced-motion, ARIA en formularios)
- 🔴 Optimización de imágenes (responsive images, dimensiones HTML)
- 🟡 Contenido placeholder (páginas legales, proyectos)
- 🟡 JSON-LD en páginas faltantes

Con las correcciones de los Sprints 1-2, el proyecto estará listo para producción con una base sólida de SEO, accesibilidad y performance.

---

**Documento generado:** 2026-08-09  
**Total de brechas identificadas:** 40  
**Brechas críticas:** 9  
**Brechas altas:** 11  
**Brechas medias:** 10  
**Brechas bajas:** 10
