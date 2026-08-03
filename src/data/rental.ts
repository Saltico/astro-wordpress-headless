// src/data/rental.ts
// Catálogo completo de equipos en arriendo.
// Fuente única de verdad para todas las páginas del catálogo /arriendo/*.

import heroImg from '@/assets/imgs/hero.jpg';
import gruaGrove60t from '@/assets/imgs/rental/izaje/grua/grua-grove-rt-765-e/grua-grove-rt-765-e.avif';
import gruaTerex80t from '@/assets/imgs/rental/izaje/grua/grua-terex-rt-780-e/grua-terex-rt-780-e.avif';
import gruaGrove100t from '@/assets/imgs/rental/izaje/grua/grua-grove-gmk-4100/grua-grove-gmk-4100.avif';
import gruaGrove250t from '@/assets/imgs/rental/izaje/grua/grua-grove-gmk-5250l/grua-grove-gmk-5250l.avif';
import camionPluma5t from '@/assets/imgs/rental/izaje/camion-pluma/camion-pluma-5-toneladas/camion-pluma-5-toneladas.avif';
import camionPluma6t from '@/assets/imgs/rental/izaje/camion-pluma/camion-pluma-6-toneladas/camion-pluma-6-toneladas.avif';
import camionPluma7t from '@/assets/imgs/rental/izaje/camion-pluma/camion-pluma-7-toneladas/camion-pluma-7-toneladas.avif';
import camionPluma8t from '@/assets/imgs/rental/izaje/camion-pluma/camion-pluma-8-toneladas/camion-pluma-8-toneladas.avif';
import camionPluma15t from '@/assets/imgs/rental/izaje/camion-pluma/camion-pluma-15-toneladas/camion-pluma-15-toneladas.avif';
import alzaHombre20m from '@/assets/imgs/rental/izaje/alza-hombre/alza-hombre-20-metros/alza-hombre-20-metros.avif';
import gruaHorquilla3t from '@/assets/imgs/rental/izaje/grua-horquilla/grua-horquilla-3-toneladas/grua-horquilla-3-toneladas.avif';
import gruaHorquilla7t from '@/assets/imgs/rental/izaje/grua-horquilla/grua-horquilla-7-toneladas/grua-horquilla-7-toneladas.avif';
import camionTolva12m3 from '@/assets/imgs/rental/movimiento-de-tierra/camion-tolva/camion-tolva-12-m3/camion-tolva-12-m3.avif';
import retroexcavadoraJohnDeere320d from '@/assets/imgs/rental/movimiento-de-tierra/retroexcavadora/retroexcavadora-john-deere-320d/retroexcavadora-john-deere-320d.avif';
import minicargadorVolvoMc90b from '@/assets/imgs/rental/movimiento-de-tierra/minicargador/minicargador-volvo-mc-90b/minicargador-volvo-mc-90b.avif';
import tractoCamionRenaultPremiumLander460 from '@/assets/imgs/rental/transporte/tracto-camion/tracto-camion-renault-premium-lander-460/tracto-camion-renault-premium-lander-460.avif';
import tractoCamionRenaultC520 from '@/assets/imgs/rental/transporte/tracto-camion/tracto-camion-renault-c-520/tracto-camion-renault-c-520.avif';
import tractoCamionRenaultT460 from '@/assets/imgs/rental/transporte/tracto-camion/tracto-camion-renault-t-460/tracto-camion-renault-t-460.avif';
import camaBajaEagerBeaver70t from '@/assets/imgs/rental/transporte/cama-baja/cama-baja-eager-beaver-70t/cama-baja-eager-beaver-70t.avif';
import semiremolqueRandon from '@/assets/imgs/rental/transporte/semiremolque/semiremolque-30-toneladas-randon/semiremolque-30-toneladas-randon.avif';
import semiremolqueGoren from '@/assets/imgs/rental/transporte/semiremolque/semiremolque-30-toneladas-goren/semiremolque-30-toneladas-goren.avif';
import torreIluminacion9mWackerNeuson from '@/assets/imgs/rental/equipos-especiales/torres-iluminacion/torre-iluminacion-9m-wacker-neuson/torre-iluminacion-9m-wacker-neuson.avif';
import torreIluminacion9mPramac from '@/assets/imgs/rental/equipos-especiales/torres-iluminacion/torre-iluminacion-9m-pramac/torre-iluminacion-9m-pramac.avif';
import torreIluminacion9mTerex from '@/assets/imgs/rental/equipos-especiales/torres-iluminacion/torre-iluminacion-9m-terex/torre-iluminacion-9m-terex.avif';
import bombaDeHormigonTruemaxTm50d from '@/assets/imgs/rental/equipos-especiales/bomba-de-hormigon/bomba-hormigon-truemax-tm50d/bomba-hormigon-truemax-tm50d.avif';
import compresorAireAirmanPds390s4B1 from '@/assets/imgs/rental/equipos-especiales/compresor-de-aire/compresor-aire-airman-pds390s-4b1/compresor-aire-airman-pds390s-4b1.avif';
import generadorElectrico6kvaEuropArdHdy from '@/assets/imgs/rental/equipos-especiales/generador-electrico/generador-electrico-europ-ard-hdy/generador-electrico-europ-ard-hdy.avif';
import generadorElectrico43kvaWackerNeuson from '@/assets/imgs/rental/equipos-especiales/generador-electrico/generador-electrico-43kva-wacker-neuson/generador-electrico-43kva-wacker-neuson.avif';
import generadorElectrico7kvaPromac from '@/assets/imgs/rental/equipos-especiales/generador-electrico/generador-electrico-7kva-promac/generador-electrico-7kva-promac.avif';
import generadorElectrico3kvaLoncinEmaresa from '@/assets/imgs/rental/equipos-especiales/generador-electrico/generador-electrico-3kva-loncin-emaresa/generador-electrico-3kva-loncin-emaresa.avif';
import termofusionadoraElectricaRitmo360mm from '@/assets/imgs/rental/equipos-especiales/termofusionadora-electrica/termofusionadora-electrica-360mm/termofusionadora-electrica-360mm.avif';
import termofusionadoraElectricaRitmo160mm from '@/assets/imgs/rental/equipos-especiales/termofusionadora-electrica/termofusionadora-electrica-160mm/termofusionadora-electrica-160mm.avif';
import rodilloCompactador from '@/assets/imgs/rental/equipos-especiales/rodillos/rodillo-compactador/rodillo-compactador.avif';
import placaCompactadora15kn from '@/assets/imgs/rental/equipos-especiales/placa-compactadora/placa-compactadora-15kn/placa-compactadora-15kn.avif';
import alisadoraPavimento915mm from '@/assets/imgs/rental/equipos-especiales/alisadora-de-pavimento/alisadora-de-pavimento-915mm/alisadora-de-pavimento-915mm.avif';
import vibropison21kn from '@/assets/imgs/rental/equipos-especiales/vibropison/vibropison-21kn/vibropison-21kn.avif';
import mezcladoraElectrica400lEmaresaHv400 from '@/assets/imgs/rental/equipos-especiales/mezcladora-electrica/mezcladora-electrica-400l/mezcladora-electrica-400l.avif';
import canastillaAlzaHombreMetalicoOrmet2MF from '@/assets/imgs/rental/equipos-especiales/canastillo-alza-hombre/canastillo-alza-hombre-metalico/canastillo-alza-hombre-metalico.avif';
import canastillaAlzaHombreFibraOrmet2VE from '@/assets/imgs/rental/equipos-especiales/canastillo-alza-hombre/canastillo-alza-hombre-fibra/canastillo-alza-hombre-fibra.avif';

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
const GRUA_GROVE_60T = gruaGrove60t.src;
const GRUA_TEREX_80T = gruaTerex80t.src;
const GRUA_GROVE_100T = gruaGrove100t.src;
const GRUA_GROVE_250T = gruaGrove250t.src;
const CAMION_PLUMA_5T = camionPluma5t.src;
const CAMION_PLUMA_6T = camionPluma6t.src;
const CAMION_PLUMA_7T = camionPluma7t.src;
const CAMION_PLUMA_8T = camionPluma8t.src;
const CAMION_PLUMA_15T = camionPluma15t.src;
const ALZA_HOMBRE_20M = alzaHombre20m.src;
const GRUA_HORQUILLA_3T = gruaHorquilla3t.src;
const GRUA_HORQUILLA_7T = gruaHorquilla7t.src;
const CAMION_TOLVA_12M3 = camionTolva12m3.src;
const RETROEXCAVADORA_JOHN_DEERE_320D = retroexcavadoraJohnDeere320d.src;
const MINICARGADOR_VOLVO_MC_90B = minicargadorVolvoMc90b.src;
const TRACTO_CAMION_RENAULT_PREMIUM_LANDER_460 = tractoCamionRenaultPremiumLander460.src;
const TRACTO_CAMION_RENAULT_C_520 = tractoCamionRenaultC520.src;
const TRACTO_CAMION_RENAULT_T_460 = tractoCamionRenaultT460.src;
const CAMA_BAJA_EAGER_BEAVER_70T = camaBajaEagerBeaver70t.src;
const SEMIREMOLQUE_RANDON = semiremolqueRandon.src;
const SEMIREMOLQUE_GOREN = semiremolqueGoren.src;
const TORRE_ILUMINACION_9M_WACKER_NEUSON = torreIluminacion9mWackerNeuson.src;
const TORRE_ILUMINACION_9M_PRAMAC = torreIluminacion9mPramac.src;
const TORRE_ILUMINACION_9M_TEREX = torreIluminacion9mTerex.src;
const BOMBA_HORMIGON_TRUEMAX_TM50D = bombaDeHormigonTruemaxTm50d.src;
const COMPRESOR_AIRE_AIRMAN_PDS390S_4B1 = compresorAireAirmanPds390s4B1.src;
const GENERADOR_ELECTRICO_6KVA_EUROP_ARD_HDY = generadorElectrico6kvaEuropArdHdy.src;
const GENERADOR_ELECTRICO_43KVA_WACKER_NEUSON = generadorElectrico43kvaWackerNeuson.src;
const GENERADOR_ELECTRICO_7KVA_PROMAC = generadorElectrico7kvaPromac.src;
const GENERADOR_ELECTRICO_3KVA_LONCIN_EMARESA = generadorElectrico3kvaLoncinEmaresa.src;
const TERMOFUSIONADORA_ELECTRICA_RITMO_360MM = termofusionadoraElectricaRitmo360mm.src;
const TERMOFUSIONADORA_ELECTRICA_RITMO_160MM = termofusionadoraElectricaRitmo160mm.src;
const RODILLO_COMPACTADOR = rodilloCompactador.src;
const PLACA_COMPACTADORA_15KN = placaCompactadora15kn.src;
const ALISADORA_PAVIMENTO_915MM = alisadoraPavimento915mm.src;
const VIBROPISON_21KN = vibropison21kn.src;
const MEZCLADORA_ELECTRICA_400L_EMARESA_HV_400 = mezcladoraElectrica400lEmaresaHv400.src;
const CANASTILLO_ALZA_HOMBRE_METALICO_ORMET_2MF = canastillaAlzaHombreMetalicoOrmet2MF.src;
const CANASTILLO_ALZA_HOMBRE_FIBRA_ORMET_2VE = canastillaAlzaHombreFibraOrmet2VE.src;

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
      slug: 'grua-grove-rt-765-e',
      name: 'Grove RT 765 E',
      capacity: '60 t',
      height: '43 m',
      shortDesc: 'Grúa compacta para montaje industrial y apoyo a obras civiles, capacidad de 60 toneladas con plumín telescópico y 4 ejes direccionales.',
      features: ['Motor Tier 4 Final', 'Plumín de 15 m', '4 ejes direccionales'],
      image: GRUA_GROVE_60T,
      whatsappMessage:
        'Hola IP, quisiera cotizar arriendo de Grúa Grove RT 765 E (60 t).',
    },
