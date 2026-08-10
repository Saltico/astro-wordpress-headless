# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro 7 + Tailwind CSS v4 + TypeScript. Static site generation (SSG). Self-hosted variable fonts (Archivo, Inter). Deployed on Hostinger.

## Users

**Primary users:** Procurement managers, operations directors, and HSEQ managers at large mining companies (Barrick, CMP, Aura Minerals, Cummins, etc.) in northern Chile (Atacama, Coquimbo, Antofagasta regions). They need heavy equipment rental and industrial services for mining sites.

**Secondary users:** Project engineers and site supervisors evaluating subcontractors for civil works, electromechanical assembly, and port infrastructure.

## Product Purpose

IP Proyectos Industriales is a B2B industrial services company website. It serves two business lines:

1. **Equipment rental** (primary focus): Cranes up to 400 tons, earthmoving, transport, and special equipment for mining and industry. 24/7 availability.
2. **Industrial services** (secondary): Engineering, construction, electromechanical assembly, and port infrastructure.

Success means: generating qualified leads through the quote system (cotizador), WhatsApp, and phone calls. The website must convey reliability, technical capability, and 24/7 operational readiness.

## Positioning

**25+ years of experience in critical infrastructure for large-scale mining.** IP Proyectos Industriales operates in the most demanding mining environments in northern Chile, with a fleet of 100+ owned equipment pieces and capacity up to 400 tons. Unlike generalist rental companies, they combine equipment rental with full-service industrial capabilities (engineering, construction, assembly).

## Operating Context

- **Evaluation environment:** Users browse on desktop at office (procurement decisions) and mobile on-site (urgent equipment needs). The site must work in low-connectivity mining environments.
- **Decision criteria:** Equipment availability, tonnage capacity, geographic coverage, safety certifications, response time.
- **Conversion paths:** Quote form (cotizador), WhatsApp direct line, phone call, email, catalog PDF download.
- **Trust signals:** Client logos (Barrick, CMP, Aura Minerals), years of experience, safety certifications, coverage zones.

## Capabilities and Constraints

### Capabilities
- Equipment search and quote system (cotizador) with cart functionality
- Service pages with detailed technical descriptions
- News/blog section (WordPress headless integration planned)
- Project portfolio with case studies
- Multi-channel contact (WhatsApp, phone, email, form)
- Catalog PDF download
- Dark/light theme toggle (persisted in localStorage)
- SEO: sitemap, JSON-LD schemas, meta tags, breadcrumbs
- Accessibility: WCAG 2.1 AA compliant, skip links, semantic HTML, keyboard navigation

### Constraints
- Static site (no server-side runtime)
- WordPress headless for news content (not yet integrated)
- Self-hosted fonts only (no Google Fonts CDN)
- Must work in low-bandwidth mining environments
- Spanish language only (es-CL locale)
- Canonical domain: ipproyectosindustriales.cl

## Brand Commitments

- **Company name:** IP Proyectos Industriales SpA
- **Tagline:** "Arriendo de maquinaria pesada para la minería"
- **Brand colors:** Green (#308f40) as primary, graphite/dark green (#0d1611) as dark surface
- **Typography:** Archivo (headings, condensed industrial feel), Inter (body, clean readability)
- **Tone:** Professional, technical, reliable. No playful or casual language.
- **Logo:** Self-hosted PNG, inverted to white on dark backgrounds via CSS filter

## Evidence on Hand

- **Client logos:** 12 real client logos (Barrick, CMP, Aura Minerals, Cummins, Famesa, Aguas del Valle, etc.) loaded from WordPress CDN
- **Service images:** Real project photos for engineering, construction, assembly, port infrastructure
- **Hero image:** Real mining equipment photo (arriendo.avif)
- **Team photos:** Placeholder (hero.jpg reused for team members)
- **News articles:** 3 real blog posts about mining operations
- **Project portfolio:** 1 real project case study (izaje estructuras La Serena)
- **Catalog:** Real PDF catalog (IPP-2025.pdf) hosted on WordPress

### Absences (do not fabricate)
- No video content yet
- No real team member photos
- No testimonials or case study details beyond project titles
- No pricing information (all quote-based)

## Product Principles

1. **Availability over aesthetics.** The site must load fast and work reliably in low-connectivity mining environments. Performance and accessibility outrank visual flourishes.
2. **Technical proof, not marketing claims.** Every capability statement must be backed by evidence: equipment specs, project photos, client logos, certifications.
3. **Quote-first conversion.** Every page should make it easy to request a quote. The cotizador, WhatsApp, and phone are the primary conversion paths.
4. **Industrial credibility.** The design must convey heavy industry, mining, and technical capability. No SaaS-style minimalism or startup aesthetics.
5. **Operational readiness.** 24/7 availability, rapid response, and geographic coverage are core differentiators that must be visible above the fold.

## Accessibility & Inclusion

- WCAG 2.1 AA compliance required
- Skip link to main content
- Semantic HTML with proper landmarks (header, nav, main, footer)
- Keyboard navigation support with visible focus indicators
- `prefers-reduced-motion` respected (motion removed, state changes preserved)
- `prefers-color-scheme` supported with anti-FOUC script
- All images have descriptive alt text
- Form inputs have labels, error states, and ARIA attributes
- Contrast ratios meet AA standards (4.5:1 for normal text, 3:1 for large text)
