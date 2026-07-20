# Spec 06 — Sistema de noticias (estático → WP API ready)

**Fase:** 5
**Estado:** ⬜ Pendiente
**Archivos a crear:**
- `src/data/news.ts`
- `src/lib/news.ts` (helpers: `getBySlug`, `getLatest`, `getRelated`)
- `src/lib/wordpress.ts` (stub con la firma futura del cliente WP)
- `public/fonts/news-body.woff2` (Lora o Source Serif 4, peso regular)
- `public/fonts/news-body-italic.woff2` (opcional)

**Archivos a modificar:**
- `src/components/ui/NewsGrid.astro`
- `src/pages/noticias/index.astro`
- `src/pages/noticias/[post].astro`
- `src/styles/base.css` (declarar la nueva font-family `--font-news-body`)
- `src/layouts/BaseLayout.astro` (preload de la nueva fuente en `<head>`)

**Depende de:** Spec 01 (la data de contacto del footer viene de `site.ts`).
**Bloquea a:** ninguna.

---

## Objetivo

1. **Refactor del componente `NewsGrid`** con accesibilidad (roles ARIA, focus visible, semántica, link unificado en la card).
2. **Página `/noticias/index.astro`** como hub real: hero corto, grid 3 cols desktop, 2 tablet, 1 mobile.
3. **Página `/noticias/[post].astro`** como layout de lectura optimizado para SEO: schema `NewsArticle` completo, Open Graph con imagen, ancho de lectura 65-72ch, tipografía distinta del resto del sitio.
4. **Fuente distinta para el cuerpo de artículos**: serif (Lora o Source Serif 4) servida localmente.
5. **Data estática por ahora** (`src/data/news.ts`), con tipos que mapean 1:1 a los campos esperados del futuro endpoint WP (`/wp-json/wp/v2/posts`). Migración futura sin cambios de tipo.

## Selección de fuente para noticias

| Opción | Pros | Contras | Recomendación |
|---|---|---|---|
| **Lora** | Muy popular para lectura en pantalla; soporte completo español; 4 pesos | Menos "moderna" | ⭐ Sí |
| Source Serif 4 | Adobe, súper legible; soporte completo | Archivo más grande | Alternativa |
| Merriweather | Clásica para blogs | Aspecto anticuado | No |
| System Georgia | Sin descarga, nativa | Inconsistencia entre OS | No |

**Decisión: Lora** (woff2 self-hosted, peso 400 + 400 italic, ~80 KB total).

```html
<link rel="preload" href="/fonts/news-body.woff2" as="font" type="font/woff2" crossorigin />
```

## Archivo nuevo: `src/data/news.ts`

```ts
// src/data/news.ts
// Contenido de noticias.
// La estructura de tipos coincide 1:1 con el endpoint WP REST:
// GET /wp-json/wp/v2/posts?_embed=1
// Cada campo tiene el nombre que entrega WP (con . para nested).

export interface NewsArticle {
  id: number;
  date: string;                       // ISO 8601
  date_gmt: string;
  slug: string;
  status: 'publish' | 'draft' | 'private';
  link: string;                       // URL canónica (relativa o absoluta)
  title: { rendered: string };        // HTML
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];

  // Campos derivados de _embedded (WP REST API v2)
  _embedded?: {
    author: Array<{ name: string; slug: string }>;
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details: { width: number; height: number };
    }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    date: '2025-08-21T15:00:00',
    date_gmt: '2025-08-21T18:00:00',
    slug: 'ingenieria-que-se-eleva-asi-se-ejecutan-los-izajes-mas-seguros-del-sector',
    status: 'publish',
    link: '/noticias/ingenieria-que-se-eleva-asi-se-ejecutan-los-izajes-mas-seguros-del-sector',
    title: {
      rendered: 'Ingeniería que se eleva: así se ejecutan los izajes más seguros del sector',
    },
    content: {
      rendered: `
