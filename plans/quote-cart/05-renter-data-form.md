# Spec 05 — Formulario de Datos del Solicitante

**Fase:** 5
**Estado:** ⬜ Pendiente
**Archivos a crear:**
- `src/pages/cotizador/datos.astro`
- `src/components/quote/QuoteRequestForm.astro`

**Depende de:** Specs 01, 02, 04
**Bloquea a:** spec 06 (rama email) + spec 07 (endpoint)

---

## Objetivo

Construir el formulario que el usuario llena después de revisar y personalizar su carrito en `/cotizador`. Es la **puerta de entrada** al canal email: tras validar el formulario, el frontend envía el payload al endpoint REST de WordPress (`POST /wp-json/ip/v1/quote-request`, spec 07), y en caso de éxito redirige a `/gracias`.

Este spec cubre el formulario del **paso 2 (Datos)** del flujo de 3 pasos (Carro → Datos → Confirmación). El paso 1 ya está implementado en `/cotizador` (spec 04). El paso 3 es `/gracias` (existente, se reutiliza).

## Por qué importa

- Es el **único punto** donde se capturan los datos del cliente que el ejecutivo necesita para responder.
- Sin validación client-side, llegan al backend payloads incompletos o con formatos inválidos.
- El honeypot y la normalización de RUT/teléfono son la primera capa de calidad del lead.

## Estructura de la página `/cotizador/datos`

```
┌───────────────────────────────────────────────────┐
│  Header (con QuoteCartBadge)                      │
├───────────────────────────────────────────────────┤
│  Stepper:  1. Carro ← 2. Datos → 3. Confirmación  │
│                                                   │
│  Resumen compacto: 2 equipos · 3 unidades         │
│  [← Volver al cotizador]                          │
│                                                   │
│  ╔═══ FORMULARIO ══════════════════════════════╗   │
│  ║ Sección 1: Datos de contacto                ║   │
│  ║   Nombre y apellido *                        ║   │
│  ║   Empresa *                                  ║   │
│  ║   RUT empresa (opcional)                     ║   │
│  ║   Email *                                    ║   │
│  ║   Teléfono * (placeholder +56 9 1234 5678)  ║   │
│  ║                                              ║   │
│  ║ Sección 2: Ubicación de la faena             ║   │
│  ║   Región *                                   ║   │
│  ║   Comuna *                                   ║   │
│  ║   Lugar de atención / faena *                ║   │
│  ║                                              ║   │
│  ║ Sección 3: Preferencia de contacto           ║   │
│  ║   ( ) WhatsApp  ( ) Correo  ( ) Llamado      ║   │
│  ║                                              ║   │
│  ║ Sección 4: Mensaje adicional (opcional)      ║   │
│  ║   [textarea]                                 ║   │
│  ║                                              ║   │
│  ║ Campo honeypot (oculto, con CSS)             ║   │
│  ║                                              ║   │
│  ║ ☐ Acepto términos y condiciones *            ║   │
│  ║                                              ║   │
│  ║ [Enviar cotización por email]                ║   │
│  ╚══════════════════════════════════════════════╝   │
│                                                   │
├───────────────────────────────────────────────────┤
│  Footer                                           │
└───────────────────────────────────────────────────┘
```

### Estado con carrito vacío

Si el usuario llega a `/cotizador/datos` sin items, se le redirige a `/cotizador` (que a su vez muestra el estado vacío con CTA a `/arriendo`).

## `src/pages/cotizador/datos.astro`

