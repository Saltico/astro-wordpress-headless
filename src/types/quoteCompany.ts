// src/types/quoteCompany.ts
// Tipos y validadores para los datos de empresa del cotizador.

// ─────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────

export const QUOTE_COMPANY_STORAGE_KEY = 'ip_quote_company_v1';

/** Regex básica de email: requiere al menos un @ y un dominio con punto. */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Longitudes aceptadas para el teléfono una vez normalizado a dígitos. */
export const PHONE_MIN_LENGTH = 8;
export const PHONE_MAX_LENGTH = 15;

// ─────────────────────────────────────────────────────────────
// Dirección de entrega
// ─────────────────────────────────────────────────────────────

/** Origen de la dirección de entrega. */
export type DeliveryAddressSource = 'google' | 'manual';

/** Datos geocodificados de la dirección de entrega (faena). */
export interface DeliveryAddress {
  /** Dirección formateada (ej: "Av. Apoquindo 1234, Las Condes"). */
  formattedAddress: string;
  /** ID de Google Places (solo cuando source = 'google'). */
  placeId?: string;
  /** Latitud (solo cuando source = 'google'). */
  latitude?: number;
  /** Longitud (solo cuando source = 'google'). */
  longitude?: number;
  /** Comuna extraída del address_components. */
  commune?: string;
  /** Región extraída del address_components. */
  region?: string;
  /** Origen de la dirección. */
  source: DeliveryAddressSource;
  /** True si el usuario confirmó explícitamente la selección. */
  confirmed: boolean;
}

// ─────────────────────────────────────────────────────────────
// Datos de empresa
// ─────────────────────────────────────────────────────────────

export interface QuoteCompanyData {
  rut: string;
  giro: string;
  razonSocial: string;
  nombreFantasia: string;
  direccion: string;
  ciudad: string;
  comuna: string;
  nombreContacto: string;
  email: string;
  telefono: string;
  /** Si requiere envío a faena. */
  requiresSiteDelivery: boolean;
  /** Dirección de entrega a la faena (solo si requiresSiteDelivery = true). */
  deliveryAddress?: DeliveryAddress;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Limpia el RUT de puntos y guiones, retornando cuerpo y dígito verificador. */
function parseRut(rut: string): { body: string; dv: string } | null {
  const cleaned = rut.replace(/[.\-]/g, '').toUpperCase().trim();
  if (!/^[0-9]{7,8}[0-9K]$/i.test(cleaned)) return null;
  return {
    body: cleaned.slice(0, -1),
    dv: cleaned.slice(-1),
  };
}

/** Convierte un string a entero de forma segura. */
function toInt(value: string): number {
  return Number.parseInt(value, 10);
}

// ─────────────────────────────────────────────────────────────
// Validadores
// ─────────────────────────────────────────────────────────────

/** Valida un RUT chileno con el algoritmo módulo 11. */
export function validateRut(rut: string): boolean {
  const parsed = parseRut(rut);
  if (!parsed) return false;

  const { body, dv } = parsed;
  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += toInt(body[i] ?? '0') * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  let expectedDv: string;
  if (remainder === 11) {
    expectedDv = '0';
  } else if (remainder === 10) {
    expectedDv = 'K';
  } else {
    expectedDv = String(remainder);
  }

  return expectedDv.toUpperCase() === dv.toUpperCase();
}

/** Valida un email con una regex básica. */
export function validateEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  return EMAIL_REGEX.test(email);
}

/** Valida un teléfono chileno permitiendo +, espacios, guiones y paréntesis. */
export function validatePhone(phone: string): boolean {
  const digits = normalizePhone(phone);
  if (digits.length === 0) return false;
  return digits.length >= PHONE_MIN_LENGTH && digits.length <= PHONE_MAX_LENGTH;
}

// ─────────────────────────────────────────────────────────────
// Formato / Normalización
// ─────────────────────────────────────────────────────────────

/** Formatea un RUT chileno a `12.345.678-9`. Si es inválido retorna el original limpio. */
export function formatRut(rut: string): string {
  const cleaned = rut.replace(/[.\-]/g, '').toUpperCase().trim();
  if (!/^[0-9]{7,8}[0-9K]$/i.test(cleaned)) return rut.trim();

  const dv = cleaned.slice(-1);
  const body = cleaned.slice(0, -1);
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedBody}-${dv}`;
}

/** Normaliza un teléfono a solo dígitos, conservando el código de país si se incluyó. */
export function normalizePhone(phone: string): string {
  if (!phone) return '';
  // Remueve espacios, guiones, paréntesis, puntos y el signo +.
  return phone.replace(/[\s\-().+]/g, '');
}

/** Normaliza un RUT al formato `12345678-9` (sin puntos). */
export function normalizeRut(rut: string): string {
  const cleaned = rut.replace(/[.]/g, '').toUpperCase().trim();
  if (!/^[0-9]{7,8}-?[0-9K]$/i.test(cleaned)) return rut.trim();
  if (!cleaned.includes('-')) {
    return `${cleaned.slice(0, -1)}-${cleaned.slice(-1)}`;
  }
  return cleaned;
}

// ─────────────────────────────────────────────────────────────
// Validación completa
// ─────────────────────────────────────────────────────────────

/** Resultado de la validación de todos los campos de la empresa. */
export interface CompanyValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Valida los datos de empresa.
 * Obligatorios: rut, giro, razonSocial, nombreFantasia, direccion, ciudad,
 * comuna, email, telefono.
 * Opcional: nombreContacto.
 * Condicional: deliveryAddress (requerido si requiresSiteDelivery = true).
 */
export function validateCompanyData(data: Partial<QuoteCompanyData>): CompanyValidationResult {
  const errors: Record<string, string> = {};
  const requiredFields: Array<keyof QuoteCompanyData> = [
    'rut',
    'giro',
    'razonSocial',
    'nombreFantasia',
    'direccion',
    'ciudad',
    'comuna',
    'email',
    'telefono',
  ];

  for (const field of requiredFields) {
    const value = data[field];
    if (!value || !String(value).trim()) {
      errors[field] = 'Este campo es obligatorio.';
    }
  }

  if (data.rut && !validateRut(data.rut)) {
    errors.rut = 'El RUT ingresado no es válido.';
  }

  if (data.email && !validateEmail(data.email)) {
    errors.email = 'El email ingresado no es válido.';
  }

  if (data.telefono && !validatePhone(data.telefono)) {
    errors.telefono = `El teléfono debe tener entre ${PHONE_MIN_LENGTH} y ${PHONE_MAX_LENGTH} dígitos.`;
  }

  // Validar dirección de entrega condicional.
  if (data.requiresSiteDelivery === true) {
    const addr = data.deliveryAddress;
    if (!addr || !addr.confirmed || !addr.formattedAddress || !addr.formattedAddress.trim()) {
      errors.deliveryAddress = 'Debes seleccionar una dirección de entrega.';
    } else if (addr.source === 'google') {
      // Si es Google, debe tener place_id y coordenadas válidas.
      if (!addr.placeId) {
        errors.deliveryAddress = 'Selecciona una sugerencia válida.';
      }
      if (typeof addr.latitude !== 'number' || !Number.isFinite(addr.latitude)) {
        errors.deliveryAddress = 'La ubicación seleccionada no tiene coordenadas válidas.';
      }
      if (typeof addr.longitude !== 'number' || !Number.isFinite(addr.longitude)) {
        errors.deliveryAddress = 'La ubicación seleccionada no tiene coordenadas válidas.';
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
