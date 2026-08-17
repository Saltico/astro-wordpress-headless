---
title: Análisis de esfuerzo — GTM y analítica SEM
feature: gtm-analytics
effort: Very High
dependencies: []
status: Planned
---

# Análisis de esfuerzo

Categorías: **Low** (1–4 h) · **Medium** (1–2 días) · **High** (3–5 días) · **Very High** (1+ semanas).

## Desglose por tarea

| # | Tarea | Esfuerzo | Depende de |
|---|-------|----------|------------|
| 1 | Crear contenedor GTM y obtener ID | Low | — |
| 2 | Insertar snippet GTM `<head>` + `<noscript>` en `BaseLayout.astro` | Low | 1 |
| 3 | Inicializar `dataLayer` con `page_type`/`content_group` (props layout) | Low | 2 |
| 4 | Consent Mode default + plantilla/CMP compatible previo a tags | Medium | 2 |
| 5 | Crear `src/lib/analytics.ts` (trackEvent + listeners click/CustomEvent) | Medium | 3 |
| 6 | Configurar variables/triggers/events en interfaz GTM | Medium | 5 |
| 7 | Conectar GA4 y Google Ads desde GTM | Medium | 6 |
| 8 | QA con Preview GTM + DebugView GA4 + ausencia de PII | Medium | 7 |
| 9 | CMP/banner de cookies (3 acciones + panel + revocación) | High | 4 |
| 10 | Puente Consent Mode v2 ↔ GTM (`consent_update`) | Medium | 9 |
| 11 | Reemplazar placeholder `/cookies` con texto legal | Low | 9 |
| 12 | Resolver `/api/contact` y éxito real de formularios | High | 5 |
| 13 | Definir conversiones primarias/secundarias en GA4/Ads | Medium | 7 |
| 14 | Asignar `value` estimado por categoría | Low | 5 |
| 15 | Search Console + Semrush (keywords SEM) | Low | — |
| 16 | LinkedIn Ads ABM (audiencias cuentas target) | High | 7 |
| 17 | Call tracking (proveedor con cobertura CL) | High | 7 |
| 18 | CRM (HubSpot/Pipedrive) + captura y scoring | High | 12 |
| 19 | Conversiones mejoradas de leads/Data Manager | Very High | 18 |
| 20 | Microsoft Clarity (heatmaps) | Low | 6 |
| 21 | GTM server-side (contenedor servidor) | Very High | 7 |

## Totales por categoría

| Categoría | # tareas | Estimado |
|-----------|----------|----------|
| Low | 7 | ~2–3 días |
| Medium | 7 | ~1.5–2 semanas |
| High | 5 | ~2.5–3 semanas |
| Very High | 2 | ~2–4 semanas |

## Ruta crítica

`1 → 2 → 3 → 5 → 6 → 7 → 8` (núcleo GTM+GA4) es el camino mínimo para empezar a medir.
El valor de "mejores leads" requiere además `9 → 10`, `12` (endpoints confiables),
`18 → 19` (cierre de loop CRM) y consentimiento; son los mayores contribuyentes al ROI del SEM.

Ver factibilidad en [`gtm-feasibility-report.md`](./gtm-feasibility-report.md).
