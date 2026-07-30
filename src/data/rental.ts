// src/data/rental.ts
// Catálogo completo de equipos en arriendo.
// Fuente única de verdad para todas las páginas del catálogo /arriendo/*.

import heroImg from '@/assets/imgs/hero.jpg';

export interface Equipment {
  /** Slug único del modelo, kebab-case, lowercase */
  slug: string;
  /** Nombre visible del equipo */
  name: string;
  /** Spec destacada (ej: "100 t") */
  capacity: string;
  /** Altura máxima opcional (ej: "72 m") */
  height?: string;
  /** 1 línea descriptiva para la card */
  shortDesc: string;
  /** 2-3 bullets de features clave */
  features: string[];
  /** Ruta a la imagen (v1: todas apuntan a hero.jpg) */
  image: string;
  /** Mensaje WhatsApp pre-armado específico del equipo */
  whatsappMessage: string;
}

export interface RentalSubcategory {
  /** Slug de la sub-ruta, kebab-case */
  slug: string;
  /** Nombre visible de la sub-ruta */
  name: string;
  /** 1 línea de descripción corta */
  shortDesc: string;
  /** Párrafo SEO completo (120-180 palabras) */
  description: string;
  /** "Qué incluye el arriendo" (3-5 bullets) */
  features: string[];
  /** Specs técnicas clave */
  specs: { label: string; value: string }[];
  /** Imagen del hero (v1: hero.jpg) */
  heroImage: string;
  /** Title tag pre-formateado */
  seoTitle: string;
  /** Meta description (150-160 chars) */
  seoDescription: string;
  /** Catálogo de equipos disponibles */
  catalog: Equipment[];
  /** Mensaje WhatsApp por defecto de la sub-ruta */
  whatsappMessage: string;
}

export interface RentalCategory {
  /** Slug de la categoría */
  slug: string;
  /** Nombre visible */
  name: string;
  /** 1 línea descriptiva */
  shortDesc: string;
  /** Párrafo SEO de la categoría (80-120 palabras) */
  description: string;
  /** Imagen del hero de categoría */
  heroImage: string;
  /** Title tag de la categoría-hub */
  seoTitle: string;
  /** Meta description de la categoría-hub */
  seoDescription: string;
  /** Sub-rutas de la categoría */
  subcategories: RentalSubcategory[];
}

const HERO = heroImg.src;

// ─────────────────────────────────────────────────────────────
// 1. IZAJE
// ─────────────────────────────────────────────────────────────

