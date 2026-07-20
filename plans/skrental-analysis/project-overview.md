---
project: SK Rental Chile - Análisis Web
date: 2026-07-14
status: Analysis Complete
type: E-commerce B2B - Alquiler de Maquinaria Pesada
---

# SK Rental Chile - Análisis Web Completo

## Resumen Ejecutivo

**SK Rental** es una plataforma de alquiler de maquinaria pesada para construcción y minería en Chile, con operaciones también en Bolivia, Perú y Colombia. El sitio opera como una tienda online B2B con modelo de cotización en línea.

### Datos Clave
- **Dominio principal**: skrental.com
- **Países**: Chile (principal), Bolivia, Perú, Colombia
- **Modelo de negocio**: Alquiler de maquinaria pesada con cotización online
- **Blog separado**: blog.skrental.com
- **Sectores**: Construcción, minería, industriales

---

## Arquitectura del Sitio

```mermaid
graph TB
    subgraph "Dominio Principal"
        HOME[/"🏠 Home<br/>skrental.com/tiendaonline/webapp/home"]
    end
    
    subgraph "Países"
        CL["🇨🇱 Chile"]
        BO["🇧🇴 Bolivia"]
        PE["🇵🇪 Perú"]
        CO["🇨🇴 Colombia"]
    end
    
    subgraph "Chile - Estructura Principal"
        ARRIENDO["🔧 Arriendo<br/>/arriendo/"]
        ESTATICOS["📄 Páginas Estáticas<br/>/estaticos/"]
        DETALLES["📋 Detalles Productos<br/>/detalles/"]
        TIENDA["🛒 Tienda Online<br/>/tiendaonline/"]
    end
    
    subgraph "Arriendo - Categorías"
        PROMO["⭐ Promociones"]
        DISP["⚡ Disponibilidad Inmediata"]
        MOV_TIERRA["🚜 Movimiento de Tierra"]
        CAMIONES["🚛 Camiones"]
        GRUAS["🏗️ Grúas y Manipulación"]
        ALZAHOMBRES["⬆️ Alzahombres"]
        EQUIPOS_APOYO["🔧 Equipos de Apoyo"]
        COMPACTACION["🔩 Compactación"]
        MARTILLOS["🔨 Martillos Hidráulicos"]
        SUSTENTABLES["🌱 Equipos Sustentables"]
        MINERIA["⛏️ Minería Subterránea"]
    end
    
    HOME --> CL
    HOME --> BO
    HOME --> PE
    HOME --> CO
    
    CL --> ARRIENDO
    CL --> ESTATICOS
    CL --> DETALLES
    
    ARRIENDO --> PROMO
    ARRIENDO --> DISP
    ARRIENDO --> MOV_TIERRA
    ARRIENDO --> CAMIONES
    ARRIENDO --> GRUAS
    ARRIENDO --> ALZAHOMBRES
    ARRIENDO --> EQUIPOS_APOYO
    ARRIENDO --> COMPACTACION
    ARRIENDO --> MARTILLOS
    ARRIENDO --> SUSTENTABLES
    ARRIENDO --> MINERIA
```

---

## Componentes Principales Identificados

### 1. **Sistema de Navegación**
- **Header principal** con logo, menú de categorías, buscador
- **Menú mega dropdown** con subcategorías
- **Botón de cotización/carro**
- **Selector de país** (CL, BO, PE, CO)
- **Login/Mi Cuenta**

### 2. **Página Home**
- **Slider hero** con imágenes promocionales
- **Sección de categorías** con tarjetas clickeables
- **Blog preview** con artículos destacados
- **Soluciones relacionadas** (be-market, beparts, etc.)
- **Footer completo** con información de contacto

### 3. **Sistema de Productos**
- **Listados por categoría** con filtros
- **Fichas de producto** con especificaciones
- **Cotización en línea** (carro de compras)
- **Disponibilidad inmediata**

### 4. **Funcionalidades de Usuario**
- **Login/Registro** de clientes
- **Mi Cuenta** (gestión de pedidos)
- **Cotizador** (carro de compras)
- **Recuperación de contraseña**

### 5. **Contenido Estático**
- Preguntas frecuentes
- Términos y condiciones
- Política de privacidad
- Proyectos
- Testimonios
- Webpay (pagos)

