---
feature: Migracion Resend API a SMTP Hostinger
effort: Medium
dependencies:
  - Nodemailer (npm)
  - Credenciales SMTP de Hostinger
  - Cuenta de correo activa en Hostinger
status: Planned
---

# Migracion de Resend API a SMTP Hostinger

## Overview

Reemplazar la integracion actual de Resend API por una configuracion SMTP directa usando el servidor de correo de Hostinger. Esto elimina la dependencia de un servicio externo de terceros (Resend) y utiliza la infraestructura de correo ya disponible en el hosting contratado.

## Motivacion

| Factor | Resend API (actual) | SMTP Hostinger (objetivo) |
|--------|---------------------|---------------------------|
| Costo | Gratis hasta 3,000/mes, luego $20/mes | Incluido en el hosting |
| Dependencia externa | Si (servicio de terceros) | No (infraestructura propia) |
| Dominio de envio | Requiere verificacion DNS en Resend | Usa cuenta de correo del dominio |
| Latencia | API call a servidor Resend | Conexion directa al SMTP |
| Control | Limitado al panel de Resend | Control total desde Hostinger |
| Deliverability | Alta (IPs dedicadas) | Depende de la reputacion del hosting |

## Estado Actual (As-Is)

### Archivos involucrados

| Archivo | Rol | Accion |
|---------|-----|--------|
| `src/lib/resend.ts` | Cliente Resend + config de emails | **Reemplazar** por `src/lib/smtp.ts` |
| `src/pages/api/quote-email.ts` | Endpoint API que envia correos | **Modificar** para usar Nodemailer |
| `src/lib/quoteEmailTemplate.ts` | Template HTML correo empresa | **Sin cambios** |
| `src/lib/quoteClientEmailTemplate.ts` | Template HTML correo cliente | **Sin cambios** |
| `.env` / `.env.example` | Variables de entorno | **Modificar** variables |
| `package.json` | Dependencias | **Reemplazar** `resend` por `nodemailer` |

### Dependencias actuales

```json
{
  "dependencies": {
    "resend": "^6.19.0"  // ← Eliminar
  }
}
```

### Variables de entorno actuales

```env
RESEND_API_KEY=xxx
QUOTE_EMAIL_FROM=onboarding@resend.dev
QUOTE_EMAIL_TO=matias.castillo@sansano.usm.cl
```

## Estado Objetivo (To-Be)

### Nuevas variables de entorno

```env
# SMTP Hostinger
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=cotizaciones@ipproyectosindustriales.cl
SMTP_PASS=<password de la cuenta de correo>

# Configuracion de correos (se mantienen)
QUOTE_EMAIL_FROM=cotizaciones@ipproyectosindustriales.cl
QUOTE_EMAIL_TO=matias.castillo@sansano.usm.cl
```

### Nuevas dependencias

```json
{
  "dependencies": {
    "nodemailer": "^7.0.0"  // ← Nuevo
  }
}
```

## Requisitos Tecnicos

### 1. Crear cuenta de correo en Hostinger

Antes de la migracion, se necesita:
- Crear una cuenta de correo en Hostinger (ej: `cotizaciones@ipproyectosindustriales.cl`)
- Obtener las credenciales SMTP desde el panel de Hostinger
- Verificar que los registros DNS (SPF, DKIM, DMARC) esten configurados

### 2. Configuracion SMTP de Hostinger (tipica)

| Parametro | Valor |
|-----------|-------|
| Host | `smtp.hostinger.com` |
| Puerto (SSL/TLS) | `465` |
| Puerto (STARTTLS) | `587` |
| Seguridad | SSL/TLS recomendado |
| Autenticacion | Login + Password |

> **NOTA**: Los valores exactos deben confirmarse en el panel de Hostinger > Correos > Configuracion de cliente.

## Implementacion

### Paso 1: Instalar Nodemailer y desinstalar Resend (Effort: Low)