```astro
---
// src/pages/cotizador/datos.astro
// Paso 2 del cotizador: formulario de datos del solicitante.

import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/ui/Container.astro';
import SectionLayout from '@/components/ui/SectionLayout.astro';
import QuoteRequestForm from '@/components/quote/QuoteRequestForm.astro';
import { getSiteUrl } from '@/lib/seo';

const title = 'Tus datos | Cotizador | IP Proyectos Industriales';
const description = 'Cuéntanos sobre tu empresa y la faena para enviar tu cotización.';
const canonical = getSiteUrl('/cotizador/datos');
---

<BaseLayout
  title={title}
  description={description}
  canonical={canonical}
  noindex={true}
  breadcrumbs={[
    { label: 'Empresa', url: '/' },
    { label: 'Cotizador', url: '/cotizador' },
    { label: 'Datos', url: '/cotizador/datos' },
  ]}
>
  <SectionLayout spacing="md" background="light">
    <Container>
      <a href="/cotizador" class="quote-back-link">← Volver al cotizador</a>

      <header class="quote-data__header">
        <p class="quote-data__eyebrow">Paso 2 de 3</p>
        <h1 class="quote-data__title">Tus datos</h1>
        <p class="quote-data__sub">
          Con esta información nuestro equipo te responderá en menos de 48 horas hábiles.
        </p>
      </header>

      <QuoteRequestForm client:load />
    </Container>
  </SectionLayout>
</BaseLayout>

<style>
  .quote-back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 1rem;
    color: var(--color-brand, #1a9c4a);
    text-decoration: none;
    font-weight: 600;
  }
  .quote-back-link:hover {
    text-decoration: underline;
  }

  .quote-data__header {
    margin-bottom: 2rem;
  }

  .quote-data__eyebrow {
    margin: 0 0 0.25rem;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-brand, #1a9c4a);
  }

  .quote-data__title {
    margin: 0 0 0.5rem;
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-weight: 800;
    font-size: clamp(1.8rem, 3.5vw, 2.4rem);
    letter-spacing: -0.02em;
    color: var(--color-ink, #1a1a1a);
  }

  .quote-data__sub {
    margin: 0;
    color: var(--color-ink-700, #374151);
    max-width: 60ch;
  }
</style>

<script>
  // Si el carrito está vacío, redirigir a /cotizador (que muestra estado vacío).
  import { getCart } from '@/lib/quoteCart';
  if (typeof window !== 'undefined' && getCart().items.length === 0) {
    window.location.replace('/cotizador');
  }
</script>
```

## `QuoteRequestForm.astro`

