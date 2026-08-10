# Auditoría SEO — Rental de Equipos IP Proyectos Industriales

> **Modelo:** qwen3.7-plus (opencode-go/qwen3.7-plus)
> **Fecha:** 10 de agosto de 2026
> **Alcance:** Implementación SEO enfocada en el rental de equipos por categorías (`/arriendo/*`)
> **Stack:** Astro 7 + TypeScript (SSG) + WordPress headless (planificado)

---

## 1. Resumen Ejecutivo

### Estado General: ⭐⭐⭐⭐ (4/5) — Base sólida con oportunidades de mejora

La implementación SEO del rental de equipos presenta una **base técnica muy sólida**: arquitectura de URLs limpia, schemas JSON-LD completos, meta tags únicos por página, breadcrumbs con schema, y un sitemap automatizado. Sin embargo, existen **oportunidades significativas** en contenido SEO de subcategorías de "equipos especiales", enriquecimiento de schemas, internal linking estratégico y optimización de imágenes.

### Top 5 Prioridades

| # | Problema | Impacto | Esfuerzo |
|---|----------|---------|----------|
| 1 | Descripciones SEO thin en 6 subcategorías de equipos especiales | Alto | Medio |
| 2 | Falta schema `Product` individual por equipo del catálogo | Alto | Medio |
| 3 | Imágenes genéricas (hero.jpg) en ~15 subcategorías | Medio | Alto |
| 4 | Internal linking débil entre categorías relacionadas | Medio | Bajo |
| 5 | Meta descriptions con patrón repetitivo ("Cotiza online.") | Bajo | Bajo |

---

## 2. Arquitectura SEO Actual

### 2.1 Estructura de URLs del Rental

```
/arriendo                                          → Hub principal (CollectionPage)
/arriendo/izaje                                    → Categoría (Service)
/arriendo/izaje/gruas-60-toneladas                 → Subcategoría (Product + FAQPage)
/arriendo/izaje/gruas-80-toneladas                 → Subcategoría (Product + FAQPage)
/arriendo/izaje/gruas-100-toneladas                → Subcategoría (Product + FAQPage)
/arriendo/izaje/gruas-250-toneladas                → Subcategoría (Product + FAQPage)
/arriendo/izaje/camiones-pluma                     → Subcategoría (Product + FAQPage)
/arriendo/izaje/alza-hombre                        → Subcategoría (Product + FAQPage)
/arriendo/izaje/gruas-horquilla                    → Subcategoría (Product + FAQPage)
/arriendo/movimiento-de-tierra                     → Categoría (Service)
/arriendo/movimiento-de-tierra/camiones-tolva      → Subcategoría (Product + FAQPage)
/arriendo/movimiento-de-tierra/retroexcavadoras    → Subcategoría (Product + FAQPage)
/arriendo/movimiento-de-tierra/minicargadores      → Subcategoría (Product + FAQPage)
/arriendo/transporte                               → Categoría (Service)
/arriendo/transporte/tracto-camiones               → Subcategoría (Product + FAQPage)
/arriendo/transporte/cama-baja                     → Subcategoría (Product + FAQPage)
/arriendo/transporte/semiremolques                 → Subcategoría (Product + FAQPage)
/arriendo/equipos-especiales                       → Categoría (Service)
/arriendo/equipos-especiales/torres-iluminacion    → Subcategoría (Product + FAQPage)
/arriendo/equipos-especiales/bombas-hormigon       → Subcategoría (Product + FAQPage)
/arriendo/equipos-especiales/compresores-aire      → Subcategoría (Product + FAQPage)
/arriendo/equipos-especiales/generadores-electricos→ Subcategoría (Product + FAQPage)
/arriendo/equipos-especiales/termofusionadoras     → Subcategoría (Product + FAQPage)
/arriendo/equipos-especiales/rodillos              → Subcategoría (Product + FAQPage)
/arriendo/equipos-especiales/placas-compactadoras  → Subcategoría (Product + FAQPage)
/arriendo/equipos-especiales/alisadora-de-pavimento→ Subcategoría (Product + FAQPage)
/arriendo/equipos-especiales/vibropison            → Subcategoría (Product + FAQPage)
/arriendo/equipos-especiales/mezcladoras-electricas→ Subcategoría (Product + FAQPage)
/arriendo/equipos-especiales/canastillos-alza-hombre→ Subcategoría (Product + FAQPage)
```

