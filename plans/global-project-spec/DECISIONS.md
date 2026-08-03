# Registro de decisiones

| ID | Decisión | Estado | Fecha |
|---|---|---|---|
| D-001 | Specs separadas por área con README maestro | Confirmada | 2026-07-31 |
| D-002 | Baseline antes de ejecutar hallazgos | Confirmada | 2026-07-31 |
| D-003 | Esta iteración solo crea documentación | Confirmada | 2026-07-31 |
| D-004 | Orden: baseline → SEO → performance → diseño → limpieza → cotizador → WordPress → release | Confirmada | 2026-07-31 |
| D-005 | Dominio actual: `https://ipproyectosindustriales.cl`; configurable por `PUBLIC_SITE_URL` | Confirmada | 2026-07-31 |
| D-006 | SEO absoluto se resuelve durante el build, no mediante JS cliente | Confirmada | 2026-07-31 |
| D-007 | `tokens.css` es la fuente visual canónica; consolidación conservadora | Confirmada | 2026-07-31 |
| D-008 | `--spacing-*` es nomenclatura canónica; `--space-*` queda como alias temporal | Confirmada | 2026-07-31 |
| D-009 | Mobile first y WCAG 2.2 AA | Confirmada | 2026-07-31 |
| D-010 | Videos opcionales con poster, carga no bloqueante y `prefers-reduced-motion` | Confirmada | 2026-07-31 |
| D-011 | Imágenes en `src/assets/images/`, organizadas por dominio y procesadas por Astro | Confirmada | 2026-07-31 |
| D-012 | Componentes no usados son candidatos a retiro hasta validar referencias | Confirmada | 2026-07-31 |
| D-013 | WordPress usa CPTs/taxonomías y plugin propio; es posterior al MVP | Confirmada | 2026-07-31 |
| D-014 | Snapshots remotos generados y versionados; datos curados separados | Confirmada | 2026-07-31 |
| D-015 | Fallos de WordPress usan fallback; errores de contrato detienen el build | Confirmada | 2026-07-31 |
| D-016 | `/cotizador` es `noindex, follow`, canonical propio y fuera del sitemap | Confirmada | 2026-07-31 |
| D-017 | El MVP incluye endpoint server-side de email; Hostinger/PHP es opción primaria | Confirmada | 2026-07-31 |
| D-018 | Proveedor de email queda pendiente; se usará contrato desacoplado | Confirmada | 2026-07-31 |
| D-019 | El cotizador no persiste PII en `localStorage` | Confirmada | 2026-07-31 |
| D-020 | Email requiere SPF, DKIM, DMARC, validación, antispam y privacidad | Confirmada | 2026-07-31 |
| D-021 | Playwright, ISR e integración WordPress no bloquean producción | Confirmada | 2026-07-31 |
| D-022 | Spec 01 ejecutado: title, description, dominio unificado, cotizador noindex,follow | Implementada | 2026-07-31 |
| D-023 | OG image placeholder creado como SVG; requiere JPG final diseñado | Pendiente | 2026-07-31 |
| D-024 | Spec 02 ejecutado: max-width consolidado a var(--container-max-width) en 12 archivos | Implementada | 2026-07-31 |
| D-025 | --container-max-width actualizado de 1200px a 1360px para coincidir con código existente | Implementada | 2026-07-31 |
| D-026 | PDF catálogo real verificado (11.8 MB); optimización diferida | Confirmada | 2026-07-31 |
| D-027 | Optimización de videos completada: 25.72 MB → 7.08 MB (72.5% reducción) con ffmpeg H.265 | Implementada | 2026-07-31 |
| D-028 | CSS limpieza (111.32 KB → ≤ 100 KB) diferida a spec 05 | Pendiente | 2026-07-31 |
| D-029 | Spec 03 ejecutado: Eyebrow unificado, .reveal global, colores con tokens, WCAG AA verificado | Implementada | 2026-07-31 |
| D-030 | Spacing hardcodeado (100+ ocurrencias px) diferido a spec 05 | Pendiente | 2026-07-31 |
| D-031 | outline: none en inputs mejorado con box-shadow para WCAG AA | Implementada | 2026-07-31 |
| D-032 | Spec 04 ejecutado: 6 componentes eliminados (TrustBand, Marquee, ClientsGrid, Select, QuoteForm, SpecsGrid) | Implementada | 2026-07-31 |
| D-033 | Todos los componentes eliminados estaban sin uso, sin imports ni dependencias | Confirmada | 2026-07-31 |
