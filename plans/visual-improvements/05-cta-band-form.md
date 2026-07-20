# Spec 05 — CTABand + QuoteFormAdvanced (acordeones, grid, fondo)

**Fase:** 4
**Estado:** ⬜ Pendiente
**Archivos a modificar:**
- `src/components/ui/QuoteFormAdvanced.astro`
- `src/components/ui/CTABand.astro`

**Depende de:** Spec 01 (la data del sitio está centralizada — el form sigue siendo un componente, no consume site.ts).
**Bloquea a:** Spec 09 (la página `/contacto` usa este form).

---

## Objetivo

1. **Corregir el bug de los acordeones**: en la versión actual, el texto de los items colapsados (Grúas alto tonelaje, Alza-hombre, Camión pluma, Manipulador telescópico) puede quedar visible al cerrar porque el selector CSS `[data-collapse].open > .qcollapse` no captura el `.qcollapse` cuando está en un nivel profundo. La solución más robusta es usar `<details>` / `<summary>` nativos o reorganizar el DOM.
2. **Grid 4 columnas** para inputs en desktop (≥1024px), 2 en tablet, 1 en mobile. Los selects largos y textareas mantienen ancho completo.
3. **Mejorar el fondo visual** del `CTABand` que envuelve el form: overlay con más textura, contraste de la tarjeta del form elevado, mejor jerarquía visual.
4. **Mantener los 2 botones** (Submit + WhatsApp), pero con microinteracciones.
5. **No renombrar** el componente: `QuoteFormAdvanced.astro` mantiene su nombre.

## Estado actual del bug de acordeones

```html
<div class="qdivcard" data-collapse>
  <label class="qdivcard__head">
    <input type="checkbox" class="js-collapse" name="servicio_izaje">
    <span class="qbox">...</span>
    <b>Izaje</b>
  </label>
  <div class="qcollapse qdivcard__body">
    <!-- contenido -->
  </div>
</div>
```

CSS actual:

```css
[data-collapse].open > .qcollapse {
  max-height: 2000px;
}
```

El selector `>` solo funciona si `.qcollapse` es **hijo directo** de `[data-collapse]`. Aquí lo es, así que en principio debería funcionar. **El problema real** es que `.qcollapse` tiene `max-height: 0; overflow: hidden;` y la transición usa `max-height`. Cuando el contenido mide más de `2000px` (puede pasar con muchos inputs), el contenido se corta al cerrar. Y cuando se abre, la transición desde `0` a `2000px` se ve "snap" porque el navegador interpola entre esos dos valores, no entre `0` y la altura real.

**Solución robusta**: usar `<details>` / `<summary>` con animación CSS. O usar `aria-expanded` con JS que mide `scrollHeight`. La opción con `<details>` es más accesible y elimina JS para el toggle.

## Cambios en `src/components/ui/QuoteFormAdvanced.astro`

