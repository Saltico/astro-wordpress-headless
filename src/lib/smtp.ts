// src/lib/smtp.ts
// Cliente SMTP configurado con Nodemailer para Hostinger.
// Solo se usa en server-side (endpoints API).

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Configuración SMTP desde variables de entorno
const smtpHost = import.meta.env.SMTP_HOST || 'smtp.hostinger.com';
const smtpPort = Number(import.meta.env.SMTP_PORT) || 465;
const smtpSecure = import.meta.env.SMTP_SECURE !== 'false';
const smtpUser = import.meta.env.SMTP_USER;
const smtpPass = import.meta.env.SMTP_PASS;

if (!smtpUser || !smtpPass) {
  console.warn(
    '⚠️ SMTP_USER o SMTP_PASS no están configuradas en .env. ' +
    'Los correos no se enviarán. Configura tus credenciales SMTP de Hostinger.'
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
  // Opciones de conexión para mejorar rendimiento
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000,
  rateLimit: 10,
});

// Verificar conexión al iniciar (opcional, para debugging)
export async function verifySmtpConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al verificar conexión SMTP:', error);
    return false;
  }
}

// Configuración de correos
export const EMAIL_CONFIG = {
  from: import.meta.env.QUOTE_EMAIL_FROM || 'contacto@iprental.cl',
  toCompany: import.meta.env.QUOTE_EMAIL_TO || 'cotizaciones@iprental.cl',
};
