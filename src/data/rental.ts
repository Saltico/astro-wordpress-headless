// src/data/rental.ts
// Catálogo completo de equipos en arriendo.
// Fuente única de verdad para todas las páginas del catálogo /arriendo/*.

import heroImg from '@/assets/imgs/hero.jpg';
import izajeHero from '@/assets/imgs/hero/arriendo/izaje/izaje.avif';
import gruasHero from '@/assets/imgs/hero/arriendo/izaje/gruas/gruas.avif';
// Hero images for categories
import movimientoTierraHero from '@/assets/imgs/hero/arriendo/movimiento-de-tierra/movimiento-de-tierra.avif';
import transporteHero from '@/assets/imgs/hero/arriendo/transporte/transporte.avif';
import equiposEspecialesHero from '@/assets/imgs/hero/arriendo/equipos-especiales/equipos-especiales.avif';
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

export interface EquipmentSpec {
  /** Nombre del atributo (ej: "Capacidad máxima", "Motor") */
  attribute: string;
  /** Valor del atributo (ej: "60 t", "Cummins QSB 5.9") */
  value: string;
}

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
  
  // ─── Campos para página de detalle (opcionales) ───
  /** Marca del equipo (ej: "Grove", "Volvo") */
  brand?: string;
  /** Descripción larga del equipo para página de detalle */
  description?: string;
  /** Especificaciones técnicas completas (tabla Atributo/Propiedades) */
  specs?: EquipmentSpec[];
  /** URL de ficha técnica PDF (placeholder en v1) */
  techSheetUrl?: string;
  /** Galería de imágenes adicionales */
  gallery?: string[];
  /** Slugs de equipos relacionados */
  relatedSlugs?: string[];
  /** Title tag personalizado para SEO */
  seoTitle?: string;
  /** Meta description personalizado para SEO */
  seoDescription?: string;
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
  /** Imagen del hero (fondo completo con overlay) */
  heroImage: string;
  /** Imagen del cuerpo (sección "Qué incluye"). Si no se define, usa heroImage como fallback. */
  bodyImage?: string;
  /** Alt text para bodyImage. Si no se define, usa el nombre de la subcategoría. */
  bodyImageAlt?: string;
  /** Title tag pre-formateado */
  seoTitle: string;
  /** Meta description (150-160 chars) */
  seoDescription: string;
  /** Catálogo de equipos disponibles */
  catalog: Equipment[];
  /** Mensaje WhatsApp por defecto de la sub-ruta */
  whatsappMessage: string;
  /** Equipos complementarios de otras categorías para internal linking */
  relatedCrossCategory?: Array<{
    categorySlug: string;
    subcategorySlug: string;
  }>;
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
const IZAJE_HERO = izajeHero.src;
const GRUAS_HERO = gruasHero.src;
const MOVIMIENTO_TIERRA_HERO = movimientoTierraHero.src;
const TRANSPORTE_HERO = transporteHero.src;
const EQUIPOS_ESPECIALES_HERO = equiposEspecialesHero.src;
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
  heroImage: IZAJE_HERO,
  bodyImage: GRUA_GROVE_60T,
  bodyImageAlt: 'Grúa Grove RT 765 E de 60 toneladas en faena',
  seoTitle: 'Arriendo de Grúas de 60 Toneladas',
  seoDescription:
    'Arriendo de grúas de 60 toneladas con operador certificado en Chile. Equipos Grove, Tadano y Liebherr. Hasta 50 m de altura. Cotiza online.',
  catalog: [
    {
      slug: 'grua-grove-rt-765-e',
      name: 'Grove RT 765 E',
      brand: 'Grove',
      capacity: '60 t',
      height: '43 m',
      shortDesc: 'Grúa compacta para montaje industrial y apoyo a obras civiles, capacidad de 60 toneladas con plumín telescópico y 4 ejes direccionales.',
      description: 'La Grove RT 765 E es una grúa rough terrain de 60 toneladas diseñada para montaje industrial y apoyo a obras civiles. Su diseño compacto con 4 ejes direccionales le permite operar en espacios reducidos, mientras que su plumín telescópico de 15 m extiende su alcance para tareas de izaje más complejas. Equipada con motor Tier 4 Final, ofrece bajo consumo de combustible y cumplimiento de normativas ambientales. Ideal para faenas de minería, construcción e industria donde la maniobrabilidad y la capacidad de izaje son críticas.',
      features: ['Motor Tier 4 Final', 'Plumín de 15 m', '4 ejes direccionales'],
      specs: [
        { attribute: 'Capacidad máxima', value: '60 t' },
        { attribute: 'Pluma principal', value: '11.6 – 43 m' },
        { attribute: 'Plumín telescópico', value: '7.6 – 15 m' },
        { attribute: 'Motor', value: 'Cummins QSB 5.9 Tier 4' },
        { attribute: 'Potencia', value: '209 kW / 280 HP' },
        { attribute: 'Peso operativo', value: '43.6 t' },
        { attribute: 'Ejes', value: '4 ejes direccionales' },
        { attribute: 'Velocidad máxima', value: '40 km/h' },
      ],
      image: GRUA_GROVE_60T,
      gallery: [GRUA_GROVE_60T, GRUA_GROVE_60T, GRUA_GROVE_60T],
      techSheetUrl: '/docs/fichas/grua-grove-rt-765-e.pdf',
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Grove RT 765 E (60 t).',
      relatedSlugs: ['grua-terex-rt-780-e', 'grua-grove-gmk-4100'],
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
  heroImage: IZAJE_HERO,
  bodyImage: GRUA_TEREX_80T,
  bodyImageAlt: 'Grúa Terex RT 780 E de 80 toneladas en faena minera',
  seoTitle: 'Arriendo de Grúas de 80 Toneladas',
  seoDescription:
    'Arriendo de grúas de 80 toneladas con operador certificado en Chile. Equipos Grove, Tadano y Liebherr. Hasta 60 m de altura. Solicita cotización.',
  catalog: [
    {
      slug: 'grua-terex-rt-780-e',
      name: 'Grúa Terex RT 780 E',
      brand: 'Terex',
      capacity: '80 t',
      height: '47 m',
      shortDesc: 'Grúa Rough Terrain especialmente diseñada para trabajos dentro de faenas mineras y terrenos irregulares, capacidad de 80 toneladas con plumín de 18 m y 4 ejes direccionales.',
      description: 'La Terex RT 780 E es una grúa Rough Terrain de 80 toneladas especialmente diseñada para trabajos dentro de faenas mineras y terrenos irregulares. Su configuración 4x4 y tracción integral le permiten operar en condiciones adversas, mientras que su plumín de 18 m extiende su alcance para tareas de izaje pesado. Equipada con sistema de control avanzado y cabina climatizada, ofrece comodidad y precisión en operaciones críticas. Ideal para minería, construcción de infraestructura y montajes industriales en terrenos difíciles.',
      features: ['Tracción 4x4', 'Excelente estabilidad', 'Ideal para terrenos difíciles'],
      specs: [
        { attribute: 'Capacidad máxima', value: '80 t' },
        { attribute: 'Pluma principal', value: '13.1 – 47 m' },
        { attribute: 'Plumín', value: '18 m' },
        { attribute: 'Motor', value: 'Diésel turboalimentado' },
        { attribute: 'Potencia', value: '298 kW / 400 HP' },
        { attribute: 'Peso operativo', value: '54 t' },
        { attribute: 'Tracción', value: '4x4' },
        { attribute: 'Ejes', value: '4 ejes direccionales' },
      ],
      image: GRUA_TEREX_80T,
      gallery: [GRUA_TEREX_80T, GRUA_TEREX_80T, GRUA_TEREX_80T],
      techSheetUrl: '/docs/fichas/grua-terex-rt-780-e.pdf',
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Terex RT 780 E (80 t).',
      relatedSlugs: ['grua-grove-rt-765-e', 'grua-grove-gmk-4100'],
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
  heroImage: IZAJE_HERO,
  bodyImage: GRUA_GROVE_100T,
  bodyImageAlt: 'Grúa Grove GMK 4100 de 100 toneladas en faena',
  seoTitle: 'Arriendo de Grúas de 100 Toneladas',
  seoDescription:
    'Arriendo de grúas de 100 toneladas con operador certificado en Chile. Equipos Grove, Liebherr y Tadano. Hasta 88 m de altura. Cotiza online.',
  catalog: [
    {
      slug: 'grua-grove-gmk-4100',
      name: 'Grove GMK 4100',
      brand: 'Grove',
      capacity: '100 t',
      height: '60 m',
      shortDesc: 'Grúa todo terreno versátil para montajes estructurales, mantenimiento industrial y construcción. Capacidad de 100 toneladas con plumín telescópico de 17 m.',
      description: 'La Grove GMK 4100 es una grúa todo terreno de 100 toneladas diseñada para montajes estructurales, mantenimiento industrial y proyectos de construcción de gran envergadura. Su sistema de pluma telescópica con plumín de 17 m proporciona un alcance excepcional, mientras que su diseño de 5 ejes garantiza estabilidad en cargas pesadas. Equipada con sistema de control MEGS y cabina ergonómica, ofrece precisión y comodidad en operaciones prolongadas. Ideal para minería, energía e infraestructura pesada.',
      features: ['Bajo tiempo de instalación', 'Rápido traslado', 'Gran maniobrabilidad'],
      specs: [
        { attribute: 'Capacidad máxima', value: '100 t' },
        { attribute: 'Pluma principal', value: '13.8 – 60 m' },
        { attribute: 'Plumín telescópico', value: '10.7 – 17 m' },
        { attribute: 'Motor', value: 'Mercedes-Benz OM 460 LA' },
        { attribute: 'Potencia', value: '390 kW / 530 HP' },
        { attribute: 'Peso operativo', value: '72 t' },
        { attribute: 'Ejes', value: '5 ejes' },
        { attribute: 'Velocidad máxima', value: '75 km/h' },
      ],
      image: GRUA_GROVE_100T,
      gallery: [GRUA_GROVE_100T, GRUA_GROVE_100T, GRUA_GROVE_100T],
      techSheetUrl: '/docs/fichas/grua-grove-gmk-4100.pdf',
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Grove GMK 4100 (100 t).',
      relatedSlugs: ['grua-grove-gmk-5250l', 'grua-grove-rt-765-e'],
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
  heroImage: IZAJE_HERO,
  bodyImage: GRUA_GROVE_250T,
  bodyImageAlt: 'Grúa Grove GMK 5250L de 250 toneladas en faena',
  seoTitle: 'Arriendo de Grúas de 250 Toneladas',
  seoDescription:
    'Arriendo de grúas de 250 toneladas con operador certificado en Chile. Equipos Grove, Liebherr y Tadano. Hasta 130 m de altura. Disponibilidad inmediata.',
  catalog: [
    {
      slug: 'grua-grove-gmk-5250l',
      name: 'Grove GMK 5250L',
      brand: 'Grove',
      capacity: '250 t',
      height: '120 m',
      shortDesc: 'Grúa todo terreno de alta capacidad diseñada para montajes industriales, minería, energía e infraestructura pesada. Capacidad de 250 toneladas con plumín telescópico de 33 m.',
      description: 'La Grove GMK 5250L es una grúa todo terreno de 250 toneladas de alta capacidad, diseñada para los proyectos más exigentes de montajes industriales, minería, energía e infraestructura pesada. Su pluma telescópica de 120 m con plumín de 33 m proporciona un alcance excepcional para izajes críticos. Equipada con sistema de control MEGS y 6 ejes direccionales, ofrece precisión y estabilidad en cargas de alto tonelaje. Ideal para montaje de aerogeneradores, equipos de proceso y estructuras de gran envergadura.',
      features: ['Ideal para izajes críticos', 'Alta capacidad en espacios reducidos', 'Pluma telescópica de gran alcance'],
      specs: [
        { attribute: 'Capacidad máxima', value: '250 t' },
        { attribute: 'Pluma principal', value: '17.4 – 120 m' },
        { attribute: 'Plumín telescópico', value: '11.8 – 33 m' },
        { attribute: 'Motor', value: 'Mercedes-Benz OM 471' },
        { attribute: 'Potencia', value: '550 kW / 748 HP' },
        { attribute: 'Peso operativo', value: '108 t' },
        { attribute: 'Ejes', value: '6 ejes direccionales' },
        { attribute: 'Velocidad máxima', value: '70 km/h' },
      ],
      image: GRUA_GROVE_250T,
      gallery: [GRUA_GROVE_250T, GRUA_GROVE_250T, GRUA_GROVE_250T],
      techSheetUrl: '/docs/fichas/grua-grove-gmk-5250l.pdf',
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Grove GMK 5250L (250 t).',
      relatedSlugs: ['grua-grove-gmk-4100', 'grua-grove-rt-765-e'],
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
  heroImage: IZAJE_HERO,
  bodyImage: CAMION_PLUMA_5T,
  bodyImageAlt: 'Camión pluma Freightliner M2 106 de 4,7 toneladas en faena',
  seoTitle: 'Arriendo de Camiones Pluma',
  seoDescription:
    'Arriendo de camiones pluma de 3 a 15 toneladas en Chile. Operador certificado, combustible y seguros incluidos. Disponibilidad inmediata. Cotiza online.',
  catalog: [
    {
      slug: 'camion-pluma-5-toneladas',
      name: 'Camión Pluma Freightliner M2 106',
      brand: 'Freightliner',
      capacity: '4,7 t',
      height: '18 m',
      shortDesc: 'Camión pluma ideal para transporte e instalación de materiales livianos y medianos. Capacidad de 4,7 toneladas ideal para faenas urbanas e industriales.',
      description: 'El Camión Pluma Freightliner M2 106 con capacidad de 4,7 toneladas es la solución ideal para transporte e instalación de materiales livianos y medianos en faenas urbanas e industriales. Equipado con brazo articulado Effer 255 6S, ofrece excelente maniobrabilidad y precisión en el posicionamiento de cargas. Su diseño compacto le permite operar en espacios reducidos, mientras que su cabina ergonómica garantiza comodidad para el operador. Perfecto para proyectos de construcción, mantenimiento industrial y logística de materiales.',
      features: ['Brazo articulado', 'Effer 255 6S', 'Gran movilidad'],
      specs: [
        { attribute: 'Capacidad de carga', value: '4,7 t' },
        { attribute: 'Alcance máximo', value: '18 m' },
        { attribute: 'Motor', value: 'Cummins ISB 6.7L' },
        { attribute: 'Potencia', value: '260 HP' },
        { attribute: 'Transmisión', value: 'Automática Allison' },
        { attribute: 'Brazo', value: 'Effer 255 6S articulado' },
        { attribute: 'Peso bruto vehicular', value: '12 t' },
      ],
      image: CAMION_PLUMA_5T,
      gallery: [CAMION_PLUMA_5T, CAMION_PLUMA_5T, CAMION_PLUMA_5T],
      techSheetUrl: '/docs/fichas/camion-pluma-5-toneladas.pdf',
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camión Pluma 4,7 t.',
      relatedSlugs: ['camion-pluma-6-toneladas', 'camion-pluma-7-toneladas'],
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
  
    {
      slug: 'camion-pluma-renault-c440',
      name: 'Camión Pluma Renault C440',
      brand: 'Renault',
      capacity: 'Consultar',
      shortDesc: 'Camión Pluma Renault C440, incorporado desde inventario interno. Año(s): 2023, 2024. Unidades registradas: 2.',
      features: ['Marca: Renault', 'Modelo: C440', 'Año(s) inventario: 2023, 2024'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: CAMION_PLUMA_5T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camión Pluma Renault C440.',
    },
    {
      slug: 'camion-pluma-renault-k480',
      name: 'Camión Pluma Renault K480',
      brand: 'Renault',
      capacity: 'Consultar',
      shortDesc: 'Camión Pluma Renault K480, incorporado desde inventario interno. Año(s): 2019. Unidades registradas: 1.',
      features: ['Marca: Renault', 'Modelo: K480', 'Año(s) inventario: 2019'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: CAMION_PLUMA_5T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camión Pluma Renault K480.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de camiones pluma.',
  relatedCrossCategory: [
    { categorySlug: 'transporte', subcategorySlug: 'cama-baja' },
  ],
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
  heroImage: IZAJE_HERO,
  bodyImage: ALZA_HOMBRE_20M,
  bodyImageAlt: 'Alza-hombre Manitou 200 ATJ articulado de 20 metros',
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
    {
      slug: 'plataforma-alza-hombre-genie-z80-60',
      name: 'Plataforma / Alza-hombre Genie Z80 60',
      brand: 'Genie',
      capacity: 'Consultar',
      shortDesc: 'Plataforma / Alza-hombre Genie Z80 60, incorporado desde inventario interno. Año(s): 2020. Unidades registradas: 1.',
      features: ['Marca: Genie', 'Modelo: Z80 60', 'Año(s) inventario: 2020'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: ALZA_HOMBRE_20M,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Plataforma / Alza-hombre Genie Z80 60.',
    },
    {
      slug: 'plataforma-alza-hombre-genie-z80-60-4x4',
      name: 'Plataforma / Alza-hombre Genie Z80 60 4X4',
      brand: 'Genie',
      capacity: 'Consultar',
      shortDesc: 'Plataforma / Alza-hombre Genie Z80 60 4X4, incorporado desde inventario interno. Año(s): 2020. Unidades registradas: 1.',
      features: ['Marca: Genie', 'Modelo: Z80 60 4X4', 'Año(s) inventario: 2020'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: ALZA_HOMBRE_20M,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Plataforma / Alza-hombre Genie Z80 60 4X4.',
    },
    {
      slug: 'plataforma-alza-hombre-genie-zx13570',
      name: 'Plataforma / Alza-hombre Genie ZX13570',
      brand: 'Genie',
      capacity: 'Consultar',
      shortDesc: 'Plataforma / Alza-hombre Genie ZX13570, incorporado desde inventario interno. Año(s): 2025. Unidades registradas: 1.',
      features: ['Marca: Genie', 'Modelo: ZX13570', 'Año(s) inventario: 2025'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: ALZA_HOMBRE_20M,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Plataforma / Alza-hombre Genie ZX13570.',
    },
    {
      slug: 'plataforma-alza-hombre-haulotte-ha41px',
      name: 'Plataforma / Alza-hombre Haulotte HA41PX',
      brand: 'Haulotte',
      capacity: 'Consultar',
      shortDesc: 'Plataforma / Alza-hombre Haulotte HA41PX, incorporado desde inventario interno. Año(s): 2014. Unidades registradas: 2.',
      features: ['Marca: Haulotte', 'Modelo: HA41PX', 'Año(s) inventario: 2014'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: ALZA_HOMBRE_20M,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Plataforma / Alza-hombre Haulotte HA41PX.',
    },
    {
      slug: 'plataforma-alza-hombre-manitou-mango12',
      name: 'Plataforma / Alza-hombre Manitou MANGO12',
      brand: 'Manitou',
      capacity: 'Consultar',
      shortDesc: 'Plataforma / Alza-hombre Manitou MANGO12, incorporado desde inventario interno. Año(s): 2021. Unidades registradas: 1.',
      features: ['Marca: Manitou', 'Modelo: MANGO12', 'Año(s) inventario: 2021'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: ALZA_HOMBRE_20M,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Plataforma / Alza-hombre Manitou MANGO12.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de alza-hombre.',
};

const IZAJE_GRUAS_160: RentalSubcategory = {
  slug: 'gruas-160-toneladas',
  name: 'Grúas de 160 toneladas',
  shortDesc: 'Grúas de 160 toneladas para izaje pesado.',
  description:
    'Grúas de 160 toneladas para izaje pesado. Equipos incorporados desde el inventario vigente. Las capacidades y configuraciones específicas deben confirmarse al momento de cotizar.',
  features: [
    'Equipos disponibles según inventario vigente.',
    'Configuración y capacidad sujetas al modelo disponible.',
    'Mantenimiento preventivo según programa operacional.',
    'Disponibilidad sujeta a programación de faena.',
  ],
  specs: [
    { label: 'Capacidad', value: 'Según modelo' },
    { label: 'Disponibilidad', value: 'Consultar' },
  ],
  // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia de esta subcategoría.
  heroImage: IZAJE_HERO,
  seoTitle: 'Arriendo de Grúas de 160 toneladas en Chile',
  seoDescription:
    'Arriendo de grúas de 160 toneladas en Chile. Consulta disponibilidad, configuración y condiciones de arriendo.',
  catalog: [
    {
      slug: 'grua-demag-ac160-5',
      name: 'Grúa Demag AC160 5',
      brand: 'Demag',
      capacity: 'Consultar',
      shortDesc: 'Grúa Demag AC160 5, incorporado desde inventario interno. Año(s): 2020, 2023. Unidades registradas: 2.',
      features: ['Marca: Demag', 'Modelo: AC160 5', 'Año(s) inventario: 2020, 2023'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GRUA_GROVE_250T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Demag AC160 5.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de grúas de 160 toneladas.',
};

const IZAJE_GRUAS_400: RentalSubcategory = {
  slug: 'gruas-400-toneladas',
  name: 'Grúas de 400 toneladas',
  shortDesc: 'Grúas de 400 toneladas para maniobras de gran tonelaje.',
  description:
    'Grúas de 400 toneladas para maniobras de gran tonelaje. Equipos incorporados desde el inventario vigente. Las capacidades y configuraciones específicas deben confirmarse al momento de cotizar.',
  features: [
    'Equipos disponibles según inventario vigente.',
    'Configuración y capacidad sujetas al modelo disponible.',
    'Mantenimiento preventivo según programa operacional.',
    'Disponibilidad sujeta a programación de faena.',
  ],
  specs: [
    { label: 'Capacidad', value: 'Según modelo' },
    { label: 'Disponibilidad', value: 'Consultar' },
  ],
  // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia de esta subcategoría.
  heroImage: IZAJE_HERO,
  seoTitle: 'Arriendo de Grúas de 400 toneladas en Chile',
  seoDescription:
    'Arriendo de grúas de 400 toneladas en Chile. Consulta disponibilidad, configuración y condiciones de arriendo.',
  catalog: [
    {
      slug: 'grua-grove-gmk6400',
      name: 'Grúa Grove GMK6400',
      brand: 'Grove',
      capacity: 'Consultar',
      shortDesc: 'Grúa Grove GMK6400, incorporado desde inventario interno. Año(s): 2021. Unidades registradas: 1.',
      features: ['Marca: Grove', 'Modelo: GMK6400', 'Año(s) inventario: 2021'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GRUA_GROVE_250T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Grove GMK6400.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de grúas de 400 toneladas.',
};

const IZAJE_GRUAS_ALTO_TONELAJE: RentalSubcategory = {
  slug: 'gruas-alto-tonelaje',
  name: 'Grúas de alto tonelaje',
  shortDesc: 'Grúas de alto tonelaje disponibles para proyectos industriales y mineros.',
  description:
    'Grúas de alto tonelaje disponibles para proyectos industriales y mineros. Equipos incorporados desde el inventario vigente. Las capacidades y configuraciones específicas deben confirmarse al momento de cotizar.',
  features: [
    'Equipos disponibles según inventario vigente.',
    'Configuración y capacidad sujetas al modelo disponible.',
    'Mantenimiento preventivo según programa operacional.',
    'Disponibilidad sujeta a programación de faena.',
  ],
  specs: [
    { label: 'Capacidad', value: 'Según modelo' },
    { label: 'Disponibilidad', value: 'Consultar' },
  ],
  // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia de esta subcategoría.
  heroImage: IZAJE_HERO,
  seoTitle: 'Arriendo de Grúas de alto tonelaje en Chile',
  seoDescription:
    'Arriendo de grúas de alto tonelaje en Chile. Consulta disponibilidad, configuración y condiciones de arriendo.',
  catalog: [
    {
      slug: 'grua-grove-gmk-5250xl-1',
      name: 'Grúa Grove GMK 5250XL-1',
      brand: 'Grove',
      capacity: 'Consultar',
      shortDesc: 'Grúa Grove GMK 5250XL-1, incorporado desde inventario interno. Año(s): 2025. Unidades registradas: 1.',
      features: ['Marca: Grove', 'Modelo: GMK 5250XL-1', 'Año(s) inventario: 2025'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GRUA_GROVE_250T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Grove GMK 5250XL-1.',
    },
    {
      slug: 'grua-tadano-gr1000xl',
      name: 'Grúa Tadano GR1000XL',
      brand: 'Tadano',
      capacity: 'Consultar',
      shortDesc: 'Grúa Tadano GR1000XL, incorporado desde inventario interno. Año(s): 2024. Unidades registradas: 1.',
      features: ['Marca: Tadano', 'Modelo: GR1000XL', 'Año(s) inventario: 2024'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GRUA_GROVE_250T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Tadano GR1000XL.',
    },
    {
      slug: 'grua-tadano-gr1200xl',
      name: 'Grúa Tadano GR1200XL',
      brand: 'Tadano',
      capacity: 'Consultar',
      shortDesc: 'Grúa Tadano GR1200XL, incorporado desde inventario interno. Año(s): 2025. Unidades registradas: 1.',
      features: ['Marca: Tadano', 'Modelo: GR1200XL', 'Año(s) inventario: 2025'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GRUA_GROVE_250T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Tadano GR1200XL.',
    },
    {
      slug: 'grua-tadano-gr1300xl',
      name: 'Grúa Tadano GR1300XL',
      brand: 'Tadano',
      capacity: 'Consultar',
      shortDesc: 'Grúa Tadano GR1300XL, incorporado desde inventario interno. Año(s): 2023. Unidades registradas: 1.',
      features: ['Marca: Tadano', 'Modelo: GR1300XL', 'Año(s) inventario: 2023'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GRUA_GROVE_250T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Tadano GR1300XL.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de grúas de alto tonelaje.',
};

const IZAJE_MANIPULADORES_TELESCOPICOS: RentalSubcategory = {
  slug: 'manipuladores-telescopicos',
  name: 'Manipuladores telescópicos',
  shortDesc: 'Manipuladores telescópicos para carga, montaje y apoyo de faena.',
  description:
    'Manipuladores telescópicos para carga, montaje y apoyo de faena. Equipos incorporados desde el inventario vigente. Las capacidades y configuraciones específicas deben confirmarse al momento de cotizar.',
  features: [
    'Equipos disponibles según inventario vigente.',
    'Configuración y capacidad sujetas al modelo disponible.',
    'Mantenimiento preventivo según programa operacional.',
    'Disponibilidad sujeta a programación de faena.',
  ],
  specs: [
    { label: 'Capacidad', value: 'Según modelo' },
    { label: 'Disponibilidad', value: 'Consultar' },
  ],
  // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia de esta subcategoría.
  heroImage: IZAJE_HERO,
  seoTitle: 'Arriendo de Manipuladores telescópicos en Chile',
  seoDescription:
    'Arriendo de manipuladores telescópicos en Chile. Consulta disponibilidad, configuración y condiciones de arriendo.',
  catalog: [
    {
      slug: 'manipulador-telescopico-dieci-icarus-45-17-gd-4x4',
      name: 'Manipulador Telescópico Dieci ICARUS 45 17 GD 4X4',
      brand: 'Dieci',
      capacity: 'Consultar',
      shortDesc: 'Manipulador Telescópico Dieci ICARUS 45 17 GD 4X4, incorporado desde inventario interno. Año(s): 2025. Unidades registradas: 1.',
      features: ['Marca: Dieci', 'Modelo: ICARUS 45 17 GD 4X4', 'Año(s) inventario: 2025'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: ALZA_HOMBRE_20M,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Manipulador Telescópico Dieci ICARUS 45 17 GD 4X4.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de manipuladores telescópicos.',
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
  heroImage: IZAJE_HERO,
  bodyImage: GRUA_HORQUILLA_3T,
  bodyImageAlt: 'Grúa horquilla Doosan D30 S-5 de 3 toneladas',
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
    {
      slug: 'grua-horquilla-hancha-grua-horq-cpcd70-xrw28b',
      name: 'Grúa Horquilla Hancha GRUA HORQ CPCD70-XRW28B',
      brand: 'Hancha',
      capacity: 'Consultar',
      shortDesc: 'Grúa Horquilla Hancha GRUA HORQ CPCD70-XRW28B, incorporado desde inventario interno. Año(s): 2022. Unidades registradas: 1.',
      features: ['Marca: Hancha', 'Modelo: GRUA HORQ CPCD70-XRW28B', 'Año(s) inventario: 2022'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GRUA_HORQUILLA_3T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Horquilla Hancha GRUA HORQ CPCD70-XRW28B.',
    },
    {
      slug: 'grua-horquilla-komatsu-fd50at-10fv',
      name: 'Grúa Horquilla Komatsu FD50AT 10FV',
      brand: 'Komatsu',
      capacity: 'Consultar',
      shortDesc: 'Grúa Horquilla Komatsu FD50AT 10FV, incorporado desde inventario interno. Año(s): 2021. Unidades registradas: 1.',
      features: ['Marca: Komatsu', 'Modelo: FD50AT 10FV', 'Año(s) inventario: 2021'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GRUA_HORQUILLA_3T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Horquilla Komatsu FD50AT 10FV.',
    },
    {
      slug: 'grua-horquilla-konecranes-f16-600c',
      name: 'Grúa Horquilla Konecranes F16-600C',
      brand: 'Konecranes',
      capacity: 'Consultar',
      shortDesc: 'Grúa Horquilla Konecranes F16-600C, incorporado desde inventario interno. Año(s): 2021, 2024. Unidades registradas: 2.',
      features: ['Marca: Konecranes', 'Modelo: F16-600C', 'Año(s) inventario: 2021, 2024'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GRUA_HORQUILLA_3T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Horquilla Konecranes F16-600C.',
    },
    {
      slug: 'grua-horquilla-zoomlion-fb25',
      name: 'Grúa Horquilla Zoomlion FB25',
      brand: 'Zoomlion',
      capacity: 'Consultar',
      shortDesc: 'Grúa Horquilla Zoomlion FB25, incorporado desde inventario interno. Año(s): 2025. Unidades registradas: 1.',
      features: ['Marca: Zoomlion', 'Modelo: FB25', 'Año(s) inventario: 2025'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GRUA_HORQUILLA_3T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Horquilla Zoomlion FB25.',
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
  heroImage: MOVIMIENTO_TIERRA_HERO,
  bodyImage: CAMION_TOLVA_12M3,
  bodyImageAlt: 'Camión tolva Volkswagen Constellation 31330 de 12 m³',
  seoTitle: 'Arriendo de Camiones Tolva en Chile',
  seoDescription:
    'Arriendo de camiones tolva con chofer certificado en Chile. Ideal para movimiento de tierra y transporte de material. Responde en 24h.',
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
  heroImage: MOVIMIENTO_TIERRA_HERO,
  bodyImage: RETROEXCAVADORA_JOHN_DEERE_320D,
  bodyImageAlt: 'Retroexcavadora John Deere 320D en faena de construcción',
  seoTitle: 'Arriendo de Retroexcavadoras en Chile',
  seoDescription:
    'Arriendo de retroexcavadoras hidráulicas con operador en Chile. Equipos de 8 a 25 toneladas, profundidad hasta 6 m. Cotiza online.',
  catalog: [
    {
      slug: 'retroexcavadora-john-deere-320d',
      name: 'Retroexcavadora John Deere 320D',
      brand: 'John Deere',
      capacity: '1 m³',
      height: '4,3 m',
      shortDesc: 'Retroexcavadora John Deere 320D con capacidad de 1 m³ para faenas urbanas y construcción.',
      description: 'La Retroexcavadora John Deere 320D es un equipo versátil diseñado para faenas urbanas y de construcción. Con capacidad de balde de 1 m³ y profundidad de excavación de 4,3 m, es ideal para zanjas, fundaciones y movimiento de tierra en espacios confinados. Su motor diésel de bajo consumo y sistema hidráulico de alta eficiencia garantizan productividad y ahorro de combustible. Cabina climatizada con controles ergonómicos para máxima comodidad del operador.',
      features: ['Balde cargador frontal de 1,0 m³', 'Profundidad máxima de excavación de 4,3 m', 'Capacidad de levante del cargador de hasta 3.540 kg'],
      specs: [
        { attribute: 'Capacidad balde retro', value: '1,0 m³' },
        { attribute: 'Capacidad balde cargador', value: '1,0 m³' },
        { attribute: 'Profundidad excavación', value: '4,3 m' },
        { attribute: 'Motor', value: 'John Deere PowerTech 4.5L' },
        { attribute: 'Potencia', value: '97 HP / 72 kW' },
        { attribute: 'Peso operativo', value: '8.680 kg' },
        { attribute: 'Capacidad levante', value: '3.540 kg' },
      ],
      image: RETROEXCAVADORA_JOHN_DEERE_320D,
      gallery: [RETROEXCAVADORA_JOHN_DEERE_320D, RETROEXCAVADORA_JOHN_DEERE_320D],
      techSheetUrl: '/docs/fichas/retroexcavadora-john-deere-320d.pdf',
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Retroexcavadora John Deere 320D.',
      relatedSlugs: ['minicargador-volvo-mc-90b', 'camion-tolva-12-m3'],
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
    {
      slug: 'retroexcavadora-john-deere-310p',
      name: 'Retroexcavadora John Deere 310P',
      brand: 'John Deere',
      capacity: 'Consultar',
      shortDesc: 'Retroexcavadora John Deere 310P, incorporado desde inventario interno. Año(s): 2025. Unidades registradas: 1.',
      features: ['Marca: John Deere', 'Modelo: 310P', 'Año(s) inventario: 2025'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: RETROEXCAVADORA_JOHN_DEERE_320D,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Retroexcavadora John Deere 310P.',
    },
    {
      slug: 'retroexcavadora-john-deere-310sl',
      name: 'Retroexcavadora John Deere 310SL',
      brand: 'John Deere',
      capacity: 'Consultar',
      shortDesc: 'Retroexcavadora John Deere 310SL, incorporado desde inventario interno. Año(s): 2023. Unidades registradas: 1.',
      features: ['Marca: John Deere', 'Modelo: 310SL', 'Año(s) inventario: 2023'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: RETROEXCAVADORA_JOHN_DEERE_320D,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Retroexcavadora John Deere 310SL.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de retroexcavadoras.',
  relatedCrossCategory: [
    { categorySlug: 'transporte', subcategorySlug: 'camiones-tolva' },
  ],
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
  heroImage: MOVIMIENTO_TIERRA_HERO,
  bodyImage: MINICARGADOR_VOLVO_MC_90B,
  bodyImageAlt: 'Minicargador Volvo MC 90B en faena urbana',
  seoTitle: 'Arriendo de Minicargadores en Chile',
  seoDescription:
    'Arriendo de minicargadores con operador en Chile. Equipos Bobcat, Caterpillar y Case. Ideales para espacios reducidos. Consulta disponibilidad por región.',
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
    {
      slug: 'minicargador-john-deere-324g',
      name: 'Minicargador John Deere 324G',
      brand: 'John Deere',
      capacity: 'Consultar',
      shortDesc: 'Minicargador John Deere 324G, incorporado desde inventario interno. Año(s): 2023, 2024. Unidades registradas: 2.',
      features: ['Marca: John Deere', 'Modelo: 324G', 'Año(s) inventario: 2023, 2024'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: MINICARGADOR_VOLVO_MC_90B,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Minicargador John Deere 324G.',
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
  heroImage: TRANSPORTE_HERO,
  bodyImage: TRACTO_CAMION_RENAULT_PREMIUM_LANDER_460,
  bodyImageAlt: 'Tracto camión Renault Premium Lander 460 en ruta minera',
  seoTitle: 'Arriendo de Tracto Camiones en Chile',
  seoDescription:
    'Arriendo de tracto camiones con chofer en Chile. Capacidad de tiro hasta 60 toneladas. Ideal para transporte de carga pesada. Solicita cotización.',
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
    {
      slug: 'tracto-camion-man-tgs-26480',
      name: 'Tracto Camión MAN TGS 26480',
      brand: 'MAN',
      capacity: 'Consultar',
      shortDesc: 'Tracto Camión MAN TGS 26480, incorporado desde inventario interno. Año(s): 2025. Unidades registradas: 1.',
      features: ['Marca: MAN', 'Modelo: TGS 26480', 'Año(s) inventario: 2025'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRACTO_CAMION_RENAULT_PREMIUM_LANDER_460,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Tracto Camión MAN TGS 26480.',
    },
    {
      slug: 'tracto-camion-man-tgx-26-480-bls-6x4',
      name: 'Tracto Camión MAN TGX 26.480 BLS 6X4',
      brand: 'MAN',
      capacity: 'Consultar',
      shortDesc: 'Tracto Camión MAN TGX 26.480 BLS 6X4, incorporado desde inventario interno. Año(s): 2023. Unidades registradas: 1.',
      features: ['Marca: MAN', 'Modelo: TGX 26.480 BLS 6X4', 'Año(s) inventario: 2023'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRACTO_CAMION_RENAULT_PREMIUM_LANDER_460,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Tracto Camión MAN TGX 26.480 BLS 6X4.',
    },
    {
      slug: 'tracto-camion-mercedes-benz-new-actros-2658-ls-stream',
      name: 'Tracto Camión Mercedes Benz NEW ACTROS 2658 LS STREAM',
      brand: 'Mercedes Benz',
      capacity: 'Consultar',
      shortDesc: 'Tracto Camión Mercedes Benz NEW ACTROS 2658 LS STREAM, incorporado desde inventario interno. Año(s): 2021. Unidades registradas: 1.',
      features: ['Marca: Mercedes Benz', 'Modelo: NEW ACTROS 2658 LS STREAM', 'Año(s) inventario: 2021'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRACTO_CAMION_RENAULT_PREMIUM_LANDER_460,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Tracto Camión Mercedes Benz NEW ACTROS 2658 LS STREAM.',
    },
    {
      slug: 'tracto-camion-renault-k520',
      name: 'Tracto Camión Renault K520',
      brand: 'Renault',
      capacity: 'Consultar',
      shortDesc: 'Tracto Camión Renault K520, incorporado desde inventario interno. Año(s): 2025. Unidades registradas: 1.',
      features: ['Marca: Renault', 'Modelo: K520', 'Año(s) inventario: 2025'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRACTO_CAMION_RENAULT_PREMIUM_LANDER_460,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Tracto Camión Renault K520.',
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
  heroImage: TRANSPORTE_HERO,
  bodyImage: CAMA_BAJA_EAGER_BEAVER_70T,
  bodyImageAlt: 'Cama baja Eager Beaver 60 GSL de 70 toneladas',
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
    {
      slug: 'cama-baja-eager-beaver-50gsl-pt',
      name: 'Cama Baja Eager Beaver 50GSL PT',
      brand: 'Eager Beaver',
      capacity: 'Consultar',
      shortDesc: 'Cama Baja Eager Beaver 50GSL PT, incorporado desde inventario interno. Año(s): 2019. Unidades registradas: 1.',
      features: ['Marca: Eager Beaver', 'Modelo: 50GSL PT', 'Año(s) inventario: 2019'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: CAMA_BAJA_EAGER_BEAVER_70T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Cama Baja Eager Beaver 50GSL PT.',
    },
    {
      slug: 'cama-baja-eager-beaver-60gsl',
      name: 'Cama Baja Eager Beaver 60GSL',
      brand: 'Eager Beaver',
      capacity: 'Consultar',
      shortDesc: 'Cama Baja Eager Beaver 60GSL, incorporado desde inventario interno. Año(s): 2014. Unidades registradas: 1.',
      features: ['Marca: Eager Beaver', 'Modelo: 60GSL', 'Año(s) inventario: 2019'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: CAMA_BAJA_EAGER_BEAVER_70T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Cama Baja Eager Beaver 50GSL.',
    },
    {
      slug: 'cama-baja-goren-sr-dolly-32t',
      name: 'Cama Baja Goren SR DOLLY 32T',
      brand: 'Goren',
      capacity: 'Consultar',
      shortDesc: 'Cama Baja Goren SR DOLLY 32T, incorporado desde inventario interno. Año(s): 2021. Unidades registradas: 1.',
      features: ['Marca: Goren', 'Modelo: SR DOLLY 32T', 'Año(s) inventario: 2021'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: CAMA_BAJA_EAGER_BEAVER_70T,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Cama Baja Goren SR DOLLY 32T.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de cama-baja Eager Beaver.',
  relatedCrossCategory: [
    { categorySlug: 'movimiento-de-tierra', subcategorySlug: 'retroexcavadoras' },
  ],
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
  heroImage: TRANSPORTE_HERO,
  bodyImage: SEMIREMOLQUE_RANDON,
  bodyImageAlt: 'Semiremolque Randon de 30 toneladas para carga general',
  seoTitle: 'Arriendo de Semiremolques en Chile',
  seoDescription:
    'Arriendo de semiremolques de 25 a 40 t en Chile. Compatibles con contenedores de 20 y 40 pies. Mantenimiento y seguros incluidos. Responde en 24h.',
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
  heroImage: TORRE_ILUMINACION_9M_WACKER_NEUSON,
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
    {
      slug: 'torre-de-iluminacion-led-generac-vtevo',
      name: 'Torre de Iluminación Led Generac VTEVO',
      brand: 'Led Generac',
      capacity: 'Consultar',
      shortDesc: 'Torre de Iluminación Led Generac VTEVO, incorporado desde inventario interno. Año(s): 2022. Unidades registradas: 4.',
      features: ['Marca: Led Generac', 'Modelo: VTEVO', 'Año(s) inventario: 2022'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TORRE_ILUMINACION_9M_WACKER_NEUSON,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Torre de Iluminación Led Generac VTEVO.',
    },
    {
      slug: 'torre-de-iluminacion-luxtower-lux-m11',
      name: 'Torre de Iluminación Luxtower LUX M11',
      brand: 'Luxtower',
      capacity: 'Consultar',
      shortDesc: 'Torre de Iluminación Luxtower LUX M11, incorporado desde inventario interno. Año(s): 2023. Unidades registradas: 9.',
      features: ['Marca: Luxtower', 'Modelo: LUX M11', 'Año(s) inventario: 2023'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TORRE_ILUMINACION_9M_WACKER_NEUSON,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Torre de Iluminación Luxtower LUX M11.',
    },
    {
      slug: 'torre-de-iluminacion-trime-x-city-led-4x300',
      name: 'Torre de Iluminación Trime X-CITY LED 4X300',
      brand: 'Trime',
      capacity: 'Consultar',
      shortDesc: 'Torre de Iluminación Trime X-CITY LED 4X300, incorporado desde inventario interno. Año(s): 2023. Unidades registradas: 1.',
      features: ['Marca: Trime', 'Modelo: X-CITY LED 4X300', 'Año(s) inventario: 2023'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TORRE_ILUMINACION_9M_WACKER_NEUSON,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Torre de Iluminación Trime X-CITY LED 4X300.',
    },
    {
      slug: 'torre-de-iluminacion-vielco-vielco',
      name: 'Torre de Iluminación Vielco VIELCO',
      brand: 'Vielco',
      capacity: 'Consultar',
      shortDesc: 'Torre de Iluminación Vielco VIELCO, incorporado desde inventario interno. Año(s): 2020. Unidades registradas: 2.',
      features: ['Marca: Vielco', 'Modelo: VIELCO', 'Año(s) inventario: 2020'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TORRE_ILUMINACION_9M_WACKER_NEUSON,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Torre de Iluminación Vielco VIELCO.',
    },
    {
      slug: 'torre-de-iluminacion-wacker-neuson-lrn6l',
      name: 'Torre de Iluminación Wacker Neuson LRN6L',
      brand: 'Wacker Neuson',
      capacity: 'Consultar',
      shortDesc: 'Torre de Iluminación Wacker Neuson LRN6L, incorporado desde inventario interno. Año(s): 2010. Unidades registradas: 1.',
      features: ['Marca: Wacker Neuson', 'Modelo: LRN6L', 'Año(s) inventario: 2010'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TORRE_ILUMINACION_9M_WACKER_NEUSON,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Torre de Iluminación Wacker Neuson LRN6L.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de torres de iluminación.',
  relatedCrossCategory: [
    { categorySlug: 'equipos-especiales', subcategorySlug: 'generadores-electricos' },
  ],
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
  heroImage: BOMBA_HORMIGON_TRUEMAX_TM50D,
  seoTitle: 'Arriendo de Bombas de Hormigón en Chile',
  seoDescription:
    'Arriendo de bombas de hormigón estacionarias y telescópicas en Chile. Capacidad hasta 150 m³/h. Operador certificado. Solicita cotización personalizada.',
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
  heroImage: COMPRESOR_AIRE_AIRMAN_PDS390S_4B1,
  seoTitle: 'Arriendo de Compresores de Aire en Chile',
  seoDescription:
    'Arriendo de compresores de aire portátiles diésel en Chile. Capacidad 185 a 1.500 CFM. Combustible y mantenimiento incluidos. Consulta disponibilidad.',
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
    {
      slug: 'compresor-de-aire-airman-pds390s',
      name: 'Compresor de Aire Airman PDS390S',
      brand: 'Airman',
      capacity: 'Consultar',
      shortDesc: 'Compresor de Aire Airman PDS390S, incorporado desde inventario interno. Año(s): 2013. Unidades registradas: 1.',
      features: ['Marca: Airman', 'Modelo: PDS390S', 'Año(s) inventario: 2013'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: COMPRESOR_AIRE_AIRMAN_PDS390S_4B1,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Compresor de Aire Airman PDS390S.',
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
  heroImage: GENERADOR_ELECTRICO_6KVA_EUROP_ARD_HDY,
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
    {
      slug: 'generador-electrico-caterpillar-de75',
      name: 'Generador Eléctrico Caterpillar DE75',
      brand: 'Caterpillar',
      capacity: 'Consultar',
      shortDesc: 'Generador Eléctrico Caterpillar DE75, incorporado desde inventario interno. Año(s): 2023. Unidades registradas: 1.',
      features: ['Marca: Caterpillar', 'Modelo: DE75', 'Año(s) inventario: 2023'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GENERADOR_ELECTRICO_6KVA_EUROP_ARD_HDY,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Generador Eléctrico Caterpillar DE75.',
    },
    {
      slug: 'generador-electrico-jcb-g165qs-165-kva',
      name: 'Generador Eléctrico JCB G165QS (165 KVA)',
      brand: 'JCB',
      capacity: '165 kVA',
      shortDesc: 'Generador Eléctrico JCB G165QS (165 KVA), incorporado desde inventario interno. Año(s): 2021. Unidades registradas: 1.',
      features: ['Marca: JCB', 'Modelo: G165QS (165 KVA)', 'Año(s) inventario: 2021'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GENERADOR_ELECTRICO_6KVA_EUROP_ARD_HDY,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Generador Eléctrico JCB G165QS (165 KVA).',
    },
    {
      slug: 'generador-electrico-jcb-g220qs-220-kva',
      name: 'Generador Eléctrico JCB G220QS (220 KVA)',
      brand: 'JCB',
      capacity: '220 kVA',
      shortDesc: 'Generador Eléctrico JCB G220QS (220 KVA), incorporado desde inventario interno. Año(s): 2021. Unidades registradas: 1.',
      features: ['Marca: JCB', 'Modelo: G220QS (220 KVA)', 'Año(s) inventario: 2021'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GENERADOR_ELECTRICO_6KVA_EUROP_ARD_HDY,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Generador Eléctrico JCB G220QS (220 KVA).',
    },
    {
      slug: 'generador-electrico-jcb-g45qs-45-kva',
      name: 'Generador Eléctrico JCB G45QS (45 KVA)',
      brand: 'JCB',
      capacity: '45 kVA',
      shortDesc: 'Generador Eléctrico JCB G45QS (45 KVA), incorporado desde inventario interno. Año(s): 2023. Unidades registradas: 2.',
      features: ['Marca: JCB', 'Modelo: G45QS (45 KVA)', 'Año(s) inventario: 2023'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GENERADOR_ELECTRICO_6KVA_EUROP_ARD_HDY,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Generador Eléctrico JCB G45QS (45 KVA).',
    },
    {
      slug: 'generador-electrico-jcb-g90qs-90-kva',
      name: 'Generador Eléctrico JCB G90QS (90 KVA)',
      brand: 'JCB',
      capacity: '90 kVA',
      shortDesc: 'Generador Eléctrico JCB G90QS (90 KVA), incorporado desde inventario interno. Año(s): 2021. Unidades registradas: 1.',
      features: ['Marca: JCB', 'Modelo: G90QS (90 KVA)', 'Año(s) inventario: 2021'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GENERADOR_ELECTRICO_6KVA_EUROP_ARD_HDY,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Generador Eléctrico JCB G90QS (90 KVA).',
    },
    {
      slug: 'generador-electrico-pramac-p9000-9-kva',
      name: 'Generador Eléctrico Pramac P9000 (9 KVA)',
      brand: 'Pramac',
      capacity: '9 kVA',
      shortDesc: 'Generador Eléctrico Pramac P9000 (9 KVA), incorporado desde inventario interno. Año(s): 2020. Unidades registradas: 1.',
      features: ['Marca: Pramac', 'Modelo: P9000 (9 KVA)', 'Año(s) inventario: 2020'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GENERADOR_ELECTRICO_6KVA_EUROP_ARD_HDY,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Generador Eléctrico Pramac P9000 (9 KVA).',
    },
    {
      slug: 'generador-electrico-senci-sc7000-10-kw',
      name: 'Generador Eléctrico Senci SC7000 (10.0 KW)',
      brand: 'Senci',
      capacity: 'Consultar',
      shortDesc: 'Generador Eléctrico Senci SC7000 (10.0 KW), incorporado desde inventario interno. Año(s): 2023. Unidades registradas: 2.',
      features: ['Marca: Senci', 'Modelo: SC7000 (10.0 KW)', 'Año(s) inventario: 2023'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: GENERADOR_ELECTRICO_6KVA_EUROP_ARD_HDY,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Generador Eléctrico Senci SC7000 (10.0 KW).',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de generadores eléctricos.',
  relatedCrossCategory: [
    { categorySlug: 'equipos-especiales', subcategorySlug: 'torres-iluminacion' },
  ],
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
  heroImage: TERMOFUSIONADORA_ELECTRICA_RITMO_360MM,
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
  shortDesc: 'Rodillo vibratorio de doble tambor para compactación de asfalto, bases granulares y suelos en obras viales y de urbanización.',
  description:
    'Arriendo de rodillos compactadores vibratorios de doble tambor en Chile para obras de construcción, pavimentación y mantenimiento vial. Equipos con peso operativo de 830 kg, motor diésel de bajo consumo y arranque eléctrico, ideales para compactación de asfalto, bases granulares, arenas y suelos en obras de urbanización, parques industriales y mantención de caminos. Operador certificado incluido, con experiencia en faenas de pavimentación y control de densidad según normativa MOP. Mantenimiento preventivo, seguros y combustibles incluidos durante todo el período de arriendo. Disponibilidad inmediata en zona norte (Atacama, Coquimbo) y centro de Chile, con respuesta operativa en menos de 24 horas. Excelente maniobrabilidad en espacios reducidos y zanjas. Solución eficiente para proyectos de compactación uniforme en superficies de asfalto, gravilla y suelos cohesivos.',
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
  heroImage: RODILLO_COMPACTADOR,
  seoTitle: 'Arriendo de Rodillos compactadores',
  seoDescription:
    'Arriendo de rodillos compactadores vibratorios en Chile. Peso 830 kg, motor diésel, doble tambor. Ideal para asfalto y suelos. Operador certificado incluido. Solicita cotización.',
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
  name: 'Placas Compactadoras',
  shortDesc: 'Placa compactadora unidireccional de 15 kN para adoquines, zanjas, veredas y suelos granulares en construcción y obras civiles.',
  description:
    'Arriendo de placas compactadoras unidireccionales en Chile para proyectos de construcción, obras civiles y paisajismo. Equipos con fuerza de compactación de 15 kN, motor a gasolina de alta confiabilidad y diseño compacto, ideales para veredas, zanjas, pavimentos intertrabados (adoquines), arenas, gravilla y suelos granulares. Base plana de acero con alta eficiencia de compactación en superficies de hasta 30 cm de espesor. Operador certificado incluido, con experiencia en compactación de suelos para fundaciones, estacionamientos, veredas y trabajos de paisajismo. Mantenimiento, seguros y combustibles incluidos durante el arriendo. Disponibilidad inmediata en zona norte (Atacama, Coquimbo) y centro de Chile. Equipos livianos y maniobrables para trabajos en espacios reducidos, zanjas de instalaciones sanitarias y rellenos compactados.',
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
  heroImage: PLACA_COMPACTADORA_15KN,
  seoTitle: 'Arriendo de Placas Compactadoras',
  seoDescription:
    'Arriendo de placas compactadoras 15 kN en Chile. Motor a gasolina, ideal para adoquines, zanjas y suelos granulares. Operador incluido. Disponibilidad inmediata en zona norte.',
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
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de placa compactadora.',
};

const EE_ALISADORA_PAVIMENTO: RentalSubcategory = {
  slug: 'alisadora-de-pavimento',
  name: 'Alisadora de Pavimentos',
  shortDesc: 'Alisadora de pavimentos de 915 mm para acabado profesional de losas industriales, radieres, pavimentos y superficies de hormigón.',
  description:
    'Arriendo de alisadoras de pavimento en Chile para acabado profesional de superficies de hormigón. Equipos con diámetro de trabajo de 915 mm (36 pulgadas), motor a gasolina de alto rendimiento y diseño robusto para uso intensivo en faenas de construcción. Ideales para losas industriales, pavimentos, radieres, fundaciones y superficies de hormigón que requieren un terminado uniforme y de alta calidad. Sistema de alisado con paletas metálicas que proporcionan un acabado liso o texturizado según requerimiento del proyecto. Operador certificado incluido, con experiencia en acabados de hormigón para pisos industriales, estacionamientos, bodegas y obras civiles. Mantenimiento, seguros y combustibles incluidos durante el arriendo. Disponibilidad inmediata en zona norte (Atacama, Coquimbo) y centro de Chile con respuesta operativa en menos de 24 horas.',
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
  heroImage: ALISADORA_PAVIMENTO_915MM,
  seoTitle: 'Arriendo de Alisadora de Pavimentos',
  seoDescription:
    'Arriendo de alisadoras de pavimento 915 mm en Chile. Acabado profesional de hormigón, losas industriales y radieres. Operador certificado. Responde en 24h.',
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
  shortDesc: 'Vibropisón diésel de 21 kN para compactación de suelos cohesivos, zanjas, rellenos y áreas de difícil acceso en obras y minería.',
  description:
    'Arriendo de vibropisones diésel en Chile para compactación de suelos cohesivos, zanjas, rellenos y áreas de difícil acceso. Equipos con fuerza de impacto de 21 kN, motor diésel Yanmar de bajo consumo y construcción robusta para uso intensivo en faenas de construcción, minería y obras civiles. Altura de salto optimizada para compactación eficiente en suelos arcillosos, mixtos y rellenos de zanjas. Diseño compacto y maniobrable para trabajos en espacios reducidos, canalizaciones, fundaciones puntuales y obras sanitarias. Operador certificado incluido, con experiencia en compactación localizada según normativa MOP y estándares de calidad. Mantenimiento preventivo, seguros y combustibles incluidos durante todo el período de arriendo. Disponibilidad inmediata en zona norte (Atacama, Coquimbo) y centro de Chile con respuesta operativa en menos de 24 horas.',
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
  heroImage: VIBROPISON_21KN,
  seoTitle: 'Arriendo de Vibropisón',
  seoDescription:
    'Arriendo de vibropisón diésel 21 kN en Chile. Compactación de suelos cohesivos, zanjas y rellenos. Motor Yanmar, operador incluido. Consulta disponibilidad por región.',
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
  shortDesc: 'Mezcladora eléctrica de hormigón de 250 a 500 L para preparación de concreto en construcción, minería y obras civiles.',
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
  heroImage: MEZCLADORA_ELECTRICA_400L_EMARESA_HV_400,
  seoTitle: 'Arriendo de Mezcladora Eléctrica',
  seoDescription:
    'Arriendo de mezcladora eléctrica en Chile. Capacidad 250 a 500 L, rendimiento 4 m³/h. Motor eléctrico 3 HP. Operador incluido. Solicita cotización personalizada.',
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
  name: 'Canastillos Alza Hombre',
  shortDesc: 'Canastillos certificados para trabajos en altura con camión pluma o grúa articulada. Metálicos y de fibra de vidrio.',
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
  heroImage: CANASTILLO_ALZA_HOMBRE_METALICO_ORMET_2MF,
  seoTitle: 'Arriendo de Canastillos Alza Hombre',
  seoDescription:
    'Arriendo de Canastillos Alza Hombre en Chile. Capacidad 200 Kg. Cotiza online.',
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
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Canastillo Alza Hombre de Fibra Ormet 2VE.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar Arriendo de Canastillo Alza Hombre.',
};

// ─────────────────────────────────────────────────────────────
// 4. EQUIPOS ESPECIALES
// ─────────────────────────────────────────────────────────────

const CAMIONETAS_PESADAS: RentalSubcategory = {
  slug: 'camionetas-pesadas',
  name: 'Camioneta pesada',
  shortDesc: 'Camionetas pesadas para operación y apoyo en faena.',
  description:
    'Camionetas pesadas para operación y apoyo en faena. Equipos incorporados desde el inventario vigente. Las capacidades y configuraciones específicas deben confirmarse al momento de cotizar.',
  features: [
    'Equipos disponibles según inventario vigente.',
    'Configuración y capacidad sujetas al modelo disponible.',
    'Mantenimiento preventivo según programa operacional.',
    'Disponibilidad sujeta a programación de faena.',
  ],
  specs: [
    { label: 'Capacidad', value: 'Según modelo' },
    { label: 'Disponibilidad', value: 'Consultar' },
  ],
  // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia de esta subcategoría.
  heroImage: TRANSPORTE_HERO,
  seoTitle: 'Arriendo de Camioneta pesada en Chile',
  seoDescription:
    'Arriendo de camioneta pesada en Chile. Consulta disponibilidad, configuración y condiciones de arriendo.',
  catalog: [
    {
      slug: 'camioneta-chevrolet-silverado-dcab-4x4-3-0-aut',
      name: 'Camioneta Chevrolet SILVERADO DCAB 4X4 3.0 AUT',
      brand: 'Chevrolet',
      capacity: 'Consultar',
      shortDesc: 'Camioneta Chevrolet SILVERADO DCAB 4X4 3.0 AUT, incorporado desde inventario interno. Año(s): 2023. Unidades registradas: 1.',
      features: ['Marca: Chevrolet', 'Modelo: SILVERADO DCAB 4X4 3.0 AUT', 'Año(s) inventario: 2023'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta Chevrolet SILVERADO DCAB 4X4 3.0 AUT.',
    },
    
    {
      slug: 'camioneta-chevrolet-dmax-4wd-2-5',
      name: 'Camioneta Chevrolet DMAX 4WD 2.5',
      brand: 'Chevrolet',
      capacity: 'Consultar',
      shortDesc: 'Camioneta Chevrolet DMAX 4WD 2.5, incorporado desde inventario interno. Año(s): 2022. Unidades registradas: 5.',
      features: ['Marca: Chevrolet', 'Modelo: DMAX 4WD 2.5', 'Año(s) inventario: 2022'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta Chevrolet DMAX 4WD 2.5.',
    },
    {
      slug: 'camioneta-ford-ranger-4x4-2-2',
      name: 'Camioneta Ford RANGER 4X4 2.2',
      brand: 'Ford',
      capacity: 'Consultar',
      shortDesc: 'Camioneta Ford RANGER 4X4 2.2, incorporado desde inventario interno. Año(s): 2022. Unidades registradas: 1.',
      features: ['Marca: Ford', 'Modelo: RANGER 4X4 2.2', 'Año(s) inventario: 2022'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta Ford RANGER 4X4 2.2.',
    },
    {
      slug: 'camioneta-ford-ranger-dcab-xlt-4x4-3-2',
      name: 'Camioneta Ford RANGER DCAB XLT 4X4 3.2',
      brand: 'Ford',
      capacity: 'Consultar',
      shortDesc: 'Camioneta Ford RANGER DCAB XLT 4X4 3.2, incorporado desde inventario interno. Año(s): 2021. Unidades registradas: 1.',
      features: ['Marca: Ford', 'Modelo: RANGER DCAB XLT 4X4 3.2', 'Año(s) inventario: 2021'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta Ford RANGER DCAB XLT 4X4 3.2.',
    },
    {
      slug: 'camioneta-ford-ranger-xls-4x4-3-2',
      name: 'Camioneta Ford RANGER XLS 4X4 3.2',
      brand: 'Ford',
      capacity: 'Consultar',
      shortDesc: 'Camioneta Ford RANGER XLS 4X4 3.2, incorporado desde inventario interno. Año(s): 2020, 2021. Unidades registradas: 3.',
      features: ['Marca: Ford', 'Modelo: RANGER XLS 4X4 3.2', 'Año(s) inventario: 2020, 2021'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta Ford RANGER XLS 4X4 3.2.',
    },
    {
      slug: 'camioneta-ford-ranger-xls-dcab-4x4-3-2',
      name: 'Camioneta Ford RANGER XLS DCAB 4X4 3.2',
      brand: 'Ford',
      capacity: 'Consultar',
      shortDesc: 'Camioneta Ford RANGER XLS DCAB 4X4 3.2, incorporado desde inventario interno. Año(s): 2021. Unidades registradas: 1.',
      features: ['Marca: Ford', 'Modelo: RANGER XLS DCAB 4X4 3.2', 'Año(s) inventario: 2021'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta Ford RANGER XLS DCAB 4X4 3.2.',
    },
    {
      slug: 'camioneta-nissan-navara-d-cab-mt-4x4-2-3',
      name: 'Camioneta Nissan NAVARA D CAB MT 4X4 2.3',
      brand: 'Nissan',
      capacity: 'Consultar',
      shortDesc: 'Camioneta Nissan NAVARA D CAB MT 4X4 2.3, incorporado desde inventario interno. Año(s): 2021. Unidades registradas: 5.',
      features: ['Marca: Nissan', 'Modelo: NAVARA D CAB MT 4X4 2.3', 'Año(s) inventario: 2021'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta Nissan NAVARA D CAB MT 4X4 2.3.',
    },
    {
      slug: 'camioneta-nissan-navara-dcab-xe-4x4-2-3-aut',
      name: 'Camioneta Nissan NAVARA DCAB XE 4X4 2.3 AUT',
      brand: 'Nissan',
      capacity: 'Consultar',
      shortDesc: 'Camioneta Nissan NAVARA DCAB XE 4X4 2.3 AUT, incorporado desde inventario interno. Año(s): 2024. Unidades registradas: 4.',
      features: ['Marca: Nissan', 'Modelo: NAVARA DCAB XE 4X4 2.3 AUT', 'Año(s) inventario: 2024'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta Nissan NAVARA DCAB XE 4X4 2.3 AUT.',
    },
    {
      slug: 'camioneta-nissan-np300-navara-3-2',
      name: 'Camioneta Nissan NP300 NAVARA 3.2',
      brand: 'Nissan',
      capacity: 'Consultar',
      shortDesc: 'Camioneta Nissan NP300 NAVARA 3.2, incorporado desde inventario interno. Año(s): 2021. Unidades registradas: 1.',
      features: ['Marca: Nissan', 'Modelo: NP300 NAVARA 3.2', 'Año(s) inventario: 2021'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta Nissan NP300 NAVARA 3.2.',
    },
    {
      slug: 'camioneta-ram-rampage-ds-laramie-4x4',
      name: 'Camioneta RAM RAMPAGE DS LARAMIE 4X4',
      brand: 'RAM',
      capacity: 'Consultar',
      shortDesc: 'Camioneta RAM RAMPAGE DS LARAMIE 4X4, incorporado desde inventario interno. Año(s): 2025. Unidades registradas: 1.',
      features: ['Marca: RAM', 'Modelo: RAMPAGE DS LARAMIE 4X4', 'Año(s) inventario: 2025'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta RAM RAMPAGE DS LARAMIE 4X4.',
    },
    {
      slug: 'camioneta-toyota-hilux-2-4-tm-4x4',
      name: 'Camioneta Toyota HILUX 2.4 TM 4X4',
      brand: 'Toyota',
      capacity: 'Consultar',
      shortDesc: 'Camioneta Toyota HILUX 2.4 TM 4X4, incorporado desde inventario interno. Año(s): 2023. Unidades registradas: 5.',
      features: ['Marca: Toyota', 'Modelo: HILUX 2.4 TM 4X4', 'Año(s) inventario: 2023'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta Toyota HILUX 2.4 TM 4X4.',
    },
    {
      slug: 'camioneta-toyota-hilux-cs-4x4-2-4',
      name: 'Camioneta Toyota HILUX CS 4X4 2.4',
      brand: 'Toyota',
      capacity: 'Consultar',
      shortDesc: 'Camioneta Toyota HILUX CS 4X4 2.4, incorporado desde inventario interno. Año(s): 2022. Unidades registradas: 1.',
      features: ['Marca: Toyota', 'Modelo: HILUX CS 4X4 2.4', 'Año(s) inventario: 2022'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta Toyota HILUX CS 4X4 2.4.',
    },
    {
      slug: 'camioneta-toyota-hilux-dc-4x4-2-8-aut',
      name: 'Camioneta Toyota HILUX DC 4X4 2.8 AUT',
      brand: 'Toyota',
      capacity: 'Consultar',
      shortDesc: 'Camioneta Toyota HILUX DC 4X4 2.8 AUT, incorporado desde inventario interno. Año(s): 2024. Unidades registradas: 1.',
      features: ['Marca: Toyota', 'Modelo: HILUX DC 4X4 2.8 AUT', 'Año(s) inventario: 2024'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta Toyota HILUX DC 4X4 2.8 AUT.',
    },
    {
      slug: 'camioneta-volkswagen-amarok-comfortline-4x4',
      name: 'Camioneta Volkswagen AMAROK COMFORTLINE 4X4',
      brand: 'Volkswagen',
      capacity: 'Consultar',
      shortDesc: 'Camioneta Volkswagen AMAROK COMFORTLINE 4X4, incorporado desde inventario interno. Año(s): 2023. Unidades registradas: 4.',
      features: ['Marca: Volkswagen', 'Modelo: AMAROK COMFORTLINE 4X4', 'Año(s) inventario: 2023'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta Volkswagen AMAROK COMFORTLINE 4X4.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de camioneta pesada.',
};

const CAMIONETAS_LIVIANAS: RentalSubcategory = {
  slug: 'camionetas-livianas',
  name: 'Camioneta Liviana',
  shortDesc: 'Camionetas livianas 4x4 para operación y apoyo en faena.',
  description:
    'Camionetas livianas 4x4 para operación y apoyo en faena. Equipos incorporados desde el inventario vigente. Las capacidades y configuraciones específicas deben confirmarse al momento de cotizar.',
  features: [
    'Equipos disponibles según inventario vigente.',
    'Configuración y capacidad sujetas al modelo disponible.',
    'Mantenimiento preventivo según programa operacional.',
    'Disponibilidad sujeta a programación de faena.',
  ],
  specs: [
    { label: 'Capacidad', value: 'Según modelo' },
    { label: 'Disponibilidad', value: 'Consultar' },
  ],
  // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia de esta subcategoría.
  heroImage: TRANSPORTE_HERO,
  seoTitle: 'Arriendo de Camioneta Liviana en Chile',
  seoDescription:
    'Arriendo de camioneta liviana en Chile. Consulta disponibilidad, configuración y condiciones de arriendo.',
  catalog: [
    {
      slug: 'camioneta-chevrolet-colorado-dcab-4p-4x4',
      name: 'Camioneta Chevrolet COLORADO DCAB 4P 4X4',
      brand: 'Chevrolet',
      capacity: 'Consultar',
      shortDesc: 'Camioneta Chevrolet COLORADO DCAB 4P 4X4, incorporado desde inventario interno. Año(s): 2025. Unidades registradas: 10.',
      features: ['Marca: Chevrolet', 'Modelo: COLORADO DCAB 4P 4X4', 'Año(s) inventario: 2025'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta Chevrolet COLORADO DCAB 4P 4X4.',
    },
    {
      slug: 'camioneta-ford-ranger-ltd-4x4-3-0-aut',
      name: 'Camioneta Ford RANGER LTD 4X4 3.0 AUT',
      brand: 'Ford',
      capacity: 'Consultar',
      shortDesc: 'Camioneta Ford RANGER LTD 4X4 3.0 AUT, incorporado desde inventario interno. Año(s): 2025. Unidades registradas: 1.',
      features: ['Marca: Ford', 'Modelo: RANGER LTD 4X4 3.0 AUT', 'Año(s) inventario: 2025'],
      // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia del equipo.
      image: TRANSPORTE_HERO,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Camioneta Ford RANGER LTD 4X4 3.0 AUT.',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de camioneta liviana.',
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
      'Arriendo de equipos de izaje para minería, construcción e industria en Chile. Contamos con grúas hidráulicas AT y RT de 60 a 400 toneladas, camiones pluma, alza hombre, plataformas aéreas y grúas horquilla, operados por personal certificado. Ofrecemos soluciones seguras y eficientes para proyectos de alto tonelaje en la zona norte y centro del país.',
    heroImage: IZAJE_HERO,
    seoTitle: 'Arriendo de Equipos de Izaje en Chile',
    seoDescription:
      'Arriendo de grúas, alza-hombre y equipos de izaje en Chile. Hasta 400 toneladas. Operador certificado, 24/7. Cotiza online o por WhatsApp.',
    subcategories: [
      IZAJE_GRUAS_60,
      IZAJE_GRUAS_80,
      IZAJE_GRUAS_100,
      IZAJE_GRUAS_250,
      IZAJE_GRUAS_400,
      IZAJE_GRUAS_ALTO_TONELAJE,
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
    heroImage: MOVIMIENTO_TIERRA_HERO,
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
    heroImage: TRANSPORTE_HERO,
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
    heroImage: EQUIPOS_ESPECIALES_HERO,
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
    {
    slug: 'camionetas',
    name: 'Camionetas',
    shortDesc: 'Camionetas pesadas y livianas para operación y apoyo en faena.',
    description:
      'Arriendo de camionetas para operación, supervisión y apoyo logístico en proyectos industriales, mineros y de construcción. Catálogo construido a partir del inventario vigente.',
    // IMAGEN TEMPORAL REUTILIZADA: reemplazar cuando exista imagen propia de la categoría Camionetas.
    heroImage: TRANSPORTE_HERO,
    seoTitle: 'Arriendo de Camionetas en Chile',
    seoDescription:
      'Arriendo de camionetas pesadas y livianas para faenas y proyectos en Chile. Consulta disponibilidad y condiciones de arriendo.',
    subcategories: [CAMIONETAS_PESADAS, CAMIONETAS_LIVIANAS],
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

/**
 * Busca un equipo por su slug en todo el catálogo.
 * Devuelve el equipo junto con su categoría y subcategoría, o undefined si no existe.
 */
export function findEquipmentBySlug(slug: string): {
  category: RentalCategory;
  subcategory: RentalSubcategory;
  equipment: Equipment;
} | undefined {
  for (const category of RENTAL_CATEGORIES) {
    for (const subcategory of category.subcategories) {
      const equipment = subcategory.catalog.find((e) => e.slug === slug);
      if (equipment) return { category, subcategory, equipment };
    }
  }
  return undefined;
}
