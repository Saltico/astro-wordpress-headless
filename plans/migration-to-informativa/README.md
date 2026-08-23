# Migracion: Web Cotizacion/Rental -> Web Informativa Corporativa

> Transformar `iprental.cl` (sitio centrado en cotizador y rental) en `ipproyectosindustriales.cl` (sitio corporativo informativo con CTA "Contactar").

## Resumen ejecutivo

| Aspecto | Estado actual | Estado objetivo |
|---------|---------------|-----------------|
| Dominio | `www.iprental.cl` | `www.ipproyectosindustriales.cl` |
| Enfoque | Cotizador de rental | Informacion corporativa + servicios |
| CTA principal | "Cotizador" (badge + FAB + CTABand) | "Contactar" -> `/contacto` |
| Navegacion | Arriendo, Servicios, Seguridad | Empresa, Servicios, Rental, Seguridad, Compliance, Contacto |
| Homepage | Rental-first (buscador de equipos) | Corporate-first (video hero + quiene somos) |
| Email | contacto@iprental.cl | contacto@ipproyectosindustriales.cl |
| Cotizador | Pagina prominente | Pagina secundaria (noindex, acceso directo) |

## Fases

| # | Fase | Complejidad | Archivos principales |
|---|------|-------------|---------------------|
| 1 | Configuracion y SEO global | Baja | `astro.config.mjs`, `src/data/site.ts` |
| 2 | Navegacion y CTAs globales | Media | `BaseLayout.astro`, `Navigation.astro`, `Header.astro`, `site.ts` |
| 3 | Homepage corporativa | Alta | `src/pages/index.astro`, nuevos componentes |
| 4 | Pagina de Contacto | Media | `src/pages/contacto.astro`, nuevo componente formulario |
| 5 | Footer corporativo | Baja | `src/data/site.ts`, `Footer.astro` |
| 6 | Limpieza y desactivacion | Baja | `cotizador.astro`, `QuoteCartBadge`, `QuoteCartFloatingButton` |
| 7 | Verificacion y QA | Media | Build, validacion SEO, responsive |

## Dependencias

```
Fase 1 (Config) ──────┬──> Fase 2 (Navegacion)
                      ├──> Fase 3 (Homepage) ──> Fase 7 (QA)
                      ├──> Fase 4 (Contacto)
                      ├──> Fase 5 (Footer)
                      └──> Fase 6 (Limpieza)
```

Las fases 2-6 son independientes entre si (todas dependen de Fase 1). La Fase 7 se ejecuta al final.

## Web de referencia

El sitio HTML base esta en:
```
D:\Proyectos\Transformacion Digital\www.ipproyectosindustriales.cl\IP-Sitio-Web\
```

Paginas de referencia (usar como guia de contenido y estructura, NO de diseno):
- `index.html` (Empresa/Home)
- `servicios.html`, `ingenieria.html`, `construccion.html`, `montajes.html`, `portuaria.html`
- `arriendos.html`, `arriendo-izaje.html`, `arriendo-movimiento-tierra.html`, `arriendo-transporte.html`, `arriendo-equipos-especiales.html`
- `seguridad.html`, `compliance.html`
- `contacto.html` (formulario + info empresa)
- `noticias.html`

## Documentos del plan

| Archivo | Descripcion |
|---------|-------------|
| [README.md](./README.md) | Este documento - vision general |
| [fase-1-configuracion.md](./fase-1-configuracion.md) | Configuracion global y SEO |
| [fase-2-navegacion-ctas.md](./fase-2-navegacion-ctas.md) | Navegacion y CTAs globales |
| [fase-3-homepage-corporativa.md](./fase-3-homepage-corporativa.md) | Rediseño de la homepage |
| [fase-4-pagina-contacto.md](./fase-4-pagina-contacto.md) | Nueva pagina de contacto |
| [fase-5-footer-corporativo.md](./fase-5-footer-corporativo.md) | Footer corporativo |
| [fase-6-limpieza.md](./fase-6-limpieza.md) | Limpieza y desactivacion |
| [fase-7-verificacion.md](./fase-7-verificacion.md) | QA y verificacion final |
