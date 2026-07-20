# Spec 00 — Definición Funcional

**Fase:** 0
**Estado:** ⬜ Pendiente
**Archivos:** ninguno (spec de decisión; el output es este plan)
**Depende de:** —
**Bloquea a:** specs 01-09

---

## Objetivo

Cerrar el alcance del pivote desde "CTA unitario → WhatsApp" hacia "carrito cotizador multi-equipo → WhatsApp consolidado o email", incorporando los nuevos requisitos de personalización (periodo, cantidad de periodos, fecha de inicio, observaciones, traslado) que el análisis previo no había detallado.

Este spec es la **puerta de entrada** del proyecto: define qué hace el cotizador, qué **no** hace, cómo se ven los mensajes y qué datos mínimos necesita el ejecutivo para responder.

## Por qué importa

Sin una definición funcional cerrada, las specs técnicas divergen:

- ¿Cuántos campos tiene cada item? → afecta `QuoteCartItemCustomization` (spec 01).
- ¿Cuál es el formato del WhatsApp? → afecta `buildWhatsAppUrl` (spec 06).
- ¿Qué pasa si el cliente no quiere email? → afecta UX del formulario (spec 05).
- ¿Se valida RUT? → afecta validación client + server (specs 05, 07).

Este spec documenta el contrato funcional de modo que specs 01-09 lo implementen sin re-decisiones.

## Casos de uso cubiertos (v1)

| ID | Caso | Canal | Notas |
|---|---|---|---|
| UC-01 | Usuario agrega 1 equipo al cotizador desde `/arriendo/izaje/gruas-100-toneladas` | — | Reemplaza el CTA actual |
| UC-02 | Usuario agrega 3 equipos desde 3 páginas distintas | — | Estado compartido vía `localStorage` |
| UC-03 | Usuario personaliza un item (cantidad, periodo, fecha) | — | Spec 04 edición inline |
| UC-04 | Usuario abre el cotizador con 0 items | — | Estado vacío con CTA al catálogo |
| UC-05 | Usuario abre WhatsApp con el mensaje consolidado | WhatsApp | Spec 06 generador |
| UC-06 | Usuario llena el formulario y envía por email | Email | Specs 05 + 07 |
| UC-07 | Usuario excede el cap de 5 items | — | Toast warning; el botón "Agregar" se deshabilita |
| UC-08 | Bot intenta `POST /wp-json/ip/v1/quote-request` | — | Honeypot → 200 silencioso, no email |
| UC-09 | Mismo IP hace 6 requests en 1 hora | — | Rate limit 429 |
| UC-10 | Recarga la página | — | Carrito se restaura desde `localStorage` |
| UC-11 | Abre 2 pestañas del mismo navegador | — | Sincronización vía `storage` event |
| UC-12 | Cambio de navegador/dispositivo | — | Selección **no** migra (fuera de alcance v1) |

## Casos de uso NO cubiertos (fuera de alcance)

| ID | Caso | Razón |
|---|---|---|
| OC-01 | Login para guardar cotizaciones entre devices | Sin auth en v1 |
| OC-02 | Pago o reserva online | No es e-commerce |
| OC-03 | Selección de fecha con calendario visual | `<input type="date">` nativo basta |
| OC-04 | Cálculo automático de tarifa | Ejecutivo cotiza fuera de línea |
| OC-05 | Subida de archivos / planos | WhatsApp/email para esto |
| OC-06 | Confirmación de disponibilidad en tiempo real | Sin inventario en v1 |
| OC-07 | Multi-ejecutivo con asignación por región | 1 solo email destino en v1 |
| OC-08 | i18n EN/ES | Sitio es es-CL |

## Modelo conceptual del item del cotizador

```
┌────────────────────────────────────────────┐
│ QuoteCartItem (1 línea del cotizador)      │
│                                            │
│ Identidad                                  │
│  ├─ equipmentSlug     ← ref a Equipment   │
│  ├─ name              ← snapshot          │
│  ├─ capacity          ← snapshot          │
│  ├─ image             ← snapshot          │
│  ├─ sourceUrl         ← URL de origen     │
│                                            │
│ Personalización                           │
│  ├─ quantity          int >= 1            │
│  ├─ periodType        'diario'|'semanal'| │
│                       'mensual'           │
│  ├─ periodCount       int >= 1            │
│  ├─ startDate         'YYYY-MM-DD'        │
│  ├─ notes             string (≤ 280 ch)   │
│  └─ transport                                 │
│      ├─ required      boolean             │
│      └─ address       string (opcional)   │
│                                            │
│ Timestamps                                 │
│  ├─ addedAt           ISO 8601            │
│  └─ updatedAt         ISO 8601            │
└────────────────────────────────────────────┘
```

## Campos del formulario del solicitante (spec 05)

