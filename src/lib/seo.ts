// src/lib/seo.ts
// Helpers para generar schemas de Schema.org reutilizables

import type { SiteConfig } from '@/types/seo';

const DEFAULT_CONFIG: SiteConfig = {
  siteUrl: 'https://orangered-deer-742907.hostingersite.com',
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
  provider = organizationSchema(),
  options?: {
    serviceType?: string;
    areaServed?: string[];
  }
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider,
    ...(options?.serviceType && { serviceType: options.serviceType }),
    ...(options?.areaServed && { areaServed: options.areaServed }),
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

export interface ProductSchemaOptions {
  name: string;
  description: string;
  url: string;
  image?: string;
  sku?: string;
  mpn?: string;
  brand?: string;
  offers?: {
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'BackOrder';
    priceCurrency?: string;
    price?: number;
    priceRange?: string;
    validFrom?: string;
  };
}

export function productSchemaExtended(
  options: ProductSchemaOptions
): Record<string, unknown> {
  const { name, description, url, image, sku, mpn, brand, offers } = options;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    ...(image && { image }),
    ...(sku && { sku }),
    ...(mpn && { mpn }),
    ...(brand && { brand: { '@type': 'Brand', name: brand } }),
    offers: {
      '@type': 'Offer',
      url,
      availability: `https://schema.org/${offers?.availability ?? 'InStock'}`,
      priceCurrency: offers?.priceCurrency ?? 'CLP',
      ...(offers?.price !== undefined && { price: offers.price }),
      ...(offers?.priceRange && { priceRange: offers.priceRange }),
      ...(offers?.validFrom && { validFrom: offers.validFrom }),
      seller: organizationSchema(),
    },
  };
}

export interface ItemListItem {
  name: string;
  url: string;
  image?: string;
  description?: string;
  position?: number;
}

export function itemListSchema(opts: {
  name: string;
  items: ItemListItem[];
  url?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: opts.name,
    ...(opts.url && { url: opts.url }),
    itemListElement: opts.items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position ?? index + 1,
      name: item.name,
      url: item.url,
      ...(item.image && { image: item.image }),
      ...(item.description && { description: item.description }),
    })),
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

export interface NewsArticleSchemaExtendedOptions {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  articleSection?: string;
}

export function newsArticleSchemaExtended(
  options: NewsArticleSchemaExtendedOptions
): Record<string, unknown> {
  const { headline, description, url, image, datePublished, dateModified, authorName, articleSection } = options;
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline,
    description,
    url,
    image: image ?? getSiteUrl('/og-default.jpg'),
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      '@type': 'Organization',
      name: authorName ?? getSiteConfig().siteName,
    },
    publisher: organizationSchema(),
    ...(articleSection && { articleSection }),
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

export interface LocalBusinessSchemaOptions {
  name: string;
  description: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  areaServed?: string[];
  openingHours?: string[];   // formato ISO 8601
  url?: string;
}

export function localBusinessSchema(opts: LocalBusinessSchemaOptions): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: opts.name,
    description: opts.description,
    telephone: opts.telephone,
    email: opts.email,
    url: opts.url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: opts.address.streetAddress,
      addressLocality: opts.address.addressLocality,
      addressRegion: opts.address.addressRegion,
      addressCountry: opts.address.addressCountry,
    },
    ...(opts.areaServed && { areaServed: opts.areaServed }),
    ...(opts.openingHours && { openingHours: opts.openingHours }),
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
