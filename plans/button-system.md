# Sistema de botones unificado — Spec

**Estado:** v1.0 — validado contra la referencia `D:\Proyectos\matiascastillo.com\Repos\IP-Sitio-Web\styles.css`.
**Objetivo:** Definir un único sistema de botones consumido como componente Astro con variantes tipadas, alineado al sistema visual de la web de referencia, manteniendo coherencia, accesibilidad y zero regresiones en páginas existentes.

---

## 1. Contexto y decisión

### 1.1 Pregunta a responder
> ¿Es recomendable para Astro contar con un componente botón que cambie su variante según parámetros en la página?

**Respuesta: sí, totalmente.** Es la práctica estándar en Astro y en cualquier framework basado en componentes. Razones:

- **Una sola fuente de verdad** para estilos de CTA → cambios de marca o ajustes de espaciado se hacen en un lugar.
- **Contrato TypeScript** en `Props` → el IDE autocompleta variantes, sizes, íconos, y bloquea props inválidas.
- **Accesibilidad consistente** → focus, ARIA, target táctil, disabled, una sola implementación auditada.
- **CSS scoping predecible** → el `<style>` del componente se scopa con `data-astro-cid` y solo afecta a los elementos que el componente renderiza.
- **Mantenibilidad** → un bug se corrige una vez; un cambio de marca se aplica a todos los consumidores.

**Evidencia en este proyecto:** la auditoría pre-refactor encontró 18+ lugares con botones. Había bugs preexistentes (`.button` usado pero nunca definido en `HeroSection`, `ContactSection` y `ProjectGrid`), clases duplicadas (`.button` en `404/500/gracias`), y tres APIs distintas (`.cta-band__btn`, `.split-section__btn`, `.rental-hero__btn`, `.arriendo-hero__btn`, etc.). Sin un componente, este problema escala.

### 1.2 Por qué la referencia importa
La carpeta `D:\Proyectos\matiascastillo.com\Repos\IP-Sitio-Web\` contiene la **web de referencia** (HTML estático + `styles.css` + `script.js`, 712 líneas de CSS). Es la fuente de verdad visual. La implementación en POC1 debe ser **idéntica** a esa referencia, no "inspirada" en ella. Cualquier desviación es un bug.

---

## 2. Sistema de referencia (extraído de `IP-Sitio-Web/styles.css`)

### 2.1 Tokens (`:root` de `styles.css`)

```css
/* Neutrales */
--ink:        #11151b;   /* texto principal sobre claro */
--ink-soft:   #3b424c;
--muted:      #5b636e;   /* >4.5:1 sobre claro */
--line:       #e3e5e9;   /* bordes hairline sobre claro */
--bg:         #f6f7f8;
--surface:    #ffffff;
--surface-2:  #eef0f2;

/* Oscuros */
--graphite:   #0d1611;
--graphite-2: #15201a;
--graphite-3: #1e2a23;
--on-dark:    #f3f7f4;
--on-dark-mut:#9bab9f;   /* >4.5:1 sobre grafito */
--line-dark:  rgba(255,255,255,.10);

/* Acento VERDE corporativo */
--accent:     #308f40;
--accent-700: #226f31;
--accent-300: #62bb74;
--accent-tint:#e7f3ea;

/* Radios */
--r-sm: 8px;
--r:    12px;
--r-lg: 16px;
--r-pill: 999px;

/* Sombras */
--shadow-sm: 0 1px 2px rgba(13,22,17,.06);
--shadow:    0 10px 30px -12px rgba(13,22,17,.18);

/* z-index semántico */
--z-header: 100;
--z-float:  200;
--z-menu:   300;

--ease: cubic-bezier(.22,.61,.36,1);
```

### 2.2 Sistema de botones (líneas 101–117 de `styles.css`)

**Tres modificadores exactos, sin "variantes dark":**

```css
/* Base */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: .98rem;        /* ~15.7px */
  padding: 14px 26px;
  border-radius: var(--r-pill);
  border: 1.5px solid transparent;
  cursor: pointer;
  transition:
    transform .18s var(--ease),
    background .18s,
    color .18s,
    border-color .18s;
  white-space: nowrap;
  line-height: 1;
}
.btn:active { transform: translateY(1px) scale(.99); }

