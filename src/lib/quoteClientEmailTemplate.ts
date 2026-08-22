// src/lib/quoteClientEmailTemplate.ts
// Template HTML para correo al cliente.
// Resumen de la cotización para que pueda validar que está correcta.
// Diseño alineado con la identidad visual de IP Proyectos Industriales.

import type { QuoteCart, QuoteCartItem } from '@/types/quote';
import type { QuoteCompanyData } from '@/types/quoteCompany';
import { computeCartTotals, formatPeriodLabel, formatDateShort, resolveSubcategoryName } from '@/lib/quoteMessage';
import { RENTAL_CATEGORIES } from '@/data/rental';

// ─────────────────────────────────────────────────────────────
// Constantes de diseño
// ─────────────────────────────────────────────────────────────

const BRAND = {
  // Colores de marca
  green: '#308f40',
  greenDark: '#226f31',
  greenDarker: '#1d5a26',
  greenLight: '#e7f3ea',
  greenAccent: '#62bb74',
  graphite: '#0d1611',
  graphite2: '#15201a',
  graphite3: '#1e2a23',
  ink: '#242627',
  inkMuted: '#6b7072',
  white: '#ffffff',
  border: '#e2e4e5',
};

/** CID (Content-ID) del logo adjunto en el correo. */
const LOGO_CID = 'company-logo';

interface ClientEmailTemplateData {
  cart: QuoteCart;
  company: QuoteCompanyData;
  globalNotes?: string;
}

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
// Detección de equipos tipo grúa
// ─────────────────────────────────────────────────────────────

/** Set de slugs de equipos tipo grúa (igual lógica que el frontend). */
const CRANE_EQUIPMENT_SLUGS = new Set<string>();
for (const cat of RENTAL_CATEGORIES) {
  for (const sub of cat.subcategories) {
    const isCraneSubcategory = sub.slug.startsWith('gruas-') && sub.slug !== 'gruas-horquilla';
    if (isCraneSubcategory) {
      for (const eq of sub.catalog) {
        CRANE_EQUIPMENT_SLUGS.add(eq.slug);
      }
    }
  }
}

/** Verifica si un item del carrito es un equipo tipo grúa. */
function isCraneItem(item: QuoteCartItem): boolean {
  return CRANE_EQUIPMENT_SLUGS.has(item.equipmentSlug);
}

/** Genera el HTML de la sección de personal del servicio para grúas. */
function buildCrewSection(item: QuoteCartItem): string {
  if (!isCraneItem(item)) return '';

  const c = item.customization;
  const crewItems: string[] = [];

  if (c.crewOperator) crewItems.push('Operador');
  if (c.crewRigger) crewItems.push('Rigger');
  if (c.crewAPR) crewItems.push('APR (prevencionista)');
  if (c.crewSupervisor) crewItems.push('Supervisor');

  if (crewItems.length === 0) return '';

  const crewBadges = crewItems
    .map(
      (label) =>
        `<span style="display: inline-block; padding: 3px 8px; margin: 2px 4px 2px 0; background-color: ${BRAND.greenLight}; color: ${BRAND.greenDarker}; font-size: 11px; font-weight: 600; border-radius: 4px; border: 1px solid ${BRAND.greenAccent};">${escapeHtml(label)}</span>`
    )
    .join('');

  return `
    <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed ${BRAND.border};">
      <span style="font-size: 11px; color: ${BRAND.inkMuted}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">Personal del servicio:</span>
      <div style="margin-top: 4px;">${crewBadges}</div>
    </div>
  `;
}

