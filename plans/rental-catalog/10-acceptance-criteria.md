# Spec 10 — Criterios de Aceptación y Smoke Test

**Fases:** 14, 15
**Estado:** ✅ Completo
**Archivos:** ninguno (es un spec de validación)
**Aplica a:** todo el catálogo de arriendo

**Depende de:** TODAS las specs anteriores (01-09) + deploy
**Bloquea a:** marca el catálogo como "✅ Completo" en el README

---

## Objetivo

Definir el checklist de **Definition of Done** y el **smoke test** que valida que el catálogo de arriendo esté correctamente implementado y desplegado.

---

## Definition of Done (DoD) global

### Estructura de URLs

- [ ] Las 27 URLs del catálogo responden HTTP 200 OK en producción
- [ ] `/arriendo/` (hub)
- [ ] `/arriendo/izaje/`
- [ ] `/arriendo/izaje/gruas-60-toneladas`
- [ ] `/arriendo/izaje/gruas-80-toneladas`
- [ ] `/arriendo/izaje/gruas-100-toneladas`
- [ ] `/arriendo/izaje/gruas-250-toneladas`
- [ ] `/arriendo/izaje/camiones-pluma`
- [ ] `/arriendo/izaje/alza-hombre`
- [ ] `/arriendo/izaje/gruas-horquilla`
- [ ] `/arriendo/movimiento-de-tierra/`
- [ ] `/arriendo/movimiento-de-tierra/camiones-tolva`
- [ ] `/arriendo/movimiento-de-tierra/retroexcavadoras`
- [ ] `/arriendo/movimiento-de-tierra/minicargadores`
- [ ] `/arriendo/transporte/`
- [ ] `/arriendo/transporte/tracto-camiones`
- [ ] `/arriendo/transporte/cama-baja`
- [ ] `/arriendo/transporte/semiremolques`
- [ ] `/arriendo/equipos-especiales/`
- [ ] `/arriendo/equipos-especiales/torres-iluminacion`
- [ ] `/arriendo/equipos-especiales/bombas-hormigon`
- [ ] `/arriendo/equipos-especiales/compresores-aire`
- [ ] `/arriendo/equipos-especiales/generadores-electricos`
- [ ] `/arriendo/equipos-especiales/termofusionadoras`
- [ ] `/arriendo/equipos-especiales/mezcladoras-electricas-canastillo`

### Migración y redirects

