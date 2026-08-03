---
status: draft
depends_on: [00-baseline-validation, 01-seo-foundations, 02-performance-assets]
---
# 05 — Cotizador MVP y envío de email

## Alcance

El MVP funciona con catálogo estático. `/cotizador` es `noindex, follow`, canonical propio y fuera del sitemap.

## Carrito

Persistir solo en `localStorage`: id/slug, nombre mínimo, cantidad, observación y fecha. No persistir PII. Expirar a los 30 días, versionar el schema, tolerar corrupción, limpiar tras éxito y conservar selección en errores.

## Formulario

Obligatorios: nombre, email, teléfono, empresa, mensaje y aceptación de privacidad. Opcionales: comuna/región, zona de faena, fecha de inicio y duración.

## Email

El frontend llama a un endpoint server-side desacoplado del proveedor. Hostinger/PHP es opción primaria; serverless es fallback si PHP no está disponible. El proveedor concreto queda pendiente.

Requisitos: validación server-side, sanitización, rate limiting, honeypot/CAPTCHA, secretos en entorno, logs mínimos, idempotencia, respuesta accesible, reintento, alternativa WhatsApp y sin datos técnicos expuestos.

El remitente debe usar dominio corporativo autenticado con SPF, DKIM y DMARC. Usar `Reply-To` del usuario, no su email como `From`.

## Métricas

Medir sin PII: vista de equipo, agregar/eliminar, apertura, inicio, errores, éxito, WhatsApp y catálogo. No enviar nombre, email, teléfono, empresa ni mensaje a Analytics.

## Criterios de aceptación

- un usuario puede agregar, editar y eliminar equipos;
- el email llega a un proveedor configurado;
- el fallo conserva el carrito y ofrece alternativa;
- no hay secretos en el bundle;
- éxito/error es accesible y no genera duplicados;
- se prueba en móvil y desktop.
