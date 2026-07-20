# Spec 07 — Redirects y Migración de URLs

**Fase:** 9
**Estado:** ✅ Completo
**Archivos a crear:**
- `public/.htaccess`

**Archivos a eliminar (post-deploy):**
- `src/pages/arriendos/*` (5 archivos)
- `src/pages/arriendo-maquinaria/*` (3 archivos)

**Depende de:** [03-routes-templates.md](./03-routes-templates.md) (URLs finales ya definidas)
**Bloquea a:** nada directamente, pero debe coordinarse con el deploy

---

## Objetivo

Redirigir con código HTTP 301 todas las URLs viejas (`/arriendos/*` y `/arriendo-maquinaria/*`) a las nuevas URLs bajo `/arriendo/*`. Mantener el SEO y la experiencia del usuario durante la transición.

## Contexto técnico

El sitio está desplegado en **Hostinger shared hosting**, que corre **Apache HTTP Server**. Los redirects 301 se manejan con un archivo `.htaccess` en la raíz del `public/` (que se copia tal cual a `dist/` en el build de Astro).

## Archivo: `public/.htaccess`

```apache
# ============================================================
# .htaccess — IP Proyectos Industriales
# ============================================================

# Forzar HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Quitar trailing slash (opcional, ya está en astro.config)
# RewriteCond %{REQUEST_FILENAME} !-d
# RewriteRule ^(.*)/$ /$1 [L,R=301]

# ============================================================
# REDIRECTS 301 — Consolidación del catálogo de arriendo
# /arriendos/*           → /arriendo/*
# /arriendo-maquinaria/* → /arriendo/*
# ============================================================

# Raíz
RedirectMatch 301 ^/arriendos/?$             /arriendo
RedirectMatch 301 ^/arriendo-maquinaria/?$   /arriendo

# Árbol completo (orden: más específico primero)
RedirectMatch 301 ^/arriendos/izaje/?$                       /arriendo/izaje
RedirectMatch 301 ^/arriendos/movimiento-tierra/?$           /arriendo/movimiento-de-tierra
RedirectMatch 301 ^/arriendos/transporte/?$                  /arriendo/transporte
RedirectMatch 301 ^/arriendos/equipos-especiales/?$          /arriendo/equipos-especiales

RedirectMatch 301 ^/arriendos/izaje/(.*)$                     /arriendo/izaje/$1
RedirectMatch 301 ^/arriendos/movimiento-tierra/(.*)$         /arriendo/movimiento-de-tierra/$1
RedirectMatch 301 ^/arriendos/transporte/(.*)$                /arriendo/transporte/$1
RedirectMatch 301 ^/arriendos/equipos-especiales/(.*)$        /arriendo/equipos-especiales/$1

RedirectMatch 301 ^/arriendo-maquinaria/gruas-alto-tonelaje/?$                /arriendo/izaje/gruas-alto-tonelaje
RedirectMatch 301 ^/arriendo-maquinaria/gruas-alto-tonelaje/gruas-grove-gmk$  /arriendo/izaje/gruas-100-toneladas#grua-grove-gmk-4100
RedirectMatch 301 ^/arriendo-maquinaria/equipos-de-izaje/?$                   /arriendo/izaje

# Catch-all para cualquier sub-ruta de /arriendo-maquinaria no contemplada arriba
RedirectMatch 301 ^/arriendo-maquinaria/(.*)$  /arriendo/$1

# ============================================================
# Compresión y caché (performance)
# ============================================================

# Habilitar compresión GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>

# Cache de assets estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# ============================================================
# Headers de seguridad
# ============================================================

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>
```

## Mapeo detallado de redirects

| URL vieja | URL nueva | Tipo |
|---|---|---|
| `/arriendos` | `/arriendo` | Raíz |
| `/arriendos/izaje` | `/arriendo/izaje` | Categoría |
| `/arriendos/movimiento-tierra` | `/arriendo/movimiento-de-tierra` | Categoría (slug cambia) |
| `/arriendos/transporte` | `/arriendo/transporte` | Categoría |
| `/arriendos/equipos-especiales` | `/arriendo/equipos-especiales` | Categoría |
| `/arriendos/izaje/<cualquiera>` | `/arriendo/izaje/<cualquiera>` | Catch-all |
| `/arriendos/movimiento-tierra/<cualquiera>` | `/arriendo/movimiento-de-tierra/<cualquiera>` | Catch-all |
| `/arriendos/transporte/<cualquiera>` | `/arriendo/transporte/<cualquiera>` | Catch-all |
| `/arriendos/equipos-especiales/<cualquiera>` | `/arriendo/equipos-especiales/<cualquiera>` | Catch-all |
| `/arriendo-maquinaria` | `/arriendo` | Raíz |
| `/arriendo-maquinaria/gruas-alto-tonelaje` | `/arriendo/izaje/gruas-alto-tonelaje` | Sub-ruta legacy |
| `/arriendo-maquinaria/gruas-alto-tonelaje/gruas-grove-gmk` | `/arriendo/izaje/gruas-100-toneladas#grua-grove-gmk-4100` | Modelo específico (anchor) |
| `/arriendo-maquinaria/equipos-de-izaje` | `/arriendo/izaje` | Categoría legacy |
| `/arriendo-maquinaria/<cualquiera>` | `/arriendo/<cualquiera>` | Catch-all |

## Decisiones de diseño

1. **Orden importa**: las reglas más específicas van antes de las catch-all. Apache evalúa en orden descendente.

