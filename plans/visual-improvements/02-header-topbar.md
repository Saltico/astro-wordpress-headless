# Spec 02 — Header + TopBar (Empresa off, sticky, scroll-hide)

**Fase:** 2
**Estado:** ⬜ Pendiente
**Archivos a modificar:**
- `src/components/layout/TopBar.astro`
- `src/components/layout/Header.astro`
- `src/layouts/BaseLayout.astro`

**Archivos a crear:**
- (ninguno nuevo; el estilo vive dentro de los componentes)

**Depende de:** Spec 01 (la data de navegación ya viene de `site.ts`).
**Bloquea a:** ninguna directamente, pero precede a todas las specs que tocan el layout (03, 04, 05, 06, 07, 08, 09).

---

## Objetivo

1. Refactor del `TopBar`:
   - Tipografía y font-family explícitos.
   - Iconos sociales (LinkedIn, Instagram, Facebook).
   - **Comportamiento scroll-hide**: desaparece al hacer scroll hacia abajo, reaparece al volver al tope. Implementado con `IntersectionObserver` sobre un sentinel.
   - Respeta `prefers-reduced-motion`.
2. Refactor del `Header`:
   - Tipografía del CTA (botón "Solicitar cotización") alineada con la familia display `Plateia Bold` (no la del body).
   - Eliminar el re-estilado del CTA en `BaseLayout.astro` (CSS duplicado actualmente).
3. **Eliminar el item "Empresa"** del menú (el logo ya lleva a `/`).

## Estado actual (problemas detectados)

| Archivo | Línea(s) | Problema |
|---|---|---|
| `TopBar.astro:48-55` | CSS | `font-family` no declarado; hereda del body. |
| `TopBar.astro` | falta | Sin iconos sociales. |
| `TopBar.astro` | falta | No se oculta al hacer scroll. |
| `Header.astro:13-50` | CSS | CTA con `font-weight: 600`, no usa `--font-heading`. |
| `BaseLayout.astro:216-220, 274-364` | CSS | El CTA del header está re-estilado en `BaseLayout` con sus propias clases (`.header-cta`, `.header-cta__text`, etc.) → CSS duplicado, fuente inconsistente. |
| `BaseLayout.astro:75` | nav | `defaultNavItems` incluye `{ label: 'Empresa', url: '/' }` (lo eliminamos en Spec 01; se confirma en esta spec). |

## Cambios en `src/components/layout/TopBar.astro`