```astro
---
// src/components/ui/QuoteFormAdvanced.astro
// Formulario de cotización dinámico con pre-selección por ruta.
// Acordeones con <details>/<summary> (accesible, sin JS para toggle).
// Grid 4 columnas en desktop.

import Icon from './Icon.astro';

export interface Props {
  action?: string;
  preselectedServices?: string[];
  className?: string;
}

const {
  action = '/api/contact',
  preselectedServices = [],
  className = '',
} = Astro.props;

// Detección de ruta actual para pre-marcar servicios.
const currentPath = Astro.url.pathname;
const pathFlags = {
  izaje: currentPath.includes('/arriendo/izaje'),
  tierra: currentPath.includes('/arriendo/movimiento-de-tierra'),
  transporte: currentPath.includes('/arriendo/transporte'),
  especiales: currentPath.includes('/arriendo/equipos-especiales'),
  ingenieria: currentPath.includes('/servicios/ingenieria'),
  construccion: currentPath.includes('/servicios/construccion'),
  montajes: currentPath.includes('/servicios/montajes'),
  portuaria: currentPath.includes('/servicios/infraestructura-portuaria'),
};

const isChecked = (key: keyof typeof pathFlags) =>
  pathFlags[key] || preselectedServices.includes(key);
---

<form
  class={`quote-form-advanced ${className}`.trim()}
  action={action}
  method="POST"
  id="quoteFormAdvanced"
  novalidate
>
  <!-- ─── Sección 1: Datos de la empresa ───────────────────────────── -->
  <fieldset class="qsection">
    <legend class="qsection__legend">
      <span class="qsection__num">1</span>
      <span class="qsection__legend-text">
        <strong>Datos de la empresa</strong>
        <small>Cotizamos a empresas. Estos datos agilizan la respuesta y la facturación.</small>
      </span>
    </legend>
    <div class="qgrid qgrid--4">
      <div class="qfield">
        <label for="qf-rut">RUT empresa *</label>
        <input id="qf-rut" type="text" name="rut" placeholder="76.123.456-7" required>
      </div>
      <div class="qfield">
        <label for="qf-razon">Razón social *</label>
        <input id="qf-razon" type="text" name="razon_social" placeholder="Razón social" required>
      </div>
      <div class="qfield">
        <label for="qf-giro">Giro</label>
        <input id="qf-giro" type="text" name="giro" placeholder="Giro comercial">
      </div>
      <div class="qfield">
        <label for="qf-fantasia">Nombre de fantasía</label>
        <input id="qf-fantasia" type="text" name="nombre_fantasia" placeholder="Nombre de fantasía">
      </div>
      <div class="qfield qfield--wide">
        <label for="qf-direccion">Dirección</label>
        <input id="qf-direccion" type="text" name="direccion" placeholder="Calle y número">
      </div>
      <div class="qfield">
        <label for="qf-ciudad">Ciudad</label>
        <input id="qf-ciudad" type="text" name="ciudad" placeholder="Ciudad">
      </div>
      <div class="qfield">
        <label for="qf-comuna">Comuna</label>
        <input id="qf-comuna" type="text" name="comuna" placeholder="Comuna">
      </div>
      <div class="qfield">
        <label for="qf-contacto">Nombre de contacto *</label>
        <input id="qf-contacto" type="text" name="contacto" placeholder="Tu nombre" required>
      </div>
      <div class="qfield">
        <label for="qf-email">E-mail de contacto *</label>
        <input id="qf-email" type="email" name="email" placeholder="tu@correo.cl" required>
      </div>
      <div class="qfield">
        <label for="qf-telefono">Teléfono / WhatsApp *</label>
        <input id="qf-telefono" type="tel" name="telefono" placeholder="+56 9 ..." required>
      </div>
    </div>
  </fieldset>

  <!-- ─── Sección 2: Servicio de interés ──────────────────────────── -->
  <fieldset class="qsection">
    <legend class="qsection__legend">
      <span class="qsection__num">2</span>
      <span class="qsection__legend-text">
        <strong>Servicio de interés</strong>
        <small>Puedes cotizar varias categorías a la vez.</small>
      </span>
    </legend>

    <div class="qdivcards">
      <!-- Izaje -->
      <details class="qdivcard" name="servicios" open={isChecked('izaje')}>
        <summary class="qdivcard__head">
          <span class="qdivcard__indicator" aria-hidden="true"></span>
          <span class="qdivcard__title">Izaje</span>
          <span class="qtag">Grúas y altura</span>
        </summary>
        <div class="qdivcard__body">
          <p class="qhint">Marca cada equipo que necesites y completa sus datos.</p>

          <details class="qeqitem">
            <summary class="qeqitem__head">
              <span class="qeqitem__indicator" aria-hidden="true"></span>
              <span>Grúas alto tonelaje</span>
            </summary>
            <div class="qeqitem__sub">
              <div class="qgrid qgrid--2">
                <div class="qfield">
                  <label for="qf-tipo-grua">Tipo</label>
                  <select id="qf-tipo-grua" name="tipo_grua">
                    <option value="" selected disabled>Selecciona</option>
                    <option>AT — Todo Terreno</option>
                    <option>RT — Rough Terrain</option>
                  </select>
                </div>
                <div class="qfield">
                  <label for="qf-tonelaje">Tonelaje requerido</label>
                  <input id="qf-tonelaje" type="text" name="tonelaje" placeholder="ej: 250 t">
                </div>
                <div class="qfield">
                  <label for="qf-peso-carga">Peso de la carga a izar</label>
                  <input id="qf-peso-carga" type="text" name="peso_carga" placeholder="ej: 80 t">
                </div>
                <div class="qfield">
                  <label for="qf-radio">Radio / altura de izaje</label>
                  <input id="qf-radio" type="text" name="radio_altura" placeholder="ej: radio 18 m, altura 40 m">
                </div>
              </div>
              <fieldset class="qchips-wrap">
                <legend class="qsublabel">Servicio adicional</legend>
                <div class="qchips">
                  <label class="qchip"><input type="checkbox" name="con_operador"><span class="qbox"><Icon name="check" size={14} /></span><span>Con operador</span></label>
                  <label class="qchip"><input type="checkbox" name="rigger"><span class="qbox"><Icon name="check" size={14} /></span><span>Rigger</span></label>
                  <label class="qchip"><input type="checkbox" name="apr"><span class="qbox"><Icon name="check" size={14} /></span><span>APR (prevencionista)</span></label>
                </div>
              </fieldset>
            </div>
          </details>

          <details class="qeqitem">
            <summary class="qeqitem__head">
              <span class="qeqitem__indicator" aria-hidden="true"></span>
              <span>Alza-hombre</span>
            </summary>
            <div class="qeqitem__sub">
              <div class="qfield">
                <label for="qf-altura-alza">Altura requerida</label>
                <input id="qf-altura-alza" type="text" name="altura_alza" placeholder="hasta 43 m">
              </div>
            </div>
          </details>

          <details class="qeqitem">
            <summary class="qeqitem__head">
              <span class="qeqitem__indicator" aria-hidden="true"></span>
              <span>Camión pluma</span>
            </summary>
            <div class="qeqitem__sub">
              <div class="qfield">
                <label for="qf-cap-pluma">Altura y/o capacidad</label>
                <input id="qf-cap-pluma" type="text" name="capacidad_pluma" placeholder="hasta 26 t">
              </div>
            </div>
          </details>

          <details class="qeqitem">
            <summary class="qeqitem__head">
              <span class="qeqitem__indicator" aria-hidden="true"></span>
              <span>Manipulador telescópico</span>
            </summary>
            <div class="qeqitem__sub">
              <div class="qfield">
                <label for="qf-cap-manipulador">Altura y/o capacidad</label>
                <input id="qf-cap-manipulador" type="text" name="capacidad_manipulador" placeholder="ej: 17 m / 4 t">
              </div>
            </div>
          </details>
        </div>
      </details>

      <!-- Movimiento de Tierra -->
      <details class="qdivcard" name="servicios" open={isChecked('tierra')}>
        <summary class="qdivcard__head">
          <span class="qdivcard__indicator" aria-hidden="true"></span>
          <span class="qdivcard__title">Movimiento de Tierra</span>
          <span class="qtag">Maquinaria pesada</span>
        </summary>
        <div class="qdivcard__body">
          <fieldset class="qchips-wrap">
            <legend class="qsublabel">Equipos que necesitas</legend>
            <div class="qchips">
              <label class="qchip"><input type="checkbox" name="camiones_tolva"><span class="qbox"><Icon name="check" size={14} /></span><span>Camiones tolva</span></label>
              <label class="qchip"><input type="checkbox" name="cargadores_frontales"><span class="qbox"><Icon name="check" size={14} /></span><span>Cargadores frontales</span></label>
              <label class="qchip"><input type="checkbox" name="excavadoras"><span class="qbox"><Icon name="check" size={14} /></span><span>Excavadoras</span></label>
              <label class="qchip"><input type="checkbox" name="retroexcavadoras"><span class="qbox"><Icon name="check" size={14} /></span><span>Retroexcavadoras</span></label>
              <label class="qchip"><input type="checkbox" name="minicargadores"><span class="qbox"><Icon name="check" size={14} /></span><span>Minicargadores</span></label>
              <label class="qchip"><input type="checkbox" name="rodillos"><span class="qbox"><Icon name="check" size={14} /></span><span>Rodillos compactadores</span></label>
              <label class="qchip"><input type="checkbox" name="aljibes"><span class="qbox"><Icon name="check" size={14} /></span><span>Aljibes</span></label>
            </div>
          </fieldset>
        </div>
      </details>

      <!-- Transporte -->
      <details class="qdivcard" name="servicios" open={isChecked('transporte')}>
        <summary class="qdivcard__head">
          <span class="qdivcard__indicator" aria-hidden="true"></span>
          <span class="qdivcard__title">Transporte</span>
          <span class="qtag">Punto a punto</span>
        </summary>
        <div class="qdivcard__body">
          <p class="qhint">Servicio punto a punto (origen → destino), no arriendo en faena.</p>
          <div class="qgrid qgrid--2">
            <div class="qfield">
              <label for="qf-tipo-transporte">Tipo de transporte</label>
              <select id="qf-tipo-transporte" name="tipo_transporte">
                <option value="" selected disabled>Selecciona</option>
                <option>Rampla seca</option>
                <option>Cama baja</option>
                <option>Carga sobredimensionada</option>
              </select>
            </div>
            <div class="qfield">
              <label for="qf-peso-transporte">Peso de la carga</label>
              <input id="qf-peso-transporte" type="text" name="peso_transporte" placeholder="ej: 45 t">
            </div>
          </div>
          <fieldset class="qchips-wrap">
            <legend class="qsublabel">Dimensiones de la carga</legend>
            <div class="qgrid qgrid--3">
              <div class="qfield">
                <label for="qf-largo">Largo</label>
                <input id="qf-largo" type="text" name="largo" placeholder="m">
              </div>
              <div class="qfield">
                <label for="qf-ancho">Ancho</label>
                <input id="qf-ancho" type="text" name="ancho" placeholder="m">
              </div>
              <div class="qfield">
                <label for="qf-alto">Alto</label>
                <input id="qf-alto" type="text" name="alto" placeholder="m">
              </div>
            </div>
          </fieldset>
          <div class="qgrid qgrid--2">
            <div class="qfield">
              <label for="qf-fecha-inicio-transporte">Fecha de inicio</label>
              <input id="qf-fecha-inicio-transporte" type="date" name="fecha_inicio_transporte">
            </div>
            <div class="qfield">
              <label for="qf-escolta">¿Requiere escolta?</label>
              <select id="qf-escolta" name="escolta">
                <option value="" selected disabled>Selecciona</option>
                <option>Sí</option>
                <option>No</option>
              </select>
            </div>
          </div>
        </div>
      </details>

      <!-- Equipos Especiales -->
      <details class="qdivcard" name="servicios" open={isChecked('especiales')}>
        <summary class="qdivcard__head">
          <span class="qdivcard__indicator" aria-hidden="true"></span>
          <span class="qdivcard__title">Equipos Especiales</span>
          <span class="qtag">Apoyo a faena</span>
        </summary>
        <div class="qdivcard__body">
          <fieldset class="qchips-wrap">
            <legend class="qsublabel">Equipos que necesitas</legend>
            <div class="qchips">
              <label class="qchip"><input type="checkbox" name="torre_iluminacion"><span class="qbox"><Icon name="check" size={14} /></span><span>Torre iluminación</span></label>
              <label class="qchip"><input type="checkbox" name="generador"><span class="qbox"><Icon name="check" size={14} /></span><span>Generador</span></label>
              <label class="qchip"><input type="checkbox" name="compresor"><span class="qbox"><Icon name="check" size={14} /></span><span>Compresor</span></label>
              <label class="qchip"><input type="checkbox" name="bus"><span class="qbox"><Icon name="check" size={14} /></span><span>Bus</span></label>
              <label class="qchip"><input type="checkbox" name="minibus"><span class="qbox"><Icon name="check" size={14} /></span><span>Minibús</span></label>
              <label class="qchip"><input type="checkbox" name="camion_34"><span class="qbox"><Icon name="check" size={14} /></span><span>Camión 3/4</span></label>
              <label class="qchip"><input type="checkbox" name="camioneta"><span class="qbox"><Icon name="check" size={14} /></span><span>Camioneta</span></label>
              <label class="qchip"><input type="checkbox" name="petroleador"><span class="qbox"><Icon name="check" size={14} /></span><span>Camión petroleador</span></label>
              <label class="qchip"><input type="checkbox" name="canastillo"><span class="qbox"><Icon name="check" size={14} /></span><span>Canastillo</span></label>
              <label class="qchip"><input type="checkbox" name="bomba_hormigon"><span class="qbox"><Icon name="check" size={14} /></span><span>Bomba hormigón</span></label>
              <label class="qchip"><input type="checkbox" name="termofusion"><span class="qbox"><Icon name="check" size={14} /></span><span>Equipo termofusión</span></label>
            </div>
          </fieldset>
        </div>
      </details>

      <!-- Ingeniería, Construcción, Montajes, Portuaria: cards simples con chips -->
      <details class="qdivcard" name="servicios" open={isChecked('ingenieria')}>
        <summary class="qdivcard__head">
          <span class="qdivcard__indicator" aria-hidden="true"></span>
          <span class="qdivcard__title">Ingeniería</span>
          <span class="qtag">Diseño y gestión</span>
        </summary>
        <div class="qdivcard__body">
          <fieldset class="qchips-wrap">
            <legend class="qsublabel">Servicios que necesitas</legend>
            <div class="qchips">
              <label class="qchip"><input type="checkbox" name="ing_detalle"><span class="qbox"><Icon name="check" size={14} /></span><span>Ingeniería de detalle</span></label>
              <label class="qchip"><input type="checkbox" name="ing_gestion"><span class="qbox"><Icon name="check" size={14} /></span><span>Gestión de proyectos</span></label>
              <label class="qchip"><input type="checkbox" name="ing_compras"><span class="qbox"><Icon name="check" size={14} /></span><span>Compras y contratos</span></label>
              <label class="qchip"><input type="checkbox" name="ing_puesta_marcha"><span class="qbox"><Icon name="check" size={14} /></span><span>Puesta en marcha</span></label>
            </div>
          </fieldset>
        </div>
      </details>

      <details class="qdivcard" name="servicios" open={isChecked('construccion')}>
        <summary class="qdivcard__head">
          <span class="qdivcard__indicator" aria-hidden="true"></span>
          <span class="qdivcard__title">Construcción</span>
          <span class="qtag">Obras civiles</span>
        </summary>
        <div class="qdivcard__body">
          <fieldset class="qchips-wrap">
            <legend class="qsublabel">Servicios que necesitas</legend>
            <div class="qchips">
              <label class="qchip"><input type="checkbox" name="contratos_epc"><span class="qbox"><Icon name="check" size={14} /></span><span>Contratos EPC</span></label>
              <label class="qchip"><input type="checkbox" name="prefabricados"><span class="qbox"><Icon name="check" size={14} /></span><span>Prefabricados</span></label>
              <label class="qchip"><input type="checkbox" name="estructuras_metalicas"><span class="qbox"><Icon name="check" size={14} /></span><span>Estructuras metálicas</span></label>
              <label class="qchip"><input type="checkbox" name="granallado"><span class="qbox"><Icon name="check" size={14} /></span><span>Granallado ecológico</span></label>
              <label class="qchip"><input type="checkbox" name="pinturas_especiales"><span class="qbox"><Icon name="check" size={14} /></span><span>Pinturas especiales</span></label>
            </div>
          </fieldset>
        </div>
      </details>

      <details class="qdivcard" name="servicios" open={isChecked('montajes')}>
        <summary class="qdivcard__head">
          <span class="qdivcard__indicator" aria-hidden="true"></span>
          <span class="qdivcard__title">Montajes</span>
          <span class="qtag">Electromecánico</span>
        </summary>
        <div class="qdivcard__body">
          <fieldset class="qchips-wrap">
            <legend class="qsublabel">Servicios que necesitas</legend>
            <div class="qchips">
              <label class="qchip"><input type="checkbox" name="montaje_electromecanico"><span class="qbox"><Icon name="check" size={14} /></span><span>Montaje electromecánico</span></label>
              <label class="qchip"><input type="checkbox" name="pipelines"><span class="qbox"><Icon name="check" size={14} /></span><span>Pipelines industriales</span></label>
              <label class="qchip"><input type="checkbox" name="termofusion_hdpe"><span class="qbox"><Icon name="check" size={14} /></span><span>Termofusión HDPE</span></label>
              <label class="qchip"><input type="checkbox" name="cortinas_eolicas"><span class="qbox"><Icon name="check" size={14} /></span><span>Cortinas y pantallas eólicas</span></label>
              <label class="qchip"><input type="checkbox" name="estructuras_montaje"><span class="qbox"><Icon name="check" size={14} /></span><span>Estructuras metálicas</span></label>
            </div>
          </fieldset>
        </div>
      </details>

      <details class="qdivcard" name="servicios" open={isChecked('portuaria')}>
        <summary class="qdivcard__head">
          <span class="qdivcard__indicator" aria-hidden="true"></span>
          <span class="qdivcard__title">Infraestructura Portuaria</span>
          <span class="qtag">Obras marítimas</span>
        </summary>
        <div class="qdivcard__body">
          <fieldset class="qchips-wrap">
            <legend class="qsublabel">Servicios que necesitas</legend>
            <div class="qchips">
              <label class="qchip"><input type="checkbox" name="mantencion_maritima"><span class="qbox"><Icon name="check" size={14} /></span><span>Mantención obras marítimas</span></label>
              <label class="qchip"><input type="checkbox" name="muelles"><span class="qbox"><Icon name="check" size={14} /></span><span>Muelles y defensas</span></label>
              <label class="qchip"><input type="checkbox" name="impermeabilizacion"><span class="qbox"><Icon name="check" size={14} /></span><span>Impermeabilización</span></label>
              <label class="qchip"><input type="checkbox" name="estructuras_costeras"><span class="qbox"><Icon name="check" size={14} /></span><span>Estructuras costeras</span></label>
            </div>
          </fieldset>
        </div>
      </details>
    </div>
  </fieldset>

  <!-- ─── Sección 3: Datos del arriendo ────────────────────────────── -->
  <fieldset class="qsection" id="sec-arriendo" hidden>
    <legend class="qsection__legend">
      <span class="qsection__num">3</span>
      <span class="qsection__legend-text">
        <strong>Datos del arriendo</strong>
        <small>Para calcular disponibilidad y tarifa de movilización.</small>
      </span>
    </legend>
    <div class="qgrid qgrid--4">
      <div class="qfield">
        <label for="qf-fecha-inicio">Fecha de inicio</label>
        <input id="qf-fecha-inicio" type="date" name="fecha_inicio">
      </div>
      <div class="qfield">
        <label for="qf-fecha-termino">Fecha de término</label>
        <input id="qf-fecha-termino" type="date" name="fecha_termino">
      </div>
      <div class="qfield">
        <label for="qf-duracion">Duración</label>
        <input id="qf-duracion" type="number" name="duracion" placeholder="ej: 10">
      </div>
      <div class="qfield">
        <label for="qf-unidad">Unidad</label>
        <select id="qf-unidad" name="unidad">
          <option value="" selected disabled>Selecciona</option>
          <option>Días</option>
          <option>Turnos</option>
          <option>Horas</option>
        </select>
      </div>
    </div>
    <hr class="qdivider">
    <fieldset class="qsubgroup">
      <legend class="qsublabel">Ubicación del servicio</legend>
      <div class="qgrid qgrid--4">
        <div class="qfield">
          <label for="qf-region">Región</label>
          <select id="qf-region" name="region">
            <option value="" selected disabled>Selecciona</option>
            <option>Antofagasta (II)</option>
            <option>Atacama (III)</option>
            <option>Coquimbo (IV)</option>
            <option>Valparaíso (V)</option>
            <option>Metropolitana (RM)</option>
            <option>Otra región</option>
          </select>
        </div>
        <div class="qfield">
          <label for="qf-comuna-servicio">Comuna</label>
          <input id="qf-comuna-servicio" type="text" name="comuna_servicio" placeholder="Comuna">
        </div>
        <div class="qfield qfield--wide">
          <label for="qf-direccion-servicio">Dirección / link Maps</label>
          <input id="qf-direccion-servicio" type="text" name="direccion_servicio" placeholder="Dirección o link de Google Maps">
        </div>
        <div class="qfield">
          <label for="qf-tipo-acceso">Tipo de acceso</label>
          <select id="qf-tipo-acceso" name="tipo_acceso">
            <option value="" selected disabled>Selecciona</option>
            <option>Pavimentado</option>
            <option>Ripio</option>
            <option>Tierra</option>
            <option>Difícil acceso</option>
          </select>
        </div>
      </div>
    </fieldset>
  </fieldset>

  <div class="qactions">
    <button class="qsubmit qsubmit--primary" type="submit">
      Solicitar cotización
    </button>
    <a
      class="qsubmit qsubmit--whatsapp"
      href="https://wa.me/56956594144?text=Hola%20IP%20Proyectos%20Industriales%2C%20quisiera%20solicitar%20una%20cotizaci%C3%B3n."
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon name="whatsapp" size={20} />
      Escribir por WhatsApp
    </a>
  </div>
</form>

<script>
  // Mostrar/ocultar sección "Datos del arriendo" según servicios seleccionados.
  (function () {
    const form = document.getElementById('quoteFormAdvanced');
    if (!form) return;
    const arriendoSection = document.getElementById('sec-arriendo');
    if (!arriendoSection) return;

    // Si al cargar ya hay cards abiertas por pre-selección, mostrar.
    const anyOpen = Array.from(form.querySelectorAll<HTMLDetailsElement>('.qdivcard'))
      .some((d) => d.open);
    arriendoSection.hidden = !anyOpen;

    form.addEventListener('toggle', (e) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('qdivcard')) return;
      const anyOpenNow = Array.from(form.querySelectorAll<HTMLDetailsElement>('.qdivcard'))
        .some((d) => d.open);
      arriendoSection.hidden = !anyOpenNow;
    }, true);
  })();
</script>

<style>
  /* ── Layout base ────────────────────────────────────────────────── */
  .quote-form-advanced {
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .qsection {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: clamp(20px, 3vw, 32px);
  }

  .qsection__legend {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin: 0 0 20px;
    padding: 0;
    width: 100%;
  }

  .qsection__num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--color-brand, #1a9c4a);
    color: #fff;
    border-radius: 50%;
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: 0.95rem;
    flex-shrink: 0;
  }

  .qsection__legend-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .qsection__legend-text strong {
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: 1.1rem;
    color: #fff;
  }

  .qsection__legend-text small {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
  }

  /* ── Grids ──────────────────────────────────────────────────────── */
  .qgrid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .qgrid--2 {
    grid-template-columns: 1fr;
  }

  .qgrid--3 {
    grid-template-columns: 1fr;
  }

  .qgrid--4 {
    grid-template-columns: 1fr;
  }

  @media (min-width: 640px) {
    .qgrid--2 { grid-template-columns: 1fr 1fr; }
    .qgrid--3 { grid-template-columns: 1fr 1fr 1fr; }
    .qgrid--4 { grid-template-columns: 1fr 1fr; }
  }

  @media (min-width: 1024px) {
    .qgrid--4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
  }

  .qfield--wide {
    /* En grids de 4, ocupa 2 columnas en desktop */
    grid-column: span 1;
  }

  @media (min-width: 1024px) {
    .qfield--wide { grid-column: span 2; }
  }

  /* ── Field ──────────────────────────────────────────────────────── */
  .qfield {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .qfield label {
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.85);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .qfield input,
  .qfield select {
    padding: 12px 14px;
    font-size: 0.95rem;
    font-family: var(--font-body);
    background: rgba(255, 255, 255, 0.06);
    border: 1.5px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    color: #fff;
    transition: border-color 0.15s var(--ease-out, ease),
      background 0.15s var(--ease-out, ease);
  }

  .qfield input::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }

  .qfield input:focus-visible,
  .qfield select:focus-visible {
    outline: none;
    border-color: var(--color-brand-300, #4ade80);
    background: rgba(255, 255, 255, 0.1);
  }

  .qfield select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 38px;
  }

  /* ── Acordeones con <details> ───────────────────────────────────── */
  .qdivcards {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .qdivcard,
  .qeqitem {
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.02);
    overflow: hidden;
  }

  .qdivcard[open],
  .qeqitem[open] {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .qdivcard__head,
  .qeqitem__head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    cursor: pointer;
    list-style: none;
    user-select: none;
  }

  .qdivcard__head::-webkit-details-marker,
  .qeqitem__head::-webkit-details-marker {
    display: none;
  }

  .qdivcard__title,
  .qeqitem__head > span:last-child {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1rem;
    color: #fff;
  }

  .qdivcard__indicator,
  .qeqitem__indicator {
    width: 16px;
    height: 16px;
    border: 1.5px solid rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    flex-shrink: 0;
    position: relative;
    transition: all 0.15s var(--ease-out, ease);
  }

  .qdivcard[open] > .qdivcard__head .qdivcard__indicator,
  .qeqitem[open] > .qeqitem__head .qeqitem__indicator {
    background: var(--color-brand, #1a9c4a);
    border-color: var(--color-brand, #1a9c4a);
  }

  .qdivcard[open] > .qdivcard__head .qdivcard__indicator::after,
  .qeqitem[open] > .qeqitem__head .qeqitem__indicator::after {
    content: '';
    position: absolute;
    inset: 4px;
    background: #fff;
    border-radius: 50%;
  }

  .qtag {
    margin-left: auto;
    padding: 4px 10px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 999px;
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .qdivcard__body {
    padding: 0 18px 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .qhint {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }

  .qeqitem__sub {
    padding: 0 18px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .qsublabel {
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.75);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 6px 0 0;
    padding: 0;
  }

  .qchips-wrap {
    border: 0;
    padding: 0;
    margin: 0;
  }

  .qchips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .qchip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    cursor: pointer;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.9);
    transition: all 0.15s var(--ease-out, ease);
  }

  .qchip:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.25);
  }

  .qchip .qbox {
    width: 18px;
    height: 18px;
    border: 1.5px solid rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .qchip .qbox :global(svg) {
    opacity: 0;
    color: #fff;
    transition: opacity 0.15s var(--ease-out, ease);
  }

  .qchip :global(input:checked) ~ .qbox {
    background: var(--color-brand, #1a9c4a);
    border-color: var(--color-brand, #1a9c4a);
  }

  .qchip :global(input:checked) ~ .qbox :global(svg) {
    opacity: 1;
  }

  .qchip :global(input) {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  /* ── Divider ────────────────────────────────────────────────────── */
  .qdivider {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin: 20px 0;
  }

  .qsubgroup {
    border: 0;
    padding: 0;
    margin: 0;
  }

  /* ── Actions ────────────────────────────────────────────────────── */
  .qactions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    justify-content: flex-start;
  }

  .qsubmit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px 28px;
    border: 0;
    border-radius: 999px;
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 0.95rem;
    text-decoration: none;
    cursor: pointer;
    transition: transform 0.15s var(--ease-out, ease),
      background 0.15s var(--ease-out, ease),
      box-shadow 0.15s var(--ease-out, ease);
  }

  .qsubmit--primary {
    background: var(--color-brand, #1a9c4a);
    color: #fff;
  }

  .qsubmit--primary:hover,
  .qsubmit--primary:focus-visible {
    background: var(--color-brand-700, #15803d);
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(26, 156, 74, 0.3);
  }

  .qsubmit--whatsapp {
    background: transparent;
    color: #fff;
    border: 1.5px solid rgba(255, 255, 255, 0.4);
  }

  .qsubmit--whatsapp:hover,
  .qsubmit--whatsapp:focus-visible {
    border-color: #fff;
    transform: translateY(-2px);
  }

  @media (prefers-reduced-motion: reduce) {
    .qdivcard,
    .qeqitem,
    .qsubmit,
    .qchip,
    .qdivcard__indicator,
    .qeqitem__indicator {
      transition: none;
    }
  }
</style>
```