const IZAJE_GRUAS_60: RentalSubcategory = {
  slug: 'gruas-60-toneladas',
  name: 'Grúas de 60 toneladas',
  shortDesc: 'Grúas hidráulicas AT de 60 t para izaje industrial y construcción.',
  description:
    'Arriendo de grúas de 60 toneladas en Chile para proyectos de construcción, minería e industria. Equipos hidráulicos todo terreno (AT) de marcas líderes como Grove, Tadano y Liebherr, con capacidades reales entre 55 y 65 toneladas y altura máxima de pluma de hasta 50 metros. Operadores certificados con experiencia en faena, planes de izaje y permisos de trabajo incluidos en el servicio. Disponibilidad en zona norte (Atacama, Coquimbo) y centro del país, con respuesta operativa en menos de 48 horas desde la cotización. Ideales para montaje de estructuras, izaje de equipos y maniobras de precisión en espacios reducidos.',
  features: [
    'Grúas hidráulicas todo terreno (AT) de 55 a 65 toneladas.',
    'Operadores certificados con experiencia en faena.',
    'Planes de izaje, permisos de trabajo y supervisión técnica.',
    'Disponibilidad 24/7 según requerimiento del proyecto.',
    'Mantenimiento preventivo y seguros incluidos.',
  ],
  specs: [
    { label: 'Capacidad', value: '55 – 65 t' },
    { label: 'Altura máxima', value: '40 – 50 m' },
    { label: 'Operador', value: 'Incluido' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Grúas de 60 Toneladas',
  seoDescription:
    'Arriendo de grúas de 60 toneladas con operador certificado en Chile. Equipos Grove, Tadano y Liebherr. Hasta 50 m de altura. Cotiza online.',
  catalog: [
    {
      slug: 'grua-grove-gmk-3060',
      name: 'Grove GMK 3060',
      capacity: '60 t',
      height: '44 m',
      shortDesc: 'Grúa hidráulica AT de 60 t con plumín telescópico y 4 ejes direccionales.',
      features: ['Motor Tier 4 Final', 'Plumín de 15 m', '4 ejes direccionales'],
      image: 'https://www.gruasyequiposgarcia.com/wp-content/uploads/2020/01/Grove-GMK-3050.jpg',
      whatsappMessage:
        'Hola IP, quisiera cotizar arriendo de Grúa Grove GMK 3060 (60 t).',
    },
    {
      slug: 'grua-tadano-gr-600xl',
      name: 'Tadano GR-600XL',
      capacity: '60 t',
      height: '47 m',
      shortDesc: 'Grúa hidráulica AT de 60 t con sistema de control de última generación.',
      features: ['Plumín de 17 m', 'Cabina climatizada', 'Sistema AML'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Tadano GR-600XL (60 t).',
    },
    {
      slug: 'grua-liebherr-ltm-1060',
      name: 'Liebherr LTM 1060',
      capacity: '60 t',
      height: '50 m',
      shortDesc: 'Grúa hidráulica AT de 60 t con tecnología VarioBase para espacios reducidos.',
      features: ['VarioBase', 'Plumín telescópico', 'Modo eco'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Liebherr LTM 1060 (60 t).',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de grúas de 60 toneladas.',
};

const IZAJE_GRUAS_80: RentalSubcategory = {
  slug: 'gruas-80-toneladas',
  name: 'Grúas de 80 toneladas',
  shortDesc: 'Grúas hidráulicas AT de 80 t para izaje pesado y montajes industriales.',
  description:
    'Arriendo de grúas de 80 toneladas en Chile para proyectos de gran envergadura. Equipos hidráulicos todo terreno (AT) con capacidades entre 75 y 90 toneladas y altura máxima de pluma de hasta 60 metros. Marcas líderes como Grove, Tadano y Liebherr con operadores certificados y experiencia comprobada en faenas mineras. Servicio incluye planes de izaje, permisos de trabajo, supervisión técnica y seguros. Disponibilidad en zona norte y centro de Chile, con respuesta operativa en menos de 48 horas. Solución ideal para montaje electromecánico, izaje de equipos pesados y construcción industrial.',
  features: [
    'Grúas hidráulicas todo terreno (AT) de 75 a 90 toneladas.',
    'Operadores certificados con experiencia en faena minera.',
    'Planes de izaje, permisos de trabajo y supervisión técnica.',
    'Disponibilidad 24/7 según requerimiento del proyecto.',
    'Mantenimiento y seguros incluidos durante todo el arriendo.',
  ],
  specs: [
    { label: 'Capacidad', value: '75 – 90 t' },
    { label: 'Altura máxima', value: '50 – 60 m' },
    { label: 'Operador', value: 'Incluido' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Grúas de 80 Toneladas',
  seoDescription:
    'Arriendo de grúas de 80 toneladas con operador certificado en Chile. Equipos Grove, Tadano y Liebherr. Hasta 60 m de altura. Cotiza online.',
  catalog: [
    {
      slug: 'grua-grove-gmk-4080',
      name: 'Grove GMK 4080',
      capacity: '80 t',
      height: '60 m',
      shortDesc: 'Grúa hidráulica AT de 80 t con plumín de 18 m y 4 ejes direccionales.',
      features: ['Motor Tier 4 Final', 'Plumín de 18 m', '4 ejes direccionales'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Grove GMK 4080 (80 t).',
    },
    {
      slug: 'grua-tadano-gr-800xl',
      name: 'Tadano GR-800XL',
      capacity: '80 t',
      height: '58 m',
      shortDesc: 'Grúa hidráulica AT de 80 t con sistema de control avanzado.',
      features: ['Plumín de 18 m', 'Cabina climatizada', 'Sistema AML'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Tadano GR-800XL (80 t).',
    },
    {
      slug: 'grua-liebherr-ltm-1080',
      name: 'Liebherr LTM 1080',
      capacity: '80 t',
      height: '60 m',
      shortDesc: 'Grúa hidráulica AT de 80 t con VarioBase y modo eco.',
      features: ['VarioBase', 'Plumín telescópico', 'Modo eco'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Liebherr LTM 1080 (80 t).',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de grúas de 80 toneladas.',
};

const IZAJE_GRUAS_100: RentalSubcategory = {
  slug: 'gruas-100-toneladas',
  name: 'Grúas de 100 toneladas',
  shortDesc: 'Grúas hidráulicas AT de 100 t para izaje pesado en minería e industria.',
  description:
    'Arriendo de grúas de 100 toneladas en Chile para proyectos de minería e industria. Equipos hidráulicos todo terreno (AT) con capacidades entre 80 y 110 toneladas y altura máxima de pluma de hasta 88 metros con plumín. Marcas líderes como Grove, Liebherr y Tadano con operadores certificados, planes de izaje y permisos de trabajo incluidos. Disponibilidad en zona norte (Atacama, Coquimbo) y centro del país, con respuesta operativa en menos de 48 horas. Servicio 24/7 con mantenimiento preventivo y seguros incluidos durante todo el período de arriendo.',
  features: [
    'Grúas hidráulicas todo terreno (AT) de 80 a 110 toneladas.',
    'Operadores certificados con experiencia en faena minera.',
    'Planes de izaje, permisos de trabajo y supervisión técnica.',
    'Disponibilidad 24/7 según requerimiento del proyecto.',
    'Mantenimiento y seguros incluidos durante todo el arriendo.',
  ],
  specs: [
    { label: 'Capacidad', value: '80 – 110 t' },
    { label: 'Altura máxima', value: '72 – 88 m' },
    { label: 'Operador', value: 'Incluido' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Grúas de 100 Toneladas',
  seoDescription:
    'Arriendo de grúas de 100 toneladas con operador certificado en Chile. Equipos Grove, Liebherr y Tadano. Hasta 88 m de altura. Cotiza online.',
  catalog: [
    {
      slug: 'grua-grove-gmk-4100',
      name: 'Grove GMK 4100',
      capacity: '100 t',
      height: '88 m',
      shortDesc: 'Grúa hidráulica AT de 100 t con plumín telescópico de 17 m.',
      features: ['Motor Tier 4 Final', 'Plumín de 17 m', '4 ejes direccionales'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Grove GMK 4100 (100 t).',
    },
    {
      slug: 'grua-liebherr-ltm-1100',
      name: 'Liebherr LTM 1100',
      capacity: '100 t',
      height: '85 m',
      shortDesc: 'Grúa hidráulica AT de 100 t con sistema VarioBase.',
      features: ['VarioBase', 'Plumín telescópico', 'Cabina climatizada'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Liebherr LTM 1100 (100 t).',
    },
    {
      slug: 'grua-tadano-gr-1000xl',
      name: 'Tadano GR-1000XL',
      capacity: '100 t',
      height: '82 m',
      shortDesc: 'Grúa hidráulica AT de 100 t con sistema de control avanzado.',
      features: ['Plumín de 19 m', 'Sistema AML', 'Modo eco'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Tadano GR-1000XL (100 t).',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de grúas de 100 toneladas.',
};

const IZAJE_GRUAS_250: RentalSubcategory = {
  slug: 'gruas-250-toneladas',
  name: 'Grúas de 250 toneladas',
  shortDesc: 'Grúas hidráulicas de 250 t para izaje pesado en gran minería.',
  description:
    'Arriendo de grúas de 250 toneladas en Chile para proyectos de gran minería e industria pesada. Equipos hidráulicos todo terreno (AT) con capacidades entre 220 y 300 toneladas y altura máxima de pluma de hasta 130 metros con plumín. Marcas líderes como Grove, Liebherr y Tadano con operadores certificados de amplia experiencia en faenas mineras. Servicio incluye planes de izaje, permisos de trabajo, supervisión técnica especializada, transporte del equipo y seguros. Disponibilidad en zona norte (Atacama, Coquimbo, Antofagasta) con respuesta operativa en menos de 72 horas por la complejidad logística de estos equipos.',
  features: [
    'Grúas hidráulicas todo terreno (AT) de 220 a 300 toneladas.',
    'Operadores certificados con amplia experiencia en faena minera.',
    'Planes de izaje, permisos de trabajo y supervisión técnica especializada.',
    'Transporte del equipo y montaje en faena incluido.',
    'Disponibilidad 24/7 y seguros de alto tonelaje.',
  ],
  specs: [
    { label: 'Capacidad', value: '220 – 300 t' },
    { label: 'Altura máxima', value: '110 – 130 m' },
    { label: 'Operador', value: 'Incluido' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Grúas de 250 Toneladas',
  seoDescription:
    'Arriendo de grúas de 250 toneladas con operador certificado en Chile. Equipos Grove, Liebherr y Tadano. Hasta 130 m de altura. Cotiza online.',
  catalog: [
    {
      slug: 'grua-grove-gmk-5250l',
      name: 'Grove GMK 5250L',
      capacity: '250 t',
      height: '120 m',
      shortDesc: 'Grúa hidráulica AT de 250 t con plumín telescópico de 33 m.',
      features: ['Motor Tier 4 Final', 'Plumín de 33 m', '7 ejes direccionales'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Grove GMK 5250L (250 t).',
    },
    {
      slug: 'grua-liebherr-ltm-1250',
      name: 'Liebherr LTM 1250-5.1',
      capacity: '250 t',
      height: '130 m',
      shortDesc: 'Grúa hidráulica AT de 250 t con sistema VarioBase de alto tonelaje.',
      features: ['VarioBase', 'Plumín telescópico', 'Cabina climatizada'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Liebherr LTM 1250 (250 t).',
    },
    {
      slug: 'grua-tadano-atf-400g-6',
      name: 'Tadano ATF 400G-6',
      capacity: '400 t',
      height: '135 m',
      shortDesc: 'Grúa hidráulica todo terreno de 400 t para proyectos de gran envergadura.',
      features: ['Plumín de 36 m', 'Sistema AML', '6 ejes'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Tadano ATF 400G-6 (400 t).',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de grúas de 250 toneladas.',
};

const IZAJE_CAMIONES_PLUMA: RentalSubcategory = {
  slug: 'camiones-pluma',
  name: 'Camiones pluma',
  shortDesc: 'Camiones pluma de 3 a 15 toneladas con operador certificado.',
  description:
    'Arriendo de camiones pluma en Chile para faenas mineras, construcción e industria. Equipos con capacidad de carga entre 3 y 15 toneladas, ideales para carga, descarga y posicionamiento de materiales en altura. Operadores certificados, combustibles incluidos y disponibilidad inmediata. Servicio disponible en zona norte (Atacama, Coquimbo) y centro del país con respuesta operativa en menos de 24 horas. Los camiones pluma son la solución más versátil para tareas logísticas que requieren movilidad y precisión en el izaje de cargas medianas.',
  features: [
    'Camiones pluma con capacidad de 3 a 15 toneladas.',
    'Operadores certificados con licencia al día.',
    'Combustible y mantenimiento incluido durante el arriendo.',
    'Disponibilidad inmediata en zona norte y centro de Chile.',
    'Seguros de responsabilidad civil incluidos.',
  ],
  specs: [
    { label: 'Capacidad', value: '3 – 15 t' },
    { label: 'Alcance horizontal', value: '12 – 22 m' },
    { label: 'Operador', value: 'Incluido' },
    { label: 'Disponibilidad', value: 'Inmediata' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Camiones Pluma',
  seoDescription:
    'Arriendo de camiones pluma de 3 a 15 toneladas en Chile. Operador certificado, combustible y seguros incluidos. Disponibilidad inmediata. Cotiza online.',
  catalog: [
    {
      slug: 'camion-pluma-5-toneladas',
      name: 'Camión Pluma 5 t',
      capacity: '5 t',
      height: '14 m',
      shortDesc: 'Camión pluma compacto de 5 t ideal para faenas urbanas e industriales.',
      features: ['Brazo articulado', 'Estabilizadores hidráulicos', 'Radio comando'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camión Pluma 5 t.',
    },
    {
      slug: 'camion-pluma-10-toneladas',
      name: 'Camión Pluma 10 t',
      capacity: '10 t',
      height: '18 m',
      shortDesc: 'Camión pluma de 10 t con brazo telescópico para faenas mineras.',
      features: ['Brazo telescópico', 'Estabilizadores extendidos', 'Cabina certificada'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camión Pluma 10 t.',
    },
    {
      slug: 'camion-pluma-15-toneladas',
      name: 'Camión Pluma 15 t',
      capacity: '15 t',
      height: '22 m',
      shortDesc: 'Camión pluma de 15 t con alcance extendido y alta capacidad.',
      features: ['Alcance 22 m', 'Estabilizadores extra', 'Cabina climatizada'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camión Pluma 15 t.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de camiones pluma.',
};

const IZAJE_ALZA_HOMBRE: RentalSubcategory = {
  slug: 'alza-hombre',
  name: 'Alza-hombre y plataformas',
  shortDesc: 'Plataformas aéreas y alza-hombre para trabajo en altura.',
  description:
    'Arriendo de plataformas aéreas y alza-hombre en Chile para trabajo seguro en altura. Equipos articulados y telescópicos con altura de trabajo entre 8 y 40 metros, ideales para mantenimiento industrial, montaje eléctrico, pintura y construcción. Operadores certificados, arnés de seguridad y permisos de trabajo incluidos. Servicio disponible en zona norte y centro de Chile con respuesta operativa en menos de 24 horas. Todos nuestros equipos cumplen con la normativa chilena de trabajo en altura y cuentan con certificación vigente.',
  features: [
    'Plataformas aéreas de 8 a 40 metros de altura de trabajo.',
    'Equipos articulados y telescópicos según requerimiento.',
    'Operadores certificados en trabajo en altura.',
    'Arnés de seguridad y permisos de trabajo incluidos.',
    'Disponibilidad inmediata y respuesta en menos de 24 horas.',
  ],
  specs: [
    { label: 'Altura de trabajo', value: '8 – 40 m' },
    { label: 'Tipo', value: 'Articulada / Telescópica' },
    { label: 'Operador', value: 'Incluido' },
    { label: 'Disponibilidad', value: 'Inmediata' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Alza-hombre en Chile',
  seoDescription:
    'Arriendo de alza-hombre y plataformas aéreas en Chile. Equipos articulados y telescópicos, altura de 8 a 40 m. Operador certificado. Cotiza online.',
  catalog: [
    {
      slug: 'plataforma-articulada-18m',
      name: 'Plataforma Articulada 18 m',
      capacity: '200 kg',
      height: '18 m',
      shortDesc: 'Plataforma articulada de 18 m para trabajo en altura con obstáculos.',
      features: ['Brazo articulado', 'Tracción 4x4', 'Operador certificado'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Plataforma Articulada 18 m.',
    },
    {
      slug: 'plataforma-telescopica-25m',
      name: 'Plataforma Telescópica 25 m',
      capacity: '230 kg',
      height: '25 m',
      shortDesc: 'Plataforma telescópica de 25 m para alcance en altura sin obstáculos.',
      features: ['Brazo telescópico', 'Estabilizadores hidráulicos', 'Cabina climatizada'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Plataforma Telescópica 25 m.',
    },
    {
      slug: 'plataforma-telescopica-40m',
      name: 'Plataforma Telescópica 40 m',
      capacity: '450 kg',
      height: '40 m',
      shortDesc: 'Plataforma telescópica de 40 m para faenas de gran altura.',
      features: ['Brazo telescópico largo', 'Estabilizadores extra', 'Operador certificado'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Plataforma Telescópica 40 m.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de alza-hombre.',
};

const IZAJE_GRUAS_HORQUILLA: RentalSubcategory = {
  slug: 'gruas-horquilla',
  name: 'Grúas horquilla',
  shortDesc: 'Grúas horquilla diésel y eléctricas para movimiento de carga.',
  description:
    'Arriendo de grúas horquilla en Chile para movimiento de carga en faenas mineras, industriales y construcción. Equipos diésel y eléctricos con capacidad entre 2 y 25 toneladas, ideales para carga y descarga de camiones, movimiento de pallets y materiales en bodega. Mantenimiento, seguros y operador opcional incluidos. Servicio disponible en zona norte (Atacama, Coquimbo) y centro del país con respuesta operativa en menos de 24 horas. Todos nuestros equipos cuentan con mantención preventiva al día y certificación vigente.',
  features: [
    'Grúas horquilla diésel y eléctricas de 2 a 25 toneladas.',
    'Mantenimiento preventivo y seguros incluidos.',
    'Operador opcional según requerimiento del cliente.',
    'Disponibilidad inmediata en zona norte y centro de Chile.',
    'Equipos certificados y con mantención al día.',
  ],
  specs: [
    { label: 'Capacidad', value: '2 – 25 t' },
    { label: 'Tipo', value: 'Diésel / Eléctrica' },
    { label: 'Operador', value: 'Opcional' },
    { label: 'Disponibilidad', value: 'Inmediata' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Grúas Horquilla en Chile',
  seoDescription:
    'Arriendo de grúas horquilla diésel y eléctricas en Chile. Capacidad de 2 a 25 toneladas. Mantenimiento y seguros incluidos. Cotiza online.',
  catalog: [
    {
      slug: 'grua-horquilla-diesel-5t',
      name: 'Grúa Horquilla Diésel 5 t',
      capacity: '5 t',
      shortDesc: 'Grúa horquilla diésel de 5 t para faenas exteriores e industriales.',
      features: ['Motor diésel', 'Mástil triple', 'Cabina abierta'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Horquilla Diésel 5 t.',
    },
    {
      slug: 'grua-horquilla-electrica-3t',
      name: 'Grúa Horquilla Eléctrica 3 t',
      capacity: '3 t',
      shortDesc: 'Grúa horquilla eléctrica de 3 t para faenas indoor y bodegas.',
      features: ['Motor eléctrico', 'Cero emisiones', 'Mástil triple'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Horquilla Eléctrica 3 t.',
    },
    {
      slug: 'grua-horquilla-diesel-10t',
      name: 'Grúa Horquilla Diésel 10 t',
      capacity: '10 t',
      shortDesc: 'Grúa horquilla diésel de 10 t para carga pesada en faena.',
      features: ['Motor diésel', 'Mástil pesado', 'Cabina cerrada'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Horquilla Diésel 10 t.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de grúas horquilla.',
};

// ─────────────────────────────────────────────────────────────
// 2. MOVIMIENTO DE TIERRA
// ─────────────────────────────────────────────────────────────

const MT_CAMIONES_TOLVA: RentalSubcategory = {
  slug: 'camiones-tolva',
  name: 'Camiones tolva',
  shortDesc: 'Camiones tolva para transporte de material y movimiento de tierra.',
  description:
    'Arriendo de camiones tolva en Chile para movimiento de tierra, transporte de material y faenas mineras. Equipos con capacidad entre 15 y 40 metros cúbicos, motor diésel de alto torque y tolva reforzadas para trabajo pesado. Choferes con licencia A4 vigente y experiencia en faena. Mantenimiento, combustibles y seguros incluidos. Servicio disponible en zona norte (Atacama, Coquimbo) y centro de Chile con respuesta operativa en menos de 48 horas. Solución ideal para transporte de áridos, mineral y material de construcción en proyectos de gran envergadura.',
  features: [
    'Camiones tolva de 15 a 40 m³ de capacidad.',
    'Choferes con licencia A4 y experiencia en faena.',
    'Mantenimiento, combustibles y seguros incluidos.',
    'Disponibilidad 24/7 según requerimiento del proyecto.',
    'Tolvas reforzadas para trabajo pesado.',
  ],
  specs: [
    { label: 'Capacidad', value: '15 – 40 m³' },
    { label: 'Carga útil', value: '25 – 60 t' },
    { label: 'Chofer', value: 'Incluido' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Camiones Tolva en Chile',
  seoDescription:
    'Arriendo de camiones tolva de 15 a 40 m³ con chofer en Chile. Ideal para movimiento de tierra y transporte de material. Cotiza online.',
  catalog: [
    {
      slug: 'camion-tolva-20m3',
      name: 'Camión Tolva 20 m³',
      capacity: '20 m³',
      shortDesc: 'Camión tolva de 20 m³ para transporte de material en faena.',
      features: ['Tolva reforzada', 'Motor diésel', 'Chofer certificado'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camión Tolva 20 m³.',
    },
    {
      slug: 'camion-tolva-30m3',
      name: 'Camión Tolva 30 m³',
      capacity: '30 m³',
      shortDesc: 'Camión tolva de 30 m³ para proyectos de gran envergadura.',
      features: ['Tolva extra reforzada', 'Alta capacidad', 'Chofer con experiencia'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camión Tolva 30 m³.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de camiones tolva.',
};

const MT_RETROEXCAVADORAS: RentalSubcategory = {
  slug: 'retroexcavadoras',
  name: 'Retroexcavadoras',
  shortDesc: 'Retroexcavadoras hidráulicas para excavación y movimiento de tierra.',
  description:
    'Arriendo de retroexcavadoras hidráulicas en Chile para proyectos de construcción, minería y movimiento de tierra. Equipos con peso operativo entre 8 y 25 toneladas y profundidad de excavación de hasta 6 metros. Marcas líderes como Caterpillar, Komatsu y John Deere con operadores certificados y experiencia en faena. Mantenimiento, combustibles y seguros incluidos. Servicio disponible en zona norte y centro de Chile con respuesta operativa en menos de 48 horas. Solución versátil para excavación, carga de material, zanjas y demolición ligera.',
  features: [
    'Retroexcavadoras hidráulicas de 8 a 25 toneladas.',
    'Operadores certificados con experiencia en faena.',
    'Profundidad de excavación de hasta 6 metros.',
    'Mantenimiento, combustibles y seguros incluidos.',
    'Disponibilidad 24/7 según requerimiento del proyecto.',
  ],
  specs: [
    { label: 'Peso operativo', value: '8 – 25 t' },
    { label: 'Profundidad', value: '4 – 6 m' },
    { label: 'Operador', value: 'Incluido' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Retroexcavadoras en Chile',
  seoDescription:
    'Arriendo de retroexcavadoras hidráulicas con operador en Chile. Equipos de 8 a 25 toneladas, profundidad hasta 6 m. Cotiza online.',
  catalog: [
    {
      slug: 'retroexcavadora-cat-416f',
      name: 'Caterpillar 416F',
      capacity: '8 t',
      shortDesc: 'Retroexcavadora Caterpillar 416F de 8 t para faenas urbanas y construcción.',
      features: ['Cucharón dual', 'Tracción 4x4', 'Cabina ROPS'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Retroexcavadora Caterpillar 416F.',
    },
    {
      slug: 'retroexcavadora-komatsu-pc200',
      name: 'Komatsu PC200',
      capacity: '20 t',
      shortDesc: 'Retroexcavadora Komatsu PC200 de 20 t para proyectos de gran envergadura.',
      features: ['Motor Tier 4', 'Cucharón reforzado', 'Operador certificado'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Retroexcavadora Komatsu PC200.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de retroexcavadoras.',
};

const MT_MINICARGADORES: RentalSubcategory = {
  slug: 'minicargadores',
  name: 'Minicargadores',
  shortDesc: 'Minicargadores compactos para espacios reducidos y faenas urbanas.',
  description:
    'Arriendo de minicargadores en Chile para construcción, faenas urbanas y espacios reducidos. Equipos compactos con peso operativo entre 1.5 y 4 toneladas y capacidad de carga entre 350 y 1.500 kg. Marcas líderes como Bobcat, Caterpillar y Case con operadores certificados. Mantenimiento, combustibles y seguros incluidos. Servicio disponible en zona norte y centro de Chile con respuesta operativa en menos de 24 horas. Ideales para demolición interior, paisajismo, movimiento de material en espacios confinados y faenas de construcción urbana.',
  features: [
    'Minicargadores de 1.5 a 4 toneladas con variados implementos.',
    'Operadores certificados con experiencia en faena.',
    'Múltiples implementos: cucharón, martillo, horquilla.',
    'Mantenimiento, combustibles y seguros incluidos.',
    'Disponibilidad inmediata y respuesta en menos de 24 horas.',
  ],
  specs: [
    { label: 'Peso operativo', value: '1.5 – 4 t' },
    { label: 'Carga útil', value: '350 – 1.500 kg' },
    { label: 'Operador', value: 'Incluido' },
    { label: 'Disponibilidad', value: 'Inmediata' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Minicargadores en Chile',
  seoDescription:
    'Arriendo de minicargadores con operador en Chile. Equipos Bobcat, Caterpillar y Case. Ideales para espacios reducidos. Cotiza online.',
  catalog: [
    {
      slug: 'minicargador-bobcat-s650',
      name: 'Bobcat S650',
      capacity: '1.1 t',
      shortDesc: 'Minicargador Bobcat S650 de 1.1 t para faenas urbanas y construcción.',
      features: ['Motor diésel', 'Cucharón estándar', 'Cabina cerrada'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Minicargador Bobcat S650.',
    },
    {
      slug: 'minicargador-cat-226d',
      name: 'Caterpillar 226D',
      capacity: '1.2 t',
      shortDesc: 'Minicargador Caterpillar 226D de 1.2 t con alta versatilidad.',
      features: ['Motor Tier 4', 'Tracción alta', 'Operador certificado'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Minicargador Caterpillar 226D.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de minicargadores.',
};

// ─────────────────────────────────────────────────────────────
// 3. TRANSPORTE
// ─────────────────────────────────────────────────────────────

const TR_TRACTO_CAMIONES: RentalSubcategory = {
  slug: 'tracto-camiones',
  name: 'Tracto camiones',
  shortDesc: 'Tracto camiones para transporte de carga pesada en faena.',
  description:
    'Arriendo de tracto camiones en Chile para transporte de carga pesada y sobredimensionada en faenas mineras e industriales. Equipos con motor de alto torque y capacidad de tiro de hasta 60 toneladas. Choferes con licencia A5 vigente y experiencia en transporte de carga pesada en rutas mineras. Mantenimiento, combustibles y seguros incluidos. Servicio disponible en zona norte (Atacama, Coquimbo, Antofagasta) y centro de Chile con respuesta operativa en menos de 48 horas. Solución ideal para transporte de equipos, contenedores y carga sobredimensionada en proyectos de gran envergadura.',
  features: [
    'Tracto camiones con motor de alto torque y capacidad hasta 60 t.',
    'Choferes con licencia A5 y experiencia en carga pesada.',
    'Mantenimiento, combustibles y seguros incluidos.',
    'Disponibilidad 24/7 según requerimiento del proyecto.',
    'Cumplimiento de normativa de transporte de carga sobredimensionada.',
  ],
  specs: [
    { label: 'Capacidad de tiro', value: '40 – 60 t' },
    { label: 'Cabina', value: 'Certificada' },
    { label: 'Chofer', value: 'Incluido' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Tracto Camiones en Chile',
  seoDescription:
    'Arriendo de tracto camiones con chofer en Chile. Capacidad de tiro hasta 60 toneladas. Ideal para transporte de carga pesada. Cotiza online.',
  catalog: [
    {
      slug: 'tracto-camion-mercedes-actros',
      name: 'Mercedes-Benz Actros',
      capacity: '50 t',
      shortDesc: 'Tracto camión Mercedes-Benz Actros de 50 t de tiro.',
      features: ['Motor V6', 'Cabina MegaSpace', 'Frenos ABS'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Tracto Camión Mercedes-Benz Actros.',
    },
    {
      slug: 'tracto-camion-volvo-fh16',
      name: 'Volvo FH16',
      capacity: '60 t',
      shortDesc: 'Tracto camión Volvo FH16 de 60 t de tiro para faenas mineras.',
      features: ['Motor 16L', 'I-Shift', 'Cabina Globetrotter'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Tracto Camión Volvo FH16.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de tracto camiones.',
};

const TR_CAMA_BAJA: RentalSubcategory = {
  slug: 'cama-baja',
  name: 'Cama-baja (Eager Beaver)',
  shortDesc: 'Camas-baja para transporte de maquinaria pesada y sobredimensionada.',
  description:
    'Arriendo de camas-baja en Chile para transporte de maquinaria pesada y cargas sobredimensionadas. Equipos tipo Eager Beaver con capacidad entre 25 y 80 toneladas, ideales para transporte de excavadoras, retroexcavadoras, generadores y equipos de gran tonelaje. Permisos de tránsito y escolta según requerimiento. Mantenimiento y seguros incluidos. Servicio disponible en zona norte y centro de Chile con respuesta operativa en menos de 48 horas. Solución especializada para proyectos de movimiento de maquinaria entre faenas.',
  features: [
    'Camas-baja tipo Eager Beaver de 25 a 80 toneladas.',
    'Permisos de tránsito y escolta según requerimiento.',
    'Mantenimiento y seguros incluidos.',
    'Disponibilidad 24/7 según requerimiento del proyecto.',
    'Ideal para transporte de maquinaria pesada entre faenas.',
  ],
  specs: [
    { label: 'Capacidad', value: '25 – 80 t' },
    { label: 'Largo útil', value: '8 – 14 m' },
    { label: 'Permisos', value: 'Incluidos' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Cama-baja en Chile',
  seoDescription:
    'Arriendo de camas-baja Eager Beaver de 25 a 80 t en Chile. Permisos de tránsito incluidos. Ideal para transporte de maquinaria pesada. Cotiza online.',
  catalog: [
    {
      slug: 'cama-baja-eager-beaver-50t',
      name: 'Eager Beaver 50 t',
      capacity: '50 t',
      shortDesc: 'Cama-baja Eager Beaver de 50 t para transporte de maquinaria.',
      features: ['Largo útil 12 m', 'Eje extensible', 'Rampas hidráulicas'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Cama-baja Eager Beaver 50 t.',
    },
    {
      slug: 'cama-baja-80t',
      name: 'Cama-baja 80 t',
      capacity: '80 t',
      shortDesc: 'Cama-baja de 80 t para transporte de maquinaria pesada y sobredimensionada.',
      features: ['Largo útil 14 m', 'Múltiples ejes', 'Permisos especiales'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Cama-baja 80 t.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de cama-baja Eager Beaver.',
};

const TR_SEMIREMOLQUES: RentalSubcategory = {
  slug: 'semiremolques',
  name: 'Semiremolques',
  shortDesc: 'Semiremolques para transporte de carga seca y contenedores.',
  description:
    'Arriendo de semiremolques en Chile para transporte de carga seca, contenedores y material de faena. Equipos con capacidad entre 25 y 40 toneladas, ideales para transporte interurbano de contenedores de 20 y 40 pies, y carga general en ruta. Acoplables a tracto camiones propios o contratados. Mantenimiento y seguros incluidos. Servicio disponible en zona norte y centro de Chile con respuesta operativa en menos de 48 horas. Solución flexible para flotas de transporte y empresas con tracto camiones propios.',
  features: [
    'Semiremolques de 25 a 40 toneladas de capacidad.',
    'Compatibles con contenedores de 20 y 40 pies.',
    'Mantenimiento y seguros incluidos.',
    'Disponibilidad 24/7 según requerimiento.',
    'Solución flexible para flotas de transporte.',
  ],
  specs: [
    { label: 'Capacidad', value: '25 – 40 t' },
    { label: 'Largo', value: '12 – 14 m' },
    { label: 'Tipo', value: 'Carga general / Container' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Semiremolques en Chile',
  seoDescription:
    'Arriendo de semiremolques de 25 a 40 t en Chile. Compatibles con contenedores de 20 y 40 pies. Mantenimiento y seguros incluidos. Cotiza online.',
  catalog: [
    {
      slug: 'semiremolque-carga-general',
      name: 'Semiremolque Carga General',
      capacity: '32 t',
      shortDesc: 'Semiremolque de carga general de 32 t para transporte interurbano.',
      features: ['Lona lateral', 'Piso de madera', 'Capacidad 32 t'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Semiremolque Carga General.',
    },
    {
      slug: 'semiremolque-container-40',
      name: 'Semiremolque Container 40 pies',
      capacity: '34 t',
      shortDesc: 'Semiremolque para contenedores de 40 pies, alta capacidad.',
      features: ['Tubo contenedor', 'King pin', 'Eje retráctil'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Semiremolque Container 40 pies.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de semiremolques.',
};

// ─────────────────────────────────────────────────────────────
// 4. EQUIPOS ESPECIALES
// ─────────────────────────────────────────────────────────────

const EE_TORRES_ILUMINACION: RentalSubcategory = {
  slug: 'torres-iluminacion',
  name: 'Torres de iluminación',
  shortDesc: 'Torres de iluminación portátil para faenas mineras e industriales.',
  description:
    'Arriendo de torres de iluminación portátil en Chile para faenas mineras, construcción e industria. Equipos con generador diésel incorporado y mástil telescópico de hasta 9 metros, iluminando hasta 4.000 m². Ideales para trabajo nocturno, continuidad operacional y faenas en zonas remotas sin red eléctrica. Combustible y mantenimiento incluidos. Servicio disponible en zona norte y centro de Chile con respuesta operativa en menos de 24 horas. Solución confiable para mantener la productividad en faenas que requieren iluminación continua.',
  features: [
    'Torres de iluminación con generador diésel y mástil telescópico de 9 m.',
    'Cobertura de hasta 4.000 m² con lámparas LED.',
    'Combustible y mantenimiento incluidos.',
    'Disponibilidad inmediata en zona norte y centro de Chile.',
    'Ideales para trabajo nocturno y faenas remotas.',
  ],
  specs: [
    { label: 'Altura mástil', value: '9 m' },
    { label: 'Cobertura', value: 'Hasta 4.000 m²' },
    { label: 'Autonomía', value: '60 – 80 horas' },
    { label: 'Disponibilidad', value: 'Inmediata' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Torres de Iluminación en Chile',
  seoDescription:
    'Arriendo de torres de iluminación portátil en Chile. Cobertura hasta 4.000 m². Combustible y mantenimiento incluidos. Cotiza online.',
  catalog: [
    {
      slug: 'torre-iluminacion-led-9m',
      name: 'Torre de Iluminación LED 9 m',
      capacity: '4.000 m²',
      shortDesc: 'Torre de iluminación LED con mástil de 9 m y generador diésel.',
      features: ['Mástil telescópico 9 m', 'Lámparas LED', 'Generador diésel'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Torre de Iluminación LED 9 m.',
    },
    {
      slug: 'torre-iluminacion-solar',
      name: 'Torre de Iluminación Solar',
      capacity: '3.000 m²',
      shortDesc: 'Torre de iluminación solar autónoma, cero emisiones.',
      features: ['Energía solar', 'Cero emisiones', 'Baterías de litio'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Torre de Iluminación Solar.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de torres de iluminación.',
};

const EE_BOMBAS_HORMIGON: RentalSubcategory = {
  slug: 'bombas-hormigon',
  name: 'Bombas de hormigón',
  shortDesc: 'Bombas de hormigón estacionarias y telescópicas para faena.',
  description:
    'Arriendo de bombas de hormigón en Chile para proyectos de construcción, faenas mineras y obras civiles. Equipos estacionarios y telescópicos con capacidad de bombeo entre 30 y 150 m³/h, presión hasta 85 bar y alcance de pluma hasta 62 metros en versiones telescópicas. Operadores certificados y mantenimiento incluidos. Servicio disponible en zona norte y centro de Chile con respuesta operativa en menos de 48 horas. Solución ideal para vaciado de hormigón en altura, distancia y zonas de difícil acceso.',
  features: [
    'Bombas estacionarias y telescópicas de 30 a 150 m³/h.',
    'Alcance de pluma hasta 62 m en versiones telescópicas.',
    'Operadores certificados con experiencia en faena.',
    'Mantenimiento y seguros incluidos.',
    'Disponibilidad 24/7 según requerimiento del proyecto.',
  ],
  specs: [
    { label: 'Capacidad', value: '30 – 150 m³/h' },
    { label: 'Presión', value: 'Hasta 85 bar' },
    { label: 'Operador', value: 'Incluido' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Bombas de Hormigón en Chile',
  seoDescription:
    'Arriendo de bombas de hormigón estacionarias y telescópicas en Chile. Capacidad hasta 150 m³/h. Operador certificado. Cotiza online.',
  catalog: [
    {
      slug: 'bomba-hormigon-estacionaria',
      name: 'Bomba de Hormigón Estacionaria',
      capacity: '70 m³/h',
      shortDesc: 'Bomba de hormigón estacionaria de 70 m³/h para vaciado continuo.',
      features: ['Capacidad 70 m³/h', 'Presión 70 bar', 'Operador certificado'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Bomba de Hormigón Estacionaria.',
    },
    {
      slug: 'bomba-hormigon-telescopica',
      name: 'Bomba de Hormigón Telescópica',
      capacity: '150 m³/h',
      shortDesc: 'Bomba telescópica de 150 m³/h con pluma de 62 m.',
      features: ['Pluma 62 m', 'Capacidad 150 m³/h', 'Operador con experiencia'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Bomba de Hormigón Telescópica.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de bombas de hormigón.',
};

const EE_COMPRESORES_AIRE: RentalSubcategory = {
  slug: 'compresores-aire',
  name: 'Compresores de aire',
  shortDesc: 'Compresores de aire portátiles diésel para faena.',
  description:
    'Arriendo de compresores de aire portátiles en Chile para faenas mineras, construcción e industria. Equipos diésel con capacidad entre 185 y 1.500 CFM y presión de trabajo entre 7 y 14 bar. Ideales para alimentar herramientas neumáticas, martillos, perforación y arenado. Combustible y mantenimiento incluidos. Servicio disponible en zona norte y centro de Chile con respuesta operativa en menos de 24 horas. Solución confiable para faenas que requieren aire comprimido en zonas remotas o temporales.',
  features: [
    'Compresores diésel de 185 a 1.500 CFM.',
    'Presión de trabajo de 7 a 14 bar.',
    'Combustible y mantenimiento incluidos.',
    'Disponibilidad inmediata en zona norte y centro de Chile.',
    'Ideales para herramientas neumáticas y arenado.',
  ],
  specs: [
    { label: 'Capacidad', value: '185 – 1.500 CFM' },
    { label: 'Presión', value: '7 – 14 bar' },
    { label: 'Motor', value: 'Diésel' },
    { label: 'Disponibilidad', value: 'Inmediata' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Compresores de Aire en Chile',
  seoDescription:
    'Arriendo de compresores de aire portátiles diésel en Chile. Capacidad 185 a 1.500 CFM. Combustible y mantenimiento incluidos. Cotiza online.',
  catalog: [
    {
      slug: 'compresor-aire-375cfm',
      name: 'Compresor de Aire 375 CFM',
      capacity: '375 CFM',
      shortDesc: 'Compresor diésel de 375 CFM, ideal para faenas medianas.',
      features: ['Motor diésel', 'Presión 12 bar', 'Remolcable'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Compresor de Aire 375 CFM.',
    },
    {
      slug: 'compresor-aire-900cfm',
      name: 'Compresor de Aire 900 CFM',
      capacity: '900 CFM',
      shortDesc: 'Compresor diésel de 900 CFM para faenas de gran envergadura.',
      features: ['Alta capacidad', 'Presión 14 bar', 'Remolcable'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Compresor de Aire 900 CFM.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de compresores de aire.',
};

const EE_GENERADORES_ELECTRICOS: RentalSubcategory = {
  slug: 'generadores-electricos',
  name: 'Generadores eléctricos',
  shortDesc: 'Generadores eléctricos diésel para faena y respaldo.',
  description:
    'Arriendo de generadores eléctricos diésel en Chile para faenas mineras, construcción e industria. Equipos con capacidad entre 20 y 1.500 kVA, ideales para respaldo energético, faenas remotas sin red eléctrica y suministro continuo. Tableros de transferencia automática, combustibles y mantenimiento incluidos. Servicio disponible en zona norte y centro de Chile con respuesta operativa en menos de 24 horas. Solución confiable para continuidad operacional y faenas con alta demanda eléctrica.',
  features: [
    'Generadores diésel de 20 a 1.500 kVA.',
    'Tableros de transferencia automática (ATS) opcionales.',
    'Combustible y mantenimiento incluidos.',
    'Disponibilidad 24/7 según requerimiento del proyecto.',
    'Ideales para respaldo y faenas remotas.',
  ],
  specs: [
    { label: 'Capacidad', value: '20 – 1.500 kVA' },
    { label: 'Voltaje', value: '220/380V – 50Hz' },
    { label: 'Motor', value: 'Diésel' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Generadores Eléctricos en Chile',
  seoDescription:
    'Arriendo de generadores eléctricos diésel de 20 a 1.500 kVA en Chile. Combustible y mantenimiento incluidos. Disponibilidad 24/7. Cotiza online.',
  catalog: [
    {
      slug: 'generador-electrico-250kva',
      name: 'Generador Eléctrico 250 kVA',
      capacity: '250 kVA',
      shortDesc: 'Generador diésel de 250 kVA para faenas industriales.',
      features: ['Capacidad 250 kVA', 'Cabina insonorizada', 'ATS opcional'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Generador Eléctrico 250 kVA.',
    },
    {
      slug: 'generador-electrico-500kva',
      name: 'Generador Eléctrico 500 kVA',
      capacity: '500 kVA',
      shortDesc: 'Generador diésel de 500 kVA para respaldo y faenas grandes.',
      features: ['Alta capacidad', 'Cabina insonorizada', 'Tablero digital'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Generador Eléctrico 500 kVA.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de generadores eléctricos.',
};

const EE_TERMOFUSIONADORAS: RentalSubcategory = {
  slug: 'termofusionadoras',
  name: 'Termofusión eléctrica',
  shortDesc: 'Equipos de termofusión eléctrica para unión de tuberías HDPE.',
  description:
    'Arriendo de equipos de termofusión eléctrica en Chile para unión de tuberías HDPE en proyectos mineros, sanitarios e industriales. Equipos con capacidad para soldar tuberías entre 20 mm y 1.200 mm de diámetro, con registro automático de parámetros de soldadura según normativa. Operadores certificados y mantenimiento incluidos. Servicio disponible en zona norte y centro de Chile con respuesta operativa en menos de 48 horas. Solución especializada para proyectos de tendido de tuberías de polietileno de alta densidad.',
  features: [
    'Equipos de termofusión para tuberías de 20 a 1.200 mm.',
    'Registro automático de parámetros de soldadura.',
    'Operadores certificados en termofusión HDPE.',
    'Mantenimiento y calibración incluidos.',
    'Disponibilidad según requerimiento del proyecto.',
  ],
  specs: [
    { label: 'Diámetro', value: '20 – 1.200 mm' },
    { label: 'Tipo', value: 'Eléctrica / Hidráulica' },
    { label: 'Operador', value: 'Incluido' },
    { label: 'Disponibilidad', value: 'Bajo pedido' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Termofusión Eléctrica en Chile',
  seoDescription:
    'Arriendo de equipos de termofusión eléctrica en Chile. Para tuberías HDPE de 20 a 1.200 mm. Operador certificado. Cotiza online.',
  catalog: [
    {
      slug: 'termofusionadora-630mm',
      name: 'Termofusionadora 630 mm',
      capacity: '630 mm',
      shortDesc: 'Equipo de termofusión eléctrica para tuberías HDPE hasta 630 mm.',
      features: ['Diámetro hasta 630 mm', 'Registro automático', 'Operador certificado'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Termofusionadora 630 mm.',
    },
    {
      slug: 'termofusionadora-1200mm',
      name: 'Termofusionadora 1.200 mm',
      capacity: '1.200 mm',
      shortDesc: 'Equipo de termofusión eléctrica de alta capacidad.',
      features: ['Diámetro hasta 1.200 mm', 'Sistema hidráulico', 'Registro digital'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Termofusionadora 1.200 mm.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de termofusión eléctrica.',
};

const EE_MEZCLADORAS_CANASTILLO: RentalSubcategory = {
  slug: 'mezcladoras-electricas-canastillo',
  name: 'Mezcladora eléctrica con canastillo',
  shortDesc: 'Mezcladora eléctrica con canastillo para trabajo en altura.',
  description:
    'Arriendo de mezcladora eléctrica con canastillo en Chile para faenas de construcción y minería. Equipo que combina una mezcladora de hormigón con un canastillo aéreo, ideal para vaciado y mezclado en altura sin necesidad de equipos auxiliares. Capacidad de mezclado entre 250 y 500 litros y altura de trabajo hasta 18 metros. Operador certificado y mantenimiento incluidos. Servicio disponible en zona norte y centro de Chile con respuesta operativa en menos de 48 horas. Solución especializada para faenas de difícil acceso y vaciado en altura.',
  features: [
    'Mezcladora eléctrica con canastillo aéreo integrado.',
    'Capacidad de mezclado de 250 a 500 litros.',
    'Altura de trabajo hasta 18 metros.',
    'Operador certificado en trabajo en altura.',
    'Mantenimiento y seguros incluidos.',
  ],
  specs: [
    { label: 'Capacidad', value: '250 – 500 L' },
    { label: 'Altura', value: 'Hasta 18 m' },
    { label: 'Operador', value: 'Incluido' },
    { label: 'Disponibilidad', value: 'Bajo pedido' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Mezcladora Eléctrica con Canastillo',
  seoDescription:
    'Arriendo de mezcladora eléctrica con canastillo en Chile. Capacidad 250 a 500 L, altura hasta 18 m. Operador certificado. Cotiza online.',
  catalog: [
    {
      slug: 'mezcladora-canastillo-350l',
      name: 'Mezcladora con Canastillo 350 L',
      capacity: '350 L',
      height: '14 m',
      shortDesc: 'Mezcladora eléctrica con canastillo de 350 L y altura 14 m.',
      features: ['Capacidad 350 L', 'Altura 14 m', 'Operador certificado'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Mezcladora con Canastillo 350 L.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de mezcladora eléctrica con canastillo.',
};

// ─────────────────────────────────────────────────────────────
// CATEGORÍAS
// ─────────────────────────────────────────────────────────────

export const RENTAL_CATEGORIES: RentalCategory[] = [
  {
    slug: 'izaje',
    name: 'Izaje',
    shortDesc: 'Grúas, alza-hombre y equipos para izaje de carga.',
    description:
      'Arriendo de equipos de izaje y alto tonelaje para la gran minería e industria en Chile. Grúas hidráulicas todo terreno (AT) y rough terrain (RT) desde 60 hasta 400 toneladas, camiones pluma, alza-hombre, plataformas aéreas y grúas horquilla con operadores certificados. Servicio 24/7 con planes de izaje, permisos de trabajo y supervisión técnica incluidos. Disponibilidad en zona norte (Atacama, Coquimbo, Antofagasta) y centro del país con respuesta operativa en menos de 48 horas.',
    heroImage: HERO,
    seoTitle: 'Arriendo de Equipos de Izaje en Chile',
    seoDescription:
      'Arriendo de grúas, alza-hombre y equipos de izaje en Chile. Hasta 400 toneladas. Operador certificado, 24/7. Cotiza online o por WhatsApp.',
    subcategories: [
      IZAJE_GRUAS_60,
      IZAJE_GRUAS_80,
      IZAJE_GRUAS_100,
      IZAJE_GRUAS_250,
      IZAJE_CAMIONES_PLUMA,
      IZAJE_ALZA_HOMBRE,
      IZAJE_GRUAS_HORQUILLA,
    ],
  },
  {
    slug: 'movimiento-de-tierra',
    name: 'Movimiento de tierra',
    shortDesc: 'Camiones tolva, retroexcavadoras y minicargadores.',
    description:
      'Arriendo de equipos para movimiento de tierra en Chile. Camiones tolva, retroexcavadoras hidráulicas y minicargadores compactos para proyectos de construcción, minería y obras civiles. Equipos con operadores certificados, combustibles y mantenimiento incluidos. Disponibilidad en zona norte y centro del país con respuesta operativa en menos de 48 horas. Solución completa para proyectos de excavación, nivelación, transporte de material y faenas urbanas.',
    heroImage: HERO,
    seoTitle: 'Arriendo de Equipos de Movimiento de Tierra',
    seoDescription:
      'Arriendo de camiones tolva, retroexcavadoras y minicargadores en Chile. Operador certificado, combustibles incluidos. Cotiza online o por WhatsApp.',
    subcategories: [MT_CAMIONES_TOLVA, MT_RETROEXCAVADORAS, MT_MINICARGADORES],
  },
  {
    slug: 'transporte',
    name: 'Transporte',
    shortDesc: 'Tracto camiones, camas-baja y semiremolques.',
    description:
      'Arriendo de equipos de transporte de carga pesada en Chile. Tracto camiones, camas-baja tipo Eager Beaver y semiremolques para transporte de maquinaria, contenedores y cargas sobredimensionadas en faenas mineras e industriales. Choferes con licencia A5, mantenimiento y seguros incluidos. Disponibilidad en zona norte y centro de Chile con respuesta operativa en menos de 48 horas. Solución completa para proyectos de transporte entre faenas y rutas mineras.',
    heroImage: HERO,
    seoTitle: 'Arriendo de Equipos de Transporte en Chile',
    seoDescription:
      'Arriendo de tracto camiones, camas-baja y semiremolques en Chile. Chofer con licencia A5, seguros incluidos. Cotiza online o por WhatsApp.',
    subcategories: [TR_TRACTO_CAMIONES, TR_CAMA_BAJA, TR_SEMIREMOLQUES],
  },
  {
    slug: 'equipos-especiales',
    name: 'Equipos especiales',
    shortDesc: 'Torres de iluminación, bombas, compresores, generadores.',
    description:
      'Arriendo de equipos especiales en Chile para faenas mineras, construcción e industria. Torres de iluminación portátil, bombas de hormigón, compresores de aire, generadores eléctricos, termofusión eléctrica y mezcladoras con canastillo. Equipos con mantenimiento, combustibles y seguros incluidos. Disponibilidad en zona norte y centro de Chile con respuesta operativa en menos de 24-48 horas. Solución completa para faenas con necesidades específicas de soporte operacional.',
    heroImage: HERO,
    seoTitle: 'Arriendo de Equipos Especiales en Chile',
    seoDescription:
      'Arriendo de torres de iluminación, bombas de hormigón, compresores y generadores en Chile. Mantenimiento y combustibles incluidos. Cotiza online.',
    subcategories: [
      EE_TORRES_ILUMINACION,
      EE_BOMBAS_HORMIGON,
      EE_COMPRESORES_AIRE,
      EE_GENERADORES_ELECTRICOS,
      EE_TERMOFUSIONADORAS,
      EE_MEZCLADORAS_CANASTILLO,
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

export function findCategory(slug: string): RentalCategory | undefined {
  return RENTAL_CATEGORIES.find((c) => c.slug === slug);
}

export function findSubcategory(
  categorySlug: string,
  subcategorySlug: string
): RentalSubcategory | undefined {
  return findCategory(categorySlug)?.subcategories.find((s) => s.slug === subcategorySlug);
}

export function findEquipment(
  categorySlug: string,
  subcategorySlug: string,
  equipmentSlug: string
): Equipment | undefined {
  return findSubcategory(categorySlug, subcategorySlug)?.catalog.find(
    (e) => e.slug === equipmentSlug
  );
}

export function getAllSubcategories(): Array<{
  category: RentalCategory;
  subcategory: RentalSubcategory;
}> {
  return RENTAL_CATEGORIES.flatMap((category) =>
    category.subcategories.map((subcategory) => ({ category, subcategory }))
  );
}
