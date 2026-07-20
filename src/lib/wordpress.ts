// src/lib/wordpress.ts
// Stub del cliente WP REST API.
// La firma está definida para que el swap a datos dinámicos no rompa call-sites.

import type { NewsArticle } from '@/data/news';

const WP_API = import.meta.env.PUBLIC_WP_API ?? 'https://ipproyectosindustriales.cl/wp-json/wp/v2';

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
