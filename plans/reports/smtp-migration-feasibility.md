---
report: SMTP Hostinger Migration - Feasibility Analysis
date: 2026-08-12
status: Planned
---

# Feasibility Analysis: Migracion de Resend API a SMTP Hostinger

## Executive Summary

La migracion de Resend API a SMTP Hostinger es **tecnicamente viable** con un esfuerzo **Medio-Bajo** (~2 dias). El cambio es principalmente de infraestructura: reemplazar el SDK de Resend por Nodemailer con configuracion SMTP directa. Los templates HTML y la logica de negocio permanecen intactos.

## Analisis del Estado Actual

### Integracion Resend (actual)

```
src/lib/resend.ts          → Cliente Resend (26 lineas)
src/pages/api/quote-email.ts → Endpoint API (246 lineas)
src/lib/quoteEmailTemplate.ts → Template empresa (242 lineas)
src/lib/quoteClientEmailTemplate.ts → Template cliente (224 lineas)
```

**Dependencias clave:**
- `resend` ^6.19.0 (SDK oficial)
- `@astrojs/node` ^11.1.0 (SSR adapter)

**Variables de entorno:**
- `RESEND_API_KEY` — API key de Resend
- `QUOTE_EMAIL_FROM` — Remitente (actualmente `onboarding@resend.dev`)
- `QUOTE_EMAIL_TO` — Destinatario interno

### Volumen de correos estimado

| Escenario | Correos/mes | Impacto |
|-----------|-------------|---------|
| Bajo (10 cotizaciones/sem) | ~80 | Sin problema en SMTP Hostinger |
| Medio (30 cotizaciones/sem) | ~240 | Dentro de limites tipicos |
| Alto (100 cotizaciones/sem) | ~800 | Verificar limites de Hostinger |

> Cada cotizacion genera 2 correos (empresa + cliente).

## Analisis de Viabilidad Tecnica

### 1. Nodemailer como reemplazo

| Aspecto | Evaluacion | Notas |
|---------|------------|-------|
| Viabilidad | ✅ Alta | Libreria estandar de Node.js para envio SMTP |
| Riesgo | Bajo | Libreria madura, 52M+ descargas/semana en npm |
| Complejidad | Baja | API simple, similar a Resend en uso |
| Mantenimiento | ✅ Activo | Ultima version 2025, mantenida activamente |

### 2. SMTP Hostinger

| Aspecto | Evaluacion | Notas |
|---------|------------|-------|
| Viabilidad | ✅ Alta | Hostinger provee SMTP para todas las cuentas de correo |
| Riesgo | Medio | Limites de envio mas bajos que Resend |
| Complejidad | Baja | Configuracion estandar SSL/TLS |
| Disponibilidad | ⚠️ Media | Depende de la infraestructura de Hostinger |

### 3. Impacto en el codigo

| Archivo | Cambio requerido | Esfuerzo |
|---------|-----------------|----------|
| `src/lib/resend.ts` | Eliminar | Low |
| `src/lib/smtp.ts` (nuevo) | Crear transporter Nodemailer | Low |
| `src/pages/api/quote-email.ts` | Cambiar `resend.emails.send()` por `transporter.sendMail()` | Medium |
| `src/lib/quoteEmailTemplate.ts` | Sin cambios | None |
| `src/lib/quoteClientEmailTemplate.ts` | Sin cambios | None |
| `.env` / `.env.example` | Actualizar variables | Low |
| `package.json` | Reemplazar `resend` por `nodemailer` | Low |

**Total de archivos afectados: 5** (2 sin cambios, 3 con modificaciones)

### 4. Seguridad

| Aspecto | Evaluacion | Notas |
|---------|------------|-------|
| Credenciales SMTP | ✅ Seguro | Solo server-side, en variables de entorno |
| Connection | ✅ Seguro | SSL/TLS en puerto 465 |
| Exposicion | ✅ No expuesta | Nodemailer solo corre en el servidor Node.js |
| Password management | ⚠️ Considerar | Rotacion de password requiere actualizar .env y Hostinger |

## Analisis Comparativo: Resend vs SMTP Hostinger

### Funcional

| Caracteristica | Resend API | SMTP Hostinger |
|----------------|------------|----------------|
| Envio de emails | ✅ | ✅ |
| HTML emails | ✅ | ✅ |
| Reply-To | ✅ | ✅ |
| Templates | ✅ | ✅ (se construyen manualmente) |
| Tracking/Analytics | ✅ (webhooks) | ❌ |
| Domain verification | ✅ (DKIM/SPF auto) | ⚠️ Manual (DNS) |
| Retry automatico | ✅ | ❌ (manual) |
| Rate limiting | ✅ (built-in) | ⚠️ (limites del hosting) |
| Pool de conexiones | N/A (HTTP API) | ✅ (Nodemailer) |
| Logs de envio | ✅ (dashboard) | ❌ (logs del servidor) |

### Costo