<p>Cuando se trata de izajes de alto tonelaje, cada decisión cuenta. En IP Proyectos Industriales entendemos que la ingeniería no es solo dibujar planos: es anticipar riesgos, validar capacidades y diseñar planes que protejan a las personas y al equipo.</p>
<h2>El plan de izaje, antes de la faena</h2>
<p>Antes de mover una sola grúa, nuestro equipo técnico desarrolla un <strong>plan de izaje detallado</strong> que considera el peso real de la carga, la altura de trabajo, las condiciones de viento y la capacidad portante del terreno. Este documento es la base de toda la operación.</p>
<h2>Operadores certificados, equipos verificados</h2>
<p>Cada maniobra es ejecutada por operadores con certificación vigente y nuestros equipos cuentan con mantenimiento preventivo al día. La seguridad no es un costo, es una inversión.</p>
      `,
      protected: false,
    },
    excerpt: {
      rendered:
        '<p>En faenas donde el riesgo es alto, la diferencia entre un izaje exitoso y un accidente está en la ingeniería que lo precede. Conoce cómo abordamos cada proyecto.</p>',
      protected: false,
    },
    author: 1,
    featured_media: 100,
    categories: [1],
    tags: [1, 2],
    _embedded: {
      author: [{ name: 'IP Proyectos Industriales', slug: 'ip-proyectos' }],
      'wp:featuredmedia': [
        {
          source_url:
            'https://ipproyectosindustriales.cl/wp-content/uploads/2025/08/Noticia-3-1080x675.png',
          alt_text: 'Izaje de alto tonelaje en faena minera',
          media_details: { width: 1080, height: 675 },
        },
      ],
      'wp:term': [[{ id: 1, name: 'Operaciones', slug: 'operaciones' }]],
    },
  },
  {
    id: 2,
    date: '2025-08-21T14:00:00',
    date_gmt: '2025-08-21T17:00:00',
    slug: 'dominando-las-alturas-la-precision-detras-de-cada-izaje',
    status: 'publish',
    link: '/noticias/dominando-las-alturas-la-precision-detras-de-cada-izaje',
    title: { rendered: 'Dominando las alturas: la precisión detrás de cada izaje' },
    content: {
      rendered: '<p>La precisión es el alma de cada izaje. En este artículo revisamos los protocolos que aplicamos para garantizar movimientos milimétricos en faenas complejas.</p>',
      protected: false,
    },
    excerpt: {
      rendered: '<p>Los izajes de precisión requieren planificación, equipos calibrados y operadores con experiencia. Te contamos cómo lo hacemos.</p>',
      protected: false,
    },
    author: 1,
    featured_media: 101,
    categories: [1],
    tags: [1],
    _embedded: {
      author: [{ name: 'IP Proyectos Industriales', slug: 'ip-proyectos' }],
      'wp:featuredmedia': [
        {
          source_url:
            'https://ipproyectosindustriales.cl/wp-content/uploads/2025/08/Noticia-2-1080x675.png',
          alt_text: 'Precisión en izaje',
          media_details: { width: 1080, height: 675 },
        },
      ],
      'wp:term': [[{ id: 1, name: 'Operaciones', slug: 'operaciones' }]],
    },
  },
  {
    id: 3,
    date: '2025-08-21T13:00:00',
    date_gmt: '2025-08-21T16:00:00',
    slug: 'una-flota-que-crece-ip-proyectos-industriales-apuesta-por-mayor-alcance-y-potencia',
    status: 'publish',
    link: '/noticias/una-flota-que-crece-ip-proyectos-industriales-apuesta-por-mayor-alcance-y-potencia',
    title: {
      rendered:
        'Una flota que crece: apostamos por mayor alcance y potencia',
    },
    content: {
      rendered:
        '<p>Ampliamos nuestra flota con nuevos equipos para responder a la creciente demanda del sector minero. Conoce los detalles de esta inversión.</p>',
      protected: false,
    },
    excerpt: {
      rendered:
        '<p>Nuevas adquisiciones que refuerzan nuestra capacidad de respuesta en zona norte y centro de Chile.</p>',
      protected: false,
    },
    author: 1,
    featured_media: 102,
    categories: [2],
    tags: [3],
    _embedded: {
      author: [{ name: 'IP Proyectos Industriales', slug: 'ip-proyectos' }],
      'wp:featuredmedia': [
        {
          source_url:
            'https://ipproyectosindustriales.cl/wp-content/uploads/2025/08/Noticia-1-IP-1080x675.png',
          alt_text: 'Nueva flota IP',
          media_details: { width: 1080, height: 675 },
        },
      ],
      'wp:term': [[{ id: 2, name: 'Empresa', slug: 'empresa' }]],
    },
  },
];
```

