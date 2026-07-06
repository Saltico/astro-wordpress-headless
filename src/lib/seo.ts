// src/lib/seo.ts
// Helpers para generar schemas de Schema.org reutilizables

import type { SiteConfig } from '@/types/seo';

const DEFAULT_CONFIG: SiteConfig = {
  siteUrl: 'https://ipproyectosindustriales.cl',
  siteName: 'IP Proyectos Industriales',
  defaultLocale: 'es',
  phone: '+56 9 0000 0000',
  email: 'contacto@ipproyectosindustriales.cl',
  logoPath: '/logo.png',
};

export function getSiteConfig(): SiteConfig {
  return DEFAULT_CONFIG;
}

export function getSiteUrl(path = ''): string {
  const config = getSiteConfig();
  return new URL(path, config.siteUrl).toString();
}

export function organizationSchema(): Record<string, unknown> {
  const config = getSiteConfig();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.siteName,
    url: config.siteUrl,
    logo: getSiteUrl(config.logoPath),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: config.phone,
      contactType: 'sales',
      areaServed: ['CL-II', 'CL-III', 'CL-IV'],
      availableLanguage: ['Spanish'],
    },
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Coquimbo',
      addressCountry: 'CL',
    },
  };
}

export function websiteSchema(searchUrl?: string): Record<string, unknown> {
  const config = getSiteConfig();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.siteName,
    url: config.siteUrl,
    ...(searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${searchUrl}?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  };
}

export function serviceSchema(
  name: string,
  description: string,
  url: string,
  provider = organizationSchema()
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider,
  };
}

export function productSchema(
  name: string,
  description: string,
  url: string,
  image?: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    ...(image && { image }),
    offers: {
      '@type': 'Offer',
      url,
      availability: 'https://schema.org/InStock',
      priceCurrency: 'CLP',
      seller: organizationSchema(),
    },
  };
}

export function projectSchema(
  name: string,
  description: string,
  url: string,
  location: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Project',
    name,
    description,
    url,
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        addressRegion: location,
        addressCountry: 'CL',
      },
    },
  };
}

export function articleSchema(
  name: string,
  description: string,
  url: string,
  datePublished?: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: name,
    description,
    url,
    ...(datePublished && { datePublished }),
    author: {
      '@type': 'Organization',
      name: getSiteConfig().siteName,
    },
    publisher: organizationSchema(),
  };
}

export function newsArticleSchema(
  headline: string,
  description: string,
  url: string,
  datePublished: string,
  image?: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline,
    description,
    url,
    datePublished,
    image: image ?? getSiteUrl('/og-default.jpg'),
    author: {
      '@type': 'Organization',
      name: getSiteConfig().siteName,
    },
    publisher: organizationSchema(),
  };
}

export function aboutPageSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Nosotros',
    url: getSiteUrl('/nosotros'),
    mainEntity: organizationSchema(),
  };
}

export function contactPageSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contacto',
    url: getSiteUrl('/contacto'),
    mainEntity: {
      '@type': 'ContactPoint',
      telephone: getSiteConfig().phone,
      contactType: 'sales',
      availableLanguage: ['Spanish'],
    },
  };
}

export function breadcrumbSchema(items: { label: string; url?: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.url ? getSiteUrl(item.url) : undefined,
    })),
  };
}

export function faqPageSchema(questions: { question: string; answer: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

export function collectionPageSchema(name: string, url: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url,
  };
}

export function combineSchemas(...schemas: Record<string, unknown>[]): Record<string, unknown>[] {
  return schemas;
}
