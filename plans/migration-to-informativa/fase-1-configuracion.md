# Fase 1: Configuracion Global y SEO

**Complejidad:** Baja  
**Dependencias:** Ninguna (primera fase)  
**Archivos a modificar:** 2

## Objetivo

Actualizar toda la configuracion de dominio, URLs canonicas, email y metadatos globales para reflejar la nueva identidad informativa de `ipproyectosindustriales.cl`.

---

## Tarea 1.1: Actualizar dominio canonico en `astro.config.mjs`

**Archivo:** `astro.config.mjs` (linea 12)

**Cambio:**
```diff
- const SITE_URL = 'https://www.iprental.cl';
+ const SITE_URL = 'https://www.ipproyectosindustriales.cl';
```

**Impacto:** Todas las URLs canonicas, sitemap, y meta tags OG generadas automaticamente usaran el nuevo dominio.

---

## Tarea 1.2: Actualizar datos del sitio en `src/data/site.ts`

**Archivo:** `src/data/site.ts`

### `siteBrand` (lineas 12-20)
```diff
  export const siteBrand = {
    name: 'IP Proyectos Industriales',
    legalName: 'IP Proyectos Industriales SpA',
-   tagline: 'Arriendo de maquinaria pesada para la minería.',
-   description: 'Arriendo de grúas, movimiento de tierra, transporte y equipos especiales para la gran minería. También ingeniería, construcción y montajes industriales.',
+   tagline: 'Ingeniería, montajes y grúas de alto tonelaje para la minería.',
+   description: 'Ingeniería, construcción, montajes e izajes de alto tonelaje (hasta 400 t) para la gran minería en Atacama y Coquimbo. Más de 25 años de experiencia.',
    logoUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2024/12/logo.png',
-   siteUrl: 'https://www.iprental.cl',
+   siteUrl: 'https://www.ipproyectosindustriales.cl',
  };
```

### `siteContact` (lineas 23-34)
```diff
  export const siteContact = {
    phoneMobile: '+56 9 5659 4144',
    phoneMobileHref: 'tel:+56956594144',
    phoneLandline: '(51) 2 750535',
    phoneLandlineHref: 'tel:+56512750535',
    whatsappNumber: '56956594144',
-   email: 'contacto@iprental.cl',
+   email: 'contacto@ipproyectosindustriales.cl',
    address: 'Parcela 110 Lote A-3, Vegas Norte, La Serena',
    schedule: 'Lunes a Viernes, 08:00 – 18:00',
    catalogUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2025/08/IPP-2025.pdf',
  };
```

### Mensaje de WhatsApp en `topbarData` (linea 55)
```diff
  {
    platform: 'whatsapp' as const,
-   url: `https://wa.me/${siteContact.whatsappNumber}?text=Hola,%20me%20gustar%C3%ADa%20cotizar%20un%20servicio.`,
+   url: `https://wa.me/${siteContact.whatsappNumber}?text=Hola,%20me%20gustar%C3%ADa%20conversar%20sobre%20un%20proyecto.`,
  },
```

---

## Tarea 1.3: Verificar `src/lib/seo.ts`

**Archivo:** `src/lib/seo.ts`

Revisar que `getSiteUrl()` y los schemas (organizationSchema, localBusinessSchema, websiteSchema) usen `siteBrand.siteUrl` como base. No deberia requerir cambios si ya importa de `site.ts`, pero verificar.

---

## Tarea 1.4: Actualizar filtros del sitemap

**Archivo:** `astro.config.mjs` (linea 38)

```diff
  filter: (page) => {
-   const noIndexPaths = ['/gracias', '/404', '/500', '/aviso-legal', '/privacidad', '/cookies', '/cotizador'];
+   const noIndexPaths = ['/gracias', '/404', '/500', '/aviso-legal', '/privacidad', '/cookies', '/cotizador', '/gracias-contacto'];
    return !noIndexPaths.some((path) => page.includes(path));
  },
```

---

## Criterios de aceptacion

- [ ] `npm run build` ejecuta sin errores
- [ ] El sitemap generado apunta a `ipproyectosindustriales.cl`
- [ ] Las meta tags OG muestran el dominio correcto
- [ ] No queda ninguna referencia hardcoded a `iprental.cl` (excepto en el cotizador si se mantiene)
