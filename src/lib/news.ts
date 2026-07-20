// src/lib/news.ts
// Helpers para consumir noticias.
// Hoy lee de data estática; mañana lee del endpoint WP con la misma firma.

import { newsArticles, type NewsArticle } from '@/data/news';

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
