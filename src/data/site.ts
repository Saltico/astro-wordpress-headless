// src/data/site.ts
// Single source of truth para toda la data de sitio compartida:
// topbar, navegación, footer, branding, contacto, redes sociales.
//
// Este archivo es la única fuente. Los componentes UI reciben esta data
// como props (no la importan directamente) para mantener la reusabilidad.

import type { NavItem } from '@/types/navigation';
import type { FooterColumn, FooterLink, SocialLink } from '@/types/layout';

// ─── Branding ────────────────────────────────────────────────────────────
export const siteBrand = {
  name: 'IP Proyectos Industriales',
  legalName: 'IP Proyectos Industriales SpA',
  tagline: 'La pasión y el valor por un trabajo bien hecho.',
  description:
    'Especialistas en obras civiles, montaje industrial y arriendo de maquinaria de alto tonelaje para la gran minería.',
  logoUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2024/12/logo.png',
  siteUrl: 'https://ipproyectosindustriales.cl',
};

// ─── Contacto ───────────────────────────────────────────────────────────
export const siteContact = {
  phoneMobile: '+56 9 5659 4144',
  phoneMobileHref: 'tel:+56956594144',
  phoneLandline: '(51) 2 750535',
  phoneLandlineHref: 'tel:+56512750535',
  whatsappNumber: '56965593202',
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
  ] satisfies SocialLink[],
  links: [
    { label: 'Canal de Integridad', url: '/canal-integridad' },
    { label: 'Noticias', url: '/noticias' },
  ],
};

// ─── Navegación principal (sin "Empresa", se accede por el logo) ────────
export const navigationData: NavItem[] = [
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
    label: 'Arriendo',
    url: '/arriendo',
    children: [
      { label: 'Izaje', url: '/arriendo/izaje' },
      { label: 'Movimiento de tierra', url: '/arriendo/movimiento-de-tierra' },
      { label: 'Transporte', url: '/arriendo/transporte' },
      { label: 'Equipos especiales', url: '/arriendo/equipos-especiales' },
    ],
  },
  { label: 'Seguridad', url: '/seguridad' },
  { label: 'Compliance', url: '/compliance' },
/* TODO: DEFINIR SI SE DEBE MANTENER EL LINK DE CONTACTO EN LA NAVEGACIÓN PRINCIPAL   
 label: 'Contacto', url: '/contacto' }, */
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
        { label: 'Montajes', url: '/servicios/montajes' },
        {
          label: 'Infraestructura portuaria',
          url: '/servicios/infraestructura-portuaria',
        },
        { label: 'Arriendo de equipos', url: '/arriendo' },
      ],
    },
    {
      title: 'Arriendo de equipos',
      links: [
        { label: 'Catálogo completo', url: '/arriendo' },
        { label: 'Izaje', url: '/arriendo/izaje' },
        { label: 'Movimiento de tierra', url: '/arriendo/movimiento-de-tierra' },
        { label: 'Transporte', url: '/arriendo/transporte' },
        { label: 'Equipos especiales', url: '/arriendo/equipos-especiales' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Nuestra empresa', url: '/nosotros' },
        { label: 'Seguridad y medio ambiente', url: '/seguridad' },
        { label: 'Compliance', url: '/compliance' },
        { label: 'Canal de denuncias', url: '/canal-integridad' },
      ],
    },
  ],
  legal: [
    { label: 'Aviso Legal', url: '/aviso-legal' },
    { label: 'Política de Privacidad', url: '/privacidad' },
    { label: 'Cookies', url: '/cookies' },
  ],
  catalogUrl: siteContact.catalogUrl,
  catalogLabel: 'Descargar catálogo 2025',
};