## Archivo nuevo: `src/lib/news.ts`

```ts
// src/lib/news.ts
// Helpers para consumir noticias.
// Hoy lee de data estática; mañana lee del endpoint WP con la misma firma.

import { newsArticles, type NewsArticle } from '@/data/news';
// import { fetchAllNews, fetchNewsBySlug } from '@/lib/wordpress';

export interface NewsCard {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  imageAlt: string;
  category?: string;
  author?: string;
}

function toCard(article: NewsArticle): NewsCard {
  return {
    slug: article.slug,
    title: article.title.rendered,
    excerpt: article.excerpt.rendered.replace(/<[^>]+>/g, '').trim(),
    date: article.date,
    image: article._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '/og-default.jpg',
    imageAlt: article._embedded?.['wp:featuredmedia']?.[0]?.alt_text ?? article.title.rendered,
    category: article._embedded?.['wp:term']?.[0]?.[0]?.name,
    author: article._embedded?.author?.[0]?.name,
  };
}

export async function getLatestNews(limit = 6): Promise<NewsCard[]> {
  // Mañana: const articles = await fetchAllNews({ perPage: limit });
  const articles = newsArticles;
  return articles
    .filter((a) => a.status === 'publish')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map(toCard);
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  // Mañana: return await fetchNewsBySlug(slug);
  return newsArticles.find((a) => a.slug === slug) ?? null;
}

export async function getRelatedNews(slug: string, limit = 3): Promise<NewsCard[]> {
  const current = await getNewsBySlug(slug);
  if (!current) return [];
  const articles = newsArticles.filter(
    (a) => a.slug !== slug && a.status === 'publish'
  );
  return articles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map(toCard);
}
```

## Archivo nuevo: `src/lib/wordpress.ts` (stub)

```ts
// src/lib/wordpress.ts
// Stub del cliente WP REST API.
// La firma está definida para que el swap a datos dinámicos no rompa call-sites.

import type { NewsArticle } from '@/data/news';

const WP_API = import.meta.env.PUBLIC_WP_API ?? 'https://ipproyectosindustriales.cl/wp-json/wp/v2';
// En build time SSG, las llamadas se hacen en getStaticPaths/getStaticProps.
// En dev, podemos hacer fetch real.

export async function fetchAllNews(opts: { perPage?: number } = {}): Promise<NewsArticle[]> {
  // Implementación futura:
  // const res = await fetch(`${WP_API}/posts?_embed=1&per_page=${opts.perPage ?? 10}`);
  // return await res.json();
  throw new Error('WP API not yet implemented. Use src/data/news.ts for now.');
}

export async function fetchNewsBySlug(slug: string): Promise<NewsArticle | null> {
  // const res = await fetch(`${WP_API}/posts?slug=${slug}&_embed=1`);
  // ...
  throw new Error('WP API not yet implemented. Use src/data/news.ts for now.');
}
```

## Cambios en `src/components/ui/NewsGrid.astro`