/*     {
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
    }, */
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
      slug: 'grua-terex-rt-780-e',
      name: 'Grúa Terex RT 780 E',
      capacity: '80 t',
      height: '47 m',
      shortDesc: 'Grúa Rough Terrain especialmente diseñada para trabajos dentro de faenas mineras y terrenos irregulares, capacidad de 80 toneladas con plumín de 18 m y 4 ejes direccionales.',
      features: ['Tracción 4x4', 'Excelente estabilidad', 'Ideal para terrenos difíciles'],
      image: GRUA_TEREX_80T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Terex RT 780 E (80 t).',
    },
/*     {
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
    }, */
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
      height: '60 m',
      shortDesc: 'Grúa todo terreno versátil para montajes estructurales, mantenimiento industrial y construcción. Capacidad de 100 toneladas con plumín telescópico de 17 m.',
      features: ['Bajo tiempo de instalación', 'Rápido traslado', 'Gran maniobrabilidad'],
      image: GRUA_GROVE_100T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Grove GMK 4100 (100 t).',
    },/* 
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
    }, */
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
      shortDesc: 'Grúa todo terreno de alta capacidad diseñada para montajes industriales, minería, energía e infraestructura pesada. Capacidad de 250 toneladas con plumín telescópico de 33 m.',
      features: ['deal para izajes críticos', 'Alta capacidad en espacios reducidos', 'Pluma telescópica de gran alcance'],
      image: GRUA_GROVE_250T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Grove GMK 5250L (250 t).',
    },
   /*  {
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
    }, */
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
      name: 'Camión Pluma Freightliner M2 106',
      capacity: '4,7 t',
      height: '18 m',
      shortDesc: 'Camión pluma ideal para transporte e instalación de materiales livianos y medianos. Capacidad de 4,7 toneladas ideal para faenas urbanas e industriales.',
      features: ['Brazo articulado', 'Effer 255 6S', 'Gran movilidad'],
      image: CAMION_PLUMA_5T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camión Pluma 4,7 t.',
    },
    {
      slug: 'camion-pluma-6-toneladas',
      name: 'Camión Pluma International 7600',
      capacity: '6,4 t',
      height: '22 m',
      shortDesc: 'Camión pluma de gran alcance para montaje industrial y movimiento de equipos. Capacidad de 6,4 toneladas ideal para faenas urbanas e industriales.',
      features: ['Excelente alcance hidráulico', 'Effer 375 8S', 'Ideal para mantenimiento industrial'],
      image: CAMION_PLUMA_6T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camión Pluma 6,4 t.',
    },
    {
      slug: 'camion-pluma-7-toneladas',
      name: 'Camión Pluma Man TGS 41.440 8x8',
      capacity: '7,6 t',
      height: '24 m',
      shortDesc: 'Camión pluma para trabajos pesados en minería y construcción. Capacidad de 7,6 toneladas con gran estabilidad',
      features: ['Tracción 8x8', 'Effer 455 8S', 'Excelente desempeño fuera de carretera'],
      image: CAMION_PLUMA_7T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camión Pluma 7,6 t.',
    },
    {
      slug: 'camion-pluma-8-toneladas',
      name: 'Camión Pluma Kenworth T 470',
      capacity: '8,1 t',
      height: '25 m',
      shortDesc: 'Camión pluma de alto rendimiento para montaje industrial y transporte especializado. Capacidad de 8,1 toneladas con brazo telescópico para faenas mineras.',
      features: ['Brazo telescópico', 'Effer 470 8S', 'Maniobrabilidad'],
      image: CAMION_PLUMA_8T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camión Pluma 8,1 t.',
    },
    {
      slug: 'camion-pluma-15-toneladas',
      name: 'Camión Pluma Man TGS 41.400 8x4',
      capacity: '15 t',
      height: '30 m',
      shortDesc: 'Camión pluma de gran capacidad para montaje de estructuras, equipos industriales y minería. Capacidad de 15 toneladas con brazo articulado y estabilizadores hidráulicos.',
      features: ['Gran alcance', 'Effer 855 8S', 'Elevada capacidad de levante'],
      image: CAMION_PLUMA_15T,
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
      slug: 'alza-hombre-20-metros',
      name: 'Alza-hombre Manitou 200 ATJ',
      capacity: '230 kg',
      height: '20 m',
      shortDesc: 'Plataforma articulada para trabajos seguros en altura. Alcance de 20 metros para trabajo en altura con obstáculos.',
      features: ['Brazo articulado', 'Tracción 4x4', 'Operador certificado'],
      image: ALZA_HOMBRE_20M,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Alza-hombre 20 m.',
    },
