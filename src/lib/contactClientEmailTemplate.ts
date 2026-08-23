// src/lib/contactClientEmailTemplate.ts
// Template HTML para correo de confirmación al usuario que envió el formulario de contacto.
// Diseño simple y alineado con la identidad de IP Proyectos Industriales.

import type { ContactFormData } from '@/lib/contactEmailTemplate';

// ─────────────────────────────────────────────────────────────
// Constantes de diseño
// ─────────────────────────────────────────────────────────────

const BRAND = {
  green: '#308f40',
  greenDark: '#226f31',
  greenDarker: '#1d5a26',
  greenLight: '#e7f3ea',
  greenAccent: '#62bb74',
  graphite: '#0d1611',
  ink: '#242627',
  inkMuted: '#6b7072',
  white: '#ffffff',
  border: '#e2e4e5',
};

/** CID del logo adjunto en el correo. */
const LOGO_CID = 'company-logo';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Escapa caracteres HTML para prevenir XSS. */
function escapeHtml(s: string | undefined | null): string {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─────────────────────────────────────────────────────────────
// Template
// ─────────────────────────────────────────────────────────────

/** Genera el HTML del correo de confirmación para el usuario. */
export function buildContactClientEmailTemplate(data: ContactFormData): string {
  const firstName = data.name.split(' ')[0] || 'cliente';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hemos recibido tu mensaje</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: ${BRAND.ink}; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: ${BRAND.white};">
    <!-- Header -->
    <div style="background-color: ${BRAND.graphite}; padding: 28px 20px; text-align: center; border-bottom: 4px solid ${BRAND.green};">
      <img src="cid:${LOGO_CID}" alt="IP Proyectos Industriales" width="160" style="max-width: 160px; height: auto; margin: 0 auto 14px auto;" />
      <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: ${BRAND.white};">Mensaje Recibido</h1>
    </div>

    <!-- Content -->
    <div style="padding: 28px 24px;">
      <!-- Saludo -->
      <p style="margin: 0 0 16px 0; font-size: 16px; color: ${BRAND.ink};">
        Hola <strong style="color: ${BRAND.greenDark};">${escapeHtml(firstName)}</strong>,
      </p>
      <p style="margin: 0 0 24px 0; font-size: 14px; color: ${BRAND.inkMuted}; line-height: 1.7;">
        Gracias por contactarnos. Hemos recibido tu mensaje correctamente y un miembro de nuestro equipo se pondrá en contacto contigo a la brevedad.
      </p>

      <!-- Resumen del mensaje -->
      <div style="margin-bottom: 24px; padding: 20px; background-color: ${BRAND.greenLight}; border-radius: 8px; border-left: 4px solid ${BRAND.green};">
        <h2 style="margin: 0 0 14px 0; font-size: 14px; font-weight: 700; color: ${BRAND.greenDarker}; text-transform: uppercase; letter-spacing: 0.05em;">Resumen de tu mensaje</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; font-size: 13px; color: ${BRAND.inkMuted}; font-weight: 500; width: 30%;">Motivo:</td>
            <td style="padding: 5px 0; font-size: 13px; font-weight: 600; color: ${BRAND.ink};">${escapeHtml(data.reason)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-size: 13px; color: ${BRAND.inkMuted}; font-weight: 500; vertical-align: top;">Mensaje:</td>
            <td style="padding: 5px 0; font-size: 13px; color: ${BRAND.ink}; line-height: 1.6;">${escapeHtml(data.message)}</td>
          </tr>
        </table>
      </div>

      <!-- Próximos pasos -->
      <div style="padding: 20px; background-color: #f9fafb; border-radius: 8px; border: 1px solid ${BRAND.border};">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: ${BRAND.ink};">Próximos pasos</h3>
        <p style="margin: 0; font-size: 13px; color: ${BRAND.inkMuted}; line-height: 1.7;">
          Revisaremos tu consulta y te contactaremos al correo <strong style="color: ${BRAND.ink};">${escapeHtml(data.email)}</strong> o al teléfono <strong style="color: ${BRAND.ink};">${escapeHtml(data.phone)}</strong> dentro de las próximas <strong>24 horas hábiles</strong>.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: ${BRAND.graphite}; padding: 20px; text-align: center; border-top: 4px solid ${BRAND.green};">
      <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: ${BRAND.white};">IP Proyectos Industriales</p>
      <p style="margin: 0; font-size: 11px; color: ${BRAND.greenAccent};">
        Este es un correo automático, por favor no respondas a esta dirección.<br>
        Si necesitas ayuda, escríbenos a <a href="mailto:contacto@ipproyectosindustriales.cl" style="color: ${BRAND.greenAccent};">contacto@ipproyectosindustriales.cl</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
