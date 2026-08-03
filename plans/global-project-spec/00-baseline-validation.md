---
status: draft
depends_on: []
---
# 00 — Baseline y validación inicial

## Objetivo

Verificar el diagnóstico antes de convertirlo en tareas. Cada hallazgo debe quedar como `confirmado`, `no reproducido`, `pendiente` o `requiere validación externa`.

## Alcance

Inventariar rutas, componentes, imports, assets, estilos, metadata, sitemap, robots, configuración de dominio, build y comportamiento actual del cotizador.

## Procedimiento

1. Ejecutar `npm run build` y guardar resultado.
2. Registrar versión de Node, Astro y dependencias.
3. Enumerar `src/pages`, rutas generadas y redirecciones.
4. Construir grafo de imports de `src/components`.
5. Confirmar candidatos no utilizados, incluyendo imports indirectos.
6. Medir videos, imágenes, fuentes, PDFs y JS/CSS generados.
7. Inspeccionar HTML de las rutas principales: title, description, canonical, H1, OG, JSON-LD y robots.
8. Validar `robots.txt`, sitemap y URLs absolutas.
9. Verificar enlaces internos y `/cotizador`.
10. Registrar diferencias entre `tokens.css`, `base.css` y estilos scoped.

## Salidas

- inventario de rutas con indexación esperada;
- inventario de componentes y uso confirmado;
- inventario de assets con peso y formato;
- matriz de hallazgos con evidencia de archivo/línea/comando;
- medición inicial de Lighthouse para homepage, servicio, catálogo y cotizador;
- lista de supuestos invalidados.

## Criterios de aceptación

- el build reproduce el estado actual;
- todos los hallazgos del análisis tienen estado y evidencia;
- se identifican contradicciones antes de editar código;
- ningún componente se elimina solo por ausencia de import estático.
