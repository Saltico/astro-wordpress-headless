// src/data/promotions.ts
// Datos estáticos para el banner promocional y la card de promociones.
// Futuro: migrar a WordPress CPT cuando se active.

import arriendoHero from '@/assets/imgs/hero/arriendo/arriendo.avif';
import izajeHero from '@/assets/imgs/servicios/servicios.avif';
import apoyoHero from '@/assets/imgs/apoyo.jpg';
import transporteHero from '@/assets/imgs/hero/arriendo/transporte/transporte.avif';

// ─────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────

export interface BannerSlide {
  /** Imagen de fondo del slide */
  image: string;
  /** Alt text de la imagen */
  imageAlt: string;
  /** Título principal del slide */
  title: string;
  /** Subtítulo descriptivo */
  subtitle: string;
  /** Texto del botón CTA */
  ctaLabel: string;
  /** URL del botón CTA */
  ctaHref: string;
  /** Tipo de slide: 'promo' (promoción comercial) o 'showcase' (destacado de categoría) */
  type: 'promo' | 'showcase';
}

export interface PromotionCategory {
  /** Nombre de la categoría */
  name: string;
  /** Slug de la categoría */
  slug: string;
}

export interface PromotionCard {
  /** Título de la card */
  title: string;
  /** Descripción corta */
  description: string;
  /** Imagen de fondo */
  image: string;
  /** Alt text de la imagen */
  imageAlt: string;
  /** Categorías destacadas (pills) */
  categories: PromotionCategory[];
  /** URL del CTA */
  ctaHref: string;
  /** Texto del CTA */
  ctaLabel: string;
}

// ─────────────────────────────────────────────────────────────
// BANNER SLIDES (3 slides: izaje, mov. tierra, transporte)
// Las promociones van primero (type: 'promo'), luego showcases.
// ─────────────────────────────────────────────────────────────

export const bannerSlides: BannerSlide[] = [
  {
    image: izajeHero.src,
    imageAlt: 'Grúa de izaje en faena minera del norte de Chile',
    title: 'Grúas de hasta 250 toneladas',
    subtitle: 'Izaje pesado con operadores certificados. Disponibilidad 24/7 en Atacama, Coquimbo y Antofagasta.',
    ctaLabel: 'Ver grúas',
    ctaHref: '/arriendo/izaje',
    type: 'promo',
  },
  {
    image: apoyoHero.src,
    imageAlt: 'Maquinaria de movimiento de tierra en faena',
    title: 'Movimiento de tierra',
    subtitle: 'Retroexcavadoras, camiones tolva y minicargadores con operador certificado.',
    ctaLabel: 'Ver equipos',
    ctaHref: '/arriendo/movimiento-de-tierra',
    type: 'promo',
  },
  {
    image: transporteHero.src,
    imageAlt: 'Tracto camión en ruta minera',
    title: 'Transporte de carga pesada',
    subtitle: 'Tracto camiones, camas-baja y semiremolques para cargas sobredimensionadas.',
    ctaLabel: 'Ver transporte',
    ctaHref: '/arriendo/transporte',
    type: 'promo',
  },
];

// ─────────────────────────────────────────────────────────────
// CARD DE PROMOCIONES (CategoryShowcase)
// Entry point genérico: muestra las 3 categorías principales.
// ─────────────────────────────────────────────────────────────

export const promotionCard: PromotionCard = {
  title: 'Condiciones especiales en equipos seleccionados',
  description: 'Aprovecha tarifas preferenciales en grúas, movimiento de tierra y transporte. Disponibilidad inmediata en el norte de Chile.',
  image: arriendoHero.src,
  imageAlt: 'Equipos pesados en promoción para arriendo en minería',
  categories: [
    { name: 'Izaje', slug: 'izaje' },
    { name: 'Mov. Tierra', slug: 'movimiento-de-tierra' },
    { name: 'Transporte', slug: 'transporte' },
  ],
  ctaHref: '/arriendo',
  ctaLabel: 'Ver equipos en promoción',
};
