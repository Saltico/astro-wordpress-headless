# Spec 07 — Backend WordPress (REST Endpoint)

**Fase:** 7
**Estado:** ⬜ Pendiente
**Archivos a crear:** `wordpress/plugins/ip-quote-api/*` (plugin pequeño, no parte del repo Astro)
**Depende de:** Specs 01, 06
**Bloquea a:** spec 09 (smoke test)

---

## Objetivo

Crear un **plugin pequeño de WordPress** que expone un endpoint REST propio en `POST /wp-json/ip/v1/quote-request`. El plugin:

1. **Recibe el payload JSON** del frontend.
2. **Valida** todos los campos server-side (no se confía en el cliente).
3. **Sanitiza** con las funciones nativas de WP (`sanitize_text_field`, `sanitize_email`, `sanitize_keya`r, `esc_html`, `wp_kses_post`).
4. **Verifica honeypot** y aplica **rate limit** por IP.
5. **Envía un email** al ejecutivo configurado con un resumen estructurado (HTML + texto plano).
6. **Persiste el lead** como Custom Post Type `quote_request` (opcional, default `true`).
7. **Responde JSON** con éxito o error estructurado.

> ⚠️ **Este plugin se instala en `https://ipproyectosindustriales.cl/wp-admin`** y **no** se incluye en el repo de Astro. La spec documenta la **interfaz** (ruta, request/response shape) y deja el código PHP como referencia; el deploy del plugin es **manual** vía `hPanel → Archivos → plugins/`.

## Por qué importa

- El frontend Astro (`output: 'static'`) **no puede enviar emails** en runtime. Delegamos a WordPress.
- Sin validación server-side, un bot puede bypassear el honeypot y enviar 1000 leads/seg.
- Sin sanitización, el email al ejecutivo puede contener XSS si el admin lo visualiza en un cliente que renderiza HTML.
- Sin rate limit, el endpoint se vuelve vector de spam.

## Ruta y contrato

### Endpoint

```text
POST https://ipproyectosindustriales.cl/wp-json/ip/v1/quote-request
```

### Headers

| Header | Valor | Notas |
|---|---|---|
| `Content-Type` | `application/json` | obligatorio |
| `Origin` | `https://ipproyectosindustriales.cl` | CORS pre-flight |

### Request body (`QuoteRequest`)

Ver spec 01 y 06. Repetido aquí para referencia rápida:

```json
{
  "version": "1",
  "items": [
    {
      "equipmentSlug": "grua-grove-gmk-4100",
      "name": "Grove GMK 4100",
      "capacity": "100 t",
      "height": "88 m",
      "image": "/_astro/hero.abc.webp",
      "sourceUrl": "https://ipproyectosindustriales.cl/arriendo/izaje/gruas-100-toneladas",
      "customization": {
        "quantity": 1,
        "periodType": "mensual",
        "periodCount": 3,
        "startDate": "2026-08-15",
        "notes": "faena Candelaria",
        "transport": { "required": true, "address": "Ruta 5 km al norte de Caldera" }
      },
      "addedAt": "2026-07-15T10:25:00.000Z",
      "updatedAt": "2026-07-15T10:28:00.000Z"
    }
  ],
  "contact": {
    "name": "Juan Pérez",
    "company": "Minera Atacama S.A.",
    "rut": "76123456-7",
    "email": "juan.perez@minera-atacama.cl",
    "phone": "+56987654321",
    "region": "Atacama",
    "commune": "Caldera",
    "workplace": "Faena Candelaria, km 12",
    "contactMethod": "whatsapp",
    "message": "Requerimos disponibilidad para el primer turno del lunes.",
    "terms": true
  },
  "globalNotes": "Coordinar ingreso a faena con anticipación.",
  "meta": {
    "sourceUrl": "https://ipproyectosindustriales.cl/cotizador/datos",
    "userAgent": "Mozilla/5.0 ...",
    "submittedAt": "2026-07-15T10:30:00.000Z",
    "utm": { "source": "google", "medium": "cpc", "campaign": "arriendo-gruas-100t" }
  },
  "honeypot": ""
}
```