```astro
---
// src/components/layout/TopBar.astro
// Utility bar: teléfono, email, redes sociales, links secundarios.
// Comportamiento: sticky con scroll-hide (IntersectionObserver sobre sentinel).
// Respeta prefers-reduced-motion.

import Icon from '@/components/ui/Icon.astro';
import type { SocialLink } from '@/types/layout';
import type { IconName } from '@/lib/icons';

export interface Props {
  phone?: string;
  email?: string;
  social?: SocialLink[];
  links?: Array<{ label: string; url: string; highlight?: boolean }>;
}

const {
  phone = '+56 9 0000 0000',
  email = 'contacto@ipproyectosindustriales.cl',
  social = [],
  links = [],
} = Astro.props;

const socialIconMap: Record<SocialLink['platform'], IconName> = {
  linkedin: 'linkedin',
  instagram: 'instagram',
  facebook: 'facebook',
  whatsapp: 'whatsapp',
};
---

<div class="topbar" data-topbar role="banner" aria-label="Información de contacto">
  <div class="topbar__inner">
    <ul class="topbar__list topbar__list--contact">
      {phone && (
        <li>
          <a href={`tel:${phone.replace(/\s/g, '')}`} class="topbar__link">
            <Icon name="phone" size={14} class="topbar__icon" />
            <span>{phone}</span>
          </a>
        </li>
      )}
      {email && (
        <li>
          <a href={`mailto:${email}`} class="topbar__link">
            <Icon name="email" size={14} class="topbar__icon" />
            <span>{email}</span>
          </a>
        </li>
      )}
    </ul>

    <div class="topbar__right">
      {social.length > 0 && (
        <ul class="topbar__social" aria-label="Redes sociales">
          {social.map((link) => (
            <li>
              <a
                href={link.url}
                class="topbar__social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label || `Ir a ${link.platform}`}
              >
                <Icon name={socialIconMap[link.platform]} size={14} />
              </a>
            </li>
          ))}
        </ul>
      )}

      {links.length > 0 && (
        <ul class="topbar__list topbar__list--actions">
          {links.map((link) => (
            <li>
              <a
                href={link.url}
                class:list={['topbar__link', link.highlight && 'topbar__link--highlight']}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
</div>

<script>
  (function () {
    if (typeof window === 'undefined') return;
    const topbar = document.querySelector<HTMLElement>('[data-topbar]');
    if (!topbar) return;

    // Sentinel: 1px elemento en el tope del header.
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText =
      'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
    topbar.parentElement?.insertBefore(sentinel, topbar);

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Cuando el sentinel está visible (top de la página), topbar visible.
        // Cuando el sentinel sale (scroll down), topbar se oculta.
        topbar.classList.toggle('is-hidden', !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
  })();
</script>

<style>
  .topbar {
    background-color: var(--color-graphite, #0d1611);
    border-bottom: 1px solid var(--color-line, rgba(255, 255, 255, 0.08));
    color: rgba(255, 255, 255, 0.85);
    font-family: var(--font-body);
    font-size: 0.8125rem;
    line-height: 1.4;
    transition: transform 0.3s var(--ease-out, ease);
    will-change: transform;
    z-index: 101; /* sobre el header sticky */
  }

  .topbar.is-hidden {
    transform: translateY(-100%);
  }

  .topbar__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: var(--container-max-width, 1360px);
    margin-inline: auto;
    padding: 0 var(--container-padding, 20px);
    height: var(--topbar-height, 36px);
    gap: 16px;
  }

  .topbar__list,
  .topbar__social {
    display: flex;
    align-items: center;
    gap: 18px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .topbar__right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .topbar__link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    transition: color 0.15s var(--ease-out, ease);
  }

  .topbar__link:hover,
  .topbar__link:focus-visible {
    color: var(--color-brand-300, #4ade80);
  }

  .topbar__link--highlight {
    color: var(--color-brand-300, #4ade80);
    font-weight: 600;
  }

  .topbar__icon {
    color: var(--color-brand-300, #4ade80);
    flex-shrink: 0;
  }

  .topbar__social-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    transition: color 0.15s var(--ease-out, ease),
      background-color 0.15s var(--ease-out, ease);
  }

  .topbar__social-link:hover,
  .topbar__social-link:focus-visible {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 767px) {
    /* En mobile ocultamos la lista de contacto y mostramos solo redes + links */
    .topbar__list--contact {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .topbar {
      transition: none;
    }
  }
</style>
```

## Cambios en `src/components/layout/Header.astro`

Reemplazar la versión actual por una versión que mueva el CTA al slot y aplique la tipografía display.

