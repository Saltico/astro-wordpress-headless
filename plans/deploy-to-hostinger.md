# Deploy a Static Site to Hostinger (desde la terminal)

## 🔥 Método rápido: npm run deploy

```powershell
cd "D:\Proyectos\matiascastillo.com\Proyectos 🧨\Astro+WordPress headless\POC1"
npm run deploy
```

Esto ejecuta `deploy-hostinger.mjs` que automatiza todo el pipeline:

| Paso | Descripción |
|------|-------------|
| 1/4 | `npm run build` — compila el sitio Astro |
| 2/4 | Crea un ZIP de `dist/` con timestamp |
| 3/4 | Invoca `hostinger-hosting-mcp` vía JSON-RPC para subir y desplegar |
| 4/4 | Verifica que el sitio responda HTTP 200 |

### Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `HOSTINGER_DOMAIN` | `orangered-deer-742907.hostingersite.com` | Dominio en Hostinger |
| `HOSTINGER_API_TOKEN` | — | Token de API (opcional, sino usa OAuth guardado) |
| `SKIP_BUILD` | `0` | `=1` para saltar el build y usar el `dist/` existente |
| `KEEP_ARCHIVE` | `0` | `=1` para no borrar el ZIP después del deploy |

Ejemplos:

```powershell
# Deploy básico
npm run deploy

# Con API token
$env:HOSTINGER_API_TOKEN = "tu_token"
npm run deploy

# Sin rebuild (usa dist/ actual)
$env:SKIP_BUILD = "1"
npm run deploy
```

---

## Método manual (paso a paso)

## Requisitos previos

- Node.js >= 22 (instalado vía nvm4w en `C:\Users\Usuario\AppData\Local\nvm\v24.12.0`)
- Paquete `hostinger-api-mcp` instalado globalmente
- Sesión OAuth activa con Hostinger (credenciales guardadas en `%APPDATA%\hostinger-mcp\credentials.json`)

```powershell
# Verificar que el MCP está disponible
Get-Command hostinger-hosting-mcp
# → C:\nvm4w\nodejs\hostinger-hosting-mcp.ps1
```

## Flujo completo de deploy

### 1. Build del sitio

```powershell
cd "D:\Proyectos\matiascastillo.com\Proyectos 🧨\Astro+WordPress headless\POC1"
npm run build
```

Esto genera los archivos estáticos en `./dist/`.

### 2. Empaquetar el build en ZIP

```powershell
# Crear un ZIP desde la carpeta dist/
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$archivePath = "$pwd\dist_$timestamp.zip"
Compress-Archive -Path "$pwd\dist\*" -DestinationPath $archivePath
Write-Output "Archive created: $archivePath"
```

> **Importante**: la terminal actual debe tener permisos de lectura/escritura en la carpeta del proyecto. El ZIP puede llamarse de cualquier forma, pero se recomienda incluir un timestamp para identificar la versión.

### 3. Autenticación

Hay dos formas:

#### Opción A — Usar OAuth (automático si ya hay sesión)

Si ya iniciaste sesión antes, el MCP detecta automáticamente las credenciales guardadas en:

```
%APPDATA%\hostinger-mcp\credentials.json
```

El token tiene una validez de ~1 hora. Si expira, el MCP intenta renovarlo con el `refresh_token` automáticamente. Si falla la renovación, abre un navegador para hacer login interactivo (no útil en terminal headless).

#### Opción B — Usar API Token (recomendado para CI/scripts)

Puedes obtener un token desde hPanel → Perfil → API Tokens, y luego pasarlo como variable de entorno:

```powershell
$env:HOSTINGER_API_TOKEN = "tu_token_aqui"
```

### 4. Deploy (enviar ZIP al hosting)

El servidor MCP usa el protocolo **JSON-RPC sobre stdio**. Desde la terminal hay que escribirle el mensaje por `stdin` y leer la respuesta por `stdout`.

#### Script listo para usar (recomendado)

Guarda esto como `deploy.mjs` en la raíz del proyecto:

```javascript
/**
 * deploy.mjs — Deploy static site to Hostinger via MCP
 *
 * Uso:
 *   $env:HOSTINGER_API_TOKEN = "tu_token"   # opcional
 *   node deploy.mjs
 */

import { spawn } from "child_process";

// ── Configuración ────────────────────────────────────────────
const DOMAIN = "orangered-deer-742907.hostingersite.com";
const ARCHIVE_PATH = process.argv[2];       // o pasa la ruta como argumento
const SERVER_CMD = "hostinger-hosting-mcp";
// ─────────────────────────────────────────────────────────────

if (!ARCHIVE_PATH) {
  console.error("Uso: node deploy.mjs <ruta-del-archive.zip>");
  process.exit(1);
}

const child = spawn(SERVER_CMD, [], {
  stdio: ["pipe", "pipe", "pipe"],
  encoding: "utf8",
});

let responseData = "";

child.stdout.on("data", (data) => {
  responseData += data.toString("utf8");
});

child.on("close", (code) => {
  /* ignorar — la respuesta ya se capturó */
});

const request = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "hosting_deployStaticWebsite",
    arguments: {
      domain: DOMAIN,
      archivePath: ARCHIVE_PATH,
      removeArchive: false,   // true si quieres que borre el ZIP local
    },
  },
};

child.stdin.write(JSON.stringify(request) + "\n");
child.stdin.end();

// Esperar la respuesta JSON-RPC
const result = await new Promise((resolve) => {
  const timeout = setTimeout(() => resolve({ error: "timeout" }), 90000);
  const poll = setInterval(() => {
    if (responseData.includes('"jsonrpc"')) {
      clearTimeout(timeout);
      clearInterval(poll);
      try {
        const parsed = JSON.parse(responseData);
        resolve(parsed);
      } catch {
        resolve({ error: "parse error", raw: responseData });
      }
    }
  }, 200);
});

// Mostrar resultado
if (result.error) {
  console.error("ERROR:", result.error);
  if (result.raw) console.error("Raw:", result.raw);
  process.exit(1);
}

const content = JSON.parse(result.result.content[0].text);
console.log(JSON.stringify(content, null, 2));

if (content.upload?.status === "success" && content.deploy?.status === "success") {
  console.log("\n✅ Deploy exitoso — sitio desplegado en https://" + DOMAIN);
} else {
  console.error("\n❌ El deploy tuvo problemas");
  process.exit(1);
}
```