| Factor | Resend | SMTP Hostinger |
|--------|--------|----------------|
| Costo mensual | $0 (free tier) | $0 (incluido en hosting) |
| Costo por email | $0 hasta 3k/mes | $0 |
| Costo si escala | $20/mes (50k) | Posible upgrade de hosting |
| Costo de migracion | N/A | ~2 dias de desarrollo |

### Operacional

| Factor | Resend | SMTP Hostinger |
|--------|--------|----------------|
| Setup | 5 min (API key) | 15 min (crear cuenta + config) |
| Mantenimiento | Zero | Bajo (verificar que cuenta exista) |
| Monitoring | Dashboard de Resend | Logs del servidor |
| Deliverability | Alta (IPs dedicadas) | Media (IP compartida del hosting) |
| Soporte | Email/Chat de Resend | Soporte de Hostinger |

## Analisis de Riesgos

### Riesgo 1: Deliverability (correos a spam)

| Aspecto | Detalle |
|---------|---------|
| Probabilidad | Media |
| Impacto | Alto |
| Descripcion | Los correos enviados via SMTP compartido de Hostinger pueden tener menor reputacion que las IPs dedicadas de Resend |
| Mitigacion | Configurar registros SPF, DKIM y DMARC correctamente en el DNS del dominio |

### Riesgo 2: Limites de envio de Hostinger

| Aspecto | Detalle |
|---------|---------|
| Probabilidad | Baja-Media |
| Impacto | Medio |
| Descripcion | Hostinger tipicamente limita a 100-200 emails/hora por cuenta |
| Mitigacion | Verificar limites exactos en Hostinger. Para el volumen estimado (~80-240/mes), no deberia ser problema |

### Riesgo 3: Disponibilidad del SMTP

| Aspecto | Detalle |
|---------|---------|
| Probabilidad | Baja |
| Impacto | Alto |
| Descripcion | Si el SMTP de Hostinger esta caido, los correos no se envian |
| Mitigacion | WhatsApp sigue funcionando como fallback. Implementar reintentos con backoff |

### Riesgo 4: Credenciales expuestas

| Aspecto | Detalle |
|---------|---------|
| Probabilidad | Muy baja |
| Impacto | Critico |
| Descripcion | Si las credenciales SMTP se filtran, podrian enviar correos en nombre del dominio |
| Mitigacion | Variables de entorno server-side. Nodemailer nunca expone credenciales al cliente |

## Analisis de Dependencias Externas

### Antes (Resend)
```
App → Resend API → Internet → SMTP de Resend → Destinatario
```
- 2 saltos de red (App→Resend, Resend→Destinatario)
- Dependencia de 2 servicios (Resend API + infraestructura Resend)

### Despues (SMTP Hostinger)
```
App → Hostinger SMTP → Destinatario
```
- 1 salto de red (App→Hostinger SMTP)
- Dependencia de 1 servicio (Hostinger)
- Menos latencia potencial

## Requisitos Previos

Antes de iniciar la migracion, se necesita:

- [ ] **Cuenta de correo creada** en Hostinger (ej: `cotizaciones@ipproyectosindustriales.cl`)
- [ ] **Credenciales SMTP** obtenidas del panel de Hostinger
- [ ] **Registros DNS verificados**: SPF, DKIM, DMARC configurados para el dominio
- [ ] **Limites de envio** confirmados con Hostinger
- [ ] **Backup** del codigo actual (commit en git)

## Recomendacion Final

### ✅ Migracion RECOMENDADA

La migracion es recomendable porque:

1. **Elimina una dependencia externa** — Resend no es critico para el negocio
2. **Reduce costos potenciales** — Si el volumen crece, SMTP incluido en hosting vs $20/mes en Resend
3. **Mejor control** — Administracion directa desde el panel de Hostinger
4. **Suficiente para el volumen** — ~80-240 correos/mes esta dentro de limites tipicos de hosting
5. **El esfuerzo es bajo** — ~2 dias de trabajo, cambios menores en el codigo

### Consideraciones

- **No migrar si**: Se necesita tracking/analytics de correos, o si el volumen supera los limites de Hostinger
- **Mantener Resend como opcion**: El codigo puede disenarse para soportar ambos providers (feature flag)

## Plan de Rollback

Si la migracion presenta problemas en produccion:

1. Restaurar `src/lib/resend.ts` desde git
2. Revertir cambios en `quote-email.ts`
3. Restaurar variables de entorno de Resend
4. Re-deploy a Hostinger

> El rollback es sencillo porque los templates HTML no cambian. Solo se modifica la capa de transporte.

## Conclusion

La migracion de Resend API a SMTP Hostinger es **viable, recomendable y de bajo riesgo**. El esfuerzo estimado es de **~2 dias** con un impacto minimo en el codigo existente. Los templates HTML y la logica de negocio permanecen intactos, solo cambia el mecanismo de transporte de correos.

### Proximos Pasos

1. Crear cuenta de correo en Hostinger
2. Obtener credenciales SMTP
3. Configurar registros DNS (SPF, DKIM, DMARC)
4. Implementar migracion segun plan
5. Testing en desarrollo
6. Deploy a produccion
