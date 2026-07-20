#!/usr/bin/env node

/**
 * deploy-hostinger.mjs
 *
 * Builds the Astro site, ZIPs the output, and deploys it to Hostinger
 * via the hostinger-hosting-mcp server (JSON-RPC over stdio).
 *
 * Uso:
 *   node deploy-hostinger.mjs
 *   npm run deploy
 *
 * Variables de entorno:
 *   HOSTINGER_DOMAIN     — dominio en Hostinger (default: orangered-deer-742907.hostingersite.com)
 *   HOSTINGER_API_TOKEN  — token de API (opcional, si no está definido usa OAuth guardado)
 *   HOSTINGER_MCP_CMD    — comando del MCP (default: hostinger-hosting-mcp)
 *   SKIP_BUILD           — si=1 salta el build (default: 0)
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
const DOMAIN       = process.env.HOSTINGER_DOMAIN       || "orangered-deer-742907.hostingersite.com";
const MCP_CMD      = process.env.HOSTINGER_MCP_CMD      || "hostinger-hosting-mcp";
const SKIP_BUILD   = process.env.SKIP_BUILD              === "1";
const KEEP_ARCHIVE = process.env.KEEP_ARCHIVE            === "1";
// ────────────────────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR  = path.join(__dirname, "dist");
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const ARCHIVE   = path.join(__dirname, `dist_${TIMESTAMP}.zip`);

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

// ── Paso 2: ZIP ────────────────────────────────────────────────────────────
async function stepZip() {
  header("📦 Paso 2/4: Empaquetando dist/ en ZIP");
  info(`Destino: ${ARCHIVE}`);

  if (!existsSync(DIST_DIR)) {
    throw new Error(`No existe la carpeta dist/ en ${DIST_DIR}. Ejecuta 'npm run build' primero.`);
  }

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
      archive.directory(DIST_DIR, false);
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
  header(`🚀 Paso 3/4: Desplegando a ${DOMAIN}`);
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

  const request = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "hosting_deployStaticWebsite",
      arguments: {
        domain: DOMAIN,
        archivePath: ARCHIVE,
        removeArchive: !KEEP_ARCHIVE,
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
        reject(new Error("Timeout: el servidor MCP no respondió en 90 segundos"));
      }
    }, 90000);

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

  // Mostrar resumen
  const steps = [];
  if (result.upload?.status === "success") {
    steps.push("✓ ZIP subido");
    ok("ZIP subido al servidor");
  } else {
    steps.push(`✖ Upload: ${result.upload?.error || "falló"}`);
    fail(`Upload falló: ${result.upload?.error || "desconocido"}`);
  }

  if (result.deploy?.status === "success") {
    steps.push("✓ Deploy aceptado");
    ok("Deploy aceptado por Hostinger");
  } else {
    steps.push(`✖ Deploy: ${result.deploy?.error || "falló"}`);
    fail(`Deploy falló: ${result.deploy?.error || "desconocido"}`);
  }

  if (result.removeArchive?.status === "success") {
    steps.push("✓ ZIP local eliminado");
  }

  ok(`Deploy completado en ${elapsed}s`);
  return result;
}

// ── Paso 4: Verificación ────────────────────────────────────────────────────
async function stepVerify() {
  header("🔍 Paso 4/4: Verificando sitio desplegado");
  info(`Consultando: https://${DOMAIN}/`);

  try {
    const response = await fetch(`https://${DOMAIN}/`, {
      method: "HEAD",
      signal: AbortSignal.timeout(15000),
    });
    if (response.ok) {
      ok(`Sitio respondió con HTTP ${response.status} — ¡está vivo! 🎉`);
    } else {
      warn(`Sitio respondió con HTTP ${response.status} (tal vez aún propagándose)`);
    }
  } catch (e) {
    warn(`No se pudo verificar ahora: ${e.message}. Revisa manualmente en unos minutos.`);
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${colors.bold}${colors.cyan}═════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}   Deploy a Hostinger${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}   ${DOMAIN}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}═════════════════════════════════════${colors.reset}\n`);

  const steps = [];

  try {
    // Paso 1
    if (!SKIP_BUILD && existsSync(DIST_DIR)) {
      // Si dist/ ya existe, preguntar si quiere rebuild (o forzar con variable)
      // Por simplicidad, siempre rebuild si no se salta explícitamente
      await stepBuild();
    } else if (!SKIP_BUILD) {
      await stepBuild();
    } else {
      info("Build saltado (SKIP_BUILD=1)");
    }

    // Paso 2
    await stepZip();

    // Paso 3
    const deployResult = await stepDeploy();

    // Paso 4
    await stepVerify();

    // ── Resumen Final ──
    const uploadOk   = deployResult.upload?.status   === "success";
    const deployOk   = deployResult.deploy?.status   === "success";

    header("═════════════════════════════════════");
    if (uploadOk && deployOk) {
      console.log(`  ${colors.green}${colors.bold}✅ Deploy exitoso${colors.reset}`);
    } else if (uploadOk) {
      console.log(`  ${colors.yellow}${colors.bold}⚠ Deploy parcial (upload OK, deploy con problemas)${colors.reset}`);
    } else {
      console.log(`  ${colors.red}${colors.bold}❌ Deploy falló${colors.reset}`);
    }
    console.log(`  ${colors.cyan}Dominio:${colors.reset}  https://${DOMAIN}/`);
    console.log(`  ${colors.cyan}ZIP:${colors.reset}     ${path.basename(ARCHIVE)}`);
    if (!KEEP_ARCHIVE) {
      console.log(`  ${colors.dim}(ZIP eliminado del disco local)${colors.reset}`);
    } else {
      console.log(`  ${colors.yellow}(ZIP conservado: ${ARCHIVE})${colors.reset}`);
    }
    console.log(`  ${colors.cyan}Hora:${colors.reset}    ${new Date().toLocaleString()}`);
    console.log("═════════════════════════════════════\n");

    // process.exitForzamos explícitamente: el stream async del MCP puede
    // dejar handles UV abiertos en Node 24 sobre Windows y disparar
    // "Assertion failed: UV_HANDLE_CLOSING" en el cierre natural.
    process.exit(uploadOk && deployOk ? 0 : 1);
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
