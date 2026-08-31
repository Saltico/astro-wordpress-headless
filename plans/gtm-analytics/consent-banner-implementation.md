---
title: Implementación de Banner de Cookies Propio (Bottom Bar)
feature: consent-banner
effort: Medium
dependencies: [gtm-core, consent-management]
status: Completed
last_updated: 2026-08-25
---

# Plan de Implementación — Banner de Cookies Propio (Bottom Bar No Intrusivo)

## Objetivo

Implementar un banner de cookies **no bloqueante** (bottom bar) que:
- Cumpla con Consent Mode v2 de Google
- Respete la Ley 19.628 y futura Ley 21.719 (Chile)
- No afecte la tasa de conversión del cotizador
- Sea accesible (WCAG 2.1 AA)
- Permita al usuario elegir por categorías (Analíticas, Marketing)

## Estado actual

| Componente | Estado |
|------------|--------|
| Consent Mode v2 default (denied) | ✅ Implementado en `BaseLayout.astro:144-158` |
| Banner de cookies | ✅ Implementado en `src/components/ui/CookieBanner.astro` |
| Página `/cookies` | ✅ Contenido legal completo en `src/pages/cookies.astro` |
| Lógica `applyConsent()` | ✅ Implementada con Consent Mode v2 update |
| Persistencia de preferencias | ✅ Cookie `ip_consent` (12 meses) + localStorage backup |

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│  BaseLayout.astro                                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 1. Consent Mode default (denied)                  │  │
│  │ 2. GTM container                                  │  │
│  │ 3. CookieBanner (si no hay preferencia guardada)  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  CookieBanner.astro (componente client-side)            │
│  ┌───────────────────────────────────────────────────┐  │
│  │ UI: Bottom bar con 3 botones                      │  │
│  │   - Aceptar todo                                  │  │
│  │   - Solo necesarias                               │  │
│  │   - Configurar → abre panel de preferencias       │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                              │
│                          ▼                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │ applyConsent(analytics, marketing)                │  │
│  │   - window.gtag('consent', 'update', {...})       │  │
│  │   - Guardar en cookie propia (12 meses)           │  │
│  │   - Guardar en localStorage (backup)              │  │
│  │   - Ocultar banner                                │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Especificación técnica

### 1. Componente `CookieBanner.astro`

**Ubicación:** `src/components/ui/CookieBanner.astro`

**Estructura:**

```astro
---
// src/components/ui/CookieBanner.astro
// Banner de cookies no intrusivo (bottom bar) con panel de preferencias.
// Se muestra solo si no hay preferencia guardada.
---

<div class="cookie-banner" data-cookie-banner hidden>
  <div class="cookie-banner__content">
    <p class="cookie-banner__text">
      Usamos cookies para mejorar tu experiencia y analizar el tráfico. 
      Puedes aceptar todas, rechazar las no esenciales o configurar tus preferencias.
      <a href="/cookies" class="cookie-banner__link">Más información</a>
    </p>
    <div class="cookie-banner__actions">
      <button type="button" class="cookie-banner__btn cookie-banner__btn--secondary" data-consent="necessary">
        Solo necesarias
      </button>
      <button type="button" class="cookie-banner__btn cookie-banner__btn--primary" data-consent="all">
        Aceptar todo
      </button>
      <button type="button" class="cookie-banner__btn cookie-banner__btn--ghost" data-consent="configure">
        Configurar
      </button>
    </div>
  </div>

  <!-- Panel de preferencias (oculto por defecto) -->
  <div class="cookie-preferences" data-cookie-preferences hidden>
    <h3 class="cookie-preferences__title">Configuración de cookies</h3>
    <div class="cookie-preferences__categories">
      <label class="cookie-preferences__category">
        <input type="checkbox" checked disabled />
        <span class="cookie-preferences__label">Necesarias</span>
        <span class="cookie-preferences__desc">Esenciales para el funcionamiento del sitio.</span>
      </label>
      <label class="cookie-preferences__category">
        <input type="checkbox" data-category="analytics" />
        <span class="cookie-preferences__label">Analíticas</span>
        <span class="cookie-preferences__desc">Nos ayudan a entender cómo usas el sitio (GA4).</span>
      </label>
      <label class="cookie-preferences__category">
        <input type="checkbox" data-category="marketing" />
        <span class="cookie-preferences__label">Marketing</span>
        <span class="cookie-preferences__desc">Permiten mostrarte anuncios personalizados (Google Ads).</span>
      </label>
    </div>
    <div class="cookie-preferences__actions">
      <button type="button" class="cookie-banner__btn cookie-banner__btn--primary" data-save-preferences>
        Guardar preferencias
      </button>
    </div>
  </div>
</div>

<script>
  // Lógica client-side: mostrar banner, manejar clicks, aplicar consentimiento
</script>

<style>
  /* Estilos del banner (bottom bar no intrusivo) */
</style>
```

