# Fase 3: Homepage Corporativa

**Complejidad:** Alta  
**Dependencias:** Fase 1 (configuracion)  
**Archivos a modificar/crear:** 1 principal (`src/pages/index.astro`)

## Objetivo

Transformar la homepage de rental-first (con buscador de equipos y CTAs al cotizador) a una homepage corporativa informativa que presente a IP Proyectos Industriales como empresa integral de servicios para la mineria.

**IMPORTANTE:** Usar los componentes del design system existente, NO crear clases CSS inline.

---

## Estructura de secciones (basada en referencia HTML)

| # | Seccion | Componente del Design System | Estado |
|---|---------|------------------------------|--------|
| 1 | Hero con video | `HeroVideo.astro` (nuevo) | **Creado** |
| 2 | Stats Counter | `StatsCounter.astro` | **Usar componente** |
| 3 | Marquee de servicios | `ServiceMarquee.astro` (nuevo) | **Creado** |
| 4 | Quienes Somos | `SplitSection.astro` (variant="default", ghostText="IP") | **Usar componente** |
| 5 | Servicios (bento grid) | `ServiceBentoGrid.astro` (nuevo) | **Creado** |
| 6 | Seguridad / HSEC | `SplitSection.astro` (variant="reversed", ghostText="HSEC", miniStats) | **Usar componente** |
| 7 | Carrusel de clientes | `LogoCarousel.astro` | **Usar componente** |
| 8 | CTA Band | `CTABand.astro` | **Usar componente** |
| 9 | Noticias | `NewsGrid.astro` | **Usar componente** |

## Componentes del Design System disponibles

| Componente | Uso |
|------------|-----|
| `HeroVideo` | Hero con video de fondo, overlay gradient, eyebrow, título con highlight, CTAs |
| `HeroSection` | Hero con imagen de fondo (alternativa si no hay video) |
| `SplitSection` | Seccion dividida texto+imagen con ghost text, mini stats, features, CTA |
| `ServiceBentoGrid` | Grid bento asimétrico de servicios con tarjeta destacada |
| `ServiceMarquee` | Marquee/carrusel infinito de texto con servicios |
| `SectionLayout` | Wrapper de seccion con spacing y alt background |
| `Container` | Contenedor max-width |
| `StatsCounter` | Contador animado de stats |
| `LogoCarousel` | Carrusel de logos de clientes |
| `CTABand` | Banda CTA con imagen de fondo |
| `Eyebrow` | Texto eyebrow con linea decorativa |
| `Button` | Boton unificado (primary/ghost, md/lg) |
| `NewsGrid` | Grid de noticias con cards |
| `Icon` | Iconos SVG |

---

## Tarea 3.1: Hero con Video

**Archivo:** `src/pages/index.astro`

### Usar componente `HeroVideo`:

```astro
<HeroVideo
  videoSrc="/videos/servicios.mp4"
  poster={faenaIzaje.src}
  eyebrow="Desde el año 2000 junto a la Gran Minería"
  title="La pasión y el valor por un trabajo bien hecho"
  titleHighlight="trabajo bien hecho"
  subtitle="Ingeniería, construcción, montajes y Rental de equipos. Todo de principio a fin, con una sola empresa."
  minHeight="lg"
  ctaPrimary={{ label: 'Contactar', href: '/contacto' }}
  ctaSecondary={{ 
    label: 'WhatsApp', 
    href: `https://wa.me/${siteContact.whatsappNumber}?text=...`,
    external: true 
  }}
