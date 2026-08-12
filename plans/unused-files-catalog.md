---
title: "Catalogo de Archivos No Utilizados"
status: Analysis
date: 2026-08-11
scope: "src/ - Componentes, paginas, layouts, librerias, datos y tipos"
---

# Catalogo de Archivos No Utilizados

Analisis exhaustivo de componentes, paginas, layouts, modulos y datos que no tienen referencias activas en el proyecto. El objetivo es identificar candidatos a eliminacion antes del lanzamiento a produccion.

---

## Resumen Ejecutivo

| Categoria | Total archivos | En uso | No utilizados | Comentados |
|-----------|:--------------:|:--------:|:--------------:|:----------:|
| Componentes UI | 25 | 22 | 3 | 2 |
| Componentes SEO | 3 | 3 | 0 | 0 |
| Componentes Rental | 7 | 5 | 0 | 2 |
| Componentes Layout | 5 | 5 | 0 | 0 |
| Componentes Quote | 12 | 11 | 1 | 0 |
| Layouts | 3 | 3 | 0 | 0 |
| Librerias (lib/) | 12 | 11 | 1 | 0 |
| Datos (data/) | 5 | 5 | 0 | 0 |
| Tipos (types/) | 5 | 5 | 0 | 0 |
| Paginas (pages/) | 27 | 21 | 6 | 0 |

**Total de archivos candidatos a eliminacion: 13**

---

## 1. Componentes No Utilizados

### 1.1. `src/components/ui/ServicesGrid.astro`

| Campo | Detalle |
|-------|---------|
| **Estado** | ❌ Sin referencias |
| **Imports** | Ningun archivo lo importa |
| **Uso en templates** | Ninguno |
| **Descripcion** | Grid de servicios. Fue reemplazado por otras soluciones de presentacion de servicios. |
| **Riesgo eliminacion** | 🟢 Bajo - No tiene dependencias |
| **Accion recomendada** | **Eliminar** |

---

### 1.2. `src/components/ui/ServicesCompact.astro`

| Campo | Detalle |
|-------|---------|
| **Estado** | ❌ Sin referencias |
| **Imports** | Ningun archivo lo importa |
| **Uso en templates** | Ninguno |
| **Descripcion** | Version compacta del grid de servicios. No se usa en ninguna pagina. |
| **Riesgo eliminacion** | 🟢 Bajo - No tiene dependencias |
| **Accion recomendada** | **Eliminar** |

---

### 1.3. `src/components/ui/HeroMedia.astro`

| Campo | Detalle |
|-------|---------|
| **Estado** | ❌ Sin referencias |
| **Imports** | Ningun archivo lo importa |
| **Uso en templates** | Ninguno |
| **Descripcion** | Componente de hero con soporte de video/imagen. `HeroSection.astro` no lo utiliza; renderiza el media directamente. Fue disenado como componente independiente pero nunca se integro. |
| **Dependencias internas** | Importa `Video.astro` (que si es usado por otros medios) |
| **Riesgo eliminacion** | 🟢 Bajo - `Video.astro` seguiria siendo usado por otros componentes |
| **Accion recomendada** | **Eliminar** |

---

### 1.4. `src/components/quote/QuoteHero.astro`

| Campo | Detalle |
|-------|---------|
| **Estado** | ❌ Sin referencias |
| **Imports** | Ningun archivo lo importa |
| **Uso en templates** | Ninguno |
| **Descripcion** | Hero especifico para la pagina del cotizador. La pagina `cotizador.astro` usa `QuoteWizard` directamente con `BaseLayout` sin este componente. |
| **Dependencias internas** | Importa `Button.astro` (usado por muchos otros) |
| **Riesgo eliminacion** | 🟢 Bajo - No afecta a ningun otro componente |
| **Accion recomendada** | **Eliminar** |

---

### 1.5. `src/components/rental/FeaturedEquipment.astro` ⚠️

| Campo | Detalle |
|-------|---------|
| **Estado** | ⚠️ Comentado en `pages/index.astro` |
| **Imports** | Import comentado en `index.astro` (linea 11): `// import FeaturedEquipment...` |
| **Uso en templates** | Uso comentado en `index.astro` (linea 238): `<!-- <FeaturedEquipment /> -->` |
| **Descripcion** | Muestra equipos destacados en el homepage. Fue desactivado intencionalmente pero se mantuvo el codigo. La data `featuredEquipment` en `site.ts` solo sirve a este componente. |
| **Dependencias** | `EquipmentCard.astro`, `Icon.astro`, `data/site.ts` (featuredEquipment) |
| **Riesgo eliminacion** | 🟡 Medio - Si se elimina, tambien debe limpiarse `featuredEquipment` en `site.ts` |
| **Accion recomendada** | **Decidir**: si no se planea reactivar, eliminar junto con la data asociada |

---