/*     {
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
    }, */
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
    'Arriendo de grúas horquilla diésel y eléctricas en Chile. Capacidad de 3 a 7 toneladas. Mantenimiento y seguros incluidos. Cotiza online.',
  catalog: [
    {
      slug: 'grua-horquilla-3-toneladas',
      name: 'Grúa Horquilla Doosan D30 S-5',
      capacity: '3 t',
      height: '3 m',
      shortDesc: 'Grúa horquilla para carga, descarga y logística industrial. Capacidad de 3 toneladas para faenas exteriores e industriales.',
      features: ['Excelente radio de giro', 'Bajo consumo', 'Fácil operación'],
      image: GRUA_HORQUILLA_3T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Horquilla de 3 t.',
    },
    {
      slug: 'grua-horquilla-7-toneladas',
      name: 'Grúa Horquilla Doosan D70 S-5',
      capacity: '7 t',
      height: '3 m',
      shortDesc: 'Grúa horquilla de gran capacidad para cargas pesadas. Capacidad de 7 toneladas para faenas indoor y bodegas.',
      features: ['Alta estabilidad', 'Excelente potencia', 'Bajo costo operativo'],
      image: GRUA_HORQUILLA_7T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Horquilla de 7 t.',
    },
/*     {
      slug: 'grua-horquilla-diesel-10t',
      name: 'Grúa Horquilla Diésel 10 t',
      capacity: '10 t',
      shortDesc: 'Grúa horquilla diésel de 10 t para carga pesada en faena.',
      features: ['Motor diésel', 'Mástil pesado', 'Cabina cerrada'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Horquilla Diésel 10 t.',
    }, */
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
    'Camiones tolva de alta capacidad capacidad.',
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
    'Arriendo de camiones tolva con chofer certificado en Chile. Ideal para movimiento de tierra y transporte de material. Cotiza online.',
  catalog: [
    {
      slug: 'camion-tolva-12-m3',
      name: 'Camión Tolva Volkswagen Constellation 31330',
      capacity: '12 m³',
      shortDesc: 'Camión tolva de 12 m³ para transporte de material en faena.',
      features: ['Tolva reforzada', 'Alta capacidad de carga', 'Chofer certificado'],
      image: CAMION_TOLVA_12M3,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camión Tolva 12 m³.',
    },
/*     {
      slug: 'camion-tolva-30m3',
      name: 'Camión Tolva 30 m³',
      capacity: '30 m³',
      shortDesc: 'Camión tolva de 30 m³ para proyectos de gran envergadura.',
      features: ['Tolva extra reforzada', 'Alta capacidad', 'Chofer con experiencia'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camión Tolva 30 m³.',
    }, */
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
      slug: 'retroexcavadora-john-deere-320d',
      name: 'Retroexcavadora John Deere 320D',
      capacity: '1 m³',
      height: '4,3 m',
      shortDesc: 'Retroexcavadora John Deere 320D con capacidad de 1 m³ para faenas urbanas y construcción.',
      features: ['Balde cargador frontal de 1,0 m³', 'Profundidad máxima de excavación de 4,3 m', 'Capacidad de levante del cargador de hasta 3.540 kg'],
      image: RETROEXCAVADORA_JOHN_DEERE_320D,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Retroexcavadora John Deere 320D.',
    },
/*     {
      slug: 'retroexcavadora-komatsu-pc200',
      name: 'Komatsu PC200',
      capacity: '20 t',
      shortDesc: 'Retroexcavadora Komatsu PC200 de 20 t para proyectos de gran envergadura.',
      features: ['Motor Tier 4', 'Cucharón reforzado', 'Operador certificado'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Retroexcavadora Komatsu PC200.',
    }, */
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
      slug: 'minicargador-volvo-mc-90b',
      name: 'Volvo MC 90B',
      capacity: '907 kg',
      height: '2,3 m',
      shortDesc: 'Volvo MC 90B con 907 kg de capacidad operativa para faenas urbanas y construcción.',
      features: ['Motor diésel', 'Cucharón estándar', 'Cabina cerrada'],
      image: MINICARGADOR_VOLVO_MC_90B,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Volvo MC 90B.',
    },
