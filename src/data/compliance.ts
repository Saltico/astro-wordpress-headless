// src/data/compliance.ts
// Lista de documentos de compliance y HSEQ descargables.
// Cada documento tiene metadata para presentación y para SEO.

export interface ComplianceDoc {
  slug: string;
  title: string;
  description: string;
  pdfUrl: string;
  version?: string;
  updatedAt?: string;          // ISO date
  sizeBytes?: number;
  category: 'compliance' | 'ethics' | 'commercial' | 'policy';
}

export const complianceDocs: ComplianceDoc[] = [
  {
    slug: 'modelo-prevencion-delito',
    title: 'Modelo de Prevención del Delito',
    description:
      'Sistema de prevención conforme a la Ley N° 20.393, con controles y responsabilidades para prevenir delitos en la organización.',
    pdfUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2025/XX/mpd-ipp.pdf',
    version: 'v2.1',
    updatedAt: '2025-08-01',
    sizeBytes: 245_000,
    category: 'compliance',
  },
  {
    slug: 'anexo-proveedores',
    title: 'Anexo de Proveedores',
    description:
      'Cláusulas y compromisos de cumplimiento ético y legal que aceptan nuestros proveedores y colaboradores.',
    pdfUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2025/XX/anexo-proveedores.pdf',
    version: 'v1.4',
    updatedAt: '2025-06-15',
    sizeBytes: 180_000,
    category: 'compliance',
  },
  {
    slug: 'codigo-de-etica',
    title: 'Código de Ética',
    description:
      'Principios, valores y conductas que guían el actuar de todo el equipo de IP Proyectos Industriales.',
    pdfUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2025/XX/codigo-etica.pdf',
    version: 'v3.0',
    updatedAt: '2025-05-20',
    sizeBytes: 320_000,
    category: 'ethics',
  },
  {
    slug: 'ordenes-de-compra',
    title: 'Órdenes de compra',
    description:
      'Términos y condiciones generales que rigen nuestras órdenes de compra con proveedores.',
    pdfUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2025/XX/oc-terminos.pdf',
    version: 'v1.2',
    updatedAt: '2025-04-10',
    sizeBytes: 195_000,
    category: 'commercial',
  },
  {
    slug: 'politica-donaciones',
    title: 'Política de Donaciones',
    description:
      'Marco y criterios para los aportes y donaciones que realiza la empresa, con transparencia y trazabilidad.',
    pdfUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2025/XX/politica-donaciones.pdf',
    version: 'v1.0',
    updatedAt: '2025-03-05',
    sizeBytes: 165_000,
    category: 'policy',
  },
  {
    slug: 'politica-pro-pyme',
    title: 'Política Pro Pyme de pagos',
    description:
      'Nuestro compromiso de pago oportuno a proveedores Pyme, adhiriendo a las buenas prácticas de pago.',
    pdfUrl: 'https://ipproyectosindustriales.cl/wp-content/uploads/2025/XX/pro-pyme.pdf',
    version: 'v1.0',
    updatedAt: '2025-02-15',
    sizeBytes: 142_000,
    category: 'policy',
  },
];

export function formatSize(bytes: number | undefined): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