### 1.6. `src/components/ui/CoverageSection.astro` ⚠️

| Campo | Detalle |
|-------|---------|
| **Estado** | ⚠️ Comentado en `pages/index.astro` |
| **Imports** | Import comentado en `index.astro` (linea 12): `// import CoverageSection...` |
| **Uso en templates** | Uso comentado en `index.astro` (linea 239): `<!-- <CoverageSection /> -->` |
| **Descripcion** | Seccion de zonas de cobertura geografica. Fue desactivada intencionalmente. La data `coverageZones` en `site.ts` solo sirve a este componente. |
| **Dependencias** | `Icon.astro`, `Container.astro`, `data/site.ts` (coverageZones) |
| **Riesgo eliminacion** | 🟡 Medio - Si se elimina, tambien debe limpiarse `coverageZones` en `site.ts` |
| **Accion recomendada** | **Decidir**: si no se planea reactivar, eliminar junto con la data asociada |

---

## 2. Modulos (lib/) No Utilizados

### 2.1. `src/lib/wordpress.ts`

| Campo | Detalle |
|-------|---------|
| **Estado** | ❌ Sin referencias |
| **Imports** | Ningun archivo lo importa |
| **Descripcion** | Stub del cliente WP REST API. Contiene funciones `fetchAllNews()` y `fetchNewsBySlug()` que lanzan errores indicando "not yet implemented". Las paginas de noticias usan `lib/news.ts` que lee de `data/news.ts` directamente. |
| **Riesgo eliminacion** | 🟢 Bajo - Es un stub no funcional |
| **Accion recomendada** | **Eliminar** o mantener como referencia si se planea la integracion con WordPress REST API |

---

## 3. Paginas Sin Enlaces de Navegacion

Estas paginas existen en `src/pages/` pero **no tienen enlaces** desde la navegacion principal, footer, topbar, ni ningun otro componente. Son accesibles solo por URL directa.

### 3.1. `src/pages/servicios-industriales/index.astro` y `[servicio].astro`

| Campo | Detalle |
|-------|---------|
| **Estado** | ⚠️ Sin enlaces de navegacion |
| **Rutas** | `/servicios-industriales`, `/servicios-industriales/[servicio]` |
| **Descripcion** | Ruta paralela a `/servicios/*`. La navegacion principal apunta a `/servicios` con subpaginas estaticas (ingenieria, construccion, montajes, infraestructura-portuaria). Esta ruta dinamica parece ser una version alternativa o evolucion que nunca se integro a la navegacion. |
| **Enlaces entrantes** | Ninguno desde navegacion, footer, topbar, ni otros componentes |
| **Riesgo eliminacion** | 🔴 Alto - Podria ser la version que reemplazara a `/servicios/*` en el futuro |
| **Accion recomendada** | **Decidir**: si `/servicios/*` es la version final, eliminar `/servicios-industriales/*`. Si se planea migrar, mantener. |

---

### 3.2. `src/pages/nosotros/index.astro`

| Campo | Detalle |
|-------|---------|
| **Estado** | ⚠️ Sin enlaces de navegacion |
| **Ruta** | `/nosotros` |
| **Descripcion** | Pagina "Nosotros" con HeroSection, SplitSections y TeamGrid. Contenido completo pero sin enlace desde ningun lugar del sitio. |
| **Enlaces entrantes** | Ninguno |
| **Riesgo eliminacion** | 🟡 Medio - Es contenido valido que podria necesitar enlace |
| **Accion recomendada** | **Decidir**: agregar a navegacion/footer o eliminar |

---

### 3.3. `src/pages/proyectos/index.astro` y `[slug].astro`

| Campo | Detalle |
|-------|---------|
| **Estado** | ⚠️ Sin enlaces de navegacion |
| **Rutas** | `/proyectos`, `/proyectos/[slug]` |
| **Descripcion** | Listado de proyectos y detalle individual. Usan `ProjectGrid`, `ProjectCard`, `HeroSection`, `ContactSection`. Contenido completo pero no enlazado. |
| **Enlaces entrantes** | Ninguno |
| **Riesgo eliminacion** | 🟡 Medio - Es contenido valido que podria necesitar enlace |
| **Accion recomendada** | **Decidir**: agregar a navegacion/footer o eliminar |

---

### 3.4. `src/pages/canal-integridad/index.astro`

| Campo | Detalle |
|-------|---------|
| **Estado** | ⚠️ Sin enlaces de navegacion |
| **Ruta** | `/canal-integridad` |
| **Descripcion** | Pagina de canal de integridad/denuncias. Contenido basico con SectionLayout y Container. |
| **Enlaces entrantes** | Ninguno |
| **Riesgo eliminacion** | 🟡 Medio - Podria ser requerimiento legal o de compliance |
| **Accion recomendada** | **Decidir**: agregar al footer (junto a aviso legal, privacidad) o eliminar |

