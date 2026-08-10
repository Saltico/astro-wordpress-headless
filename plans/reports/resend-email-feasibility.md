---
report: Resend Email Integration - Feasibility Analysis
date: 2026-08-10
status: Planned
---

# Feasibility Analysis: Resend Email Integration

## Executive Summary

La integración de Resend para envío de correos después de la cotización es **técnicamente viable** con un esfuerzo **Medio** (2-3 días). El principal desafío es el cambio de `output: 'static'` a `output: 'server'` en la configuración de Astro, que requiere un adaptador SSR.

## Análisis de Viabilidad Técnica

### 1. Cambio de SSG a SSR

| Aspecto | Evaluación | Notas |
|---------|------------|-------|
| Viabilidad | ✅ Alta | Astro soporta SSR nativamente con adaptadores |
| Riesgo | ⚠️ Medio | Puede afectar rendimiento y despliegue |
| Complejidad | Baja | Solo cambiar config + instalar adaptador |
| Impacto | Alto | Todas las páginas ahora son server-rendered |

**Recomendación**: Evaluar si se necesita SSR para todas las páginas o solo para el endpoint API. Astro permite configurar rutas específicas como server-rendered manteniendo el resto como static.

### 2. Resend API

| Aspecto | Evaluación | Notas |
|---------|------------|-------|
| Viabilidad | ✅ Alta | API bien documentada, SDK oficial para Node.js |
| Riesgo | Bajo | Servicio estable y confiable |
| Complejidad | Baja | 3 líneas de código para enviar un email |
| Costo | Bajo | 100 emails/día gratis, $20/mes por 50k emails |

### 3. Seguridad

| Aspecto | Evaluación | Notas |
|---------|------------|-------|
| API Key | ✅ Seguro | Solo en server-side, nunca expuesta al cliente |
| Validación | ✅ Necesario | Validar datos en el endpoint antes de enviar |
| Rate Limiting | ⚠️ Considerar | Implementar throttling o usar el rate limit de Resend |

### 4. Template de Correo

| Aspecto | Evaluación | Notas |
|---------|------------|-------|
| Viabilidad | ✅ Alta | HTML inline, sin dependencias externas |
| Riesgo | Bajo | Compatible con la mayoría de clientes de correo |
| Complejidad | Media | Requiere diseño responsive y testing |

## Análisis de Alternativas

### Opción A: SSR con Adaptador Node.js (Recomendada)

```
Pros:
+ Control total sobre el endpoint
+ API key protegida
+ Sin dependencias externas
+ Escalable

Contras:
- Cambio de arquitectura (SSG → SSR)
- Requiere servidor Node.js en producción
- Posible impacto en rendimiento
```

### Opción B: Serverless Functions (Vercel/Netlify)

```
Pros:
+ No cambiar la arquitectura del sitio
+ Escalable automáticamente
+ Separación de responsabilidades

Contras:
- Dependencia del proveedor de hosting
- Configuración adicional
- Posibles costos adicionales
```

### Opción C: Webhook Externo (Zapier, Make)

```
Pros:
+ Sin cambios en el código
+ No requiere servidor
+ Fácil de configurar

Contras:
- Dependencia de servicio externo
- Menos control
- Latencia adicional
- Costo recurrente
```

### Opción D: Email desde el Cliente (No recomendado)

```
Pros:
+ Más simple de implementar

Contras:
- EXPONE LA API KEY (CRÍTICO)
- Inseguro
- No recomendado por Resend
```

## Análisis de Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| API key expuesta | Baja | Crítico | Solo usar en server-side, nunca en client |
| Cambio SSG→SSR rompe algo | Media | Alto | Testing exhaustivo, rollback plan |
| Correo llega a spam | Media | Medio | Verificar dominio, usar DKIM/SPF |
| Rate limiting de Resend | Baja | Bajo | Implementar retry con backoff |
| Error de red | Baja | Bajo | Mostrar error claro, fallback a WhatsApp |
| Template no se ve bien | Media | Bajo | Testing en múltiples clientes de correo |

## Análisis de Costos

### Resend Pricing (2026)

| Plan | Precio | Emails/mes | Notas |
|------|--------|------------|-------|
| Free | $0 | 3,000 | 100/día, dominio de prueba |
| Pro | $20/mes | 50,000 | Dominio propio, mejor entregabilidad |
| Enterprise | Custom | Custom | Soporte dedicado |

**Estimación para IP Proyectos Industriales**:
- Asumiendo 50-100 cotizaciones/mes
- Plan Free debería ser suficiente
- Upgrade a Pro si se necesita mejor entregabilidad

## Análisis de Competidores

### Servicios de Email API

| Servicio | Precio | Emails gratis | SDK Node.js | Notas |
|----------|--------|---------------|-------------|-------|
| **Resend** | $20/mes | 3,000/mes | ✅ Oficial | Moderno, bien documentado |
| SendGrid | $20/mes | 100/día | ✅ Oficial | Más maduro, más complejo |
| Mailgun | $35/mes | 5,000/mes | ✅ Oficial | Bueno para developers |
| Postmark | $15/mes | 100/mes | ✅ Oficial | Enfocado en transaccionales |
| Amazon SES | $0.10/1k | 62,000/mes (Lambda) | ✅ AWS SDK | Más barato, más complejo |

**Recomendación**: Resend es la mejor opción para este caso por:
- API simple y moderna
- SDK oficial bien mantenido
- Plan gratuito generoso
- Buena documentación

## Recomendación Final

### Arquitectura Recomendada

```
┌─────────────────────────────────────────────────────────────┐
│                    Astro SSR (Node.js)                       │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │  Static Pages   │    │  Server Routes                  │ │
│  │  (SSG)          │    │  /api/quote-email.ts            │ │
│  │  - Home         │    │  - POST handler                 │ │
│  │  - Catálogo     │    │  - Validación                   │ │
│  │  - About        │    │  - Template generation          │ │
│  │  - Contact      │    │  - Resend API call              │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │  SSR Pages      │    │  Environment                    │ │
│  │  - Cotizador    │    │  - RESEND_API_KEY               │ │
│  │  - Gracias      │    │  - QUOTE_EMAIL_FROM             │ │
│  └─────────────────┘    │  - QUOTE_EMAIL_TO               │ │
│                         └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Implementación Recomendada

1. **Fase 1: Configuración SSR** (1 día)
   - Instalar `@astrojs/node`
   - Actualizar `astro.config.mjs`
   - Verificar que el build funcione

2. **Fase 2: Endpoint API** (1 día)
   - Crear `src/lib/resend.ts`
   - Crear `src/lib/quoteEmailTemplate.ts`
   - Crear `src/pages/api/quote-email.ts`

3. **Fase 3: Integración Frontend** (1 día)
   - Modificar `QuoteReview.astro`
   - Agregar lógica de envío por email
   - Mantener fallback a WhatsApp

4. **Fase 4: Testing y Despliegue** (0.5 días)
   - Testing en desarrollo
   - Verificar entregabilidad
   - Despliegue a producción

## Conclusión

La integración de Resend es **viable y recomendada**. El principal cambio es migrar de SSG a SSR, lo cual es soportado nativamente por Astro. El esfuerzo total es de **2-3 días** con un riesgo **medio-bajo**.

### Próximos Pasos

1. ✅ Confirmar cambio a SSR
2. ✅ Obtener API key de Resend
3. ✅ Verificar dominio en Resend (opcional para producción)
4. ✅ Implementar según el plan
5. ✅ Testing y despliegue
