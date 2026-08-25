# Arquitectura de informacion y enlaces del sitio IP

Fuente analizada: HTML estatico de `IP-Sitio-Web` en el workspace vecino.

Criterio del esquema:
- Muestra la estructura principal de paginas y sus relaciones de navegacion.
- Distingue los hubs `Servicios` y `Rental de equipos` de sus paginas de detalle.
- Incluye las salidas externas confirmadas en el markup.
- No incluye enlaces placeholder con `#` de la pagina de noticias.

```mermaid
flowchart LR
    Root["ipproyectosindustriales.cl"]

    subgraph Sitio["Arquitectura principal del sitio"]
        Home["Empresa / Inicio"]
        Servicios["Servicios"]
        Arriendos["Rental de equipos"]
        Seguridad["Seguridad"]
        Compliance["Compliance"]
        Contacto["Contacto"]
        Noticias["Noticias"]
    end

    subgraph ServiciosDetalle["Detalle de servicios"]
        Ingenieria["Ingenieria"]
        Construccion["Construccion"]
        Montajes["Montajes"]
        Portuaria["Infraestructura portuaria"]
    end

    subgraph RentalDetalle["Detalle de rental"]
        Izaje["Arriendo: Izaje"]
        Tierra["Arriendo: Movimiento de tierra"]
        Transporte["Arriendo: Transporte"]
        Especiales["Arriendo: Equipos especiales"]
    end

    subgraph GlobalUI["Elementos globales repetidos"]
        Shell["Header + topbar + footer"]
    end

    subgraph Externos["Destinos y salidas externas"]
        IPRental["iprental.cl"]
        CanalDenuncias["Canal de denuncias"]
        Catalogo["Catalogo PDF 2025"]
        Maps["Google Maps"]
        WhatsApp["WhatsApp"]
        Facebook["Facebook"]
        LinkedIn["LinkedIn"]
        Instagram["Instagram"]
    end

    Root --> Home
    Root --> Shell

    Home --> Servicios
    Home --> Arriendos
    Home --> Seguridad
    Home --> Compliance
    Home --> Contacto
    Home -. "acceso editorial" .-> Noticias

    Servicios --> Ingenieria
    Servicios --> Construccion
    Servicios --> Montajes
    Servicios --> Portuaria

    Arriendos --> Izaje
    Arriendos --> Tierra
    Arriendos --> Transporte
    Arriendos --> Especiales

    Ingenieria -. "breadcrumb / volver" .-> Servicios
    Construccion -. "breadcrumb / volver" .-> Servicios
    Montajes -. "breadcrumb / volver" .-> Servicios
    Portuaria -. "breadcrumb / volver" .-> Servicios

    Izaje -. "breadcrumb / volver" .-> Arriendos
    Tierra -. "breadcrumb / volver" .-> Arriendos
    Transporte -. "breadcrumb / volver" .-> Arriendos
    Especiales -. "breadcrumb / volver" .-> Arriendos

    Servicios -->|"CTA"| Contacto
    Ingenieria -->|"CTA"| Contacto
    Construccion -->|"CTA"| Contacto
    Montajes -->|"CTA"| Contacto
    Portuaria -->|"CTA"| Contacto
    Seguridad -->|"CTA"| Contacto
    Compliance -->|"CTA"| Contacto
    Noticias -->|"CTA"| Contacto
    Izaje -->|"CTA"| Contacto
    Tierra -->|"CTA"| Contacto
    Transporte -->|"CTA"| Contacto
    Especiales -->|"CTA"| Contacto

    Arriendos -->|"cotizar / flota"| IPRental
    Izaje -->|"consulta directa"| WhatsApp
    Tierra -->|"consulta directa"| WhatsApp
    Transporte -->|"consulta directa"| WhatsApp
    Especiales -->|"consulta directa"| WhatsApp

    Compliance -->|"deriva a"| CanalDenuncias
    Contacto -->|"descarga"| Catalogo
    Contacto -->|"ubicacion"| Maps
    Contacto -->|"envia mensaje"| WhatsApp

    Shell --> WhatsApp
    Shell --> Facebook
    Shell --> LinkedIn
    Shell --> Instagram
    Shell -. "footer" .-> Noticias
    Shell -. "footer" .-> Compliance
    Shell -. "footer" .-> Seguridad
    Shell -. "footer" .-> Contacto
    Shell -. "footer" .-> Servicios
    Shell -. "footer" .-> Arriendos
```