/*     {
      slug: 'minicargador-cat-226d',
      name: 'Caterpillar 226D',
      capacity: '1.2 t',
      shortDesc: 'Minicargador Caterpillar 226D de 1.2 t con alta versatilidad.',
      features: ['Motor Tier 4', 'Tracción alta', 'Operador certificado'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Minicargador Caterpillar 226D.',
    }, */
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
      slug: 'tracto-camion-renault-premium-lander-460',
      name: 'Renault Premium Lander 460',
      capacity: '50 t',
      shortDesc: 'Tracto camión Renault Premium Lander 460 de 50 t de tiro.',
      features: ['Motor V6', 'Cabina MegaSpace', 'Frenos ABS'],
      image: TRACTO_CAMION_RENAULT_PREMIUM_LANDER_460,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Tracto Camión Renault Premium Lander 460.',
    },
    {
      slug: 'tracto-camion-renault-c-520',
      name: 'Renault C-520',
      capacity: '60 t',
      shortDesc: 'Tracto camión Renault C-520 de 60 t de tiro para faenas mineras.',
      features: ['Motor de alta potencia', 'Excelente capacidad de arrastre', 'Cabina Globetrotter'],
      image: TRACTO_CAMION_RENAULT_C_520,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Tracto Camión Renault C-520.',
    },
    {
      slug: 'tracto-camion-renault-t-460',
      name: 'Renault T-460',
      capacity: '60 t',
      shortDesc: 'Tracto camión Renault T-460 de 60 t de tiro para faenas mineras.',
      features: ['Excelente eficiencia', 'Bajo consumo', 'Cabina confortable'],
      image: TRACTO_CAMION_RENAULT_T_460,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Tracto Camión Renault T-460.',
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
      slug: 'cama-baja-eager-beaver-70t',
      name: 'Cama Baja Eager Beaver 60 GSL',
      capacity: '70 t',
      height: '0,6 m',
      shortDesc: 'Cama-baja Eager Beaver de 70 t para transporte de maquinaria. Plataforma útil: 7,92 m largo x 3 m ancho.',
      features: ['Largo 17 metros', 'Ancho 3 metros', 'Rampas hidráulicas'],
      image: CAMA_BAJA_EAGER_BEAVER_70T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Cama-baja Eager Beaver 70 t.',
    },
