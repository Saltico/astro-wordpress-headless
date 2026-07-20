# Spec 08 — Integración al Sitio (Header, Navigation, Footer, Home)

**Fases:** 10, 11, 12
**Estado:** ✅ Completo
**Archivos a modificar:**
- `src/components/layout/Header.astro` (Fase 10)
- `src/components/layout/Navigation.astro` (Fase 10)
- `src/components/layout/Footer.astro` (Fase 11)
- `src/pages/index.astro` (Fase 12)
- `src/types/navigation.ts` (Fase 10)

**Depende de:** [03-routes-templates.md](./03-routes-templates.md) (URLs finales)
**Bloquea a:** [10-acceptance-criteria.md](./10-acceptance-criteria.md) (validación final)

---

## Objetivo

Actualizar todos los puntos del sitio que linkean a URLs del catálogo viejo para que apunten a las nuevas URLs `/arriendo/*`. Esto incluye la navegación principal, footer, home y otros componentes que mencionan los equipos.

---

## Fase 10 — Navigation (Header)

### Estado actual

`src/components/layout/Header.astro` recibe un slot `navigation` con `items: NavItem[]`. La estructura está en `src/types/navigation.ts`.

La navegación actual probablemente tiene un item "Arriendo de grúas" o similar que apunta a `/arriendos`.

### Cambios necesarios

#### 10.1 `src/types/navigation.ts`

El tipo actual:

```ts
export interface NavItem {
  label: string;
  url: string;
  children?: NavItem[];
  icon?: string;
}
```

Sin cambios en la interfaz; solo en los datos que se le pasan.

#### 10.2 Encontrar dónde se definen los items de navegación

Buscar en el proyecto:

```bash
grep -r "items: \[" src/pages --include="*.astro" -l
grep -r "label:.*Arriendo" src --include="*.astro"
```

Los `items: NavItem[]` se pasan al `<Navigation items={...} />` en algún layout (`BaseLayout.astro` o en cada página individual).

#### 10.3 Modificar el item "Arriendo" del menú

**Antes:**

```ts
{
  label: 'Arriendo de grúas',
  url: '/arriendos',
}
```

**Después (mega-menú con 4 categorías):**

```ts
{
  label: 'Arriendo',
  url: '/arriendo',
  children: [
    {
      label: 'Izaje',
      url: '/arriendo/izaje',
    },
    {
      label: 'Movimiento de tierra',
      url: '/arriendo/movimiento-de-tierra',
    },
    {
      label: 'Transporte',
      url: '/arriendo/transporte',
    },
    {
      label: 'Equipos especiales',
      url: '/arriendo/equipos-especiales',
    },
  ],
}
```

#### 10.4 (Opcional) Mega-menú con sub-rutas

Si se quiere un mega-menú más rico (mostrar las sub-rutas dentro de cada categoría en el dropdown), expandir:

```ts
{
  label: 'Arriendo',
  url: '/arriendo',
  children: [
    {
      label: 'Izaje',
      url: '/arriendo/izaje',
      children: [
        { label: 'Grúas 60 t', url: '/arriendo/izaje/gruas-60-toneladas' },
        { label: 'Grúas 80 t', url: '/arriendo/izaje/gruas-80-toneladas' },
        { label: 'Grúas 100 t', url: '/arriendo/izaje/gruas-100-toneladas' },
        { label: 'Grúas 250 t', url: '/arriendo/izaje/gruas-250-toneladas' },
        { label: 'Camiones pluma', url: '/arriendo/izaje/camiones-pluma' },
        { label: 'Alza-hombre', url: '/arriendo/izaje/alza-hombre' },
        { label: 'Grúas horquilla', url: '/arriendo/izaje/gruas-horquilla' },
      ],
    },
    // ... 3 categorías más
  ],
}
```

Esto requiere extender `NavItem` para soportar 2 niveles de `children`. **Evaluar costo/beneficio** — un dropdown de 22 items puede ser overwhelming. Recomendación: empezar con 1 nivel de children (4 categorías), iterar después si hace falta.

### Verificación de `Navigation.astro`

El componente actual usa `children` con un submenú básico. Si se añade un segundo nivel, verificar que el componente lo soporta. Si no, hay que extenderlo.

Revisar `src/components/layout/Navigation.astro` (líneas 39-58 aprox) y confirmar el renderizado de sub-subitems.

