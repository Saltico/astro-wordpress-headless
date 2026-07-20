# Plan: Expansión del Catálogo de Arriendo — Páginas derivadas por equipo

## 1. Diagnóstico del estado actual

Existen **dos sistemas paralelos** que deben consolidarse:

| Ruta | Sistema | Estado |
|------|---------|--------|
| `/arriendos/` | Páginas estáticas con `RentalLayout` | ✅ Pulidas, con diseño hero, features, CTAs |
| `/arriendo-maquinaria/` | Rutas dinámicas `[categoria]/[equipo]` | ⚠️ Preliminar, solo 2 categorías y 1 equipo |

### Árbol actual

```
/arriendos/
├── index.astro              ← Hub principal (4 categorías)
├── izaje.astro              ← Categoria: Grúas alto tonelaje
├── movimiento-tierra.astro  ← Categoria: Excavación y nivelación
├── transporte.astro         ← Categoria: Transporte carga pesada
└── equipos-especiales.astro ← Categoria: Equipos especializados

/arriendo-maquinaria/
├── index.astro              ← Hub secundario (casi vacío)
├── [categoria].astro        ← Solo: gruas-alto-tonelaje, equipos-de-izaje
└── [categoria]/
    └── [equipo].astro       ← Solo: gruas-alto-tonelaje/gruas-grove-gmk
```

**Problemas:**
- Duplicación de hubs (`/arriendos/` y `/arriendo-maquinaria/`)
- `/arriendo-maquinaria/` no tiene diseño consistente ni usa `RentalLayout`
- No hay subcategorías de equipo individual (ej: `/arriendos/izaje/gruas-at`, `/arriendos/izaje/alza-hombre`)
- Las features están硬codeadas en cada página `.astro` en vez de en un source of truth

---

## 2. Estructura propuesta (consolidada)

### Árbol de URLs final

```
/arriendos/
├── index.astro                          ← Hub del catálogo completo
│
├── izaje/                               ← Categoría
│   ├── index.astro                      ←   Hub de izaje
│   ├── gruas-at.astro                   ←   Sub: Grúas todo terreno (AT)
│   ├── gruas-rt.astro                   ←   Sub: Grúas rough terrain (RT)
│   ├── alza-hombre.astro                ←   Sub: Alza-hombre y plataformas
│   └── gruas-grove-gmk.astro            ←   Modelo específico (ejemplo)
│
├── movimiento-tierra/                   ← Categoría
│   ├── index.astro                      ←   Hub de movimiento de tierra
│   ├── excavadoras.astro                ←   Sub: Excavadoras hidráulicas
│   ├── cargadores-frontales.astro       ←   Sub: Cargadores frontales
│   ├── motoniveladoras.astro            ←   Sub: Motoniveladoras
│   └── compactadores.astro              ←   Sub: Compactadores y rodillos
│
├── transporte/                          ← Categoría
│   ├── index.astro                      ←   Hub de transporte
│   ├── camiones-alto-tonelaje.astro     ←   Sub: Camiones de alto tonelaje
│   ├── plataformas-low-boy.astro        ←   Sub: Plataformas y low boy
│   └── cargas-especiales.astro          ←   Sub: Cargas sobredimensionadas
│
└── equipos-especiales/                  ← Categoría
    ├── index.astro                      ←   Hub de equipos especiales
    ├── manipuladores-telescopicos.astro ←   Sub: Telehandlers
    ├── camiones-pluma.astro             ←   Sub: Camiones pluma
    ├── plataformas-elevadoras.astro     ←   Sub: Plataformas articuladas/telescópicas
    └── generadores-soldadura.astro      ←   Sub: Generadores y soldadura
```

**Total de páginas nuevas por crear:** ~17 (contando hubs de categoría y subcategorías)

### Arquitectura de routing recomendada

En lugar de 17 archivos `.astro` estáticos, usar **rutas dinámicas** con `getStaticPaths()`:

