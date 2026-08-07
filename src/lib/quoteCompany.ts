// src/lib/quoteCompany.ts
// Persistencia y suscripción de los datos de empresa del cotizador.
// SSR-safe: retorna datos vacíos si no hay window.

import type { QuoteCompanyData, DeliveryAddress } from '@/types/quoteCompany';
import { QUOTE_COMPANY_STORAGE_KEY } from '@/types/quoteCompany';

const EVENT_NAME = 'ip-quote-company-change';

const EMPTY_DATA: QuoteCompanyData = {
  rut: '',
  giro: '',
  razonSocial: '',
  nombreFantasia: '',
  direccion: '',
  ciudad: '',
  comuna: '',
  nombreContacto: '',
  email: '',
  telefono: '',
  requiresSiteDelivery: false,
};

/** Verifica si localStorage está disponible. */
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const probe = '__ip_quote_company_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/** Verifica si el valor es una DeliveryAddress válida. */
function isValidDeliveryAddress(value: unknown): value is DeliveryAddress {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<DeliveryAddress>;
  return (
    typeof v.formattedAddress === 'string' &&
    (v.source === 'google' || v.source === 'manual') &&
    typeof v.confirmed === 'boolean'
  );
}

/** Verifica la forma mínima de los datos de empresa. */
function isValidCompanyShape(value: unknown): value is QuoteCompanyData {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<QuoteCompanyData>;
  const baseValid =
    typeof v.rut === 'string' &&
    typeof v.giro === 'string' &&
    typeof v.razonSocial === 'string' &&
    typeof v.nombreFantasia === 'string' &&
    typeof v.direccion === 'string' &&
    typeof v.ciudad === 'string' &&
    typeof v.comuna === 'string' &&
    typeof v.nombreContacto === 'string' &&
    typeof v.email === 'string' &&
    typeof v.telefono === 'string' &&
    typeof v.requiresSiteDelivery === 'boolean';

  if (!baseValid) return false;

  // Si tiene deliveryAddress, validar forma.
  if (v.deliveryAddress !== undefined && !isValidDeliveryAddress(v.deliveryAddress)) {
    return false;
  }

  return true;
}

/** Parsea un string JSON de storage. */
function parseCompanyFromString(raw: string | null): QuoteCompanyData {
  if (raw == null) return { ...EMPTY_DATA };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ...EMPTY_DATA };
  }
  if (!isValidCompanyShape(parsed)) {
    return { ...EMPTY_DATA };
  }
  return parsed;
}

/** Lee los datos desde storage. */
function readFromStorage(): QuoteCompanyData {
  if (typeof window === 'undefined') return { ...EMPTY_DATA };
  try {
    return parseCompanyFromString(window.localStorage.getItem(QUOTE_COMPANY_STORAGE_KEY));
  } catch {
    return { ...EMPTY_DATA };
  }
}

/** Escribe los datos en storage. */
function writeToStorage(data: QuoteCompanyData): boolean {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(QUOTE_COMPANY_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

/** Emite el evento de cambio. */
function emitChange(data: QuoteCompanyData): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { ...data } }));
}

/** Lee los datos actuales. */
export function getCompanyData(): QuoteCompanyData {
  return readFromStorage();
}

/** Persiste nuevos datos y emite el evento de cambio. */
export function setCompanyData(data: QuoteCompanyData): void {
  const requiresSiteDelivery = data.requiresSiteDelivery === true;
  const sanitized: QuoteCompanyData = {
    rut: data.rut?.trim() ?? '',
    giro: data.giro?.trim() ?? '',
    razonSocial: data.razonSocial?.trim() ?? '',
    nombreFantasia: data.nombreFantasia?.trim() ?? '',
    direccion: data.direccion?.trim() ?? '',
    ciudad: data.ciudad?.trim() ?? '',
    comuna: data.comuna?.trim() ?? '',
    nombreContacto: data.nombreContacto?.trim() ?? '',
    email: data.email?.trim() ?? '',
    telefono: data.telefono?.trim() ?? '',
    requiresSiteDelivery,
  };

  // Solo incluir deliveryAddress si requiresSiteDelivery es true y la dirección es válida.
  if (requiresSiteDelivery && data.deliveryAddress?.confirmed && data.deliveryAddress.formattedAddress?.trim()) {
    sanitized.deliveryAddress = {
      formattedAddress: data.deliveryAddress.formattedAddress.trim(),
      placeId: data.deliveryAddress.placeId,
      latitude: data.deliveryAddress.latitude,
      longitude: data.deliveryAddress.longitude,
      commune: data.deliveryAddress.commune?.trim(),
      region: data.deliveryAddress.region?.trim(),
      source: data.deliveryAddress.source === 'google' ? 'google' : 'manual',
      confirmed: true,
    };
  }

  writeToStorage(sanitized);
  emitChange(sanitized);
}

/** Limpia los datos de empresa. */
export function clearCompanyData(): void {
  setCompanyData({ ...EMPTY_DATA });
}

/** Suscribe un listener a cambios de los datos de empresa. */
export function subscribeCompanyData(callback: (data: QuoteCompanyData) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const handler = (event: Event) => {
    const e = event as CustomEvent<QuoteCompanyData>;
    callback(e.detail);
  };
  window.addEventListener(EVENT_NAME, handler);

  const storageHandler = (event: StorageEvent) => {
    if (event.key !== QUOTE_COMPANY_STORAGE_KEY) return;
    callback(readFromStorage());
  };
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', storageHandler);
  };
}

/** Inicializa listener de storage para sincronizar cambios entre pestañas. */
export function initCompanyStorageSync(): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('storage', (event) => {
    if (event.key !== QUOTE_COMPANY_STORAGE_KEY) return;
    emitChange(readFromStorage());
  });
}
