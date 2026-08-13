// src/pages/api/quote-email.ts
// Endpoint API para enviar correos de cotización usando SMTP (Nodemailer).
// Recibe cart, company y globalNotes desde el cliente.
// Envía 2 correos: uno a la empresa (interno) y otro al cliente (resumen).

import type { APIRoute } from 'astro';
import type { QuoteCart } from '@/types/quote';
import type { QuoteCompanyData } from '@/types/quoteCompany';
import { transporter, EMAIL_CONFIG } from '@/lib/smtp';
import { buildCompanyEmailTemplate } from '@/lib/quoteEmailTemplate';
import { buildClientEmailTemplate } from '@/lib/quoteClientEmailTemplate';
import { validateCompanyData } from '@/types/quoteCompany';

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

interface QuoteEmailRequest {
  cart: QuoteCart;
  company: QuoteCompanyData;
  globalNotes?: string;
}

interface QuoteEmailResponse {
  success: boolean;
  message?: string;
  emailIds?: {
    company?: string;
    client?: string;
  };
  errors?: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────
// Validación
// ─────────────────────────────────────────────────────────────

/** Valida los datos de entrada del request. */
function validateRequest(body: unknown): { valid: boolean; errors?: Record<string, string>; data?: QuoteEmailRequest } {
  if (!body || typeof body !== 'object') {
    return { valid: false, errors: { body: 'El cuerpo de la solicitud es inválido.' } };
  }

  const { cart, company, globalNotes } = body as Partial<QuoteEmailRequest>;

  // Validar carrito
  if (!cart || typeof cart !== 'object') {
    return { valid: false, errors: { cart: 'El carrito es requerido.' } };
  }
  if (cart.version !== 1) {
    return { valid: false, errors: { cart: 'Versión del carrito inválida.' } };
  }
  if (!Array.isArray(cart.items) || cart.items.length === 0) {
    return { valid: false, errors: { cart: 'El carrito debe contener al menos un equipo.' } };
  }
  if (!cart.updatedAt || typeof cart.updatedAt !== 'string') {
    return { valid: false, errors: { cart: 'Timestamp del carrito inválido.' } };
  }

  // Validar datos de empresa
  if (!company || typeof company !== 'object') {
    return { valid: false, errors: { company: 'Los datos de la empresa son requeridos.' } };
  }

  const companyValidation = validateCompanyData(company);
  if (!companyValidation.valid) {
    return { valid: false, errors: { company: 'Datos de empresa inválidos.', details: companyValidation.errors } };
  }

  // Validar email del cliente
  if (!company.email || company.email.trim() === '') {
    return { valid: false, errors: { email: 'El email del cliente es requerido.' } };
  }

  // Validar notas globales (opcional)
  if (globalNotes !== undefined && typeof globalNotes !== 'string') {
    return { valid: false, errors: { globalNotes: 'Las notas globales deben ser un string.' } };
  }

  return {
    valid: true,
    data: {
      cart,
      company,
      globalNotes: globalNotes?.trim() || undefined,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Endpoint
// ─────────────────────────────────────────────────────────────

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parsear body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'El cuerpo de la solicitud debe ser JSON válido.',
        } as QuoteEmailResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validar datos
    const validation = validateRequest(body);
    if (!validation.valid || !validation.data) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Datos de solicitud inválidos.',
          errors: validation.errors,
        } as QuoteEmailResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { cart, company, globalNotes } = validation.data;

    // Verificar que las credenciales SMTP estén configuradas
    if (!import.meta.env.SMTP_USER || !import.meta.env.SMTP_PASS) {
      console.error('❌ SMTP_USER o SMTP_PASS no están configuradas');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Servicio de correo no configurado. Por favor contacta al administrador.',
        } as QuoteEmailResponse),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generar templates HTML
    const companyEmailHtml = buildCompanyEmailTemplate({ cart, company, globalNotes });
    const clientEmailHtml = buildClientEmailTemplate({ cart, company, globalNotes });

    // Asunto del correo
    const subject = `Nueva Cotización - ${company.razonSocial || company.nombreFantasia || 'Cliente'}`;

    // Enviar correo a la empresa
    let companyEmailId: string | undefined;
    try {
      const info = await transporter.sendMail({
        from: `"IP Proyectos Industriales" <${EMAIL_CONFIG.from}>`,
        to: EMAIL_CONFIG.toCompany,
        replyTo: company.email,
        subject: `[INTERNO] ${subject}`,
        html: companyEmailHtml,
      });

      companyEmailId = info.messageId;
      console.log(`✅ Correo a empresa enviado: ${companyEmailId}`);
    } catch (err) {
      console.error('❌ Error al enviar correo a empresa:', err);
      // No fallar si el correo a empresa falla, continuar con el del cliente
    }

    // Enviar correo al cliente
    let clientEmailId: string | undefined;
    try {
      const info = await transporter.sendMail({
        from: `"IP Proyectos Industriales" <${EMAIL_CONFIG.from}>`,
        to: company.email,
        replyTo: EMAIL_CONFIG.toCompany,
        subject: `Tu Cotización - IP Proyectos Industriales`,
        html: clientEmailHtml,
      });

      clientEmailId = info.messageId;
      console.log(`✅ Correo al cliente enviado: ${clientEmailId}`);
    } catch (err) {
      console.error('❌ Error al enviar correo al cliente:', err);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error al enviar el correo. Por favor intenta nuevamente.',
        } as QuoteEmailResponse),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Respuesta exitosa
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Correos enviados exitosamente.',
        emailIds: {
          company: companyEmailId,
          client: clientEmailId,
        },
      } as QuoteEmailResponse),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('❌ Error inesperado en quote-email endpoint:', err);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error interno del servidor.',
      } as QuoteEmailResponse),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