```
src/pages/arriendos/
├── index.astro                       ← /arriendos/
└── [categoria]/
    ├── index.astro                   ← /arriendos/izaje/ , /arriendos/transporte/ , etc.
    └── [subcategoria].astro          ← /arriendos/izaje/gruas-at , etc.
```

Esto se alinea con el patrón que ya existe en `/arriendo-maquinaria/[categoria]/[equipo].astro` pero aplicado al sistema `/arriendos/` que tiene el diseño correcto.

---

## 3. Data source of truth

Crear un archivo central de datos para que todas las páginas consuman desde un solo lugar:

```typescript
// src/data/rental.ts
// Catálogo completo de equipos de arriendo

export interface RentalCategory {
  slug: string;            // "izaje"
  name: string;            // "Izaje"
  shortDesc: string;       // "Gúas de alto tonelaje"
  description: string;     // Párrafo SEO para el hub de categoría
  heroImage: string;
  seoTitle: string;
  seoDescription: string;
  subcategories: RentalSubcategory[];
}

export interface RentalSubcategory {
  slug: string;            // "gruas-at"
  name: string;            // "Grúas todo terreno (AT)"
  shortDesc: string;
  description: string;     // Párrafo completo para la página individual
  features: string[];      // Características / qué incluye
  specs?: {                // Especificaciones técnicas (opcional)
    label: string;
    value: string;
  }[];
  heroImage: string;
  seoTitle: string;
  seoDescription: string;
  whatsappMessage: string;
}
```

**Ventajas:**
- Un solo archivo para mantener todo el catálogo
- Las páginas se generan desde `getStaticPaths()` iterando el array
- Fácil de agregar/quitar equipos sin tocar templates
- Se puede exportar para alimentar sitemaps, breadcrumbs, etc.

---

## 4. Implementación por capas

### Capa 1 — Fuente de datos (`src/data/rental.ts`)
- Definir todas las categorías y subcategorías con contenido SEO completo
- Incluir slugs, nombres, descripciones, features
- Asignar heroImage por categoría (ideal: una imagen distinta por equipo)

### Capa 2 — Dynamic routes (`src/pages/arriendos/[categoria]/index.astro` y `[subcategoria].astro`)
- `getStaticPaths()` lee de `src/data/rental.ts`
- Renderiza usando `RentalLayout` (ya existe y tiene hero, features, breadcrumbs, CTAs)
- Agrega secciones nuevas: galería, especificaciones, casos de uso, CTA personalizado

### Capa 3 — Consolidación de `/arriendo-maquinaria/`
- Las páginas actuales de `/arriendo-maquinaria/gruas-alto-tonelaje/gruas-grove-gmk` deben migrarse o redirigir (301) a `/arriendos/izaje/gruas-grove-gmk`
- Agregar redirects en `astro.config.mjs` o en un `_redirects`

### Capa 4 — Hubs de categoría (`index.astro` dinámico)
- Cada `/arriendos/[categoria]/` debe listar sus subcategorías con extracto y link
- Similar al diseño actual del `equipment-list` en el index principal

### Capa 5 — Index principal (`/arriendos/`)
- Ya existe pero debe actualizarse para linkear a `/arriendos/izaje/` en vez de `/arriendos/izaje`
- Agregar más categorías si corresponde

---

## 5. Recomendaciones SEO

### 5.1 Keywords objetivo por página

| Página | Keyword primaria | Intención |
|--------|-----------------|-----------|
| `/arriendos/izaje/gruas-at` | arriendo grúas todo terreno Chile | Transaccional |
| `/arriendos/izaje/alza-hombre` | arriendo alza-hombre minería | Transaccional |
| `/arriendos/movimiento-tierra/excavadoras` | arriendo excavadoras hidráulicas | Transaccional |
| `/arriendos/movimiento-tierra/cargadores-frontales` | arriendo cargadores frontales | Transaccional |
| `/arriendos/transporte/camiones-alto-tonelaje` | arriendo camiones alto tonelaje | Transaccional |
| `/arriendos/equipos-especiales/manipuladores-telescopicos` | arriendo manipuladores telescópicos | Transaccional |