### 2. Lógica client-side (`applyConsent`)

```typescript
// Dentro del <script> de CookieBanner.astro

const COOKIE_NAME = 'ip_consent';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 12 meses en segundos

interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

/** Aplica las preferencias de consentimiento y las persiste. */
function applyConsent(analytics: boolean, marketing: boolean): void {
  // 1. Actualizar Consent Mode v2
  window.gtag?.('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: marketing ? 'granted' : 'denied',
    ad_user_data: marketing ? 'granted' : 'denied',
    ad_personalization: marketing ? 'granted' : 'denied',
  });

  // 2. Push evento de auditoría al dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'consent_update',
    analytics,
    marketing,
  });

  // 3. Persistir en cookie propia
  const prefs: ConsentPreferences = { analytics, marketing, timestamp: Date.now() };
  setCookie(COOKIE_NAME, JSON.stringify(prefs), COOKIE_MAX_AGE);

  // 4. Backup en localStorage
  try {
    localStorage.setItem(COOKIE_NAME, JSON.stringify(prefs));
  } catch {
    // Ignorar errores de storage
  }

  // 5. Ocultar banner
  hideBanner();
}

/** Lee las preferencias guardadas (cookie > localStorage). */
function readConsent(): ConsentPreferences | null {
  // Intentar cookie primero
  const cookie = getCookie(COOKIE_NAME);
  if (cookie) {
    try {
      return JSON.parse(cookie);
    } catch {
      // Corrupta, ignorar
    }
  }
  // Fallback a localStorage
  try {
    const ls = localStorage.getItem(COOKIE_NAME);
    if (ls) return JSON.parse(ls);
  } catch {
    // Ignorar
  }
  return null;
}

/** Muestra el banner si no hay preferencia guardada. */
function initBanner(): void {
  const prefs = readConsent();
  if (!prefs) {
    showBanner();
  } else {
    // Aplicar preferencias existentes (por si el usuario recarga)
    applyConsent(prefs.analytics, prefs.marketing);
  }
}

// Helpers de cookies
function setCookie(name: string, value: string, maxAge: number): void {
  document.cookie = `${name}=${encodeURIComponent(value)};max-age=${maxAge};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  initBanner();

  // Botones del banner
  document.querySelector('[data-consent="all"]')?.addEventListener('click', () => {
    applyConsent(true, true);
  });

  document.querySelector('[data-consent="necessary"]')?.addEventListener('click', () => {
    applyConsent(false, false);
  });

  document.querySelector('[data-consent="configure"]')?.addEventListener('click', () => {
    togglePreferencesPanel();
  });

  document.querySelector('[data-save-preferences]')?.addEventListener('click', () => {
    const analytics = (document.querySelector('[data-category="analytics"]') as HTMLInputElement)?.checked ?? false;
    const marketing = (document.querySelector('[data-category="marketing"]') as HTMLInputElement)?.checked ?? false;
    applyConsent(analytics, marketing);
  });
});
```

### 3. Estilos del banner (CSS)

```css
/* Bottom bar no intrusivo */
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: var(--theme-bg-elevated);
  border-top: 1px solid var(--theme-border);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  padding: var(--space-4) var(--space-5);
  animation: cookie-banner-slide-up 0.3s var(--ease-out);
}

.cookie-banner[hidden] {
  display: none;
}

.cookie-banner__content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

@media (min-width: 768px) {
  .cookie-banner__content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.cookie-banner__text {
  margin: 0;
  font-size: var(--text-small);
  color: var(--theme-text);
  line-height: 1.5;
  flex: 1;
}

.cookie-banner__link {
  color: var(--color-brand);
  text-decoration: underline;
}

.cookie-banner__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.cookie-banner__btn {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-small);
  font-weight: 600;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.15s var(--ease-out), border-color 0.15s var(--ease-out);
}

.cookie-banner__btn--primary {
  background-color: var(--color-brand);
  color: var(--color-on-brand);
}

.cookie-banner__btn--primary:hover {
  background-color: var(--color-brand-600);
}

.cookie-banner__btn--secondary {
  background-color: transparent;
  color: var(--theme-text);
  border-color: var(--theme-border);
}

.cookie-banner__btn--secondary:hover {
  background-color: var(--theme-bg-alt);
}

