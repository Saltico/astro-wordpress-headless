# Especificación global del proyecto

> Estado: `draft`  
> Documento diagnóstico: [`../global-project-analysis.md`](../global-project-analysis.md)

## Objetivo

Convertir el análisis global en un conjunto de especificaciones ejecutables, verificables y ordenadas por dependencia. Esta iteración es documental: no modifica código, assets ni configuración.

## Alcance de lanzamiento MVP

El MVP puede publicarse con datos estáticos. Son obligatorios: SEO técnico, diseño mobile first, WCAG 2.2 AA, usabilidad, rendimiento razonable, medición y cotizador con envío de email. No bloquean el lanzamiento: integración WordPress, Playwright, ISR y migración completa del catálogo.

## Orden de ejecución

1. [Baseline y validación](./00-baseline-validation.md)
2. [SEO y dominio](./01-seo-foundations.md)
3. [Performance y assets](./02-performance-assets.md)
4. [Sistema de diseño](./03-design-system.md)
5. [Limpieza de componentes](./04-component-cleanup.md)
6. [Cotizador MVP y email](./05-quote-mvp.md)
7. [WordPress posterior al MVP](./06-wordpress-integration.md)
8. [Validación y release](./07-validation-and-release.md)
9. [Anexo de dominio](./annex-domain-management.md)

## Reglas compartidas

- El dominio canónico actual es `https://ipproyectosindustriales.cl`, pero debe ser configurable mediante `PUBLIC_SITE_URL` durante el build.
- Las URLs SEO se generan en HTML/archivos estáticos; no dependen de JavaScript runtime.
- `tokens.css` es la fuente oficial del sistema visual.
- El proyecto mantiene `output: 'static'` para el MVP.
- `/cotizador` es una herramienta `noindex, follow`, con canonical autorreferente y excluida del sitemap.
- Los videos son decorativos y opcionales; el poster es la experiencia base.
- Los datos de WordPress tendrán snapshots locales de fallback, pero WordPress no es requisito del MVP.
- Las specs usan estados: `draft`, `review`, `approved`, `in-progress`, `implemented`, `verified`, `superseded`.

## Decisiones pendientes posteriores

- Proveedor concreto de email.
- Keywords y keyword mapping, a completar por el propietario.
- Capacidad real de PHP en Hostinger.
- Modelo final de FAQs en WordPress.
- Umbrales definitivos tras medir producción.
