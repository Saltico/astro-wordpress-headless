# Spec 01 — Modelo de Datos (Data Layer)

**Fase:** 1
**Estado:** ✅ Completo
**Archivos a crear:** `src/data/rental.ts`
**Depende de:** — (ninguna)
**Bloquea a:** specs 02, 03, 04, 05, 06, 08

---

## Objetivo

Crear la **fuente única de verdad** para todo el catálogo de arriendo. Un solo archivo `rental.ts` contiene las 4 categorías, 22 sub-rutas y los modelos de equipo. Todas las páginas, schemas, breadcrumbs y el sitemap leen de este archivo.

## Por qué importa

- Editar/agregar un equipo = modificar 1 línea (no 4 archivos `.astro`).
- Garantiza consistencia de slug, nombre, descripción y SEO en todas las páginas.
- Permite regenerar automáticamente títulos, meta descriptions, breadcrumbs y schema.

## Tipos

Definir tres interfaces TypeScript en `src/data/rental.ts`:

```ts
export interface Equipment {
  /** Slug único del modelo, kebab-case, lowercase */
  slug: string;
  /** Nombre visible del equipo (con tildes correctas) */
  name: string;
  /** Spec destacada para la card (ej: "100 t", "72 m") */
  capacity: string;
  /** Altura máxima opcional (ej: "72 m") */
  height?: string;
  /** Año del equipo opcional */
  year?: number;
  /** 1 línea descriptiva para la card */
  shortDesc: string;
  /** 2-3 bullets de features clave */
  features: string[];
  /** Ruta a la imagen (en v1: todas apuntan a hero.jpg) */
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
  /** Specs técnicas clave (capacidad, altura, operador, etc.) */
  specs?: { label: string; value: string }[];
  /** Imagen del hero (v1: hero.jpg) */
  heroImage: string;
  /** Title tag pre-formateado (< 60 chars) */
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
```

## Convenciones

### Slugs
- **kebab-case**, lowercase
- **Sin acentos** en la URL (`movimiento-de-tierra`, no `movimiento de tierra`)
- **Con tildes** en el `name` visible (`Movimiento de Tierra`)
- Toneladas: número sin unidad, sufijo `-toneladas` (`gruas-100-toneladas`)
- Sin preposición final (`alza-hombre`, no `alza-de-hombre`)

### Nombres
- Con tildes correctas en español: `Equipos Especiales`, `Movimiento de Tierra`
- Plural para categorías y sub-rutas, singular para equipos individuales

### Contenido SEO
- **`seoTitle`:** máximo 60 caracteres, formato `"Arriendo de {nombre} en Chile | IP Proyectos Industriales"`
- **`seoDescription`:** 150-160 caracteres, con keyword + CTA ("Cotiza online o por WhatsApp")
- **`description`:** 120-180 palabras, párrafo natural, incluye 2-3 keywords secundarias
- **`features`:** 3-5 bullets, verbos en presente, beneficios concretos

### Imágenes v1
- Todas las `heroImage` y `image` apuntan a `@/assets/imgs/hero.jpg`
- En v2 se reemplazarán por imágenes específicas en `src/assets/rental/`

### WhatsApp
- Número base: `+56 9 5659 4144`
- Formato URL: `https://wa.me/56956594144?text={encodeURIComponent(message)}`
- `whatsappMessage` por sub-ruta = mensaje genérico
- `whatsappMessage` por equipo = mensaje específico con nombre del modelo

## Estructura del archivo

```ts
// src/data/rental.ts

import heroImg from '@/assets/imgs/hero.jpg';

export const RENTAL_CATEGORIES: RentalCategory[] = [
  {
    slug: 'izaje',
    // ...
    subcategories: [
      {
        slug: 'gruas-60-toneladas',
        // ...
        catalog: [
          { slug: 'modelo-x', /* ... */ },
          { slug: 'modelo-y', /* ... */ },
        ],
      },
      // ...
    ],
  },
  // ... 3 categorías más
];

// Helpers exportados
export function findCategory(slug: string): RentalCategory | undefined { /* ... */ }
export function findSubcategory(categorySlug: string, subcategorySlug: string): RentalSubcategory | undefined { /* ... */ }
export function findEquipment(categorySlug: string, subcategorySlug: string, equipmentSlug: string): Equipment | undefined { /* ... */ }
export function getAllSubcategories(): Array<{ category: RentalCategory; subcategory: RentalSubcategory }> { /* ... */ }
```

