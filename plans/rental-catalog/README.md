# Catálogo de Arriendo — Plan de Expansión (v2)

## Contexto

El sitio tiene **dos rutas paralelas** que consolidan en una sola bajo `/arriendo/` (singular, mejor match con queries transaccionales en Chile):

| Ruta actual | Estado | Acción |
|---|---|---|
| `/arriendos/` | Diseño correcto, sin sub-rutas | Migrar con 301 |
| `/arriendo-maquinaria/` | Esqueleto, sin diseño | Migrar con 301 |
| `/arriendo/` (nueva) | — | Crear |

Cada categoría (`izaje`, `movimiento-de-tierra`, `transporte`, `equipos-especiales`) expone sub-rutas por tipo de equipo. Cada sub-ruta es una **página catálogo** con una grilla visual de las maquinarias disponibles en esa subcategoría.

## Decisiones clave

- **Ruta raíz:** `/arriendo/` (singular)
- **Toneladas en URLs:** sí, cada tonnage es una sub-ruta (`gruas-60-toneladas`, `gruas-100-toneladas`, etc.)
- **Alcance v1:** sub-ruta catálogo (1 página por tonnage con grilla de modelos), no página individual por modelo
- **Imágenes v1:** placeholder genérico (`hero.jpg`) reusado
- **Routing:** dinámico con `getStaticPaths()` (3 templates generan 27 páginas)
- **Fuente de datos única:** `src/data/rental.ts`
- **Migración:** redirects 301 vía `public/.htaccess` (Hostinger shared hosting = Apache)

## Árbol de URLs final

```
/arriendo/                                                    ← Hub catálogo
├── izaje/                                                    ← Categoría
│   ├── gruas-60-toneladas                                    ← Sub-ruta catálogo
│   ├── gruas-80-toneladas
│   ├── gruas-100-toneladas
│   ├── gruas-250-toneladas
│   ├── camiones-pluma
│   ├── alza-hombre
│   └── gruas-horquilla
├── movimiento-de-tierra/
│   ├── camiones-tolva
│   ├── retroexcavadoras
│   └── minicargadores
├── transporte/
│   ├── tracto-camiones
│   ├── cama-baja
│   └── semiremolques
└── equipos-especiales/
    ├── torres-iluminacion
    ├── bombas-hormigon
    ├── compresores-aire
    ├── generadores-electricos
    ├── termofusionadoras
    └── mezcladoras-electricas-canastillo
```

**Total: 24 páginas** (1 hub + 4 categorías + 19 sub-rutas con catálogo).

## Especificaciones por área funcional

| # | Spec | Fase | Estado | Archivos principales |
|---|---|---|---|---|
| 01 | [Modelo de datos](./01-data-model.md) | 1 | ✅ Completo | `src/data/rental.ts` |
| 02 | [Componentes del catálogo](./02-catalog-components.md) | 2 | ✅ Completo | `src/components/rental/EquipmentCatalog.astro`, `EquipmentCard.astro` |
| 03 | [Templates de rutas dinámicas](./03-routes-templates.md) | 3-5 | ✅ Completo | `src/pages/arriendo/{index,[categoria]/index,[categoria]/[subcategoria]}.astro` |
| 04 | [Slots en RentalLayout](./04-layout-slots.md) | 6 | ✅ Completo | `src/layouts/RentalLayout.astro` |
| 05 | [Componentes secundarios](./05-secondary-components.md) | 7 | ✅ Completo | `SpecsGrid`, `RelatedEquipment`, `FAQSection` |
| 06 | [Schemas SEO](./06-seo-schema.md) | 8 | ✅ Completo | `src/lib/seo.ts` |
| 07 | [Redirects y migración](./07-redirects-migration.md) | 9 | ✅ Completo | `public/.htaccess` |
| 08 | [Integración al sitio](./08-site-integration.md) | 10-12 | ✅ Completo | `Header`, `Navigation`, `Footer`, `index.astro` |
| 09 | [Sitemap](./09-sitemap.md) | 13 | ✅ Completo | `astro.config.mjs` (verificación) |
| 10 | [Criterios de aceptación](./10-acceptance-criteria.md) | 14-15 | ✅ Completo | Smoke test + DoD |

**Leyenda:** ⬜ Pendiente · 🟡 En progreso · ✅ Completo

## Orden de implementación

1. **01-data-model** — fuente de verdad (sin ella nada se puede renderizar)
2. **02-catalog-components** — UI básica del catálogo
3. **03-routes-templates** — primera versión navegable (3 templates + slots vacíos)
4. **04-layout-slots** — refactor del layout para soportar contenido variable
5. **05-secondary-components** — enriquece las sub-rutas (specs, related, FAQ)
6. **06-seo-schema** — schemas `Product`, `ItemList`, `Offer` por nivel
7. **07-redirects-migration** — `.htaccess` con 301 desde rutas viejas
8. **08-site-integration** — navegación, footer, home, links internos
9. **09-sitemap** — verificación de `@astrojs/sitemap`
10. **10-acceptance-criteria** — checklist final + smoke test