```astro
---
// src/components/ui/NewsGrid.astro
// Grid de noticias / blog posts.
// Accesibilidad: cada card es un link único, time semántico, alt descriptivo, aria-label.

import type { NewsCard } from '@/lib/news';

export interface Props {
  items: NewsCard[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  variant?: 'light' | 'dark';
  showCategory?: boolean;
  className?: string;
}

const {
  items,
  title,
  subtitle,
  columns = 3,
  variant = 'dark',
  showCategory = true,
  className = '',
} = Astro.props;

const columnsClass = `news-grid--cols-${columns}`;
const variantClass = `news-grid--${variant}`;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
---

<section class:list={['news-grid', variantClass, columnsClass, className]}>
  <div class="news-grid__container">
    {(title || subtitle) && (
      <header class="news-grid__header">
        {title && <h2 class="news-grid__title">{title}</h2>}
        {subtitle && <p class="news-grid__subtitle">{subtitle}</p>}
      </header>
    )}

    <ul class="news-grid__items" role="list">
      {items.map((item) => (
        <li>
          <article class="news-card">
            <a
              href={`/noticias/${item.slug}`}
              class="news-card__link"
              aria-label={`Leer: ${item.title}`}
            >
              <div class="news-card__image">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="500"
                />
              </div>
              <div class="news-card__body">
                {showCategory && item.category && (
                  <span class="news-card__category">{item.category}</span>
                )}
                <h3 class="news-card__title">{item.title}</h3>
                <p class="news-card__excerpt">{item.excerpt}</p>
                <div class="news-card__meta">
                  <time datetime={item.date} class="news-card__date">
                    {formatDate(item.date)}
                  </time>
                  {item.author && <span class="news-card__author">{item.author}</span>}
                </div>
                <span class="news-card__cta" aria-hidden="true">
                  Leer artículo
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 12h14M13 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </a>
          </article>
        </li>
      ))}
    </ul>
  </div>
</section>

<style>
  .news-grid {
    padding-block: clamp(56px, 8vw, 100px);
  }

  .news-grid--light {
    background-color: var(--color-surface, #fff);
  }

  .news-grid--dark {
    background-color: var(--color-surface-alt, #1a1a1a);
  }

  .news-grid__container {
    max-width: 1360px;
    margin-inline: auto;
    padding-inline: var(--container-padding, 20px);
  }

  .news-grid__header {
    text-align: center;
    margin-bottom: clamp(36px, 5vw, 56px);
    max-width: 60ch;
    margin-inline: auto;
  }

  .news-grid__title {
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: clamp(1.8rem, 3.2vw, 2.6rem);
    letter-spacing: -0.02em;
    margin: 0 0 12px;
  }

  .news-grid--light .news-grid__title { color: var(--color-ink, #1a1a1a); }
  .news-grid--dark .news-grid__title { color: #fff; }

  .news-grid__subtitle {
    margin: 0;
    line-height: 1.55;
    color: var(--color-ink-500, #6b7280);
  }

  .news-grid--dark .news-grid__subtitle {
    color: rgba(255, 255, 255, 0.65);
  }

  .news-grid__items {
    display: grid;
    gap: 24px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .news-grid--cols-2 .news-grid__items { grid-template-columns: repeat(2, 1fr); }
  .news-grid--cols-3 .news-grid__items { grid-template-columns: repeat(3, 1fr); }
  .news-grid--cols-4 .news-grid__items { grid-template-columns: repeat(4, 1fr); }

  @media (max-width: 900px) {
    .news-grid--cols-3 .news-grid__items,
    .news-grid--cols-4 .news-grid__items {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .news-grid--cols-2 .news-grid__items,
    .news-grid--cols-3 .news-grid__items,
    .news-grid--cols-4 .news-grid__items {
      grid-template-columns: 1fr;
    }
  }

  /* ── Card ───────────────────────────────────────────────────────── */
  .news-card {
    background: var(--color-surface, #1a1a1a);
    border: 1px solid var(--color-line, rgba(255, 255, 255, 0.1));
    border-radius: 14px;
    overflow: hidden;
    height: 100%;
    transition: transform 0.25s var(--ease-out, ease),
      border-color 0.25s var(--ease-out, ease);
  }

  .news-grid--light .news-card {
    background: var(--color-surface, #fff);
    border-color: var(--color-line, #e5e7eb);
  }

  .news-card:hover {
    transform: translateY(-4px);
    border-color: var(--color-brand, #1a9c4a);
  }

  .news-card__link {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-decoration: none;
    color: inherit;
  }

  .news-card__link:focus-visible {
    outline: 2px solid var(--color-brand, #1a9c4a);
    outline-offset: 4px;
    border-radius: 14px;
  }

  .news-card__image {
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background-color: var(--color-surface-alt, #2a2a2a);
  }

  .news-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s var(--ease-out, ease);
  }

  .news-card:hover .news-card__image img {
    transform: scale(1.05);
  }

  .news-card__body {
    padding: 22px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .news-card__category {
    display: inline-block;
    align-self: flex-start;
    padding: 4px 12px;
    background: var(--color-brand-050, rgba(26, 156, 74, 0.12));
    color: var(--color-brand-300, #4ade80);
    font-family: var(--font-heading);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-radius: 999px;
  }

  .news-grid--light .news-card__category {
    color: var(--color-brand, #1a9c4a);
  }

  .news-card__title {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1.1rem;
    line-height: 1.3;
    margin: 4px 0 0;
  }

  .news-grid--light .news-card__title { color: var(--color-ink, #1a1a1a); }
  .news-grid--dark .news-card__title { color: #fff; }

  .news-card__excerpt {
    margin: 4px 0 0;
    font-size: 0.9rem;
    line-height: 1.55;
    color: var(--color-ink-500, #6b7280);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .news-grid--dark .news-card__excerpt {
    color: rgba(255, 255, 255, 0.65);
  }

  .news-card__meta {
    display: flex;
    gap: 12px;
    align-items: center;
    font-size: 0.78rem;
    color: var(--color-ink-400, rgba(255, 255, 255, 0.5));
    margin-top: 8px;
  }

  .news-card__date {
    font-weight: 600;
  }

  .news-card__author::before {
    content: '·';
    margin-right: 12px;
    color: var(--color-ink-400, rgba(255, 255, 255, 0.3));
  }

  .news-card__cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 12px;
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 0.85rem;
    color: var(--color-brand-300, #4ade80);
  }

  .news-grid--light .news-card__cta {
    color: var(--color-brand, #1a9c4a);
  }

  .news-card__cta svg {
    transition: transform 0.2s var(--ease-out, ease);
  }

  .news-card:hover .news-card__cta svg {
    transform: translateX(4px);
  }
</style>
```