## Contenido completo (4 categorías, 22 sub-rutas)

### 1. Izaje (`izaje`)

#### 1.1 `gruas-60-toneladas`
- **name:** "Grúas de 60 toneladas"
- **shortDesc:** "Grúas hidráulicas AT de 60 t para izaje industrial."
- **description:** 120-180 palabras
- **features:** 5 bullets
- **specs:** Capacidad 60 t · Altura máx. 50 m · Operador incluido · Disponibilidad 24/7
- **seoTitle:** "Arriendo de Grúas de 60 Toneladas | IP Proyectos Industriales"
- **seoDescription:** 150-160 chars
- **catalog:** 2-3 modelos (completar con marcas como Liebherr LTM 1060, Tadano GR-600, Grove GMK 3060)

#### 1.2 `gruas-80-toneladas`
- **name:** "Grúas de 80 toneladas"
- **catalog:** 2-3 modelos (Grove GMK 4080, Tadano GR-800, Liebherr LTM 1080)

#### 1.3 `gruas-100-toneladas`
- **name:** "Grúas de 100 toneladas"
- **catalog:** 2-3 modelos (Grove GMK 4100, Liebherr LTM 1100, Tadano GR-1000)

#### 1.4 `gruas-250-toneladas`
- **name:** "Grúas de 250 toneladas"
- **catalog:** 2-3 modelos (Grove GMK 5250, Liebherr LTM 1250, Tadano ATF 400G-6)

#### 1.5 `camiones-pluma`
- **name:** "Camiones pluma"
- **shortDesc:** "Camiones pluma de 3 a 15 toneladas con operador."
- **catalog:** 2-3 modelos

#### 1.6 `alza-hombre`
- **name:** "Alza-hombre y plataformas"
- **catalog:** 2-3 modelos

#### 1.7 `gruas-horquilla`
- **name:** "Grúas horquilla"
- **catalog:** 2-3 modelos

### 2. Movimiento de Tierra (`movimiento-de-tierra`)

#### 2.1 `camiones-tolva`
- **name:** "Camiones tolva"
- **catalog:** 2-3 modelos

#### 2.2 `retroexcavadoras`
- **name:** "Retroexcavadoras"
- **catalog:** 2-3 modelos

#### 2.3 `minicargadores`
- **name:** "Minicargadores"
- **catalog:** 2-3 modelos

### 3. Transporte (`transporte`)

#### 3.1 `tracto-camiones`
- **name:** "Tracto camiones"
- **catalog:** 2-3 modelos

#### 3.2 `cama-baja`
- **name:** "Cama-baja (Eager Beaver)"
- **catalog:** 2-3 modelos

#### 3.3 `semiremolques`
- **name:** "Semiremolques"
- **catalog:** 2-3 modelos

### 4. Equipos Especiales (`equipos-especiales`)

#### 4.1 `torres-iluminacion`
- **name:** "Torres de iluminación"

#### 4.2 `bombas-hormigon`
- **name:** "Bombas de hormigón"

#### 4.3 `compresores-aire`
- **name:** "Compresores de aire"

#### 4.4 `generadores-electricos`
- **name:** "Generadores eléctricos"

#### 4.5 `termofusionadoras`
- **name:** "Termofusión eléctrica"

#### 4.6 `mezcladoras-electricas-canastillo`
- **name:** "Mezcladora eléctrica con canastillo"

> **Nota:** Las sub-rutas 4.1-4.6 pueden tener un catálogo mínimo (1-2 modelos) hasta tener inventario real.

## Tareas

- [ ] Crear `src/data/rental.ts`
- [ ] Definir las 3 interfaces (`Equipment`, `RentalSubcategory`, `RentalCategory`)
- [ ] Importar `heroImg` de `@/assets/imgs/hero.jpg`
- [ ] Escribir las 4 categorías con sus 22 sub-rutas completas
- [ ] Llenar `catalog` con al menos 2 modelos por sub-ruta donde aplique
- [ ] Implementar los 4 helpers (`findCategory`, `findSubcategory`, `findEquipment`, `getAllSubcategories`)
- [ ] Verificar que TypeScript compila sin errores (`astro check` o similar)

