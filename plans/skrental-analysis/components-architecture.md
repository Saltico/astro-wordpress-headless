---
project: SK Rental Chile
analysis: Componentes y Arquitectura
date: 2026-07-14
---

# Análisis de Componentes y Arquitectura - SK Rental Chile

## 🏗️ Arquitectura General del Sistema

```mermaid
graph TB
    subgraph "Frontend"
        WEB["🌐 Web Application<br/>Angular/Vue/React"]
        CDN["📦 CDN<br/>Amazon CloudFront"]
    end
    
    subgraph "Backend"
        API["🔌 API REST<br/>/tiendaonline/webapp/"]
        DB["🗄️ Base de Datos<br/>MySQL/PostgreSQL"]
        AUTH["🔐 Sistema de Autenticación"]
    end
    
    subgraph "Servicios Externos"
        S3["📁 Amazon S3<br/>Imágenes"]
        WP["📝 WordPress<br/>Blog"]
        PAY["💳 Webpay<br/>Pagos"]
        EMAIL["📧 Servicio de Email"]
    end
    
    subgraph "Multi-país"
        CL["🇨🇱 Chile"]
        BO["🇧🇴 Bolivia"]
        PE["🇵🇪 Perú"]
        CO["🇨🇴 Colombia"]
    end
    
    WEB --> API
    WEB --> CDN
    API --> DB
    API --> AUTH
    API --> S3
    WEB --> WP
    API --> PAY
    API --> EMAIL
    
    WEB --> CL
    WEB --> BO
    WEB --> PE
    WEB --> CO
```

---

## 🧩 Componentes Principales de la UI

### 1. **Header Component**

```mermaid
graph LR
    subgraph "Header"
        LOGO["🏢 Logo SK Rental"]
        NAV["📂 Navegación Principal"]
        SEARCH["🔍 Buscador"]
        CART["🛒 Cotizador/Carro"]
        USER["👤 Mi Cuenta"]
        COUNTRY["🌍 Selector País"]
    end
    
    LOGO --> NAV
    NAV --> SEARCH
    SEARCH --> CART
    CART --> USER
    USER --> COUNTRY
```

**Funcionalidades:**
- Logo clickeable (vuelve al home)
- Menú mega dropdown con categorías
- Buscador de productos en tiempo real
- Contador de productos en cotización
- Login rápido
- Selector de país (CL, BO, PE, CO)

### 2. **Hero Slider Component**

```mermaid
graph TB
    subgraph "Hero Slider"
        SLIDER["🎠 Slider Principal"]
        IMG1["📷 Imagen 1<br/>Disponibilidad Inmediata"]
        IMG2["📷 Imagen 2<br/>Renting Permanente"]
        IMG3["📷 Imagen 3<br/>Promociones"]
        NAV["⬅️➡️ Navegación"]
    end
    
    SLIDER --> IMG1
    SLIDER --> IMG2
    SLIDER --> IMG3
    SLIDER --> NAV
```

**Características:**
- Imágenes responsivas (WebP)
- Navegación automática y manual
- Enlaces a categorías relevantes
- Adaptado a móvil

### 3. **Category Grid Component**

```mermaid
graph TB
    subgraph "Category Grid"
        GRID["📊 Grid de Categorías"]
        CAT1["⭐ Promociones"]
        CAT2["⚡ Disponibilidad"]
        CAT3["🚜 Mov. Tierra"]
        CAT4["🚛 Camiones"]
        CAT5["🏗️ Grúas"]
        CAT6["⬆️ Alzahombres"]
        CAT7["🔧 Equipos Apoyo"]
        CAT8["🔩 Compactación"]
        CAT9["🔨 Martillos"]
        CAT10["🌱 Sustentables"]
        CAT11["⛏️ Minería"]
    end
    
    GRID --> CAT1
    GRID --> CAT2
    GRID --> CAT3
    GRID --> CAT4
    GRID --> CAT5
    GRID --> CAT6
    GRID --> CAT7
    GRID --> CAT8
    GRID --> CAT9
    GRID --> CAT10
    GRID --> CAT11
```

**Estructura de cada tarjeta:**
- Imagen representativa (350x350 WebP)
- Título de categoría
- Lista de subcategorías
- Enlace a listado completo

