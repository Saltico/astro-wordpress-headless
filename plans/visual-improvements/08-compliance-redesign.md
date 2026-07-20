# Spec 08 — /compliance rediseño (foco en documentos)

**Fase:** 6
**Estado:** ⬜ Pendiente
**Archivos a crear:**
- `src/data/compliance.ts`

**Archivos a modificar:**
- `src/pages/compliance/index.astro`

**Archivos a eliminar:**
- `src/pages/compliance/[tema].astro`

**Archivos a tocar en `.htaccess`:**
- `public/.htaccess` (agregar redirect 301 para `/compliance/hseq` y `/compliance/certificaciones` → `/compliance`)

**Depende de:** Spec 01 (la data del footer se centraliza en `site.ts`).
**Bloquea a:** ninguna.

---

## Objetivo

1. Redefinir `/compliance` como un **hub de documentos descargables** (PDFs) con cards de presentación, en línea con el ejemplo `https://cute-banoffee-cf39a5.netlify.app/compliance`.
2. Eliminar la sub-página `/compliance/[tema].astro` ya que los documentos se descargan directo desde la index.
3. Agregar redirects 301 en `.htaccess` para que `/compliance/hseq` y `/compliance/certificaciones` no devuelvan 404 si hay backlinks externos.
4. Centralizar la lista de documentos en `src/data/compliance.ts` para que sea fácil de mantener.

## Estado actual

`src/pages/compliance/index.astro` (47 líneas): placeholder con un párrafo y una lista de 2 links.

`src/pages/compliance/[tema].astro` (49 líneas): placeholder con `getStaticPaths` que retorna `hseq` y `certificaciones`.

Ambos son páginas sin diseño, sin CTAs, sin documentos reales.

## Archivo nuevo: `src/data/compliance.ts`

```ts
// src/data/compliance.ts
// Lista de documentos de compliance y HSEQ descargables.
// Cada documento tiene metadata para presentación y para SEO.

export interface ComplianceDoc {
  slug: string;
  title: string;
  description: string;
  pdfUrl: string;
  version?: string;
  updatedAt?: string;          // ISO date
  sizeBytes?: number;
  category: 'compliance' | 'ethics' | 'commercial' | 'policy';
}

export const complianceDocs: ComplianceDoc[] = [
  {
    slug: 'modelo-prevencion-delito',
    title: 'Modelo de Prevención del Delito',
    description:
      'Sistema de prevención conforme a la Ley N° 20.393, con controles y responsabilidades para prevenir delitos en la organización.',
    pdfUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2025/XX/mpd-ipp.pdf',
    version: 'v2.1',
    updatedAt: '2025-08-01',
    sizeBytes: 245_000,
    category: 'compliance',
  },
  {
    slug: 'anexo-proveedores',
    title: 'Anexo de Proveedores',
    description:
      'Cláusulas y compromisos de cumplimiento ético y legal que aceptan nuestros proveedores y colaboradores.',
    pdfUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2025/XX/anexo-proveedores.pdf',
    version: 'v1.4',
    updatedAt: '2025-06-15',
    sizeBytes: 180_000,
    category: 'compliance',
  },
  {
    slug: 'codigo-de-etica',
    title: 'Código de Ética',
    description:
      'Principios, valores y conductas que guían el actuar de todo el equipo de IP Proyectos Industriales.',
    pdfUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2025/XX/codigo-etica.pdf',
    version: 'v3.0',
    updatedAt: '2025-05-20',
    sizeBytes: 320_000,
    category: 'ethics',
  },
  {
    slug: 'ordenes-de-compra',
    title: 'Órdenes de compra',
    description:
      'Términos y condiciones generales que rigen nuestras órdenes de compra con proveedores.',
    pdfUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2025/XX/oc-terminos.pdf',
    version: 'v1.2',
    updatedAt: '2025-04-10',
    sizeBytes: 195_000,
    category: 'commercial',
  },
  {
    slug: 'politica-donaciones',
    title: 'Política de Donaciones',
    description:
      'Marco y criterios para los aportes y donaciones que realiza la empresa, con transparencia y trazabilidad.',
    pdfUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2025/XX/politica-donaciones.pdf',
    version: 'v1.0',
    updatedAt: '2025-03-05',
    sizeBytes: 165_000,
    category: 'policy',
  },
  {
    slug: 'politica-pro-pyme',
    title: 'Política Pro Pyme de pagos',
    description:
      'Nuestro compromiso de pago oportuno a proveedores Pyme, adhiriendo a las buenas prácticas de pago.',
    pdfUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2025/XX/pro-pyme.pdf',
    version: 'v1.0',
    updatedAt: '2025-02-15',
    sizeBytes: 142_000,
    category: 'policy',
  },
];

export function formatSize(bytes: number | undefined): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
```