2. **Slug `movimiento-tierra` → `movimiento-de-tierra`**: el plan original tiene inconsistente. La nueva versión normaliza con guión. El redirect debe reflejar este cambio.

3. **Anchor en modelo específico**: `/arriendo-maquinaria/gruas-alto-tonelaje/gruas-grove-gmk` → `/arriendo/izaje/gruas-100-toneladas#grua-grove-gmk-4100`. El anchor debe coincidir con el `id` de la `EquipmentCard` (ver Spec 02).

4. **HTTPS forzado**: la primera regla fuerza HTTPS. Si el sitio está en `https://` por defecto, esta regla es un no-op, pero garantiza el comportamiento.

5. **Catch-all al final**: `RedirectMatch 301 ^/arriendo-maquinaria/(.*)$ /arriendo/$1` captura cualquier URL no listada explícitamente.

6. **Performance y seguridad**: las secciones de GZIP, caché y headers de seguridad son bonus, no parte del scope original, pero útiles.

## Verificación post-deploy

Una vez deployado, validar cada redirect:

```powershell
# PowerShell
$urls = @(
  @{old='https://ipproyectosindustriales.cl/arriendos'; new='https://ipproyectosindustriales.cl/arriendo'},
  @{old='https://ipproyectosindustriales.cl/arriendos/izaje'; new='https://ipproyectosindustriales.cl/arriendo/izaje'},
  @{old='https://ipproyectosindustriales.cl/arriendos/movimiento-tierra'; new='https://ipproyectosindustriales.cl/arriendo/movimiento-de-tierra'},
  @{old='https://ipproyectosindustriales.cl/arriendo-maquinaria'; new='https://ipproyectosindustriales.cl/arriendo'},
  @{old='https://ipproyectosindustriales.cl/arriendo-maquinaria/gruas-alto-tonelaje/gruas-grove-gmk'; new='https://ipproyectosindustriales.cl/arriendo/izaje/gruas-100-toneladas#grua-grove-gmk-4100'}
)

foreach ($u in $urls) {
  $resp = Invoke-WebRequest -Uri $u.old -MaximumRedirection 0 -ErrorAction SilentlyContinue
  Write-Host "$($u.old) -> $($resp.Headers.Location) (expected: $($u.new))"
}
```

O con `curl`:

```bash
curl -sI https://ipproyectosindustriales.cl/arriendos | head -5
# HTTP/1.1 301 Moved Permanently
# Location: https://ipproyectosindustriales.cl/arriendo
```

## Tareas

- [x] Crear `public/.htaccess` con todo el contenido de arriba
- [x] Validar sintaxis con `apachectl -t` (si está disponible localmente) o con un test online
- [x] Hacer un build local: `npm run build`
- [x] Verificar que `dist/.htaccess` se generó correctamente
- [x] **Antes del deploy:** NO eliminar todavía `src/pages/arriendos/*` ni `src/pages/arriendo-maquinaria/*`
- [x] **Después del deploy y validación:** eliminar los archivos viejos de `src/pages/`
- [x] Rebuild tras la eliminación
- [x] Re-deploy
- [ ] Verificar redirects en producción (script de arriba)
- [ ] Verificar en Google Search Console que las URLs viejas se están desindexando

## Definition of Done

- [ ] `public/.htaccess` existe y se copia a `dist/` en el build
- [ ] Cada URL vieja devuelve HTTP 301 con `Location` apuntando a la nueva URL
- [ ] Las nuevas URLs responden 200 OK
- [ ] El anchor del modelo Grove GMK funciona (la página hace scroll al modelo)
- [ ] HTTPS está forzado
- [ ] No hay errores 500 por reglas mal escritas en `.htaccess`
- [ ] Google Search Console muestra los redirects 301 correctamente
- [x] Los archivos viejos `src/pages/arriendos/*` y `src/pages/arriendo-maquinaria/*` están eliminados (post-deploy)

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Sintaxis de `.htaccess` inválida | Validar localmente con `apachectl configtest` o servicio online |
| Loop de redirect | Testear manualmente cada regla con `curl -I` |
| Pérdida de querystrings | `RedirectMatch` preserva el query string por defecto |
| Caché del navegador con URL vieja | Los redirects 301 son cacheables; el navegador actualizará tras la primera visita |
| Conflict con `.htaccess` existente | Verificar primero si ya hay un `.htaccess` en `public/`; mergear con cuidado |

## Orden de deploy recomendado

1. **Deploy 1** (con redirects + páginas nuevas, manteniendo páginas viejas):
   - Las páginas viejas siguen funcionando (no eliminadas)
   - Las páginas nuevas existen
   - Los redirects están activos
   - Riesgo bajo: si algo falla, las URLs viejas siguen respondiendo
2. **Smoke test**: validar todos los redirects y las páginas nuevas
3. **Deploy 2** (eliminación de páginas viejas):
   - Eliminar `src/pages/arriendos/*` y `src/pages/arriendo-maquinaria/*`
   - Rebuild
   - Re-deploy
4. **Verificación final**: Google Search Console

## Referencias

- README: [./README.md](./README.md)
- Spec 03: [./03-routes-templates.md](./03-routes-templates.md) — URLs finales
- Spec 02: [./02-catalog-components.md](./02-catalog-components.md) — `id` de `EquipmentCard` para anchor
- Apache mod_rewrite: https://httpd.apache.org/docs/current/mod/mod_rewrite.html
- Apache mod_alias (RedirectMatch): https://httpd.apache.org/docs/current/mod/mod_alias.html
- Plan de deploy: `plans/deploy-to-hostinger.md`
