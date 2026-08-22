// src/lib/contactEmailTemplate.ts
// Template HTML para correo interno de contacto (notificación al equipo).
// Recibe los datos del formulario de contacto de /seguridad.
// Diseño simple y alineado con la identidad de IP Proyectos Industriales.

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
}

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

/** Genera el HTML del correo interno de contacto. */
export function buildContactEmailTemplate(data: ContactFormData): string {
  const now = new Date().toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Mensaje de Contacto</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: ${BRAND.ink}; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: ${BRAND.white};">
    <!-- Header -->
    <div style="background-color: ${BRAND.graphite}; padding: 28px 20px; text-align: center; border-bottom: 4px solid ${BRAND.green};">
      <img src="cid:${LOGO_CID}" alt="IP Proyectos Industriales" width="160" style="max-width: 160px; height: auto; margin: 0 auto 14px auto;" />
      <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: ${BRAND.white};">Nuevo Mensaje de Contacto</h1>
      <p style="margin: 8px 0 0 0; font-size: 12px; color: ${BRAND.greenAccent};">${now}</p>
    </div>

    <!-- Content -->
    <div style="padding: 28px 24px;">
      <!-- Datos del contacto -->
      <div style="margin-bottom: 24px; padding: 20px; background-color: ${BRAND.greenLight}; border-radius: 8px; border-left: 4px solid ${BRAND.green};">
        <h2 style="margin: 0 0 16px 0; font-size: 15px; font-weight: 700; color: ${BRAND.greenDarker}; text-transform: uppercase; letter-spacing: 0.05em;">Datos del Contacto</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: ${BRAND.inkMuted}; font-weight: 500; width: 35%;">Nombre:</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: ${BRAND.ink};">${escapeHtml(data.name)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: ${BRAND.inkMuted}; font-weight: 500;">Email:</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: ${BRAND.ink};">${escapeHtml(data.email)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: ${BRAND.inkMuted}; font-weight: 500;">Teléfono:</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: ${BRAND.ink};">${escapeHtml(data.phone)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 13px; color: ${BRAND.inkMuted}; font-weight: 500;">Motivo:</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: ${BRAND.ink};">${escapeHtml(data.reason)}</td>
          </tr>
        </table>
      </div>

      <!-- Mensaje -->
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: ${BRAND.ink}; text-transform: uppercase; letter-spacing: 0.05em;">Mensaje</h2>
        <div style="padding: 16px; background-color: #f9fafb; border: 1px solid ${BRAND.border}; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; line-height: 1.7; white-space: pre-wrap; color: ${BRAND.ink};">${escapeHtml(data.message)}</p>
        </div>
      </div>

      <!-- Responder directamente -->
      <div style="text-align: center; padding: 16px; background-color: ${BRAND.graphite}; border-radius: 8px;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: ${BRAND.greenAccent};">Puedes responder directamente a:</p>
        <a href="mailto:${escapeHtml(data.email)}" style="font-size: 15px; font-weight: 700; color: ${BRAND.white}; text-decoration: none;">${escapeHtml(data.email)}</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: ${BRAND.graphite}; padding: 20px; text-align: center; border-top: 4px solid ${BRAND.green};">
      <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: ${BRAND.white};">IP Proyectos Industriales</p>
      <p style="margin: 0; font-size: 11px; color: ${BRAND.greenAccent};">Correo generado automáticamente desde el formulario de contacto en /seguridad.</p>
    </div>
  </div>
</body>
</html>
  `;
}