```bash
npm uninstall resend
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Paso 2: Crear cliente SMTP (Effort: Low)

**Archivo nuevo**: `src/lib/smtp.ts`

```typescript
// src/lib/smtp.ts
// Cliente SMTP configurado con Nodemailer para Hostinger.
// Solo se usa en server-side (endpoints API).

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Configuracion SMTP desde variables de entorno
const smtpHost = import.meta.env.SMTP_HOST || 'smtp.hostinger.com';
const smtpPort = Number(import.meta.env.SMTP_PORT) || 465;
const smtpSecure = import.meta.env.SMTP_SECURE !== 'false';
const smtpUser = import.meta.env.SMTP_USER;
const smtpPass = import.meta.env.SMTP_PASS;

if (!smtpUser || !smtpPass) {
  console.warn(
    '⚠️ SMTP_USER o SMTP_PASS no estan configuradas en .env. ' +
    'Los correos no se enviaran. Configura tus credenciales SMTP de Hostinger.'
  );
}

// Transporter reutilizable (Nodemailer maneja el pool de conexiones)
export const transporter: Transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure, // true para puerto 465 (SSL), false para 587 (STARTTLS)
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  // Opciones de connection para mejorar rendimiento
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000,
  rateLimit: 10,
});

// Verificar conexion al iniciar (opcional, para debugging)
export async function verifySmtpConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('✅ Conexion SMTP verificada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al verificar conexion SMTP:', error);
    return false;
  }
}

// Configuracion de correos
export const EMAIL_CONFIG = {
  from: import.meta.env.QUOTE_EMAIL_FROM || 'cotizaciones@ipproyectosindustriales.cl',
  toCompany: import.meta.env.QUOTE_EMAIL_TO || 'matias.castillo@sansano.usm.cl',
};
```

### Paso 3: Modificar endpoint API (Effort: Medium)

**Archivo**: `src/pages/api/quote-email.ts`

Cambios principales:
- Reemplazar `import { resend, EMAIL_CONFIG } from '@/lib/resend'` por `import { transporter, EMAIL_CONFIG } from '@/lib/smtp'`
- Cambiar la logica de envio de `resend.emails.send()` a `transporter.sendMail()`
- Adaptar el manejo de errores al formato de Nodemailer
- Eliminar la verificacion de `RESEND_API_KEY` y reemplazar por verificacion de `SMTP_USER`/`SMTP_PASS`

#### Antes (Resend):
```typescript
const { data, error } = await resend.emails.send({
  from: EMAIL_CONFIG.from,
  to: EMAIL_CONFIG.toCompany,
  replyTo: company.email,
  subject: `[INTERNO] ${subject}`,
  html: companyEmailHtml,
});
```

#### Despues (Nodemailer):
```typescript
const info = await transporter.sendMail({
  from: `"IP Proyectos Industriales" <${EMAIL_CONFIG.from}>`,
  to: EMAIL_CONFIG.toCompany,
  replyTo: company.email,
  subject: `[INTERNO] ${subject}`,
  html: companyEmailHtml,
});
```

### Paso 4: Actualizar variables de entorno (Effort: Low)

**Archivo**: `.env`

```diff
- RESEND_API_KEY=xxx
+ # SMTP Hostinger
+ SMTP_HOST=smtp.hostinger.com
+ SMTP_PORT=465
+ SMTP_SECURE=true
+ SMTP_USER=cotizaciones@ipproyectosindustriales.cl
+ SMTP_PASS=<password de la cuenta de correo>

- QUOTE_EMAIL_FROM=onboarding@resend.dev
+ QUOTE_EMAIL_FROM=cotizaciones@ipproyectosindustriales.cl
```

**Archivo**: `.env.example`

```diff
- # Resend API Key (privada, solo server-side)
- RESEND_API_KEY=xxxx
+ # SMTP Hostinger (privado, solo server-side)
+ SMTP_HOST=smtp.hostinger.com
+ SMTP_PORT=465
+ SMTP_SECURE=true
+ SMTP_USER=tu-cuenta@tudominio.com
+ SMTP_PASS=tu-password

