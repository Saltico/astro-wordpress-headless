# Spec 09 — Criterios de Aceptación y Smoke Test

**Fase:** 9
**Estado:** ⬜ Pendiente
**Archivos:** ninguno (es un spec de validación)
**Aplica a:** todo el pivot de cotizador (`/cotizador*`)
**Depende de:** specs 00-08
**Bloquea a:** marca el pivot como "✅ Completo" en el [README](./README.md)

---

## Objetivo

Definir el checklist de **Definition of Done (DoD)** y el **smoke test** que valida que el cotizador esté correctamente implementado y desplegado, **sin regresionar** el catálogo de arriendo.

---

## Definition of Done (DoD) global

### Estructura de URLs

- [ ] `/cotizador` existe y responde HTTP 200
- [ ] `/cotizador/datos` existe y responde HTTP 200
- [ ] `/cotizador/gracias` (futuro) — NO se crea en v1; se reutiliza `/gracias`
- [ ] Las URLs del catálogo `/arriendo/*` (24 URLs) **siguen respondiendo HTTP 200**
- [ ] El header `/cotizador` está marcado con `noindex` en el HTML
- [ ] El header `/cotizador/datos` está marcado con `noindex` en el HTML

### Sitemap y robots

- [ ] El `sitemap-index.xml` **no** incluye `/cotizador` ni `/cotizador/datos`
- [ ] El `sitemap-index.xml` sigue incluyendo las 24 URLs de `/arriendo/*`
- [ ] `robots.txt` apunta al sitemap y no cambia

### Funcionalidad: Carrito (specs 02-03)

- [ ] Un usuario puede agregar 1 equipo desde `/arriendo/izaje/gruas-100-toneladas`
- [ ] El contador del badge en el header refleja la cantidad (`quantity`)
- [ ] El botón flotante (FAB) mobile aparece cuando hay items y desaparece cuando está vacío
- [ ] El botón "Cotizar este equipo" antiguo ya **no** aparece en ninguna card
- [ ] El nuevo botón "Agregar al cotizador" muestra el feedback correcto:
  - Estado "idle" cuando no está en el carrito
  - Estado "added" cuando ya está
  - Estado "error" si localStorage falla
- [ ] La selección persiste al recargar la página
- [ ] La selección se sincroniza entre pestañas del mismo navegador (vía `storage` event)
- [ ] Intentar agregar un 6° item único muestra un toast "Máximo 5 equipos por cotización"
- [ ] El cap blando y duro están aplicados: badge refleja, FAB se muestra, add button se deshabilita

### Funcionalidad: Edición (spec 04)

- [ ] La página `/cotizador` muestra estado vacío con CTA a `/arriendo` cuando el carrito está vacío
- [ ] Con 1+ items, muestra una lista editable
- [ ] Cada item permite editar: cantidad, tipo de periodo, cantidad de periodos, fecha de inicio, notas, traslado + dirección
- [ ] Las notas globales se persisten
- [ ] El resumen muestra: equipos distintos, unidades totales, mayor inicio, días calendario, meses-equivalentes
- [ ] El botón "Limpiar cotizador" pide confirmación y vacía el carrito
- [ ] El botón "Continuar a mis datos" navega a `/cotizador/datos`
- [ ] El botón "Enviar por WhatsApp ahora" abre `wa.me/56956594144?text=...` con el mensaje consolidado

### Funcionalidad: Formulario (spec 05)

- [ ] La página `/cotizador/datos` redirige a `/cotizador` si el carrito está vacío
- [ ] El formulario muestra todos los campos requeridos y opcionales
- [ ] El honeypot está oculto con CSS off-screen (no `display: none`)
- [ ] El submit con campos vacíos marca los errores sin recargar
- [ ] El RUT se valida con regex `^\d{7,8}-[0-9Kk]$` (con o sin puntos)
- [ ] El teléfono se valida con 9 dígitos (ignora `+56`, espacios, guiones)
- [ ] El email se valida con regex simple
- [ ] El submit email deshabilita los botones mientras `submitQuote` está en vuelo
- [ ] El submit email hace `POST /wp-json/ip/v1/quote-request` y:
  - En éxito: redirige a `/gracias?channel=email`
  - En error: muestra mensaje sin perder los datos del usuario
- [ ] El submit WhatsApp abre `wa.me/56956594144?text=...` con el mensaje que incluye los datos del cliente

### Mensaje WhatsApp (spec 06)

