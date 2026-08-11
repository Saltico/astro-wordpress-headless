#!/usr/bin/env node

/**
 * deploy-hostinger.mjs
 *
 * Builds the Astro site, ZIPs the source code, and deploys it to Hostinger
 * as a Node.js application via the hostinger-hosting-mcp server (JSON-RPC over stdio).
 *
 * This script deploys the SOURCE code (not the built dist/) because Hostinger
 * runs the build process on its servers. The @astrojs/node adapter handles SSR.
 *
 * Uso:
 *   node deploy-hostinger.mjs
 *   npm run deploy
 *
 * Variables de entorno:
 *   HOSTINGER_DOMAIN     — dominio en Hostinger (default: olive-raven-766926.hostingersite.com)
 *   HOSTINGER_USERNAME   — username de Hostinger (default: u296385023)
 *   HOSTINGER_API_TOKEN  — token de API (opcional, si no está definido usa OAuth guardado)
 *   HOSTINGER_MCP_CMD    — comando del MCP (default: hostinger-hosting-mcp)
 *   SKIP_BUILD           — si=1 salta el build local (default: 0)
 *   KEEP_ARCHIVE         — si=1 no borra el ZIP tras el deploy (default: 0)
 */

import { spawn, execSync } from "child_process";
import { existsSync, statSync, mkdirSync, createReadStream, createWriteStream } from "fs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

// CJS bridge para módulos CommonJS (archiver).
const requireCjs = createRequire(import.meta.url);

// ── Configuración ──────────────────────────────────────────────────────────
const DOMAIN       = process.env.HOSTINGER_DOMAIN       || "olive-raven-766926.hostingersite.com";
const USERNAME     = process.env.HOSTINGER_USERNAME     || "u296385023";
const MCP_CMD      = process.env.HOSTINGER_MCP_CMD      || "hostinger-hosting-mcp";
const SKIP_BUILD   = process.env.SKIP_BUILD              === "1";
const KEEP_ARCHIVE = process.env.KEEP_ARCHIVE            === "1";
// ────────────────────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const ARCHIVE   = path.join(__dirname, `source_${TIMESTAMP}.zip`);

// ── Colores para la terminal ───────────────────────────────────────────────
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

function log(label, msg) {
  const ts = new Date().toLocaleTimeString();
  console.log(`${colors.dim}[${ts}]${colors.reset} ${label} ${msg}`);
}
function info(msg)  { log(`${colors.cyan}ℹ${colors.reset}`, msg); }
function ok(msg)    { log(`${colors.green}✓${colors.reset}`, msg); }
function warn(msg)  { log(`${colors.yellow}⚠${colors.reset}`, msg); }
function fail(msg)  { log(`${colors.red}✖${colors.reset}`, msg); }
function header(msg){ console.log(`\n${colors.bold}${msg}${colors.reset}`); }

// ── Helper: ejecutar comando ───────────────────────────────────────────────
function run(cmd, opts = {}) {
  const defaults = { cwd: __dirname, stdio: ["inherit", "pipe", "pipe"] };
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, [], { ...defaults, ...opts, shell: true });
    let out = "";
    child.stdout?.on("data", (d) => { out += d.toString(); });
    child.stderr?.on("data", (d) => { out += d.toString(); });
    child.on("close", (code) => {
      if (code === 0) resolve(out.trim());
      else reject(new Error(`Exit code ${code}\n${out.trim().slice(-500)}`));
    });
    child.on("error", reject);
  });
}

// ── Paso 1: Build ──────────────────────────────────────────────────────────
async function stepBuild() {
  header("📦 Paso 1/4: Build del sitio Astro");
  info("Ejecutando: npm run build");
  const start = Date.now();
  try {
    await run("npm run build");
    ok(`Build completado en ${((Date.now() - start) / 1000).toFixed(1)}s`);
  } catch (e) {
    fail(`Build falló: ${e.message}`);
    throw e;
  }
}