```astro
---
// src/components/quote/QuoteRequestForm.astro
// Formulario de datos del solicitante. Dos modos de submit:
//  1) "Enviar por email" → POST /wp-json/ip/v1/quote-request
//  2) "Enviar por WhatsApp" → wa.me/... con datos del cliente incluidos

import Icon from '@/components/ui/Icon.astro';
---

<form class="qrf" data-quote-request-form novalidate>
  <!-- Honeypot: campo oculto para humanos, visible solo para bots -->
  <div class="qrf__honeypot" aria-hidden="true">
    <label for="qrf-website">Sitio web (no completar)</label>
    <input type="text" id="qrf-website" name="website" tabindex="-1" autocomplete="off" />
  </div>

  <fieldset class="qrf__section">
    <legend class="qrf__legend">Datos de contacto</legend>

    <div class="qrf__field">
      <label for="qrf-name">Nombre y apellido *</label>
      <input type="text" id="qrf-name" name="name" required minlength="3" maxlength="80" autocomplete="name" />
      <span class="qrf__error" data-error-for="name" hidden></span>
    </div>

    <div class="qrf__field">
      <label for="qrf-company">Empresa *</label>
      <input type="text" id="qrf-company" name="company" required minlength="2" maxlength="80" autocomplete="organization" />
      <span class="qrf__error" data-error-for="company" hidden></span>
    </div>

    <div class="qrf__field">
      <label for="qrf-rut">RUT empresa (opcional)</label>
      <input type="text" id="qrf-rut" name="rut" placeholder="76.123.456-7" maxlength="12" />
      <span class="qrf__hint">Formato: 12345678-5 (con o sin puntos)</span>
      <span class="qrf__error" data-error-for="rut" hidden></span>
    </div>

    <div class="qrf__field">
      <label for="qrf-email">Email *</label>
      <input type="email" id="qrf-email" name="email" required maxlength="120" autocomplete="email" inputmode="email" />
      <span class="qrf__error" data-error-for="email" hidden></span>
    </div>

    <div class="qrf__field">
      <label for="qrf-phone">Teléfono *</label>
      <input type="tel" id="qrf-phone" name="phone" required minlength="9" maxlength="20" placeholder="+56 9 1234 5678" autocomplete="tel" inputmode="tel" />
      <span class="qrf__hint">9 dígitos, prefijo +56 opcional</span>
      <span class="qrf__error" data-error-for="phone" hidden></span>
    </div>
  </fieldset>

  <fieldset class="qrf__section">
    <legend class="qrf__legend">Ubicación de la faena</legend>

    <div class="qrf__grid-2">
      <div class="qrf__field">
        <label for="qrf-region">Región *</label>
        <input type="text" id="qrf-region" name="region" required minlength="3" maxlength="40" placeholder="Atacama" />
        <span class="qrf__error" data-error-for="region" hidden></span>
      </div>

      <div class="qrf__field">
        <label for="qrf-commune">Comuna *</label>
        <input type="text" id="qrf-commune" name="commune" required minlength="3" maxlength="40" placeholder="Caldera" />
        <span class="qrf__error" data-error-for="commune" hidden></span>
      </div>
    </div>

    <div class="qrf__field">
      <label for="qrf-workplace">Lugar de atención / faena *</label>
      <input type="text" id="qrf-workplace" name="workplace" required minlength="3" maxlength="120" placeholder="Faena Candelaria, km 12" />
      <span class="qrf__error" data-error-for="workplace" hidden></span>
    </div>
  </fieldset>

  <fieldset class="qrf__section">
    <legend class="qrf__legend">Método de contacto preferido</legend>
    <div class="qrf__radios">
      <label class="qrf__radio">
        <input type="radio" name="contactMethod" value="whatsapp" required />
        <span>WhatsApp</span>
      </label>
      <label class="qrf__radio">
        <input type="radio" name="contactMethod" value="email" />
        <span>Correo</span>
      </label>
      <label class="qrf__radio">
        <input type="radio" name="contactMethod" value="phone" />
        <span>Llamado</span>
      </label>
    </div>
    <span class="qrf__error" data-error-for="contactMethod" hidden></span>
  </fieldset>

  <fieldset class="qrf__section">
    <legend class="qrf__legend">Mensaje adicional (opcional)</legend>
    <div class="qrf__field">
      <textarea id="qrf-message" name="message" rows="3" maxlength="1000" placeholder="Detalles extra, contexto del proyecto, urgencia…"></textarea>
    </div>
  </fieldset>

  <div class="qrf__terms">
    <label class="qrf__checkbox">
      <input type="checkbox" name="terms" required />
      <span>
        Acepto los <a href="/aviso-legal" target="_blank" rel="noopener">términos y condiciones</a>
        y la <a href="/privacidad" target="_blank" rel="noopener">política de privacidad</a>.
      </span>
    </label>
    <span class="qrf__error" data-error-for="terms" hidden></span>
  </div>

  <div class="qrf__actions">
    <button type="submit" name="submitChannel" value="email" class="qrf__submit qrf__submit--primary" data-quote-submit-email>
      <Icon name="email" size={18} />
      Enviar cotización por email
    </button>
    <button type="submit" name="submitChannel" value="whatsapp" class="qrf__submit qrf__submit--whatsapp" data-quote-submit-whatsapp>
      <Icon name="whatsapp" size={18} />
      Enviar por WhatsApp
    </button>
  </div>

  <div class="qrf__status" data-quote-status hidden role="status" aria-live="polite"></div>
</form>

<script>
  import { getCart } from '@/lib/quoteCart';
  import { buildQuoteRequest, buildWhatsAppUrl } from '@/lib/quoteMessage';
  import { trackEvent } from '@/lib/quoteAnalytics';
  import { submitQuote } from '@/lib/quoteSubmit';

  const form = document.querySelector<HTMLFormElement>('[data-quote-request-form]');
  const status = document.querySelector<HTMLElement>('[data-quote-status]');
  if (!form || !status) throw new Error('quote-request-form: missing elements');

  function getField(name: string): HTMLInputElement | null {
    return form.querySelector<HTMLInputElement>(`[name="${name}"]`);
  }

  function showError(name: string, msg: string) {
    const el = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (el) {
      el.textContent = msg;
      el.hidden = false;
    }
    getField(name)?.classList.add('has-error');
  }

  function clearErrors() {
    form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((el) => {
      el.textContent = '';
      el.hidden = true;
    });
    form.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
  }

  function setStatus(kind: 'info' | 'success' | 'error', message: string) {
    status!.dataset.kind = kind;
    status!.textContent = message;
    status!.hidden = false;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();
    status!.hidden = true;

    const submitter = (event.submitter as HTMLButtonElement | null);
    const channel = submitter?.value === 'whatsapp' ? 'whatsapp' : 'email';

    const fd = new FormData(form);
    const cart = getCart();

    // Validación client-side
    const errors: { field: string; message: string }[] = [];
    if (!fd.get('name') || String(fd.get('name')).length < 3) errors.push({ field: 'name', message: 'Ingresa tu nombre completo.' });
    if (!fd.get('company') || String(fd.get('company')).length < 2) errors.push({ field: 'company', message: 'Ingresa el nombre de la empresa.' });
    const rut = String(fd.get('rut') || '').trim();
    if (rut) {
      const normalized = rut.replace(/\./g, '').replace(/-/g, '').slice(0, -1) + '-' + rut.slice(-1);
      if (!/^\d{7,8}-[0-9Kk]$/.test(normalized)) errors.push({ field: 'rut', message: 'Formato RUT: 12345678-5.' });
    }
    if (!fd.get('email') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(fd.get('email')))) errors.push({ field: 'email', message: 'Email inválido.' });
    const phoneDigits = String(fd.get('phone') || '').replace(/\D/g, '');
    if (phoneDigits.length < 9) errors.push({ field: 'phone', message: 'Ingresa un teléfono de 9 dígitos.' });
    if (!fd.get('region') || String(fd.get('region')).length < 3) errors.push({ field: 'region', message: 'Indica la región.' });
    if (!fd.get('commune') || String(fd.get('commune')).length < 3) errors.push({ field: 'commune', message: 'Indica la comuna.' });
    if (!fd.get('workplace') || String(fd.get('workplace')).length < 3) errors.push({ field: 'workplace', message: 'Indica el lugar de atención.' });
    if (!fd.get('contactMethod')) errors.push({ field: 'contactMethod', message: 'Selecciona un método de contacto.' });
    if (!fd.get('terms')) errors.push({ field: 'terms', message: 'Debes aceptar los términos.' });

    if (errors.length) {
      errors.forEach((e) => showError(e.field, e.message));
      setStatus('error', 'Revisa los campos marcados.');
      return;
    }

    const payload = buildQuoteRequest(cart, {
      name: String(fd.get('name')),
      company: String(fd.get('company')),
      rut: rut || undefined,
      email: String(fd.get('email')),
      phone: '+56' + phoneDigits.slice(-9),
      region: String(fd.get('region')),
      commune: String(fd.get('commune')),
      workplace: String(fd.get('workplace')),
      contactMethod: String(fd.get('contactMethod')) as 'whatsapp' | 'email' | 'phone',
      message: (fd.get('message') as string) || undefined,
      terms: true,
    });

    if (channel === 'whatsapp') {
      const url = buildWhatsAppUrl(cart, { withContactData: true, contact: payload.contact });
      trackEvent('quote_submit_whatsapp', { itemCount: cart.items.length, hasContactData: true });
      window.open(url, '_blank', 'noopener,noreferrer');
      // Limpia el carrito y redirige a /gracias
      setTimeout(() => { window.location.href = '/gracias?channel=whatsapp'; }, 400);
      return;
    }

    // Email channel
    setStatus('info', 'Enviando tu cotización…');
    form.querySelectorAll<HTMLButtonElement>('button[type="submit"]').forEach((b) => (b.disabled = true));

    const result = await submitQuote(payload);

    form.querySelectorAll<HTMLButtonElement>('button[type="submit"]').forEach((b) => (b.disabled = false));

    if (result.ok) {
      trackEvent('quote_submit_email', { itemCount: cart.items.length });
      trackEvent('quote_submit_success', { channel: 'email', leadId: result.leadId });
      // Redirige a /gracias
      window.location.href = '/gracias?channel=email';
    } else {
      trackEvent('quote_submit_error', { channel: 'email', code: result.code });
      if (result.fieldErrors) {
        result.fieldErrors.forEach((e) => showError(e.field, e.message));
      }
      setStatus('error', result.message);
    }
  });
</script>

<style>
  .qrf {
    max-width: 720px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .qrf__honeypot {
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  .qrf__section {
    border: 1px solid var(--color-line, rgba(0, 0, 0, 0.08));
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    background-color: var(--color-surface, #fff);
    margin: 0;
  }

  .qrf__legend {
    padding: 0 0.5rem;
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--color-ink, #1a1a1a);
  }

  .qrf__field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-top: 0.85rem;
  }

  .qrf__field label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-ink-700, #374151);
  }

  .qrf__field input,
  .qrf__field textarea {
    padding: 0.6rem 0.8rem;
    border: 1px solid var(--color-line, rgba(0, 0, 0, 0.1));
    border-radius: 8px;
    font-family: var(--font-body, system-ui);
    font-size: 0.95rem;
    background-color: #fff;
  }

  .qrf__field input:focus,
  .qrf__field textarea:focus {
    outline: 2px solid var(--color-brand, #1a9c4a);
    outline-offset: 2px;
  }

  .qrf__field input.has-error,
  .qrf__field textarea.has-error {
    border-color: #b91c1c;
  }

  .qrf__hint {
    font-size: 0.8rem;
    color: var(--color-ink-700, #374151);
    opacity: 0.8;
  }

  .qrf__error {
    font-size: 0.85rem;
    color: #b91c1c;
  }

  .qrf__grid-2 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }

  @media (min-width: 640px) {
    .qrf__grid-2 {
      grid-template-columns: 1fr 1fr;
    }
  }

  .qrf__radios {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .qrf__radio,
  .qrf__checkbox {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .qrf__terms {
    padding: 0 0.5rem;
  }

  .qrf__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .qrf__submit {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.9rem 1.5rem;
    font-family: var(--font-heading, 'Archivo', sans-serif);
    font-weight: 700;
    font-size: 0.95rem;
    border: none;
    border-radius: 999px;
    cursor: pointer;
  }

  .qrf__submit--primary {
    background-color: var(--color-brand, #1a9c4a);
    color: #fff;
  }

  .qrf__submit--whatsapp {
    background-color: transparent;
    color: var(--color-brand, #1a9c4a);
    border: 1.5px solid var(--color-brand, #1a9c4a);
  }

  .qrf__submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .qrf__status {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-weight: 600;
  }

  .qrf__status[data-kind="success"] {
    background-color: rgba(26, 156, 74, 0.1);
    color: var(--color-brand, #1a9c4a);
  }

  .qrf__status[data-kind="error"] {
    background-color: rgba(185, 28, 28, 0.1);
    color: #b91c1c;
  }

  .qrf__status[data-kind="info"] {
    background-color: rgba(59, 130, 246, 0.1);
    color: #1d4ed8;
  }
</style>
```

