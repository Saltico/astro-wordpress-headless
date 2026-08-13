---
report: SMTP Hostinger Migration - Effort Analysis
date: 2026-08-12
status: Planned
---

# Effort Analysis: Migracion de Resend API a SMTP Hostinger

## Resumen de Esfuerzo Total

| Categoria | Tareas | Esfuerzo Total |
|-----------|--------|----------------|
| Low | 5 | ~4-6 horas |
| Medium | 2 | ~4-6 horas |
| High | 0 | 0 |
| Very High | 0 | 0 |
| **TOTAL** | **7** | **~1.5-2 dias** |

## Desglose de Tareas

### Fase 1: Preparacion (0.5 dia)

| # | Tarea | Esfuerzo | Descripcion |
|---|-------|----------|-------------|
| 1.1 | Crear cuenta de correo en Hostinger | Low | Crear `cotizaciones@ipproyectosindustriales.cl` en el panel de Hostinger |
| 1.2 | Obtener credenciales SMTP | Low | Extraer host, puerto, usuario y password desde Hostinger |
| 1.3 | Configurar registros DNS (SPF, DKIM, DMARC) | Low | Verificar/configurar registros DNS para mejor deliverability |

### Fase 2: Implementacion (0.5 dia)

| # | Tarea | Esfuerzo | Descripcion |
|---|-------|----------|-------------|
| 2.1 | Desinstalar `resend`, instalar `nodemailer` | Low | `npm uninstall resend && npm install nodemailer @types/nodemailer` |
| 2.2 | Crear `src/lib/smtp.ts` | Low | Nuevo archivo con configuracion Nodemailer (~40 lineas) |
| 2.3 | Modificar `src/pages/api/quote-email.ts` | Medium | Reemplazar llamadas a Resend por Nodemailer (~30 lineas de cambio) |
| 2.4 | Actualizar `.env` y `.env.example` | Low | Cambiar variables de Resend a SMTP |
| 2.5 | Eliminar `src/lib/resend.ts` | Low | Eliminar archivo obsoleto |

### Fase 3: Testing Local (0.5 dia)

| # | Tarea | Esfuerzo | Descripcion |
|---|-------|----------|-------------|
| 3.1 | Verificar conexion SMTP | Low | Test de conexion con `verifySmtpConnection()` |
| 3.2 | Enviar correos de prueba | Medium | Enviar correos reales a empresa y cliente, verificar contenido |
| 3.3 | Probar manejo de errores | Low | Verificar comportamiento con credenciales invalidas |
| 3.4 | Verificar build de produccion | Low | `npm run build` debe compilar sin errores |

### Fase 4: Deploy y Validacion (0.5 dia)

| # | Tarea | Esfuerzo | Descripcion |
|---|-------|----------|-------------|
| 4.1 | Configurar variables en Hostinger | Low | Agregar SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS en panel |
| 4.2 | Deploy a produccion | Low | `npm run deploy` o deploy automatico |
| 4.3 | Testing end-to-end en produccion | Medium | Completar cotizacion real, verificar correos recibidos |
| 4.4 | Verificar deliverability | Low | Confirmar que correos no llegan a spam |

## Matriz de Esfuerzo por Archivo

| Archivo | Accion | Lineas afectadas | Esfuerzo |
|---------|--------|-------------------|----------|
| `package.json` | Modificar | ~2 lineas | Low |
| `src/lib/resend.ts` | Eliminar | 26 lineas | Low |
| `src/lib/smtp.ts` | Crear | ~40 lineas | Low |
| `src/pages/api/quote-email.ts` | Modificar | ~30 lineas | Medium |
| `.env` | Modificar | ~5 lineas | Low |
| `.env.example` | Modificar | ~8 lineas | Low |
| `src/lib/quoteEmailTemplate.ts` | Sin cambios | 0 | None |
| `src/lib/quoteClientEmailTemplate.ts` | Sin cambios | 0 | None |

## Camino Critico

```
1.1 Crear cuenta correo
    ↓
1.2 Obtener credenciales SMTP
    ↓
2.1 Instalar nodemailer ──→ 2.2 Crear smtp.ts ──→ 2.3 Modificar endpoint
                                                          ↓
2.4 Actualizar .env ─────────────────────────────────────→ 3.1 Verificar conexion
                                                          ↓
                                                    3.2 Enviar correos prueba
                                                          ↓
                                                    4.1 Config Hostinger
                                                          ↓
                                                    4.2 Deploy
                                                          ↓
                                                    4.3 Testing produccion
```

## Recursos Requeridos

| Recurso | Cantidad | Notas |
|---------|----------|-------|
| Desarrollador | 1 | Conocimiento basico de Node.js y SMTP |
| Acceso panel Hostinger | 1 | Para crear cuenta y obtener credenciales |
| Acceso DNS del dominio | 1 | Para configurar SPF/DKIM/DMARC |
| Cuenta de correo | 1 | `cotizaciones@ipproyectosindustriales.cl` |

## Dependencias Externas

| Dependencia | Tipo | Critica |
|-------------|------|---------|
| `nodemailer` | npm package | Si (reemplazo de Resend) |
| SMTP Hostinger | Servicio | Si (infraestructura de correo) |
| Cuenta de correo Hostinger | Configuracion | Si (credenciales SMTP) |
| Registros DNS | Configuracion | No (mejora deliverability) |

## Estimacion de Costo

| Concepto | Costo |
|----------|-------|
| Nodemailer | $0 (open source, MIT) |
| SMTP Hostinger | $0 (incluido en hosting) |
| Desarrollo (~2 dias) | Costo interno |
| **Total operativo** | **$0 adicional** |

### Comparacion de costo con Resend

| Periodo | Resend | SMTP Hostinger | Ahorro |
|---------|--------|----------------|--------|
| Mensual | $0 (free tier) | $0 | $0 |
| Si escala (>3k/mes) | $20/mes | $0 | $20/mes |
| Anual (volumen bajo) | $0 | $0 | $0 |
| Anual (volumen alto) | $240 | $0 | $240 |

## Riesgos de Cronograma

| Riesgo | Impacto en timeline | Probabilidad |
|--------|---------------------|--------------|
| Hostinger no permite SMTP | +1 dia (buscar alternativa) | Muy baja |
| Problemas de deliverability | +0.5 dia (configurar DNS) | Media |
| Credenciales no funcionan | +0.25 dia (verificar con Hostinger) | Baja |
| Tests fallan en produccion | +0.5 dia (debugging) | Baja |

## Conclusion

La migracion tiene un esfuerzo total estimado de **~1.5-2 dias** con bajo riesgo. La mayoria de las tareas son de esfuerzo **Low**, con solo 2 tareas de esfuerzo **Medium** (modificar el endpoint y testing de correos). No hay tareas de esfuerzo High o Very High.

El camino critico pasa por la disponibilidad de las credenciales SMTP de Hostinger, por lo que se recomienda completar la Fase 1 (Preparacion) antes de iniciar la implementacion.
