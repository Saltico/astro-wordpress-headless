// src/lib/news.ts
// Helpers para consumir noticias desde WordPress REST API.
// Fallback a datos estáticos si la API no está disponible.

import { newsArticles as staticArticles, type NewsArticle } from '@/data/news';
import { fetchAllNews, fetchNewsBySlug, fetchRelatedNews } from './wordpress-api';

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
 * Obtiene las últimas noticias publicadas.
 * Intenta desde la API de WordPress, fallback a datos estáticos.
 */
export async function getLatestNews(limit = 6): Promise<NewsCard[]> {
  try {
    const articles = await fetchAllNews({ perPage: limit });
    if (articles.length > 0) {
      return articles.map(toCard);
    }
  } catch (error) {
    console.warn('Error fetching from WordPress API, using static data:', error);
  }

  // Fallback a datos estáticos
  return staticArticles
    .filter((a) => a.status === 'publish')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map(toCard);
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