## `src/lib/quoteSubmit.ts` (nuevo, helper de submit)

```ts
// src/lib/quoteSubmit.ts
// Helper que POSTea al endpoint REST. Centraliza el manejo de errores.

import type { QuoteRequest, QuoteRequestResponse } from '@/types/quote';

const ENDPOINT = import.meta.env.PUBLIC_QUOTE_API_URL
  ?? 'https://ipproyectosindustriales.cl/wp-json/ip/v1/quote-request';

export async function submitQuote(payload: QuoteRequest): Promise<QuoteRequestResponse> {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.status === 429) {
      return { ok: false, code: 'rate_limited', message: 'Has hecho muchas solicitudes. Intenta en una hora.' };
    }
    if (res.status === 400) {
      const body = (await res.json()) as QuoteRequestResponse;
      if (!body.ok) return body;
    }
    if (!res.ok) {
      return { ok: false, code: 'server_error', message: 'No pudimos enviar tu cotización. Intenta nuevamente.' };
    }

    return (await res.json()) as QuoteRequestResponse;
  } catch (err) {
    return { ok: false, code: 'server_error', message: 'Sin conexión con el servidor. Verifica tu internet.' };
  }
}
```

## Validación client-side

| Campo | Regla | Mensaje |
|---|---|---|
| `name` | `length >= 3` | "Ingresa tu nombre completo." |
| `company` | `length >= 2` | "Ingresa el nombre de la empresa." |
| `rut` | `^\d{7,8}-[0-9Kk]$` (después de normalizar) | "Formato RUT: 12345678-5." |
| `email` | regex simple `^[^\s@]+@[^\s@]+\.[^\s@]+$` | "Email inválido." |
| `phone` | 9 dígitos (sin contar `+56`, espacios, etc.) | "Ingresa un teléfono de 9 dígitos." |
| `region`, `commune`, `workplace` | `length >= 3` | "Indica X." |
| `contactMethod` | radio checked | "Selecciona un método de contacto." |
| `terms` | checkbox checked | "Debes aceptar los términos." |
| `honeypot` | empty | (nunca se muestra; el backend lo valida) |