### Response (éxito)

```json
{
  "ok": true,
  "leadId": 1234,
  "message": "Cotización recibida. Te responderemos en menos de 48 horas hábiles."
}
```

### Response (error de validación, HTTP 400)

```json
{
  "ok": false,
  "code": "validation_error",
  "message": "Revisa los campos marcados.",
  "fieldErrors": [
    { "field": "items.0.customization.startDate", "message": "La fecha debe ser futura." },
    { "field": "contact.email", "message": "Email inválido." }
  ]
}
```

### Response (rate limit, HTTP 429)

```json
{
  "ok": false,
  "code": "rate_limited",
  "message": "Has hecho muchas solicitudes. Intenta en una hora."
}
```

### Response (honeypot triggered, HTTP 200 silencioso)

```json
{
  "ok": true,
  "leadId": null,
  "message": "Cotización recibida."
}
```

(El bot recibe un 200 para no darle feedback; el email no se envía.)

## Estructura del plugin

```
wordpress/
└── plugins/
    └── ip-quote-api/
        ├── ip-quote-api.php                  ← header del plugin + bootstrap
        ├── includes/
        │   ├── class-rest-controller.php     ← registra la ruta REST
        │   ├── class-validator.php           ← valida payload
        │   ├── class-mailer.php              ← arma y envía email
        │   ├── class-rate-limiter.php        ← transient por IP
        │   └── class-quote-cpt.php           ← registra CPT
        └── readme.txt                        ← metadata del plugin
```

> **Nota:** el árbol `wordpress/` puede estar en el repo como **referencia/documentación**; los archivos se copian al servidor via SFTP o `hPanel → File Manager`. La spec documenta qué entra en cada archivo.

## `ip-quote-api.php` (header + bootstrap)

```php
<?php
/**
 * Plugin Name: IP Quote API
 * Description: Endpoint REST para recibir cotizaciones del cotizador de IP Proyectos Industriales.
 * Version: 1.0.0
 * Author: IP Proyectos Industriales
 * License: Proprietary
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'IP_QUOTE_API_VERSION', '1.0.0' );
define( 'IP_QUOTE_API_DIR', plugin_dir_path( __FILE__ ) );
define( 'IP_QUOTE_API_URL', plugin_dir_url( __FILE__ ) );

require_once IP_QUOTE_API_DIR . 'includes/class-quote-cpt.php';
require_once IP_QUOTE_API_DIR . 'includes/class-rate-limiter.php';
require_once IP_QUOTE_API_DIR . 'includes/class-validator.php';
require_once IP_QUOTE_API_DIR . 'includes/class-mailer.php';
require_once IP_QUOTE_API_DIR . 'includes/class-rest-controller.php';

add_action( 'init', [ 'IP_Quote_CPT', 'register' ] );
add_action( 'rest_api_init', [ 'IP_Quote_REST_Controller', 'register_routes' ] );

// CORS: permitir solo el dominio del frontend estático
add_action( 'rest_pre_serve_request', function () {
    header( 'Access-Control-Allow-Origin: https://ipproyectosindustriales.cl' );
    header( 'Access-Control-Allow-Methods: POST, OPTIONS' );
    header( 'Access-Control-Allow-Headers: Content-Type' );
    header( 'Access-Control-Max-Age: 86400' );
} );
```

## `class-rest-controller.php` (registro de ruta + handler)