> **Nota:** los `pdfUrl` son placeholders. Reemplazar con las URLs reales del CDN en `ipproyectosindustriales.cl/wp-content/uploads/2025/...`. Confirmar con el cliente antes del deploy.

## Cambios en `src/pages/compliance/index.astro`

```astro
---
// src/pages/compliance/index.astro
// Hub de documentos de Compliance y HSEQ.
// Los documentos se descargan directo como PDF; no hay sub-páginas por tema.

import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/ui/Container.astro';
import Icon from '@/components/ui/Icon.astro';
import { complianceDocs, formatSize } from '@/data/compliance';
import { articleSchema, breadcrumbSchema, combineSchemas } from '@/lib/seo';
import { getSiteUrl } from '@/lib/seo';

const title = 'Compliance y HSEQ | IP Proyectos Industriales';
const description =
  'Compromiso con la integridad y la transparencia. Descarga nuestros documentos de compliance, código de ética, política de donaciones y modelo de prevención del delito.';

const breadcrumbs = [
  { label: 'Inicio', url: '/' },
  { label: 'Compliance' },
];

const jsonLd = combineSchemas(
  articleSchema('Compliance y HSEQ', description, getSiteUrl('/compliance')),
  breadcrumbSchema(breadcrumbs)
);

function formatDate(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
  });
}
---

<BaseLayout
  title={title}
  description={description}
  breadcrumbs={breadcrumbs}
  jsonLd={jsonLd}
>
  <!-- Hero -->
  <section class="compliance-hero">
    <Container>
      <p class="compliance-hero__eyebrow">Compliance</p>
      <h1 class="compliance-hero__title">Compromiso con la integridad y la transparencia</h1>
      <p class="compliance-hero__subtitle">
        Operamos bajo un modelo de cumplimiento conforme a la <strong>Ley N° 20.393</strong>
        sobre responsabilidad penal de las personas jurídicas. Aquí encuentras nuestras políticas
        y documentos vigentes.
      </p>
    </Container>
  </section>

  <!-- Documentos -->
  <section class="compliance-docs">
    <Container>
      <header class="compliance-docs__header">
        <h2 class="compliance-docs__title">Documentos</h2>
        <p class="compliance-docs__subtitle">
          Descarga nuestros documentos vigentes. Para versiones oficiales o consultas,
          escríbenos a <a href="mailto:contacto@ipproyectosindustriales.cl">contacto@ipproyectosindustriales.cl</a>.
        </p>
      </header>

      <ul class="compliance-docs__grid" role="list">
        {complianceDocs.map((doc) => (
          <li>
            <article class="doc-card">
              <div class="doc-card__icon" aria-hidden="true">
                <Icon name="file-text" size={28} />
              </div>
              <div class="doc-card__body">
                <h3 class="doc-card__title">{doc.title}</h3>
                <p class="doc-card__description">{doc.description}</p>
                <div class="doc-card__meta">
                  {doc.version && <span class="doc-card__version">{doc.version}</span>}
                  {doc.updatedAt && <span class="doc-card__date">{formatDate(doc.updatedAt)}</span>}
                  {doc.sizeBytes && <span class="doc-card__size">{formatSize(doc.sizeBytes)}</span>}
                </div>
                <a
                  href={doc.pdfUrl}
                  class="doc-card__download"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  aria-label={`Descargar ${doc.title} en PDF`}
                >
                  <Icon name="download" size={16} />
                  Descargar PDF
                </a>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <!-- CTA canal de denuncias -->
      <aside class="compliance-cta">
        <p>¿Necesitas reportar una conducta?</p>
        <a href="/canal-integridad" class="compliance-cta__link">
          Usa nuestro canal de denuncias
          <Icon name="arrow-right" size={16} />
        </a>
      </aside>
    </Container>
  </section>
</BaseLayout>

<style>
  /* Hero */
  .compliance-hero {
    background-color: var(--color-graphite, #0d1611);
    color: #fff;
    padding-block: clamp(60px, 8vw, 100px);
  }

  .compliance-hero__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: var(--color-brand-300, #4ade80);
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0 0 16px;
  }

  .compliance-hero__eyebrow::before {
    content: '';
    width: 42px;
    height: 2px;
    background: var(--color-brand, #1a9c4a);
  }

  .compliance-hero__title {
    font-family: var(--font-heading);
    font-weight: 900;
    font-size: clamp(2.2rem, 5vw, 3.6rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: #fff;
    margin: 0 0 16px;
    max-width: 22ch;
  }

  .compliance-hero__subtitle {
    font-size: clamp(1rem, 1.4vw, 1.2rem);
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin: 0;
    max-width: 65ch;
  }

  .compliance-hero__subtitle a {
    color: var(--color-brand-300, #4ade80);
    text-decoration: underline;
  }

  /* Documentos */
  .compliance-docs {
    padding-block: clamp(60px, 8vw, 100px);
    background-color: var(--color-surface, #fff);
  }

  .compliance-docs__header {
    text-align: center;
    max-width: 60ch;
    margin: 0 auto clamp(40px, 5vw, 60px);
  }

  .compliance-docs__title {
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    letter-spacing: -0.02em;
    color: var(--color-ink, #1a1a1a);
    margin: 0 0 12px;
  }

  .compliance-docs__subtitle {
    margin: 0;
    line-height: 1.6;
    color: var(--color-ink-500, #6b7280);
  }

  .compliance-docs__subtitle a {
    color: var(--color-brand, #1a9c4a);
  }

  .compliance-docs__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
    list-style: none;
    padding: 0;
    margin: 0 0 40px;
  }

  .doc-card {
    display: flex;
    gap: 18px;
    background: var(--color-surface, #fff);
    border: 1px solid var(--color-line, #e5e7eb);
    border-radius: 14px;
    padding: 24px;
    transition: transform 0.2s var(--ease-out, ease),
      border-color 0.2s var(--ease-out, ease),
      box-shadow 0.2s var(--ease-out, ease);
  }

  .doc-card:hover {
    transform: translateY(-2px);
    border-color: var(--color-brand, #1a9c4a);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  }

  .doc-card__icon {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--color-brand-050, rgba(26, 156, 74, 0.1));
    color: var(--color-brand, #1a9c4a);
    border-radius: 12px;
  }

  .doc-card__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }

  .doc-card__title {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1.05rem;
    line-height: 1.3;
    color: var(--color-ink, #1a1a1a);
    margin: 0;
  }

  .doc-card__description {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.55;
    color: var(--color-ink-500, #6b7280);
  }

  .doc-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 0.75rem;
    color: var(--color-ink-400, #9ca3af);
    margin-top: 2px;
  }

  .doc-card__version,
  .doc-card__date,
  .doc-card__size {
    padding: 2px 8px;
    background: var(--color-surface-alt, #f7f9f7);
    border-radius: 999px;
    font-weight: 600;
  }

  .doc-card__download {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    padding: 8px 16px;
    background: var(--color-brand, #1a9c4a);
    color: #fff;
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 0.85rem;
    border-radius: 999px;
    text-decoration: none;
    transition: background 0.15s var(--ease-out, ease),
      transform 0.15s var(--ease-out, ease);
  }

  .doc-card__download:hover,
  .doc-card__download:focus-visible {
    background: var(--color-brand-700, #15803d);
    transform: translateY(-1px);
  }

  /* CTA Canal */
  .compliance-cta {
    text-align: center;
    padding: 32px;
    background: var(--color-surface-alt, #f7f9f7);
    border-radius: 14px;
  }

  .compliance-cta p {
    margin: 0 0 12px;
    font-size: 1.05rem;
    color: var(--color-ink, #1a1a1a);
  }

  .compliance-cta__link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-heading);
    font-weight: 700;
    color: var(--color-brand, #1a9c4a);
    text-decoration: none;
  }

  .compliance-cta__link:hover {
    gap: 12px;
  }
</style>
```