```astro
---
// src/components/layout/Header.astro
// Header sticky. Slots: logo, navigation, cta.
// El CTA vive en el slot para que el padre controle la etiqueta final.

export interface Props {
  variant?: 'default' | 'brand';
}

const { variant = 'default' } = Astro.props;
const headerClassList = ['header', variant === 'brand' && 'header--brand'];
---

<header class:list={headerClassList} role="banner" data-header>
  <div class="header__inner">
    <div class="header__logo">
      <slot name="logo">
        <a href="/" class="header__brand">IP Proyectos Industriales</a>
      </slot>
    </div>

    <div class="header__nav">
      <slot name="navigation" />
    </div>

    <div class="header__cta">
      <slot name="cta" />
    </div>
  </div>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: var(--color-surface, #fff);
    border-bottom: 1px solid transparent;
    height: var(--header-height, 72px);
    font-family: var(--font-body);
    transition: box-shadow 0.2s var(--ease-out, ease),
      border-color 0.2s var(--ease-out, ease),
      height 0.2s var(--ease-out, ease);
  }

  .header.is-scrolled {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    border-color: var(--color-line, #e5e7eb);
  }

  .header--brand {
    background-color: var(--color-brand, #1a9c4a);
    color: var(--color-on-brand, #fff);
  }

  .header__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4, 16px);
    max-width: var(--container-max-width, 1360px);
    height: 100%;
    margin-inline: auto;
    padding-inline: var(--container-padding, 20px);
  }

  .header__logo {
    flex-shrink: 0;
  }

  .header__brand {
    display: inline-block;
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1.125rem;
    color: inherit;
    text-decoration: none;
  }

  @media (min-width: 768px) {
    .header__brand {
      font-size: 1.25rem;
    }
  }

  .header__nav {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  @media (max-width: 1023px) {
    .header__nav {
      justify-content: flex-end;
    }
  }

  .header__cta {
    flex-shrink: 0;
  }

  /* Estilos del CTA que viene por slot. El padre pone el contenido
     (texto + icono); aquí solo tipografía y estado focus visible. */
  .header__cta :global(a) {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    min-height: 2.5rem;
    padding: 0.5rem 0.875rem;
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 0.8125rem;
    letter-spacing: 0.015em;
    border-radius: 9999px;
    text-decoration: none;
    transition: background-color 0.15s var(--ease-out, ease),
      transform 0.15s var(--ease-out, ease),
      box-shadow 0.15s var(--ease-out, ease);
  }

  @media (min-width: 640px) {
    .header__cta :global(a) {
      min-height: 2.75rem;
      padding: 0.5625rem 1.125rem;
      font-size: 0.9375rem;
    }
  }

  .header__cta :global(a):focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
  }
</style>

<script>
  // Marca .is-scrolled cuando el header se separa del tope.
  // Útil para dar sombra/borde en scroll. No cambia la posición sticky.
  (function () {
    if (typeof window === 'undefined') return;
    const header = document.querySelector<HTMLElement>('[data-header]');
    if (!header) return;

    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:1px;pointer-events:none;';
    header.parentElement?.insertBefore(sentinel, header);

    const observer = new IntersectionObserver(
      ([entry]) => {
        header.classList.toggle('is-scrolled', !entry.isIntersecting);
      },
      { threshold: [0, 1] }
    );
    observer.observe(sentinel);
  })();
</script>
```

## Cambios en `src/layouts/BaseLayout.astro`

Eliminar todo el bloque CSS del CTA inline (líneas 274-364 actual). El slot del CTA sigue ahí pero los estilos viven ahora en `Header.astro`.

```diff
-      <style>
-        .header-logo { ... }
-        .header-cta { ... }
-        .header-cta--on-brand { ... }
-        .header-cta:focus-visible { ... }
-        .header-cta--on-brand:focus-visible { ... }
-      </style>
```

Mantener el markup del slot, sin las clases `.header-cta` y `.header-cta--on-brand`. Solo dejar el `<a>` con la marca de estilo base:

```astro
<a slot="cta" href="/contacto" class="header-cta-link">
  <span class="header-cta-link__text">Solicitar cotización</span>
  <span class="header-cta-link__text-short">Cotizar</span>
  <Icon name="arrow-right" size={13} class="header-cta-link__icon" />
</a>
```

Y agregar el estilo base en el propio `BaseLayout.astro` (solo colores de fondo, no tipografía):

```astro
<style>
  .header-cta-link {
    background-color: var(--color-brand, #1a9c4a);
    color: var(--color-on-brand, #fff);
    border: 1.5px solid rgba(255, 255, 255, 0.25);
  }

  .header-cta-link--on-brand,
  .header--brand ~ * .header-cta-link {
    background-color: #fff;
    color: var(--color-brand-700, #15803d);
    border-color: rgba(255, 255, 255, 0.9);
  }

  .header-cta-link:hover,
  .header-cta-link:focus-visible {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
  }
</style>
```