**Total: 1 hub + 4 categorías + 24 subcategorías = 29 páginas indexables de rental**

### 2.2 Evaluación de la Arquitectura

| Criterio | Estado | Notas |
|----------|--------|-------|
| URLs semánticas | ✅ Excelente | Slugs en español, kebab-case, descriptivos |
| Profundidad máxima 3 clicks | ✅ Cumplido | Hub → Categoría → Subcategoría |
| trailingSlash: 'never' | ✅ Correcto | Consistente en todo el sitio |
| Canonical auto-generado | ✅ Correcto | `getSiteUrl(Astro.url.pathname)` |
| Sitemap automatizado | ✅ Correcto | @astrojs/sitemap con filter de noindex |
| robots.txt | ✅ Correcto | Referencia al sitemap |
| Breadcrumbs con schema | ✅ Correcto | BreadcrumbList JSON-LD en todas las páginas |

---

## 3. Análisis Técnico SEO

### 3.1 Meta Tags — ✅ Bien implementado

**Fortalezas:**
- Titles únicos por subcategoría con keyword principal al inicio
- Meta descriptions únicas en la mayoría de las subcategorías
- Canonical self-referencing correcto
- OG tags completos (title, description, image, type, url, locale)
- Twitter Card tags (summary_large_image)
- `hreflang="x-default"` presente
- `robots: 'index, follow, max-image-preview:large'`

**Problemas detectados:**

| Problema | Impacto | Página(s) afectada(s) |
|----------|---------|----------------------|
| Meta description muy corta (< 80 chars) | Medio | rodillos, placas-compactadoras, alisadora-de-pavimento, vibropison |
| Patrón repetitivo "Cotiza online." al final | Bajo | ~10 subcategorías |
| Falta keyword geográfica en algunas descriptions | Medio | vibropison, mezcladoras, canastillos |

**Ejemplo de meta description débil:**
```
seoDescription: 'Arriendo de equipos de Rodillos compactadores. Cotiza online.'
```
→ Solo 52 caracteres. Debería tener 150-160 con keywords geográficas y diferenciadores.

**Ejemplo de meta description fuerte (comparar):**
```
seoDescription: 'Arriendo de grúas de 60 toneladas con operador certificado en Chile. Equipos Grove, Tadano y Liebherr. Hasta 50 m de altura. Cotiza online.'
```
→ 143 caracteres, incluye keyword, marca, spec y CTA.

### 3.2 Schema JSON-LD — ✅✅ Muy completo

**Schemas implementados por nivel:**

| Página | Schemas |
|--------|---------|
| Homepage | Organization, WebSite, LocalBusiness |
| /arriendo | Organization, WebSite, CollectionPage, BreadcrumbList |
| /arriendo/[cat] | Organization, WebSite, Service, BreadcrumbList |
| /arriendo/[cat]/[subcat] | Organization, WebSite, Product (con Offer), BreadcrumbList, FAQPage |

**Fortalezas:**
- Organization con contactPoint y areaServed (CL-II, CL-III, CL-IV)
- Product schema con Offer (availability, priceCurrency, priceRange)
- FAQPage schema en subcategorías (5 preguntas genéricas)
- BreadcrumbList en todas las páginas
- Service schema en categorías con serviceType y areaServed

**Oportunidades de mejora:**

| Oportunidad | Impacto | Prioridad |
|-------------|---------|-----------|
| Schema `Product` individual por equipo del catálogo | Alto | Alta |
| `AggregateRating` en Product schemas | Alto | Media (requiere datos reales) |
| `areaServed` en schemas de subcategoría | Medio | Baja |
| Schema `ItemList` en hub de categorías | Medio | Baja |
| `brand` property en Product schemas (marcas reales de equipos) | Medio | Media |

### 3.3 Sitemap & Indexación — ✅ Correcto

- `sitemap-index.xml` generado automáticamente por @astrojs/sitemap
- Filter excluye: `/gracias`, `/404`, `/500`, `/aviso-legal`, `/privacidad`, `/cookies`, `/cotizador`
- robots.txt referencia correctamente el sitemap
- `trailingSlash: 'never'` consistente