## Honeypot

```html
<div class="qrf__honeypot" aria-hidden="true">
  <label for="qrf-website">Sitio web (no completar)</label>
  <input type="text" id="qrf-website" name="website" tabindex="-1" autocomplete="off" />
</div>
```

CSS que **oculta visualmente** sin usar `display: none` (los bots podrían detectarlo):

```css
.qrf__honeypot {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
```

## Accesibilidad

- `<fieldset>` + `<legend>` para agrupar secciones semánticamente.
- Cada input tiene su `<label for="...">` asociado.
- Los mensajes de error usan `aria-live="polite"` en el bloque `[data-quote-status]`.
- Los inputs inválidos tienen clase `.has-error` y el `aria-invalid="true"` (se debe agregar en `showError`).
- El checkbox de términos tiene `<a target="_blank">` para que el usuario abra los términos en nueva pestaña sin perder el formulario.

## Responsive

| Breakpoint | Layout |
|---|---|
| `< 640px` | 1 columna; fieldsets full-width. |
| `>= 640px` | Grid 2 cols para región/comuna. |

## Tareas

- [ ] Crear `src/components/quote/QuoteRequestForm.astro`.
- [ ] Crear `src/pages/cotizador/datos.astro`.
- [ ] Crear `src/lib/quoteSubmit.ts`.
- [ ] Verificar que la página estática (sin JS) muestra un fallback razonable: los inputs son editables, los botones existen, pero no hacen nada (se documenta en `/cotizador/datos` que requiere JS).
- [ ] Probar:
  1. Sin items: redirige a `/cotizador`.
  2. Con 1 item: muestra el formulario.
  3. Submit con campos vacíos: marca los errores.
  4. Submit con email inválido: marca el error.
  5. Submit con teléfono corto: marca el error.
  6. Submit con RUT mal formateado: marca el error (no es required).
  7. Submit sin check de términos: marca el error.
  8. Submit con todos los datos OK → email: hace POST, muestra status, redirige a `/gracias`.
  9. Submit WhatsApp con todos los datos OK → abre `wa.me/...` con datos del cliente en el mensaje.