### Cambios clave del componente

1. **Un solo link por card** (no 2 como antes). Todo el contenido está dentro de un `<a>` con `aria-label="Leer: {title}"`.
2. **`<time datetime="...">` semántico** en lugar de `<span>`.
3. **`-webkit-line-clamp: 3`** en el excerpt: limita a 3 líneas con elipsis. Antes el excerpt no se mostraba.
4. **Categoría como chip** con tipografía de display.
5. **CTA explícito "Leer artículo"** con icono de flecha que se mueve en hover.
6. **Imagen con aspect-ratio** reservado → no CLS al cargar.
7. **Hover lift** sutil (4px) + cambio de color del border.

## Cambios en `src/pages/noticias/index.astro`

```astro
---
// src/pages/noticias/index.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/ui/Container.astro';
import NewsGrid from '@/components/ui/NewsGrid.astro';
import { getLatestNews } from '@/lib/news';
import { collectionPageSchema, breadcrumbSchema, combineSchemas } from '@/lib/seo';
import { getSiteUrl } from '@/lib/seo';

const news = await getLatestNews(9);

const title = 'Noticias | IP Proyectos Industriales';
const description =
  'Novedades del sector industrial y minero: operaciones, seguridad, crecimiento de flota y proyectos destacados de IP Proyectos Industriales en Chile.';

const breadcrumbs = [
  { label: 'Inicio', url: '/' },
  { label: 'Noticias', url: '/noticias' },
];

const jsonLd = combineSchemas(
  collectionPageSchema('Noticias', getSiteUrl('/noticias')),
  breadcrumbSchema(breadcrumbs)
);
---

<BaseLayout
  title={title}
  description={description}
  breadcrumbs={breadcrumbs}
  jsonLd={jsonLd}
>
  <section class="news-hero">
    <Container>
      <p class="news-hero__eyebrow">Novedades</p>
      <h1 class="news-hero__title">Novedades del sector industrial y minero</h1>
      <p class="news-hero__subtitle">
        Operaciones, seguridad, crecimiento de nuestra flota y proyectos en faena.
        Síguenos para conocer nuestro trabajo más reciente.
      </p>
    </Container>
  </section>

  <NewsGrid
    items={news}
    columns={3}
    variant="light"
    showCategory={true}
  />
</BaseLayout>

<style>
  .news-hero {
    background-color: var(--color-graphite, #0d1611);
    color: #fff;
    padding-block: clamp(60px, 8vw, 100px);
  }

  .news-hero__eyebrow {
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

  .news-hero__eyebrow::before {
    content: '';
    width: 42px;
    height: 2px;
    background: var(--color-brand, #1a9c4a);
  }

  .news-hero__title {
    font-family: var(--font-heading);
    font-weight: 900;
    font-size: clamp(2.2rem, 5vw, 3.6rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: #fff;
    margin: 0 0 16px;
    max-width: 20ch;
  }

  .news-hero__subtitle {
    font-size: clamp(1rem, 1.4vw, 1.2rem);
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin: 0;
    max-width: 60ch;
  }
</style>
```

