// src/lib/resend.ts
// Cliente Resend configurado con variables de entorno.
// Solo se usa en server-side (endpoints API).

import { Resend } from 'resend';

// Obtener API key desde variables de entorno
const apiKey = import.meta.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn(
    '⚠️ RESEND_API_KEY no está configurada en .env. ' +
    'Los correos no se enviarán. Configura tu API key en https://resend.com/api-keys'
  );
}

// Instancia de Resend (reutilizable)
export const resend = new Resend(apiKey || 're_placeholder');

// Configuración de correos
export const EMAIL_CONFIG = {
  // Remitente (usar dominio verificado en producción)
  from: import.meta.env.QUOTE_EMAIL_FROM || 'matias.castillo@sansano.usm.cl',
  // Destinatario interno (empresa)
  toCompany: import.meta.env.QUOTE_EMAIL_TO || 'matias.castillo@sansano.usm.cl',
};
