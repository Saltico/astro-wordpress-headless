# Plan: Integrar assets de maqueta HTML → sitio Astro con SEO

## Contexto

El sitio Astro actual de **IP Proyectos Industriales** (`POC1`) tiene un único asset de imagen local (`hero.jpg`, 237 KB) que se reutiliza como placeholder en ≥14 páginas, incluyendo el hero de la home. Esto es un anti-patrón SEO/UX: mismo `alt` semántico en contextos distintos, ninguna identidad visual por sección, y la home usa una imagen estática cuando el negocio se beneficia enormemente de mostrar movimiento (grúas izando, montajes, faena).

Existe una maqueta HTML estática previa en `D:\Proyectos\Transformación Digital\www.ipproyectosindustriales.cl\IP-Sitio-Web` con **3 videos HD** (servicios, arriendos, seguridad) y **13 imágenes referenciadas** organizadas por sección, más **3 posters**. Esta maqueta ya implementa el patrón hero con video full-width + overlay oscuro + tipografía blanca — exactamente lo que el sitio Astro actual tiene como CSS pero sin video.

Este plan migra el video del hero y todas las imágenes de la maqueta a sus secciones correctas en el sitio Astro, **manteniendo el dimensionamiento actual** del hero (`.d-hero` con `min-height: calc(65svh + 40px + 80px)` en escritorio) y aplicando las mejores prácticas de SEO para imagen y video, optimizadas para el negocio de ingeniería, montajes y arriendos de grúas para la gran minería en Chile.

## Objetivos SEO

- **Video del hero con LCP óptimo:** poster como `fetchpriority="high"`, video con `preload="metadata"` (no frames), `autoplay muted loop playsinline` para arrancar sin fricción, pausa con `IntersectionObserver` cuando sale del viewport.
- **Accesibilidad del video:** `aria-hidden="true"` (decorativo; el contenido semántico está en `.d-hero__content`), respeto a `prefers-reduced-motion`.
- **Schema.org `VideoObject`:** inyecto JSON-LD con `name`, `description`, `thumbnailUrl`, `contentUrl`, `uploadDate`, `duration` (ISO 8601), `width`, `height` para indexación de video en Google.
- **OpenGraph video:** `og:video`, `og:video:type`, `og:video:width`, `og:video:height`, `og:video:secure_url` en la home para preview enriquecido en redes.
- **Imágenes con CLS=0:** atributos `width` y `height` explícitos (del objeto importado por Vite) en todas las imágenes.
- **Imágenes con carga óptima:** `loading="eager" fetchpriority="high"` solo en hero poster; `loading="lazy" decoding="async"` en el resto.
- **Alt text específico y contextual:** cada imagen describe su contenido y rol en la página (no genéricos).
- **Metadatos del negocio:** todos los schemas referencian la marca "IP Proyectos Industriales" y el sector "gran minería en Chile".

## Alcance

### En scope (esta entrega)

- Video `servicios.mp4` + su poster en el hero de la home.
- 5 imágenes del bento de servicios en home: `serv-ingenieria`, `serv-construccion`, `serv-montajes`, `portuaria`, `serv-izaje` (destacado).
- 2 imágenes de `SplitSection` en home: `faena-izaje` (Quiénes somos), `montajes` (HSEC/Seguridad).
- 1 imagen del `CTABand` final: `edificio`.
- Imágenes de las 4 páginas de servicios individuales (hero + split): ingenieria, construccion, montajes, infraestructura-portuaria.
- Imagen de `servicios/index.astro` (bento): `ingenieria`.
- Imágenes de `arriendo/index.astro`: `gruas`, `izaje`, `apoyo`.
- Imagen de `compliance/hseq.astro` o `seguridad.astro` (la que exista): `montajes`.
- 3 videos y 3 posters copiados a `src/assets/videos/` para uso futuro (arriendos, seguridad).
- 2 componentes nuevos: `Video.astro` y `HeroMedia.astro`.
- Schema `VideoObject` helper en `lib/seo.ts`.
- Tags `og:video:*` en `MetaTags.astro` (opcional por página).
- Inyección de VideoObject JSON-LD en `BaseLayout.astro` cuando la página provee `videoJsonLd`.
- Build + deploy a Hostinger.