- [ ] Validar en mobile y desktop.

## Definition of Done

- [ ] `src/pages/cotizador/datos.astro` existe y compila.
- [ ] `src/components/quote/QuoteRequestForm.astro` existe.
- [ ] `src/lib/quoteSubmit.ts` existe.
- [ ] El formulario valida todos los campos antes de submit.
- [ ] El honeypot está implementado con CSS off-screen.
- [ ] El RUT se normaliza antes de validar.
- [ ] El teléfono se normaliza a `+56XXXXXXXXX` antes de submit.
- [ ] El submit email hace `POST /wp-json/ip/v1/quote-request`.
- [ ] El submit WhatsApp abre `wa.me/...` con el mensaje consolidado (incluye datos del cliente).
- [ ] En éxito: redirige a `/gracias?channel={email|whatsapp}`.
- [ ] En error de red o validación: muestra mensaje sin perder los datos del usuario.
- [ ] WCAG AA: labels, focus visible, contraste, `aria-live` para errores.
- [ ] Responsive: 1 col mobile, 2 col tablet.

## Referencias

- Spec 01: [./01-data-model.md](./01-data-model.md) — `RenterContactData`, `QuoteRequest`, `QuoteRequestResponse`.
- Spec 02: [./02-cart-state-and-storage.md](./02-cart-state-and-storage.md) — `getCart`.
- Spec 04: [./04-cart-page.md](./04-cart-page.md) — paso 1 (Carro), stepper visual.
- Spec 06: [./06-message-and-payload-builders.md](./06-message-and-payload-builders.md) — `buildQuoteRequest`, `buildWhatsAppUrl`.
- Spec 07: [./07-backend-wordpress.md](./07-backend-wordpress.md) — endpoint REST.
- `src/components/ui/SectionLayout.astro` — wrapper de sección.
- `src/pages/gracias.astro` — página de confirmación (reutilizada).
