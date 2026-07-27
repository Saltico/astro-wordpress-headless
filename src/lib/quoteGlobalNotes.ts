// src/lib/quoteGlobalNotes.ts
// Persistencia y suscripción de las notas globales del cotizador.
// SSR-safe.

const STORAGE_KEY = 'ip_quote_global_notes_v1';
const EVENT_NAME = 'ip-quote-global-notes-change';
const MAX_LENGTH = 500;

/** Verifica si localStorage está disponible. */
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const probe = '__ip_quote_notes_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/** Sanitiza las notas globales. */
function sanitize(value: string): string {
  if (!value) return '';
  let out = value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  out = out.replace(/\n{3,}/g, '\n\n');
  out = out.trim();
  if (out.length > MAX_LENGTH) out = out.slice(0, MAX_LENGTH).trim();
  return out;
}

/** Lee las notas globales actuales. */
export function getGlobalNotes(): string {
  if (typeof window === 'undefined') return '';
  try {
    return sanitize(window.localStorage.getItem(STORAGE_KEY) ?? '');
  } catch {
    return '';
  }
}

/** Persiste las notas globales y emite el evento de cambio. */
export function setGlobalNotes(value: string): void {
  if (!isStorageAvailable()) return;
  const sanitized = sanitize(value);
  try {
    window.localStorage.setItem(STORAGE_KEY, sanitized);
  } catch {
    return;
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: sanitized }));
}

/** Limpia las notas globales. */
export function clearGlobalNotes(): void {
  setGlobalNotes('');
}

/** Suscribe un listener a cambios de las notas globales. */
export function subscribeGlobalNotes(callback: (notes: string) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const handler = (event: Event) => {
    const e = event as CustomEvent<string>;
    callback(e.detail);
  };
  window.addEventListener(EVENT_NAME, handler);

  const storageHandler = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    callback(getGlobalNotes());
  };
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', storageHandler);
  };
}

/** Inicializa listener de storage para sincronizar cambios entre pestañas. */
export function initGlobalNotesStorageSync(): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: getGlobalNotes() }));
  });
}