## Cambios en `src/pages/noticias/[post].astro`

```astro
---
// src/pages/noticias/[post].astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/ui/Container.astro';
import NewsGrid from '@/components/ui/NewsCard.astro';  // helper para related
import { getNewsBySlug, getRelatedNews } from '@/lib/news';
import { newsArticleSchemaExtended, breadcrumbSchema, combineSchemas } from '@/lib/seo';
import { getSiteUrl } from '@/lib/seo';

export async function getStaticPaths() {
  // Mañana: await fetchAllNews({ perPage: 100 });
  const { newsArticles } = await import('@/data/news');
  return newsArticles.map((article) => ({
    params: { post: article.slug },
    props: { article },
  }));
}

const { article } = Astro.props;
const { post } = Astro.params;

const siteUrl = getSiteUrl(article.link);
const image = article._embedded?.['wp:featuredmedia']?.[0]?.source_url;
const author = article._embedded?.author?.[0]?.name ?? 'IP Proyectos Industriales';
const category = article._embedded?.['wp:term']?.[0]?.[0]?.name;

const title = `${article.title.rendered} | IP Proyectos Industriales`;
const description = article.excerpt.rendered.replace(/<[^>]+>/g, '').trim().slice(0, 160);

const breadcrumbs = [
  { label: 'Inicio', url: '/' },
  { label: 'Noticias', url: '/noticias' },
  { label: article.title.rendered },
];

const jsonLd = combineSchemas(
  newsArticleSchemaExtended({
    headline: article.title.rendered,
    description,
    url: siteUrl,
    image,
    datePublished: article.date,
    dateModified: article.date,
    authorName: author,
    articleSection: category,
  }),
  breadcrumbSchema(breadcrumbs)
);

const related = await getRelatedNews(article.slug, 3);
const dateFormatted = new Date(article.date).toLocaleDateString('es-CL', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<BaseLayout
  title={title}
  description={description}
  breadcrumbs={breadcrumbs}
  jsonLd={jsonLd}
  ogImage={image}
  ogType="article"
>
  <article class="news-article">
    <header class="news-article__header">
      <Container>
        {category && <p class="news-article__category">{category}</p>}
        <h1 class="news-article__title" set:html={article.title.rendered} />
        <div class="news-article__meta">
          <span>Por <strong>{author}</strong></span>
          <time datetime={article.date}>{dateFormatted}</time>
        </div>
      </Container>
    </header>

    {image && (
      <figure class="news-article__hero">
        <img
          src={image}
          alt={article._embedded?.['wp:featuredmedia']?.[0]?.alt_text ?? article.title.rendered}
          loading="eager"
          fetchpriority="high"
          width="1200"
          height="675"
        />
      </figure>
    )}

    <div class="news-article__body">
      <Container>
        <div class="news-article__content" set:html={article.content.rendered} />
      </Container>
    </div>
  </article>

  {related.length > 0 && (
    <NewsGrid
      items={related}
      title="Noticias relacionadas"
      columns={3}
      variant="light"
    />
  )}
</BaseLayout>

<style is:global>
  /* ── Estilos del artículo (solo cuando está dentro de .news-article) ── */
  .news-article__content {
    font-family: var(--font-news-body, 'Lora', Georgia, serif);
    font-size: 1.125rem;
    line-height: 1.75;
    color: var(--color-ink-700, #2d3748);
    max-width: 68ch;
    margin: 0 auto;
  }

  .news-article__content > * + * {
    margin-top: 1.4em;
  }

  .news-article__content h2 {
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: clamp(1.4rem, 2.4vw, 1.8rem);
    letter-spacing: -0.01em;
    line-height: 1.2;
    color: var(--color-ink, #1a1a1a);
    margin-top: 2em;
  }

  .news-article__content h3 {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.3;
    color: var(--color-ink, #1a1a1a);
    margin-top: 1.6em;
  }

  .news-article__content p {
    margin: 0;
  }

  .news-article__content a {
    color: var(--color-brand, #1a9c4a);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .news-article__content blockquote {
    border-left: 4px solid var(--color-brand, #1a9c4a);
    padding: 0.4em 0 0.4em 1.4em;
    font-style: italic;
    color: var(--color-ink-500, #6b7280);
  }

  .news-article__content ul,
  .news-article__content ol {
    padding-left: 1.6em;
  }

  .news-article__content ul li {
    list-style: disc;
  }

  .news-article__content ol li {
    list-style: decimal;
  }

  .news-article__content img {
    border-radius: 8px;
    margin-block: 2em;
  }

  .news-article__content code {
    font-family: 'Menlo', 'Monaco', monospace;
    font-size: 0.9em;
    background: var(--color-surface-alt, #f7f9f7);
    padding: 0.15em 0.4em;
    border-radius: 4px;
  }
</style>

<style>
  .news-article__header {
    background-color: var(--color-graphite, #0d1611);
    color: #fff;
    padding-block: clamp(60px, 8vw, 100px) clamp(40px, 6vw, 60px);
  }

  .news-article__category {
    display: inline-block;
    padding: 4px 12px;
    background: var(--color-brand-050, rgba(26, 156, 74, 0.15));
    color: var(--color-brand-300, #4ade80);
    font-family: var(--font-heading);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-radius: 999px;
    margin-bottom: 16px;
  }

  .news-article__title {
    font-family: var(--font-heading);
    font-weight: 900;
    font-size: clamp(2rem, 4.5vw, 3.4rem);
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: #fff;
    margin: 0 0 24px;
    max-width: 22ch;
    text-wrap: balance;
  }

  .news-article__meta {
    display: flex;
    gap: 24px;
    align-items: center;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .news-article__meta time {
    color: rgba(255, 255, 255, 0.85);
  }

  .news-article__hero {
    margin: 0;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background-color: var(--color-surface-alt, #2a2a2a);
  }

  .news-article__hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .news-article__body {
    padding-block: clamp(60px, 8vw, 100px);
  }
</style>
```

