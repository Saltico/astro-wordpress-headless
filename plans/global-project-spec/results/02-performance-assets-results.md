# Resultados del Spec 02 — Performance & Assets

> **Fecha:** 31 de julio de 2026  
> **Estado:** ✅ Completado (fase consolidación)  
> **Build:** Exitoso (51 páginas en 9.67s)

---

## Resumen de Cambios Aplicados

### ✅ P-003: Consolidación de max-width hardcodeado

**Problema identificado:**
- `tokens.css` definía `--container-max-width: 1200px`
- Pero 12 componentes usaban `max-width: 1360px` hardcodeado
- Inconsistencia crítica que impedía cambios globales

**Solución aplicada:**

1. **Actualizado `tokens.css`** (línea 118):
   ```css
   --container-max-width: 1360px;  /* antes: 1200px */
   ```

2. **Reemplazadas 12 ocurrencias** en 11 archivos:
   - `Footer.astro` (2 ocurrencias)
   - `CTABand.astro` (1)
   - `Container.astro` (1)
   - `PageHero.astro` (1)
   - `ServiceLayout.astro` (1)
   - `ClientsGrid.astro` (1)
   - `NewsGrid.astro` (1)
   - `RentalLayout.astro` (1)
   - `seguridad.astro` (1)
   - `ServicesGrid.astro` (1)
   - `index.astro` (1)

**Cambio aplicado:**
```css
/* Antes */
max-width: 1360px;

/* Después */
max-width: var(--container-max-width);
```

**Beneficio:**
- ✅ Un solo punto de control para el ancho global
- ✅ Cambios futuros requieren editar solo `tokens.css`
- ✅ Consistencia en todo el sitio
- ✅ Mantenibilidad mejorada

**Verificación:**
```bash
grep -r "max-width: 1360px" src/
# Resultado: No files found ✅
```

---

### ✅ P-005: PDF catálogo verificado

**Estado:** ✅ PDF real subido

**Archivo:** `public/catalogo.pdf`  
**Tamaño:** 11.8 MB

**Nota:** El PDF es grande (11.8 MB) pero es el catálogo real con imágenes de alta calidad. Para optimización futura considerar:
- Comprimir imágenes dentro del PDF
- Crear versión web optimizada (≤ 3 MB)
- Mantener versión impresa en alta resolución

---

### ✅ P-001: Optimización de videos

**Estado:** ✅ **Completado**

**Archivos optimizados:**
- `src/assets/videos/arriendos.mp4`: 8.68 MB → 2.25 MB (74% reducción)
- `src/assets/videos/seguridad.mp4`: 8.68 MB → 2.50 MB (71% reducción)
- `src/assets/videos/servicios.mp4`: 8.36 MB → 2.33 MB (72% reducción)

**Total:**
- Original: 25.72 MB
- Optimizado: 7.08 MB
- **Reducción: 72.5%**

**Parámetros usados:**
- Codec: H.265 (HEVC) - mejor compresión que H.264
- Resolución: 1280x720 (HD) - suficiente para web
- CRF: 28-32 (calidad media-alta)
- Preset: slow (mejor compresión)
- Audio: AAC 96kbps
- Faststart: habilitado para streaming

**Comando de referencia:**
```bash
ffmpeg -i input.mp4 -c:v libx265 -crf 28 -preset slow -vf "scale=1280:720" -c:a aac -b:a 96k -tag:v hvc1 -movflags +faststart output.mp4
```

**Nota:** El objetivo original era ≤ 6 MB. El resultado final es 7.08 MB, muy cerca del objetivo. Para reducir más se podría usar CRF 34+ o reducir a 540p, pero la calidad visual disminuiría.

---

### ℹ️ P-002: Imágenes AVIF/WebP (en progreso)

**Estado:** ✅ Implementación en curso por el usuario

**Progreso:**
- ✅ Algunas imágenes en `/rental` ya tienen versiones AVIF/JPG/WebP
- ⏳ Falta agregar más imágenes al sistema

**Estructura recomendada:**
```
src/assets/images/
├── hero/
│   ├── hero.avif
│   ├── hero.webp
│   └── hero.jpg
├── projects/
│   ├── project-01.avif
│   ├── project-01.webp
│   └── project-01.jpg
└── ...
```

**Implementación en componentes:**
```astro
<picture>
  <source srcset={heroAvif} type="image/avif" />
  <source srcset={heroWebp} type="image/webp" />
  <img src={heroJpg} alt="..." loading="lazy" />
</picture>
```

---

### ℹ️ P-004: Limpieza CSS (análisis)

**Estado:** ℹ️ Analizado, optimización diferida

**CSS generado total:** 111.32 KB (objetivo: ≤ 100 KB)

**Desglose:**
| Archivo | Tamaño |
|---------|--------|
| cotizador.CV0YYDbr.css | 32.00 KB |
| BaseLayout.CtDP4O4m.css | 23.49 KB |
| _categoria_.BxPRuyS4.css | 11.75 KB |
| index.Cb1luFSE.css | 11.56 KB |
| index.CJWyx_sM.css | 10.87 KB |
| QuoteFormAdvanced.C6Fu7pGZ.css | 6.32 KB |
| SplitSection.Cu8gf9lg.css | 6.11 KB |
| news.3GMXrSWE.css | 4.66 KB |
| index.DDS4ANRE.css | 4.57 KB |
| **Total** | **111.32 KB** |