/** Genera el HTML del correo para el cliente. */
export function buildClientEmailTemplate(data: ClientEmailTemplateData): string {
  const { cart, company, globalNotes } = data;
  const totals = computeCartTotals(cart);
  const now = new Date().toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  // Generar filas de equipos (versión simplificada para el cliente)
  const equipmentRows = cart.items
    .map((item) => {
      const c = item.customization;
      const crewSection = buildCrewSection(item);
      return `
        <tr>
          <td style="padding: 14px 10px; border-bottom: 1px solid ${BRAND.border}; font-size: 14px; color: ${BRAND.ink};">
            <strong style="color: ${BRAND.ink};">${escapeHtml(item.name)}</strong>
            ${item.capacity ? `<br><span style="color: ${BRAND.inkMuted}; font-size: 12px;">${escapeHtml(item.capacity)}</span>` : ''}
            ${item.subcategorySlug ? `<br><span style="color: ${BRAND.inkMuted}; font-size: 11px; font-style: italic;">${escapeHtml(resolveSubcategoryName(item.categorySlug, item.subcategorySlug))}</span>` : ''}
            ${crewSection}
          </td>
          <td style="padding: 14px 10px; border-bottom: 1px solid ${BRAND.border}; text-align: center; font-size: 14px; font-weight: 700; color: ${BRAND.greenDark};">${c.quantity}</td>
          <td style="padding: 14px 10px; border-bottom: 1px solid ${BRAND.border}; text-align: center; font-size: 14px; color: ${BRAND.ink};">${formatPeriodLabel(c.periodType, c.periodCount)}</td>
          <td style="padding: 14px 10px; border-bottom: 1px solid ${BRAND.border}; text-align: center; font-size: 14px; color: ${BRAND.ink};">${formatDateShort(c.startDate)}</td>
        </tr>
      `;
    })
    .join('');

  // Notas del cliente
  const notesSection = globalNotes
    ? `
      <div style="margin: 24px 0; padding: 20px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.05em;">📝 Tus Notas</h3>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: ${BRAND.ink};">${escapeHtml(globalNotes)}</p>
      </div>
    `
    : '';

  // Dirección de entrega (versión cliente)
  const deliverySection = company.requiresSiteDelivery && company.deliveryAddress?.confirmed
    ? `
      <div style="margin: 24px 0; padding: 20px; background-color: ${BRAND.greenLight}; border-radius: 8px; border-left: 4px solid ${BRAND.green};">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: ${BRAND.greenDarker}; text-transform: uppercase; letter-spacing: 0.05em;">📍 Dirección de Entrega</h3>
        <p style="margin: 6px 0; font-size: 14px; color: ${BRAND.ink};"><strong style="color: ${BRAND.inkMuted};">Dirección:</strong> ${escapeHtml(company.deliveryAddress.formattedAddress)}</p>
        ${company.deliveryAddress.commune || company.deliveryAddress.region
          ? `<p style="margin: 6px 0; font-size: 14px; color: ${BRAND.ink};"><strong style="color: ${BRAND.inkMuted};">Ubicación:</strong> ${escapeHtml([company.deliveryAddress.commune, company.deliveryAddress.region].filter(Boolean).join(', '))}</p>`
          : ''}
        ${company.deliveryAddress.source === 'manual'
          ? `<p style="margin: 6px 0; font-size: 12px; color: ${BRAND.greenDarker}; font-style: italic;">Un ejecutivo confirmará la ubicación exacta.</p>`
          : ''}
      </div>
    `
    : `
      <div style="margin: 24px 0; padding: 20px; background-color: ${BRAND.greenLight}; border-radius: 8px; border-left: 4px solid ${BRAND.green};">
        <p style="margin: 0; font-size: 14px; color: ${BRAND.greenDarker}; font-weight: 500;"><strong> Entrega:</strong> Retiro en bodega</p>
      </div>
    `;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resumen de tu Cotización</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: ${BRAND.ink}; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: ${BRAND.white};">
    <!-- Header con logo -->
    <div style="background-color: ${BRAND.graphite}; padding: 30px 20px; text-align: center; border-bottom: 4px solid ${BRAND.green};">
      <img src="cid:${LOGO_CID}" alt="IP Proyectos Industriales" width="180" style="max-width: 180px; height: auto; margin: 0 auto 16px auto;" />
      <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: ${BRAND.white}; letter-spacing: 0.02em;">Resumen de tu Cotización</h1>
      <p style="margin: 10px 0 0 0; font-size: 13px; color: ${BRAND.greenAccent};">${now}</p>
    </div>

    <!-- Content -->
    <div style="padding: 30px 24px;">
      <!-- Saludo -->
      <div style="margin-bottom: 28px;">
        <p style="margin: 0 0 12px 0; font-size: 16px; color: ${BRAND.ink};">
          Hola <strong style="color: ${BRAND.greenDark};">${escapeHtml(company.nombreContacto || 'cliente')}</strong>,
        </p>
        <p style="margin: 0; font-size: 14px; color: ${BRAND.inkMuted}; line-height: 1.6;">
          Gracias por tu interés en nuestros servicios. A continuación encontrarás el resumen de tu cotización.
        </p>
      </div>

      <!-- Totales destacados -->
      <div style="background-color: ${BRAND.greenLight}; padding: 24px; border-radius: 8px; margin-bottom: 24px; border: 1px solid ${BRAND.greenAccent};">
        <h2 style="margin: 0 0 18px 0; font-size: 18px; font-weight: 700; color: ${BRAND.greenDarker}; text-transform: uppercase; letter-spacing: 0.05em;">📊 Resumen de tu Cotización</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">Equipos distintos:</td>
            <td style="padding: 10px 0; font-size: 18px; font-weight: 700; text-align: right; color: ${BRAND.greenDark};">${totals.uniqueItems}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">Unidades totales:</td>
            <td style="padding: 10px 0; font-size: 18px; font-weight: 700; text-align: right; color: ${BRAND.greenDark};">${totals.totalUnits}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">Días totales:</td>
            <td style="padding: 10px 0; font-size: 18px; font-weight: 700; text-align: right; color: ${BRAND.greenDark};">${Math.ceil(totals.totalDays)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">Fecha de inicio:</td>
            <td style="padding: 10px 0; font-size: 14px; font-weight: 600; text-align: right; color: ${BRAND.ink};">${formatDateShort(totals.earliestStart)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">Fecha de término:</td>
            <td style="padding: 10px 0; font-size: 14px; font-weight: 600; text-align: right; color: ${BRAND.ink};">${formatDateShort(totals.latestEnd)}</td>
          </tr>
        </table>
      </div>

      <!-- Equipos -->
      <div style="margin: 24px 0;">
        <h2 style="margin: 0 0 18px 0; font-size: 18px; font-weight: 700; color: ${BRAND.ink}; text-transform: uppercase; letter-spacing: 0.05em;">🔧 Equipos Solicitados</h2>
        <table style="width: 100%; border-collapse: collapse; background-color: ${BRAND.white}; border: 1px solid ${BRAND.border}; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: ${BRAND.graphite}; color: ${BRAND.white};">
              <th style="padding: 14px 10px; text-align: left; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Equipo</th>
              <th style="padding: 14px 10px; text-align: center; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Cant.</th>
              <th style="padding: 14px 10px; text-align: center; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Período</th>
              <th style="padding: 14px 10px; text-align: center; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Inicio</th>
            </tr>
          </thead>
          <tbody>
            ${equipmentRows}
          </tbody>
        </table>
      </div>

      <!-- Dirección de entrega -->
      ${deliverySection}

      <!-- Notas -->
      ${notesSection}

      <!-- Mensaje de seguimiento -->
      <div style="margin: 28px 0; padding: 24px; background-color: ${BRAND.greenLight}; border-radius: 8px; border-left: 4px solid ${BRAND.green};">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: ${BRAND.greenDarker}; text-transform: uppercase; letter-spacing: 0.05em;">✅ Próximos Pasos</h3>
        <p style="margin: 0 0 10px 0; font-size: 14px; color: ${BRAND.ink}; line-height: 1.6;">
          Un ejecutivo revisará tu cotización y te contactará dentro de las próximas <strong>24 horas hábiles</strong>.
        </p>
        <p style="margin: 0; font-size: 14px; color: ${BRAND.inkMuted}; line-height: 1.6;">
          Si tienes alguna consulta o necesitas modificar tu cotización, no dudes en responder este correo o contactarnos por WhatsApp.
        </p>
      </div>

      <!-- Datos de contacto -->
      <div style="margin: 24px 0; padding: 24px; background-color: ${BRAND.graphite}; border-radius: 8px; text-align: center;">
        <h3 style="margin: 0 0 14px 0; font-size: 16px; font-weight: 700; color: ${BRAND.white}; text-transform: uppercase; letter-spacing: 0.05em;">¿Necesitas ayuda?</h3>
        <p style="margin: 0 0 6px 0; font-size: 14px; color: ${BRAND.greenAccent};">
          <strong style="color: ${BRAND.white};">Email:</strong> cotizaciones@ipproyectosindustriales.cl
        </p>
        <p style="margin: 0; font-size: 14px; color: ${BRAND.greenAccent};">
          <strong style="color: ${BRAND.white};">WhatsApp:</strong> +56 9 6559 3202
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: ${BRAND.graphite}; padding: 24px; text-align: center; border-top: 4px solid ${BRAND.green};">
      <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: ${BRAND.white};">
        IP Proyectos Industriales
      </p>
      <p style="margin: 0; font-size: 12px; color: ${BRAND.greenAccent};">
        Este correo fue generado automáticamente desde nuestro cotizador en línea.<br>
        Si tienes alguna duda, por favor contáctanos.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