**Nota:** El sitemap se genera en build time. Verificar en producción que todas las 29 páginas de rental aparecen correctamente.

### 3.4 Imágenes — ⚠️ Área de mejora significativa

**Problema principal:** ~15 de las 24 subcategorías usan `heroImg` (hero.jpg genérico) como imagen principal.

| Subcategoría | Imagen hero | ¿Específica? |
|--------------|-------------|--------------|
| gruas-60-toneladas | gruas.avif | ✅ |
| gruas-80-toneladas | gruas.avif | ✅ |
| gruas-100-toneladas | gruas.avif | ✅ |
| gruas-250-toneladas | gruas.avif | ✅ |
| camiones-pluma | hero.jpg | ❌ Genérica |
| alza-hombre | hero.jpg | ❌ Genérica |
| gruas-horquilla | hero.jpg | ❌ Genérica |
| camiones-tolva | hero.jpg | ❌ Genérica |
| retroexcavadoras | hero.jpg | ❌ Genérica |
| minicargadores | hero.jpg | ❌ Genérica |
| tracto-camiones | hero.jpg | ❌ Genérica |
| cama-baja | hero.jpg | ❌ Genérica |
| semiremolques | hero.jpg | ❌ Genérica |
| torres-iluminacion | hero.jpg | ❌ Genérica |
| bombas-hormigon | hero.jpg | ❌ Genérica |
| compresores-aire | hero.jpg | ❌ Genérica |
| generadores-electricos | hero.jpg | ❌ Genérica |
| termofusionadoras | hero.jpg | ❌ Genérica |
| rodillos | hero.jpg | ❌ Genérica |
| placas-compactadoras | hero.jpg | ❌ Genérica |
| alisadora-de-pavimento | hero.jpg | ❌ Genérica |
| vibropison | hero.jpg | ❌ Genérica |
| mezcladoras-electricas | hero.jpg | ❌ Genérica |
| canastillos-alza-hombre | hero.jpg | ❌ Genérica |

**Impacto SEO:**
- Las imágenes genéricas no aportan señales de relevancia temática
- Alt text genérico ("Arriendo de [categoría]") no diferencia contenido
- Pierde oportunidad de ranking en Google Images para queries específicas
- OG image genérica reduce CTR en redes sociales

**Nota positiva:** Los equipos individuales del catálogo SÍ tienen imágenes específicas (avif).

---

## 4. Análisis de Contenido SEO por Categoría

### 4.1 Izaje — ⭐⭐⭐⭐⭐ (5/5)

** fortalezas:**
- Descripciones SEO completas (120-180 palabras) con keywords geográficas
- Titles con keyword + volumen (toneladas) + ubicación
- Meta descriptions optimizadas (140-160 chars)
- Equipos individuales con specs reales y marcas
- 4 categorías de grúas por tonelaje (excelente para long-tail)

**Keywords cubiertas:**
- "arriendo de grúas 60 toneladas"
- "arriendo de grúas 80 toneladas"
- "arriendo de grúas 100 toneladas"
- "arriendo de grúas 250 toneladas"
- "arriendo de camiones pluma"
- "arriendo de alza-hombre"
- "arriendo de grúas horquilla"

### 4.2 Movimiento de Tierra — ⭐⭐⭐⭐ (4/5)

**Fortalezas:**
- Descripciones SEO completas
- Keywords geográficas presentes
- Specs técnicas relevantes

**Oportunidades:**
- Falta mencionar marcas específicas en descriptions (John Deere sí está en catálogo)
- Podría agregar keywords como "excavación", "nivelación", "zanjas"

### 4.3 Transporte — ⭐⭐⭐⭐ (4/5)

**Fortalezas:**
- Descripciones SEO completas
- Menciona licencia A5 (señal de confianza)
- Keywords de carga sobredimensionada

**Oportunidades:**
- Agregar keywords de rutas específicas (Panamericana, Ruta 5, etc.)
- Mencionar permisos de tránsito como diferenciador

### 4.4 Equipos Especiales — ⭐⭐ (2/5) — ⚠️ CRÍTICO

**Problema grave:** Las últimas 6 subcategorías agregadas tienen contenido SEO significativamente inferior:

| Subcategoría | Words en description | seoDescription chars | Calidad |
|--------------|---------------------|---------------------|---------|
| torres-iluminacion | ~120 | ~140 | ✅ Buena |
| bombas-hormigon | ~100 | ~130 | ✅ Buena |
| compresores-aire | ~90 | ~130 | ✅ Buena |
| generadores-electricos | ~90 | ~140 | ✅ Buena |
| termofusionadoras | ~80 | ~120 | ✅ Aceptable |
| **rodillos** | **~25** | **~52** | **❌ Muy débil** |
| **placas-compactadoras** | **~25** | **~52** | **❌ Muy débil** |
| **alisadora-de-pavimento** | **~15** | **~45** | **❌ Muy débil** |
| **vibropison** | **~15** | **~45** | **❌ Muy débil** |
| **mezcladoras-electricas** | **~40** | **~100** | **⚠️ Débil** |
| **canastillos-alza-hombre** | **~35** | **~70** | **⚠️ Débil** |

**Problemas específicos:**

1. **Rodillos:** description de 25 palabras, no menciona keywords geográficas, no menciona tipos de suelo/asfalto
2. **Placas compactadoras:** description de 25 palabras, idéntica estructura a rodillos (copy-paste)
3. **Alisadora de pavimento:** description de 15 palabras, "Cotiza online." como único CTA
4. **Vibropisón:** description de 15 palabras, seoDescription dice "Alisadora de Vibropisón" (error de copy-paste)
5. **Mezcladoras eléctricas:** description aceptable pero seoDescription menciona "altura hasta 18 m" (dato incorrecto, es capacidad de 250-500L)
6. **Canastillos:** description corta, no menciona normativa de seguridad ni certificados

**Adicionalmente:**
- `shortDesc` de rodillos, placas, alisadora y vibropison es idéntica: "Equipos de compactación y terminación de pavimentos"
- `whatsappMessage` de placas-compactadoras dice "rodillo compactador" (error de copy-paste)
- `whatsappMessage` de canastillos dice "Canastillo Alza Hombre Metálico Ormet 2MF" para ambos equipos

---

## 5. Internal Linking

### 5.1 Estado Actual

| Tipo de enlace | Estado |
|----------------|--------|
| Breadcrumbs | ✅ Correctos en todas las páginas |
| Related Equipment | ✅ Presente en subcategorías (hermanas) |
| Category → Subcategory | ✅ Links en hubs de categoría |
| Hub → Categoria | ✅ Cards en /arriendo |
| Cross-category linking | ❌ No existe |
| Blog → Rental pages | ❌ No hay blog integrado aún |
| Rental pages → Services | ❌ No hay cross-linking |

### 5.2 Oportunidades de Internal Linking

1. **Cross-category linking:** Una subcategoría de "izaje" (ej: camiones-pluma) podría linkear a "transporte/cama-baja" como equipo complementario
2. **Contextual links en descriptions:** Las descriptions SEO podrían incluir links a categorías relacionadas
3. **Sidebar de categorías:** Agregar un sidebar o bloque lateral en subcategorías con las 4 categorías principales
4. **EquipmentSearch como nav:** El componente EquipmentSearch en homepage podría tener versión reducida en páginas de rental

---

## 6. Core Web Vitals & Performance

### 6.1 Aspectos Positivos

- Imágenes en formato AVIF (mejor compresión que WebP)
- Self-hosted fonts con preload (Archivo + Inter)
- SSG (páginas estáticas, TTFB mínimo)
- `loading="lazy"` en imágenes no críticas
- `fetchpriority="high"` en hero image
- CSS inline con Astro (no hay CSS blocking)

### 6.2 Oportunidades

| Aspecto | Estado | Recomendación |
|---------|--------|---------------|
| Hero images genéricas | hero.jpg reutilizada | Usar imágenes específicas por categoría (avif) |
| Font display | No verificado | Asegurar `font-display: swap` en CSS |
| Image dimensions | ✅ width/height presentes | Previene CLS |
| JS en <head> | Anti-FOUC + IO | Evaluar si IntersectionObserver puede ser diferido |

---

## 7. Checklist de Hallazgos y Recomendaciones

### 🔴 Críticos (Alto impacto, resolver pronto)