/*     {
      slug: 'cama-baja-80t',
      name: 'Cama-baja 80 t',
      capacity: '80 t',
      shortDesc: 'Cama-baja de 80 t para transporte de maquinaria pesada y sobredimensionada.',
      features: ['Largo útil 14 m', 'Múltiples ejes', 'Permisos especiales'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Cama-baja 80 t.',
    }, */
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
      slug: 'semiremolque-30-toneladas-randon',
      name: 'Semiremolque Randon',
      capacity: '30 t',
      height: '1,4 m',
      shortDesc: 'Semiremolque de carga general de 30 toneladas para transporte interurbano.',
      features: ['Largo: 12 metros', 'Ancho: 2,5 metros', 'Alta resistencia'],
      image: SEMIREMOLQUE_RANDON,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Semiremolque Randon.',
    },
    {
      slug: 'semiremolque-30-toneladas-goren',
      name: 'Semiremolque Goren CB 3M',
      capacity: '30 t',
      height: '0,9 m',
      shortDesc: 'Semirremolque para transporte de maquinaria y carga general. Alta capacidad.',
      features: ['Largo: 12 metros', 'Ancho: 2,5 metros', 'Eje retráctil'],
      image: SEMIREMOLQUE_GOREN,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Semiremolque Goren CB 3M.',
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
      slug: 'torre-iluminacion-9m-wacker-neuson',
      name: 'Torre de Iluminación Wacler Neuson LTN 9 m',
      capacity: '4.000 m²',
      height: '9 m',
      shortDesc: 'Torre de iluminación diésel de alto rendimiento para faenas mineras, construcción, obras viales y montajes industriales, diseñada para entregar una amplia cobertura lumínica durante trabajos nocturnos.',
      features: ['Mástil telescópico 9 m', '4 focos de haluro metálico de alta intensidad', 'Motor diésel de bajo consumo'],
      image: TORRE_ILUMINACION_9M_WACKER_NEUSON,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Torre de Iluminación Wacler Neuson LTN LED 9 m.',
    },
    {
      slug: 'torre-iluminacion-9m-pramac',
      name: 'Torre de Iluminación Pramac LSW4T 9 m',
      capacity: '3.000 m²',
      height: '9 m',
      shortDesc: 'Torre de iluminación Pramac LSW4T con tecnología LED, diseñada para ofrecer máxima eficiencia energética, mayor autonomía y excelente cobertura lumínica en faenas de minería, construcción y eventos industriales.',
      features: ['4 focos LED de alta potencia y encendido instantáneo', 'Funcionamiento silencioso', 'Ideal para trabajos continuos durante la noche y operaciones 24/7'],
      image: TORRE_ILUMINACION_9M_PRAMAC,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Torre de Iluminación Pramac LSW4T 9 m.',
    },
    {
      slug: 'torre-iluminacion-9m-terex',
      name: 'Torre de Iluminación Terex RL4 9 m',
      capacity: '3.000 m²',
      height: '9 m',
      shortDesc: 'Torre de iluminación Terex RL4 con tecnología LED, diseñada para ofrecer máxima eficiencia energética, mayor autonomía y excelente cobertura lumínica en faenas de minería, construcción y eventos industriales.',
      features: ['Mástil telescópico de hasta 9 metros', 'Amplia cobertura de iluminación para grandes superficies', '4 focos de haluro metálico de alta intensidad'],
      image: TORRE_ILUMINACION_9M_TEREX,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Torre de Iluminación Terex RL4 9 m.',
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
      slug: 'bomba-hormigon-truemax-tm50d',
      name: 'Bomba de Hormigón Truemax TM50D',
      capacity: '50 m³/h',
      shortDesc: 'Bomba de hormigón Truemax TM50D de 50 m³/h para vaciado continuo.',
      features: ['Capacidad 50 m³/h', 'Presión 50 bar', 'Operador certificado'],
      image: BOMBA_HORMIGON_TRUEMAX_TM50D,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Bomba de Hormigón Truemax TM50D.',
    },
/*     {
      slug: 'bomba-hormigon-telescopica',
      name: 'Bomba de Hormigón Telescópica',
      capacity: '150 m³/h',
      shortDesc: 'Bomba telescópica de 150 m³/h con pluma de 62 m.',
      features: ['Pluma 62 m', 'Capacidad 150 m³/h', 'Operador con experiencia'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Bomba de Hormigón Telescópica.',
    }, */
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
      slug: 'compresor-aire-airman-pds390s-4b1',
      name: 'Compresor de Aire Airman PDS390S-4B1',
      capacity: '1 MPa - 11 m³/min',
      height: '1,87 m',
      shortDesc: 'Compresor diésel de Airman PDS390S-4B1, ideal para faenas medianas.',
      features: ['Motor diésel de bajo consumo y alta confiabilidad', 'Presión 10 bar', 'Remolcable'],
      image: COMPRESOR_AIRE_AIRMAN_PDS390S_4B1,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Compresor de Aire Airman PDS390S-4B1.',
    },