| Campo | Tipo | Requerido | Validación |
|---|---|:---:|---|
| `name` | text | ✅ | min 3 chars, max 80 |
| `company` | text | ✅ | min 2 chars, max 80 |
| `rut` | text | opcional | regex `^\d{7,8}-[0-9Kk]$` (después de normalizar) |
| `email` | email | ✅ | RFC 5322 + dominio con `.` |
| `phone` | tel | ✅ | 9 dígitos (acepta prefijo `+56` y espacios) |
| `region` | text | ✅ | min 3 chars (libre; sin catálogo en v1) |
| `commune` | text | ✅ | min 3 chars (libre) |
| `workplace` | text | ✅ | min 3 chars (lugar de atención / faena) |
| `contactMethod` | radio | ✅ | `whatsapp` \| `email` \| `phone` |
| `message` | textarea | opcional | max 1000 chars |
| `terms` | checkbox | ✅ | debe ser `true` |
| `honeypot` | text | — | debe estar **vacío**; bots lo llenan |

### Campos globales (no por item)

- `globalNotes` (textarea opcional, max 500 chars) — visible en el paso 2 de `/cotizador` antes de "Continuar".

## Formato del mensaje WhatsApp (canal MVP)

### Plantilla

```text
Hola IP Proyectos Industriales, quisiera cotizar el siguiente arriendo:

- 1 x Grove GMK 4100 (100 t)
  Periodo: mensual x 3 -> inicio 2026-08-15
  Notas: faena en faena Candelaria

- 2 x Plataforma Telescópica 25 m (230 kg)
  Periodo: semanal x 2 -> inicio 2026-08-20
  Notas: -

Traslado: Sí - Ruta 5 km al norte de Caldera

Datos del cliente:
  Nombre: Juan Pérez
  Empresa: Minera Atacama S.A.
  Email: juan.perez@minera-atacama.cl
  Teléfono: +56 9 8765 4321
  Región: Atacama
  Comuna: Caldera
  Lugar de atención: Faena Candelaria, km 12

Notas globales:
  Requerimos disponibilidad para el primer turno del lunes.

Origen: https://ipproyectosindustriales.cl/arriendo/izaje/gruas-100-toneladas
```

### Reglas de formato

- **Separador de item:** guion + espacio (`- `).
- **Indentación de detalles:** 2 espacios bajo el nombre del equipo.
- **Período:** literal `Periodo: {tipo} x {cantidad} -> inicio {YYYY-MM-DD}`.
- **Notas:** literal `Notas: {texto o "-"}`.
- **Traslado:** literal `Traslado: {Sí|No} - {dirección o "-"}`.
- **Datos del cliente:** bloque indentado con `  Campo: Valor`.
- **Notas globales:** solo aparecen si están presentes.
- **Origen:** URL de la última página de catálogo desde donde se agregó el primer item.

### Truncado defensivo

WhatsApp `wa.me/{phone}?text=...` acepta mensajes largos pero degrada la legibilidad después de ~2000 chars. Estrategia:

1. Si el mensaje total ≤ 1500 chars → enviar tal cual.
2. Si > 1500 chars → truncar a los **primeros 4 items** + nota `(se omitieron N items, ver resumen completo en https://ipproyectosindustriales.cl/cotizador)`.
3. Si > 2500 chars → cambiar a CTA "Te recomendamos cotizar por email para no perder detalle" con link a `/cotizador` con los datos pre-llenados.

## Formato del payload REST (canal email, spec 07)

```json
{
  "version": "1",
  "items": [
    {
      "equipmentSlug": "grua-grove-gmk-4100",
      "name": "Grove GMK 4100",
      "capacity": "100 t",
      "quantity": 1,
      "periodType": "mensual",
      "periodCount": 3,
      "startDate": "2026-08-15",
      "notes": "faena Candelaria",
      "transport": {
        "required": true,
        "address": "Ruta 5 km al norte de Caldera"
      }
    }
  ],
  "contact": {
    "name": "Juan Pérez",
    "company": "Minera Atacama S.A.",
    "rut": "76.123.456-7",
    "email": "juan.perez@minera-atacama.cl",
    "phone": "+56987654321",
    "region": "Atacama",
    "commune": "Caldera",
    "workplace": "Faena Candelaria, km 12",
    "contactMethod": "whatsapp",
    "message": "Requerimos disponibilidad para el primer turno del lunes."
  },
  "globalNotes": null,
  "meta": {
    "sourceUrl": "https://ipproyectosindustriales.cl/arriendo/izaje/gruas-100-toneladas",
    "userAgent": "Mozilla/5.0 ...",
    "submittedAt": "2026-07-15T10:30:00Z",
    "utm": {
      "source": "google",
      "medium": "cpc",
      "campaign": "arriendo-gruas-100t"
    }
  },
  "honeypot": ""
}
```

Validación server-side (ver spec 07):
- `items.length` entre 1 y 5.
- `items[].equipmentSlug` debe existir en `RENTAL_CATEGORIES`.
- `contact.*` requerido según tabla.
- `startDate` ≥ hoy (formato `YYYY-MM-DD`).
- `quantity`, `periodCount` ≥ 1.
- `periodType` ∈ `{diario, semanal, mensual}`.
- `honeypot` debe ser string vacío.