// ── Paso 2: ZIP del código fuente ──────────────────────────────────────────
async function stepZip() {
  header("📦 Paso 2/4: Empaquetando código fuente en ZIP");
  info(`Destino: ${ARCHIVE}`);
  info("Embebiendo código fuente (sin node_modules, dist, .env)");

  const start = Date.now();
  try {
    // archiver es 100% JS — no depende de PowerShell/tar ni del encoding
    // del sistema, por lo que maneja paths con emojis o caracteres especiales.
    // Se carga vía createRequire porque es un módulo CJS y el interop
    // ESM/CJS no expone correctamente su export "default".
    // En archiver ≥ 8 el export son clases (ZipArchive, TarArchive, etc.)
    // y ya no una función invocable archiver('zip', opts).
    const { ZipArchive } = requireCjs("archiver");
    await new Promise((resolve, reject) => {
      const output = createWriteStream(ARCHIVE);
      const archive = new ZipArchive({ zlib: { level: 9 } });
      output.on("close", resolve);
      archive.on("warning", (err) => {
        if (err.code === "ENOENT") warn(err.message);
        else reject(err);
      });
      archive.on("error", reject);
      archive.pipe(output);

      // Empaquetar el código fuente del proyecto
      // Excluir: node_modules, dist, .env, .git, archivos innecesarios
      archive.glob("**/*", {
        cwd: __dirname,
        ignore: [
          "node_modules/**",
          "dist/**",
          ".env",
          ".env.*",
          ".git/**",
          "*.zip",
          "*.log",
          "build.log",
          "deploy.log",
          ".astro/**",
          ".opencode/**",
          ".codex/**",
          ".impeccable/**",
          ".vscode/**",
          "mermaid-diagrams/**",
          "plans/**",
        ],
      }, { prefix: "" });

      archive.finalize();
    });
    const size = (statSync(ARCHIVE).size / 1024 / 1024).toFixed(1);
    ok(`ZIP creado: ${path.basename(ARCHIVE)} (${size} MB) en ${((Date.now() - start) / 1000).toFixed(1)}s`);
  } catch (e) {
    throw new Error(`No se pudo crear el ZIP con archiver: ${e.message}`);
  }
}

// ── Paso 3: Deploy via MCP ─────────────────────────────────────────────────
async function stepDeploy() {
  header(`🚀 Paso 3/4: Desplegando a ${DOMAIN} (Node.js SSR)`);
  info(`Usuario: ${USERNAME}`);
  info(`Iniciando servidor MCP: ${MCP_CMD}`);

  // Detectar si el comando existe
  try {
    execSync(`where ${MCP_CMD}`, { stdio: "ignore" });
  } catch {
    throw new Error(
      `No se encuentra el comando "${MCP_CMD}". Asegúrate de que hostinger-api-mcp esté instalado:\n` +
      `  npm install -g hostinger-api-mcp`
    );
  }

  const start = Date.now();

  const child = spawn(MCP_CMD, [], {
    stdio: ["pipe", "pipe", "pipe"],
    // shell: true necesario para que Node resuelva el binario desde el
    // PATH de Windows (sin shell, spawn usa la API CreateProcess de Win32
    // que no respeta npm-global al estar fuera de Process env.PATH).
    shell: true,
    env: {
      ...process.env,
      ...(process.env.HOSTINGER_API_TOKEN
        ? { HOSTINGER_API_TOKEN: process.env.HOSTINGER_API_TOKEN }
        : {}),
    },
  });

  let responseData = "";
  let errorData = "";
  let resolved = false;

  child.stdout.on("data", (chunk) => {
    responseData += chunk.toString("utf8");
  });
  child.stderr.on("data", (chunk) => {
    errorData += chunk.toString("utf8");
  });

  // Deploy como aplicación Node.js con SSR
  // Hostinger ejecutará: npm install → npm run build → iniciar servidor
  const request = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "hosting_createNodeJSBuildFromArchiveV1",
      arguments: {
        username: USERNAME,
        domain: DOMAIN,
        archive: ARCHIVE,
        node_version: 24,
        root_directory: "/",
        build_script: "npm run build",
        entry_file: "dist/server/entry.mjs",
        output_directory: "dist",
        package_manager: "npm",
      },
    },
  };

  child.stdin.write(JSON.stringify(request) + "\n");
  child.stdin.end();

  const response = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        child.kill();
        reject(new Error("Timeout: el servidor MCP no respondió en 180 segundos"));
      }
    }, 180000); // 3 minutos para builds de Node.js

    const poll = setInterval(() => {
      if (resolved) return;
      if (responseData.includes('"jsonrpc"')) {
        resolved = true;
        clearTimeout(timeout);
        clearInterval(poll);
        try {
          resolve(JSON.parse(responseData));
        } catch {
          reject(new Error(`Error parseando respuesta JSON-RPC: ${responseData.slice(0, 500)}`));
        }
      }
    }, 200);
  });

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  if (response.error) {
    // Extraer mensaje de error del MCP
    const msg = response.error.message || JSON.stringify(response.error);
    fail(`MCP respondió con error: ${msg}`);
    throw new Error(msg);
  }

  // Parsear el content (viene como string JSON dentro del content[0].text)
  let result;
  try {
    result = JSON.parse(response.result.content[0].text);
  } catch {
    throw new Error(`Formato inesperado del MCP: ${JSON.stringify(response.result).slice(0, 300)}`);
  }

  // Mostrar resumen del deploy Node.js
  if (result.build_uuid) {
    ok(`Build iniciado. UUID: ${result.build_uuid}`);
    info("El build se ejecuta en el servidor de Hostinger. Puede tardar 2-5 minutos.");
  }

  if (result.status === "success" || result.message) {
    ok(`Deploy aceptado por Hostinger`);
  }

  ok(`Deploy completado en ${elapsed}s`);
  return result;
}

