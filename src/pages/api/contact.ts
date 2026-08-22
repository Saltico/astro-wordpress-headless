// src/pages/api/contact.ts
// Endpoint API para enviar correos del formulario de contacto (/seguridad).
// Envía 2 correos: uno interno al equipo y otro de confirmación al usuario.

import type { APIRoute } from 'astro';
import { transporter, EMAIL_CONFIG } from '@/lib/smtp';
import { buildContactEmailTemplate, type ContactFormData } from '@/lib/contactEmailTemplate';
import { buildContactClientEmailTemplate } from '@/lib/contactClientEmailTemplate';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ─────────────────────────────────────────────────────────────
// Configuración
// ─────────────────────────────────────────────────────────────

/** Email destino interno (equipo). Usa CONTACT_EMAIL_TO o fallback a QUOTE_EMAIL_TO. */
const CONTACT_EMAIL_TO = import.meta.env.CONTACT_EMAIL_TO || import.meta.env.QUOTE_EMAIL_TO || 'contacto@iprental.cl';

/** Remitente para los correos de contacto. */
const CONTACT_EMAIL_FROM = import.meta.env.CONTACT_EMAIL_FROM || import.meta.env.QUOTE_EMAIL_FROM || 'contacto@iprental.cl';

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

interface ContactResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────
// Validación
// ─────────────────────────────────────────────────────────────

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 20;
const MAX_REASON_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 2000;

/** Email regex simple pero efectivo para validación básica. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valida los datos del formulario de contacto. */
function validateContactForm(body: unknown): { valid: boolean; errors?: Record<string, string>; data?: ContactFormData } {
  if (!body || typeof body !== 'object') {
    return { valid: false, errors: { body: 'El cuerpo de la solicitud es inválido.' } };
  }

  const { name, email, phone, reason, message } = body as Partial<ContactFormData>;
  const errors: Record<string, string> = {};

  // Nombre
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.name = 'El nombre es requerido.';
  } else if (name.trim().length > MAX_NAME_LENGTH) {
    errors.name = `El nombre no puede superar ${MAX_NAME_LENGTH} caracteres.`;
  }

  // Email
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.email = 'El email es requerido.';
  } else if (email.trim().length > MAX_EMAIL_LENGTH) {
    errors.email = `El email no puede superar ${MAX_EMAIL_LENGTH} caracteres.`;
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'El email no es válido.';
  }

  // Teléfono
  if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
    errors.phone = 'El teléfono es requerido.';
  } else if (phone.trim().length > MAX_PHONE_LENGTH) {
    errors.phone = `El teléfono no puede superar ${MAX_PHONE_LENGTH} caracteres.`;
  }

  // Motivo
  if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
    errors.reason = 'El motivo es requerido.';
  } else if (reason.trim().length > MAX_REASON_LENGTH) {
    errors.reason = `El motivo no puede superar ${MAX_REASON_LENGTH} caracteres.`;
  }

  // Mensaje
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    errors.message = 'El mensaje es requerido.';
  } else if (message.trim().length > MAX_MESSAGE_LENGTH) {
    errors.message = `El mensaje no puede superar ${MAX_MESSAGE_LENGTH} caracteres.`;
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: name!.trim(),
      email: email!.trim(),
      phone: phone!.trim(),
      reason: reason!.trim(),
      message: message!.trim(),
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Logo como attachment (CID)
// ─────────────────────────────────────────────────────────────

const LOGO_FILENAME = 'logo_ipproyectosindustriales.png';

/**
 * Busca el logo en múltiples ubicaciones para cubrir dev y producción.
 * Retorna el buffer de la imagen o null si no se encuentra.
 */
function getLogoAttachment(): { filename: string; content: Buffer; cid: string } | null {
  const candidates = [
    resolve(process.cwd(), 'public', LOGO_FILENAME),
    resolve(process.cwd(), 'dist', 'client', LOGO_FILENAME),
    resolve(process.cwd(), 'client', LOGO_FILENAME),
    resolve(process.cwd(), LOGO_FILENAME),
  ];

  for (const filePath of candidates) {
    try {
      const content = readFileSync(filePath);
      return { filename: LOGO_FILENAME, content, cid: 'company-logo' };
    } catch {
      // Intentar siguiente ubicación
    }
  }

  console.warn('⚠️ No se encontró el archivo del logo en ninguna ubicación esperada');
  return null;
}

// ─────────────────────────────────────────────────────────────
// Helper: parsear body (JSON o form-urlencoded)
// ─────────────────────────────────────────────────────────────

async function parseRequestBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return request.json();
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await request.text();
    const params = new URLSearchParams(text);
    return Object.fromEntries(params.entries());
  }

  // Fallback: intentar JSON
  return request.json();
}