/* Variante 1: primary */
.btn-primary {
  background: var(--accent);
  color: #fff;
}
.btn-primary:hover {
  background: var(--accent-700);
  transform: translateY(-2px);
}

/* Variante 2: ghost (outline) — claro */
.btn-ghost {
  background: transparent;
  color: var(--ink);
  border-color: var(--line);
}
.btn-ghost:hover {
  border-color: var(--ink);
  transform: translateY(-2px);
}

/* Modificador: ghost en contexto oscuro */
.btn-ghost.on-dark {
  color: var(--on-dark);
  border-color: var(--line-dark);
}
.btn-ghost.on-dark:hover {
  border-color: var(--on-dark);
  background: rgba(255,255,255,.06);
}

/* Tamaño: lg (único adicional al base) */
.btn-lg {
  padding: 17px 32px;
  font-size: 1.05rem;       /* 16.8px */
}

/* Íconos inline */
.btn svg { width: 18px; height: 18px; }
```

### 2.3 Inventario de uso (de las 14 páginas)

| Combinación | Uso | Páginas |
|---|---|---|
| `btn btn-primary` | CTA principal, tamaño por defecto | `compliance`, `contacto` (submit), header/nav, mobile-menu |
| `btn btn-primary btn-lg` | CTA principal grande | `arriendos`, `seguridad`, `servicios`, `ingenieria`, `construccion`, `montajes`, `portuaria`, `arriendo-izaje`, `arriendo-transporte`, `arriendo-movimiento-tierra`, `arriendo-equipos-especiales` (todas en `cta-band`) |
| `btn btn-ghost on-dark btn-lg` | CTA secundario en banda oscura | mismas 11 páginas (segundo botón del `cta-band`) |
| `btn btn-ghost` (sin on-dark) | Outline en contexto claro | **No usado** en el sistema canónico (existe la clase pero no se usa) |
| `d-btn--g`, `d-btn--o` | Demo home inmersivo (`index.html`) | **No migrar** — es código de demo, no parte del sistema real |

**Conclusión:** el sistema canónico son **dos tamaños** (default y `lg`) y **dos variantes** (`primary` y `ghost`), con un **modificador de contexto** (`on-dark`) cuando el ghost va sobre fondo oscuro. Total: 4 combinaciones reales, no más.

---

## 3. Diseño del componente

### 3.1 Principios

1. **Identidad visual exacta** con la referencia. No "mejorarla", no reinterpretarla.
2. **Solo 2 variantes** (`primary` / `ghost`) + modificador `onDark` + tamaño `lg` opcional. Cualquier otro modificador se documenta explícitamente.
3. **Tokens primero.** Todos los valores vienen de `src/styles/tokens.css` (que ya existe). No valores hardcoded.
4. **Accesibilidad por defecto:** focus visible, `min-height: 44px`, `aria-disabled`, `rel="noopener noreferrer"` automático en `target="_blank"`.
5. **Type-safe** con `Props` exhaustiva; `[attr: string]: unknown` solo para propagación de `data-*`.
6. **Estilos scoped al componente.** Nunca `:global()` ni `is:global`.

### 3.2 API del componente

```ts
// src/components/ui/Button.astro
interface Props {
  // Renderizado
  href?: string;                        // si está, renderiza <a>
  type?: 'button' | 'submit' | 'reset'; // default 'button'

  // Variante y modificador
  variant?: 'primary' | 'ghost';        // default 'primary'
  onDark?: boolean;                     // ghost sobre fondo oscuro

  // Tamaño
  size?: 'md' | 'lg';                   // default 'md'

  // Estados
  disabled?: boolean;
  fullWidth?: boolean;

  // Ícono
  icon?: IconName;
  iconPosition?: 'left' | 'right';      // default 'left'
  iconSize?: number;                    // default: 18 (lg) o 16 (md)

  // Link attrs
  target?: string;
  rel?: string;
  download?: boolean | string;