## Cambios en `src/styles/base.css`

```diff
 :root {
+  --font-news-body: 'Lora', Georgia, 'Times New Roman', serif;
 }

 @font-face {
   font-family: 'Lora';
   src: url('/fonts/news-body.woff2') format('woff2');
   font-weight: 400;
   font-style: normal;
   font-display: swap;
 }
```

## Cambios en `src/layouts/BaseLayout.astro`

```diff
   <!-- Preload de fuentes críticas (self-hosted) -->
   <link rel="preload" href="/fonts/plateia-bold.woff2" as="font" type="font/woff2" crossorigin />
   <link rel="preload" href="/fonts/blisspro-regular.woff2" as="font" type="font/woff2" crossorigin />
+  <link rel="preload" href="/fonts/news-body.woff2" as="font" type="font/woff2" crossorigin />
```

## Decisiones de diseño

1. **Lora por su calidez y legibilidad en pantalla**, no Merriweather (anticuada) ni system fonts (inconsistentes).

2. **El cuerpo del artículo usa serif; los headings del artículo usan la display font (Plateia)**. Esto crea jerarquía visual sin sacrificar lectura.

3. **El grid de cards de noticias usa `--font-body` (sans)**, no serif. La card es UI, el cuerpo del artículo es lectura.

4. **Schema `NewsArticle` extendido** (`newsArticleSchemaExtended`): debe existir en `src/lib/seo.ts`. Si no existe, se crea en este spec (no se documenta aquí por brevedad; ver Tareas).