```php
<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class IP_Quote_REST_Controller extends WP_REST_Controller {

    const NAMESPACE = 'ip/v1';
    const ROUTE     = '/quote-request';

    public static function register_routes() {
        register_rest_route( self::NAMESPACE, self::ROUTE, [
            'methods'             => 'POST,OPTIONS',
            'callback'            => [ self::class, 'handle_request' ],
            'permission_callback' => '__return_true', // público; validamos abajo
        ] );
    }

    public static function handle_request( WP_REST_Request $request ) {
        // 0. Manejar preflight CORS
        if ( $request->get_method() === 'OPTIONS' ) {
            return new WP_REST_Response( null, 204 );
        }

        $body = $request->get_json_params();
        if ( ! is_array( $body ) ) {
            return self::error( 'validation_error', 'Payload inválido.', 400 );
        }

        $ip = self::client_ip();
        $rate = IP_Quote_Rate_Limiter::check( $ip, 5, HOUR_IN_SECONDS );
        if ( $rate['limited'] ) {
            return self::error( 'rate_limited', $rate['message'], 429 );
        }

        // Honeypot: si el bot llenó el campo, devolver 200 silencioso.
        $honeypot = isset( $body['honeypot'] ) ? (string) $body['honeypot'] : '';
        if ( $honeypot !== '' ) {
            IP_Quote_Rate_Limiter::record( $ip, HOUR_IN_SECONDS ); // consumir cuota
            return self::success( null, 'Cotización recibida.' );
        }

        $validation = IP_Quote_Validator::validate( $body );
        if ( ! $validation['ok'] ) {
            return self::error( 'validation_error', 'Revisa los campos marcados.', 400, $validation['errors'] );
        }

        $sanitized = IP_Quote_Validator::sanitize( $body );

        $lead_id = IP_Quote_CPT::create_lead( $sanitized );

        IP_Quote_Mailer::send_to_executive( $sanitized, $lead_id );
        IP_Quote_Mailer::maybe_send_receipt( $sanitized, $lead_id );

        IP_Quote_Rate_Limiter::record( $ip, HOUR_IN_SECONDS );

        return self::success( $lead_id, 'Cotización recibida. Te responderemos en menos de 48 horas hábiles.' );
    }

    private static function client_ip(): string {
        $candidates = [ 'HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR' ];
        foreach ( $candidates as $key ) {
            if ( ! empty( $_SERVER[ $key ] ) ) {
                $ip = explode( ',', sanitize_text_field( wp_unslash( $_SERVER[ $key ] ) ) );
                return trim( $ip[0] );
            }
        }
        return '0.0.0.0';
    }

    private static function success( ?int $lead_id, string $message ): WP_REST_Response {
        return new WP_REST_Response( [
            'ok'      => true,
            'leadId'  => $lead_id,
            'message' => $message,
        ], 200 );
    }

    private static function error( string $code, string $message, int $status, array $field_errors = [] ): WP_REST_Response {
        $body = [
            'ok'      => false,
            'code'    => $code,
            'message' => $message,
        ];
        if ( $field_errors ) {
            $body['fieldErrors'] = $field_errors;
        }
        return new WP_REST_Response( $body, $status );
    }
}
```

## `class-validator.php` (validación + sanitización)