- [ ] `/arriendos` redirige (301) a `/arriendo`
- [ ] `/arriendos/izaje` redirige a `/arriendo/izaje`
- [ ] `/arriendos/movimiento-tierra` redirige a `/arriendo/movimiento-de-tierra` (slug cambia)
- [ ] `/arriendos/transporte` redirige a `/arriendo/transporte`
- [ ] `/arriendos/equipos-especiales` redirige a `/arriendo/equipos-especiales`
- [ ] `/arriendo-maquinaria` redirige a `/arriendo`
- [ ] `/arriendo-maquinaria/gruas-alto-tonelaje/gruas-grove-gmk` redirige a `/arriendo/izaje/gruas-100-toneladas#grua-grove-gmk-4100`
- [x] Los archivos `src/pages/arriendos/*` y `src/pages/arriendo-maquinaria/*` están eliminados
- [ ] El redirect del anchor (#grua-grove-gmk-4100) lleva a la card correcta

### Contenido y SEO

- [ ] Cada URL tiene un `<title>` único, < 60 caracteres
- [ ] Cada URL tiene una `<meta name="description">` única, 150-160 caracteres
- [ ] Cada URL tiene un solo `<h1>`
- [ ] El H1 contiene la keyword principal
- [ ] Cada URL tiene canonical self-referencing
- [ ] Cada URL tiene schema `BreadcrumbList` válido
- [ ] Los hubs de categoría tienen schema `CollectionPage` o `Service`
- [ ] Las sub-rutas tienen schema `Product` + `Offer`
- [ ] El catálogo inyecta schema `ItemList`
- [ ] Las FAQ tienen schema `FAQPage`
- [ ] Cada URL tiene OG tags (title, description, image, url, type)
- [ ] Las imágenes tienen alt text descriptivo
- [ ] No hay contenido duplicado entre páginas

### Componentes y UI

- [ ] `EquipmentCatalog` renderiza correctamente en las 22 sub-rutas
- [ ] `EquipmentCard` muestra: imagen, badge, nombre, altura, descripción, 3 features, CTA WhatsApp
- [ ] El CTA WhatsApp tiene el mensaje pre-armado específico del equipo
- [ ] `SpecsGrid` muestra las specs técnicas en la grilla
- [ ] `RelatedEquipment` muestra 2-4 sub-rutas hermanas (excluyendo la actual)
- [ ] `FAQSection` muestra 3-5 preguntas y se expande/colapsa con `<details>`
- [ ] Todos los componentes son responsivos (mobile, tablet, desktop)
- [ ] El hover de las cards muestra lift + shadow

### Navegación y links internos

- [ ] El menú principal tiene el item "Arriendo" con dropdown de 4 categorías
- [ ] El footer tiene links a las 4 categorías (mínimo) o las 27 URLs (ideal)
- [ ] La home tiene un CTA "Ver catálogo" apuntando a `/arriendo`
- [ ] Cada sub-ruta tiene links a 2-3 sub-rutas hermanas (RelatedEquipment)
- [ ] Cada sub-ruta tiene link a su categoría padre
- [ ] Los breadcrumbs en cada página coinciden con la URL
- [ ] No hay links rotos a URLs internas
- [ ] `grep -rn "arriendos\|arriendo-maquinaria" src/` no devuelve matches (excepto en `plans/`)

### Sitemap y robots

- [ ] `sitemap-index.xml` existe y es accesible
- [ ] `sitemap-0.xml` contiene las 27 URLs de `/arriendo/*`
- [ ] Las URLs legacy NO están en el sitemap
- [ ] `robots.txt` apunta al sitemap

### Build y deploy

- [ ] `npm run build` no genera warnings
- [ ] `npm run build` no genera errores
- [ ] El deploy se completa exitosamente
- [ ] El sitio responde HTTP 200 en `https://ipproyectosindustriales.cl`
- [ ] El sitio carga en menos de 3 segundos (LCP)

---

## Smoke Test (procedimiento)

### Pre-deploy (local)

```powershell
# 1. Build limpio
Remove-Item -LiteralPath "dist" -Recurse -Force -ErrorAction SilentlyContinue
npm run build

# 2. Verificar que el build generó las URLs esperadas
Get-ChildItem -LiteralPath "dist\arriendo" -Recurse -Filter "index.html" | Measure-Object
# Expected: 27 (o más, considerando sub-paths)

# 3. Verificar que el sitemap incluye las URLs
Get-Content dist/sitemap-0.xml | Select-String "/arriendo/"
# Expected: 27 líneas (al menos)

# 4. Verificar que no hay links rotos
# (manual o con algún crawler como wget)
```

### Post-deploy (producción)

```powershell
# 1. Verificar que cada URL responde 200
$urls = @(
  'https://ipproyectosindustriales.cl/arriendo',
  'https://ipproyectosindustriales.cl/arriendo/izaje',
  'https://ipproyectosindustriales.cl/arriendo/izaje/gruas-100-toneladas',
  'https://ipproyectosindustriales.cl/arriendo/movimiento-de-tierra',
  'https://ipproyectosindustriales.cl/arriendo/transporte',
  'https://ipproyectosindustriales.cl/arriendo/equipos-especiales'
  # ... 27 URLs en total
)

foreach ($url in $urls) {
  $code = (Invoke-WebRequest -Uri $url -UseBasicParsing).StatusCode
  if ($code -eq 200) {
    Write-Host "✓ $url" -ForegroundColor Green
  } else {
    Write-Host "✗ $url ($code)" -ForegroundColor Red
  }
}
```

### Verificar redirects

```powershell
$redirects = @(
  @{old='https://ipproyectosindustriales.cl/arriendos'; expected='https://ipproyectosindustriales.cl/arriendo'},
  @{old='https://ipproyectosindustriales.cl/arriendos/izaje'; expected='https://ipproyectosindustriales.cl/arriendo/izaje'},
  @{old='https://ipproyectosindustriales.cl/arriendos/movimiento-tierra'; expected='https://ipproyectosindustriales.cl/arriendo/movimiento-de-tierra'},
  @{old='https://ipproyectosindustriales.cl/arriendo-maquinaria'; expected='https://ipproyectosindustriales.cl/arriendo'},
  @{old='https://ipproyectosindustriales.cl/arriendo-maquinaria/gruas-alto-tonelaje/gruas-grove-gmk'; expected='https://ipproyectosindustriales.cl/arriendo/izaje/gruas-100-toneladas'}
)

foreach ($r in $redirects) {
  $resp = Invoke-WebRequest -Uri $r.old -MaximumRedirection 0 -ErrorAction SilentlyContinue
  $location = $resp.Headers.Location
  if ($location -eq $r.expected) {
    Write-Host "✓ $($r.old) → $location" -ForegroundColor Green
  } else {
    Write-Host "✗ $($r.old) → $location (expected: $($r.expected))" -ForegroundColor Red
  }
}
```

### Verificar schema JSON-LD

```powershell
# Para cada URL del catálogo, verificar que tiene JSON-LD
$url = 'https://ipproyectosindustriales.cl/arriendo/izaje/gruas-100-toneladas'
$html = (Invoke-WebRequest -Uri $url).Content
$jsonLdCount = ([regex]::Matches($html, 'application/ld\+json')).Count
Write-Host "JSON-LD scripts en $url : $jsonLdCount"
# Expected: 2 o 3 (Product + BreadcrumbList + ItemList del EquipmentCatalog)
```

### Validar con herramientas externas

- [ ] Schema.org validator: https://validator.schema.org/ (pegar JSON-LD de una página)
- [ ] Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] Google Search Console: enviar sitemap
- [ ] PageSpeed Insights: https://pagespeed.web.dev/ (verificar Core Web Vitals)
- [ ] Mobile-Friendly Test: https://search.google.com/test/mobile-friendly