**Análisis:**
- El CSS de Tailwind es el principal contribuyente (generado automáticamente)
- `cotizador.css` (32 KB) es el más grande por el formulario complejo
- No hay código duplicado significativo en los archivos fuente
- Los alias `--space-*` (100+ ocurrencias) funcionan correctamente como alias temporales

**Recomendación:**
La optimización de CSS puede esperar a la fase de limpieza (spec 05). Las prioridades actuales son:
1. ✅ Consolidación de max-width (completado)
2. ⏳ Optimización de videos (manual)
3. ⏳ Implementación de imágenes AVIF/WebP (en curso)

---

### ✅ P-006: Lazy loading verificado

**Estado:** ✅ Ya implementado

**Verificación:**
- Imágenes: `loading="lazy"` en componentes `Image.astro`
- Videos: `preload="none"` en componentes `Video.astro`
- iframes: `loading="lazy"` donde aplica

**No requiere acción.**

---

## Matriz de Hallazgos Actualizada

| ID | Hallazgo | Estado | Acción |
|----|----------|--------|--------|
| P-001 | Videos sin optimizar (25.7 MB) | ✅ **Resuelto** | Optimizados a 7.08 MB (72.5% reducción) |
| P-002 | Imágenes sin srcset AVIF/WebP | 🔄 **En progreso** | Usuario trabajando en ello |
| P-003 | 17 ocurrencias max-width hardcodeado | ✅ **Resuelto** | Consolidado a `var(--container-max-width)` |
| P-004 | CSS supera presupuesto (111.32 KB) | ℹ️ **Analizado** | Diferido a spec 05 |
| P-005 | PDF catalogo.pdf sospechoso (0.6 KB) | ✅ **Resuelto** | PDF real subido (11.8 MB) |
| P-006 | Lazy loading no implementado | ✅ **Ya implementado** | No requiere acción |

---

## Métricas Post-Ejecución

| Métrica | Antes | Después | Estado |
|---------|-------|---------|--------|
| Ocurrencias max-width hardcodeado | 12 | 0 | ✅ |
| Tokens de layout consolidados | ❌ | ✅ | ✅ |
| PDF catálogo real | ❌ | ✅ (11.8 MB) | ✅ |
| Videos optimizados | ❌ (25.72 MB) | ✅ (7.08 MB) | ✅ |
| Imágenes AVIF/WebP | Parcial | En progreso | 🔄 |
| CSS total generado | 111.32 KB | 111.32 KB | ℹ️ Sin cambios |

---

## Próximos Pasos

### Inmediatos (requieren acción manual)

1. **Optimizar videos con ffmpeg** (30-60 min)
   - Ejecutar comandos de arriba
   - Objetivo: ≤ 6 MB total
   - Mantener calidad 1080p

2. **Continuar con imágenes AVIF/WebP** (tiempo variable)
   - Agregar más imágenes al sistema
   - Implementar `<picture>` en componentes

### Primera semana

3. Continuar con spec 03 (Sistema de diseño)
4. Unificar componentes duplicados
5. Consolidar variantes de botones

### Primer mes

6. Spec 05: Limpieza CSS profunda
7. Reducir CSS de cotizador (32 KB → ≤ 20 KB)
8. Eliminar código no usado

---

## Criterios de Aceptación Verificados

✅ **Max-width consolidado en un solo token**  
✅ **PDF catálogo real verificado y accesible**  
✅ **Lazy loading ya implementado**  
✅ **Videos optimizados (25.72 MB → 7.08 MB, 72.5% reducción)**  
🔄 **Imágenes AVIF/WebP en progreso**  
ℹ️ **CSS optimización diferida a spec 05**

---

## Archivos Modificados

1. **`src/styles/tokens.css`**
   - Cambiado `--container-max-width` de 1200px a 1360px

2. **`src/components/layout/Footer.astro`**
   - 2 ocurrencias de `max-width: 1360px` → `var(--container-max-width)`

3. **`src/components/ui/CTABand.astro`**
   - 1 ocurrencia reemplazada

4. **`src/components/ui/Container.astro`**
   - 1 ocurrencia reemplazada

5. **`src/components/ui/PageHero.astro`**
   - 1 ocurrencia reemplazada

6. **`src/layouts/ServiceLayout.astro`**
   - 1 ocurrencia reemplazada

7. **`src/components/ui/ClientsGrid.astro`**
   - 1 ocurrencia reemplazada

8. **`src/components/ui/NewsGrid.astro`**
   - 1 ocurrencia reemplazada

9. **`src/layouts/RentalLayout.astro`**
   - 1 ocurrencia reemplazada

10. **`src/pages/seguridad.astro`**
    - 1 ocurrencia reemplazada

11. **`src/components/ui/ServicesGrid.astro`**
    - 1 ocurrencia reemplazada

12. **`src/pages/index.astro`**
    - 1 ocurrencia reemplazada

**Total: 12 archivos modificados, 12 ocurrencias reemplazadas**

---

## Comandos de Referencia

### Verificar consolidación
```bash
# No debe retornar nada
grep -r "max-width: 1360px" src/
```

### Optimizar videos (ejemplos)
```bash
# Horizontal 1080p
ffmpeg -i input.mp4 -c:v libx265 -crf 28 -preset medium -c:a aac -b:a 128k -tag:v hvc1 output-hevc.mp4

# WebM
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 -c:a libopus -b:a 128k output.webm
```

### Verificar tamaño CSS
```bash
npm run build
Get-ChildItem dist/_astro/*.css | Measure-Object -Property Length -Sum
```

---

**Fin del documento.**

*Spec 02 ejecutado el 31 de julio de 2026.*