```php
<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class IP_Quote_Validator {

    const MAX_ITEMS       = 5;
    const MIN_QUANTITY    = 1;
    const MAX_QUANTITY    = 50;
    const MIN_PERIODS     = 1;
    const MAX_PERIODS     = 365;
    const PERIOD_TYPES    = [ 'diario', 'semanal', 'mensual' ];
    const CONTACT_METHODS = [ 'whatsapp', 'email', 'phone' ];

    public static function validate( array $body ): array {
        $errors = [];

        // items
        $items = $body['items'] ?? null;
        if ( ! is_array( $items ) || count( $items ) === 0 ) {
            $errors[] = [ 'field' => 'items', 'message' => 'Agrega al menos un equipo.' ];
            return [ 'ok' => false, 'errors' => $errors ];
        }
        if ( count( $items ) > self::MAX_ITEMS ) {
            $errors[] = [ 'field' => 'items', 'message' => 'Máximo ' . self::MAX_ITEMS . ' equipos.' ];
        }
        foreach ( $items as $idx => $item ) {
            $errors = array_merge( $errors, self::validate_item( $idx, $item ) );
        }

        // contact
        $contact = $body['contact'] ?? null;
        if ( ! is_array( $contact ) ) {
            $errors[] = [ 'field' => 'contact', 'message' => 'Faltan datos de contacto.' ];
        } else {
            $errors = array_merge( $errors, self::validate_contact( $contact ) );
        }

        // honeypot
        if ( isset( $body['honeypot'] ) && (string) $body['honeypot'] !== '' ) {
            $errors[] = [ 'field' => 'honeypot', 'message' => 'Spam detectado.' ];
        }

        return empty( $errors ) ? [ 'ok' => true, 'errors' => [] ] : [ 'ok' => false, 'errors' => $errors ];
    }

    private static function validate_item( int $idx, $item ): array {
        $errors = [];
        if ( ! is_array( $item ) ) {
            $errors[] = [ 'field' => "items.$idx", 'message' => 'Item inválido.' ];
            return $errors;
        }
        $slug = $item['equipmentSlug'] ?? '';
        if ( ! is_string( $slug ) || $slug === '' ) {
            $errors[] = [ 'field' => "items.$idx.equipmentSlug", 'message' => 'Falta slug del equipo.' ];
        }
        $c = $item['customization'] ?? [];
        if ( ! is_array( $c ) ) {
            $errors[] = [ 'field' => "items.$idx.customization", 'message' => 'Falta personalización.' ];
            return $errors;
        }
        $qty = $c['quantity'] ?? 0;
        if ( ! is_int( $qty ) || $qty < self::MIN_QUANTITY || $qty > self::MAX_QUANTITY ) {
            $errors[] = [ 'field' => "items.$idx.customization.quantity", 'message' => 'Cantidad fuera de rango.' ];
        }
        $ptype = $c['periodType'] ?? '';
        if ( ! in_array( $ptype, self::PERIOD_TYPES, true ) ) {
            $errors[] = [ 'field' => "items.$idx.customization.periodType", 'message' => 'Tipo de periodo inválido.' ];
        }
        $pcount = $c['periodCount'] ?? 0;
        if ( ! is_int( $pcount ) || $pcount < self::MIN_PERIODS || $pcount > self::MAX_PERIODS ) {
            $errors[] = [ 'field' => "items.$idx.customization.periodCount", 'message' => 'Cantidad de periodos fuera de rango.' ];
        }
        $sdate = $c['startDate'] ?? '';
        if ( ! is_string( $sdate ) || ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $sdate ) || $sdate < date( 'Y-m-d' ) ) {
            $errors[] = [ 'field' => "items.$idx.customization.startDate", 'message' => 'Fecha de inicio inválida o pasada.' ];
        }
        return $errors;
    }

    private static function validate_contact( array $c ): array {
        $errors = [];
        $name = trim( $c['name'] ?? '' );
        if ( strlen( $name ) < 3 || strlen( $name ) > 80 ) {
            $errors[] = [ 'field' => 'contact.name', 'message' => 'Nombre requerido (3-80 chars).' ];
        }
        $company = trim( $c['company'] ?? '' );
        if ( strlen( $company ) < 2 || strlen( $company ) > 80 ) {
            $errors[] = [ 'field' => 'contact.company', 'message' => 'Empresa requerida (2-80 chars).' ];
        }
        if ( ! empty( $c['rut'] ) ) {
            $rut = preg_replace( '/[.\s]/', '', (string) $c['rut'] );
            if ( ! preg_match( '/^\d{7,8}-[0-9Kk]$/', $rut ) ) {
                $errors[] = [ 'field' => 'contact.rut', 'message' => 'RUT inválido.' ];
            }
        }
        $email = $c['email'] ?? '';
        if ( ! is_email( $email ) ) {
            $errors[] = [ 'field' => 'contact.email', 'message' => 'Email inválido.' ];
        }
        $phone = preg_replace( '/[^\d]/', '', (string) ( $c['phone'] ?? '' ) );
        if ( strlen( $phone ) < 9 || strlen( $phone ) > 12 ) {
            $errors[] = [ 'field' => 'contact.phone', 'message' => 'Teléfono inválido.' ];
        }
        foreach ( [ 'region', 'commune', 'workplace' ] as $field ) {
            $val = trim( $c[ $field ] ?? '' );
            if ( strlen( $val ) < 3 ) {
                $errors[] = [ 'field' => "contact.$field", 'message' => "Indica $field." ];
            }
        }
        $method = $c['contactMethod'] ?? '';
        if ( ! in_array( $method, self::CONTACT_METHODS, true ) ) {
            $errors[] = [ 'field' => 'contact.contactMethod', 'message' => 'Método de contacto inválido.' ];
        }
        if ( empty( $c['terms'] ) ) {
            $errors[] = [ 'field' => 'contact.terms', 'message' => 'Debe aceptar los términos.' ];
        }
        return $errors;
    }

    public static function sanitize( array $body ): array {
        $items = array_map( function ( $item ) {
            return [
                'equipmentSlug' => sanitize_text_field( $item['equipmentSlug'] ?? '' ),
                'name'          => sanitize_text_field( $item['name'] ?? '' ),
                'capacity'      => sanitize_text_field( $item['capacity'] ?? '' ),
                'height'        => sanitize_text_field( $item['height'] ?? '' ),
                'image'         => esc_url_raw( $item['image'] ?? '' ),
                'sourceUrl'     => esc_url_raw( $item['sourceUrl'] ?? '' ),
                'customization' => [
                    'quantity'    => (int) ( $item['customization']['quantity'] ?? 1 ),
                    'periodType'  => sanitize_key( $item['customization']['periodType'] ?? 'diario' ),
                    'periodCount' => (int) ( $item['customization']['periodCount'] ?? 1 ),
                    'startDate'   => sanitize_text_field( $item['customization']['startDate'] ?? '' ),
                    'notes'       => sanitize_textarea_field( $item['customization']['notes'] ?? '' ),
                    'transport'   => [
                        'required' => (bool) ( $item['customization']['transport']['required'] ?? false ),
                        'address'  => sanitize_text_field( $item['customization']['transport']['address'] ?? '' ),
                    ],
                ],
            ];
        }, $body['items'] ?? [] );

        $c = $body['contact'] ?? [];
        $contact = [
            'name'          => sanitize_text_field( $c['name'] ?? '' ),
            'company'       => sanitize_text_field( $c['company'] ?? '' ),
            'rut'           => ! empty( $c['rut'] ) ? sanitize_text_field( $c['rut'] ) : null,
            'email'         => sanitize_email( $c['email'] ?? '' ),
            'phone'         => sanitize_text_field( $c['phone'] ?? '' ),
            'region'        => sanitize_text_field( $c['region'] ?? '' ),
            'commune'       => sanitize_text_field( $c['commune'] ?? '' ),
            'workplace'     => sanitize_text_field( $c['workplace'] ?? '' ),
            'contactMethod' => sanitize_key( $c['contactMethod'] ?? '' ),
            'message'       => sanitize_textarea_field( $c['message'] ?? '' ),
            'terms'         => (bool) ( $c['terms'] ?? false ),
        ];

        return [
            'items'       => $items,
            'contact'     => $contact,
            'globalNotes' => sanitize_textarea_field( $body['globalNotes'] ?? '' ),
            'meta'        => [
                'sourceUrl'   => esc_url_raw( $body['meta']['sourceUrl'] ?? '' ),
                'userAgent'   => sanitize_text_field( $body['meta']['userAgent'] ?? '' ),
                'submittedAt' => sanitize_text_field( $body['meta']['submittedAt'] ?? '' ),
                'utm'         => is_array( $body['meta']['utm'] ?? null ) ? array_map( 'sanitize_text_field', $body['meta']['utm'] ) : null,
            ],
        ];
    }
}
```