### Fuera de scope (recomendado para futuro, documentado al final)

- Páginas individuales `arriendo/{izaje,movimiento-tierra,transporte,equipos-especiales}` (8 imágenes restantes).
- Conversión de MP4 a WebM/VP9 (requeriría `ffmpeg`).
- Conversión de JPG a WebP/AVIF (requeriría `sharp`).
- Generación de `srcset` responsive con `astro:assets` `<Image>`.
- Unificación de `siteUrl` (3 fuentes: `astro.config.mjs`, `lib/seo.ts`, `data/site.ts`).
- Crear `og-default.jpg` 1200×630 real (actualmente placeholder 404).
- Quitar preloads de fonts WOFF2 que no existen en `public/fonts/`.
- Schema `LocalBusiness` con dirección física (no tenemos el dato).
- Twitter Card `player` (experimental, rompe preview en muchos clientes).

## Inventario de assets a copiar

**Origen:** `D:\Proyectos\Transformación Digital\www.ipproyectosindustriales.cl\IP-Sitio-Web\`

**Destino imágenes:** `D:\Proyectos\matiascastillo.com\Repos\Astro+WordPress headless\POC1\src\assets\imgs\`

| Origen | Destino | Tamaño | Dimensiones |
|--------|---------|--------|-------------|
| `img/serv-ingenieria.jpg` | `src/assets/imgs/serv-ingenieria.jpg` | 207 KB | 1500×1125 |
| `img/serv-construccion.jpg` | `src/assets/imgs/serv-construccion.jpg` | 151 KB | 1500×843 |
| `img/serv-montajes.jpg` | `src/assets/imgs/serv-montajes.jpg` | 156 KB | 1500×692 |
| `img/portuaria.jpg` | `src/assets/imgs/portuaria.jpg` | 94 KB | 1100×366 |
| `img/serv-izaje.jpg` | `src/assets/imgs/serv-izaje.jpg` | 172 KB | 1500×1125 |
| `img/faena-izaje.jpg` | `src/assets/imgs/faena-izaje.jpg` | 386 KB | 900×1600 |
| `img/edificio.jpg` | `src/assets/imgs/edificio.jpg` | 285 KB | 960×1280 |
| `img/montajes.jpg` | `src/assets/imgs/montajes.jpg` | 89 KB | 1100×512 |
| `img/ingenieria.jpg` | `src/assets/imgs/ingenieria.jpg` | 98 KB | 1100×776 |
| `img/construccion.jpg` | `src/assets/imgs/construccion.jpg` | 89 KB | 1100×492 |
| `img/gruas.jpg` | `src/assets/imgs/gruas.jpg` | 93 KB | 1100×366 |
| `img/izaje.jpg` | `src/assets/imgs/izaje.jpg` | 104 KB | 1100×825 |
| `img/apoyo.jpg` | `src/assets/imgs/apoyo.jpg` | 164 KB | 1100×825 |

**Destino videos y posters:** `D:\Proyectos\matiascastillo.com\Repos\Astro+WordPress headless\POC1\src\assets\videos\`

| Origen | Destino | Tamaño | Dimensiones |
|--------|---------|--------|-------------|
| `videos/servicios.mp4` | `src/assets/videos/servicios.mp4` | 8.36 MB | 1920×1080 |
| `videos/servicios-poster.jpg` | `src/assets/videos/servicios-poster.jpg` | 380 KB | 1920×1080 |
| `videos/arriendos.mp4` | `src/assets/videos/arriendos.mp4` | 8.68 MB | 1920×1080 |
| `videos/arriendos-poster.jpg` | `src/assets/videos/arriendos-poster.jpg` | 185 KB | 1920×1080 |
| `videos/seguridad.mp4` | `src/assets/videos/seguridad.mp4` | 8.68 MB | 1920×1080 |
| `videos/seguridad-poster.jpg` | `src/assets/videos/seguridad-poster.jpg` | 185 KB | 1920×1080 |

**Total a copiar:** 13 imágenes (~2.1 MB) + 3 videos (~25.7 MB) + 3 posters (~750 KB) ≈ 28.5 MB.

> **Nota sobre el path con tilde:** la carpeta `Transformación Digital` tiene carácter especial. Desde Node, los `readFile` con la ruta completa funcionan sin problema; desde PowerShell usar `-LiteralPath` si se hace por terminal.

## Cambios por archivo

### Crear

- **`src/components/ui/Video.astro`** — Componente `<video>` reutilizable. Props: `src`, `poster`, `sources?` (array para futuro WebM/MP4 dual), `width`, `height`, `autoplay?=true`, `muted?=true`, `loop?=true`, `playsinline?=true`, `preload?="metadata"`, `class?`, `ariaLabel?`, `respectReducedMotion?=true`. Renderiza `<video>` con todos los atributos correctos, inyecta `<script>` con `IntersectionObserver` para pausar cuando sale del viewport, respeta `prefers-reduced-motion` (si activo, fuerza `autoplay=false`). `aria-hidden="true"` por defecto. Sin `controls`. Acepta múltiples `<source>` (array de `{src, type}`) para futuro.

- **`src/components/ui/HeroMedia.astro`** — Wrapper de hero. Props: `videoSrc?`, `videoPoster?`, `fallbackImage?`, `fallbackAlt`, `class?`. Si hay `videoSrc`, renderiza `<Video>` con la imagen como `<link rel="preload" as="image" fetchpriority="high">` debe inyectarse en el `<head>` desde la página usando el slot `head` de `BaseLayout`. Si no, renderiza `<img>` con `loading="eager" fetchpriority="high"`. Mantiene el `min-height` del CSS actual (delegado al contenedor padre, no a este componente).

### Modificar

- **`src/lib/seo.ts`** — Añadir helper `videoSchema({ name, description, thumbnailUrl, contentUrl, duration, width, height, uploadDate? })` que devuelva un objeto `VideoObject` schema.org. `name` y `description` por defecto apuntan a IP Proyectos Industriales. `duration` en formato ISO 8601 (`PT15.8S`).

- **`src/components/seo/MetaTags.astro`** — Añadir props opcionales `ogVideo?: { url, type, width, height, secureUrl? }` que rendericen `og:video`, `og:video:type`, `og:video:width`, `og:video:height`, `og:video:secure_url` cuando se provean. Mantener compatibilidad (no romper páginas que no lo usen).

- **`src/layouts/BaseLayout.astro`** — Aceptar nueva prop opcional `videoJsonLd?: object` que se añade al array `allSchemas` que se pasa a `<JsonLd>`. Verificar que el slot `name="head"` ya existe y funciona.

- **`src/pages/index.astro`** — Sustituir el hero inline actual (líneas 124-145) por `<HeroMedia videoSrc={heroVideo.src} videoPoster={heroPoster.src} fallbackImage={heroImg.src} fallbackAlt="..." />`. Importar `heroVideo` y `heroPoster` desde `src/assets/videos/`. Pasar `videoJsonLd` y `ogVideo` al `BaseLayout`. Reemplazar las 5 imágenes del bento `services` (líneas 56-97) por las imágenes específicas importadas. Cambiar las imágenes de los 2 `SplitSection` (líneas 162, 193). Cambiar el `backgroundImage` del `CTABand` (línea 209). Actualizar todos los `alt` con textos específicos.

- **`src/pages/servicios/ingenieria.astro`** — Importar `serv-ingenieria.jpg` y `ingenieria.jpg`. Reemplazar el `backgroundImage` del `PageHero` y la `image` del `SplitSection`. Actualizar `alt`.

- **`src/pages/servicios/construccion.astro`** — Importar `serv-construccion.jpg` y `construccion.jpg`. Idem.

- **`src/pages/servicios/montajes.astro`** — Importar `serv-montajes.jpg` y `montajes.jpg`. Idem.

- **`src/pages/servicios/infraestructura-portuaria.astro`** — Importar `portuaria.jpg` y `portuaria.jpg` (o la misma). Reemplazar `PageHero` y `SplitSection`.

- **`src/pages/servicios/index.astro`** — Importar `ingenieria.jpg` para el bento si existe slot de imagen. Verificar primero.

- **`src/pages/arriendo/index.astro`** — Importar `gruas.jpg`, `izaje.jpg`, `apoyo.jpg`. Reemplazar imágenes de los servicios/equipos en el bento o grid.

- **`src/pages/compliance/hseq.astro` o `src/pages/seguridad.astro`** — Verificar cuál existe. Importar `montajes.jpg` para el hero o split de seguridad.

## Mapping de imágenes por página

| Página | Slot | Imagen actual | Imagen nueva | Alt text específico |
|--------|------|---------------|--------------|---------------------|
| `index.astro` (home) | Hero background | `heroImg.src` (jpg) | `servicios.mp4` + poster `servicios-poster.jpg` | (poster) "Vista aérea de faena minera con grúas de alto tonelaje en operación, IP Proyectos Industriales" |
| `index.astro` | Bento "Ingeniería" | `heroImg.src` | `serv-ingenieria.jpg` | "Ingeniería de detalle y modelado de proyectos mineros e industriales, IP Proyectos Industriales" |
| `index.astro` | Bento "Construcción" | `heroImg.src` | `serv-construccion.jpg` | "Obras civiles e industriales en faena minera, ejecución de contratos EPC, IP Proyectos Industriales" |
| `index.astro` | Bento "Montajes" | `heroImg.src` | `serv-montajes.jpg` | "Montaje electromecánico y estructural en planta industrial, IP Proyectos Industriales" |
| `index.astro` | Bento "Infraestructura portuaria" | `heroImg.src` | `portuaria.jpg` | "Construcción de muelle e infraestructura portuaria para la minería, IP Proyectos Industriales" |
| `index.astro` | Bento destacado "Rental" | `heroImg.src` | `serv-izaje.jpg` | "Grúas de alto tonelaje en operación, arriendo de equipos hasta 400 toneladas, IP Proyectos Industriales" |
| `index.astro` | SplitSection "Quiénes somos" | `heroImg.src` | `faena-izaje.jpg` | "Izaje en tándem con grúas de alto tonelaje en faena minera de Atacama, IP Proyectos Industriales" |
| `index.astro` | SplitSection "HSEC/Seguridad" | `heroImg.src` | `montajes.jpg` | "Trabajo seguro en faena con equipo usando EPP, sistema HSEC de IP Proyectos Industriales" |
| `index.astro` | CTABand final | `heroImg.src` | `edificio.jpg` | "Edificio corporativo de IP Proyectos Industriales en Chile" |
| `servicios/ingenieria.astro` | PageHero | (verificar) | `serv-ingenieria.jpg` | "Ingeniería con foco en constructibilidad para proyectos mineros, IP Proyectos Industriales" |
| `servicios/ingenieria.astro` | SplitSection | (verificar) | `ingenieria.jpg` | "Diseño e ingeniería de detalle en faena minera, IP Proyectos Industriales" |
| `servicios/construccion.astro` | PageHero | (verificar) | `serv-construccion.jpg` | "Obras civiles e industriales para la minería, IP Proyectos Industriales" |
| `servicios/construccion.astro` | SplitSection | (verificar) | `construccion.jpg` | "Ejecución de contratos EPC y prefabricados en faena, IP Proyectos Industriales" |
| `servicios/montajes.astro` | PageHero | (verificar) | `serv-montajes.jpg` | "Montajes mineros e industriales en faena, IP Proyectos Industriales" |
| `servicios/montajes.astro` | SplitSection | (verificar) | `montajes.jpg` | "Montaje electromecánico y estructural con foco en seguridad, IP Proyectos Industriales" |
| `servicios/infraestructura-portuaria.astro` | PageHero | (verificar) | `portuaria.jpg` | "Infraestructura para puertos y terminales al servicio de la minería, IP Proyectos Industriales" |
| `servicios/index.astro` | Bento | (verificar) | `ingenieria.jpg` | "Ingeniería con foco en constructibilidad, IP Proyectos Industriales" |
| `arriendo/index.astro` | Servicio "Alto tonelaje" | (verificar) | `gruas.jpg` | "Grúa de gran capacidad de la flota de arriendo de IP Proyectos Industriales" |
| `arriendo/index.astro` | Servicio "Capacidad media" | (verificar) | `izaje.jpg` | "Grúa de capacidad media en faena, flota de arriendo IP Proyectos Industriales" |
| `arriendo/index.astro` | Servicio "Apoyo" | (verificar) | `apoyo.jpg` | "Equipos de apoyo a faena minera, arriendo IP Proyectos Industriales" |
| `compliance/hseq.astro` o `seguridad.astro` | Hero/Split | (verificar) | `montajes.jpg` | "Operación con estándares de cumplimiento HSEC en faena minera, IP Proyectos Industriales" |

## Mapeo de video del hero

```ts
// src/pages/index.astro
import heroVideo from '@/assets/videos/servicios.mp4';
import heroPoster from '@/assets/videos/servicios-poster.jpg';

