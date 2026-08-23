// src/lib/wordpress-api.ts
// Cliente para consumir la API REST de WordPress.
// Documentación: https://developer.wordpress.org/rest-api/reference/posts/

import type { NewsArticle } from '@/data/news';

const WP_API_BASE = import.meta.env.WP_API_URL || 'https://ipproyectosindustriales.cl/wp-json';
const WP_POSTS_ENDPOINT = `${WP_API_BASE}/wp/v2/posts`;

interface FetchPostsOptions {
  perPage?: number;
  page?: number;
  slug?: string;
  categories?: number[];
  tags?: number[];
  search?: string;
}

/**
 * Obtiene artículos desde la API de WordPress.
 * Usa _embed=1 para incluir datos de autor, categorías e imagen destacada.
 */
export async function fetchPosts(options: FetchPostsOptions = {}): Promise<NewsArticle[]> {
  const { perPage = 10, page = 1, slug, categories, tags, search } = options;

  const params = new URLSearchParams({
    _embed: '1',
    per_page: perPage.toString(),
    page: page.toString(),
    status: 'publish',
  });

  if (slug) params.append('slug', slug);
  if (categories?.length) params.append('categories', categories.join(','));
  if (tags?.length) params.append('tags', tags.join(','));
  if (search) params.append('search', search);

  try {
    const response = await fetch(`${WP_POSTS_ENDPOINT}?${params}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`WordPress API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const posts = await response.json();
    return posts as NewsArticle[];
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    return [];
  }
}

/**
 * Obtiene todos los artículos publicados (paginación automática).
 * Útil para getStaticPaths() en Astro.
 */
export async function fetchAllNews(options: { perPage?: number } = {}): Promise<NewsArticle[]> {
  const perPage = options.perPage || 100;
  let page = 1;
  let allPosts: NewsArticle[] = [];
  let hasMore = true;

  while (hasMore) {
    const posts = await fetchPosts({ perPage, page });
    
    if (posts.length === 0) {
      hasMore = false;
    } else {
      allPosts = [...allPosts, ...posts];
      hasMore = posts.length === perPage;
      page++;
    }
  }

  return allPosts;
}

/**
 * Obtiene un artículo por su slug.
 */
export async function fetchNewsBySlug(slug: string): Promise<NewsArticle | null> {
  const posts = await fetchPosts({ slug, perPage: 1 });
  return posts[0] || null;
}

/**
 * Obtiene artículos relacionados (misma categoría, excluyendo el actual).
 */
export async function fetchRelatedNews(
  currentSlug: string,
  categoryId: number | undefined,
  limit = 3
): Promise<NewsArticle[]> {
  if (!categoryId) {
    // Si no hay categoría, obtener los más recientes excluyendo el actual
    const posts = await fetchPosts({ perPage: limit + 1 });
    return posts.filter((p) => p.slug !== currentSlug).slice(0, limit);
  }

  const posts = await fetchPosts({ categories: [categoryId], perPage: limit + 1 });
  return posts.filter((p) => p.slug !== currentSlug).slice(0, limit);
}