- [ ] El formato del mensaje es el documentado en spec 00:
  - Header: "Hola IP Proyectos Industriales, quisiera cotizar el siguiente arriendo:"
  - Items: `- N x {name} ({capacity})` + periodo + notas + traslado
  - Datos del cliente: bloque indentado
  - Pie: "Origen: {sourceUrl}"
- [ ] El mensaje **no** contiene `<script>` ni HTML inyectable
- [ ] El mensaje trunca a 4 items si excede 1500 chars
- [ ] El mensaje marca `exceedsRecommended` si excede 2000 chars
- [ ] El RUT se sanitiza a `12345678-5` (sin puntos)
- [ ] El teléfono se sanitiza a `+569XXXXXXXX`

### Payload REST (spec 06-07)

- [ ] El payload enviado a `/wp-json/ip/v1/quote-request` tiene el shape `QuoteRequest` de spec 01
- [ ] El payload incluye `meta.utm` si la URL tiene `?utm_*=...`
- [ ] El honeypot viaja como string vacío
- [ ] El endpoint responde `{ ok: true, leadId, message }` en éxito
- [ ] El endpoint responde `{ ok: false, code, message, fieldErrors? }` en error

### Backend WordPress (spec 07)

- [ ] El plugin `ip-quote-api` está instalado y activado en el WP de producción
- [ ] El CPT `quote_request` aparece en `wp-admin → Cotizaciones`
- [ ] El email llega a `cotizaciones@ipproyectosindustriales.cl`
- [ ] El email contiene: cliente, equipos con personalización, notas globales, origen
- [ ] El endpoint rechaza payloads con `items.length > 5`
- [ ] El endpoint rechaza payloads con `startDate` pasada
- [ ] El endpoint rechaza payloads con `equipmentSlug` desconocido
- [ ] El endpoint rechaza payloads con `email` mal formato
- [ ] El endpoint rechaza honeypots con 200 silencioso (bot)
- [ ] El endpoint aplica rate limit de 5/hora/IP
- [ ] No se exponen credenciales SMTP en el frontend
- [ ] CORS permite solo `https://ipproyectosindustriales.cl`

### Analítica (spec 08)

- [ ] El sitio carga `gtag.js` correctamente
- [ ] Los 7 eventos se disparan en los call-sites correctos:
  - `quote_add_item` en `QuoteAddButton` exitoso
  - `quote_remove_item` en `cotizador.astro`
  - `quote_update_item` en cada cambio de customization
  - `quote_open_cart` al cargar `/cotizador`
  - `quote_submit_whatsapp` en los 2 call-sites (cotizador + form)
  - `quote_submit_email` en el form
  - `quote_submit_success` en respuesta `ok: true` del endpoint
  - `quote_submit_error` en respuesta con `code` no exitoso
- [ ] `trackEvent` es no-op si `gtag` no está disponible
- [ ] El consentimiento de cookies se respeta
- [ ] UTM parameters se propagan al payload
- [ ] En GA4 DebugView se ven los eventos

### SEO

- [ ] `/cotizador` y `/cotizador/datos` retornan `<meta name="robots" content="noindex">`
- [ ] El sitemap no incluye estas URLs
- [ ] Las 24 URLs de `/arriendo/*` siguen indexables
- [ ] No hay canibalización: el header canónico de cada `/arriendo/*` sigue apuntando a sí mismo
- [ ] El archivo `robots.txt` no cambia

### Build y deploy

- [ ] `npm run build` no genera warnings
- [ ] `npm run build` no genera errores
- [ ] El deploy se completa exitosamente (`npm run deploy`)
- [ ] El sitio responde HTTP 200 en `https://ipproyectosindustriales.cl`
- [ ] El sitio carga en menos de 3 segundos (LCP) en `/cotizador`
- [ ] El bundle JS adicional (3 scripts del cotizador) es < 8 KB en total (sin gzip)

### Accesibilidad

- [ ] WCAG AA: contraste de colores en estados idle / added / error
- [ ] WCAG AA: focus visible en todos los botones e inputs
- [ ] Labels asociados a cada input
- [ ] `aria-live="polite"` en los mensajes de estado (toast, summary, errors)
- [ ] Tab order lógico en `/cotizador` y `/cotizador/datos`
- [ ] Screen reader anuncia: "Cotizador con N equipos" al hacer focus en el badge

### Responsive

- [ ] Mobile (320px, 375px, 414px): 1 columna, FAB visible
- [ ] Tablet (768px, 1024px): 2 columnas en grid
- [ ] Desktop (1280px, 1440px): 4 columnas en grid del cart
- [ ] Sin overflow horizontal en ningún breakpoint
- [ ] Inputs numéricos abren teclado numérico en mobile (`inputmode="numeric"`)

