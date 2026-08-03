---
status: draft
depends_on: [00-baseline-validation, 01-seo-foundations]
release_gate: post-mvp
---
# 06 — Integración WordPress posterior al MVP

## Modelo

- `post`: noticias;
- `page`: institucional;
- CPT `service`, `equipment`, `project`, `testimonial`, `client`;
- taxonomías para categorías;
- FAQs como campos repetibles o CPT según reutilización;
- campos SEO explícitos: title, description, slug, OG, canonical, noindex.

## Configuración paso a paso en WordPress

1. Crear plugin propio de dominio.
2. Registrar CPTs con `show_in_rest`.
3. Registrar taxonomías y relaciones.
4. Definir campos obligatorios y opcionales por entidad.
5. Registrar campos REST o integrar ACF con exposición verificada.
6. Restringir endpoints a contenido publicado.
7. Crear roles y permisos mínimos.
8. Cargar contenido inicial y validar slugs.
9. Configurar imágenes, alt text y tamaños.
10. Configurar SEO, OG y redirecciones.
11. Probar payloads contra schemas compartidos.
12. Generar snapshots en `src/data/generated/`.
13. Mantener datos curados en `src/data/curated/`.
14. Intentar WordPress en build y usar snapshot si falla.
15. Alertar por antigüedad: noticias 7 días, servicios/equipos 30, institucional 90.
16. Configurar webhook autenticado para rebuild.
17. Probar rollback y ejecución manual.

## Contrato equipment

Debe definir identidad, clasificación, especificaciones variables, CTA, categorías, galería, alt, SEO, estado de publicación y campos requeridos para publicar.

## Errores

Timeout/5xx/DNS usan fallback y warning. Datos inválidos, schema incompatible, slugs inválidos o HTML incompleto detienen el build.

## Seguridad

Endpoints públicos solo para publicados; no exponer drafts, usuarios o datos privados. Webhook con firma/token rotatorio, replay protection, rate limit, logs sin secretos y CORS restringido.
