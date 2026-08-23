# Fase 4: Pagina de Contacto

**Complejidad:** Media  
**Dependencias:** Fase 1 (configuracion)  
**Archivos a crear:** 2 (pagina + componente formulario)  
**Archivos a modificar:** 0

## Objetivo

Crear una nueva pagina `/contacto` con formulario de contacto e informacion de la empresa, siguiendo el patron de la web de referencia (`contacto.html`).

---

## Tarea 4.1: Crear pagina `src/pages/contacto.astro`

**Archivo nuevo:** `src/pages/contacto.astro`

### Estructura:
```
BaseLayout
  ├── PageHero (titulo + breadcrumb)
  ├── ContactSection (formulario + info empresa)
  └── CTABand (WhatsApp alternativo)
```

### SEO:
```ts
const title = 'Contacto | IP Proyectos Industriales';
const description = 'Contacta a IP Proyectos Industriales. Ingenieria, construccion, montajes y rental de equipos para la gran mineria. La Serena, Chile. +56 9 5659 4144.';
```

---

## Tarea 4.2: Seccion de contacto

**Layout:** 2 columnas (formulario 60% + info empresa 40%)

### Columna izquierda: Formulario
Campos:
- Nombre completo (requerido)
- Empresa
- Email (requerido, validacion email)
- Telefono
- Asunto / Motivo de contacto (select: Ingenieria, Construccion, Montajes, Rental, Otro)
- Mensaje (textarea, requerido)
- Checkbox de aceptacion de politica de privacidad
- Boton submit: "Enviar mensaje"

**Action del formulario:** `/api/contacto` (endpoint Astro) o servicio externo (Formspree, etc.)
**Pagina de exito:** `/gracias-contacto` (noindex)

### Columna derecha: Informacion de la empresa
- **Direccion:** Parcela 110 Lote A-3, Vegas Norte, La Serena (con icono map-pin)
- **Telefonos:** (51) 2 750535 y +56 9 5659 4144 (con icono phone, links `tel:`)
- **Email:** contacto@ipproyectosindustriales.cl (con icono mail, link `mailto:`)
- **Horario:** Lunes a Viernes, 08:00 - 18:00 (con icono clock)
- **Redes sociales:** LinkedIn, Instagram, Facebook (iconos con links)
- **Mapa embebido** (Google Maps iframe de la direccion, opcional)

---

## Tarea 4.3: Pagina de agradecimiento

**Archivo nuevo:** `src/pages/gracias-contacto.astro`

Pagina simple con:
- Titulo: "Mensaje enviado"
- Texto: "Gracias por contactarnos. Nuestro equipo revisara tu mensaje y te responderemos a la brevedad."
- Boton: "Volver al inicio" -> `/`
- `noindex: true`

---

## Tarea 4.4: Componente ContactSection (opcional)

Si se prefiere encapsular, crear `src/components/ui/ContactSection.astro` con props:
- `formAction?: string`
- `showMap?: boolean`
- Datos de contacto tomados de `siteContact`

Nota: Ya existe `src/components/ui/ContactSection.astro` en el proyecto. Revisar si se puede reutilizar o adaptar.

---

## Tarea 4.5: Endpoint API (opcional)

**Archivo nuevo:** `src/pages/api/contacto.ts`

Endpoint POST que:
1. Recibe los datos del formulario
2. Valida campos requeridos
3. Envia email o notificacion (configurar servicio)
4. Redirige a `/gracias-contacto`

Alternativa simple: Usar `action` del form hacia un servicio externo (Formspree, Netlify Forms, etc.)

---

## Criterios de aceptacion

- [ ] Pagina `/contacto` accesible desde navegacion y CTA del header
- [ ] Formulario con validacion de campos requeridos
- [ ] Informacion de empresa visible con iconos
- [ ] Links de telefono y email funcionales
- [ ] Pagina de agradecimiento funciona tras envio
- [ ] Responsive: columnas apilan en mobile
- [ ] `npm run build` sin errores