// Atributos del <video>:
// autoplay muted loop playsinline preload="metadata" poster={heroPoster.src}
// aria-hidden="true"
// width={1920} height={1080}

// <link rel="preload" as="image" href={heroPoster.src} fetchpriority="high">
// inyectado en el slot "head" de BaseLayout

// videoSchema:
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "IP Proyectos Industriales — Servicios de ingeniería y grúas de alto tonelaje",
  "description": "Video institucional de IP Proyectos Industriales mostrando servicios de ingeniería, montajes y arriendo de grúas para la gran minería en Chile.",
  "thumbnailUrl": "<siteUrl>/<path-absoluto-del-poster>",
  "contentUrl": "<siteUrl>/<path-absoluto-del-video>",
  "uploadDate": "<fecha-actual-ISO-8601>",
  "duration": "PT15.8S",
  "width": 1920,
  "height": 1080
}

// og:video tags:
// og:video, og:video:type=video/mp4, og:video:width=1920, og:video:height=1080
```

## Verificación (Definition of Done)

- [ ] 13 imágenes + 3 videos + 3 posters copiados a `src/assets/`.
- [ ] `src/components/ui/Video.astro` creado con IntersectionObserver y `prefers-reduced-motion`.
- [ ] `src/components/ui/HeroMedia.astro` creado.
- [ ] `videoSchema()` añadido a `src/lib/seo.ts`.
- [ ] `ogVideo` opcional añadido a `src/components/seo/MetaTags.astro`.
- [ ] `videoJsonLd` opcional añadido a `src/layouts/BaseLayout.astro`.
- [ ] Hero de `index.astro` sustituido por `<HeroMedia>` con video + poster.
- [ ] 5 imágenes del bento de servicios en home reemplazadas.
- [ ] 2 SplitSection + 1 CTABand de home con imágenes específicas.
- [ ] 4 páginas de servicios individuales con imágenes específicas.
- [ ] `servicios/index.astro`, `arriendo/index.astro`, `compliance/hseq.astro` o `seguridad.astro` con imágenes específicas.
- [ ] Todos los `alt` text son específicos y contextuales (ver tabla de mapping).
- [ ] Todos los `<img>` tienen `width`, `height`, `decoding="async"`.
- [ ] `loading="eager" fetchpriority="high"` solo en hero poster.
- [ ] `<link rel="preload" as="image" fetchpriority="high">` para el poster del hero en `<head>`.
- [ ] VideoObject JSON-LD presente en el HTML serializado de la home.
- [ ] `og:video*` tags presentes en la home.
- [ ] `npm run build` sin errores ni warnings de Astro.
- [ ] `npm run deploy` exitoso.
- [ ] Sitio responde HTTP 200 en `https://orangered-deer-742907.hostingersite.com/`.
- [ ] El video del hero se reproduce automáticamente (autoplay) en el sitio desplegado.
- [ ] El poster se muestra antes de que el video cargue (LCP).
- [ ] Con DevTools, no hay 404s en la consola.
- [ ] Lighthouse (opcional) — Performance ≥ 80, LCP < 2.5s, CLS = 0.

