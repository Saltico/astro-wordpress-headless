---
name: IP Proyectos Industriales
description: Industrial B2B website for heavy equipment rental and mining services in northern Chile
colors:
  brand: "#308f40"
  brand-600: "#226f31"
  brand-700: "#1d5a26"
  brand-300: "#62bb74"
  brand-050: "#e7f3ea"
  graphite: "#0d1611"
  graphite-2: "#15201a"
  graphite-3: "#1e2a23"
  ink: "#242627"
  ink-700: "#3a3d3e"
  ink-500: "#6b7072"
  surface: "#ffffff"
  line: "#e2e4e5"
  on-dark: "#f3f7f4"
  on-dark-muted: "#9bab9f"
  on-brand: "#ffffff"
  danger: "#c0392b"
  warning: "#b7791f"
  success: "#308f40"
typography:
  display:
    fontFamily: "Archivo, Plateia, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 900
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Archivo, Plateia, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, Plateia, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.375rem, 2.2vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "Inter, Bliss Pro, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1rem, 0.4vw + 0.95rem, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.16em"
    textTransform: "uppercase"
rounded:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  card: "0.875rem"
  lg: "1.25rem"
  panel: "1rem"
  toast: "0.625rem"
  pill: "999px"
spacing:
  1: "0.25rem"
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  5: "1.25rem"
  6: "1.5rem"
  8: "2rem"
  10: "2.5rem"
  12: "3rem"
  16: "4rem"
  20: "5rem"
  24: "6rem"
  30: "7.5rem"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  button-primary-hover:
    backgroundColor: "{colors.brand-600}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  button-ghost-on-dark:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
---

# Design System: IP Proyectos Industriales

## Overview

**Creative North Star: "The Industrial Command Center"**