## Eliminar `src/pages/compliance/[tema].astro`

Borrar el archivo completo. La página `/compliance/hseq` y `/compliance/certificaciones` ya no existen en el sitio.

## Cambios en `public/.htaccess`

Agregar redirects 301 al inicio del bloque de redirects (después de los de arriendo):

```apache
# Compliance legacy (páginas eliminadas en spec 08)
RedirectMatch 301 ^/compliance/hseq/?$            /compliance
RedirectMatch 301 ^/compliance/certificaciones/?$  /compliance
```

## Decisiones de diseño

1. **Documentos como cards, no como lista de links**: cada documento tiene icono, título, descripción, metadata (versión, fecha, tamaño) y CTA de descarga. Más profesional y mantenible que una lista `<ul>`.

2. **CTAs en el card**: el botón "Descargar PDF" usa `download` attribute + `target="_blank"` para que el navegador descargue directamente o abra en una nueva pestaña según la configuración del usuario.

3. **Eliminación de `[tema].astro`**: justificada porque los documentos son PDFs, no páginas web. Cada PDF es un asset descargable con su propio nombre de archivo. No necesita HTML wrapper.

4. **Redirect 301 para las URLs legacy**: Google transfiere el 100% del link equity con 301. Si hay backlinks externos apuntando a `/compliance/hseq`, el usuario llega a `/compliance` que tiene toda la info.