/*     {
      slug: 'compresor-aire-900cfm',
      name: 'Compresor de Aire 900 CFM',
      capacity: '900 CFM',
      shortDesc: 'Compresor diésel de 900 CFM para faenas de gran envergadura.',
      features: ['Alta capacidad', 'Presión 14 bar', 'Remolcable'],
      image: HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Compresor de Aire 900 CFM.',
    }, */
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
      slug: 'generador-electrico-6kva-europ-ard-hdy',
      name: 'Generador Eléctrico Europ ARD HDY 6000 LDE 6kVA',
      capacity: '6 kVA',
      height: '0,56 m',
      shortDesc: 'Generador diésel de 6 kVA para faenas industriales.',
      features: ['Potencia máxima de 6 kVA', 'Cabina insonorizada', 'ATS opcional'],
      image: GENERADOR_ELECTRICO_6KVA_EUROP_ARD_HDY,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Generador Eléctrico 6kVA.',
    },
    {
      slug: 'generador-electrico-43kva-wacker-neuson',
      name: 'Generador Eléctrico Wacker Neuson G43 43 kVA',
      capacity: '43 kVA',
      height: '1,65 m',
      shortDesc: 'Generador diésel de 43 kVA, de alta potencia diseñado para abastecer energía continua en proyectos de minería, construcción, plantas industriales y campamentos.',
      features: ['Motor diésel de alta eficiencia', 'Cabina insonorizada para reducir el nivel de ruido', 'Ideal para alimentar grúas, bombas, oficinas de faena, torres de iluminación y equipos eléctricos de mayor demanda'],
      image: GENERADOR_ELECTRICO_43KVA_WACKER_NEUSON,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Generador Eléctrico Wacker Neuson 43kVA.',
    },
    {
      slug: 'generador-electrico-3kva-loncin-emaresa',
      name: 'Generador Eléctrico Loncin Emaresa LC3800DC 3 kVA',
      capacity: '3 kVA',
      height: '0,47 m',
      shortDesc: 'Generador portátil a gasolina para respaldo eléctrico, herramientas eléctricas, iluminación y trabajos de mantención en terreno.',
      features: ['Potencia continua de 3,0 kW', 'Motor bencinero de fácil puesta en marcha', 'Regulación automática de voltaje (AVR)'],
      image: GENERADOR_ELECTRICO_3KVA_LONCIN_EMARESA,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Generador Eléctrico Loncin Emaresa LC3800DC 3kVA.',
    },
    {
      slug: 'generador-electrico-7kva-promac',
      name: 'Generador Eléctrico Promac 7 kVA',
      capacity: '7 kVA',
      height: '0,6 m',
      shortDesc: 'Generador portátil a gasolina para respaldo de energía en obras menores, mantenimiento industrial y faenas de construcción.',
      features: ['Motor bencinero de bajo consumo', 'Regulación automática de voltaje para una alimentación estable', 'Ideal para iluminación, herramientas eléctricas, oficinas de obra y equipos de baja demanda'],
      image: GENERADOR_ELECTRICO_7KVA_PROMAC,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Generador Eléctrico Promac 7kVA.',
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
      slug: 'termofusionadora-electrica-360mm',
      name: 'Termofusionadora Electrica Ritmo 360 mm',
      capacity: '360 mm',
      shortDesc: 'Termofusionadora hidráulica diseñada para la unión de tuberías y accesorios de HDPE, PP y otros materiales termoplásticos, ideal para proyectos de minería, conducción de agua, gas, relaves y obras civiles.',
      features: ['Diámetro hasta 360 mm', 'Placa calefactora con control electrónico de temperatura', 'Ideal para instalación de redes de agua, impulsión, relaves, gas y procesos industriales'],
      image: TERMOFUSIONADORA_ELECTRICA_RITMO_360MM,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Termofusionadora 360 mm.',
    },
    {
      slug: 'termofusionadora-electrica-160mm',
      name: 'Termofusionadora Electrica Ritmo 160 mm',
      capacity: '160 mm',
      shortDesc: 'Termofusionadora hidráulica compacta para la unión de tuberías de HDPE, PP, PP-R y PVDF, ideal para instalaciones de redes hidráulicas, minería, construcción e industria.',
      features: ['Rango de trabajo de 40 a 160 mm', 'Placa calefactora con recubrimiento de PTFE (teflón) y control digital de temperatura', 'Ideal para proyectos de agua potable, gas, minería, plantas industriales y obras civiles.'],
      image: TERMOFUSIONADORA_ELECTRICA_RITMO_160MM,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Termofusionadora 160 mm.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de termofusión eléctrica.',
};