**Estrategia:**
- Cada subcategoría apunta a **una keyword transaccional** principal (la que busca un cliente que quiere arrendar)
- Las categorías padre apuntan a keywords **más genéricas** ("equipos de izaje para minería")
- El hub principal apunta a **términos broad** ("arriendo de maquinaria para minería Chile")

### 5.2 Title tags

```
Formato categoría:     "Arriendo de {nombre} | IP Proyectos Industriales"
                       → "Arriendo de Grúas de Alto Tonelaje | IP Proyectos Industriales"

Formato subcategoría:  "Arriendo de {nombre} en Chile — {capacidad/keyword} | IP Proyectos Industriales"
                       → "Arriendo de Grúas Todo Terreno (AT) en Chile — Hasta 400 ton | IP Proyectos Industriales"

Formato modelo:        "{Modelo} en arriendo — {categoría} | IP Proyectos Industriales"
                       → "Grúa Grove GMK en arriendo — Grúas Alto Tonelaje | IP Proyectos Industriales"
```

- Límite: 55-60 caracteres visibles en SERP
- Keyword primaria al inicio
- Marca al final

### 5.3 Meta descriptions

```markdown
Formato:
"Arriendo de {nombre} con operador certificado. {capacidad/key feature}.
Disponibilidad {zona}. Cotiza online o por WhatsApp."
```

- 150-160 caracteres
- Incluir keyword primaria
- Llamado a la acción explícito ("Cotiza online")
- Diferenciar cada descripción (nunca duplicadas)

### 5.4 Heading structure

```
H1: "{nombre}" (ej: "Arriendo de Grúas Todo Terreno")
H2: "Características del equipo"
H2: "Especificaciones técnicas"
H2: "Aplicaciones en minería e industria"
H2: "¿Por qué arrendar con IP Proyectos Industriales?"
H2: "Equipos relacionados"   ← Internal linking a otras subcategorías
H2: "Preguntas frecuentes"    ← FAQ schema
H2: "Cotiza este equipo"     ← CTA final
```

- Un solo H1 por página
- H1 debe contener la keyword principal
- H2 distribuidas naturalmente

### 5.5 URLs

```
Formato:  /arriendos/{categoria}/{subcategoria}
Ejemplo:  /arriendos/izaje/gruas-at
          /arriendos/movimiento-tierra/excavadoras
```

- URLs cortas, legibles, con guiones
- Sin parámetros, sin versiones (no `/arriendos/izaje/gruas-at?ref=menu`)
- Todo lowercase
- Coherentes con el breadcrumb

### 5.6 Breadcrumbs (Schema.org BreadcrumbList)

```
Inicio > Rental de Equipos > Izaje > Grúas Todo Terreno
```

- Implementar `BreadcrumbList` JSON-LD en cada página (ya existe helper `breadcrumbSchema()` en `src/lib/seo.ts`)
- El breadcrumb visible debe coincidir con el schema
- Cuarto nivel (modelo específico) solo cuando aplique

### 5.7 Structured data (JSON-LD)

| Tipo de página | Schema | Helper |
|----------------|--------|--------|
| Hub principal | `CollectionPage` | `collectionPageSchema()` |
| Categoría | `Service` | `serviceSchema()` |
| Subcategoría | `Product` + `Offer` | `productSchema()` |
| Modelo específico | `Product` + `Offer` con `gtin`/`mpn` | `productSchema()` |

**Recomendaciones adicionales:**
- Agregar `ItemAvailability` = `InStock` en todas las ofertas (existe pero revisar)
- Si hay precios, agregar `price` y `priceCurrency: "CLP"`
- Agregar `image` en las páginas de subcategoría
- Considerar `FAQPage` en las subcategorías con preguntas frecuentes específicas

### 5.8 Internal linking