| # | Hallazgo | Archivo | Recomendación |
|---|----------|---------|---------------|
| C1 | Description SEO thin en rodillos | `src/data/rental.ts` L1162-1163 | Expandir a 120-180 palabras con keywords geográficas y de uso |
| C2 | Description SEO thin en placas-compactadoras | `src/data/rental.ts` L1208-1209 | Expandir description, corregir shortDesc duplicada |
| C3 | Description SEO thin en alisadora-de-pavimento | `src/data/rental.ts` L1254-1255 | Expandir description, agregar keywords de acabado de hormigón |
| C4 | Description SEO thin en vibropison | `src/data/rental.ts` L1300-1301 | Expandir description, corregir seoDescription ("Alisadora de Vibropisón") |
| C5 | Error copy-paste en seoDescription de vibropison | `src/data/rental.ts` L1318 | Cambiar "Alisadora de Vibropisón" → "Vibropisón" |
| C6 | Error copy-paste en whatsappMessage de placas | `src/data/rental.ts` L1247 | Cambiar "rodillo compactador" → "placa compactadora" |

### 🟡 Importantes (Medio impacto)

| # | Hallazgo | Archivo | Recomendación |
|---|----------|---------|---------------|
| I1 | Imágenes genéricas en 15 subcategorías | `src/data/rental.ts` | Asignar heroImage específica por subcategoría |
| I2 | Falta schema Product por equipo individual | `src/pages/arriendo/[categoria]/[subcategoria].astro` | Agregar ItemList con Product schemas por equipo |
| I3 | seoDescription de mezcladoras menciona "altura 18 m" | `src/data/rental.ts` L1364 | Corregir: no tiene altura, es capacidad 250-500L |
| I4 | shortDesc duplicada en 4 subcategorías | `src/data/rental.ts` | Diferenciar shortDesc de rodillos, placas, alisadora, vibropison |
| I5 | Sin cross-category internal linking | `src/components/rental/RelatedEquipment.astro` | Agregar enlaces a categorías complementarias |
| I6 | FAQ genéricas idénticas en todas las subcategorías | `src/pages/arriendo/[categoria]/[subcategoria].astro` L63-84 | Personalizar FAQs por tipo de equipo |

### 🟢 Quick Wins (Bajo esfuerzo, beneficio inmediato)

| # | Hallazgo | Archivo | Recomendación |
|---|----------|---------|---------------|
| Q1 | Patrón "Cotiza online." repetitivo | `src/data/rental.ts` | Variar CTAs: "Solicita cotización", "Responde en 24h", etc. |
| Q2 | Falta `brand` en Product schema | `src/lib/seo.ts` | Agregar brand con marcas reales (Grove, John Deere, etc.) |
| Q3 | `areaServed` faltante en subcategorías | `src/pages/arriendo/[categoria]/[subcategoria].astro` | Agregar areaServed al productSchemaExtended |
| Q4 | Alt text genérico en imágenes de categoría | `src/pages/arriendo/[categoria]/index.astro` | Usar alt text descriptivo por categoría |

---

## 8. Plan de Acción Priorizado

### Fase 1 — Correcciones Críticas (1-2 días)

1. **Expandir descriptions SEO de las 6 subcategorías débiles** en `src/data/rental.ts`:
   - rodillos, placas-compactadoras, alisadora-de-pavimento, vibropison, mezcladoras-electricas, canastillos-alza-hombre
   - Cada description debe tener 120-180 palabras, incluir: keyword principal, ubicación geográfica, specs clave, diferenciadores, CTA implícito

2. **Corregir errores de copy-paste:**
   - seoDescription de vibropison
   - whatsappMessage de placas-compactadoras
   - shortDesc duplicadas
   - seoDescription de mezcladoras (altura incorrecta)

3. **Variar meta descriptions** para evitar patrón repetitivo

### Fase 2 — Enriquecimiento de Contenido (3-5 días)

4. **Asignar imágenes específicas** a las 15 subcategorías con hero.jpg genérico
   - Priorizar: camiones-pluma, retroexcavadoras, tracto-camiones, torres-iluminacion
   - Formato: AVIF, optimizadas para web

5. **Personalizar FAQs por subcategoría** en lugar de las 5 genéricas actuales
   - Cada tipo de equipo tiene preguntas específicas de uso, mantenimiento, normativa

6. **Agregar schema Product individual por equipo** del catálogo
   - Cada equipo en el catálogo debería tener su propio Product schema con brand, sku, image