5. **CTA al canal de denuncias** al final: refuerza el mensaje de transparencia y da una salida al usuario que viene a compliance con una preocupación.

6. **Sin imagen de fondo** en el hero (a diferencia de la home y servicios): el compliance es un tema "serio" y la sobriedad tipográfica es más coherente. Solo fondo graphite sólido.

7. **Schema `Article` con `headline: 'Compliance y HSEQ'`**: cada página de compliance debe tener un schema que la identifique. No es `NewsArticle` (no es noticia), es `Article` con `articleSection: 'Compliance'`.

## Tareas

- [ ] Crear `src/data/compliance.ts` con los 6 documentos.
- [ ] Reemplazar `src/pages/compliance/index.astro` con el nuevo diseño.
- [ ] Eliminar `src/pages/compliance/[tema].astro`.
- [ ] Agregar los 2 redirects 301 en `public/.htaccess`.
- [ ] Confirmar con el cliente las URLs reales de los PDFs (los `pdfUrl` actuales son placeholders).
- [ ] Verificar que el icono `file-text` existe en `src/lib/icons.ts`; si no, añadirlo.
- [ ] Validar el JSON-LD con https://validator.schema.org/

## Definition of Done

- [ ] La página `/compliance` muestra 6 cards de documentos con icono, descripción, metadata y botón de descarga.
- [ ] El CTA "Canal de denuncias" aparece al final de la página.
- [ ] El archivo `src/pages/compliance/[tema].astro` está eliminado.
- [ ] `public/.htaccess` tiene los 2 redirects 301 nuevos.
- [ ] El JSON-LD es válido.
- [ ] Las URLs de los PDFs devuelven 200 (o se reemplazan por las correctas).
- [ ] `npm run build` no genera warnings.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Los PDFs reales no existen (URLs placeholder) | Confirmar con cliente antes de merge; usar 404 explícito en lugar de link roto |
| Eliminar `/compliance/hseq` afecta el SEO de backlinks | El redirect 301 transfiere equity. Verificar backlinks en Search Console antes de merge |
| El icono `file-text` no existe en `Icon.astro` | Agregarlo a `src/lib/icons.ts` con un SVG path estándar de file icon |
| Los PDFs son pesados y el `download` attribute no funciona con cross-origin | `download` solo funciona same-origin. Para cross-origin, abrir en nueva pestaña es la única opción. Documentar en el `aria-label` |
