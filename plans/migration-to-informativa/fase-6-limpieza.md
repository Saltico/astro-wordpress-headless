# Fase 6: Limpieza y Desactivacion

**Complejidad:** Baja  
**Dependencias:** Fase 2 (CTAs ya reemplazados)  
**Archivos a modificar:** 2-3

## Objetivo

Desactivar o archivar los componentes y paginas del cotizador que ya no son parte del flujo principal. El cotizador se mantiene como pagina secundaria accesible por URL directa pero no se promociona.

---

## Tarea 6.1: Mantener pagina `/cotizador` como secundaria

**Archivo:** `src/pages/cotizador.astro`

No se elimina la pagina. Se mantiene con `noindex: true` (ya esta). Verificar que:
- No hay links internos que apunten a `/cotizador` desde la navegacion, footer o CTAs
- La pagina sigue siendo funcional si alguien accede por URL directa

---

## Tarea 6.2: Verificar que no quedan referencias al cotizador

**Busqueda global** en `src/` de:
- `href="/cotizador"` (excepto en `cotizador.astro` y componentes quote/)
- `href='/cotizador'`
- `"Ir al cotizador"`
- `"Cotizador"` en labels de botones
- `QuoteCartBadge` importado (excepto en su propio archivo)
- `QuoteCartFloatingButton` importado (excepto en su propio archivo)

**Archivos que podrian tener referencias residuales:**
- `src/pages/index.astro` - el CTABand y el link del hero search
- `src/pages/arriendo/[categoria]/` - posibles CTAs al cotizador
- `src/pages/servicios/` - posibles CTAs al cotizador
- `src/components/rental/` - CategoryShowcase o EquipmentSearch

---

## Tarea 6.3: Archivar componentes quote (opcional)

Los componentes en `src/components/quote/` no se eliminan (el cotizador sigue accesible). Pero se puede:
- Anadir un comentario en cada archivo indicando que son legacy
- O moverlos a `src/components/quote/_legacy/` si se prefiere organizar

**Decision:** NO mover ni eliminar. Solo verificar que no se importan desde paginas principales.

---

## Tarea 6.4: Limpiar `CategoryShowcase` de la homepage

**Archivo:** `src/components/rental/CategoryShowcase.astro`

Este componente se usaba en la homepage rental-first. Si ya no se importa en `index.astro` (Fase 3), verificar que no queda importado en ninguna otra pagina publica.

---

## Tarea 6.5: Limpiar `EquipmentSearch` de la homepage

**Archivo:** `src/components/rental/EquipmentSearch.astro`

Similar a CategoryShowcase: verificar que ya no se importa en `index.astro` tras la Fase 3.

---

## Criterios de aceptacion

- [ ] Busqueda global de "cotizador" en `src/pages/` (excepto `cotizador.astro`) no encuentra CTAs
- [ ] `QuoteCartBadge` y `QuoteCartFloatingButton` no se importan en `BaseLayout.astro`
- [ ] La pagina `/cotizador` sigue siendo accesible por URL directa
- [ ] `npm run build` sin errores ni warnings de imports no usados