### Seguridad

- [ ] No se exponen credenciales SMTP ni tokens en el bundle JS
- [ ] El honeypot bloquea el 100% de los bots que llenan el campo
- [ ] El rate limit bloquea 6° request en 1 hora
- [ ] El endpoint valida todos los campos server-side (no confía en el cliente)
- [ ] El email al ejecutivo usa `wp_mail` (no SMTP creds)
- [ ] El CPT `quote_request` se guarda con `post_status: 'private'`

---

## Smoke Test (procedimiento)

### Pre-deploy (local)

```powershell
# 1. Build limpio
Remove-Item -LiteralPath "dist" -Recurse -Force -ErrorAction SilentlyContinue
npm run build

# 2. Verificar que el build generó las URLs esperadas del cotizador
Get-ChildItem -LiteralPath "dist\cotizador" -Recurse -Filter "index.html" | Measure-Object
# Expected: 2 (cotizador y cotizador/datos)

# 3. Verificar que el sitemap no incluye /cotizador
Get-Content dist/sitemap-0.xml | Select-String "/cotizador"
# Expected: 0 matches

# 4. Verificar que el sitemap sigue incluyendo las 24 URLs de /arriendo
Get-Content dist/sitemap-0.xml | Select-String "/arriendo/" | Measure-Object
# Expected: ≥ 24

# 5. Verificar noindex en /cotizador
Get-Content dist\cotizador\index.html | Select-String "noindex"
# Expected: 1 match
```

### Verificación manual del flujo completo (local)

```powershell
# Iniciar dev server
npm run dev -- --host 127.0.0.1 --port 4321
```

Pasos manuales:

1. Abrir `http://127.0.0.1:4321/arriendo/izaje/gruas-100-toneladas` en Chrome.
2. Verificar que **cada card** muestra "Agregar al cotizador" (no "Cotizar este equipo").
3. Click en "Agregar al cotizador" del primer equipo.
   - El botón cambia a "Ya en el cotizador".
   - El badge del header muestra "1".
4. Recargar la página.
   - El badge sigue mostrando "1".
   - El botón del primer equipo sigue mostrando "Ya en el cotizador".
5. Navegar a `/arriendo/izaje/gruas-250-toneladas` y agregar el segundo equipo.
   - El badge muestra "2".
6. Abrir en otra pestaña `http://127.0.0.1:4321/arriendo/movimiento-de-tierra/camiones-tolva`.
   - Esperar 1 segundo (sincronización cross-tab).
   - El badge de la segunda pestaña también muestra "2".
7. Ir a `/cotizador`.
   - Verificar que muestra los 2 items con todos los campos editables.
   - Editar la cantidad del primer item a 3.
   - Cambiar el `periodType` del segundo item a "Mensual".
   - Verificar que el resumen actualiza: "2 equipos distintos, 4 unidades totales, …".
8. Click en "Limpiar cotizador".
   - Confirmar el `confirm()`.
   - El carrito queda vacío.
   - El badge muestra "0" (oculto).
   - La UI muestra el estado vacío.
9. Repetir 1-7 con 5 items (visitar 5 sub-rutas distintas).
10. Intentar agregar un 6° item.
    - Verificar que aparece el toast "Máximo 5 equipos por cotización".
    - Verificar que el item **no** se agrega.
11. Click en "Continuar a mis datos" → ir a `/cotizador/datos`.
12. Llenar el formulario con datos válidos.
    - Submit WhatsApp: abrir la nueva pestaña, verificar que el mensaje incluye los items + datos del cliente.
    - Submit email: verificar que el endpoint recibe el POST y retorna `{ ok: true, leadId: N, ... }`. Redirige a `/gracias?channel=email`.
13. En `wp-admin → Cotizaciones`, verificar que el lead aparece con todos los datos.

### Post-deploy (producción)

```powershell
# 1. Verificar que /cotizador responde 200
$urls = @(
  'https://ipproyectosindustriales.cl/cotizador',
  'https://ipproyectosindustriales.cl/cotizador/datos',
  'https://ipproyectosindustriales.cl/arriendo',
  'https://ipproyectosindustriales.cl/arriendo/izaje/gruas-100-toneladas',
  'https://ipproyectosindustriales.cl/wp-json/ip/v1/quote-request'
)

foreach ($url in $urls) {
  try {
    $code = (Invoke-WebRequest -Uri $url -UseBasicParsing -Method 'GET' -MaximumRedirection 0 -ErrorAction Stop).StatusCode
    if ($code -ge 200 -and $code -lt 400) {
      Write-Host "✓ $url ($code)" -ForegroundColor Green
    } else {
      Write-Host "✗ $url ($code)" -ForegroundColor Red
    }
  } catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host "? $url ($code)" -ForegroundColor Yellow
  }
}
```

