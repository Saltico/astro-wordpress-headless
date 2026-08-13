// src/lib/quoteEmailTemplate.ts
// Template HTML para correo interno (empresa).
// Incluye todos los datos: equipos, empresa, totales, notas.
// Diseño alineado con la identidad visual de IP Proyectos Industriales.

import type { QuoteCart, QuoteCartItem } from '@/types/quote';
import type { QuoteCompanyData } from '@/types/quoteCompany';
import { computeCartTotals, formatPeriodLabel } from '@/lib/quoteMessage';
import { formatRut } from '@/types/quoteCompany';
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

const LOGO_URL = 'https://ipproyectosindustriales.cl/logo_ipproyectosindustriales.png';

interface EmailTemplateData {
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

/** Genera el HTML del correo para la empresa. */
export function buildCompanyEmailTemplate(data: EmailTemplateData): string {
  const { cart, company, globalNotes } = data;
  const totals = computeCartTotals(cart);
  const now = new Date().toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  // Generar filas de equipos
  const equipmentRows = cart.items
    .map((item) => {
      const c = item.customization;
      const crewSection = buildCrewSection(item);
      return `
        <tr>
          <td style="padding: 14px 10px; border-bottom: 1px solid ${BRAND.border}; font-size: 14px; color: ${BRAND.ink};">
            <strong style="color: ${BRAND.ink};">${escapeHtml(item.name)}</strong>
            ${item.capacity ? `<br><span style="color: ${BRAND.inkMuted}; font-size: 12px;">${escapeHtml(item.capacity)}</span>` : ''}
            ${crewSection}
          </td>
          <td style="padding: 14px 10px; border-bottom: 1px solid ${BRAND.border}; text-align: center; font-size: 14px; font-weight: 600; color: ${BRAND.greenDark};">${c.quantity}</td>
          <td style="padding: 14px 10px; border-bottom: 1px solid ${BRAND.border}; text-align: center; font-size: 14px; color: ${BRAND.ink};">${formatPeriodLabel(c.periodType, c.periodCount)}</td>
          <td style="padding: 14px 10px; border-bottom: 1px solid ${BRAND.border}; text-align: center; font-size: 14px; color: ${BRAND.ink};">${c.startDate}</td>
          <td style="padding: 14px 10px; border-bottom: 1px solid ${BRAND.border}; font-size: 12px; color: ${BRAND.inkMuted};">${escapeHtml(c.notes) || '—'}</td>
        </tr>
      `;
    })
    .join('');

  // Generar sección de datos de empresa
  const companySection = `
    <div style="margin: 24px 0; padding: 20px; background-color: ${BRAND.greenLight}; border-radius: 8px; border-left: 4px solid ${BRAND.green};">
      <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: ${BRAND.greenDarker}; text-transform: uppercase; letter-spacing: 0.05em;">Datos de la Empresa</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.inkMuted}; width: 40%; font-weight: 500;">Razón Social:</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: ${BRAND.ink};">${escapeHtml(company.razonSocial)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">RUT:</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: ${BRAND.ink};">${escapeHtml(formatRut(company.rut))}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">Nombre Fantasía:</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: ${BRAND.ink};">${escapeHtml(company.nombreFantasia)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">Giro:</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: ${BRAND.ink};">${escapeHtml(company.giro)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">Dirección:</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: ${BRAND.ink};">${escapeHtml(company.direccion)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">Ciudad / Comuna:</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: ${BRAND.ink};">${escapeHtml([company.ciudad, company.comuna].filter(Boolean).join(', '))}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">Contacto:</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: ${BRAND.ink};">${escapeHtml(company.nombreContacto)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">Email:</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: ${BRAND.ink};">${escapeHtml(company.email)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">Teléfono:</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: ${BRAND.ink};">${escapeHtml(company.telefono)}</td>
        </tr>
      </table>
    </div>
  `;

  // Dirección de entrega
  const deliverySection = company.requiresSiteDelivery && company.deliveryAddress?.confirmed
    ? `
      <div style="margin: 24px 0; padding: 20px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.05em;">📍 Dirección de Entrega</h3>
        <p style="margin: 6px 0; font-size: 14px; color: ${BRAND.ink};"><strong style="color: ${BRAND.inkMuted};">Dirección:</strong> ${escapeHtml(company.deliveryAddress.formattedAddress)}</p>
        ${company.deliveryAddress.commune || company.deliveryAddress.region
          ? `<p style="margin: 6px 0; font-size: 14px; color: ${BRAND.ink};"><strong style="color: ${BRAND.inkMuted};">Ubicación:</strong> ${escapeHtml([company.deliveryAddress.commune, company.deliveryAddress.region].filter(Boolean).join(', '))}</p>`
          : ''}
        ${company.deliveryAddress.source === 'manual'
          ? `<p style="margin: 6px 0; font-size: 12px; color: #92400e; font-style: italic;">(Dirección referencial — confirmar con cliente)</p>`
          : ''}
      </div>
    `
    : `
      <div style="margin: 24px 0; padding: 20px; background-color: ${BRAND.greenLight}; border-radius: 8px; border-left: 4px solid ${BRAND.green};">
        <p style="margin: 0; font-size: 14px; color: ${BRAND.greenDarker}; font-weight: 500;"><strong> Entrega:</strong> Retiro en bodega</p>
      </div>
    `;

  // Notas globales
  const notesSection = globalNotes
    ? `
      <div style="margin: 24px 0; padding: 20px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.05em;">📝 Notas Globales</h3>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: ${BRAND.ink};">${escapeHtml(globalNotes)}</p>
      </div>
    `
    : '';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Cotización</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: ${BRAND.ink}; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: ${BRAND.white};">
    <!-- Header con logo -->
    <div style="background-color: ${BRAND.graphite}; padding: 30px 20px; text-align: center; border-bottom: 4px solid ${BRAND.green};">
      <img src="${LOGO_URL}" alt="IP Proyectos Industriales" style="max-width: 180px; height: auto; margin-bottom: 16px;" />
      <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: ${BRAND.white}; letter-spacing: 0.02em;">Nueva Solicitud de Cotización</h1>
      <p style="margin: 10px 0 0 0; font-size: 13px; color: ${BRAND.greenAccent};">${now}</p>
    </div>

    <!-- Content -->
    <div style="padding: 30px 24px;">
      <!-- Totales destacados -->
      <div style="background-color: ${BRAND.greenLight}; padding: 24px; border-radius: 8px; margin-bottom: 24px; border: 1px solid ${BRAND.greenAccent};">
        <h2 style="margin: 0 0 18px 0; font-size: 18px; font-weight: 700; color: ${BRAND.greenDarker}; text-transform: uppercase; letter-spacing: 0.05em;">📊 Resumen</h2>
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
            <td style="padding: 10px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">Días agregados:</td>
            <td style="padding: 10px 0; font-size: 18px; font-weight: 700; text-align: right; color: ${BRAND.greenDark};">${totals.totalDays}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">Inicio más temprano:</td>
            <td style="padding: 10px 0; font-size: 14px; font-weight: 600; text-align: right; color: ${BRAND.ink};">${totals.earliestStart || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-size: 14px; color: ${BRAND.inkMuted}; font-weight: 500;">Final más tarde:</td>
            <td style="padding: 10px 0; font-size: 14px; font-weight: 600; text-align: right; color: ${BRAND.ink};">${totals.latestEnd || '—'}</td>
          </tr>
        </table>
      </div>

      <!-- Equipos -->
      <div style="margin: 24px 0;">
        <h2 style="margin: 0 0 18px 0; font-size: 18px; font-weight: 700; color: ${BRAND.ink}; text-transform: uppercase; letter-spacing: 0.05em;">🔧 Equipos Seleccionados</h2>
        <table style="width: 100%; border-collapse: collapse; background-color: ${BRAND.white}; border: 1px solid ${BRAND.border}; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: ${BRAND.graphite}; color: ${BRAND.white};">
              <th style="padding: 14px 10px; text-align: left; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Equipo</th>
              <th style="padding: 14px 10px; text-align: center; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Cant.</th>
              <th style="padding: 14px 10px; text-align: center; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Período</th>
              <th style="padding: 14px 10px; text-align: center; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Inicio</th>
              <th style="padding: 14px 10px; text-align: left; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Notas</th>
            </tr>
          </thead>
          <tbody>
            ${equipmentRows}
          </tbody>
        </table>
      </div>

      <!-- Datos de empresa -->
      ${companySection}

      <!-- Dirección de entrega -->
      ${deliverySection}

      <!-- Notas -->
      ${notesSection}
    </div>

    <!-- Footer -->
    <div style="background-color: ${BRAND.graphite}; padding: 24px; text-align: center; border-top: 4px solid ${BRAND.green};">
      <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: ${BRAND.white};">
        IP Proyectos Industriales
      </p>
      <p style="margin: 0; font-size: 12px; color: ${BRAND.greenAccent};">
        Este correo fue generado automáticamente desde el cotizador en línea.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