**Estrategia de links:**
- Cada subcategoría linkea a: su categoría padre, las otras subcategorías del mismo padre, y al menos una subcategoría relacionada de otra categoría
- El hub de categoría linkea a todas sus subcategorías
- El index principal linkea a las 4 categorías
- Anchor text descriptivo: "Ver grúas rough terrain (RT)" en vez de "Ver más"

**Mapa de distribución de autoridad:**
```
Home
 └─ /arriendos/ (hub principal)
     ├─ /arriendos/izaje/ (hub categoría)
     │   ├─ /arriendos/izaje/gruas-at
     │   ├─ /arriendos/izaje/gruas-rt
     │   ├─ /arriendos/izaje/alza-hombre
     │   └─ /arriendos/izaje/gruas-grove-gmk
     ├─ /arriendos/movimiento-tierra/
     │   ├─ /arriendos/movimiento-tierra/excavadoras
     │   ├─ /arriendos/movimiento-tierra/cargadores-frontales
     │   ├─ /arriendos/movimiento-tierra/motoniveladoras
     │   └─ /arriendos/movimiento-tierra/compactadores
     ├─ /arriendos/transporte/
     │   └─ ...
     └─ /arriendos/equipos-especiales/
         └─ ...
```

Cada página debe tener entre 3 y 10 links internos salientes.

### 5.9 Sitemap

- Incluir todas las URLs del catálogo en el sitemap XML
- Prioridad sugerida: subcategorías = 0.7, categorías = 0.8, hub = 0.9
- `@astrojs/sitemap` ya está en el proyecto — configurar para que incluya las rutas dinámicas
- Frecuencia de actualización: `weekly` para categorías, `monthly` para equipos

### 5.10 Imágenes y alt text

- Cada subcategoría debe tener **su propia imagen** (no reutilizar `hero.jpg` genérica)
- Nombre de archivo descriptivo: `gruas-todo-terreno-at-400-ton.webp`
- Alt text: "Arriendo de {nombre} — {descripción breve}" (ej: "Arriendo de grúas todo terreno AT 400 toneladas en faena minera")
- Formato WebP con lazy loading
- Imagen responsive con srcset

---

## 6. Recomendaciones de diseño

### 6.1 Página de subcategoría (template)

Usar `RentalLayout` como base y expandir con **secciones adicionales**:

| Sección | Componente | Descripción |
|---------|-----------|-------------|
| Hero | `RentalLayout` (existente) | Imagen de fondo, título, breadcrumbs, CTAs |
| Features | `RentalLayout` (existente) | Lista de "Qué incluye" en grilla 2 columnas |
| Especificaciones | Nuevo: `SpecsGrid` | Tabla visual con capacidad, altura, operador, etc. |
| Aplicaciones | Nuevo: `UseCases` | 2-3 casos de uso en minería/industria |
| Galería | Nuevo: `GalleryCarousel` | 3-4 imágenes del equipo en faena |
| Equipos relacionados | Nuevo: `RelatedEquipment` | Grilla con otras subcategorías del mismo padre |
| FAQ | Nuevo: `FAQSection` | 3-5 preguntas frecuentes con schema FAQPage |
| CTA | `CTABand` (existente) | Formulario de cotización |

### 6.2 Página de categoría (hub)

| Sección | Descripción |
|---------|-------------|
| Hero | Imagen representativa, breadcrumbs, descripción general |
| Contenido | Párrafo SEO con contexto del área (ej: "En minería a cielo abierto...") |
| Grilla de subcategorías | Cards con imagen, nombre, extracto, link |
| CTA | Cotización |

### 6.3 Identidad visual

- Mantener la paleta actual (graphite, brand green, white)
- Cada subcategoría hereda el diseño del hero con overlay gradient
- Cards de equipos relacionados con thumbnail, nombre y feature principal
- Especificaciones en "badges" o cards con métricas destacadas
- Botones primarios "Cotizar" y outline "Descargar catálogo" consistentes

---

## 7. Implementación priorizada