/>
```

### Props disponibles de HeroVideo:
- `videoSrc`: ruta al video MP4 (requerido)
- `poster`: imagen de fallback mientras carga el video (opcional)
- `eyebrow`: texto superior decorado
- `title`: título principal
- `titleHighlight`: texto que se resaltará en verde dentro del título
- `subtitle`: subtítulo
- `ctaPrimary`, `ctaSecondary`: botones CTA
- `minHeight`: 'sm' | 'md' | 'lg'

### Estructura visual (basada en HTML referencia):
- Video de fondo con `autoplay muted loop playsinline`
- Overlay gradient: `linear-gradient(180deg, rgba(13,22,17,.3) 0%, rgba(13,22,17,.1) 40%, rgba(13,22,17,.4) 70%, rgba(13,22,17,.85) 100%)`
- Contenido alineado abajo con padding-bottom generoso
- Scroll indicator en la parte inferior
- Título con texto resaltado en verde (`<b>` con color brand-300)

### Correcciones aplicadas:
- Overlay menos oscuro para permitir ver el video
- Script para manejar autoplay bloqueado por navegadores (fallback a poster + intentar reproducir en interacción del usuario)
- Manejo correcto de rutas de assets de Astro para el poster

---

## Tarea 3.2: Stats Counter - Ajustar datos

**Archivo:** `src/pages/index.astro`

```diff
  const stats: StatItem[] = [
    { value: 25, label: 'Anos de experiencia', prefix: '+', prefixPosition: 'before' },
    { value: 100, label: 'Equipos propios', prefix: '+', prefixPosition: 'before' },
    { value: 400, label: 'Capacidad de izaje', suffix: 'Tons', suffixPosition: 'after' },
-   { value: 24, label: 'Disponibilidad', suffix: '/7', suffixPosition: 'after' },
+   { value: 5, label: 'Lineas de servicio' },
  ];
```

---

## Tarea 3.3: Marquee de Servicios

**Archivo:** `src/pages/index.astro`

### Usar componente `ServiceMarquee`:

```astro
<ServiceMarquee 
  items={['Ingeniería', 'Construcción', 'Montajes mineros e industriales', 'Rental de equipos']} 
/>
```

### Props disponibles:
- `items`: array de strings con los textos
- `separator`: carácter separador (default: '◆')

### Estructura visual (basada en HTML referencia):
- Fondo verde brand (`--color-brand`)
- Texto blanco, uppercase, font-weight 800, Archivo
- Animación CSS `@keyframes` con `translateX(-50%)`
- Pausa en hover
- Accesible: `aria-hidden="true"` (decorativo)
- Separadores `◆` entre textos con opacidad reducida

---

## Tarea 3.4: Seccion "Quienes Somos"

**En:** `src/pages/index.astro` (inline) o usar `SplitSection.astro`

**Layout:** 2 columnas (imagen + texto)
- **Imagen:** `img/faena-izaje.jpg` o equivalente (izaje en tandem con gruas)
- **Eyebrow:** "Quienes somos"
- **H2:** "En el corazon de los proyectos industriales mas desafiantes"
- **Texto:** "IP Proyectos Industriales se posiciona como referente en izajes seguros y eficientes, combinando tecnologia de vanguardia con un equipo humano de alto nivel. Mas de 25 anos apoyando a la gran mineria de Chile."
- **CTA:** "Conocer la empresa" -> `/#empresa` o `/servicios`
- **Ghost text:** "IP" como fondo decorativo gigante

---

## Tarea 3.5: Seccion de Servicios (Bento Grid)

**Archivo:** `src/pages/index.astro`

### Usar componente `ServiceBentoGrid`:

```astro
<ServiceBentoGrid
  eyebrow="Lo que hacemos"
  title="Una sola empresa para todo el ciclo de tu proyecto"
  services={services}
/>
```

### Props disponibles:
- `eyebrow`: texto superior decorado
- `title`: título de la sección
- `services`: array de ServiceCard (4 tarjetas regulares)
- `featuredService`: FeaturedServiceCard (tarjeta destacada más grande) - **OPCIONAL**

### Estructura de ServiceCard:
```typescript
{
  category: string;      // Categoría (ej: "Ingeniería")
  title: string;         // Título de la tarjeta
  description: string;   // Descripción corta
  image: string;         // URL de la imagen
  imageAlt: string;      // Alt text de la imagen
  url: string;           // Link de la tarjeta
  linkLabel?: string;    // Texto del link (default: "Conocer")
}
```

### Estructura visual:
- **Sin featuredService**: Grid 2x2 (4 tarjetas en desktop)
- **Con featuredService**: Grid asimétrico 3 columnas, tarjeta destacada ocupa columna 3 filas 1-2
- Cards con imagen arriba, categoría (eyebrow verde), título, descripción y link
- Hover: translateY(-4px) + border-color brand
- Responsive: 2 columnas en tablet, 1 columna en mobile