---

## Fase 11 — Footer

### Estado actual

`src/components/layout/Footer.astro` recibe un prop `columns` con `links`. Las columnas relevantes están en `src/pages/index.astro` (líneas 152-170):

```ts
columns: [
  {
    title: 'Servicios',
    links: [
      { label: 'Ingeniería', url: '/servicios/ingenieria' },
      // ...
      { label: 'Arriendo de grúas', url: '/arriendos' },  // ← URL VIEJA
    ],
  },
  // ...
]
```

### Cambios necesarios

**Opción A — Reemplazar el link simple por 4 links:**

```ts
{
  title: 'Arriendo',
  links: [
    { label: 'Catálogo completo', url: '/arriendo' },
    { label: 'Izaje', url: '/arriendo/izaje' },
    { label: 'Movimiento de tierra', url: '/arriendo/movimiento-de-tierra' },
    { label: 'Transporte', url: '/arriendo/transporte' },
    { label: 'Equipos especiales', url: '/arriendo/equipos-especiales' },
  ],
}
```

**Opción B — Footer con sitemap completo de las 27 URLs (recomendado para SEO):**

```ts
{
  title: 'Arriendo · Izaje',
  links: [
    { label: 'Ver izaje', url: '/arriendo/izaje' },
    { label: 'Grúas 60 t', url: '/arriendo/izaje/gruas-60-toneladas' },
    { label: 'Grúas 80 t', url: '/arriendo/izaje/gruas-80-toneladas' },
    { label: 'Grúas 100 t', url: '/arriendo/izaje/gruas-100-toneladas' },
    { label: 'Grúas 250 t', url: '/arriendo/izaje/gruas-250-toneladas' },
    { label: 'Camiones pluma', url: '/arriendo/izaje/camiones-pluma' },
    { label: 'Alza-hombre', url: '/arriendo/izaje/alza-hombre' },
    { label: 'Grúas horquilla', url: '/arriendo/izaje/gruas-horquilla' },
  ],
},
{
  title: 'Arriendo · Movimiento de tierra',
  links: [
    { label: 'Ver movimiento de tierra', url: '/arriendo/movimiento-de-tierra' },
    { label: 'Camiones tolva', url: '/arriendo/movimiento-de-tierra/camiones-tolva' },
    { label: 'Retroexcavadoras', url: '/arriendo/movimiento-de-tierra/retroexcavadoras' },
    { label: 'Minicargadores', url: '/arriendo/movimiento-de-tierra/minicargadores' },
  ],
},
// ... 2 columnas más para transporte y equipos-especiales
```

**Recomendación:** Opción B (footer sitemap completo). Mejora el crawl interno y la descubribilidad de las sub-rutas.

### Verificación

Verificar que `Footer.astro` soporta múltiples columnas con hasta 8-9 links. Si no, ajustar estilos (no se esperan problemas — los links ya fluyen con `flex-wrap`).

---

## Fase 12 — Home y otros componentes

### 12.1 `src/pages/index.astro`

Cambiar la referencia al servicio "Rental de equipos":

**Línea 89-97 (aprox):**

```ts
// Antes:
{
  category: 'Rental de equipos',
  title: 'Grúas de alto tonelaje',
  // ...
  link: '/arriendos',  // ← URL VIEJA
  linkLabel: 'Ver flota',
}

// Después:
{
  category: 'Arriendo',
  title: 'Grúas de alto tonelaje',
  // ...
  link: '/arriendo',  // ← URL NUEVA
  linkLabel: 'Ver catálogo',
}
```

También actualizar el link del footer (línea 158 aprox):

```ts
// Antes:
{ label: 'Arriendo de grúas', url: '/arriendos' },

// Después (puede ser solo el link o toda la columna, según Fase 11):
{ label: 'Catálogo de arriendo', url: '/arriendo' },
```

### 12.2 Buscar otros links a URLs viejas

```bash
grep -rn "arriendos" src/ --include="*.astro" --include="*.ts"
grep -rn "arriendo-maquinaria" src/ --include="*.astro" --include="*.ts"
```

Cada match debe actualizarse a la nueva URL. Casos comunes:
- Links en componentes UI (CTABand, HeroSection, etc.)
- Links en páginas de servicios (`/servicios/*.astro`)
- Links en páginas de proyectos (`/proyectos/*.astro`)
- Links en noticias (`/noticias/*.astro`)
- Links en el Footer columns

