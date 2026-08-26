---
feature: Integración GTM, analítica SEM y captación de leads
effort: Very High
dependencies: [cuentas-google, consentimiento, endpoint-cotizacion, crm]
status: Completed
---

# Integración GTM, analítica SEM y captación de leads

## Overview

Implementar una medición confiable y respetuosa de la privacidad para que el equipo pueda
comparar campañas, servicios y calidad comercial. GTM será el punto de control; GA4 medirá el
comportamiento; Google Ads recibirá conversiones; el CRM cerrará el ciclo de calidad.

## Requisitos y criterios de aceptación

- [ ] GTM Web funciona en todas las rutas desde `BaseLayout.astro`.
- [ ] El contenedor se carga una sola vez y tiene entorno de Preview/producción documentado.
- [ ] Existe un estado de consentimiento por categoría antes de disparar tags no esenciales.
- [ ] GA4 recibe contexto de página y eventos sin PII.
- [ ] Una cotización solo cuenta como primaria cuando `/api/quote-email` responde éxito.
- [ ] WhatsApp, teléfono, email, catálogo y pasos del cotizador se reportan como eventos separados.
- [ ] `QuoteFormAdvanced` y `ContactSection` tienen endpoint válido o quedan excluidos de Ads.
- [ ] Google Ads usa como primaria una conversión de lead enviado; microconversiones son secundarias.
- [ ] CRM registra fuente, campaña, servicio y estado MQL/SQL/ganado.
- [ ] El equipo puede verificar cada evento en GTM Preview, GA4 DebugView y Google Ads.

## Implementación exacta

### 1. Bootstrap de GTM — dónde, cómo y por qué

**Dónde:** `src/layouts/BaseLayout.astro`, dentro de `<head>` después de la metadata básica,
y el `<noscript>` inmediatamente después de `<body>`.

**Cómo:** crear un contenedor Web para `ipproyectosindustriales.cl`; insertar el snippet
oficial con `is:inline`; inicializar `window.dataLayer` antes del snippet; usar el ID real
mediante una variable pública de build, nunca hardcodear secretos. No duplicar el snippet en
`RentalLayout`, `ServiceLayout` o páginas individuales.

**Por qué:** `BaseLayout` es el punto común y el sitio usa SSR, por lo que el tag queda en el
HTML inicial de todas las páginas sin depender de una hidratación global.

### 2. Contexto y dataLayer

Enviar solo datos no personales:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'site_context',
  page_type: 'cotizador',
  content_group: 'arriendo',
  locale: 'es-CL'
});
```

No enviar RUT, razón social, nombre, email, teléfono, dirección, texto libre ni información
de faena. Los datos de usuario para Conversiones mejoradas de leads requieren un flujo
separado, consentimiento y revisión de políticas; no deben mezclarse con analítica general.

### 3. Eventos prioritarios

| Evento | Disparador real en este proyecto | Tipo |
|---|---|---|
| `quote_add_item` | `CustomEvent` ya emitido por `QuoteAddButton`/`EquipmentPicker` | Micro |
| `quote_step_view` | Cambio vía `quote-wizard-navigate`/API del wizard | Funnel |
| `quote_form_start` | Primer foco/interacción en datos de empresa | Funnel |
| `quote_submit_success` | Respuesta exitosa de `POST /api/quote-email` | Primario |
| `whatsapp_click` | Click a `wa.me` | Secundario |
| `phone_click` | Click a `tel:` | Secundario |
| `email_click` | Click a `mailto:` | Secundario |
| `catalog_download` | Click al PDF de catálogo | Secundario |
| `form_submit_success` | Éxito de formulario alternativo, después de validar endpoint | Primario/secundario según negocio |
| `search` | Búsqueda real en catálogo | Intención |

Para GA4, mapear `quote_submit_success` a `generate_lead` como evento clave. No usar el
evento `page_view` manualmente si la etiqueta de Google ya lo registra, para evitar duplicados.

### 4. Atribución y calidad

- Activar auto-tagging en Google Ads.
- Conservar UTM y GCLID en el flujo hasta CRM.
- Generar un `lead_id` no personal en servidor para deduplicar reintentos.
- Registrar método (`email`, `whatsapp`, `phone`), servicio y región solo como categorías.
- Después de contar con histórico, importar MQL/SQL/ganado y valor mediante Conversiones
  mejoradas de clientes potenciales/Data Manager, no optimizar por volumen de formularios.

## Pasos de implementación

1. **Inventario de cuentas, endpoints y consentimiento** (Effort: Medium).
2. **Crear contenedor, roles, ambientes y convención de nombres** (Effort: Low).
3. **Añadir bootstrap a `BaseLayout.astro` y variable pública de GTM** (Effort: Low).
4. **Crear `src/lib/analytics.ts` y listeners de eventos existentes** (Effort: Medium).
5. **Definir tags/triggers/variables de GA4 y Conversion Linker** (Effort: Medium).
6. **Instrumentar éxito real de `/api/quote-email` y resolver `/api/contact`** (Effort: High).
7. **Implementar CMP/banner, preferencias y `/cookies`** (Effort: High).
8. **Configurar Google Ads, conversiones primarias/secundarias y UTMs** (Effort: Medium).
9. **Conectar CRM, scoring y pipeline** (Effort: High).
10. **Configurar Clarity, call tracking y LinkedIn por fases** (Effort: High).
11. **QA, consentimiento, accesibilidad, rendimiento y publicación** (Effort: Medium).

## Testing strategy

- GTM Preview: un solo bootstrap, activadores correctos y consentimiento correcto.
- GA4 DebugView: nombres, parámetros, ausencia de PII y no duplicación.
- Google Ads: diagnóstico de Conversion Linker/conversión y prueba con URL etiquetada.
- Cotizador: éxito, error SMTP, doble clic, refresh, navegación atrás y WhatsApp.
- Consentimiento: aceptar, rechazar, configurar, revocar y nueva visita.
- Cross-device/responsive: móvil (tel/WhatsApp), desktop (formulario), ad blocker y cookies deshabilitadas.
- Build: `npm run build`; no bloquear el render si GTM/CMP falla.

## Riesgos y mitigación

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Contar `/gracias` aunque no sea la confirmación real | Alto | Disparar desde la respuesta exitosa de `/api/quote-email`; usar `/gracias` solo si se convierte en thank-you real. |
| PII en dataLayer | Alto | Contrato de eventos sin PII y revisión en Preview/Network. |
| Endpoint `/api/contact` inexistente | Alto | Resolverlo antes de crear conversión o desactivar esa etiqueta. |
| Consentimiento implementado tarde | Alto | CMP/banner y política como dependencia de tags analíticos/marketing. |
| Doble conteo por GA4 automático + evento manual | Medio | Convención única y DebugView antes de publicar. |
| Optimizar por leads no calificados | Alto | CRM, scoring y conversiones de calidad antes de Smart Bidding avanzado. |

## Flow diagram

Ver [`../flows/gtm-lead-measurement.mmd`](../flows/gtm-lead-measurement.mmd) y los diagramas
específicos en [`flows/`](./flows/).

## Timeline

MVP de medición: **5–8 días hábiles** con cuentas y endpoint disponibles. Sistema completo con
CRM, consentimiento, call tracking y conversiones de calidad: **3–6 semanas**, por lo que se
clasifica como **Very High**.
