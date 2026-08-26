# Arquitectura de informacion y flujo del cotizador web

Fuente analizada: rutas Astro en `src/pages`, componentes del cotizador en `src/components/quote`, navegación compartida en `src/data/site.ts` y catálogo dinámico en `src/data/rental.ts`.

Criterio del esquema:
- Muestra la arquitectura principal del sitio `iprental.cl`.
- Separa catálogo SEO, puntos de entrada al cotizador y flujo interno del wizard.
- Incluye salidas externas y operativas confirmadas en el código.
- Simplifica las rutas dinámicas agrupándolas por familia para que el diagrama siga siendo legible.

```mermaid
flowchart LR
    Root["www.iprental.cl"]

    subgraph Sitio["Arquitectura principal del sitio"]
        Home["Inicio rental-first"]
        Arriendo["Hub: /arriendo"]
        Servicios["Hub: /servicios"]
        Seguridad["/seguridad"]
        Compliance["/compliance"]
        Noticias["/noticias"]
        Posts["Posts dinámicos /noticias/[post]"]
        Cotizador["/cotizador"]
        Legal["Legales: aviso legal, privacidad, cookies"]
    end

    subgraph RentalSEO["Catálogo SEO de arriendo"]
        CatIzaje["Categoría: Izaje"]
        CatTierra["Categoría: Movimiento de tierra"]
        CatTransporte["Categoría: Transporte"]
        CatEspeciales["Categoría: Equipos especiales"]
        Fichas["Subcategorías y fichas dinámicas\n/arriendo/[categoria]/[subcategoria]"]
    end

    subgraph ServiciosSEO["Páginas de servicios"]
        Ing["/servicios/ingenieria"]
        Constr["/servicios/construccion"]
        Mont["/servicios/montajes"]
        Port["/servicios/infraestructura-portuaria"]
    end

    subgraph GlobalUI["Elementos globales repetidos"]
        Shell["Topbar + header + footer + badge flotante"]
    end

    subgraph Wizard["Funnel del cotizador"]
        Paso1["Paso 1: seleccionar equipos\nEquipmentPicker + carrito"]
        Paso2["Paso 2: datos de empresa"]
        Entrega["Dirección de entrega a faena\n(condicional)"]
        Paso3["Paso 3: resumen y envío"]
    end

    subgraph Operacion["Salidas operativas del cotizador"]
        ApiQuote["POST /api/quote-email"]
        Inbox["Correo interno cotizaciones@iprental.cl"]
        ClienteMail["Correo resumen al cliente"]
    end

    subgraph Externos["Destinos y salidas externas"]
        WhatsApp["WhatsApp"]
        Catalogo["Catálogo PDF 2025"]
        Canal["Canal de denuncias"]
        LinkedIn["LinkedIn"]
        Instagram["Instagram"]
        Facebook["Facebook"]
    end

    Root --> Home
    Root --> Shell

    Home --> Arriendo
    Home --> Servicios
    Home --> Cotizador

    Arriendo --> CatIzaje
    Arriendo --> CatTierra
    Arriendo --> CatTransporte
    Arriendo --> CatEspeciales

    CatIzaje --> Fichas
    CatTierra --> Fichas
    CatTransporte --> Fichas
    CatEspeciales --> Fichas

    Servicios --> Ing
    Servicios --> Constr
    Servicios --> Mont
    Servicios --> Port

    Noticias --> Posts

    Shell -. "navegación global" .-> Arriendo
    Shell -. "navegación global" .-> Servicios
    Shell -. "navegación global" .-> Seguridad
    Shell -. "topbar / footer" .-> Compliance
    Shell -. "topbar / footer" .-> Noticias
    Shell -. "footer" .-> Legal
    Shell -. "badge / botón flotante" .-> Cotizador

    Home -->|"CTA"| Cotizador
    Arriendo -->|"CTA"| Cotizador
    CatIzaje -->|"CTA"| Cotizador
    CatTierra -->|"CTA"| Cotizador
    CatTransporte -->|"CTA"| Cotizador
    CatEspeciales -->|"CTA"| Cotizador
    Fichas -->|"Agregar al cotizador"| Cotizador
    Ing -->|"CTA"| Cotizador
    Constr -->|"CTA"| Cotizador
    Mont -->|"CTA"| Cotizador
    Port -->|"CTA"| Cotizador

    Cotizador --> Paso1
    Paso1 -->|"carrito con equipos"| Paso2
    Paso2 -->|"validación OK"| Paso3
    Paso2 -. "si requiere envío a faena" .-> Entrega
    Entrega -. "completa datos de despacho" .-> Paso2
    Paso3 -->|"editar selección"| Paso1
    Paso3 -->|"editar empresa"| Paso2

    Paso1 -->|"descargar catálogo"| Catalogo
    Paso3 -->|"enviar por WhatsApp"| WhatsApp
    Paso3 -->|"enviar por correo"| ApiQuote
    Paso3 -. "fallback si falla email" .-> WhatsApp

    ApiQuote --> Inbox
    ApiQuote --> ClienteMail

    Compliance -->|"deriva a"| Canal
    Shell --> LinkedIn
    Shell --> Instagram
    Shell --> Facebook
    Shell --> WhatsApp
```