### 12.3 Páginas que mencionan categorías del catálogo

Verificar que las páginas de servicios que hablan de "arriendo" (si existen) apunten correctamente. Por ejemplo:

- `/servicios/ingenieria` probablemente no menciona arriendo
- `/servicios/montajes` puede mencionar izaje/arriendo
- `/proyectos/[slug]` puede tener cards que mencionan equipos

### 12.4 Schema.org de la home

Verificar que la `Organization` schema sigue apuntando correctamente a las nuevas URLs si tiene `sameAs` o `knowsAbout` con referencias al catálogo.

---

## Checklist de auditoría

Buscar y reemplazar sistemáticamente:

| Término a buscar | Reemplazar con | Tipo |
|---|---|---|
| `'/arriendos'` | `'/arriendo'` | Link |
| `'/arriendos/izaje'` | `'/arriendo/izaje'` | Link |
| `'/arriendos/movimiento-tierra'` | `'/arriendo/movimiento-de-tierra'` | Link |
| `'/arriendos/transporte'` | `'/arriendo/transporte'` | Link |
| `'/arriendos/equipos-especiales'` | `'/arriendo/equipos-especiales'` | Link |
| `'/arriendo-maquinaria'` | `'/arriendo'` | Link |
| `'/arriendo-maquinaria/gruas-alto-tonelaje/gruas-grove-gmk'` | `'/arriendo/izaje/gruas-100-toneladas#grua-grove-gmk-4100'` | Link |
| Texto "Arriendos" en labels de nav | Texto "Arriendo" | Label |

**Comando para auditar:**

```bash
# Linux/Mac
grep -rn "arriendos\|arriendo-maquinaria" src/ --include="*.astro" --include="*.ts"

# PowerShell
Get-ChildItem -LiteralPath "src" -Recurse -Include "*.astro","*.ts" | Select-String "arriendos|arriendo-maquinaria"
```

---

## Tareas

### Fase 10
- [ ] Localizar dónde se pasan los `items: NavItem[]` al `<Navigation />` (probablemente en cada página o en `BaseLayout`)
- [ ] Reemplazar el item "Arriendo de grúas" por la nueva estructura con 4 categorías de children
- [ ] Verificar que `Navigation.astro` renderiza correctamente el dropdown
- [ ] Probar navegación en mobile y desktop

### Fase 11
- [ ] Decidir entre Opción A (link simple) u Opción B (sitemap completo) para el footer
- [ ] Actualizar `src/pages/index.astro` con la nueva estructura de columnas
- [ ] Verificar que el footer no se rompe con 8-9 links por columna

### Fase 12
- [ ] Auditar todas las URLs `/arriendos` y `/arriendo-maquinaria` en `src/`
- [ ] Actualizar la home (`src/pages/index.astro`)
- [ ] Actualizar páginas de servicios que mencionen arriendo
- [ ] Actualizar páginas de proyectos que mencionen equipos
- [ ] Verificar que no quedan links rotos a URLs viejas

## Definition of Done

- [ ] El item "Arriendo" en el menú principal apunta a `/arriendo`
- [ ] El dropdown del menú principal muestra las 4 categorías
- [ ] El footer tiene links a `/arriendo/*` (mínimo: las 4 categorías; ideal: las 27 URLs)
- [ ] La home apunta a `/arriendo` en el CTA "Ver flota" / "Ver catálogo"
- [ ] El comando `grep -rn "arriendos\|arriendo-maquinaria" src/` no devuelve matches (excepto en `plans/` o `README` históricos)
- [ ] `npm run build` no genera warnings de "missing link" ni "broken link"
- [ ] Todas las páginas internas linkean correctamente al nuevo catálogo
- [ ] No hay links huérfanos a URLs viejas en el sitio

## Referencias

- README: [./README.md](./README.md)
- Spec 03: [./03-routes-templates.md](./03-routes-templates.md) — URLs finales
- Spec 07: [./07-redirects-migration.md](./07-redirects-migration.md) — qué URLs viejas redirigir
- `src/types/navigation.ts` — tipo `NavItem`
- `src/components/layout/Navigation.astro` — render del menú
- `src/components/layout/Footer.astro` — render del footer
