// src/lib/icons.ts
// Catalogo de iconos SVG disponibles. Cada nombre corresponde a un archivo
// en src/assets/icons/{name}.svg

export const ICON_NAMES = [
  'phone',
  'email',
  'menu',
  'close',
  'chevron-down',
  'chevron-up',
  'arrow-right',
  'arrow-left',
  'download',
  'whatsapp',
  'shield',
  'crane',
  'weight',
  'height',
  'certificate',
  'check',
  'warning',
  'linkedin',
  'instagram',
  'facebook',
  'location',
  'clock',
  'user',
  'file-text',
  'map-pin',
  'cart',
  'search',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export function isIconName(value: string): value is IconName {
  return ICON_NAMES.includes(value as IconName);
}
