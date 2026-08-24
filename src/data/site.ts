// src/data/site.ts
// Single source of truth para toda la data de sitio compartida:
// topbar, navegación, footer, branding, contacto, redes sociales.
//
// Este archivo es la única fuente. Los componentes UI reciben esta data
// como props (no la importan directamente) para mantener la reusabilidad.

import type { NavItem } from '@/types/navigation';
import type { FooterColumn, FooterLink, SocialLink } from '@/types/layout';

// ─── URL del sitio de cotización/rental ────────────────────────────────
// Variable de entorno con fallback. Cualquier CTA de cotización o rental
// redirige a esta URL.
export const IPRENTAL_URL =
  import.meta.env.PUBLIC_IPRENTAL_URL ?? 'https://www.iprental.cl';

// ─── Branding ────────────────────────────────────────────────────────────
export const siteBrand = {
  name: 'IP Proyectos Industriales',
  legalName: 'IP Proyectos Industriales SpA',
  tagline: 'Ingeniería, montajes y grúas de alto tonelaje para la minería.',
  description:
    'Ingeniería, construcción, montajes e izajes de alto tonelaje (hasta 400 t) para la gran minería en Atacama y Coquimbo. Más de 25 años de experiencia.',
  logoUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2024/12/logo.png',
  siteUrl: 'ipproyectosindustriales.cl',
};

// ─── Contacto ───────────────────────────────────────────────────────────
export const siteContact = {
  phoneMobile: '+56 9 5659 4144',
  phoneMobileHref: 'tel:+56956594144',
  phoneLandline: '(51) 2 750535',
  phoneLandlineHref: 'tel:+56512750535',
  whatsappNumber: '56956594144',
  email: 'contacto@ipproyectosindustriales.cl',
  address: 'Parcela 110 Lote A-3, Vegas Norte, La Serena',
  schedule: 'Lunes a Viernes, 08:00 – 18:00',
  catalogUrl:
    'https://ipproyectosindustriales.cl/wp-content/uploads/2025/08/IPP-2025.pdf',
};

// ─── TopBar (utility bar) ────────────────────────────────────────────────
export const topbarData = {
  phone: siteContact.phoneMobile,
  email: siteContact.email,
  social: [
    {
      platform: 'linkedin' as const,
      url: 'https://www.linkedin.com/company/ip-proyectos-industrialescqbo',
    },
    {
      platform: 'instagram' as const,
      url: 'https://www.instagram.com/ip.proyectosindustriales/',
    },
    {
      platform: 'facebook' as const,
      url: 'https://web.facebook.com/ipproyectosindustrialescqbo',
    },
    {
      platform: 'whatsapp' as const,
      url: `https://wa.me/${siteContact.whatsappNumber}?text=Hola%20IP%20Proyectos%20Industriales%2C%20quisiera%20conversar%20sobre%20un%20proyecto.`,
    },
  ] satisfies SocialLink[],
  links: [
    { label: 'IP Rental', url: IPRENTAL_URL },
    { label: 'Noticias', url: '/noticias' },
  ],
};

// ─── Navegación principal ────────────────────────────────────────────────
export const navigationData: NavItem[] = [
  { label: 'Empresa', url: '/' },
  {
    label: 'Servicios',
    url: '/servicios',
    children: [
      { label: 'Ingeniería', url: '/servicios/ingenieria' },
      { label: 'Construcción', url: '/servicios/construccion' },
      { label: 'Montajes', url: '/servicios/montajes' },
      {
        label: 'Infraestructura portuaria',
        url: '/servicios/infraestructura-portuaria',
      },
    ],
  },
  {
    label: 'Rental de equipos',
    url: '/arriendo',
  },
  { label: 'Seguridad', url: '/seguridad' },
  { label: 'Compliance', url: '/compliance' },
];

// ─── Footer ──────────────────────────────────────────────────────────────
export const footerData: {
  columns: FooterColumn[];
  legal: FooterLink[];
  catalogUrl: string;
  catalogLabel: string;
} = {
  columns: [
    {
      title: 'Servicios',
      links: [
        { label: 'Ingeniería', url: '/servicios/ingenieria' },
        { label: 'Construcción', url: '/servicios/construccion' },
        { label: 'Montajes mineros e industriales', url: '/servicios/montajes' },
        {
          label: 'Infraestructura portuaria',
          url: '/servicios/infraestructura-portuaria',
        },
        { label: 'Arriendo de equipos', url: '/arriendo' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Nuestra empresa', url: '/' },
        { label: 'Seguridad y medio ambiente', url: '/seguridad' },
        { label: 'Compliance', url: '/compliance' },
        { label: 'Código de ética', url: '/compliance' },
        { label: 'Canal de denuncias', url: 'https://ipproyectosindustriales.cl/canal-de-denuncias/' },
        { label: 'Noticias', url: '/noticias' },
      ],
    },
  ],
  legal: [
    { label: 'Aviso Legal', url: '/aviso-legal' },
    { label: 'Política de Privacidad', url: '/privacidad' },
    { label: 'Cookies', url: '/cookies' },
  ],
  catalogUrl: IPRENTAL_URL,
  catalogLabel: 'Cotiza en IP Rental',
};
