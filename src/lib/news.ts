// src/lib/news.ts
// Helpers para consumir noticias desde WordPress REST API.
// Fallback a datos estáticos si la API no está disponible.

import { newsArticles as staticArticles, type NewsArticle } from '@/data/news';
import { fetchPosts, fetchAllNews, fetchNewsBySlug, fetchRelatedNews } from './wordpress-api';

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

/**
 * Caché SSR con TTL para el listado de noticias.
 * Evita que cada request a páginas SSR (p. ej. la home) dispare llamadas
 * remotas a WordPress: como máximo 1 llamada acotada por ventana de TTL.
 */
const NEWS_CACHE_TTL_MS = 5 * 60 * 1000;
const latestNewsCache = new Map<number, { at: number; cards: NewsCard[] }>();

function staticCards(limit: number): NewsCard[] {
  return staticArticles
    .filter((a) => a.status === 'publish')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map(toCard);
}

/**
 * Obtiene las últimas noticias publicadas.
 * Una única llamada a la API (sin paginación secuencial), con timeout en el
 * cliente HTTP y fallback a datos estáticos. El resultado —venga de WP o del
 * fallback— se cachea por TTL para no penalizar cada request SSR.
 */
export async function getLatestNews(limit = 6): Promise<NewsCard[]> {
  const cached = latestNewsCache.get(limit);
  if (cached && Date.now() - cached.at < NEWS_CACHE_TTL_MS) {
    return cached.cards;
  }

  let cards: NewsCard[] = [];
  try {
    const articles = await fetchPosts({ perPage: limit });
    cards = articles.map(toCard);
  } catch (error) {
    console.warn('Error fetching from WordPress API, using static data:', error);
  }

  if (cards.length === 0) {
    cards = staticCards(limit);
  }

  latestNewsCache.set(limit, { at: Date.now(), cards });
  return cards;
}

/**
 * Obtiene un artículo por su slug.
 * Intenta desde la API de WordPress, fallback a datos estáticos.
 */
export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const article = await fetchNewsBySlug(slug);
    if (article) return article;
  } catch (error) {
    console.warn('Error fetching from WordPress API, using static data:', error);
  }

  // Fallback a datos estáticos
  return staticArticles.find((a) => a.slug === slug) ?? null;
}

/**
 * Obtiene artículos relacionados (misma categoría).
 * Intenta desde la API de WordPress, fallback a datos estáticos.
 */
export async function getRelatedNews(slug: string, limit = 3): Promise<NewsCard[]> {
  const current = await getNewsBySlug(slug);
  if (!current) return [];

  const categoryId = current._embedded?.['wp:term']?.[0]?.[0]?.id;

  try {
    const related = await fetchRelatedNews(slug, categoryId, limit);
    if (related.length > 0) {
      return related.map(toCard);
    }
  } catch (error) {
    console.warn('Error fetching related news from WordPress API, using static data:', error);
  }

  // Fallback a datos estáticos
  const articles = staticArticles.filter(
    (a) => a.slug !== slug && a.status === 'publish'
  );
  return articles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map(toCard);
}

/**
 * Obtiene todos los artículos para generar rutas estáticas.
 * Usado en getStaticPaths() de Astro.
 */
export async function getAllNewsForPaths(): Promise<NewsArticle[]> {
  try {
    const articles = await fetchAllNews();
    if (articles.length > 0) return articles;
  } catch (error) {
    console.warn('Error fetching all news for paths, using static data:', error);
  }

  // Fallback a datos estáticos
  return staticArticles.filter((a) => a.status === 'publish');
}