5. **Data estática ahora, swap a WP API después**: el helper `getLatestNews` en `src/lib/news.ts` es la única API. Cuando se implemente `fetchAllNews` en `src/lib/wordpress.ts`, se cambia el cuerpo de la función y nada más.

6. **Ancho de lectura 68ch**: óptimo para lectura larga. No más ancho (cansancio ocular) ni más estrecho (salto de línea constante).

7. **Imagen hero con `aspect-ratio: 16/9` reservado**: previene CLS.

8. **`<time datetime="ISO8601">`**: semántico y machine-readable.

## Tareas

- [ ] Crear `src/data/news.ts` con 3 artículos seed.
- [ ] Crear `src/lib/news.ts` con `getLatestNews`, `getNewsBySlug`, `getRelatedNews`.
- [ ] Crear `src/lib/wordpress.ts` (stub).
- [ ] Descargar `Lora Regular 400` (woff2) desde Google Fonts y guardar en `public/fonts/news-body.woff2`.
- [ ] Añadir `@font-face` para Lora en `src/styles/base.css`.
- [ ] Añadir `preload` de Lora en `BaseLayout.astro`.
- [ ] Crear `newsArticleSchemaExtended` en `src/lib/seo.ts` si no existe.
- [ ] Reemplazar `NewsGrid.astro` con la nueva versión (a11y, link único, excerpt, time, cta).
- [ ] Reemplazar `noticias/index.astro` con la nueva versión.
- [ ] Reemplazar `noticias/[post].astro` con el layout de lectura.
- [ ] Verificar en `npm run build` que las 3 rutas de noticias se generan.
- [ ] Validar JSON-LD con https://validator.schema.org/

## Definition of Done

- [ ] `src/data/news.ts` existe y tiene 3 artículos.
- [ ] `src/lib/news.ts` existe con 3 helpers.
- [ ] El componente `NewsGrid` tiene un único link por card, `<time>` semántico, excerpt clamp a 3 líneas.
- [ ] `/noticias` renderiza un grid 3x1 con los artículos.
- [ ] `/noticias/{slug}` renderiza un layout de lectura con tipografía serif en el body.
- [ ] El schema `NewsArticle` está completo (headline, image, datePublished, author).
- [ ] La fuente Lora se carga localmente (sin dependencia de Google Fonts).
- [ ] Open Graph `og:type="article"` se emite en la página de detalle.
- [ ] `aria-label` descriptivo en cada link de card.
- [ ] `npm run build` no genera warnings.
- [ ] Lighthouse SEO ≥ 95 en `/noticias/[post]`.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Lora no carga en el primer paint (FOIT) | `font-display: swap` + preload. Texto cae a Georgia (serif system) que es legible |
| El contenido HTML de WP tiene estilos inline que rompen el layout | Sanitizar con `set:html` solo si viene de fuente confiable (WP propio). No aplicar styles de WP en el container |
| La imagen hero del WP es pequeña (1080x675) | Usar `loading="eager"` + `fetchpriority="high"` para priorizar; verificar con DevTools que no hay CLS |
| `newsArticleSchemaExtended` no existe en `seo.ts` | Crearlo en este spec; si no, fallar el build con mensaje claro |
| `getStaticPaths` solo conoce los 3 seed | Cuando se conecte WP, el helper `fetchAllNews` reemplaza al import estático. Misma firma |
| WordPress REST `_embedded` puede no estar habilitado | Documentar en `AGENTS.md` que se debe agregar `?_embed=1` a las llamadas. El stub asume que viene |