## Definition of Done

- [ ] `src/data/rental.ts` existe y exporta `RENTAL_CATEGORIES`
- [ ] Las 3 interfaces están definidas y exportadas
- [ ] Las 4 categorías están completas con descripción, seoTitle, seoDescription
- [ ] Las 22 sub-rutas están completas con descripción, features, specs, seoTitle, seoDescription y catalog
- [ ] Cada `catalog` tiene al menos 1 `Equipment` (ideal: 2-3)
- [ ] Los 4 helpers funcionan y devuelven `undefined` en caso de slug inválido
- [ ] TypeScript compila sin warnings ni errores
- [ ] No hay hardcodeo de strings SEO en otros archivos (todo viene de este data)

## Ejemplo de entry completo (referencia para implementar el resto)

```ts
{
  slug: 'gruas-100-toneladas',
  name: 'Grúas de 100 toneladas',
  shortDesc: 'Izaje pesado con grúas hidráulicas AT de 100 t de capacidad.',
  description: 'Arriendo de grúas de 100 toneladas para proyectos de minería e industria en Chile. Equipos Grove, Liebherr y Tadano con operadores certificados, planes de izaje y permisos de trabajo incluidos. Disponibilidad en zona norte (Atacama, Coquimbo) y centro del país. Capacidad de 80 a 110 t según modelo, altura máxima de hasta 88 m con plumín. Servicio disponible 24/7 con respuesta operativa en menos de 48 horas desde la cotización.',
  features: [
    'Grúas hidráulicas todo terreno (AT) de 80 a 110 toneladas.',
    'Operadores certificados con experiencia en faena minera.',
    'Planes de izaje, permisos de trabajo y supervisión técnica.',
    'Disponibilidad 24/7 según requerimiento del proyecto.',
    'Mantenimiento preventivo y seguros incluidos durante todo el arriendo.',
  ],
  specs: [
    { label: 'Capacidad', value: '80 – 110 t' },
    { label: 'Altura máxima', value: '72 – 88 m' },
    { label: 'Operador', value: 'Incluido' },
    { label: 'Disponibilidad', value: '24/7' },
  ],
  heroImage: heroImg.src,
  seoTitle: 'Arriendo de Grúas de 100 Toneladas | IP Proyectos',
  seoDescription: 'Arriendo de grúas de 100 toneladas con operador certificado en Chile. Hasta 88 m de altura. Cotiza online o por WhatsApp.',
  catalog: [
    {
      slug: 'grua-grove-gmk-4100',
      name: 'Grove GMK 4100',
      capacity: '100 t',
      height: '88 m',
      shortDesc: 'Grúa hidráulica AT de 100 t con plumín telescópico de 17 m.',
      features: ['Motor Tier 4 Final', 'Plumín de 17 m', '4 ejes direccionales'],
      image: heroImg.src,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Grove GMK 4100 (100 t).',
    },
    {
      slug: 'grua-liebherr-ltm-1100',
      name: 'Liebherr LTM 1100',
      capacity: '100 t',
      height: '85 m',
      shortDesc: 'Grúa hidráulica AT de 100 t con sistema VarioBase.',
      features: ['VarioBase', 'Plumín telescópico', 'Cabina climatizada'],
      image: heroImg.src,
      whatsappMessage: 'Hola IP, quisiera cotizar arriendo de Grúa Liebherr LTM 1100 (100 t).',
    },
  ],
  whatsappMessage: 'Hola IP, quisiera cotizar arriendo de grúas de 100 toneladas.',
}
```

## Referencias

- README: [./README.md](./README.md) — árbol de URLs, decisiones clave
- Spec 02: [./02-catalog-components.md](./02-catalog-components.md) — usa el tipo `Equipment`
- Spec 03: [./03-routes-templates.md](./03-routes-templates.md) — consume `RENTAL_CATEGORIES` con `getStaticPaths()`
- Spec 06: [./06-seo-schema.md](./06-seo-schema.md) — consume `seoTitle` y `seoDescription`