- QUOTE_EMAIL_FROM=onboarding@resend.dev
+ QUOTE_EMAIL_FROM=cotizaciones@ipproyectosindustriales.cl
```

### Paso 5: Configurar variables en Hostinger (Effort: Low)

Las variables de entorno SMTP deben configurarse en el panel de Hostinger:
1. Ir a Hosting > Node.js > Variables de entorno
2. Agregar: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
3. Actualizar: `QUOTE_EMAIL_FROM`

### Paso 6: Eliminar archivos obsoletos (Effort: Low)

- Eliminar `src/lib/resend.ts`
- Eliminar referencias a Resend en documentacion

### Paso 7: Testing y validacion (Effort: Medium)

1. Verificar conexion SMTP (`verifySmtpConnection()`)
2. Enviar correo de prueba a empresa
3. Enviar correo de prueba a cliente
4. Verificar que los correos lleguen correctamente (no spam)
5. Probar con diferentes cantidades de equipos
6. Verificar manejo de errores (credenciales incorrectas, SMTP caido)
7. Testing en produccion

## Flujo de Envio

Ver: [plans/flows/smtp-migration-flow.mmd](./flows/smtp-migration-flow.mmd)

## Estrategia de Testing

### Unit Tests
- Verificar que el transporter se crea correctamente con las variables de entorno
- Verificar que `verifySmtpConnection()` maneja errores gracefully

### Integration Tests
- Enviar correo real via SMTP
- Verificar que ambos correos (empresa + cliente) se envian
- Probar con credenciales invalidas para verificar manejo de errores

### Manual Tests
- Completar flujo de cotizacion end-to-end
- Verificar que los correos llegan a bandeja de entrada (no spam)
- Verificar que el contenido HTML se renderiza correctamente en distintos clientes

## Riesgos y Mitigacion

| Riesgo | Impacto | Probabilidad | Mitigacion |
|--------|---------|--------------|------------|
| Credenciales SMTP expuestas | Critico | Baja | Solo server-side, nunca en cliente. Usar variables de entorno |
| Correos llegan a spam | Alto | Media | Configurar SPF, DKIM, DMARC en DNS del dominio |
| SMTP de Hostinger caido | Alto | Baja | Implementar reintentos con backoff. WhatsApp como fallback |
| Limites de envio del hosting | Medio | Media | Verificar limites de Hostinger (tipicamente 100-200 emails/hora) |
| Connection timeout | Medio | Media | Configurar timeouts adecuados, pool de conexiones |
| Password rotation | Bajo | Baja | Documentar proceso de actualizacion de credenciales |

## Cronograma Estimado

| Fase | Duracion | Descripcion |
|------|----------|-------------|
| Preparacion | 0.5 dia | Crear cuenta de correo en Hostinger, obtener credenciales SMTP |
| Implementacion | 0.5 dia | Crear `smtp.ts`, modificar `quote-email.ts`, actualizar `.env` |
| Testing local | 0.5 dia | Verificar conexion, enviar correos de prueba |
| Deploy | 0.25 dia | Configurar variables en Hostinger, desplegar |
| Testing produccion | 0.25 dia | Verificar correos en produccion, revisar spam |
| **Total** | **~2 dias** | |

## Criterios de Aceptacion

- [ ] Dependencia `resend` eliminada del proyecto
- [ ] Dependencia `nodemailer` instalada y funcionando
- [ ] Archivo `src/lib/resend.ts` eliminado
- [ ] Archivo `src/lib/smtp.ts` creado con configuracion SMTP
- [ ] Endpoint `quote-email.ts` usa Nodemailer en lugar de Resend
- [ ] Variables de entorno actualizadas (`.env`, `.env.example`, Hostinger)
- [ ] Correo a empresa se envia correctamente via SMTP
- [ ] Correo al cliente se envia correctamente via SMTP
- [ ] Manejo de errores funciona (credenciales invalidas, SMTP caido)
- [ ] Los correos no llegan a spam (SPF/DKIM configurados)
- [ ] Build de produccion compila sin errores
- [ ] Deploy a Hostinger funciona correctamente

## Referencias

- [Nodemailer Documentacion](https://nodemailer.com/about/)
- [Hostinger SMTP Configuration](https://www.hostinger.com/tutorials/how-to-configure-email-client)
- [Plan original de Resend](./resend-email-integration.md)
