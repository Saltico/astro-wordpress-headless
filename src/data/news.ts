// src/data/news.ts
// Contenido de noticias.
// La estructura de tipos coincide 1:1 con el endpoint WP REST:
// GET /wp-json/wp/v2/posts?_embed=1
// Cada campo tiene el nombre que entrega WP (con . para nested).

export interface NewsArticle {
  id: number;
  date: string;                       // ISO 8601
  date_gmt: string;
  slug: string;
  status: 'publish' | 'draft' | 'private';
  link: string;                       // URL canónica (relativa o absoluta)
  title: { rendered: string };        // HTML
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];

  // Campos derivados de _embedded (WP REST API v2)
  _embedded?: {
    author: Array<{ name: string; slug: string }>;
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details: { width: number; height: number };
    }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    date: '2025-08-21T15:00:00',
    date_gmt: '2025-08-21T18:00:00',
    slug: 'ingenieria-que-se-eleva-asi-se-ejecutan-los-izajes-mas-seguros-del-sector',
    status: 'publish',
    link: '/noticias/ingenieria-que-se-eleva-asi-se-ejecutan-los-izajes-mas-seguros-del-sector',
    title: {
      rendered: 'Ingeniería que se eleva: así se ejecutan los izajes más seguros del sector',
    },
    content: {
      rendered: `
<p>Cuando se trata de izajes de alto tonelaje, cada decisión cuenta. En IP Proyectos Industriales entendemos que la ingeniería no es solo dibujar planos: es anticipar riesgos, validar capacidades y diseñar planes que protejan a las personas y al equipo.</p>
<h2>El plan de izaje, antes de la faena</h2>
<p>Antes de mover una sola grúa, nuestro equipo técnico desarrolla un <strong>plan de izaje detallado</strong> que considera el peso real de la carga, la altura de trabajo, las condiciones de viento y la capacidad portante del terreno. Este documento es la base de toda la operación.</p>
<h2>Operadores certificados, equipos verificados</h2>
<p>Cada maniobra es ejecutada por operadores con certificación vigente y nuestros equipos cuentan con mantenimiento preventivo al día. La seguridad no es un costo, es una inversión.</p>
      `,
      protected: false,
    },
    excerpt: {
      rendered:
        '<p>En faenas donde el riesgo es alto, la diferencia entre un izaje exitoso y un accidente está en la ingeniería que lo precede. Conoce cómo abordamos cada proyecto.</p>',
      protected: false,
    },
    author: 1,
    featured_media: 100,
    categories: [1],
    tags: [1, 2],
    _embedded: {
      author: [{ name: 'IP Proyectos Industriales', slug: 'ip-proyectos' }],
      'wp:featuredmedia': [
        {
          source_url:
            'https://ipproyectosindustriales.cl/wp-content/uploads/2025/08/Noticia-3-1080x675.png',
          alt_text: 'Izaje de alto tonelaje en faena minera',
          media_details: { width: 1080, height: 675 },
        },
      ],
      'wp:term': [[{ id: 1, name: 'Operaciones', slug: 'operaciones' }]],
    },
  },
  {
    id: 2,
    date: '2025-08-21T14:00:00',
    date_gmt: '2025-08-21T17:00:00',
    slug: 'dominando-las-alturas-la-precision-detras-de-cada-izaje',
    status: 'publish',
    link: '/noticias/dominando-las-alturas-la-precision-detras-de-cada-izaje',
    title: { rendered: 'Dominando las alturas: la precisión detrás de cada izaje' },
    content: {
      rendered: '<p>La precisión es el alma de cada izaje. En este artículo revisamos los protocolos que aplicamos para garantizar movimientos milimétricos en faenas complejas.</p><h2>Calibración y mantenimiento</h2><p>Cada equipo pasa por verificaciones periódicas que incluyen indicadores de carga, limitadores y sistemas hidráulicos. La trazabilidad de cada maniobra es parte del proceso.</p>',
      protected: false,
    },
    excerpt: {
      rendered: '<p>Los izajes de precisión requieren planificación, equipos calibrados y operadores con experiencia. Te contamos cómo lo hacemos.</p>',
      protected: false,
    },
    author: 1,
    featured_media: 101,
    categories: [1],
    tags: [1],
    _embedded: {
      author: [{ name: 'IP Proyectos Industriales', slug: 'ip-proyectos' }],
      'wp:featuredmedia': [
        {
          source_url:
            'https://ipproyectosindustriales.cl/wp-content/uploads/2025/08/Noticia-2-1080x675.png',
          alt_text: 'Precisión en izaje',
          media_details: { width: 1080, height: 675 },
        },
      ],
      'wp:term': [[{ id: 1, name: 'Operaciones', slug: 'operaciones' }]],
    },
  },
  {
    id: 3,
    date: '2025-08-21T13:00:00',
    date_gmt: '2025-08-21T16:00:00',
    slug: 'una-flota-que-crece-ip-proyectos-industriales-apuesta-por-mayor-alcance-y-potencia',
    status: 'publish',
    link: '/noticias/una-flota-que-crece-ip-proyectos-industriales-apuesta-por-mayor-alcance-y-potencia',
    title: {
      rendered:
        'Una flota que crece: apostamos por mayor alcance y potencia',
    },
    content: {
      rendered:
        '<p>Ampliamos nuestra flota con nuevos equipos para responder a la creciente demanda del sector minero. Conoce los detalles de esta inversión.</p>',
      protected: false,
    },
    excerpt: {
      rendered:
        '<p>Nuevas adquisiciones que refuerzan nuestra capacidad de respuesta en zona norte y centro de Chile.</p>',
      protected: false,
    },
    author: 1,
    featured_media: 102,
    categories: [2],
    tags: [3],
    _embedded: {
      author: [{ name: 'IP Proyectos Industriales', slug: 'ip-proyectos' }],
      'wp:featuredmedia': [
        {
          source_url:
            'https://ipproyectosindustriales.cl/wp-content/uploads/2025/08/Noticia-1-IP-1080x675.png',
          alt_text: 'Nueva flota IP',
          media_details: { width: 1080, height: 675 },
        },
      ],
      'wp:term': [[{ id: 2, name: 'Empresa', slug: 'empresa' }]],
    },
  },
];