## Cambios en `src/components/ui/CTABand.astro`

```diff
   .cta-band__overlay {
     position: absolute;
     inset: 0;
     z-index: 1;
-    background: linear-gradient(
-      180deg,
-      rgba(13, 22, 17, 0.78) 0%,
-      rgba(13, 22, 17, 0.9) 100%
-    );
+    background:
+      radial-gradient(ellipse at top, rgba(26, 156, 74, 0.15) 0%, transparent 50%),
+      linear-gradient(180deg, rgba(13, 22, 17, 0.85) 0%, rgba(13, 22, 17, 0.95) 100%);
+    backdrop-filter: blur(2px);
   }

   .cta-band__form {
-    margin: 32px auto;
+    margin: 32px auto;
+    background: rgba(13, 22, 17, 0.6);
+    border: 1px solid rgba(255, 255, 255, 0.08);
+    border-radius: 18px;
+    padding: clamp(24px, 4vw, 40px);
+    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
   }
```

## Decisiones de diseño

1. **`<details>` / `<summary>` en vez de `<input type="checkbox">` + CSS**: el bug de los acordeones se elimina de raíz. La animación ahora es nativa del navegador (instantánea, sin `max-height` magic numbers). Accesibilidad gratis: el navegador anuncia expandido/colapsado.