## Riesgos y mitigaciones

- **Riesgo:** el video de 8.36 MB puede penalizar el LCP. **Mitigación:** el poster (LCP real) se precarga con `fetchpriority="high"`; el video arranca con `preload="metadata"` (solo metadata, no frames) y se promueve a `preload="auto"` solo cuando JS confirma que el viewport es visible.

- **Riesgo:** la pausa con `IntersectionObserver` puede no funcionar en iOS Safari con algunos atributos. **Mitigación:** dejar `loop` y `playsinline` activos como red de seguridad; el peor caso es que el video siga reproduciéndose en background, pero con `muted` no hay audio.

- **Riesgo:** `import img from '@/assets/imgs/x.jpg'` puede no devolver `width`/`height` si Astro/Vite no los infiere. **Mitigación:** hardcodear `width` y `height` en cada `<img>` con los valores documentados en la tabla de inventario (no afecta al bundle, son atributos HTML).

- **Riesgo:** el path de origen `Transformación Digital` tiene tilde, puede fallar en algunos comandos. **Mitigación:** todas las copias se hacen con `fs.cp` o `copy` de PowerShell con `-LiteralPath`; desde Node los streams funcionan sin problema.

- **Riesgo:** cambiar todas las imágenes de golpe puede romper el layout si los aspect ratios son muy distintos. **Mitigación:** usar `style="aspect-ratio: w/h"` en el CSS de cada componente o mantener el `object-fit: cover` actual.