### 4. **Product Card Component**

```mermaid
graph TB
    subgraph "Product Card"
        CARD["📦 Tarjeta de Producto"]
        IMG["📷 Imagen Producto"]
        TITLE["📝 Nombre"]
        SKU["🔢 SKU/Código"]
        SPECS["📋 Especificaciones"]
        PRICE["💰 Precio"]
        CTA["🔘 Cotizar"]
    end
    
    CARD --> IMG
    CARD --> TITLE
    CARD --> SKU
    CARD --> SPECS
    CARD --> PRICE
    CARD --> CTA
```

**Información mostrada:**
- Imagen del producto
- Nombre y modelo
- Código de arriendo (SKU)
- Especificaciones principales
- Disponibilidad
- Botón de cotización

### 5. **Footer Component**

```mermaid
graph TB
    subgraph "Footer"
        FOOTER["📄 Footer Completo"]
        COL1["📊 Columna 1<br/>Somos SKR"]
        COL2["❓ Columna 2<br/>Asistencia"]
        COL3["📞 Columna 3<br/>Contacto"]
        COL4["📱 Columna 4<br/>Redes Sociales"]
        MAP["🗺️ Mapa de Sucursales"]
        CERT["📜 Certificaciones"]
    end
    
    FOOTER --> COL1
    FOOTER --> COL2
    FOOTER --> COL3
    FOOTER --> COL4
    FOOTER --> MAP
    FOOTER --> CERT
```

**Contenido:**
- Enlaces a información corporativa
- Preguntas frecuentes
- Términos y condiciones
- Datos de contacto (teléfono, email)
- Redes sociales (Facebook, YouTube, LinkedIn, Instagram)
- Mapa de sucursales
- Certificaciones (ISO 9001, UKAS)

---

## 🔄 Flujo de Usuario

### Flujo de Cotización

```mermaid
sequenceDiagram
    participant U as Usuario
    participant H as Home
    participant C as Categoría
    participant P as Producto
    participant Q as Cotizador
    
    U->>H: Ingresa al sitio
    H->>C: Selecciona categoría
    C->>P: Selecciona producto
    P->>Q: Agrega a cotización
    Q->>U: Muestra resumen
    U->>Q: Envía cotización
    Q->>U: Confirmación
```

### Flujo de Login

```mermaid
sequenceDiagram
    participant U as Usuario
    participant L as Login
    participant A as API Auth
    participant M as Mi Cuenta
    
    U->>L: Click "Mi Cuenta"
    L->>U: Muestra formulario
    U->>L: Ingresa credenciales
    L->>A: Valida usuario
    A->>L: Token de sesión
    L->>M: Redirige a Mi Cuenta
    M->>U: Muestra dashboard
```

---

## 📱 Componentes Responsivos

### Breakpoints Detectados

| Dispositivo | Ancho | Comportamiento |
|-------------|-------|----------------|
| **Desktop** | >1200px | Layout completo, mega menu |
| **Tablet** | 768-1200px | Menú汉堡, grid adaptado |
| **Móvil** | <768px | Menú hamburguesa, stack vertical |

### Adaptaciones Móvil
- Header simplificado con汉堡 menu
- Slider a pantalla completa
- Grid de categorías en 2 columnas
- Productos en lista vertical
- Footer en acordeón

---

## 🔌 Integraciones Detectadas

### 1. **Amazon S3**
- **Uso**: Almacenamiento de imágenes
- **Bucket**: `bbrskrental.s3-sa-east-1.amazonaws.com`
- **Formato**: WebP optimizado
- **Ejemplo**: `https://bbrskrental.s3-sa-east-1.amazonaws.com/images/slider/mobile-_4_-_1__11zon_2026-07-09-082818.webp`

### 2. **WordPress (Blog)**
- **Dominio**: blog.skrental.com
- **Integración**: Enlaces desde home
- **Contenido**: Artículos sobre maquinaria y tendencias

### 3. **Webpay (Pagos)**
- **Integración**: Pasarela de pagos
- **URL**: `/tiendaonline/webapp/estaticos/webpaysk`
- **Uso**: Pagos de arriendos