---

## Estructura de URLs (Sitemap Analysis)

### Páginas Principales (Prioridad 1.0)
| URL | Descripción |
|-----|-------------|
| `/tiendaonline/webapp/home` | Página principal |

### Páginas Estáticas (Prioridad 0.8)
| URL | Descripción |
|-----|-------------|
| `/tiendaonline/webapp/estaticos/preguntas-frecuentes` | FAQ |
| `/tiendaonline/webapp/estaticos/terminos-condiciones` | Términos |
| `/tiendaonline/webapp/estaticos/skrental` | Sobre nosotros |
| `/tiendaonline/webapp/estaticos/testimonios` | Testimonios |
| `/tiendaonline/webapp/estaticos/proyectos` | Proyectos |
| `/tiendaonline/webapp/estaticos/webpaysk` | Pagos Webpay |
| `/tiendaonline/webapp/estaticos/micuentaberental` | Mi cuenta |
| `/tiendaonline/webapp/estaticos/politicas-privacidad` | Privacidad |

### Categorías de Arriendo (Prioridad 0.9)
| Categoría | URL | Subcategorías |
|-----------|-----|---------------|
| **Promociones** | `/arriendo/promociones/414/414` | 9 subcategorías |
| **Disponibilidad Inmediata** | `/arriendo/disponibilidad-inmediata/386/386` | 3 subcategorías |
| **Movimiento de Tierra** | `/arriendo/movimiento-de-tierra/107/107` | 6 subcategorías |
| **Camiones** | `/arriendo/camiones/99/99` | 7 subcategorías |
| **Grúas y Manipulación** | `/arriendo/gruas-y-manipulacion-de-materiales/104/104` | 2 subcategorías |
| **Alzahombres** | `/arriendo/alzahombres-de-trabajo-en-altura/108/108` | 2 subcategorías |
| **Equipos de Apoyo** | `/arriendo/equipos-de-apoyo/103/103` | 3 subcategorías |
| **Compactación** | `/arriendo/compactacion/125/125` | 1 subcategoría |
| **Martillos Hidráulicos** | `/arriendo/martillos-hidraulicos-e-implementos/105/105` | 2 subcategorías |
| **Equipos Sustentables** | `/arriendo/equipos-sustentables/384/384` | 1 subcategoría |
| **Minería Subterránea** | `/arriendo/mineria-subterranea/106/106` | 1 subcategoría |

---

## Análisis Técnico

### Stack Tecnológico Detectado
- **Frontend**: Framework JavaScript (probablemente Angular o similar)
- **Imágenes**: Amazon S3 (bbrskrental.s3-sa-east-1.amazonaws.com)
- **Formato de imágenes**: WebP
- **Backend**: API REST (estructura /tiendaonline/webapp/)
- **Blog**: WordPress separado (blog.skrental.com)

### Características Técnicas
- **URLs amigables**: Estructura jerárquica con IDs numéricos
- **Multi-paño**: Soporte para múltiples países
- **Responsive**: Adaptado a móvil
- **Cotización online**: Sistema de carro de compras
- **Login de clientes**: Sistema de autenticación

---

## Fortalezas Identificadas

1. **SEO On-Page**: URLs descriptivas y estructura jerárquica
2. **Contenido rico**: Múltiples categorías y subcategorías
3. **Multi-mercado**: Presencia en 4 países
4. **Experiencia de usuario**: Cotización online fácil
5. **Contenido de soporte**: Blog, FAQ, testimonios

---

## Áreas de Mejora

1. **Blog integrado**: El blog está en subdominio separado
2. **Schema markup**: No se detecta estructura de datos
3. **Hreflang**: Implementación multi-idioma no verificada
4. **Velocidad**: Imágenes en S3 pueden optimizarse más
5. **Core Web Vitals**: Requiere auditoría completa

---

## Próximos Pasos Recomendados

1. **Auditoría técnica completa** con PageSpeed Insights
2. **Revisión de schema markup** para productos
3. **Análisis de competidores** en el mercado chileno
4. **Optimización de imágenes** y rendimiento
5. **Revisión de hreflang** para implementación multi-país

---

*Documento generado el 14 de julio de 2026*
*Análisis basado en sitemap.xml y estructura de navegación*