### Verificar manualmente en navegador

- [ ] Abrir cada URL en Chrome y Firefox
- [ ] Probar el dropdown del menú "Arriendo"
- [ ] Hacer clic en cada link del footer
- [ ] Probar el CTA WhatsApp con mensaje pre-armado (verificar que llega al número correcto)
- [ ] Probar el FAQ (expandir/colapsar preguntas)
- [ ] Probar hover en las cards del catálogo
- [ ] Verificar que en mobile el menú hamburguesa funciona
- [ ] Verificar que en mobile la grilla colapsa a 1 columna

---

## Validación SEO (post-deploy, esperar 1-2 semanas)

Tras 1-2 semanas del deploy, monitorear en Google Search Console:

- [ ] Las 27 URLs están indexadas
- [ ] Las URLs legacy se han desindexado (o devuelven 404/410)
- [ ] No hay errores de cobertura
- [ ] Las impressions para queries transaccionales ("arriendo grúas 100 toneladas") empiezan a subir
- [ ] El CTR mejora en las URLs nuevas vs. las viejas

Métricas a monitorear:

| Métrica | Herramienta | Target |
|---|---|---|
| URLs indexadas | Google Search Console | 27/27 nuevas, 0/8 legacy |
| Impressions por "arriendo X toneladas" | GSC → Performance | Incremento mes a mes |
| CTR promedio del catálogo | GSC → Performance | > 2% (transaccional) |
| Posición media | GSC → Performance | Top 20 para long-tail |
| Core Web Vitals | PageSpeed Insights | LCP < 2.5s, CLS < 0.1, INP < 200ms |
| Errores 404 | GSC → Cobertura | 0 |

---

## Checklist de cierre

Cuando todos los puntos del DoD estén ✅:

- [ ] Marcar todas las specs como ✅ en el [README.md](./README.md)
- [ ] Crear tag de release en git (ej: `v1.0.0-catalog`)
- [ ] Documentar en `CHANGELOG.md` (si existe) la fecha y resumen de cambios
- [ ] Comunicar al equipo que el catálogo está listo
- [ ] Programar revisión SEO en 30 días

---

## Plan de rollback (si algo sale mal)

Si tras el deploy se detectan problemas críticos:

1. **Revertir el `.htaccess`** (mantener las páginas nuevas, quitar los redirects)
2. **Re-deploy** con la versión anterior del `.htaccess`
3. **Verificar** que las URLs legacy vuelven a funcionar (no eliminadas aún)
4. **Diagnosticar** el problema en local
5. **Fix + re-test + re-deploy**

Los redirects 301 son cacheables por el navegador, así que el rollback puede tardar unos minutos en propagarse. Para forzar:

```bash
# PowerShell
Clear-DnsClientCache
# O forzar al cliente a actualizar
# Ctrl+Shift+R (hard refresh)
```

---

## Referencias

- README: [./README.md](./README.md)
- Todas las specs anteriores (01-09) para entender qué se está validando
- `plans/deploy-to-hostinger.md` — procedimiento de deploy
- Google Search Console: https://search.google.com/search-console
- Schema.org validator: https://validator.schema.org/
- PageSpeed Insights: https://pagespeed.web.dev/