## Estrategia antispam

| Capa | Defensa | Costo UX |
|---|---|---|
| 1 | **Honeypot** `name="website"` invisible con CSS | Cero |
| 2 | **Rate limit** 5 requests / hora / IP (transients WP) | Cero |
| 3 | **Validación server-side** completa | Bajo |
| 4 | **CAPTCHA (futuro)** Turnstile o reCAPTCHA v3 | Moderado |

En v1 se activan capas 1-3. La capa 4 queda como **task opcional** si se observa abuso.

## Decisiones tomadas (tabla cerrada)

| # | Pregunta | Decisión | Spec que la implementa |
|---|---|---|---|
| D-01 | ¿Se valida RUT? | Sí, formato `12345678-5`; opcional | 05 + 07 |
| D-02 | ¿Cuántos items máximo? | 5 (constante `QUOTE_CART_MAX_ITEMS`) | 02 |
| D-03 | ¿Qué pasa al exceder 5? | Warning + bloqueo del botón "Agregar" en cards | 03 + 04 |
| D-04 | ¿Se permite re-agregar el mismo equipo? | No, se incrementa `quantity` | 02 |
| D-05 | ¿Se persiste la personalización entre sesiones? | Sí, en `localStorage` | 02 |
| D-06 | ¿Campos globales (fuera de items)? | Solo `globalNotes` | 04 + 05 |
| D-07 | ¿Teléfono requerido? | Sí | 05 |
| D-08 | ¿RUT requerido? | No, opcional | 05 |
| D-09 | ¿Email con copia al cliente? | No en v1; el ejecutivo confirma | 07 |
| D-10 | ¿Guardar leads en WP CPT? | Sí, opcional (default `true` para v1) | 07 |
| D-11 | ¿Cuántos emails destino? | 1 (configurable vía `wp_options`) | 07 |
| D-12 | ¿Notificación al ejecutivo? | Email con plantilla HTML + texto plano | 07 |
| D-13 | ¿Página post-submit email? | `/gracias` con resumen | 04 |
| D-14 | ¿Página post-submit WhatsApp? | El usuario sale del sitio (wa.me) | — |
| D-15 | ¿Deep link a /cotizador con items pre-llenos? | No en v1 (se puede con `?prefill=slug1,slug2` v2) | — |
| D-16 | ¿Sincronización cross-tab? | Sí, vía `storage` event | 02 |
| D-17 | ¿Sincronización cross-device? | No, fuera de alcance | — |
| D-18 | ¿Reordenamiento de items (drag & drop)? | No, orden = orden de agregado | 04 |
| D-19 | ¿Cupón o código de descuento? | No, fuera de alcance | — |
| D-20 | ¿Confirmación visual de "agregado" en la card? | Sí, toast 2.5s | 03 |

## Tareas

- [ ] Validar este spec con el equipo comercial (¿D-08, D-09, D-11 son correctos?).
- [ ] Confirmar el email destino del ejecutivo (default sugerido: `cotizaciones@ipproyectosindustriales.cl`).
- [ ] Confirmar el plazo de respuesta al cliente (afecta copy del toast y página /gracias).
- [ ] Confirmar que `QUOTE_CART_MAX_ITEMS = 5` es razonable (¿debería ser 3 o 8?).
- [ ] Confirmar la lista de períodos aceptados (`diario` / `semanal` / `mensual`).

## Definition of Done

- [ ] Este spec está aprobado por el product owner.
- [ ] Las 20 decisiones (D-01 a D-20) están firmadas.
- [ ] El email destino del ejecutivo está documentado.
- [ ] La plantilla de WhatsApp y la del email están revisadas.
- [ ] El equipo confirma el cap de 5 items.
- [ ] Se han listado los 12 casos de uso cubiertos y los 8 fuera de alcance.

## Próximos pasos

Una vez aprobado este spec, ejecutar en orden:

1. **Spec 01** — Tipos TypeScript (`QuoteCart`, `QuoteCartItem`, `QuoteCartItemCustomization`, `RenterContactData`).
2. **Spec 02** — `src/lib/quoteCart.ts` con add/remove/update/clear + eventos.
3. **Spec 03** — UI de "Agregar al cotizador" en cada card.

Los specs 04-07 dependen de los anteriores y se pueden implementar en paralelo después de 03.

## Referencias

- [README del plan](./README.md) — árbol de specs, convenciones, glosario.
- [Análisis del pivote](../../quote-cart-pivot-analysis.md) — documento de origen.
- Spec 01: [./01-data-model.md](./01-data-model.md) — tipos TypeScript.
- Spec 06: [./06-message-and-payload-builders.md](./06-message-and-payload-builders.md) — generadores de mensaje.
- Spec 07: [./07-backend-wordpress.md](./07-backend-wordpress.md) — endpoint REST.
- `src/data/rental.ts` — fuente de verdad del catálogo (Equipment, RentalSubcategory, RentalCategory).
- `src/components/rental/EquipmentCard.astro` — card a modificar.