## `class-mailer.php` (envío de email)

```php
<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class IP_Quote_Mailer {

    const EXECUTIVE_EMAIL_OPTION = 'ip_quote_executive_email';
    const DEFAULT_EXECUTIVE_EMAIL = 'cotizaciones@ipproyectosindustriales.cl';
    const FROM_NAME  = 'IP Proyectos Industriales';
    const FROM_EMAIL = 'no-reply@ipproyectosindustriales.cl';

    public static function send_to_executive( array $payload, ?int $lead_id ): bool {
        $to = get_option( self::EXECUTIVE_EMAIL_OPTION, self::DEFAULT_EXECUTIVE_EMAIL );
        $subject = sprintf( '[Cotizador] Nueva solicitud de %s', $payload['contact']['company'] );

        $body_plain = self::build_plain_body( $payload, $lead_id );
        $body_html  = self::build_html_body( $payload, $lead_id );

        $headers = [
            'From: ' . self::FROM_NAME . ' <' . self::FROM_EMAIL . '>',
            'Reply-To: ' . $payload['contact']['name'] . ' <' . $payload['contact']['email'] . '>',
            'Content-Type: text/html; charset=UTF-8',
        ];

        return wp_mail( $to, $subject, $body_html, $headers );
    }

    public static function maybe_send_receipt( array $payload, ?int $lead_id ): bool {
        // v1: no enviamos copia al cliente (decisión D-09).
        return true;
    }

    private static function build_plain_body( array $p, ?int $lead_id ): string {
        $c = $p['contact'];
        $lines = [];
        $lines[] = 'Nueva cotización desde el cotizador de IP Proyectos Industriales';
        if ( $lead_id ) $lines[] = 'Lead ID: ' . $lead_id;
        $lines[] = '';
        $lines[] = '== CLIENTE ==';
        $lines[] = $c['name'] . ' (' . $c['company'] . ')';
        $lines[] = 'Email: ' . $c['email'];
        $lines[] = 'Teléfono: ' . $c['phone'];
        if ( ! empty( $c['rut'] ) ) $lines[] = 'RUT: ' . $c['rut'];
        $lines[] = 'Ubicación: ' . $c['commune'] . ', ' . $c['region'] . ' - ' . $c['workplace'];
        $lines[] = 'Método preferido: ' . $c['contactMethod'];
        if ( ! empty( $c['message'] ) ) $lines[] = 'Mensaje: ' . $c['message'];
        $lines[] = '';
        $lines[] = '== EQUIPOS ==';
        foreach ( $p['items'] as $i ) {
            $cu = $i['customization'];
            $lines[] = sprintf( '- %d x %s (%s)', $cu['quantity'], $i['name'], $i['capacity'] );
            $lines[] = '  Periodo: ' . $cu['periodType'] . ' x ' . $cu['periodCount'] . ' -> inicio ' . $cu['startDate'];
            if ( ! empty( $cu['notes'] ) ) $lines[] = '  Notas: ' . $cu['notes'];
            if ( $cu['transport']['required'] ) {
                $lines[] = '  Traslado: Sí - ' . ( $cu['transport']['address'] ?: '-' );
            }
        }
        if ( ! empty( $p['globalNotes'] ) ) {
            $lines[] = '';
            $lines[] = '== NOTAS GLOBALES ==';
            $lines[] = $p['globalNotes'];
        }
        if ( ! empty( $p['meta']['sourceUrl'] ) ) {
            $lines[] = '';
            $lines[] = 'Origen: ' . $p['meta']['sourceUrl'];
        }
        return implode( "\n", $lines );
    }

    private static function build_html_body( array $p, ?int $lead_id ): string {
        // HTML simple; usa wp_kses_post al output final si quieres permitir más tags.
        $c = $p['contact'];
        $items_html = '';
        foreach ( $p['items'] as $i ) {
            $cu = $i['customization'];
            $items_html .= sprintf(
                '<tr><td><strong>%d</strong></td><td>%s<br><small>%s</small></td><td>%s x %s</td><td>%s</td><td>%s</td></tr>',
                $cu['quantity'],
                esc_html( $i['name'] ),
                esc_html( $i['capacity'] ),
                esc_html( $cu['periodType'] ),
                esc_html( (string) $cu['periodCount'] ),
                esc_html( $cu['startDate'] ),
                esc_html( $cu['notes'] ?? '-' )
            );
        }
        $html = sprintf(
            '<h2>Nueva cotización</h2>
             <p><strong>Cliente:</strong> %s (%s)<br>
                <strong>Email:</strong> <a href="mailto:%s">%s</a><br>
                <strong>Teléfono:</strong> %s<br>
                <strong>Ubicación:</strong> %s, %s - %s</p>
             <table border="1" cellpadding="6" cellspacing="0">
               <thead><tr><th>Cant.</th><th>Equipo</th><th>Periodo</th><th>Inicio</th><th>Notas</th></tr></thead>
               <tbody>%s</tbody>
             </table>
             %s
             <p style="color:#666;font-size:12px;">Origen: %s</p>',
            esc_html( $c['name'] ),
            esc_html( $c['company'] ),
            esc_attr( $c['email'] ),
            esc_html( $c['email'] ),
            esc_html( $c['phone'] ),
            esc_html( $c['commune'] ),
            esc_html( $c['region'] ),
            esc_html( $c['workplace'] ),
            $items_html,
            ! empty( $p['globalNotes'] ) ? '<h3>Notas globales</h3><p>' . esc_html( $p['globalNotes'] ) . '</p>' : '',
            esc_url( $p['meta']['sourceUrl'] )
        );
        return $html;
    }
}
```