#### Ejecutar

```powershell
node deploy.mjs .\dist_20260709_220127.zip
```

Si quieres usar variable de entorno para el token:

```powershell
$env:HOSTINGER_API_TOKEN = "tu_token"
node deploy.mjs .\dist_20260709_220127.zip
```

### 5. Verificar que el sitio está vivo

```powershell
# Con curl (si está instalado)
curl -s -o $null -w "%{http_code}" "https://orangered-deer-742907.hostingersite.com/"
# Debería responder 200

# O con Invoke-WebRequest
(Invoke-WebRequest -Uri "https://orangered-deer-742907.hostingersite.com/" -Method Head).StatusCode
# → 200
```

## Comandos rápidos (PowerShell)

Para un deploy rápido sin scripts, pega esto en la terminal:

```powershell
# 1. Build
npm run build

# 2. ZIP
$archive = "$pwd\dist_$(Get-Date -Format 'yyyyMMdd_HHmmss').zip"
Compress-Archive -Path "$pwd\dist\*" -DestinationPath $archive

# 3. Deploy via MCP
$json = @"
{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"hosting_deployStaticWebsite\",\"arguments\":{\"domain\":\"orangered-deer-742907.hostingersite.com\",\"archivePath\":\"$archive\",\"removeArchive\":true}}}
"@
$procInfo = New-Object System.Diagnostics.ProcessStartInfo
$procInfo.FileName = "hostinger-hosting-mcp"
$procInfo.RedirectStandardInput = $true
$procInfo.RedirectStandardOutput = $true
$procInfo.UseShellExecute = $false
$proc = [System.Diagnostics.Process]::Start($procInfo)
$proc.StandardInput.WriteLine($json)
$proc.StandardInput.Close()
$output = $proc.StandardOutput.ReadToEnd()
$proc.WaitForExit(60000)
Write-Output $output
```

> **Advertencia**: este approach directo puede fallar si el path del ZIP contiene caracteres especiales (emoji, tildes, etc). En ese caso, copia el ZIP primero a `$env:TEMP\opencode\` sin caracteres especiales.

## Arquitectura interna del MCP

```
Terminal (stdin)
    │ env: HOSTINGER_API_TOKEN (opcional)
    ▼
hostinger-hosting-mcp (node src/servers/hosting.js)
    │
    ├─ Lee credenciales OAuth de %APPDATA%\hostinger-mcp\credentials.json
    │   (o usa HOSTINGER_API_TOKEN si está definido)
    │
    ├─ Llama a la API REST de Hostinger:
    │   GET  /api/hosting/v1/websites?domain=...     → resuelve username
    │   POST /api/hosting/v1/files/upload-urls       → obtiene credenciales de upload
    │
    ├─ Sube el ZIP via TUS (tus-js-client)
    │
    └─ POST /api/hosting/v1/accounts/{user}/websites/{domain}/deploy
        body: { archive_path: "dist_xxxx.zip" }
```

## Troubleshooting

| Problema | Causa posible | Solución |
|----------|---------------|----------|
| `Archive file not found` | Path con caracteres especiales (🧨) | Copia el ZIP a `$env:TEMP\opencode\` sin caracteres especiales |
| `OAuth error` / se abre navegador | Token expirado y refresh falló | Define `$env:HOSTINGER_API_TOKEN` con un token de hPanel |
| `Connection refused` / timeout | Node.js no está en PATH o MCP no instalado | Ejecuta `npm install -g hostinger-api-mcp` |
| `Upload failed` | Tamaño muy grande o problemas de red | Verifica que el ZIP no supere ~500MB y la conexión a internet |
| Sitio no se actualiza después del deploy | Cache del hosting | Espera 1-2 minutos o force refresh (Ctrl+F5) |

## Información del proyecto

- **Dominio en Hostinger:** `orangered-deer-742907.hostingersite.com`
- **Package MCP:** `hostinger-api-mcp` v1.2.1 en `C:\Users\Usuario\AppData\Local\nvm\v24.12.0\node_modules\hostinger-api-mcp`
- **Server hosting.js:** `src/servers/hosting.js`
- **OAuth credentials:** `%APPDATA%\hostinger-mcp\credentials.json`