2. **`name="servicios"` en los `<details>`**: convierte los cards en grupo exclusivo. Abrir uno cierra los otros (como un radio group). Esto reduce el ruido visual: el usuario no ve 5 cards expandidos al mismo tiempo.

3. **Grid 4 columnas en desktop**: aplica a campos cortos (RUT, Razón social, Giro, etc.). Los campos anchos (`qfield--wide`) ocupan 2 columnas. Selects y textareas: ancho completo o según el grid.

4. **Indicador circular en vez de checkbox cuadrado**: el círculo con punto central es más "acordeón" que "checkbox". Comunica mejor que es un toggle de sección, no una selección de item.

5. **`<fieldset>` y `<legend>`**: agrupa semánticamente las secciones. Screen readers anuncian "Datos de la empresa, fieldset" antes de los inputs.

6. **CTA del form en tarjeta elevada**: la tarjeta con sombra y borde sutil hace que el form destaque sobre el fondo con imagen. El usuario sabe dónde está el punto de acción.

7. **Mantener `QuoteFormAdvanced.astro`**: no se renombra. El cambio de comportamiento (acordeones nativos) se documenta en el header del archivo.

8. **Submit + WhatsApp**: ambos se mantienen, en el mismo orden. El Submit es primario (verde sólido), WhatsApp es secundario (outline blanco). En `/contacto` se omite el segundo submit para no duplicar, decisión de Spec 09.