This design system conveys the authority and reliability of heavy industrial operations. The aesthetic is dark, grounded, and technical — like the control room of a mining operation. Graphite surfaces provide a serious backdrop for content, while the brand green (#308f40) signals action and availability. The system prioritizes clarity over decoration, technical proof over marketing claims, and operational readiness over visual novelty.

The density is moderate: generous whitespace in headers and CTAs, tighter packing in service grids and equipment cards. The system uses a dual-theme approach (dark graphite default, light surface optional) with semantic tokens that adapt automatically.

**Key Characteristics:**
- Dark-first with graphite surfaces (#0d1611) as the default canvas
- Brand green (#308f40) used sparingly for CTAs and interactive elements — its rarity is the point
- Condensed industrial typography (Archivo) for headings, clean sans-serif (Inter) for body
- Generous use of backdrop-filter blur for glassmorphic overlays on hero images
- Eyebrow pattern (uppercase + decorative line) as the universal section introducer
- Rounded pill buttons (999px radius) for a modern industrial feel
- Subtle hover animations (translateY -2px to -4px) for tactile feedback

## Colors

The palette is built around a deep graphite-green base with a vibrant brand green accent. The system supports both dark (default) and light themes via semantic tokens.

### Primary
- **Brand Green** (#308f40): The action color. Used for primary buttons, active states, and interactive highlights. Appears on ≤10% of any given surface — its scarcity creates visual hierarchy. Darker variant (#226f31) for hover states.

### Secondary
- **Brand Light** (#62bb74): The accent green for eyebrows, decorative elements, and text highlights on dark backgrounds. Provides contrast against graphite without the intensity of the primary brand green.

### Neutral
- **Graphite** (#0d1611): The default dark surface. A deep green-black that conveys industrial seriousness. Used for hero overlays, section backgrounds, and the footer.
- **Graphite 2** (#15201a): Slightly lighter graphite for alternating sections and elevated surfaces.
- **Graphite 3** (#1e2a23): The lightest graphite, used for cards and containers on dark backgrounds.
- **On Dark** (#f3f7f4): Near-white text on dark backgrounds. Provides excellent contrast without the harshness of pure white.
- **On Dark Muted** (#9bab9f): Secondary text on dark backgrounds. Used for descriptions and supporting content.
- **Ink** (#242627): The default text color for light theme. A near-black with slight warmth.
- **Ink 500** (#6b7072): Muted text for light theme. Used for descriptions and metadata.
- **Surface** (#ffffff): Pure white for light theme backgrounds and cards.
- **Line** (#e2e4e5): Subtle borders and dividers on light backgrounds.

### Named Rules
**The One Voice Rule.** The brand green (#308f40) is used on ≤10% of any given screen. Its rarity is the point. When everything is green, nothing is.

**The Graphite Gradient Rule.** Dark sections use graphite (#0d1611), graphite-2 (#15201a), and graphite-3 (#1e2a23) in sequence to create depth without hard borders. Never mix graphite with pure black (#000).

## Typography

**Display Font:** Archivo (with Plateia, Arial Narrow, Helvetica Neue, Arial fallbacks)
**Body Font:** Inter (with Bliss Pro, Helvetica Neue, Helvetica, Arial fallbacks)

**Character:** The pairing combines Archivo's condensed, industrial strength with Inter's neutral clarity. Archivo's tight letter-spacing and geometric forms convey technical precision, while Inter's humanist proportions ensure readability in long-form content. Both are self-hosted variable fonts (single woff2 per family) for optimal performance.

### Hierarchy
- **Display** (900 weight, clamp(2rem, 5vw, 3rem), line-height 1.15, letter-spacing -0.02em): Hero headlines only. Used once per page, max 20 characters. Balances automatically with `text-wrap: balance`.
- **Headline** (800 weight, clamp(1.75rem, 3vw, 2.25rem), line-height 1.15): Section titles and page headers. Appears 2-4 times per page.
- **Title** (700 weight, clamp(1.375rem, 2.2vw, 1.75rem), line-height 1.15): Card titles, sub-sections, and component headers.
- **Body** (400 weight, clamp(1rem, 0.4vw + 0.95rem, 1.125rem), line-height 1.6): Paragraphs, descriptions, and form labels. Max line length 65-75ch.
- **Label** (700 weight, 0.8rem, letter-spacing 0.16em, uppercase): Eyebrows, form labels, navigation items, and metadata. The uppercase treatment creates visual rhythm and hierarchy.

### Named Rules
**The Eyebrow Rule.** Every section introduction uses the eyebrow pattern: uppercase text (0.8rem, 700 weight, 0.16em letter-spacing) with a 42px decorative line to the left. The line uses `currentColor` to inherit the eyebrow's color (typically brand-light on dark, brand on light).

**The Balance Rule.** Display and headline text uses `text-wrap: balance` to prevent orphaned words. Never disable this for aesthetic reasons.

## Layout

The system uses a max-width container (1360px) with responsive padding (1rem mobile → 2rem desktop). The grid is fluid with CSS Grid and Flexbox, using `clamp()` for responsive spacing without explicit breakpoints where possible.

**Container:** `max-width: 1360px`, centered with `margin-inline: auto`, padding `var(--container-padding)` (1rem → 1.5rem → 2rem at breakpoints).

**Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px). Most components use fluid `clamp()` values and only break at lg (1024px) for major layout shifts.

**Spacing rhythm:** 4px base scale (0.25rem, 0.5rem, 0.75rem, 1rem, 1.25rem, 1.5rem, 2rem, 2.5rem, 3rem, 4rem, 5rem, 6rem, 7.5rem). Section padding uses `clamp(56px, 8vw, 100px)` for vertical rhythm.

**Grid patterns:**
- Service cards: 4 columns (lg) → 2 columns (md) → 1 column (mobile)
- Stats: 4 columns (lg) → 2 columns (mobile)
- Footer: 1.5fr + 3 × 1fr (lg) → 2 columns (md) → 1 column (mobile)

## Elevation & Depth

The system uses a hybrid approach: subtle shadows for cards on light backgrounds, tonal layering (graphite → graphite-2 → graphite-3) for dark sections, and backdrop-filter blur for glassmorphic overlays.

### Shadow Vocabulary
- **Shadow SM** (`0 1px 2px rgba(36, 38, 39, 0.06)`): Subtle lift for inputs and small elements.
- **Shadow MD** (`0 4px 12px rgba(36, 38, 39, 0.08)`): Default card shadow on light backgrounds.
- **Shadow LG** (`0 8px 24px rgba(36, 38, 39, 0.12)`): Hover state for cards and elevated elements.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, focus, active). Never use shadows on dark backgrounds — use tonal layering instead.

**The Blur Rule.** Backdrop-filter blur (12px) is used for glassmorphic overlays on hero images (search panels, CTAs). Always pair with a semi-transparent background (`rgba(13, 22, 17, 0.6)`) and a subtle border (`1px solid rgba(255, 255, 255, 0.08)`).

## Shapes

The system uses rounded corners consistently: `0.5rem` (8px) for inputs and small elements, `0.75rem` (12px) for cards, `0.875rem` (14px) for service cards, `1rem` (16px) for search panels, `1.25rem` (20px) for large containers, and `999px` (pill) for buttons and tags.

**Corner strategy:** All corners are rounded. No sharp edges. The pill radius (999px) for buttons creates a modern, approachable feel that contrasts with the industrial typography.

**Border strategy:** 1px solid borders use `var(--theme-border)` (rgba(255, 255, 255, 0.1) on dark, var(--color-line) on light). Borders are subtle — they define edges without creating visual weight.

**Clipping:** No clipping or masking. Images use `object-fit: cover` with explicit aspect ratios (16:10 for service cards, 1:1 for team photos).

## Components

### Buttons
- **Shape:** Pill radius (999px). The rounded ends create a modern, approachable feel.
- **Primary:** Brand green (#308f40) background, white (#ffffff) text. Padding 14px 26px (md) or 17px 32px (lg). Font: Archivo 700 weight, 0.98rem.
- **Hover / Focus:** Hover lifts -2px with darker green (#226f31). Focus shows 2px brand green outline with 3px offset. Active state translates +1px with scale(0.99) for tactile feedback.
- **Ghost:** Transparent background, ink text (#242627), 1.5px border. Hover darkens border to ink color.
- **Ghost on Dark:** Transparent background, on-dark text (#f3f7f4), border uses line-dark (rgba(255, 255, 255, 0.1)). Hover adds subtle white background (rgba(255, 255, 255, 0.06)).
- **Disabled:** 0.55 opacity, no pointer events, no transform on hover.

### Cards
- **Corner Style:** 14px radius for service cards, 16px for search panels and forms.
- **Background:** Theme-aware. Light theme uses surface (#ffffff) or surface-alt (#f5f5f5). Dark theme uses graphite-3 (#1e2a23) for elevated surfaces.
- **Shadow Strategy:** Light theme uses shadow-md at rest, shadow-lg on hover. Dark theme uses tonal layering (graphite-3 on graphite-2) with subtle border.
- **Border:** 1px solid var(--theme-border). On hover, border-color transitions to brand green.
- **Internal Padding:** 18px 20px 20px for service cards, 32px for forms and search panels.
- **Hover:** translateY(-4px) with shadow-lg. Image inside scales 1.05 with 0.5s ease transition.

### Inputs
- **Style:** 1px solid border (var(--theme-border)), surface background, 0.5rem radius. Padding 0.625rem 0.75rem.
- **Focus:** 2px brand green outline with 2px offset. Border-color transitions to brand green.
- **Error:** Border-color changes to danger (#c0392b). Background uses color-mix(danger 4%, transparent). Error message appears below input in danger color, 0.875rem, 600 weight.
- **Disabled:** 0.6 opacity, not-allowed cursor.

### Navigation
- **Style:** Horizontal list (desktop) or slide-in dialog (mobile). Desktop links use Archivo 500 weight, 0.875rem → 0.9375rem at xl breakpoint.
- **Default state:** On-dark text (rgba(255, 255, 255, 0.92)) on dark header, ink text on light header.
- **Hover / Active:** Text color transitions to on-dark (#f3f7f4), border-bottom 2px solid on-dark appears.
- **Mobile treatment:** Full-height dialog (100vh) sliding from right. White background, ink text. Close button in header. Submenus indented with left padding.
- **Submenu:** Absolute positioned, 220px min-width, graphite background with backdrop-filter blur(14px) saturate(140%). Border 1px solid rgba(255, 255, 255, 0.08), 0.75rem radius. Fade-in with translateY(-4px) → 0 transition.

### Eyebrow
- **Style:** Uppercase text (0.8rem, 700 weight, 0.16em letter-spacing) with 42px decorative line to the left.
- **Color:** var(--theme-eyebrow) — brand-light (#62bb74) on dark, brand (#308f40) on light.
- **Line:** 2px height, currentColor (inherits eyebrow color). 12px gap between line and text.
- **Alignment:** Left by default, center or right variants available.

### Stats Counter
- **Style:** Horizontal flex layout with 4 items max. Each item has a large number (clamp(2.2rem, 4.4vw, 3.6rem), 900 weight) and a label (0.9rem, muted color).
- **Prefix / Suffix:** Brand-light color (#62bb74), slightly smaller than the number (clamp(1.5rem, 2.8vw, 2.2rem)).
- **Background:** Theme-aware. Dark variant uses graphite, light variant uses surface-alt.
- **Animation:** Numbers count up from 0 to target over 1.5s with cubic easing. Triggered by IntersectionObserver at 50% visibility. Respects prefers-reduced-motion.

## Do's and Don'ts

### Do:
- **Do** use the eyebrow pattern (uppercase + decorative line) to introduce every section. It creates visual rhythm and hierarchy.
- **Do** use brand green (#308f40) sparingly — only for primary CTAs, active states, and interactive highlights. Its rarity creates visual hierarchy.
- **Do** use graphite surfaces (#0d1611, #15201a, #1e2a23) in sequence for dark sections. The tonal progression creates depth without hard borders.
- **Do** use backdrop-filter blur (12px) with semi-transparent backgrounds for glassmorphic overlays on hero images.
- **Do** use pill radius (999px) for buttons and tags. The rounded ends create a modern, approachable feel.
- **Do** use `text-wrap: balance` for display and headline text to prevent orphaned words.
- **Do** use translateY(-2px to -4px) for hover lift on cards and buttons. The subtle animation provides tactile feedback.
- **Do** use semantic tokens (var(--theme-*)) for theme-aware colors. Never hardcode colors in components.

### Don't:
- **Don't** use brand green on more than 10% of any given surface. When everything is green, nothing is.
- **Don't** mix graphite with pure black (#000). The graphite palette has its own depth — pure black breaks the harmony.
- **Don't** use shadows on dark backgrounds. Use tonal layering (graphite → graphite-2 → graphite-3) instead.
- **Don't** disable `text-wrap: balance` for display and headline text. Orphaned words break the visual rhythm.
- **Don't** use sharp corners (0px radius). The system is consistently rounded — sharp edges break the pattern.
- **Don't** use backdrop-filter without a semi-transparent background. The blur effect requires a color base to work.
- **Don't** use will-change permanently on any element. It's a performance hint for known animations, not a baseline requirement.
- **Don't** hardcode rgba(255, 255, 255, *) values for text on dark backgrounds. Use semantic tokens (var(--theme-text), var(--theme-text-muted)) for theme consistency.