  // A11y
  ariaLabel?: string;

  // Escape
  class?: string;
  [attr: string]: unknown;
}
```

**Notas:**
- **NO incluir** `danger`, ni `outline`, ni variante `dark/light`, ni `xs/sm/xl`.
- `onDark` solo aplica cuando `variant === 'ghost'`. Si el consumidor lo activa con primary, no-op.
- `iconPosition` y `iconSize` por defecto son los de la referencia (`18px`, izquierda).

### 3.3 Estilos del componente (alineados a la referencia)

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3, 0.75rem);
  font-family: var(--font-heading);    /* Plateia (la POC1 la usa como heading) */
  font-weight: 700;
  font-size: 0.98rem;                  /* ≈15.7px */
  line-height: 1;
  white-space: nowrap;
  padding: 14px 26px;
  border: 1.5px solid transparent;
  border-radius: var(--radius-pill);
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition:
    transform var(--motion-base, 200ms) var(--ease-out, ease),
    background var(--motion-base, 200ms),
    color var(--motion-base, 200ms),
    border-color var(--motion-base, 200ms);
}
.btn:active { transform: translateY(1px) scale(.99); }
.btn:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 3px;
}

/* Primary */
.btn--primary {
  background: var(--color-brand);
  color: var(--color-on-brand);
}
.btn--primary:hover {
  background: var(--color-brand-600);
  transform: translateY(-2px);
}

/* Ghost (outline) */
.btn--ghost {
  background: transparent;
  color: var(--color-ink);
  border-color: var(--color-line);
}
.btn--ghost:hover {
  border-color: var(--color-ink);
  transform: translateY(-2px);
}
.btn--ghost.on-dark {
  color: var(--color-on-dark);
  border-color: var(--line-dark, rgba(255,255,255,0.1));
}
.btn--ghost.on-dark:hover {
  border-color: var(--color-on-dark);
  background: rgba(255, 255, 255, 0.06);
}

/* Tamaño large */
.btn--lg {
  padding: 17px 32px;
  font-size: 1.05rem;
}

/* Íconos */
.btn :global(svg) { width: 1.125rem; height: 1.125rem; flex-shrink: 0; }

/* Disabled */
.btn:disabled,
.btn[aria-disabled='true'],
.btn.is-disabled {
  opacity: 0.55;
  cursor: not-allowed;
  pointer-events: none;
  transform: none;
}

@media (max-width: 768px) {
  .btn--lg {
    width: 100%;
  }
}
```

**Diferencias con la versión actual de `Button.astro`:**

| Aspecto | Actual (post-refactor) | Referencia | Acción |
|---|---|---|---|
| Color verde | `#348f41` (token `brand`) | `#308f40` | Actualizar token de marca (decisión abajo) |
| `accent-700` hover | `#2c7c37` | `#226f31` | Actualizar token |
| Ghost border (claro) | `color-mix(currentColor 32%)` | `var(--line)` explícito | Cambiar a `var(--color-line)` |
| Ghost on-dark border | `color-mix(currentColor 32%)` | `var(--line-dark)` explícito | Cambiar a `var(--line-dark)` |
| Ghost on-dark hover bg | `color-mix(currentColor 8%)` | `rgba(255,255,255,0.06)` | Cambiar a rgba explícito |
| Tamaño md font-size | `0.9375rem` (15px) | `0.98rem` (15.7px) | Ajustar a 0.98rem |
| Tamaño md padding | `0.8125rem 1.5rem` (13px 24px) | `14px 26px` | Ajustar a 14px 26px |
| Tamaño lg padding | `1rem 1.875rem` (16px 30px) | `17px 32px` | Ajustar a 17px 32px |
| Tamaño lg font-size | `1rem` | `1.05rem` | Ajustar a 1.05rem |
| Hover lift | `translateY(-1px)` | `translateY(-2px)` | Ajustar a -2px |
| Active | nada | `translateY(1px) scale(.99)` | Añadir |
| Variantes | primary, secondary (2 nombres distintos para el mismo concepto) | primary, ghost (1 nombre) | Renombrar secondary → ghost |
| Modificador contexto | `currentColor` adaptativo | `on-dark` explícito | Quitar `currentColor`; añadir `onDark` prop |
| Estado danger | sí | no | Eliminar |
| Tamaño min-height | sí (44px) | no explícito | Mantener (accesibilidad) |

