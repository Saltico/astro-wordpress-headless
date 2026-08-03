---
status: draft
depends_on: [01-seo-foundations]
---
# Anexo — Gestión y migración de dominio

## Fuente única

El dominio se configura por entorno con `PUBLIC_SITE_URL`. En producción el valor actual es `https://ipproyectosindustriales.cl`. No se debe construir con `window.location` ni duplicar URLs en componentes.

## Cambios de dominio

1. definir nuevo dominio y mantener el anterior operativo;
2. actualizar variable de producción;
3. revisar Astro, sitemap, robots, canonicals, OG, JSON-LD y emails;
4. configurar DNS y HTTPS;
5. redirigir el dominio antiguo con 301 al nuevo;
6. mantener equivalencia de rutas;
7. regenerar sitemap;
8. validar Search Console y Rich Results;
9. monitorear 404, cobertura y enlaces durante 30–90 días;
10. retirar el dominio anterior solo después de confirmar estabilidad.

## Criterios

- no hay mezcla de staging y producción;
- todas las URLs absolutas usan el dominio activo;
- no existen cadenas de redirección innecesarias;
- SPF, DKIM y DMARC se actualizan si cambia el dominio de email.