- **Riesgo:** las páginas que reciben imágenes nuevas pueden no tener slot para ellas. **Mitigación:** verificar primero qué props acepta cada componente (`PageHero`, `SplitSection`, `ServicesGrid`); si no hay slot, dejar la imagen del placeholder actual y documentar.

## Recomendaciones para futuro (NO en esta entrega)

1. **Conversión a WebM/VP9** para los 3 videos — ahorro estimado ~30% del peso. Requiere instalar `ffmpeg` y un script de build.
2. **Conversión de JPG a WebP/AVIF** con `sharp` — generar variantes responsive con `srcset`.
3. **Migración a `<Image>` de `astro:assets`** — built-in en Astro 7, da WebP/AVIF automático + srcset + lazy injection. Es invasivo (refactor de todos los componentes que reciben `image: string`) pero elimina el anti-patrón del placeholder.
4. **Unificar `siteUrl`** en una sola fuente: derivar de `Astro.site` que ya viene de `astro.config.mjs` y eliminar la duplicación en `lib/seo.ts` y `data/site.ts`.
5. **Crear `og-default.jpg` 1200×630** real (placeholder actual devuelve 404 en redes sociales).
6. **Resolver preloads de fonts WOFF2** que no existen en `public/fonts/` (líneas 126-127 de `BaseLayout.astro`) — o subirlos o quitarlos.
7. **Implementar las 8 imágenes restantes** de las páginas individuales de arriendo (`arriendo-izaje`, `arriendo-movimiento-tierra`, `arriendo-transporte`, `arriendo-equipos-especiales`).
8. **Schema `LocalBusiness`** con dirección física cuando se tenga el dato (ataca SEO local de Atacama/Coquimbo).
9. **Optimizar el poster del hero** (380 KB) — re-exportar a calidad ~75 JPEG o WebP (~80-100 KB) sin pérdida visual.
10. **Lazy-hydrate del video** con `loading="lazy"` en el `<video>` cuando Astro lo soporte (no soportado en todos los navegadores, requiere polyfill).