---

### 3.5. `src/pages/contacto/index.astro`

| Campo | Detalle |
|-------|---------|
| **Estado** | ⚠️ Enlace comentado en navegacion |
| **Ruta** | `/contacto` |
| **Descripcion** | Pagina de contacto con `QuoteFormAdvanced` y canales de contacto. El enlace en la navegacion principal esta comentado con un `TODO`: "DEFINIR SI SE DEBE MANTENER EL LINK DE CONTACTO EN LA NAVEGACION PRINCIPAL". |
| **Enlaces entrantes** | El enlace de navegacion esta comentado (linea 86-87 en `site.ts`) |
| **Riesgo eliminacion** | 🟡 Medio - La decision esta pendiente explicitamente |
| **Accion recomendada** | **Resolver el TODO**: decidir si se activa en navegacion o se elimina |

---

### 3.6. `src/pages/gracias.astro`

| Campo | Detalle |
|-------|---------|
| **Estado** | ✅ Paginade redireccion (no requiere enlace) |
| **Ruta** | `/gracias` |
| **Descripcion** | Pagina de confirmacion post-formulario. Se usa como destino de redireccion tras enviar el cotizador o formulario de contacto. Es normal que no tenga enlaces de navegacion. |
| **Enlaces entrantes** | Redireccion programatica desde formularios |
| **Riesgo eliminacion** | 🔴 Alto - Es funcional para el flujo de formularios |
| **Accion recomendada** | **Mantener** - Es parte del flujo funcional |

---

## 4. Data Sin Uso Activo

Estos exports de `src/data/site.ts` solo sirven a componentes que estan comentados o eliminados:

| Export | Componente asociado | Estado |
|--------|---------------------|--------|
| `featuredEquipment` | `FeaturedEquipment.astro` (comentado) | ⚠️ Sin uso activo |
| `coverageZones` | `CoverageSection.astro` (comentado) | ⚠️ Sin uso activo |

---

## 5. Resumen de Acciones Recomendadas

### Eliminacion directa (sin riesgo)

| # | Archivo | Motivo |
|---|---------|--------|
| 1 | `src/components/ui/ServicesGrid.astro` | Sin referencias |
| 2 | `src/components/ui/ServicesCompact.astro` | Sin referencias |
| 3 | `src/components/ui/HeroMedia.astro` | Sin referencias |
| 4 | `src/components/quote/QuoteHero.astro` | Sin referencias |
| 5 | `src/lib/wordpress.ts` | Stub no implementado, sin referencias |

### Requieren decision

| # | Archivo | Decision pendiente |
|---|---------|--------------------|
| 6 | `src/components/rental/FeaturedEquipment.astro` | Reactivar o eliminar (+ limpiar `featuredEquipment` en `site.ts`) |
| 7 | `src/components/ui/CoverageSection.astro` | Reactivar o eliminar (+ limpiar `coverageZones` en `site.ts`) |
| 8 | `src/pages/servicios-industriales/` (2 archivos) | Es version paralela a `/servicios/*`. Definir cual mantener |
| 9 | `src/pages/nosotros/index.astro` | Agregar a navegacion o eliminar |
| 10 | `src/pages/proyectos/` (2 archivos) | Agregar a navegacion o eliminar |
| 11 | `src/pages/canal-integridad/index.astro` | Agregar al footer o eliminar |
| 12 | `src/pages/contacto/index.astro` | Resolver TODO: activar en navegacion o eliminar |

### Mantener (funcionales)

| # | Archivo | Motivo |
|---|---------|--------|
| 13 | `src/pages/gracias.astro` | Pagina de confirmacion post-formulario |

---

## 6. Impacto en Build

Eliminar los 5 archivos sin riesgo reduce:
- **~4 componentes Astro** sin compilar
- **~1 modulo TypeScript** sin procesar
- Limpieza de imports muertos en `site.ts` (si se eliminan FeaturedEquipment y CoverageSection)

La eliminacion de paginas no enlazadas (si se decide) reduciria significativamente el bundle de rutas estaticas generadas en el build.

---

## 7. Notas Adicionales

- **`/servicios` vs `/servicios-industriales`**: Esta es la decision mas critica. Si `/servicios-industriales` es la evolucion natural con rutas dinamicas, deberia reemplazar a las paginas estaticas de `/servicios/*`. Si no, debe eliminarse para evitar confusion y contenido duplicado que perjudica el SEO.
- **Paginas huerfanas**: `/nosotros`, `/proyectos`, `/canal-integridad` tienen contenido completo y funcional. Podrian ser paginas planificadas que nunca se integraron a la navegacion, o podrian ser experimentos descatalogados.
- **TODO pendiente**: El comentario en `site.ts` linea 86 sobre el enlace de contacto indica una decision explicitamente pendiente que debe resolverse antes de produccion.
