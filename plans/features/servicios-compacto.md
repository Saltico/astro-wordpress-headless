---
feature: Servicios Compacto (§6)
effort: Medio
dependencies: []
status: Planificado
---

# Servicios Compacto (§6) — "También hacemos"

## Overview

Reducción del tamaño de las cards de servicios ("También hacemos") para que sean más compactas y proporcionales al nuevo diseño. Las cards actuales ocupan demasiado espacio con imágenes de aspecto 16:10 y padding generoso. El objetivo es mantener la sección informativa pero con menor protagonismo visual.

## Contexto del Cambio

| Aspecto | Antes | Después |
|---------|-------|---------|
| Aspect-ratio imagen | 16:10 | **4:3** (más cuadrado/compacto) |
| Padding body | 18px 20px 20px | **14px 16px 16px** |
| Título | `var(--text-h5)` | **`1rem`** |
| Texto SEO | 3 líneas clamp | **2 líneas clamp** |
| Grid | 4 columnas desktop | **4 columnas** (mantener) |
| Gap | 20px | **16px** |

## Requisitos Funcionales

1. **Mantener las 4 cards de servicios**: Ingeniería, Construcción, Montajes, Infraestructura portuaria
2. **Mantener el eyebrow "También hacemos"** y el título de sección
3. **Imágenes más compactas**: aspect-ratio 4:3 en lugar de 16:10
4. **Texto reducido**: títulos más pequeños, descripción truncada a 2 líneas
5. **Padding y gap reducidos** para sección más compacta
6. **Hover effects mantenidos**: translateY(-4px) y escala de imagen

## Modificaciones CSS

### Contenedor de sección

```css
/* Antes */
.services-section {
  padding-block: clamp(56px, 8vw, 100px);
}

/* Después */
.services-section {
  padding-block: clamp(40px, 6vw, 72px);
}
```

### Grid

```css
/* Antes */
.services-section__grid {
  gap: 20px;
}

/* Después */
.services-section__grid {
  gap: 16px;
}
```

### Card de servicio

```css
/* Image: aspect-ratio más compacto */
.service-card__image {
  aspect-ratio: 4 / 3;  /* Antes: 16 / 10 */
}

/* Body: padding reducido */
.service-card__body {
  padding: 14px 16px 16px;
  gap: 8px;  /* Antes: 10px */
}

/* Title: más pequeño */
.service-card__title {
  font-size: 1rem;  /* Antes: var(--text-h5) ~1.15rem */
}

/* SEO text: 2 líneas en vez de 3 */
.service-card__seo-text {
  -webkit-line-clamp: 2;  /* Antes: 3 */
}
```

## Impacto Visual

```
Antes (cards grandes):            Después (cards compactas):
┌─────────┐ ┌─────────┐          ┌─────────┐ ┌─────────┐
│ ████████ │ │ ████████ │          │ ██████  │ │ ██████  │
│ ████████ │ │ ████████ │          │ ██████  │ │ ██████  │
│ ████████ │ │ ████████ │          │ ██████  │ │ ██████  │
│          │ │          │          │         │ │         │
│ Título   │ │ Título   │          │ Título  │ │ Título  │
│ Texto    │ │ Texto    │          │ Texto   │ │ Texto   │
│ Texto    │ │ Texto    │          │ CTA     │ │ CTA     │
│ Texto    │ │ Texto    │          └─────────┘ └─────────┘
│ CTA      │ │ CTA      │
└─────────┘ └─────────┘
```

## Responsive

| Breakpoint | Columnas | Aspect-ratio |
|------------|----------|-------------|
| Desktop (>1024px) | 4 | 4:3 |
| Tablet (601-1024px) | 2 | 4:3 |
| Mobile (≤600px) | 1 | 16:9 (más horizontal) |

En mobile, las cards individuales pueden tener un aspecto más horizontal (16:9) ya que al ser una sola columna, la altura no es problema.

## Testing Strategy

- [ ] Verificar aspect-ratio 4:3 en desktop y tablet
- [ ] Confirmar truncamiento de texto a 2 líneas
- [ ] Validar hover effects preservados
- [ ] Testear en los 3 breakpoints
- [ ] Verificar que las imágenes no se deforman con el nuevo ratio

## Riesgos & Mitigación

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Imágenes recortadas de forma fea con 4:3 | Medio | Seleccionar `object-fit: cover` con `object-position: center` |
| Texto demasiado truncado | Bajo | Los textos SEO son descriptivos; 2 líneas bastan para dar contexto |
| Cards muy pequeñas en tablet | Bajo | 2 columnas en tablet mantiene buen tamaño |

## Timeline

**Total: 0.5 día**
- Modificar CSS de cards (aspect-ratio, padding, clamp): 1h
- Ajustes responsive: 1h
- Testing visual: 1h