**Decisión sobre el color de marca:** los tokens actuales de POC1 (`#348f41` / `#2c7c37` / `#62bb74` / `#ebf5ed`) están **muy cerca** de la referencia (`#308f40` / `#226f31` / `#62bb74` / `#e7f3ea`). La diferencia de tono es mínima pero **existe**. El logo corporativo real (en `IP-Sitio-Web/index.html` `<img src="...logo.png">`) usa `#308f40`. Recomendación: actualizar los tokens de POC1 al valor de la referencia para alinear con la marca real. Es un cambio de 4 valores en `src/styles/tokens.css`.

### 3.4 Lo que NO entra (decisiones explícitas)

| No incluir | Por qué |
|---|---|
| `danger` | La referencia no lo tiene. El "Limpiar cotizador" pasa a `btn--ghost` neutro. |
| `outline` como variante | La referencia no lo tiene; `ghost` cubre el caso. |
| `sm` / `xs` / `xl` sizes | La referencia solo tiene `md` (base) y `lg`. |
| `fullWidth` en desktop | Solo en mobile (`< 768px`) se hace full-width para CTAs `lg`. |
| Animación de loading spinner | No se ha pedido. Se puede añadir después con un slot. |
| Variante "dark" o "light" | `onDark` cubre el caso de contexto oscuro sin inflar la API. |

---

## 4. Plan de unificación (fases)

> **Reglas del proceso:**
> - Cada fase termina con build verde + revisión visual contra `IP-Sitio-Web`.
> - Ningún cambio se considera "terminado" sin screenshot comparativo.
> - Si una decisión contradice la referencia, gana la referencia. Sin excepciones.

### Fase 0 — Reset (revertir lo que molestó)
- [ ] **Revertir el rediseño del stepper** al look pre-refactor (círculos numerados, conectores, active con brand bg, sin checks). Mantener solo el fix de overlap (`--quote-wizard-nav-h` + z-index) que es invisible visualmente.
- [ ] **Revertir el `btn--danger` rojo** de "Limpiar cotizador" — pasa a `btn--ghost` neutro.
- [ ] **Revertir paddings/hover del Button** a `14px 26px` (md) y `translateY(-2px)` para alinear con la referencia.

### Fase 1 — Alinear tokens a la referencia
- [ ] Actualizar `src/styles/tokens.css` (alias en `:root`):
  - `--accent`: `#348f41` → `#308f40`
  - `--accent-700`: `#2c7c37` → `#226f31`
  - `--accent-tint`: `#ebf5ed` → `#e7f3ea`
  - `--line-dark`: añadir alias `var(--color-line-dark)` (`rgba(255,255,255,0.1)`)
- [ ] Verificar que no se rompen visualmente otros consumidores (el cambio es de tono, no de jerarquía).
- [ ] **Impacto**: este cambio toca TODO el sitio (el verde cambia de tono), pero el delta es <2% perceptual.

### Fase 2 — Reescribir `Button.astro` según §3
- [ ] Renombrar `secondary` → `ghost` en todo el componente.
- [ ] Quitar `danger` y `sm` size.
- [ ] Añadir `onDark?: boolean` (solo aplica a `ghost`).
- [ ] Ajustar valores a la referencia (§3.3).
- [ ] Quitar `color-mix` por valores explícitos.
- [ ] Actualizar `outline-focus` (mantener brand color — la referencia no lo tiene explícito pero hereda del global).
- [ ] Build verde.