## `class-rate-limiter.php` (rate limit con transients)

```php
<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class IP_Quote_Rate_Limiter {

    public static function check( string $ip, int $max, int $window_seconds ): array {
        $key = 'ip_quote_rl_' . md5( $ip );
        $count = (int) get_transient( $key );
        if ( $count >= $max ) {
            return [
                'limited' => true,
                'message' => sprintf( 'Has hecho muchas solicitudes. Máximo %d por hora.', $max ),
            ];
        }
        return [ 'limited' => false ];
    }

    public static function record( string $ip, int $window_seconds ): void {
        $key = 'ip_quote_rl_' . md5( $ip );
        $count = (int) get_transient( $key );
        set_transient( $key, $count + 1, $window_seconds );
    }
}
```

## `class-quote-cpt.php` (Custom Post Type)

```php
<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class IP_Quote_CPT {

    const POST_TYPE = 'quote_request';

    public static function register(): void {
        register_post_type( self::POST_TYPE, [
            'labels' => [
                'name'          => 'Cotizaciones',
                'singular_name' => 'Cotización',
                'add_new_item'  => 'Nueva cotización',
            ],
            'public'       => false,
            'show_ui'      => true,
            'show_in_menu' => true,
            'menu_icon'    => 'dashicons-email-alt',
            'supports'     => [ 'title', 'editor', 'custom-fields' ],
            'capabilities' => [ 'create_posts' => false ], // solo desde plugin
            'has_archive'  => false,
            'rewrite'      => false,
        ] );
    }

    public static function create_lead( array $payload ): ?int {
        $c = $payload['contact'];
        $title = sprintf( '%s — %s', $c['company'], $c['name'] );

        $post_id = wp_insert_post( [
            'post_type'    => self::POST_TYPE,
            'post_status'  => 'private',
            'post_title'   => $title,
            'post_content' => $c['message'] ?? '',
        ], true );

        if ( is_wp_error( $post_id ) ) {
            return null;
        }

        update_post_meta( $post_id, '_contact_name',  $c['name'] );
        update_post_meta( $post_id, '_contact_email', $c['email'] );
        update_post_meta( $post_id, '_contact_phone', $c['phone'] );
        update_post_meta( $post_id, '_contact_company', $c['company'] );
        update_post_meta( $post_id, '_items_json', wp_json_encode( $payload['items'] ) );
        update_post_meta( $post_id, '_global_notes', $payload['globalNotes'] );
        update_post_meta( $post_id, '_source_url', $payload['meta']['sourceUrl'] );

        return $post_id;
    }
}
```