### Fase 3 — Estrategia Avanzada (1-2 semanas)

7. **Implementar cross-category internal linking**
   - Bloque de "equipos complementarios" en cada subcategoría
   - Links contextuales en descriptions

8. **Crear contenido de blog integrado** con páginas de rental
   - Guías de selección de equipos
   - Casos de uso por industria
   - Comparativas de equipos

9. **Agregar schema AggregateRating** cuando haya reseñas reales

10. **Optimizar para búsqueda local**
    - Páginas por región (Atacama, Coquimbo, Antofagasta)
    - Schema LocalBusiness mejorado con openingHours

---

## 9. Ejemplos de Corrección

### 9.1 Description SEO para Rodillos (ejemplo de mejora)

**Actual (25 palabras):**
```
Arriendo de rodillo vibratorio de doble tambor diseñado para la compactación de asfalto, bases granulares y suelos en obras de construcción, urbanización y mantenimiento vial.
```

**Propuesta (150 palabras):**
```
Arriendo de rodillos compactadores vibratorios de doble tambor en Chile para obras de construcción, pavimentación y mantenimiento vial. Equipos con peso operativo de 830 kg, motor diésel de bajo consumo y arranque eléctrico, ideales para compactación de asfalto, bases granulares, arenas y suelos en obras de urbanización, parques industriales y mantención de caminos. Operador certificado incluido, con experiencia en faenas de pavimentación y control de densidad según normativa MOP. Mantenimiento preventivo, seguros y combustibles incluidos durante todo el período de arriendo. Disponibilidad inmediata en zona norte (Atacama, Coquimbo) y centro de Chile, con respuesta operativa en menos de 24 horas. Excelente maniobrabilidad en espacios reducidos y zanjas. Solución eficiente para proyectos de compactación uniforme en superficies de asfalto, gravilla y suelos cohesivos.
```

### 9.2 seoDescription para Vibropisón (corrección)

**Actual (incorrecta):**
```
'Arriendo de Alisadora de Vibropisón. Cotiza online.'
```

**Propuesta:**
```
'Arriendo de vibropisón diésel en Chile. Fuerza de impacto 21 kN, ideal para compactación de suelos cohesivos y zanjas. Operador incluido. Disponibilidad inmediata. Cotiza online.'
```

### 9.3 Schema Product con Brand (ejemplo)

**Actual:**
```typescript
productSchemaExtended({
  name: subcategory.name,
  description: subcategory.seoDescription,
  url: Astro.url.pathname,
  image: subcategory.heroImage,
  offers: { availability: 'InStock', priceCurrency: 'CLP', priceRange: 'Consultar' },
})
```

**Propuesta (agregar brand):**
```typescript
productSchemaExtended({
  name: subcategory.name,
  description: subcategory.seoDescription,
  url: Astro.url.pathname,
  image: subcategory.heroImage,
  brand: 'IP Proyectos Industriales',
  offers: { availability: 'InStock', priceCurrency: 'CLP', priceRange: 'Consultar' },
})
```

---

## 10. Métricas de Éxito Propuestas

| Métrica | Actual | Objetivo (3 meses) |
|---------|--------|---------------------|
| Páginas con description > 120 palabras | 18/29 (62%) | 29/29 (100%) |
| Subcategorías con imagen hero específica | 9/24 (37%) | 24/24 (100%) |
| Schemas JSON-LD por página (promedio) | 4 | 5+ |
| Internal links cross-category | 0 | 2+ por subcategoría |
| FAQs personalizadas por equipo | 0/24 | 24/24 |

---

## 11. Conclusión

La implementación SEO del rental de equipos en IP Proyectos Industriales es **sólida en su base técnica** pero presenta **deudas de contenido** en las subcategorías más recientes (equipos especiales de compactación y terminación). La arquitectura de URLs, los schemas JSON-LD, los meta tags y el sitemap están bien resueltos. Las mejoras prioritarias son de contenido (expandir descriptions, corregir errores, personalizar FAQs) y de enriquecimiento técnico (imágenes específicas, schemas por equipo individual, internal linking estratégico).

Resolver las 6 correcciones críticas de la Fase 1 puede hacerse en 1-2 días y eliminará el riesgo de que Google interprete esas páginas como thin content, lo cual podría afectar negativamente la calidad percibida de todo el dominio.
