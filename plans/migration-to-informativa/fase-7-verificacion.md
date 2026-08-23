# Fase 7: Verificacion y QA

**Complejidad:** Media  
**Dependencias:** Fases 1-6 completadas  
**Herramientas:** `npm run build`, `npm run dev`, navegador

## Objetivo

Validar que la migracion se completo correctamente: SEO, navegacion, responsive, contenido y funcionalidad.

---

## Checklist de verificacion

### 7.1 Build y compilacion
- [ ] `npm run build` ejecuta sin errores
- [ ] No hay warnings de TypeScript sobre imports no usados
- [ ] No hay warnings de Astro sobre paginas no indexables inesperadas

### 7.2 SEO Global
- [ ] `<title>` de la homepage: "IP Proyectos Industriales | Ingenieria, montajes y gruas..."
- [ ] `<meta name="description">` apunta a la descripcion informativa
- [ ] `<link rel="canonical">` apunta a `https://www.ipproyectosindustriales.cl`
- [ ] Open Graph tags muestran dominio y descripcion correctos
- [ ] Sitemap generado incluye todas las paginas publicas y excluye noindex
- [ ] JSON-LD schemas usan el dominio correcto
- [ ] No hay referencias a `iprental.cl` en meta tags

### 7.3 Navegacion
- [ ] Header desktop: Empresa, Servicios (dropdown), Rental de equipos (dropdown), Seguridad, Compliance, Contacto
- [ ] Header CTA: boton "Contactar" -> `/contacto`
- [ ] Menu mobile: todos los items con submenus desplegables
- [ ] Menu mobile: boton "Contactar" visible
- [ ] No hay badge de cotizador ni FAB flotante
- [ ] Links activos se resaltan correctamente

### 7.4 Homepage
- [ ] Hero: video/imagen + titulo corporativo + subtitulo
- [ ] Stats: 4 items correctos (+25, +100, 400 Tons, 5)
- [ ] Marquee: animacion infinita con textos correctos
- [ ] Quienes somos: imagen + texto + CTA
- [ ] Servicios: 5 tarjetas (4 + rental destacado) con links correctos
- [ ] Seguridad/HSEC: mini-stats visibles
- [ ] Clientes: carrusel de logos funcional
- [ ] CTABand: "Contactar" y "WhatsApp" funcionan
- [ ] Noticias: 3 posts recientes visibles

### 7.5 Pagina de Contacto
- [ ] Accesible desde navegacion y CTA del header
- [ ] Formulario: todos los campos visibles
- [ ] Validacion: campos requeridos se validan
- [ ] Info empresa: direccion, telefonos, email, horario visibles
- [ ] Links tel: y mailto: funcionan
- [ ] Responsive: columnas apilan en mobile

### 7.6 Footer
- [ ] Columnas: Servicios + Empresa
- [ ] Links de Empresa: todos funcionales
- [ ] Canal de denuncias: link externo abre en nueva pestana
- [ ] Catalogo: boton visible y funcional
- [ ] Redes sociales: links correctos
- [ ] Copyright: texto correcto

### 7.7 Responsive
- [ ] Mobile (< 768px): todas las secciones se ven correctamente
- [ ] Tablet (768-1024px): grids adaptan columnas
- [ ] Desktop (> 1024px): layout completo
- [ ] Hero: texto legible sobre video/imagen en todos los tamanos

### 7.8 Busqueda de referencias residuales
Ejecutar busqueda global en `src/` de:
```bash
grep -r "iprental\.cl" src/ --include="*.ts" --include="*.astro" --include="*.mjs"
grep -r "cotizador" src/pages/ --include="*.astro" -l | grep -v cotizador.astro
grep -r "QuoteCartBadge\|QuoteCartFloatingButton" src/layouts/ src/pages/
```

- [ ] No hay referencias a `iprental.cl` (excepto en cotizador si se mantiene)
- [ ] No hay CTAs al cotizador en paginas principales
- [ ] No hay imports de componentes quote en layouts/paginas principales

### 7.9 Rendimiento
- [ ] `npm run build` genera el output sin problemas de tamano
- [ ] Imagenes del hero optimizadas (formato avif/webp)
- [ ] Video de fondo (si existe) tiene tamano razonable (< 5MB)
- [ ] Fonts preloaded correctamente

---

## Herramientas de validacion externas (post-deploy)

1. **Google Search Console** - Verificar indexacion del nuevo dominio
2. **PageSpeed Insights** - Core Web Vitals
3. **Schema.org Validator** - JSON-LD schemas
4. **Open Graph Checker** - Meta tags OG para redes sociales
5. **Sitemap Validator** - XML sitemap correcto