### Fase 3 — Re-migrar consumidores
- [ ] `CTABand.astro` — `primary` → `Button primary`, `secondary` → `Button ghost onDark`, `outline` (legacy) → `Button ghost onDark`. API sigue aceptando `variant?: 'primary' | 'secondary' | 'outline'` por backward-compat, mapeo interno.
- [ ] `SplitSection.astro` — `primary`.
- [ ] `HeroSection.astro` — `primary` + `ghost onDark` (en hero oscuro).
- [ ] `ProjectGrid.astro` — `ghost` (botón "Ver más proyectos", en contexto claro).
- [ ] `ContactSection.astro` — `primary` (form submit).
- [ ] `RentalLayout.astro` — `primary` (Cotizar) + `ghost onDark` (Descargar catálogo).
- [ ] `arriendo/index.astro` — mismo.
- [ ] `QuoteHero.astro` — `primary` (Descargar catálogo).
- [ ] `QuoteForm.astro` — `primary`.
- [ ] `QuoteFormAdvanced.astro` — `primary` (Solicitar cotización) + `ghost onDark` (Escribir por WhatsApp).
- [ ] `QuoteCartSummary.astro` — `ghost` (Limpiar, sin `danger`) + `primary` (Continuar; sin `whatsapp` aquí porque no se usa en wizard).
- [ ] `QuoteCompanyForm.astro` — `ghost` (Volver) + `primary` (Continuar).
- [ ] `QuoteReview.astro` — `primary lg` (Enviar cotización) + `ghost onDark` (Hablar con ejecutivo).
- [ ] `EquipmentPicker.astro` — `ghost` (Limpiar filtros, Volver al catálogo).
- [ ] `pages/404.astro`, `500.astro`, `gracias.astro` — `primary`.

### Fase 4 — Revertir el stepper al look histórico
- [ ] `QuoteWizard.astro`: restaurar el look pre-refactor (círculos numerados, sin checks, sin dividers coloreados, sin container pill con shadow).
- [ ] Mantener los fixes invisibles: publicación de `--quote-wizard-nav-h` para el offset sticky; z-index 30 del nav; `aria-current` correcto.
- [ ] El live region del stepper sigue anunciando el paso (es accesibilidad útil, no visual).

### Fase 5 — Controles especializados (no tocar)
- [ ] Documentar por qué se mantienen como están:
  - `Header.astro` `.header-cta` (label responsive, único).
  - `QuoteAddButton.astro` `.quote-add-btn` (3 estados: idle/added/error).
  - `EquipmentPickerCard.astro` `.picker-card__add` (markup regenerado por JS).
  - `QuoteWizard.astro` `quote-wizard__step-btn` (su propio componente, no usa `<Button>`).

### Fase 6 — Verificación final
- [ ] Auditoría grep: cero estilos de botón duplicados fuera de `Button.astro`:
  ```bash
  rg -n "border-radius: 999px" src/components src/pages | rg -v "Button.astro|QuoteAddButton.astro|EquipmentPickerCard.astro|EquipmentPicker.astro"
  ```
- [ ] Auditoría: `data-*` atributos enganchan handlers JS correctamente:
  - `data-quote-wizard-next`, `data-quote-wizard-prev`, `data-quote-wizard-step1`
  - `data-quote-action="clear|whatsapp"`, `data-picker-action="reset"`, `data-load-more`
  - `data-review-action="send|talk"`
- [ ] Smoke test de todas las páginas con botones migrados: capturarlas y compararlas con `IP-Sitio-Web` (las que tienen equivalente directo: `index.html` → `/`, `contacto.html` → `/contacto`, `arriendos.html` → `/arriendo`, `ingenieria.html` → `/servicios/ingenieria`).
- [ ] Lighthouse a11y ≥ 95 en `/cotizador` y homepage.
- [ ] Build verde.

---

## 5. Decisiones de scope que necesito contigo

