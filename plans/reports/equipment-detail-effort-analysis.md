---
feature: Página de Detalle de Equipo
type: Effort Analysis
date: 2026-09-07
status: Planned
---

# Análisis de Esfuerzo — Página de Detalle de Equipo

## Resumen de Esfuerzo Total

| Categoría | Cantidad de tareas | Horas estimadas |
|---|---|---|
| **Low Effort** | 3 | 4-5 horas |
| **Medium Effort** | 3 | 6-9 horas |
| **High Effort** | 1 | 6-8 horas |
| **Very High Effort** | 0 | 0 horas |
| **Total** | **7 tareas** | **~16-22 horas (2-3 días)** |

---

## Desglose por Tarea

### 1. Extensión del Modelo de Datos
- **Esfuerzo:** Medium
- **Duración:** 2-3 horas
- **Complejidad:** Baja-Media
- **Descripción:**
  - Agregar campos opcionales a `Equipment` interface (brand, description, specs, techSheetUrl, gallery, relatedSlugs, seoTitle, seoDescription)
  - Crear interface `EquipmentSpec`
  - Implementar función helper `findEquipmentBySlug()`
  - Poblar datos de 1 equipo de prueba (Grove RT 765 E)
- **Dependencias:** Ninguna
- **Riesgo:** Bajo — campos opcionales no rompen código existente

### 2. Modificación de EquipmentCard
- **Esfuerzo:** Low
- **Duración:** 1-2 horas
- **Complejidad:** Baja
- **Descripción:**
  - Agregar props `showDetailLink` y `detailHref` al componente
  - Agregar botón "Ver detalle" con variante ghost/outline
  - Crear estilos `.equipment-card__actions` con flex layout
  - Actualizar `EquipmentCatalog.astro` para pasar URLs de detalle
- **Dependencias:** Fase 1 (modelo de datos)
- **Riesgo:** Bajo — cambios aditivos, no rompe card existente

### 3. Creación de EquipmentDetailHero
- **Esfuerzo:** High
- **Duración:** 2-3 horas
- **Complejidad:** Media-Alta
- **Descripción:**
  - Layout 2 columnas (imagen + datos) en desktop
  - Layout en columna en mobile
  - Imagen principal con aspect-ratio 4:3
  - Badge de marca
  - Título H1, meta datos, features
  - CTA primario (QuoteAddButton grande)
  - Botón secundario (descarga PDF)
  - Breadcrumbs integrados
- **Dependencias:** Fase 1 (modelo de datos)
- **Riesgo:** Medio — diseño responsive requiere atención

### 4. Creación de EquipmentSpecsAccordion
- **Esfuerzo:** Low
- **Duración:** 1-2 horas
- **Complejidad:** Baja
- **Descripción:**
  - Reutilizar patrón de acordeón de FAQSection
  - Tabla con columnas Atributo/Propiedades
  - Animación de apertura/cierre suave
  - Responsive (tabla legible en mobile)
- **Dependencias:** Fase 1 (modelo de datos)
- **Riesgo:** Bajo — patrón ya existe en FAQSection

### 5. Creación de EquipmentDescription
- **Esfuerzo:** Low
- **Duración:** 30 min - 1 hora
- **Complejidad:** Baja
- **Descripción:**
  - Componente simple de texto
  - Renderizar description como párrafos
  - Disclaimer legal en texto muted
- **Dependencias:** Fase 1 (modelo de datos)
- **Riesgo:** Bajo

### 6. Creación de Ruta [equipo].astro
- **Esfuerzo:** Medium
- **Duración:** 2-3 horas
- **Complejidad:** Media
- **Descripción:**
  - Implementar `getStaticPaths()` para todos los equipos
  - Integrar todos los componentes de detalle
  - Configurar breadcrumbs de 5 niveles
  - Generar schemas SEO (Product + BreadcrumbList)
  - Calcular equipos relacionados desde `relatedSlugs`
- **Dependencias:** Fases 1, 3, 4, 5
- **Riesgo:** Medio — integración de múltiples componentes

### 7. SEO y Schema
- **Esfuerzo:** Low
- **Duración:** 1 hora
- **Complejidad:** Baja
- **Descripción:**
  - Product schema por equipo
  - BreadcrumbList schema
  - Meta tags (title, description, og:image)
  - Validación con Google Rich Results Test
- **Dependencias:** Fase 6 (ruta)
- **Riesgo:** Bajo

---

## Critical Path

```
Fase 1 (Modelo de datos) → Fase 2 (EquipmentCard) → Fase 3 (Hero) → Fase 6 (Ruta) → Fase 7 (SEO)
                                                         ↑
                                                   Fase 4 (Specs) ─┘
                                                         ↑
                                                   Fase 5 (Desc) ─┘
```

**El critical path pasa por:**
1. Extensión del modelo de datos (prerequisito de todo)
2. Creación de la página de detalle (integra todos los componentes)
3. SEO y schema (último paso antes de testing)

---

## Recursos Necesarios

| Recurso | Tipo | Cantidad |
|---|---|---|
| Desarrollador frontend (Astro) | Humano | 1 |
| Contenido: descripciones de equipos | Contenido | 1 equipo inicial, ~50 a futuro |
| Fichas técnicas PDF | Asset | Opcional en v1 |
| Imágenes adicionales (galería) | Asset | Opcional en v1 |

---

## Posibilidad de Desarrollo Paralelo

| Tarea | Paralelizable | Con qué |
|---|---|---|
| Fase 2 (EquipmentCard) | Sí | Con Fase 3, 4, 5 (componentes de detalle) |
| Fase 3 (Hero) | Sí | Con Fase 4 y 5 |
| Fase 4 (Specs) | Sí | Con Fase 3 y 5 |
| Fase 5 (Description) | Sí | Con Fase 3 y 4 |
| Fase 6 (Ruta) | No | Depende de Fases 1-5 |
| Fase 7 (SEO) | No | Depende de Fase 6 |

**En paralelo se pueden hacer las Fases 2, 3, 4 y 5** una vez completada la Fase 1, reduciendo el tiempo total de ~3 días a ~2 días.