### Servicios incluidos:
1. Ingeniería - `/servicios/ingenieria`
2. Construcción - `/servicios/construccion`
3. Montajes - `/servicios/montajes`
4. Infraestructura portuaria - `/servicios/infraestructura-portuaria`

---

## Tarea 3.5b: Sección Rental de Equipos (nueva)

**Archivo:** `src/pages/index.astro`

### Usar componente `SplitSection`:

```astro
<SplitSection
  eyebrow="Rental de equipos"
  title="Grúas de alto tonelaje y maquinaria especializada"
  description="Hasta 400 toneladas. Grúas AT/RT, alza-hombre, camión pluma y manipuladores, con operadores certificados. Más movimiento de tierra, transporte y equipos especiales para tu faena."
  image={servIzaje.src}
  imageAlt="Grúas de alto tonelaje en faena minera"
  imageWidth={servIzaje.width}
  imageHeight={servIzaje.height}
  miniStats={[
    { value: '400', label: 'Toneladas capacidad' },
    { value: '+100', label: 'Equipos propios' },
    { value: '24/7', label: 'Disponibilidad' },
  ]}
  cta={{ label: 'Cotizar en iprental.cl', href: `${IPRENTAL_URL}/arriendo` }}
  variant="default"
  background="dark"
  ghostText="RENTAL"
/>
```

### Características:
- Sección dedicada al rental de equipos
- Mini-stats con datos clave (400 Tons, +100 equipos, 24/7)
- CTA que redirige a `iprental.cl/arriendo` (variable de entorno)
- Ghost text "RENTAL" como fondo decorativo
- Layout: imagen a la izquierda, contenido a la derecha

---

## Tarea 3.6: Seccion Seguridad / HSEC

**En:** `src/pages/index.astro` (inline) o usar `SplitSection.astro`

**Layout:** 2 columnas (texto + imagen) - inverso a Quienes Somos
- **Eyebrow:** "Seguridad, salud y medio ambiente"
- **H2:** "El cuidado de las personas es nuestro primer estandar"
- **Texto:** "Contamos con un Departamento de Prevencion de Riesgos y Medio Ambiente propio, y un Sistema de Gestion HSEC que respalda cada faena."
- **Mini-stats:**
  - 460.000 Horas hombre trabajadas
  - 0,93% Tasa de cotizacion (R12)
  - Bajo Riesgo psicosocial
- **CTA:** "Conocer Seguridad" -> `/seguridad`
- **Ghost text:** "HSEC" como fondo decorativo
- **Imagen:** `img/montajes.jpg` o equivalente

---

## Tarea 3.7: CTABand - Cambiar a "Contactar"

**Archivo:** `src/pages/index.astro`

```diff
  <CTABand
-   eyebrow="Cotiza tu equipo ahora"
-   title="¿Necesitas arrendar maquinaria? Cotiza en minutos"
+   eyebrow="Hablemos"
+   title="Tu proximo proyecto empieza con una conversacion"
    backgroundImage={...}
    buttons={[
-     { label: 'Ir al cotizador', href: '/cotizador', variant: 'primary', icon: 'arrow-right' },
-     { label: 'Hablar por WhatsApp', href: 'https://wa.me/...', variant: 'outline', external: true, icon: 'whatsapp' },
+     { label: 'Contactar', href: '/contacto', variant: 'primary', icon: 'arrow-right', ariaLabel: 'Ir al formulario de contacto' },
+     { label: 'WhatsApp', href: 'https://wa.me/56956594144?text=Hola%20IP%20Proyectos%20Industriales%2C%20quisiera%20conversar%20sobre%20un%20proyecto.', variant: 'outline', external: true, icon: 'whatsapp' },
    ]}
  />
```

---

## Tarea 3.8: Seccion de Noticias

**En:** `src/pages/index.astro`

**Layout:** Grid de 3 posts recientes (similar a `NewsGrid.astro`)
- Eyebrow: "Ultimas noticias"
- H2: "Novedades"
- Texto lateral: "Operaciones, seguridad y crecimiento de nuestra flota. Siguenos para conocer nuestros proyectos mas recientes."
- 3 tarjetas de noticias con imagen, fecha, titulo y link "Leer articulo"
- Datos tomados de `src/data/news.ts` (3 mas recientes)

Si ya existe `NewsGrid.astro`, reutilizarlo. Si no, crear inline con el mismo patron de tarjetas de la referencia.