**Criterio de "Done" para cada fase:** definido al final de cada spec. Marcar ✅ en este README cuando se complete.

## Glosario de rutas (24 URLs finales)

```
/arriendo                                                       Hub catálogo
/arriendo/izaje                                                  Cat · Izaje
/arriendo/izaje/gruas-60-toneladas
/arriendo/izaje/gruas-80-toneladas
/arriendo/izaje/gruas-100-toneladas
/arriendo/izaje/gruas-250-toneladas
/arriendo/izaje/camiones-pluma
/arriendo/izaje/alza-hombre
/arriendo/izaje/gruas-horquilla
/arriendo/movimiento-de-tierra                                   Cat · Mov. tierra
/arriendo/movimiento-de-tierra/camiones-tolva
/arriendo/movimiento-de-tierra/retroexcavadoras
/arriendo/movimiento-de-tierra/minicargadores
/arriendo/transporte                                             Cat · Transporte
/arriendo/transporte/tracto-camiones
/arriendo/transporte/cama-baja
/arriendo/transporte/semiremolques
/arriendo/equipos-especiales                                     Cat · Eq. especiales
/arriendo/equipos-especiales/torres-iluminacion
/arriendo/equipos-especiales/bombas-hormigon
/arriendo/equipos-especiales/compresores-aire
/arriendo/equipos-especiales/generadores-electricos
/arriendo/equipos-especiales/termofusionadoras
/arriendo/equipos-especiales/mezcladoras-electricas-canastillo
```

## Convenciones transversales

- **Slugs:** kebab-case, lowercase, sin acentos (`movimiento-de-tierra`, no `movimiento de tierra`)
- **Nombres visibles:** con tildes correctas (`Movimiento de Tierra`, no `Movimiento-de-tierra`)
- **Toneladas en URL:** número sin unidad, sufijo `-toneladas` (`gruas-100-toneladas`)
- **Toneladas en copy:** con unidad y espacio (`Grúas de 100 toneladas`)
- **Imágenes v1:** todas apuntan a `@/assets/imgs/hero.jpg`
- **WhatsApp:** pre-armado por cada equipo, número base `+56 9 5659 4144`
- **Canonical:** self-referencing en cada página (`<link rel="canonical" href="https://ipproyectosindustriales.cl{pathname}">`)
- **Schema por nivel:**
  - Hub catálogo → `CollectionPage`
  - Hub categoría → `Service`
  - Sub-ruta catálogo → `Product` + `Offer` + `ItemList`
  - FAQ → `FAQPage`

## Estructura de archivos del proyecto (post-migración)

```
src/
├── data/
│   └── rental.ts                          ← Spec 01
├── components/
│   ├── rental/                            ← Specs 02 y 05
│   │   ├── EquipmentCatalog.astro
│   │   ├── EquipmentCard.astro
│   │   ├── SpecsGrid.astro
│   │   ├── RelatedEquipment.astro
│   │   └── FAQSection.astro
│   └── ... (sin cambios)
├── layouts/
│   └── RentalLayout.astro                 ← Spec 04 (refactor con slots)
├── lib/
│   └── seo.ts                             ← Spec 06 (extensión productSchema)
├── pages/
│   ├── arriendo/                          ← Spec 03 (nuevo, dinámico)
│   │   ├── index.astro
│   │   └── [categoria]/
│   │       ├── index.astro
│   │       └── [subcategoria].astro
│   ├── arriendos/                         ← ELIMINAR tras Spec 07
│   ├── arriendo-maquinaria/               ← ELIMINAR tras Spec 07
│   └── ... (sin cambios)
└── ...

public/
└── .htaccess                              ← Spec 07
```

## Riesgos transversales

| Riesgo | Mitigación |
|---|---|
| Pérdida de tráfico al migrar `/arriendos/` → `/arriendo/` | 301 en `.htaccess`; contenido equivalente |
| Contenido thin en sub-rutas con pocos modelos | Párrafo SEO (120-180 palabras) + features + specs + FAQ |
| Canonicalización inconsistente | Self-referencing canónico en cada página |
| Sobre-optimización de anchor text | Variar anchor (nombre equipo, capacidad, uso) |
| Mapping de `/arriendo-maquinaria/gruas-grove-gmk` | Redirect explícito con anchor (`#grua-grove-gmk-4100`) |

## Referencias

- Plan original (single-file): `plans/rental-catalog-expansion.md` (histórico, mantener hasta validar la nueva estructura)
- Documentación Astro: https://docs.astro.build
- Documentación `@astrojs/sitemap`: https://docs.astro.build/en/guides/integrations-guide/sitemap/
- Schema.org Product: https://schema.org/Product
- Schema.org ItemList: https://schema.org/ItemList