### Verificar endpoint REST con curl

```powershell
# Test payload válido
$payload = @{
  version = "1"
  items = @(
    @{
      equipmentSlug = "grua-grove-gmk-4100"
      name = "Grove GMK 4100"
      capacity = "100 t"
      image = ""
      sourceUrl = "https://ipproyectosindustriales.cl/arriendo/izaje/gruas-100-toneladas"
      customization = @{
        quantity = 1
        periodType = "mensual"
        periodCount = 3
        startDate = "2026-12-01"
        notes = "test"
        transport = @{ required = $false }
      }
      addedAt = (Get-Date -Format "o")
      updatedAt = (Get-Date -Format "o")
    }
  )
  contact = @{
    name = "Test User"
    company = "Test Co"
    email = "test@example.com"
    phone = "+56912345678"
    region = "Metropolitana"
    commune = "Santiago"
    workplace = "Oficina central"
    contactMethod = "email"
    terms = $true
  }
  globalNotes = ""
  meta = @{
    sourceUrl = "https://ipproyectosindustriales.cl/cotizador/datos"
    userAgent = "PowerShell smoke test"
    submittedAt = (Get-Date -Format "o")
  }
  honeypot = ""
} | ConvertTo-Json -Depth 10

$response = Invoke-WebRequest -Uri "https://ipproyectosindustriales.cl/wp-json/ip/v1/quote-request" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{ "Origin" = "https://ipproyectosindustriales.cl" } `
  -Body $payload `
  -UseBasicParsing

$response.Content | ConvertFrom-Json
# Expected: ok = true, leadId = N, message = "..."

# Test honeypot
$payload.honeypot = "spam-bot"
$response2 = Invoke-WebRequest -Uri "https://ipproyectosindustriales.cl/wp-json/ip/v1/quote-request" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{ "Origin" = "https://ipproyectosindustriales.cl" } `
  -Body ($payload | ConvertTo-Json -Depth 10) `
  -UseBasicParsing
# Expected: 200 + ok=true (silent success)
```

### Verificar sitemap

```powershell
# Descargar sitemap
$sitemap = (Invoke-WebRequest -Uri "https://ipproyectosindustriales.cl/sitemap-0.xml" -UseBasicParsing).Content
$sitemap | Select-String "/cotizador"
# Expected: 0 matches
$sitemap | Select-String "/arriendo/" | Measure-Object
# Expected: ≥ 24
```

### Verificar noindex

```powershell
$html = (Invoke-WebRequest -Uri "https://ipproyectosindustriales.cl/cotizador" -UseBasicParsing).Content
$html | Select-String 'name="robots"'
# Expected: 1 match con content="noindex"
```

### Verificar GA4 (manual)

1. Abrir `https://ipproyectosindustriales.cl/cotizador` en Chrome.
2. Abrir DevTools → Console.
3. Ejecutar un flujo completo (agregar, abrir cart, submit email).
4. Verificar en Network → `collect?...` que se ven los eventos:
   - `quote_add_item`
   - `quote_open_cart`
   - `quote_submit_email`
   - `quote_submit_success`
5. Verificar en `https://analytics.google.com/.../debugview` que aparecen en tiempo real.

### Pruebas específicas de WhatsApp

```powershell
# Construir el mensaje manualmente para validar
$cart = @{
  version = 1
  updatedAt = (Get-Date -Format "o")
  items = @(
    @{
      equipmentSlug = "grua-grove-gmk-4100"
      name = "Grove GMK 4100"
      capacity = "100 t"
      customization = @{
        quantity = 1
        periodType = "mensual"
        periodCount = 3
        startDate = "2026-08-15"
        notes = "faena Candelaria"
        transport = @{ required = $true; address = "Ruta 5 km al norte de Caldera" }
      }
    }
  )
}
# (Ejecutar buildWhatsAppUrl en consola de Node para verificar formato)
```

### Pruebas de responsive

