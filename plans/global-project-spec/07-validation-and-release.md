---
status: draft
depends_on: [01-seo-foundations, 02-performance-assets, 03-design-system, 05-quote-mvp]
---
# 07 — Validación y release

## MVP obligatorio

- `npm run build` reproducible;
- SEO técnico y metadata completa;
- dominio configurable y sitemap coherente;
- mobile first;
- WCAG 2.2 AA como objetivo;
- cotizador y email funcionales;
- videos opcionales;
- imágenes con formatos, dimensiones y alt;
- Core Web Vitals dentro del presupuesto o excepciones documentadas;
- Search Console, PageSpeed y analítica con consentimiento;
- validación estática y revisión manual.

## No bloquean MVP

- WordPress;
- snapshots remotos;
- webhook de rebuild;
- Playwright;
- ISR;
- migración completa del catálogo.

## Comandos objetivo

```text
npm run check
npm run build
npm run audit:seo
npm run audit:links
npm run audit:assets
```

Inicialmente pueden ser validaciones Node simples. Playwright queda para una segunda fase.

## Checklist de release

1. revisar estado de specs;
2. ejecutar baseline y corregir hallazgos críticos;
3. validar páginas principales en 320/375/768/1024/1280 px;
4. probar teclado, foco, contraste y reduced motion;
5. probar cotizador, email, error y WhatsApp;
6. revisar HTML, canonical, title, description, OG, JSON-LD;
7. validar sitemap/robots;
8. ejecutar Lighthouse móvil;
9. probar Search Console y Rich Results Test;
10. verificar analítica sin PII y consentimiento;
11. documentar excepciones y rollback;
12. aprobar release.