---

## Tarea 3.9: SEO de la homepage

**Archivo:** `src/pages/index.astro`

```diff
- const title = 'Arriendo de Maquinaria Pesada en el Norte de Chile | IP Proyectos Industriales';
- const description = 'Arriendo de grúas, movimiento de tierra, transporte y equipos especiales para minería e industria. Disponibilidad 24/7 en Atacama, Coquimbo y Antofagasta. Cotiza online.';
+ const title = 'IP Proyectos Industriales | Ingeniería, montajes y grúas de alto tonelaje para la minería';
+ const description = 'IP Proyectos Industriales: ingeniería, construcción, montajes e izajes de alto tonelaje (hasta 400 t) para la gran minería en Atacama y Coquimbo. Conoce nuestra experiencia y contáctanos.';
```

---

## Retirar de la homepage

- `EquipmentSearch` (buscador de equipos en hero)
- `CategoryShowcase` (showcase de categorias rental)
- Toda referencia a "cotizador" e "ir al cotizador"

---

## Criterios de aceptacion

- [ ] Hero muestra video de fondo con texto corporativo y título con highlight
- [ ] Video se reproduce automáticamente o muestra poster como fallback
- [ ] Stats muestra 4 datos: +25 anos, +100 equipos, 400 Tons, 5 lineas
- [ ] Marquee de servicios visible con animacion infinita
- [ ] Seccion "Quienes somos" con imagen y texto corporativo
- [ ] Grid de 4 servicios (Ingeniería, Construcción, Montajes, Portuaria) sin rental
- [ ] Sección dedicada "Rental de equipos" con mini-stats y CTA a iprental.cl
- [ ] Seccion HSEC con mini-stats de seguridad
- [ ] Carrusel de clientes funcional
- [ ] CTABand con botones "Contactar" y "WhatsApp"
- [ ] Seccion de noticias con 3 posts recientes
- [ ] Meta tags SEO actualizados
- [ ] Responsive correcto en todas las secciones
- [ ] `npm run build` sin errores

---

## Nuevos componentes creados

### `src/components/ui/HeroVideo.astro`
Hero con video de fondo, overlay gradient y contenido alineado abajo.

**Props:**
- `videoSrc`: ruta al video MP4 (requerido)
- `poster`: imagen de fallback (opcional)
- `eyebrow`, `title`, `titleHighlight`, `subtitle`
- `ctaPrimary`, `ctaSecondary`
- `minHeight`: 'sm' | 'md' | 'lg'

**Características especiales:**
- Script para manejar autoplay bloqueado por navegadores
- Fallback a poster si el video no se puede reproducir
- Intenta reproducir video en interacción del usuario (click, scroll, keydown)
- Manejo correcto de rutas de assets de Astro para el poster

**Tokens CSS utilizados:**
- `--color-graphite`, `--color-on-dark`, `--color-brand-300`
- `--font-heading`
- `--topbar-height`, `--header-height`
- `--space-*`

### `src/components/ui/ServiceMarquee.astro`
Marquee/carrusel infinito de texto con servicios.

**Props:**
- `items`: array de strings (requerido)
- `separator`: carácter separador (default: '◆')

**Tokens CSS utilizados:**
- `--color-brand`, `--color-on-brand`
- `--font-heading`
- `--space-*`

### `src/components/ui/ServiceBentoGrid.astro`
Grid bento asimétrico de servicios con tarjeta destacada opcional.

**Props:**
- `eyebrow`, `title`
- `services`: array de ServiceCard
- `featuredService`: FeaturedServiceCard (opcional)

**Comportamiento:**
- Sin `featuredService`: Grid 2x2 (4 tarjetas en desktop)
- Con `featuredService`: Grid asimétrico 3 columnas, tarjeta destacada ocupa columna 3 filas 1-2

**Tokens CSS utilizados:**
- `--theme-bg-alt`, `--theme-bg-elevated`, `--theme-border`
- `--theme-heading`, `--theme-text`, `--theme-text-muted`, `--theme-eyebrow`
- `--color-brand`
- `--font-heading`
- `--text-*`, `--space-*`, `--radius-lg`
- `--motion-base`, `--motion-slow`, `--ease-out`