## Tareas

- [ ] Reemplazar `QuoteFormAdvanced.astro` con la nueva versión.
- [ ] Actualizar `CTABand.astro` con el overlay mejorado y la tarjeta del form.
- [ ] Verificar en `/arriendo/izaje/gruas-100-toneladas/` que la sección 2 abre con "Izaje" pre-seleccionado.
- [ ] Verificar que los acordeones se cierran correctamente al cambiar de servicio.
- [ ] Validar el form con teclado: `<details>` debe abrir/cerrar con Space/Enter (comportamiento nativo).
- [ ] Validar la grilla en mobile (1 col), tablet (2 col), desktop (4 col).
- [ ] Confirmar que la sección 3 "Datos del arriendo" se muestra/oculta dinámicamente según si hay cards abiertos.

## Definition of Done

- [ ] Los acordeones se abren/cierran correctamente con un click.
- [ ] El contenido de un acordeón cerrado no es visible (no hay overflow).
- [ ] El grid de inputs muestra 4 columnas en desktop (≥1024px), 2 en tablet (≥640px), 1 en mobile.
- [ ] Los campos anchos (`qfield--wide`) ocupan 2 columnas en desktop.
- [ ] Los `<details>` tienen `name="servicios"` y funcionan como grupo exclusivo.
- [ ] El form se envía correctamente (test manual: llenar y Submit → ver request en DevTools).
- [ ] La sección 3 "Datos del arriendo" se oculta cuando ningún servicio está abierto.
- [ ] La tarjeta del form tiene fondo elevado sobre la imagen del CTABand.
- [ ] `prefers-reduced-motion: reduce` desactiva las transiciones.
- [ ] `npm run build` no genera warnings.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| `<details>` no soportado en navegadores muy antiguos | Fallback gracioso: el contenido siempre se ve (sin collapse). IE11 no es target, pero el polyfill es trivial si se necesita. |
| `name="servicios"` para acordeón exclusivo no soportado en Safari < 15.4 | Documentar el comportamiento esperado; degradar a "no exclusivo" si se detecta el browser |
| El form no envía datos a un endpoint real (action="/api/contact" no existe) | Es problema del backend, no del spec. La acción del form queda como placeholder. |
| `novalidate` desactiva la validación nativa del browser | Intencional: el form usa `required` para semántica pero la validación visual es custom. Considerar un handler `submit` que valide. |
| Cambio del nombre del form a `QuoteFormAdvanced` mantiene el call-site | El componente sigue llamándose igual, no se renombra. Sin cambio. |