## CORS

```php
// En ip-quote-api.php (header)
add_action( 'rest_pre_serve_request', function () {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ( in_array( $origin, [ 'https://ipproyectosindustriales.cl' ], true ) ) {
        header( "Access-Control-Allow-Origin: $origin" );
        header( 'Access-Control-Allow-Methods: POST, OPTIONS' );
        header( 'Access-Control-Allow-Headers: Content-Type' );
        header( 'Access-Control-Max-Age: 86400' );
    }
} );
```

> **Importante:** CORS en WP se sirve **antes** de que WP boot; en algunos hosting hay que sumar `<IfModule mod_headers.c>` en `.htaccess` (ver spec 08).

## Manejo de errores

| Caso | HTTP | code | Mensaje al usuario |
|---|---|---|---|
| Payload no es JSON | 400 | `validation_error` | "Payload inválido." |
| `items.length === 0` | 400 | `validation_error` | "Agrega al menos un equipo." |
| `items.length > 5` | 400 | `validation_error` | "Máximo 5 equipos." |
| `equipmentSlug` desconocido | 400 | `unknown_equipment` | "Equipo no disponible." |
| `startDate` pasada | 400 | `validation_error` | "La fecha debe ser futura." |
| `email` mal formato | 400 | `validation_error` | "Email inválido." |
| `phone` corto | 400 | `validation_error` | "Teléfono inválido." |
| `honeypot` lleno | 200 | (éxito falso) | "Cotización recibida." |
| Rate limit | 429 | `rate_limited` | "Has hecho muchas solicitudes." |
| `wp_mail` falla | 500 | `server_error` | "No pudimos enviar. Intenta más tarde." |

