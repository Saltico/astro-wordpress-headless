---
feature: Página de Detalle de Equipo
type: Feasibility Report
date: 2026-09-07
status: Planned
---

# Informe de Factibilidad — Página de Detalle de Equipo

## 1. Evaluación de Factibilidad Técnica

### 1.1 Viabilidad General: ✅ ALTAMENTE FACTIBLE

| Criterio | Evaluación | Justificación |
|---|---|---|
| **Stack tecnológico** | ✅ Sin riesgos | Astro soporta rutas dinámicas anidadas con `getStaticPaths()` nativamente |
| **Modelo de datos** | ✅ Simple | Solo agregar campos opcionales a interface existente, no rompe código |
| **Componentes reutilizables** | ✅ Abundantes | `RelatedEquipment`, `FAQSection` (acordeón), `QuoteAddButton`, `CTABand` ya existen |
| **Generación estática** | ✅ Escalable | ~50 páginas de detalle = sin impacto en build time |
| **Responsive design** | ✅ Estándar | CSS Grid/Flexbox, patrón ya usado en todo el proyecto |
| **SEO** | ✅ Directo | `productSchemaExtended()` y `breadcrumbSchema()` ya existen en `@/lib/seo` |

### 1.2 Complejidad por Componente

| Componente | Complejidad | Razón |
|---|---|---|
| Extensión de datos | 🟢 Baja | Campos opcionales, sin migración |
| EquipmentCard (modificación) | 🟢 Baja | Cambio aditivo, 1 botón nuevo |
| EquipmentDetailHero | 🟡 Media | Layout 2 columnas responsive, integración con QuoteAddButton |
| EquipmentSpecsAccordion | 🟢 Baja | Patrón ya implementado en FAQSection |
| EquipmentDescription | 🟢 Baja | Componente de texto simple |
| Ruta [equipo].astro | 🟡 Media | Integración de múltiples componentes + SEO |
| findEquipmentBySlug() | 🟢 Baja | Búsqueda lineal en ~50 equipos |

---

## 2. Análisis Competitivo

### 2.1 Competidores Directos (Arriendo de Maquinaria Pesada en Chile)

| Competidor | URL | Página de Detalle | Diferenciador |
|---|---|---|---|
| **SK Rental** | skrental.com | ✅ Sí, completa | Tarifa diaria/semanal/mensual visible, login requerido, carrito de cotización |
| **Finning (Cat)** | finning.cl | ⚠️ Parcial | Fichas técnicas descargables, sin cotización online directa |
| **Metsö** | metsogroup.com | ⚠️ Parcial | Catálogo global, sin arriendo local |
| **Komatsu Chile** | komatsu.cl | ❌ No | Solo listado de equipos, contacto por formulario |
| **Ardile** | ardile.cl | ⚠️ Parcial | Catálogo con imágenes, sin detalle individual |
| **Maquicorp** | maquicorp.cl | ❌ No | Listado simple, WhatsApp como CTA |

### 2.2 Análisis de SK Rental (Referencia Principal)

**Fortalezas de su página de detalle:**
- Información técnica completa en tabla estructurada
- Ficha técnica PDF descargable
- Galería de imágenes con múltiples ángulos
- Equipos relacionados para cross-selling
- CTAs claros (agregar al cotizador)
- Breadcrumbs para navegación

**Debilidades identificadas:**
- Precios visibles (puede ser una desventaja competitiva si no queremos mostrar precios)
- Requiere login para cotizar (fricción alta)
- Sin schema.org Product (oportunidad SEO que nosotros aprovechamos)
- Diseño genérico de e-commerce (no transmite especialización industrial)

### 2.3 Nuestra Propuesta de Valor (Diferenciadores)

| Aspecto | SK Rental | Nosotros (IP Proyectos) |
|---|---|---|
| **Precios** | Visibles (diario/semanal/mensual) | Cotización personalizada (más apropiado para B2B industrial) |
| **Fricción** | Login requerido | Sin login — cotización directa |
| **SEO** | Sin schema.org | Product schema + BreadcrumbList + FAQ schema |
| **Especialización** | Catálogo genérico | Enfoque en minería, construcción e industria chilena |
| **Cobertura** | 11 sucursales | Zona norte y centro de Chile (explícito) |
| **Operador** | No mencionado | Operador certificado incluido (diferenciador clave) |
| **Tecnología** | Angular/React SPA | Astro SSG (velocidad superior, Core Web Vitals) |
| **WhatsApp** | No | Integración directa WhatsApp (canal preferido en Chile) |

---

## 3. Riesgos Identificados