.cookie-banner__btn--ghost {
  background-color: transparent;
  color: var(--theme-text-muted);
}

.cookie-banner__btn--ghost:hover {
  color: var(--theme-text);
}

/* Panel de preferencias */
.cookie-preferences {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--theme-border);
}

.cookie-preferences[hidden] {
  display: none;
}

.cookie-preferences__title {
  margin: 0 0 var(--space-3);
  font-size: var(--text-body);
  font-weight: 700;
}

.cookie-preferences__categories {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.cookie-preferences__category {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  cursor: pointer;
}

.cookie-preferences__category input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.cookie-preferences__label {
  font-weight: 600;
  font-size: var(--text-small);
}

.cookie-preferences__desc {
  font-size: var(--text-small);
  color: var(--theme-text-muted);
}

@keyframes cookie-banner-slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

### 4. Integración en `BaseLayout.astro`

Agregar al final del `<body>`, antes del cierre:

```astro
    <QuoteCartFloatingButton />

    <CookieBanner />

    <script>
      // Inicializar analytics: escucha eventos del DOM y los envía al dataLayer de GTM
      initAnalytics();
    </script>
  </body>
```

### 5. Página `/cookies` real

Reemplazar el placeholder con contenido legal básico:

```astro
---
// src/pages/cookies.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/ui/Container.astro';
import SectionLayout from '@/components/ui/SectionLayout.astro';

const title = 'Política de Cookies | IP Proyectos Industriales';
const description = 'Información sobre el uso de cookies en ipproyectosindustriales.cl';

const breadcrumbs = [
  { label: 'Inicio', url: '/' },
  { label: 'Cookies' },
];
---

<BaseLayout title={title} description={description} breadcrumbs={breadcrumbs} noindex>
  <SectionLayout spacing="lg">
    <Container>
      <h1>Política de Cookies</h1>
      
      <p>
        En IP Proyectos Industriales utilizamos cookies para mejorar tu experiencia de navegación,
        analizar el tráfico web y personalizar contenidos. Esta política explica qué cookies usamos,
        para qué finalidad y cómo puedes configurarlas.
      </p>

      <h2>¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo
        (computador, tablet o móvil) cuando los visitas. Permiten que el sitio recuerde información
        sobre tu visita, como tu idioma preferido u otras configuraciones.
      </p>

      <h2>¿Qué tipos de cookies utilizamos?</h2>
      
      <h3>1. Cookies necesarias (esenciales)</h3>
      <p>
        Son imprescindibles para el funcionamiento del sitio. Permiten navegar por las páginas,
        usar formularios y acceder a áreas seguras. Sin estas cookies, el sitio no funcionaría
        correctamente. <strong>Siempre están activas y no se pueden desactivar.</strong>
      </p>
      <ul>
        <li><strong>Sesión:</strong> Mantienen tu sesión activa mientras navegas.</li>
        <li><strong>Seguridad:</strong> Protegen contra ataques CSRF y otros riesgos.</li>
      </ul>

      <h3>2. Cookies analíticas</h3>
      <p>
        Nos ayudan a entender cómo los visitantes interactúan con el sitio, recopilando información
        de forma anónima. Esto nos permite mejorar el rendimiento y la experiencia de usuario.
      </p>
      <ul>
        <li><strong>Google Analytics (GA4):</strong> Mide el tráfico web y el comportamiento de los usuarios.
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Política de privacidad de Google</a>.</li>
      </ul>

      <h3>3. Cookies de marketing</h3>
      <p>
        Se utilizan para mostrar anuncios relevantes según tus intereses. También permiten
        limitar el número de veces que ves un anuncio y medir la efectividad de las campañas
        publicitarias.
      </p>
      <ul>
        <li><strong>Google Ads:</strong> Permite mostrar anuncios personalizados y medir conversiones.
        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Política de anuncios de Google</a>.</li>
      </ul>

      <h2>¿Cómo puedo configurar o desactivar las cookies?</h2>
      <p>
        Puedes configurar tus preferencias en cualquier momento mediante el banner de cookies que
        aparece al visitar el sitio, o a través de la configuración de tu navegador:
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/es-cl/guide/safari/sfri11471/mac" target="_blank" rel="noopener">Safari</a></li>
        <li><a href="https://support.microsoft.com/es-es/microsoft-edge" target="_blank" rel="noopener">Microsoft Edge</a></li>
      </ul>

      <h2>Base legal</h2>
      <p>
        El tratamiento de datos mediante cookies se realiza con base en el consentimiento que
        otorgas al aceptarlas, conforme a la Ley 19.628 (Protección de la Vida Privada) y la
        futura Ley 21.719 (Protección y Garantía de los Derechos en el Tratamiento de Datos
        Personales) de Chile.
      </p>

      <h2>Contacto</h2>
      <p>
        Si tienes dudas sobre esta política de cookies, puedes contactarnos a:
        <a href="mailto:contacto@ipproyectosindustriales.cl">contacto@ipproyectosindustriales.cl</a>
      </p>

      <p><em>Última actualización: 25 de agosto de 2026</em></p>
    </Container>
  </SectionLayout>
</BaseLayout>
```

### 6. Accesibilidad (WCAG 2.1 AA)

- **Focus visible:** Todos los botones y checkboxes deben tener `:focus-visible` con outline claro.
- **Contraste:** Texto y botones deben cumplir ratio 4.5:1 mínimo.
- **Navegación por teclado:** El banner debe ser accesible con Tab/Shift+Tab.
- **ARIA:**
  - `role="dialog"` y `aria-label="Configuración de cookies"` en el banner.
  - `aria-live="polite"` para anuncios de cambios de estado.
- **No bloquear interacción:** El banner no debe impedir el scroll ni el uso del sitio.

### 7. Testing

#### Casos de prueba críticos

- [ ] **Primera visita:** Banner aparece, Consent Mode default = denied.
- [ ] **Aceptar todo:** GA4 y Ads se activan, cookie se guarda, banner desaparece.
- [ ] **Solo necesarias:** Solo cookies esenciales, banner desaparece.
- [ ] **Configurar:** Panel se abre, checkboxes funcionan, guardar aplica preferencias.
- [ ] **Recargar página:** Preferencias se leen de cookie, banner no reaparece.
- [ ] **Revocar consentimiento:** Botón en `/cookies` para reabrir el banner.
- [ ] **Sin JavaScript:** Sitio funciona normalmente (SSR), banner no aparece.
- [ ] **Ad blocker:** Sitio funciona, banner no interfiere.
- [ ] **Mobile:** Banner se adapta, botones son táctiles, no bloquea el scroll.
- [ ] **Accesibilidad:** Navegación por teclado, screen reader anuncia el banner.

#### Comandos de verificación

```bash
# Verificar que el build no falla
npm run build

# Verificar en navegador
# 1. Abrir DevTools > Application > Cookies
# 2. Buscar cookie "ip_consent"
# 3. Verificar que contiene {analytics: bool, marketing: bool, timestamp: number}

# Verificar dataLayer en consola
window.dataLayer.filter(e => e.event === 'consent_update');
```

## Cronograma de implementación

| Fase | Tarea | Esfuerzo |
|------|-------|----------|
| 1 | Crear componente `CookieBanner.astro` con UI y lógica | 0.5 días |
| 2 | Implementar `applyConsent()` y persistencia | 0.5 días |
| 3 | Integrar en `BaseLayout.astro` | 0.25 días |
| 4 | Crear página `/cookies` real con contenido legal | 0.5 días |
| 5 | Testing y ajustes de accesibilidad | 0.5 días |
| **Total** | | **2.25 días** |

## Riesgos y mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Banner bloquea conversión | Baja | Alto | Usar bottom bar no intrusivo, no modal. Botón "Solo necesarias" visible. |
| Cookie no se persiste correctamente | Media | Medio | Usar cookie + localStorage como backup. Validar en múltiples navegadores. |
| Consent Mode no se actualiza | Media | Alto | Probar con GTM Preview Mode. Verificar que `gtag('consent', 'update')` se llama. |
| No cumple Ley 21.719 | Media | Alto | Revisar con asesoría jurídica antes de publicar. Documentar base legal. |
| Accesibilidad deficiente | Baja | Medio | Seguir WCAG 2.1 AA. Probar con screen reader y navegación por teclado. |

## Dependencias

- ✅ `gtm-core`: Consent Mode default ya implementado.
- ⏳ `consent-management`: Este plan implementa el banner y la lógica.
- ⏳ `legal-review`: Revisión jurídica de la política de cookies (fuera de scope técnico).

## Referencias

- [Consent Mode v2 — Google](https://support.google.com/analytics/answer/11397241)
- [Ley 19.628 — Chile](https://www.bcn.cl/leychile/navegar?idNorma=144214)
- [Ley 21.719 — Chile](https://www.bcn.cl/leychile/navegar?idNorma=1188088)
- [WCAG 2.1 — W3C](https://www.w3.org/TR/WCAG21/)
