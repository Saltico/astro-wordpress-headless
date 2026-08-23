# Fase 2: Navegacion y CTAs Globales

**Complejidad:** Media  
**Dependencias:** Fase 1 (configuracion)  
**Archivos a modificar:** 3-4

## Objetivo

Restructurar la navegacion principal para reflejar la web informativa corporativa y reemplazar todos los CTAs del cotizador por un boton "Contactar" que dirija a `/contacto`.

---

## Tarea 2.1: Restructurar `navigationData` en `src/data/site.ts`

**Archivo:** `src/data/site.ts` (lineas 65-90)

**Estado actual:**
```ts
export const navigationData: NavItem[] = [
  {
    label: 'Arriendo',
    url: '/arriendo',
    children: [
      { label: 'Izaje', url: '/arriendo/izaje' },
      { label: 'Movimiento de tierra', url: '/arriendo/movimiento-de-tierra' },
      { label: 'Transporte', url: '/arriendo/transporte' },
      { label: 'Equipos especiales', url: '/arriendo/equipos-especiales' },
    ],
  },
  {
    label: 'Servicios',
    url: '/servicios',
    children: [...],
  },
  { label: 'Seguridad', url: '/seguridad' },
];
```

**Nuevo estado:**
```ts
export const navigationData: NavItem[] = [
  { label: 'Empresa', url: '/' },
  {
    label: 'Servicios',
    url: '/servicios',
    children: [
      { label: 'Ingenieria', url: '/servicios/ingenieria' },
      { label: 'Construccion', url: '/servicios/construccion' },
      { label: 'Montajes', url: '/servicios/montajes' },
      { label: 'Infraestructura portuaria', url: '/servicios/infraestructura-portuaria' },
    ],
  },
  {
    label: 'Rental de equipos',
    url: '/arriendo',
    children: [
      { label: 'Izaje', url: '/arriendo/izaje' },
      { label: 'Movimiento de Tierra', url: '/arriendo/movimiento-de-tierra' },
      { label: 'Transporte', url: '/arriendo/transporte' },
      { label: 'Equipos Especiales', url: '/arriendo/equipos-especiales' },
    ],
  },
  { label: 'Seguridad', url: '/seguridad' },
  { label: 'Compliance', url: '/compliance' },
  { label: 'Contacto', url: '/contacto' },
];
```

**Cambios clave:**
- Anadir "Empresa" como primer item (apunta a `/`)
- "Arriendo" se renombra a "Rental de equipos"
- Anadir "Compliance" y "Contacto" como items directos

---

## Tarea 2.2: Reemplazar CTAs del cotizador en `BaseLayout.astro`

**Archivo:** `src/layouts/BaseLayout.astro`

### 2.2a: Eliminar imports de componentes del cotizador
```diff
- import QuoteCartBadge from '@/components/quote/QuoteCartBadge.astro';
- import QuoteCartFloatingButton from '@/components/quote/QuoteCartFloatingButton.astro';
+ import Button from '@/components/ui/Button.astro';
```

### 2.2b: Reemplazar slot CTA del Header (lineas ~251-254)
```diff
  <Fragment slot="cta">
    <ThemeToggle />
-   <QuoteCartBadge />
+   <a href="/contacto" class="header-cta-btn">Contactar</a>
  </Fragment>
```

Anadir estilo inline:
```css
.header-cta-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background-color: var(--color-brand, #308f40);
  color: #fff;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: var(--text-body);
  border-radius: var(--radius-pill);
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.18s ease;
}
.header-cta-btn:hover {
  background-color: var(--color-brand-700, #256d30);
  transform: translateY(-1px);
}
```

### 2.2c: Eliminar QuoteCartFloatingButton (linea ~284)
```diff
- <QuoteCartFloatingButton />
```

---

## Tarea 2.3: Actualizar links de WhatsApp en CTABand de paginas

Revisar todos los usos del componente `CTABand` en paginas existentes y actualizar los mensajes de WhatsApp de "cotizacion" a "contacto/proyecto".

**Archivos a revisar:**
- `src/pages/index.astro` (linea 228)
- Cualquier otra pagina que use CTABand con mensaje de cotizacion

---

## Criterios de aceptacion

- [ ] La navegacion muestra: Empresa, Servicios, Rental de equipos, Seguridad, Compliance, Contacto
- [ ] El boton "Contactar" aparece en el header (desktop y mobile)
- [ ] No hay badge de cotizador ni boton flotante en ninguna pagina
- [ ] El menu mobile incluye todos los nuevos items
- [ ] `npm run build` sin errores
