---
feature: Stack de medición y captación
effort: High
dependencies: [project-overview]
status: Proposed
---

# Propuesta de stack tecnológico

Las siguientes son recomendaciones. Se deben confirmar con presupuesto, disponibilidad de
cuentas y política de datos del cliente.

## Stack recomendado

| Capa | Recomendación | Por qué | Esfuerzo |
|---|---|---|---|
| Sitio | Astro SSR existente | Mantiene el stack y ofrece un único layout global. | Low |
| Orquestación | GTM Web, un contenedor por dominio | Centraliza etiquetas, versiones, permisos y QA. | Medium |
| Analítica | GA4 vía GTM | Eventos, funnel, audiencias y atribución. | Medium |
| Publicidad | Google Ads Search primero | Captura intención alta por servicio/zona. | Medium |
| SEO/consulta | Search Console | Consultas reales, CTR, indexación y Core Web Vitals. | Low |
| UX | Microsoft Clarity | Heatmaps y sesiones para localizar abandono del cotizador. | Low |
| CRM | HubSpot Starter/Free o Pipedrive | Propietario del lead, pipeline y scoring comercial. | Medium/High |
| Llamadas | Proveedor con cobertura chilena, por ejemplo Nimbata; cotizar alternativa local | Atribuye llamadas reales, no solo clics en `tel:`. | High |
| B2B | LinkedIn Campaign Manager + Insight Tag | Segmenta cargo, industria y cuentas objetivo. | High |
| Reporting | Looker Studio conectado a GA4, Ads y CRM | Dashboard operativo y de calidad. | Medium |
| Optimización avanzada | Google Ads Data Manager / Conversiones mejoradas de leads | Devuelve estados MQL/SQL/ganado y valor a Ads. | Very High |

## Dónde se integra cada capa

1. **GTM:** `src/layouts/BaseLayout.astro`, una vez en `<head>` y el fallback al inicio de
   `<body>`; no insertar snippets repetidos en cada página.
2. **dataLayer:** módulo común (`src/lib/analytics.ts`) y eventos de los componentes del
   cotizador; nunca incluir RUT, nombre, email, teléfono o notas.
3. **GA4/Ads/LinkedIn/Clarity:** etiquetas gestionadas en GTM, con consentimiento y
   activadores documentados.
4. **CRM:** servidor/API después de validar el envío; el navegador no debe ser la única fuente
   de verdad de un lead.
5. **Dashboard:** capa de lectura; no usar Looker Studio para corregir datos mal etiquetados.

## Alternativas y trade-offs

| Necesidad | Recomendada | Alternativa | Trade-off |
|---|---|---|---|
| Consentimiento | CMP administrado compatible con GTM | Componente Astro propio | CMP reduce mantenimiento; propio reduce costo pero requiere revisión legal y QA permanente. |
| CRM | HubSpot o Pipedrive | Hoja de cálculo + webhook | Hoja sirve para piloto, pero no escala en scoring ni trazabilidad. |
| Call tracking | Nimbata, sujeto a cobertura/precio local | CallRail, proveedor local o solo Ads | Solo medir `tel:` no confirma llamadas ni calidad. |
| B2B paid media | Google Search + LinkedIn ABM | Meta/Display desde el inicio | Search tiene intención; LinkedIn tiene segmentación profesional, pero CPC suele ser mayor. |
| Etiquetado | GTM Web | GTM Server-Side | Server-side mejora control y resiliencia, pero agrega infraestructura/costo. |
| UX research | Clarity | Hotjar u otra solución | Clarity es gratuito; revisar políticas de grabación y enmascaramiento. |

## Reglas de gobernanza

- Un solo contenedor web y acceso mínimo por rol; activar 2FA.
- Convención de nombres: `TAG - canal - objetivo`, `TRG - evento`, `VAR - fuente`.
- Cada publicación debe tener descripción, versión, responsable y plan de rollback.
- No crear etiquetas directamente en páginas sin pasar por GTM, salvo el bootstrap requerido.
- No enviar información personal a GA4 ni a eventos personalizados.
- Mantener una matriz de consentimiento: categoría, proveedor, finalidad, duración y país.

## Integraciones y dependencias

- El dominio de producción debe conservar `gclid`, `gbraid`, `wbraid` y UTMs en redirects y
  durante el envío del lead.
- El CRM debe almacenar el origen, campaña, servicio, región, fecha, identificador de lead y
  estado comercial, con controles de acceso.
- Conversiones mejoradas de leads requieren aceptación de términos de datos de clientes,
  etiquetado automático, consentimiento y una revisión de la forma de normalizar/hash.
- Antes de habilitar Clarity, call recording o remarketing se debe validar enmascaramiento,
  retención y base legal.