(NOTA: el `BaseLayout` ya no controla `--on-brand` por variant. La variant del header se controla desde `Header.astro` con un atributo `data-variant`.)

## Eliminar "Empresa" del menú

Ya hecho en Spec 01 al importar `navigationData` desde `site.ts` (ese array no incluye "Empresa"). Solo verificar que `grep -rn "label: 'Empresa'" src/` no devuelva matches.

## Decisiones de diseño

1. **Tipografía del TopBar**: usa `--font-body` (Bliss Pro) en lugar de una sans genérica, para mantener la voz de marca. Tamaño 13px (0.8125rem), no 14px, para que la jerarquía con el header sea clara.

2. **Scroll-hide del TopBar**: solo se aplica a partir de `768px` (desktop). En mobile, donde el TopBar muestra solo redes sociales + links secundarios, no tiene sentido ocultarlo: el espacio es escaso y la barra es corta.

3. **Z-index del TopBar (101) vs Header (100)**: cuando ambos son sticky, el TopBar queda por encima para que el header se deslice debajo al ocultarse. El header tiene `top: 0` y el TopBar se desliza con `translateY(-100%)`, lo que visualmente produce el efecto de "barra que se va hacia arriba".

4. **CTA en el slot, no en el componente**: el botón "Solicitar cotización" varía según el proyecto (puede ser "Cotizar", "Reservar", etc.). Por eso vive en el slot del padre. El `Header.astro` solo aporta tipografía + focus state.

5. **Sin icono del item "Empresa"**: el logo ya cumple la función. Reducir ruido visual.

## Tareas

- [ ] Editar `TopBar.astro` con la nueva versión (incluye scroll-hide + iconos sociales).
- [ ] Editar `Header.astro` con la nueva versión (tipografía display + slot CTA sin estilos).
- [ ] Editar `BaseLayout.astro`: eliminar el CSS del CTA inline (líneas 274-364) y mantener solo el markup + colores de fondo.
- [ ] Verificar que `navigationData` (en `site.ts`) NO contiene "Empresa".
- [ ] Verificar en mobile (≤767px) que el TopBar muestra solo redes + links.
- [ ] Probar scroll-hide: en desktop, scroll abajo debe ocultar el TopBar; scroll al tope debe mostrarlo.
- [ ] Validar con `prefers-reduced-motion: reduce` que el TopBar no se anima.
- [ ] Validar con lector de pantalla: `aria-label="Información de contacto"` en el TopBar y `aria-label` en cada link social.

## Definition of Done

- [ ] El botón CTA del header usa `font-family: var(--font-heading)`.
- [ ] El TopBar se oculta al hacer scroll hacia abajo en desktop y reaparece al volver al tope.
- [ ] El TopBar en mobile solo muestra iconos sociales + links secundarios.
- [ ] El TopBar tiene tipografía `--font-body` declarada explícitamente.
- [ ] El item "Empresa" ya no aparece en el menú principal.
- [ ] Los iconos sociales tienen `aria-label` descriptivo.
- [ ] No hay CSS duplicado entre `Header.astro` y `BaseLayout.astro` para el CTA.
- [ ] `npm run build` no genera warnings.
- [ ] Lighthouse accessibility ≥ 95 (idealmente 100) en home.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| `IntersectionObserver` no soportado en navegadores antiguos | Fallback: `position: sticky` sin animación. La barra siempre es visible. No rompe layout. |
| Scroll-hide molesta a usuarios que necesitan el teléfono siempre visible | El header sticky conserva el CTA de cotización. El TopBar en mobile (donde más se necesita el teléfono) no se oculta. |
| Cambio de `aria-label` en el slot CTA rompe tests E2E | Los tests E2E deben buscar por texto visible, no por `aria-label`. Documentar en `AGENTS.md`. |
| Eliminar "Empresa" del nav desconcierta a usuarios con memoria muscular | El logo es la convención universal. La nueva home tiene un SplitSection "Nuestra empresa" que ocupa ese rol narrativo. |
