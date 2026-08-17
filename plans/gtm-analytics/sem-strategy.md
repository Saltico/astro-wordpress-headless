---
title: Estrategia SEM y calificación de leads
feature: sem-strategy
effort: Medium (config) / High (cierre de loop)
dependencies: [gtm-core, event-tracking, recommended-tools]
status: Planned
---

# Cómo usar GTM + GA4 + Ads para optimizar SEM y obtener mejores leads

## Principio: del clic al cliente ganado

El SEM no termina en la conversión del sitio. Para "mejores leads" hay que cerrar el
loop: **clic → lead → oportunidad → cliente**, e importar de vuelta el resultado a Ads.

## Paso 1 — Definir conversiones en GA4 y Google Ads

- **Primaria:** `generate_lead` (desde `quote_submit_success`, después del éxito real de
  `/api/quote-email`). Esta es la que optimiza la puja.
- **Secundarias:** `contact_whatsapp`, `contact_phone`, `file_download`. Señalan intención
  pero no deben competir con la primaria en el aprendizaje del modelo.

## Paso 2 — Asignar valor (value-based bidding)

GTM puede empujar un `value` estimado por categoría en `quote_submit_success` (p. ej. izaje
alto tonelaje > transporte). Con valor, Google Ads usa *Target CPA* / *Target ROAS*
orientado a ticket, no solo a volumen de leads.

## Paso 3 — Cierre de loop con CRM (el factor "mejores leads")

1. El CRM recibe el lead (webhook desde form o integración GTM).
2. El equipo comercial califica (MQL → SQL) y registra ganado/perdido + monto.
3. Importar el resultado usando Conversiones mejoradas de clientes potenciales/Data Manager
   (o una integración vigente aprobada por Google):
   - Ads aprende qué keywords/campañas traen clientes reales, no solo formularios.
   - Se ajusta la puja por valor del cliente.
4. Excluir de audiencias a leads perdidos / fuera de perfil (ahorro de presupuesto).

## Paso 4 — Audiencias y remarketing

- **RLSA / Customer Match:** visitantes del cotizador que no enviaron, descargas de
  catálogo, cuentas de LinkedIn importadas.
- **Exclusiones:** evento de cotización enviada/lead convertido; `/gracias` solo si se usa como
  confirmación real, ya que hoy el cotizador muestra feedback inline.

## Paso 5 — Estructura de campañas SEM sugerida

| Campaña | Tipo | Keywords ejemplo |
|---------|------|------------------|
| Izaje alto tonelaje | Search | "arriendo grúa 250 toneladas", "izaje minería Antofagasta" |
| Movimiento de tierra | Search | "arriendo retroexcavadora", "camión tolva minería" |
| Transporte/especiales | Search | "cama baja sobredimensionado", "torre iluminación arriendo" |
| Servicios industriales | Search | "ingeniería detalle minería", "montaje electromecánico" |
| Retargeting | Display/Discovery | visitantes cotizador, catálogo |
| ABM LinkedIn | LinkedIn | cargos en cuentas target |

## Paso 6 — UTM y atribución

- Todo banner/correo/WhatsApp fuera del sitio lleva `utm_source`, `utm_medium`,
  `utm_campaign` para atribuir en GA4.
- Usar modelo de atribución *data-driven* de GA4 para distribution de crédito.

## Paso 7 — Calidad continua

- **Negative keywords:** alimentar desde términos de búsqueda y desde leads descartados en CRM.
- **Clarity/Audiencias:** detectar abandono en paso 2 del wizard y A/B test de copy.
- **Call tracking:** medir llamadas reales vs. clics para ajustar presupuesto teléfono.

## KPIs objetivo (sugerencia inicial)

- CPL (costo por lead) por categoría.
- Tasa de conversión visitante→`quote_submit_success`.
- % de leads que llegan a SQL (desde CRM).
- Valor promedio de cliente por canal.

Ver eventos en [`event-tracking-plan.md`](./event-tracking-plan.md) y funnel en
[`flows/quote-lead-funnel.mmd`](./flows/quote-lead-funnel.mmd).