### 3.1 Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| **Datos insuficientes** — No tenemos specs detalladas de todos los equipos | Alta | Medio | Empezar con 1 equipo de prueba, poblar gradualmente. Campos opcionales permiten publicación parcial. |
| **PDFs de fichas técnicas no disponibles** | Media | Bajo | Botón de descarga se oculta si `techSheetUrl` no existe. No bloquea el lanzamiento. |
| **Galería de imágenes limitada** | Alta | Bajo | v1 usa imagen principal. Estructura preparada para galería futura. |
| **Performance con muchas rutas** | Baja | Bajo | Astro maneja ~50 rutas estáticas sin problema. Build time < 30s. |

### 3.2 Riesgos de Contenido

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| **Descripciones genéricas** — Falta contenido diferenciado por equipo | Alta | Medio | Usar descripciones SEO ya escritas para subcategorías como base, personalizar por equipo. |
| **Especificaciones incompletas** — No todas las fichas técnicas están digitalizadas | Alta | Medio | Priorizar equipos más cotizados. Tabla vacía no se renderiza. |
| **Equipos relacionados manuales** — `relatedSlugs` requiere curación manual | Media | Bajo | Definir criterios automáticos (misma subcategoría, misma categoría) como fallback. |

### 3.3 Riesgos de UX

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| **Card muy ancha con 2 botones** — En mobile los 2 botones pueden no caber | Media | Medio | En mobile, botones en columna (stack vertical). Cada botón full-width. |
| **Navegación profunda** — 5 niveles de breadcrumbs pueden confundir | Baja | Bajo | Breadcrumbs con scroll horizontal en mobile. Solo mostrar 3 últimos + "Inicio". |

---

## 4. Dependencias Externas

| Dependencia | Tipo | Estado | Impacto si no disponible |
|---|---|---|---|
| `QuoteAddButton` | Componente interno | ✅ Disponible | No se puede agregar al cotizador desde detalle |
| `RelatedEquipment` | Componente interno | ✅ Disponible | No se muestran equipos relacionados |
| `FAQSection` (patrón acordeón) | Componente interno | ✅ Disponible | Se crea acordeón propio (esfuerzo adicional bajo) |
| `productSchemaExtended()` | Función SEO | ✅ Disponible | Sin schema Product (impacto SEO) |
| Fichas técnicas PDF | Asset externo | ❌ No disponible | Botón de descarga oculto, no bloquea |
| Imágenes de galería | Asset externo | ⚠️ Parcial | Solo imagen principal, no bloquea |
| Descripciones de equipos | Contenido | ⚠️ Parcial | Sin texto en acordeón "Descripción", no bloquea |

---

## 5. Recomendación de Enfoque

### 5.1 Estrategia de Lanzamiento por Fases

**v1 — MVP (2-3 días)**
- EquipmentCard con 2 botones
- Página de detalle con imagen principal + datos + CTA
- Acordeón de especificaciones (tabla)
- Acordeón de descripción (texto)
- Equipos relacionados
- SEO schema completo
- **1 equipo de prueba** con datos completos (Grove RT 765 E)

**v2 — Expansión de datos (1-2 semanas)**
- Poblar specs y descriptions para todos los equipos
- Agregar fichas técnicas PDF
- Galería de imágenes (múltiples ángulos)

**v3 — Mejoras de UX (futuro)**
- Carousel de imágenes con thumbnails
- Comparador de equipos
- Filtros dentro de la página de detalle
- Breadcrumbs con schema dinámico

### 5.2 Recomendación Final

**✅ Proceder con la implementación.**

La feature es:
- **Técnicamente factible** — no requiere nuevas dependencias ni infraestructura
- **SEO-ventajosa** — cada página de detalle es una landing page indexable con schema Product
- **Competitivamente diferenciadora** — supera a la mayoría de competidores locales en UX y contenido
- **Escalable** — la estructura permite agregar contenido gradualmente sin rehacer la arquitectura
- **De bajo riesgo** — todos los campos son opcionales, no rompe funcionalidad existente

---

## 6. Métricas de Éxito

| Métrica | Baseline | Objetivo 3 meses |
|---|---|---|
| Páginas indexadas | ~20 (subcategorías) | ~70 (+50 páginas de detalle) |
| Tráfico orgánico a páginas de detalle | 0 | +15-25% del tráfico total de /arriendo |
| Equipos agregados al cotizador desde detalle | N/A | 20% de las conversiones del cotizador |
| Tiempo en página de detalle | N/A | > 45 segundos promedio |
| Descargas de ficha técnica | 0 | > 50/mes (cuando PDFs disponibles) |