| # | Decisión | Opción A (recomendada) | Opción B |
|---|---|---|---|
| 1 | ¿Actualizar el color de marca a `#308f40` (alinear con la referencia y el logo real)? | Sí — alinea con la marca y el sitio de referencia. | No — mantener `#348f41` actual (delta perceptual <2%). |
| 2 | ¿Revertir el stepper al look pre-refactor? | Sí, en Fase 4. | No, iterar el nuevo look con tu feedback. |
| 3 | ¿Migrar la home (`index.html`) al look "firma" de la referencia (`.d-hero`, `.d-cta-band`, etc.)? | No — la home es una página aparte con su propio demo en `IP-Sitio-Web/index.html`. Mantener el `HeroSection` actual. | Sí — reescribir `pages/index.astro` con los bloques `d-*`. |
| 4 | ¿Mantener `Button.astro` o migrar a un componente con un nombre más alineado al sistema (`AppButton`, `UiButton`)? | Mantener `Button.astro` (es claro y estándar). | Renombrar. |
| 5 | ¿El botón "Limpiar cotizador" sigue requiriendo una acción destructiva con confirm? | Sí, pero con un `ghost` neutro en lugar de rojo. El `confirm()` se mantiene. | Cambiar a un patrón "Vaciar" sin confirm (más moderno). |

---

## 6. Mapeo de referencia ↔ POC1 (para auditoría visual)

| Referencia (`IP-Sitio-Web`) | POC1 actual (migrado) | Componente POC1 |
|---|---|---|
| `index.html` hero con video + stats | `HeroSection.astro` (estático) | Distintos — fuera de scope del refactor de botones |
| `arriendos.html` + `cta-band` | `arriendo/index.astro` + `CTABand` | `arriendo/index.astro` + `CTABand.astro` |
| `contacto.html` form submit | `contacto/index.astro` | `ContactSection.astro` |
| `servicios.html` cards | `pages/servicios/index.astro` | `ServicesGrid.astro` (cards propios) — fuera de scope |
| `cotizador.html` — **no existe en la referencia** | `cotizador.astro` | `cotizador.astro` (creado por nosotros) |

El cotizador y el stepper **son creación propia** (no tienen equivalente en la referencia). La Fase 4 (revertir stepper) valida contra el **pre-refactor de POC1** (cómo se veía antes), no contra `IP-Sitio-Web`.

---

## 7. Criterios de aceptación (Definition of Done)

- [ ] `Button.astro` reescrito según §3.2 (API) y §3.3 (estilos).
- [ ] Tokens de marca actualizados a los valores de la referencia (si se aceptó la decisión 1).
- [ ] Cero estilos de botón fuera de `Button.astro` (excepto controles especializados documentados).
- [ ] Stepper visualmente idéntico al pre-refactor.
- [ ] "Limpiar cotizador" sin rojo.
- [ ] `npm run build` verde.
- [ ] Smoke test visual: las páginas migradas se ven como sus equivalentes en `IP-Sitio-Web` (cuando aplique).
- [ ] Lighthouse a11y ≥ 95 en `/cotizador` y `/`.
- [ ] Foco visible en color de marca en todos los botones.
- [ ] Cero regresión de funcionalidad de wizard: `data-quote-wizard-next`, `data-quote-wizard-prev`, `data-quote-wizard-step1`, `data-quote-action="clear|whatsapp"`, `data-picker-action="reset"`, `data-load-more`, `data-review-action="send|talk"` siguen enganchando handlers.

---

## 8. Apéndice: sistema del demo (NO migrar)

Para evitar confusiones: el archivo `IP-Sitio-Web/index.html` tiene una sección de demo con un sistema propio de botones:

```css
.d-btn { display: inline-flex; align-items: center; gap: 10px; font-family: 'Archivo', sans-serif; font-weight: 700; font-size: 1rem; padding: 16px 30px; border-radius: 999px; transition: transform .18s, background .18s; }
.d-btn--g { background: var(--accent); color: #fff; }
.d-btn--g:hover { background: var(--accent-700); transform: translateY(-2px); }
.d-btn--o { border: 1.5px solid rgba(255,255,255,.4); color: #fff; }
.d-btn--o:hover { border-color: #fff; transform: translateY(-2px); }
```

Este sistema `d-btn` es **del demo home** y **no se replica en otras páginas** de la referencia. El sistema canónico es el de `styles.css` líneas 101–117 (`.btn`, `.btn-primary`, `.btn-ghost`, `.btn-ghost.on-dark`, `.btn-lg`).