| Breakpoint | Ancho | Verificar |
|---|---|---|
| Mobile S | 320px | Sin overflow, FAB visible, 1 col |
| Mobile M | 375px | Idem |
| Mobile L | 414px | Idem |
| Tablet | 768px | FAB oculto, badge visible, 2 cols en grid |
| Laptop | 1024px | 3 cols en grid |
| Desktop | 1440px | 4 cols en grid, centrado |

---

## Validación SEO (post-deploy, esperar 1-2 semanas)

Tras 1-2 semanas del deploy, monitorear en Google Search Console:

- [ ] `/cotizador` y `/cotizador/datos` **no** aparecen en SERPs
- [ ] Las 24 URLs de `/arriendo/*` siguen indexadas y rankeando
- [ ] El CTR del catálogo no cae (sin regresión)
- [ ] El tráfico orgánico al catálogo no cae (sin canibalización)

Métricas a monitorear en GA4:

| Métrica | Target |
|---|---|
| Eventos `quote_add_item` / mes | ≥ 50 |
| `quote_open_cart` / `quote_add_item` ratio | 30-50% (interesados que revisan) |
| `quote_submit_*` / `quote_open_cart` ratio | 20-40% (los que envían) |
| `quote_submit_success` / `quote_submit_email` | ≥ 90% (tasa de éxito del endpoint) |
| `quote_submit_error` con `code: 'rate_limited'` | bajo (sin spam) |
| `quote_submit_error` con `code: 'validation_error'` | bajo (UX del form claro) |

---

## Checklist de cierre

Cuando todos los puntos del DoD estén ✅:

- [ ] Marcar todas las specs como ✅ en el [README.md](./README.md)
- [ ] Crear tag de release en git (ej: `v1.0.0-quote-cart`)
- [ ] Documentar en CHANGELOG (si existe) la fecha y resumen de cambios
- [ ] Comunicar al equipo comercial que el cotizador está listo
- [ ] Programar revisión de métricas en 30 días
- [ ] (Opcional) Programar un A/B test del botón "Cotizar este equipo" vs "Agregar al cotizador" para validar que la conversión mejora

---

## Plan de rollback (si algo sale mal)

Si tras el deploy se detectan problemas críticos:

### Rollback de UI (cambio de botón en `EquipmentCard`)

1. **Revertir `src/components/rental/EquipmentCard.astro`** al commit anterior (botón "Cotizar este equipo").
2. Re-deploy.
3. Verificar que el catálogo vuelve a la versión anterior.

### Rollback del backend (plugin WP)

1. **Desactivar** el plugin `ip-quote-api` en `wp-admin → Plugins`.
2. El endpoint `/wp-json/ip/v1/quote-request` retornará 404; el frontend debe mostrar error.
3. (Opcional) Restaurar la versión anterior del plugin desde un backup de `wp-content/plugins/`.

### Rollback de SEO

Si `/cotizador` queda indexado por error:

1. Verificar el filtro del sitemap en `astro.config.mjs`.
2. Re-deploy.
3. En GSC, enviar solicitud de desindexación.

### Rollback de analytics

1. Quitar los `trackEvent(...)` de cada componente.
2. Re-deploy.
3. El sitio sigue funcionando (trackEvent es no-op si gtag no está).

---

## Referencias

- README del plan: [./README.md](./README.md)
- Spec 00: [./00-functional-definition.md](./00-functional-definition.md) — decisiones D-01..D-20.
- Spec 01: [./01-data-model.md](./01-data-model.md) — tipos.
- Spec 02: [./02-cart-state-and-storage.md](./02-cart-state-and-storage.md) — `quoteCart.ts`.
- Spec 03: [./03-add-to-cart-ui.md](./03-add-to-cart-ui.md) — UI de "Agregar".
- Spec 04: [./04-cart-page.md](./04-cart-page.md) — `/cotizador`.
- Spec 05: [./05-renter-data-form.md](./05-renter-data-form.md) — formulario.
- Spec 06: [./06-message-and-payload-builders.md](./06-message-and-payload-builders.md) — generadores.
- Spec 07: [./07-backend-wordpress.md](./07-backend-wordpress.md) — plugin WP.
- Spec 08: [./08-seo-analytics.md](./08-seo-analytics.md) — SEO + GA4.
- Plan vecino: [../rental-catalog/10-acceptance-criteria.md](../rental-catalog/10-acceptance-criteria.md) — DoD del catálogo.
- Google Search Console: https://search.google.com/search-console
- GA4 DebugView: https://support.google.com/analytics/answer/7201382
- PageSpeed Insights: https://pagespeed.web.dev/
- Web Vitals: https://web.dev/vitals/