| Fase | Tarea | Páginas | Depende de |
|------|-------|---------|------------|
| **1** | Crear `src/data/rental.ts` con todas las categorías y subcategorías | — | — |
| **2** | Migrar `/arriendos/` a rutas dinámicas `[categoria]/index.astro` | 4 hubs | Fase 1 |
| **3** | Crear `[categoria]/[subcategoria].astro` con `RentalLayout` | ~13 subcats | Fase 1, 2 |
| **4** | Agregar secciones nuevas (specs, galería, FAQ, related) como componentes | — | Fase 3 |
| **5** | Migrar/redirigir `/arriendo-maquinaria/` → `/arriendos/` | Redirects 301 | Fase 2, 3 |
| **6** | Agregar imágenes específicas por equipo (WebP, alt text) | ~17 imágenes | Fase 3 |
| **7** | Configurar sitemap, breadcrumbs y JSON-LD dinámicos | — | Fase 3 |
| **8** | Revisar contenido SEO: titles, descriptions, keywords | — | Fase 3 |

### Prioridad por impacto SEO

1. **Alta**: Fases 1-3 (estructura, rutas, contenido base)
2. **Alta**: Fase 7 (sitemap, schema, breadcrumbs)
3. **Media**: Fase 4 (componentes enriquecidos)
4. **Media**: Fase 5 (consolidación, redirects)
5. **Baja**: Fase 6 (imágenes — alto impacto pero depende de recursos gráficos)
6. **Baja**: Fase 8 (refinamiento SEO)

---

## 8. Estimación de esfuerzo

| Tipo | Cantidad | Complejidad | Tiempo estimado |
|------|----------|-------------|----------------|
| Archivo de datos (`rental.ts`) | 1 archivo | Media | 1-2 h |
| Rutas dinámicas (2 templates) | 2 archivos | Alta | 2-3 h |
| Componentes nuevos | 4-5 | Media | 3-4 h |
| Imágenes | 17 | Baja (diseño) | 2-3 h |
| Contenido SEO (titles, descs) | 17 páginas | Media | 2-3 h |
| Redirects + sitemap + schema | — | Baja | 1 h |
| **Total** | **~17 páginas** | | **~12-16 h** |

---

## 9. Glosario de rutas (resumen)

```
/arriendos/                                              ← Hub catálogo
/arriendos/izaje/                                        ← Hub izaje
/arriendos/izaje/gruas-at                                ← Grúas todo terreno (AT)
/arriendos/izaje/gruas-rt                                ← Grúas rough terrain (RT)
/arriendos/izaje/alza-hombre                             ← Alza-hombre
/arriendos/izaje/gruas-grove-gmk                         ← Grove GMK (modelo)
/arriendos/movimiento-tierra/                            ← Hub movimiento de tierra
/arriendos/movimiento-tierra/excavadoras                 ← Excavadoras hidráulicas
/arriendos/movimiento-tierra/cargadores-frontales        ← Cargadores frontales
/arriendos/movimiento-tierra/motoniveladoras             ← Motoniveladoras
/arriendos/movimiento-tierra/compactadores               ← Compactadores
/arriendos/transporte/                                   ← Hub transporte
/arriendos/transporte/camiones-alto-tonelaje             ← Camiones alto tonelaje
/arriendos/transporte/plataformas-low-boy               ← Plataformas low boy
/arriendos/transporte/cargas-especiales                  ← Cargas sobredimensionadas
/arriendos/equipos-especiales/                           ← Hub equipos especiales
/arriendos/equipos-especiales/manipuladores-telescopicos ← Telehandlers
/arriendos/equipos-especiales/camiones-pluma             ← Camiones pluma
/arriendos/equipos-especiales/plataformas-elevadoras     ← Plataformas elevadoras
/arriendos/equipos-especiales/generadores-soldadura      ← Generadores y soldadura
```

**Total: 21 páginas** (1 hub + 4 categorías + 13 subcategorías + 3 de consolidación)