// ─────────────────────────────────────────────────────────────
// Endpoint
// ─────────────────────────────────────────────────────────────

export const POST: APIRoute = async ({ request }) => {
  const jsonHeaders = { 'Content-Type': 'application/json' };

  try {
    // Parsear body
    let body: unknown;
    try {
      body = await parseRequestBody(request);
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'El cuerpo de la solicitud debe ser JSON válido o form-urlencoded.',
        } satisfies ContactResponse),
        { status: 400, headers: jsonHeaders }
      );
    }

    // Validar datos
    const validation = validateContactForm(body);
    if (!validation.valid || !validation.data) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Datos de formulario inválidos.',
          errors: validation.errors,
        } satisfies ContactResponse),
        { status: 400, headers: jsonHeaders }
      );
    }

    const formData = validation.data;

    // Verificar credenciales SMTP
    if (!import.meta.env.SMTP_USER || !import.meta.env.SMTP_PASS) {
      console.error('❌ SMTP_USER o SMTP_PASS no están configuradas');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Servicio de correo no configurado. Por favor contacta al administrador.',
        } satisfies ContactResponse),
        { status: 503, headers: jsonHeaders }
      );
    }

    // Generar templates HTML
    const adminEmailHtml = buildContactEmailTemplate(formData);
    const clientEmailHtml = buildContactClientEmailTemplate(formData);

    // Preparar attachment del logo
    const logoAttachment = getLogoAttachment();
    const attachments = logoAttachment ? [logoAttachment] : [];

    // ── Enviar correo interno al equipo ──
    try {
      const info = await transporter.sendMail({
        from: `"IP Proyectos Industriales" <${CONTACT_EMAIL_FROM}>`,
        to: CONTACT_EMAIL_TO,
        replyTo: formData.email,
        subject: `[Contacto] ${formData.name} — ${formData.reason}`,
        html: adminEmailHtml,
        attachments,
      });
      console.log(`✅ Correo interno de contacto enviado: ${info.messageId}`);
    } catch (err) {
      console.error('❌ Error al enviar correo interno de contacto:', err);
      // No fallar si el correo interno falla, continuar con el del cliente
    }

    // ── Enviar correo de confirmación al usuario ──
    try {
      const info = await transporter.sendMail({
        from: `"IP Proyectos Industriales" <${CONTACT_EMAIL_FROM}>`,
        to: formData.email,
        replyTo: CONTACT_EMAIL_TO,
        subject: 'Hemos recibido tu mensaje — IP Proyectos Industriales',
        html: clientEmailHtml,
        attachments,
      });
      console.log(`✅ Correo de confirmación enviado a ${formData.email}: ${info.messageId}`);
    } catch (err) {
      console.error('❌ Error al enviar correo de confirmación:', err);
      // El correo interno ya se envió, responder con éxito parcial
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Mensaje enviado correctamente. Te contactaremos pronto.',
      } satisfies ContactResponse),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err) {
    console.error('❌ Error inesperado en contact endpoint:', err);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error interno del servidor.',
      } satisfies ContactResponse),
      { status: 500, headers: jsonHeaders }
    );
  }
};
