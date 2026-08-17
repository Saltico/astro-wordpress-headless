---
title: Herramientas recomendadas para obtener mejores leads
feature: recommended-tools
effort: Low (documentación) / Variable (implementación)
dependencies: [gtm-core]
status: Planned
---

# Otras herramientas recomendadas para obtener los mejores leads

GTM es el **centro de distribución**; estas herramientas se conectan a través de él
(o en paralelo) para captar, cualificar y cerrar leads B2B de minería.

## 1. Google Analytics 4 (GA4) — *P0, vía GTM*
- Comportamiento, embudos, atribución. Base para todo lo demás.
- Eventos `generate_lead`, `add_to_cart` (lead), `file_download` ya mapeados.

## 2. Google Ads (Search) — *P0, núcleo del SEM*
- Campañas de búsqueda con intención alta: "arriendo grúa minería Antofagasta",
  "arriendo maquinaria pesada Coquimbo", "cotizar izaje 250 toneladas".
- Conversiones importadas desde GTM (`generate_lead`, `whatsapp_click`, etc.).
- **Call Ads / extensiones de llamada** para captar leads telefónicos.

## 3. Google Search Console — *ya parcial (sitemap)*
- Consultas reales, CTR, posiciones. Alimenta la selección de keywords SEM.

## 4. Microsoft Advertising (Bing) — *recomendado*
- Audiencia B2B también presente; CPC suele ser menor que Google.

## 5. LinkedIn Ads — *CRÍTICO para B2B minería*
- Account-Based Marketing dirigido a cargos ( procurement, operations director,
  HSEQ) en cuentas target (Barrick, CMP, Aura Minerals, Cummins, etc.).
- Sitelink a cotizador; retargeting de visitantes del catálogo.

## 6. Call Tracking — *P1, validar cobertura y costo en Chile*
- El B2B minero cierra por teléfono/WhatsApp. El tracking de `tel:` solo mide clics,
  no llamadas reales.
- Cotizar Nimbata, CallRail y proveedores locales; confirmar cobertura, portabilidad y
  grabación para números chilenos antes de contratar.
- Integrar la llamada real como conversión en GA4/Ads solo después de probar atribución,
  consentimiento, retención y acceso a grabaciones.

## 7. CRM — *HubSpot, Pipedrive o Zoho* — *clave para "mejores leads"*
- Captura del lead desde GTM/forms → lead scoring → seguimiento comercial.
- **Cierre de loop:** usar Conversiones mejoradas de clientes potenciales/Data Manager o una
  integración validada para devolver ganada/perdida + valor a Google Ads. Esto es lo que
  realmente mejora la calidad del lead y el ROI del SEM.

## 8. Microsoft Clarity — *gratis, reemplaza a Hotjar*
- Heatmaps, session replay, mapa de fricción. Identifica dónde se abandona el cotizador.

## 9. Semrush / Ahrefs — *investigación SEM/SEO*
- Volumen y dificultad de keywords de arriendo de equipos en Chile; vigilancia de
  competidores (otras arrendadoras mineras).

## 10. WhatsApp Business Platform / proveedor autorizado — *P2, seguimiento*
- Respuesta y cualificación con opt-in; un clic a `wa.me` no prueba que exista un lead.
- No enviar conversaciones a remarketing sin consentimiento, finalidad y retención definidas.

## 11. GTM Server-Side (contenedor de servidor) — *avanzado*
- Mayor calidad de datos, menor pérdida por bloqueadores, cumplimiento LPDP.
- Requiere hosting (Cloud Run / servidor Node ya disponible en el deploy).

## Priorización para "mejores leads"

| Prioridad | Herramienta | Impacto en calidad de lead |
|-----------|-------------|----------------------------|
| P0 | GA4 + Google Ads + Consent Mode | Mide y optimiza SEM |
| P0 | CRM + pipeline de estados | Cierra loop y define calidad |
| P1 | Conversiones mejoradas de leads/Data Manager | Devuelve calidad a Google Ads |
| P1 | LinkedIn Ads (ABM) | Llega a tomadores de decisión |
| P1 | Call tracking (Nimbata) | Atribuye llamadas reales |
| P2 | Clarity | Reduce fricción en cotizador |
| P2 | Search Console + Semrush | Mejora selección de keywords |
| P3 | GTM server-side | Control adicional; requiere volumen y presupuesto |

Ver estrategia de uso en [`sem-strategy.md`](./sem-strategy.md).
