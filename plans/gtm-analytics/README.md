---
title: Plan GTM & Analítica — IP Proyectos Industriales
feature: gtm-analytics
effort: Very High
dependencies: [cuentas-google, consentimiento, crm]
status: Completed
last_updated: 2026-08-25
owner: Project Planner (opencode)
---

# Plan de Google Tag Manager y Analítica para IP Proyectos Industriales

> **Objetivo:** Integrar Google Tag Manager (GTM) para medir métricas y alimentar la
> estrategia SEM, e indicar qué otras herramientas recomendadas aplicar para obtener
> los **mejores leads** (cotizaciones calificadas de empresas mineras del norte de Chile).

## Contexto del proyecto (relevante para el plan)

| Dato | Valor |
|------|-------|
| Stack | Astro 7 + Tailwind v4 + TypeScript, **output `server` (SSR)** vía `@astrojs/node` |
| Dominio | `ipproyectosindustriales.cl` (es-CL) |
| Modelo de negocio | B2B: arriendo de maquinaria pesada + servicios industriales para minería |
| Paths de conversión | Cotizador (wizard 3 pasos), formularios alternativos, WhatsApp, teléfono, email, descarga de catálogo PDF |
| Estado actual de tags | **Ninguno.** No hay GTM, GA4, ni `dataLayer` |
| `/cookies` | Contenido placeholder — **no hay consentimiento implementado** |
| Gancho existente | `QuoteAddButton.astro` ya dispara `CustomEvent('quote_add_item', {detail:{slug}})` |
| Gancho existente 2 | `QuoteWizard.astro` escucha/usa `quote-wizard-navigate` y `goToStep` |

## ¿Por qué GTM y no etiquetas sueltas?

1. **Un solo snippet** controla GA4, Google Ads, remarketing, LinkedIn, Clarity, etc.
2. **Separación marketing/código:** los tags se configuran en la interfaz GTM sin tocar Astro.
3. **Consent Mode v2:** GTM/CMP controlan señales de analítica y publicidad según la elección del usuario; la configuración debe validarse contra la política y el marco legal aplicable.
4. **dataLayer centralizado:** fuente única de eventos de conversión para SEM.

## Estructura de este plan

| Documento | Qué contiene |
|-----------|--------------|
| [`feature-plan.md`](./feature-plan.md) | Alcance, aceptación, pasos, riesgos y timeline de la feature |
| [`gtm-implementation.md`](./gtm-implementation.md) | Dónde, cómo y por qué aplicar GTM (inyección en `BaseLayout`, dataLayer, arquitectura) |
| [`event-tracking-plan.md`](./event-tracking-plan.md) | Esquema del `dataLayer` y todos los eventos de conversión para SEM |
| [`consent-management.md`](./consent-management.md) | Banner de cookies + Consent Mode v2 y marco legal chileno |
| [`recommended-tools.md`](./recommended-tools.md) | Otras herramientas recomendadas para obtener mejores leads |
| [`sem-strategy.md`](./sem-strategy.md) | Cómo usar GTM+GA4+Ads para optimizar SEM y calificar leads |
| [`flows/`](./flows/) | Diagramas Mermaid (arquitectura, funnel, consent, dataLayer) |
| [`../reports/gtm-feasibility-report.md`](../reports/gtm-feasibility-report.md) | Factibilidad, riesgos y bloqueadores |
| [`../reports/gtm-effort-analysis.md`](../reports/gtm-effort-analysis.md) | Estimación de esfuerzo por tarea |

## Supuestos (a confirmar)

- Se creará un contenedor GTM nuevo (web). Aún no existe ID.
- El sitio sigue siendo SSR (`output: server`); el `<head>` se renderiza en servidor, por lo que el snippet GTM va directo en `BaseLayout.astro`.
- La conversión primaria será `generate_lead`, disparada únicamente cuando `POST /api/quote-email` responda éxito. La página `/gracias` no es actualmente la confirmación del cotizador.
- No hay CRM hoy; la recomendación actual es implementar primero un CRM y luego usar Conversiones mejoradas de clientes potenciales/Data Manager.
- El `dataLayer` nunca debe contener RUT, nombres, email, teléfono, dirección ni notas de la cotización.

## Preguntas de clarificación (responde para afinar el plan)

1. ¿Ya tienen cuenta de Google Ads / GA4 creada, o partimos de cero?
2. ¿Presupuesto mensual estimado de SEM? (define si vale la pena LinkedIn Ads / call tracking pagado)
3. ¿Tienen o planean un CRM (HubSpot, Pipedrive, Zoho)? Esto habilita el cierre de loop de leads.
4. ¿Quieren consentimiento **estricto** (bloquear todo hasta aceptar) o **por categorías** (recomendado)?
5. ¿El formulario `/api/contact` existe? (`QuoteFormAdvanced` y otros componentes apuntan ahí, pero solo se encontró `pages/api/quote-email.ts`).
6. ¿Se autoriza un CMP administrado o se requiere un banner propio revisado por asesoría legal?