## Configuración inicial

Tras instalar el plugin, ejecutar en `wp-admin → Herramientas → Ejecutar PHP` (o via WP-CLI):

```php
update_option( 'ip_quote_executive_email', 'cotizaciones@ipproyectosindustriales.cl' );
```

(O vía `wp option update ip_quote_executive_email cotizaciones@ipproyectosindustriales.cl`.)

## Tareas

- [ ] Crear el plugin en `wordpress/plugins/ip-quote-api/`.
- [ ] Implementar las 5 clases.
- [ ] Configurar el email del ejecutivo en `wp_options`.
- [ ] Verificar que el CPT `quote_request` aparece en `wp-admin`.
- [ ] Probar con `curl`:

  ```bash
  curl -X POST https://ipproyectosindustriales.cl/wp-json/ip/v1/quote-request \
    -H "Content-Type: application/json" \
    -H "Origin: https://ipproyectosindustriales.cl" \
    -d @sample-payload.json
  ```

- [ ] Probar con honeypot lleno (debe dar 200 sin enviar email).
- [ ] Probar con 6 requests en 1 minuto (debe dar 429 al 6°).
- [ ] Verificar que el email llega a `cotizaciones@ipproyectosindustriales.cl` y el lead aparece en `wp-admin → Cotizaciones`.

## Definition of Done

- [ ] El plugin está instalado y activado en el WP de producción.
- [ ] El endpoint `POST /wp-json/ip/v1/quote-request` responde JSON.
- [ ] CORS permite solo el dominio del frontend.
- [ ] Validación server-side rechaza payloads inválidos con 400.
- [ ] Honeypot bloquea bots con 200 silencioso.
- [ ] Rate limit bloquea con 429 después de 5 requests/hora.
- [ ] Email llega al ejecutivo con datos correctos.
- [ ] CPT `quote_request` guarda cada lead.
- [ ] No hay credenciales SMTP en el frontend.
- [ ] No se loguean datos sensibles (PII) en archivos de WP.

## Referencias

- Spec 01: [./01-data-model.md](./01-data-model.md) — `QuoteRequest`, `QuoteRequestResponse`.
- Spec 06: [./06-message-and-payload-builders.md](./06-message-and-payload-builders.md) — `buildQuoteRequest` produce el payload que este endpoint consume.
- Spec 08: [./08-seo-analytics.md](./08-seo-analytics.md) — eventos GA4.
- `public/.htaccess` — puede necesitar headers CORS como respaldo.
- WordPress REST API: https://developer.wordpress.org/rest-api/
- WordPress Plugin Handbook: https://developer.wordpress.org/plugins/
- `sanitize_*` functions: https://developer.wordpress.org/themes/theme-security/data-sanitization-escaping/
