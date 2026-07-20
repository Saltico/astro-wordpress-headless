// src/lib/quoteMessage.ts
// Generadores puros: URL de WhatsApp, totales y sanitización.
// No tiene side effects: importable desde el server y desde el cliente.

import type { PeriodType, QuoteCart } from '@/types/quote';
import { customizationToDays } from '@/types/quote';

// ─────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────

export const WHATSAPP_PHONE = '56965593202';
export const WHATSAPP_BASE_URL = 'https://wa.me/';

// ─────────────────────────────────────────────────────────────
// Sanitización
// ─────────────────────────────────────────────────────────────

/** Trim, normaliza saltos de línea, remueve controles, trunca con elipsis. */
export function sanitizePlainText(
  s: string | undefined | null,
  maxLength = 500
): string {
  if (s == null) return '';
  let out = String(s);
  // Normaliza saltos de línea.
  out = out.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // Remueve caracteres de control (excepto \n y \t).
  out = out.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  // Colapsa 3+ saltos a 2.
  out = out.replace(/\n{3,}/g, '\n\n');
  out = out.trim();
  if (out.length > maxLength) {
    out = `${out.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
  }
  return out;
}

/** Colapsa espacios múltiples, normaliza saltos, trim. */
export function normalizeMultiline(s: string): string {
  if (!s) return '';
  return s
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Convierte (periodType, periodCount) a días calendario aprox. */
export function periodToDays(periodType: PeriodType, periodCount: number): number {
  const unit = periodType === 'diario' ? 1 : periodType === 'semanal' ? 7 : 30;
  return Math.max(0, unit * periodCount);
}

/** Etiqueta humana del periodo. */
export function formatPeriodLabel(periodType: PeriodType, periodCount: number): string {
  const unit =
    periodType === 'diario' ? (periodCount === 1 ? 'día' : 'días') :
    periodType === 'semanal' ? (periodCount === 1 ? 'semana' : 'semanas') :
    (periodCount === 1 ? 'mes' : 'meses');
  return `${periodCount} ${unit}`;
}

// ─────────────────────────────────────────────────────────────
// Builders del mensaje
// ─────────────────────────────────────────────────────────────

interface ItemLine {
  quantity: string;
  name: string;
  capacity: string;
  periodLabel: string;
  startDate: string;
  notes: string;
  transport: string;
}

function renderItemLine(item: ItemLine): string {
  const cap = item.capacity ? ` (${item.capacity})` : '';
  return (
    `• ${item.quantity} × ${item.name}${cap}\n` +
    `  Período: ${item.periodLabel}\n` +
    `  Inicio: ${item.startDate}\n` +
    `  Notas: ${item.notes || '—'}\n` +
    `  Traslado: ${item.transport}`
  );
}

function renderItemLineForBuild(item: import('@/types/quote').QuoteCartItem): ItemLine {
  const c = item.customization;
  return {
    quantity: String(c.quantity),
    name: sanitizePlainText(item.name, 120),
    capacity: sanitizePlainText(item.capacity, 40),
    periodLabel: formatPeriodLabel(c.periodType, c.periodCount),
    startDate: c.startDate,
    notes: sanitizePlainText(c.notes, 280),
    transport:
      c.transport === 'si'
        ? c.transportAddress
          ? `Sí — ${sanitizePlainText(c.transportAddress, 160)}`
          : 'Sí'
        : 'No',
  };
}

// ─────────────────────────────────────────────────────────────
// Totales
// ─────────────────────────────────────────────────────────────

export interface CartTotals {
  uniqueItems: number;
  totalUnits: number;
  totalDays: number;
  earliestStart: string | null;
  latestEnd: string | null;
}

/** Calcula totales agregados del carrito. */
export function computeCartTotals(cart: QuoteCart): CartTotals {
  if (cart.items.length === 0) {
    return {
      uniqueItems: 0,
      totalUnits: 0,
      totalDays: 0,
      earliestStart: null,
      latestEnd: null,
    };
  }
  const uniqueItems = cart.items.length;
  const totalUnits = cart.items.reduce((sum, i) => sum + i.customization.quantity, 0);
  // Para el totalDays de la unidad ya se incluye el efecto de quantity.
  const totalDays = cart.items.reduce(
    (sum, i) => sum + customizationToDays(i.customization) * i.customization.quantity,
    0
  );
  const starts = cart.items.map((i) => i.customization.startDate).sort();
  const earliestStart = starts[0] ?? null;
  // latestEnd = startDate + days (de ese item, sin multiplicar por quantity).
  const itemEnds = cart.items.map((i) => addDaysToDate(i.customization.startDate, customizationToDays(i.customization)));
  itemEnds.sort();
  const latestEnd = itemEnds[itemEnds.length - 1] ?? null;
  return { uniqueItems, totalUnits, totalDays, earliestStart, latestEnd };
}

function addDaysToDate(yyyyMmDd: string, days: number): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return yyyyMmDd;
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  if (!y || !m || !d) return yyyyMmDd;
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ─────────────────────────────────────────────────────────────
// Mensaje WhatsApp
// ─────────────────────────────────────────────────────────────

export interface BuildWhatsAppOptions {
  includeContactData?: boolean;
  contactName?: string;
  contactCompany?: string;
  globalNotes?: string;
}

/** Construye el mensaje consolidado para WhatsApp. */
export function buildWhatsAppMessage(
  cart: QuoteCart,
  options: BuildWhatsAppOptions = {}
): string {
  const { includeContactData = false, contactName, contactCompany, globalNotes } = options;
  const header = 'Hola IP Proyectos Industriales, quisiera cotizar el siguiente arriendo:';
  const itemLines = cart.items
    .map((item) => renderItemLine(renderItemLineForBuild(item)))
    .join('\n\n');
  const totals = computeCartTotals(cart);

  const lines: string[] = [header, '', itemLines];
  lines.push('', `Total: ${totals.uniqueItems} equipos, ${totals.totalUnits} unidades.`);
  if (totals.totalDays > 0) {
    lines.push(`Duración agregada aprox.: ${totals.totalDays} días.`);
  }
  if (totals.earliestStart) {
    lines.push(`Mayor inicio: ${totals.earliestStart}.`);
  }
  if (includeContactData) {
    lines.push('', 'Mis datos:');
    if (contactName) lines.push(`• Nombre: ${sanitizePlainText(contactName, 80)}`);
    if (contactCompany) lines.push(`• Empresa: ${sanitizePlainText(contactCompany, 80)}`);
  }
  const gNotes = sanitizePlainText(globalNotes, 500);
  if (gNotes) {
    lines.push('', 'Notas globales:', gNotes);
  }
  return lines.join('\n');
}

/** Construye la URL wa.me con el mensaje codificado. */
export function buildWhatsAppUrl(
  cart: QuoteCart,
  options: BuildWhatsAppOptions = {}
): string {
  const message = buildWhatsAppMessage(cart, options);
  return `${WHATSAPP_BASE_URL}${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