### 4. **API REST**
- **Estructura**: `/tiendaonline/webapp/`
- **Métodos**: GET, POST, PUT, DELETE
- **Autenticación**: JWT/Session
- **Formato**: JSON

---

## 🗄️ Modelo de Datos Sugerido

### Productos

```typescript
interface Producto {
  id: number;
  sku: string;
  nombre: string;
  descripcion: string;
  categoria: Categoria;
  subcategoria: Subcategoria;
  especificaciones: Especificacion[];
  imagen: string;
  imagenes: string[];
  precio: number;
  disponibilidad: 'disponible' | 'no_disponible' | 'en_mantenimiento';
  pais: string[];
}
```

### Categorías

```typescript
interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  imagen: string;
  subcategorias: Subcategoria[];
}
```

### Cotización

```typescript
interface Cotizacion {
  id: number;
  usuario: Usuario;
  productos: ProductoCotizado[];
  fecha: Date;
  estado: 'pendiente' | 'enviada' | 'respondida';
  total: number;
}
```

### Usuarios

```typescript
interface Usuario {
  id: number;
  rut: string;
  nombre: string;
  email: string;
  empresa: string;
  telefono: string;
}
```

---

## 🛠️ Stack Tecnológico Recomendado

### Frontend
- **Framework**: Angular/Vue/React (detectado: probablemente Angular)
- **UI Library**: Material UI / Bootstrap / Custom
- **State Management**: NgRx / Vuex / Redux
- **HTTP Client**: Axios / Fetch API

### Backend
- **Runtime**: Node.js / PHP / Java
- **Framework**: Express / Laravel / Spring
- **Database**: MySQL / PostgreSQL
- **Cache**: Redis

### Infraestructura
- **Hosting**: AWS / Azure
- **CDN**: CloudFront / Cloudflare
- **Storage**: S3
- **CI/CD**: GitHub Actions / Jenkins

---

## 📊 Métricas de Rendimiento

### Core Web Vitals (Estimados)

| Métrica | Objetivo | Estado Actual |
|---------|----------|---------------|
| **LCP** | <2.5s | ⚠️ Requiere medición |
| **INP** | <200ms | ⚠️ Requiere medición |
| **CLS** | <0.1 | ⚠️ Requiere medición |

### Optimizaciones Detectadas
- ✅ Imágenes en formato WebP
- ✅ URLs amigables
- ✅ Estructura jerárquica
- ⚠️ Posible lazy loading en imágenes
- ⚠️ Minificación de CSS/JS no verificada

---

## 🔒 Seguridad

### Características Detectadas
- ✅ HTTPS habilitado
- ✅ Login de usuarios
- ⚠️ Rate limiting no verificado
- ⚠️ CSRF protection no verificada
- ⚠️ SQL injection protection no verificada

### Recomendaciones
1. Implementar Content Security Policy (CSP)
2. Agregar rate limiting en API
3. Validar inputs en todos los endpoints
4. Usar tokens CSRF en formularios
5. Implementar CORS properly

---

## 📈 SEO Técnico

### Estructura de URLs
```
https://www.skrental.com/tiendaonline/webapp/[tipo]/[categoría]/[subcategoría]/[id]
```

### Ejemplos:
- Home: `/tiendaonline/webapp/home`
- Categoría: `/tiendaonline/webapp/arriendo/movimiento-de-tierra/107/107`
- Producto: `/tiendaonline/webapp/detalles/excavadora-ec220dl-m/858`

### Recomendaciones SEO
1. Implementar schema markup para productos
2. Agregar hreflang para multi-país
3. Optimizar meta titles y descriptions
4. Implementar breadcrumbs
5. Agregar sitemap dinámico

---

## 🎨 Sistema de Diseño

### Paleta de Colores (Detectada)
- **Primario**: Naranja (#FF6B00 approx)
- **Secundario**: Azul oscuro (#1A1A2E approx)
- **Acento**: Verde (#4CAF50 approx)
- **Neutros**: Grises

### Tipografía
- **Headers**: Bold, sans-serif
- **Body**: Regular, sans-serif
- **Tamaño base**: 16px

### Espaciado
- **Grid**: 12 columnas
- **Margin base**: 16px
- **Padding base**: 24px

---

*Documento generado el 14 de julio de 2026*
*Análisis basado en inspección visual y estructura de código*