const EE_RODILLOS: RentalSubcategory = {
  slug: 'rodillos',
  name: 'Rodillos Compactadores',
  shortDesc: 'Equipos de compactación y terminación de pavimentos',
  description:
    'Arriendo de rodillo vibratorio de doble tambor diseñado para la compactación de asfalto, bases granulares y suelos en obras de construcción, urbanización y mantenimiento vial.',
  features: [
    'Motor diésel de bajo consumo.',
    'Alto rendimiento con bajo costo de operación.',
    'Arranque eléctrico.',
    'Excelente maniobrabilidad en espacios reducidos.',
    'Disponibilidad según requerimiento del proyecto.',
  ],
  specs: [
    { label: 'Capacidad', value: '830kg' },
    { label: 'Rodillo', value: 'Vibratorio doble tambor' },
    { label: 'Motor', value: 'Diésel' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Rodillos compactadores',
  seoDescription:
    'Arriendo de equipos de Rodillos compactadores. Cotiza online.',
  catalog: [
    {
      slug: 'rodillo-compactador',
      name: 'Rodillo Compactador Wacker Neuson RD7H-ES',
      capacity: '830kg',
      shortDesc: 'Rodillo vibratorio de doble tambor diseñado para la compactación de asfalto, bases granulares y suelos en obras de construcción, urbanización y mantenimiento vial.',
      features: ['Peso operativo de 830 kg', 'Excelente maniobrabilidad en espacios reducidos', 'Ideal para instalación de redes de agua, Doble tambor vibratorio para una compactación uniforme'],
      image: RODILLO_COMPACTADOR,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Rodillo Compactador.',
    },
/*     {
      slug: 'termofusionadora-electrica-160mm',
      name: 'Termofusionadora Electrica Ritmo 160 mm',
      capacity: '160 mm',
      shortDesc: 'Termofusionadora hidráulica compacta para la unión de tuberías de HDPE, PP, PP-R y PVDF, ideal para instalaciones de redes hidráulicas, minería, construcción e industria.',
      features: ['Rango de trabajo de 40 a 160 mm', 'Placa calefactora con recubrimiento de PTFE (teflón) y control digital de temperatura', 'Ideal para proyectos de agua potable, gas, minería, plantas industriales y obras civiles.'],
      image: TERMOFUSIONADORA_ELECTRICA_RITMO_160MM,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Termofusionadora 160 mm.',
    }, */
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de rodillo compactador.',
};

const EE_PLACAS_COMPACTADORAS: RentalSubcategory = {
  slug: 'placas-compactadoras',
  name: 'Placas Compactadores',
  shortDesc: 'Equipos de compactación y terminación de pavimentos',
  description:
    'Arriendo de placa compactadora diseñado para la compactación de asfalto, bases granulares y suelos en obras de construcción, urbanización y mantenimiento vial.',
  features: [
    'Motor Bencinero de bajo consumo.',
    'Alto rendimiento con bajo costo de operación.',
    'Arranque eléctrico.',
    'Excelente maniobrabilidad en espacios reducidos.',
    'Disponibilidad según requerimiento del proyecto.',
  ],
  specs: [
    { label: 'Fuerza centrifuga', value: '15kN' },
    { label: 'Diseño', value: 'Compacto' },
    { label: 'Motor', value: 'Bencinero' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Placas Compactadoras',
  seoDescription:
    'Arriendo de equipos de Placas compactadoras. Cotiza online.',
  catalog: [
    {
      slug: 'placa-compactadora-15kn',
      name: 'Placa Compactadora Wacker Neuson WP1550 LOW V/B',
      capacity: '15kN',
      shortDesc: 'Placa compactadora unidireccional para compactación de suelos granulares, arena, gravilla y adoquines en proyectos de construcción y obras civiles.',
      features: ['Fuerza de compactación de 15 kN', 'Motor a gasolina de alta confiabilidad', 'Ideal para veredas, zanjas, pavimentos intertrabados y trabajos de paisajismo'],
      image: PLACA_COMPACTADORA_15KN,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Placa Compactadora.',
    },
/*     {
      slug: 'termofusionadora-electrica-160mm',
      name: 'Termofusionadora Electrica Ritmo 160 mm',
      capacity: '160 mm',
      shortDesc: 'Termofusionadora hidráulica compacta para la unión de tuberías de HDPE, PP, PP-R y PVDF, ideal para instalaciones de redes hidráulicas, minería, construcción e industria.',
      features: ['Rango de trabajo de 40 a 160 mm', 'Placa calefactora con recubrimiento de PTFE (teflón) y control digital de temperatura', 'Ideal para proyectos de agua potable, gas, minería, plantas industriales y obras civiles.'],
      image: TERMOFUSIONADORA_ELECTRICA_RITMO_160MM,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Termofusionadora 160 mm.',
    }, */
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de rodillo compactador.',
};

const EE_ALISADORA_PAVIMENTO: RentalSubcategory = {
  slug: 'alisadora-de-pavimento',
  name: 'Alisadora de Pavimentos',
  shortDesc: 'Equipos de compactación y terminación de pavimentos',
  description:
    'Arriendo de alisadora de pavimentos para acabado profesional. Cotiza online.',
  features: [
    'Motor Bencinero de bajo consumo.',
    'Alto rendimiento con bajo costo de operación.',
    'Arranque eléctrico.',
    'Excelente maniobrabilidad en espacios reducidos.',
    'Disponibilidad según requerimiento del proyecto.',
  ],
  specs: [
    { label: 'Diámetro', value: '915mm' },
    { label: 'Diseño', value: 'Compacto' },
    { label: 'Motor', value: 'Bencinero' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Alisadora de Pavimentos',
  seoDescription:
    'Arriendo de Alisadora de Pavimentos. Cotiza online.',
  catalog: [
    {
      slug: 'alisadora-de-pavimento-915mm',
      name: 'Alisadora de Pavimento 915mm Wacker Neuson CT 36-9',
      capacity: '915mm',
      shortDesc: 'Alisadora de pavimentos para el acabado profesional de superficies de hormigón, proporcionando un terminado uniforme y de alta calidad en obras civiles e industriales.',
      features: ['Diámetro de trabajo de 36 pulgadas', 'Diseño robusto para uso intensivo', 'Ideal para losas industriales, pavimentos, radieres y fundaciones'],
      image: ALISADORA_PAVIMENTO_915MM,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Alisadora de Pavimentos 915mm Wacker Neuson CT 36-9.',
    },
/*     {
      slug: 'termofusionadora-electrica-160mm',
      name: 'Termofusionadora Electrica Ritmo 160 mm',
      capacity: '160 mm',
      shortDesc: 'Termofusionadora hidráulica compacta para la unión de tuberías de HDPE, PP, PP-R y PVDF, ideal para instalaciones de redes hidráulicas, minería, construcción e industria.',
      features: ['Rango de trabajo de 40 a 160 mm', 'Placa calefactora con recubrimiento de PTFE (teflón) y control digital de temperatura', 'Ideal para proyectos de agua potable, gas, minería, plantas industriales y obras civiles.'],
      image: TERMOFUSIONADORA_ELECTRICA_RITMO_160MM,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Termofusionadora 160 mm.',
    }, */
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Alisadora de Pavimentos.',
};

const EE_VIBROPISON: RentalSubcategory = {
  slug: 'vibropison',
  name: 'Vibropisón',
  shortDesc: 'Equipos de compactación y terminación de pavimentos',
  description:
    'Arriendo de equipo compactador de suelos para acabado profesional. Cotiza online.',
  features: [
    'Motor diésel Yanmar de bajo consumo.',
    'Alto rendimiento con bajo costo de operación.',
    'Construcción robusta para uso intensivo en faena.',
    'Excelente maniobrabilidad en espacios reducidos.',
    'Disponibilidad según requerimiento del proyecto.',
  ],
  specs: [
    { label: 'Fuerza', value: '21kN' },
    { label: 'Diseño', value: 'Compacto' },
    { label: 'Motor', value: 'Diésel' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Vibropisón',
  seoDescription:
    'Arriendo de Alisadora de Vibropisón. Cotiza online.',
  catalog: [
    {
      slug: 'vibropison-21kn',
      name: 'Vibropisón 21kN Wacker Neuson DS70',
      capacity: '21kN',
      shortDesc: 'Vibropisón diésel de alto rendimiento diseñado para la compactación de suelos cohesivos, zanjas, rellenos y áreas de difícil acceso en proyectos de construcción, minería y obras civiles.',
      features: ['Fuerza de impacto de 21 kN', 'Alta eficiencia para compactación de suelos arcillosos y mixtos', 'Ideal para obras sanitarias, fundaciones, canalizaciones y trabajos de compactación localizada'],
      image: VIBROPISON_21KN,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Vibropisón 21kN Wacker Neuson DS70.',
    },
/*     {
      slug: 'termofusionadora-electrica-160mm',
      name: 'Termofusionadora Electrica Ritmo 160 mm',
      capacity: '160 mm',
      shortDesc: 'Termofusionadora hidráulica compacta para la unión de tuberías de HDPE, PP, PP-R y PVDF, ideal para instalaciones de redes hidráulicas, minería, construcción e industria.',
      features: ['Rango de trabajo de 40 a 160 mm', 'Placa calefactora con recubrimiento de PTFE (teflón) y control digital de temperatura', 'Ideal para proyectos de agua potable, gas, minería, plantas industriales y obras civiles.'],
      image: TERMOFUSIONADORA_ELECTRICA_RITMO_160MM,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Termofusionadora 160 mm.',
    }, */
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Vibropisón.',
};

const EE_MEZCLADORAS_ELECTRICAS: RentalSubcategory = {
  slug: 'mezcladoras-electricas',
  name: 'Mezcladora eléctrica',
  shortDesc: 'Mezcladora eléctrica.',
  description:
    'Mezcladora eléctrica de hormigón de uso profesional, diseñada para la preparación eficiente de concreto en proyectos de construcción, minería y obras civiles. Su gran capacidad y sistema de volteo lateral permiten una operación rápida, segura y de alto rendimiento.',
  features: [
    'Tambor fabricado en acero de alta resistencia para trabajos intensivos.',
    'Capacidad de mezclado de 250 a 500 litros.',
    'Corona de fundición resistente al desgaste y de larga vida útil.',
    'Chasis robusto con ruedas para facilitar el traslado dentro de la faena.',
    'Sistema de volteo lateral que facilita la descarga del hormigón.',
  ],
  specs: [
    { label: 'Capacidad', value: '250 – 500 L' },
    { label: 'Rendimiento', value: '4,0 a 4,5m³ por hora' },
    { label: 'Sistema', value: 'Volteo lateral' },
    { label: 'Disponibilidad', value: 'Bajo pedido' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Mezcladora Eléctrica',
  seoDescription:
    'Arriendo de mezcladora eléctrica en Chile. Capacidad 250 a 500 L, altura hasta 18 m. Operador certificado. Cotiza online.',
  catalog: [
    {
      slug: 'mezcladora-electrica-400l',
      name: 'Mezcladora Eléctrica 400L Emaresa HV-400',
      capacity: '400 L',
      height: '1,65 m',
      shortDesc: 'Mezcladora eléctrica de hormigón de uso profesional, diseñada para la preparación eficiente de concreto en proyectos de construcción, minería y obras civiles.',
      features: ['Capacidad 400 L', 'Motor eléctrico de 3 HP (2,2 kW) con alimentación monofásica de 220 V', 'Producción aproximada de 4 m³/h, ideal para obras de mediana y gran envergadura'],
      image: MEZCLADORA_ELECTRICA_400L_EMARESA_HV_400,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Mezcladora Eléctrica 400L Emaresa HV-400.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar Arriendo de Mezcladora Eléctrica 400L Emaresa HV-400.',
};

const EE_CANASTILLOS_ALZA_HOMBRE: RentalSubcategory = {
  slug: 'canastillos-alza-hombre',
  name: 'Canastilos Alza Hombre',
  shortDesc: 'Canastilos Alza Hombre.',
  description:
    'Canastillo certificado para trabajos en altura mediante camión pluma o grúa articulada. Diseñado para realizar labores de montaje, mantenimiento e inspección con altos estándares de seguridad.',
  features: [
    'Piso antideslizante para mayor seguridad del operador.',
    'Compatible con camiones pluma, grúas articuladas y otros equipos de izaje autorizados.',
    'Puntos de anclaje para arnés de seguridad.',
    'Construcción robusta para uso en minería, construcción, electricidad y mantenimiento industrial.',
  ],
  specs: [
    { label: 'Capacidad', value: '200kg' },
    { label: 'Cantidad', value: '2 personas' },
    { label: 'Disponibilidad', value: 'Bajo pedido' },
  ],
  heroImage: HERO,
  seoTitle: 'Arriendo de Canastilos Alza Hombre',
  seoDescription:
    'Arriendo de Canastilos Alza Hombre en Chile. Capacidad 200 Kg. Cotiza online.',
  catalog: [
    {
      slug: 'canastillo-alza-hombre-metalico',
      name: 'Canastillo Alza Hombre Metálico Ormet 2MF',
      capacity: '200kg',
      height: '1,11m',
      shortDesc: 'Canastillo metálico certificado para trabajos en altura mediante camión pluma o grúa articulada. Diseñado para realizar labores de montaje, mantenimiento e inspección con altos estándares de seguridad.',
      features: ['Capacidad para 2 personas o hasta 200 kg de carga', 'Fabricado en acero de alta resistencia para trabajos exigentes', 'Cumple con estándares europeos para trabajos en altura'],
      image: CANASTILLO_ALZA_HOMBRE_METALICO_ORMET_2MF,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Canastillo Alza Hombre Metálico Ormet 2MF.',
    },
    {
      slug: 'canastillo-alza-hombre-fibra',
      name: 'Canastillo Alza Hombre de Fibra Ormet 2VE',
      capacity: '200kg',
      height: '1,11m',
      shortDesc: 'Canastillo de fibra de vidrio reforzada para trabajos en altura con camión pluma o grúa articulada. Su material no conductor lo hace especialmente adecuado para labores cercanas a instalaciones eléctricas, además de aplicaciones industriales y mineras.',
      features: ['Capacidad para 2 personas o hasta 200 kg de carga', 'Material no conductor, ideal para trabajos próximos a redes eléctricas', 'Peso aproximado de 99 kg y dimensiones cercanas a 1.400 × 1.110 × 700 mm'],
      image: CANASTILLO_ALZA_HOMBRE_FIBRA_ORMET_2VE,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Canastillo Alza Hombre Metálico Ormet 2MF.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar Arriendo de Canastillo Alza Hombre Metálico Ormet 2MF.',
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
      EE_RODILLOS,
      EE_PLACAS_COMPACTADORAS,
      EE_ALISADORA_PAVIMENTO,
      EE_VIBROPISON,
      EE_MEZCLADORAS_ELECTRICAS,
      EE_CANASTILLOS_ALZA_HOMBRE,
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