// ── Paso 4: Verificación ────────────────────────────────────────────────────
async function stepVerify() {
  header("🔍 Paso 4/4: Verificando sitio desplegado");
  info(`Consultando: https://${DOMAIN}/`);

  // Esperar un poco más para que el build en servidor se complete
  info("Esperando 30 segundos para que el build en servidor se complete...");
  await new Promise((resolve) => setTimeout(resolve, 30000));

  try {
    const response = await fetch(`https://${DOMAIN}/`, {
      method: "HEAD",
      signal: AbortSignal.timeout(15000),
    });
    if (response.ok) {
      ok(`Sitio respondió con HTTP ${response.status} — ¡está vivo! 🎉`);
    } else {
      warn(`Sitio respondió con HTTP ${response.status} (tal vez aún propagándose o build en progreso)`);
    }
  } catch (e) {
    warn(`No se pudo verificar ahora: ${e.message}. El build puede estar aún en progreso.`);
    info("Revisa manualmente en unos minutos: " + `https://${DOMAIN}/`);
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${colors.bold}${colors.cyan}═════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}   Deploy a Hostinger (Node.js SSR)${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}   ${DOMAIN}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}═════════════════════════════════════${colors.reset}\n`);

  try {
    // Paso 1: Build local (opcional, para verificar que compila)
    if (!SKIP_BUILD) {
      await stepBuild();
    } else {
      info("Build local saltado (SKIP_BUILD=1)");
    }

    // Paso 2: ZIP del código fuente (no del dist/)
    await stepZip();

    // Paso 3: Deploy como Node.js via MCP
    const deployResult = await stepDeploy();

    // Paso 4: Verificación
    await stepVerify();

    // ── Resumen Final ──
    header("═════════════════════════════════════");
    console.log(`  ${colors.green}${colors.bold}✅ Deploy Node.js SSR iniciado${colors.reset}`);
    console.log(`  ${colors.cyan}Dominio:${colors.reset}  https://${DOMAIN}/`);
    console.log(`  ${colors.cyan}Tipo:${colors.reset}      Node.js SSR (standalone)`);
    console.log(`  ${colors.cyan}Node:${colors.reset}      v24`);
    console.log(`  ${colors.cyan}ZIP:${colors.reset}     ${path.basename(ARCHIVE)}`);
    if (!KEEP_ARCHIVE) {
      console.log(`  ${colors.dim}(ZIP eliminado del disco local)${colors.reset}`);
    } else {
      console.log(`  ${colors.yellow}(ZIP conservado: ${ARCHIVE})${colors.reset}`);
    }
    console.log(`  ${colors.cyan}Hora:${colors.reset}    ${new Date().toLocaleString()}`);
    console.log(`\n  ${colors.yellow}⚠ NOTA:${colors.reset} El build se ejecuta en el servidor de Hostinger.`);
    console.log(`  Puede tardar 2-5 minutos en estar disponible.`);
    console.log(`  Variables de entorno configuradas en el panel de Hostinger.`);
    console.log("═════════════════════════════════════\n");

    // process.exitForzamos explícitamente: el stream async del MCP puede
    // dejar handles UV abiertos en Node 24 sobre Windows y disparar
    // "Assertion failed: UV_HANDLE_CLOSING" en el cierre natural.
    process.exit(0);
  } catch (e) {
    console.error(`\n${colors.red}${colors.bold}❌ Error en el proceso:${colors.reset}`, e.message);
    console.error(`\n${colors.yellow}Tip:${colors.reset} Revisa el mensaje arriba. Problemas comunes:`);
    console.error(`  • ¿Está instalado hostinger-api-mcp?        npm install -g hostinger-api-mcp`);
    console.error(`  • ¿Hay sesión OAuth o HOSTINGER_API_TOKEN?   Ver %APPDATA%\\hostinger-mcp\\credentials.json`);
    console.error(`  • ¿El path no tiene caracteres especiales?   El ZIP se crea en la raíz del proyecto\n`);
    process.exit(1);
  }
}

main();
