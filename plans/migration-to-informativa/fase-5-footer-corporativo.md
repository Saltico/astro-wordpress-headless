# Fase 5: Footer Corporativo

**Complejidad:** Baja  
**Dependencias:** Fase 1 (configuracion)  
**Archivos a modificar:** 1 (`src/data/site.ts`)

## Objetivo

Actualizar las columnas del footer para reflejar la estructura informativa corporativa, anadiendo la columna "Empresa" y el link al "Canal de denuncias".

---

## Tarea 5.1: Actualizar `footerData` en `src/data/site.ts`

**Archivo:** `src/data/site.ts` (lineas 93-131)

### Estado actual:
```ts
columns: [
  {
    title: 'Arriendo de equipos',
    links: [
      { label: 'Catalogo completo', url: '/arriendo' },
      { label: 'Izaje', url: '/arriendo/izaje' },
      { label: 'Movimiento de tierra', url: '/arriendo/movimiento-de-tierra' },
      { label: 'Transporte', url: '/arriendo/transporte' },
      { label: 'Equipos especiales', url: '/arriendo/equipos-especiales' },
    ],
  },
  {
    title: 'Servicios',
    links: [...],
  },
  // Columna "Empresa" oculta
],
```

### Nuevo estado:
```ts
columns: [
  {
    title: 'Servicios',
    links: [
      { label: 'Ingenieria', url: '/servicios/ingenieria' },
      { label: 'Construccion', url: '/servicios/construccion' },
      { label: 'Montajes mineros e industriales', url: '/servicios/montajes' },
      { label: 'Infraestructura portuaria', url: '/servicios/infraestructura-portuaria' },
      { label: 'Arriendo de gruas', url: '/arriendo' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Nuestra empresa', url: '/' },
      { label: 'Seguridad y medio ambiente', url: '/seguridad' },
      { label: 'Compliance', url: '/compliance' },
      { label: 'Codigo de etica', url: '/compliance' },
      { label: 'Canal de denuncias', url: 'https://ipproyectosindustriales.cl/canal-de-denuncias/', external: true },
      { label: 'Noticias', url: '/noticias' },
    ],
  },
],
```

**Nota sobre "Canal de denuncias":** Es un link externo. Verificar que el tipo `FooterLink` soporte `external: boolean` o usar la URL completa directamente. Si el componente `Footer.astro` no soporta links externos, anadir soporte.

---

## Tarea 5.2: Verificar soporte de links externos en Footer

**Archivo:** `src/components/layout/Footer.astro`

Verificar que los links con URLs absolutas (http/https) se rendericen correctamente con `target="_blank"` y `rel="noopener"`. Si no esta soportado, anadir la logica:

```astro
<a
  href={link.url}
  {link.url.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {}}
>
  {link.label}
</a>
```

---

## Tarea 5.3: Actualizar texto del copyright

**Archivo:** `src/components/layout/Footer.astro`

Verificar que el copyright muestre:
```
© 2026 IP Proyectos Industriales SpA — Todos los derechos reservados.
```

Y que el dominio mostrado sea `ipproyectosindustriales.cl` (tomado de `siteBrand.siteUrl` o hardcodeado).

---

## Criterios de aceptacion

- [ ] Footer muestra columnas: Servicios + Empresa
- [ ] Columna Empresa incluye: Nuestra empresa, Seguridad, Compliance, Codigo de etica, Canal de denuncias, Noticias
- [ ] Link "Canal de denuncias" abre en nueva pestana (externo)
- [ ] Boton "Descargar catalogo" visible
- [ ] Copyright muestra nombre legal correcto
- [ ] `npm run build` sin errores
