---
title: Reporte de factibilidad — GTM y analítica SEM
feature: gtm-analytics
effort: High
dependencies: []
status: Planned
---

# Reporte de factibilidad técnica

## 1. Resumen

La integración de GTM es **altamente factible** en el stack actual (Astro 7 SSR).
El principal riesgo no es técnico sino **legal/consentimiento** (Ley 19.628 / LPDP en
Chile) y la ausencia de un CRM para cerrar el loop de leads.

## 2. Análisis del stack actual

| Componente | Estado | Implicancia |
|-----------|--------|-------------|
| `output: server` (SSR) | ✓ | `<head>` renderizado en servidor → GTM carga temprano, sin parpadeo |
| `BaseLayout.astro` | ✓ único layout | Un solo punto de inyección para todos los tags |
| `quote_add_item` CustomEvent | ✓ existe | Gancho listo para evento de carrito/lead |
| `quote-wizard-navigate` | ✓ existe | Gancho para `quote_step_view` (funnel) |
| `dataLayer` / GA4 / GTM | ✗ inexistente | Debe crearse contenedor y script |
| `/cookies` | ⚠ placeholder | Debe implementarse política y consentimiento real |
| CRM | ✗ | Bloquea el cierre de loop (mejores leads) |
| `/api/contact` (action de `QuoteFormAdvanced` y otros formularios) | ⚠ no verificado | Sólo existe `pages/api/quote-email.ts`; riesgo de 404 en envío |
| Éxito del cotizador | ✓ respuesta JSON inline | La conversión sale después de `response.ok && result.success`; `/gracias` no es actualmente el thank-you del cotizador |

## 3. Paisaje competitivo (SEM B2B minería Chile)

- Finning Chile muestra una propuesta amplia de productos, arriendo, servicios y soporte;
  Salfa combina maquinaria, arriendo, convenios empresa, sucursales y contacto. Ambos elevan
  la expectativa de confianza y disponibilidad.
- La oportunidad de IP es competir con especialización: servicio industrial integrado,
  cobertura norte, contexto de faena y cotización B2B mejor calificada.
- No se debe afirmar que la competencia sub-mide llamadas sin una auditoría de sus cuentas;
  call tracking se recomienda como ventaja propia de atribución, no como hecho competitivo.

## 4. Riesgos y bloqueadores

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Consentimiento/política incompletos → riesgo legal o rechazo de cliente minero | Alto | CMP/banner por categorías + revisión jurídica + Consent Mode v2 antes de tags no esenciales |
| Cobertura/precio de call tracking en Chile | Medio | Cotizar Nimbata, CallRail y proveedores locales antes de elegir |
| Form `/api/contact` inexistente | Alto (pérdida de leads) | Verificar endpoint; contar solo respuestas exitosas y registrar errores |
| Dependencia de Astro `is:inline` para scripts | Bajo | Usar `is:inline` en snippets GTM y dataLayer |
| Ad blockers reducen datos | Medio | GTM server-side en fase P3 |
| Equipo sin CRM | Alto para "mejores leads" | Empezar con CRM/pipeline y luego Conversiones mejoradas de clientes potenciales/Data Manager |

## 5. Enfoque recomendado

1. **Fase 0 (días 1–2):** GTM + dataLayer + GA4 + Consent Mode v2 + banner.
2. **Fase 1 (semana 1):** Eventos de conversión + Google Ads + Search Console.
3. **Fase 2 (semana 2–3):** CRM + Conversiones mejoradas de leads/Data Manager + LinkedIn ABM + call tracking.
4. **Fase 3 (mes 2+):** Clarity, GTM server-side si el volumen lo justifica, y optimización value-based.

## 6. Dependencias externas

- Cuenta Google (GTM/GA4/Ads) del cliente.
- Proveedor de call tracking con cobertura CL.
- CRM (decisión de producto).

Ver plan de esfuerzo en [`gtm-effort-analysis.md`](./gtm-effort-analysis.md).
