#!/usr/bin/env node

/**
 * deploy-static-temp.mjs
 * Deploy del dist/ pre-compilado como sitio estático
 */

import { spawn, execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOMAIN = "olive-raven-766926.hostingersite.com";
const ARCHIVE = path.join(__dirname, "dist_deploy.zip");
const MCP_CMD = "hostinger-hosting-mcp";

console.log(`\n🚀 Deploy estático a ${DOMAIN}\n`);

if (!existsSync(ARCHIVE)) {
  console.error(`❌ No existe ${ARCHIVE}. Ejecuta 'npm run build' primero.`);
  process.exit(1);
}

const child = spawn(MCP_CMD, [], {
  stdio: ["pipe", "pipe", "pipe"],
  shell: true,
});

let responseData = "";
child.stdout.on("data", (chunk) => { responseData += chunk.toString("utf8"); });
child.stderr.on("data", (chunk) => { responseData += chunk.toString("utf8"); });

const request = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "hosting_deployStaticWebsite",
    arguments: {
      domain: DOMAIN,
      archivePath: ARCHIVE,
      removeArchive: false,
    },
  },
};

child.stdin.write(JSON.stringify(request) + "\n");
child.stdin.end();

const response = await new Promise((resolve, reject) => {
  const timeout = setTimeout(() => {
    child.kill();
    console.log("\n--- Respuesta completa del MCP ---");
    console.log(responseData);
    console.log("--- Fin respuesta ---\n");
    reject(new Error("Timeout: MCP no respondió en 120 segundos"));
  }, 120000);

  const poll = setInterval(() => {
    // Buscar el JSON-RPC response en la salida (puede haber logs antes)
    const jsonMatch = responseData.match(/\{"jsonrpc":"2\.0"[^}]*\}/);
    if (jsonMatch) {
      clearTimeout(timeout);
      clearInterval(poll);
      try {
        resolve(JSON.parse(jsonMatch[0]));
      } catch {
        // Intentar parsear toda la respuesta
        try {
          const lastJson = responseData.lastIndexOf('{"jsonrpc"');
          if (lastJson >= 0) {
            resolve(JSON.parse(responseData.slice(lastJson)));
          } else {
            reject(new Error(`Error parseando respuesta: ${responseData.slice(-500)}`));
          }
        } catch {
          reject(new Error(`Error parseando respuesta: ${responseData.slice(-500)}`));
        }
      }
    }
  }, 200);
});

if (response.error) {
  console.error(`❌ Error: ${response.error.message}`);
  process.exit(1);
}

try {
  const result = JSON.parse(response.result.content[0].text);
  console.log("✅ Deploy completado:");
  console.log(`   Upload: ${result.upload?.status || "unknown"}`);
  console.log(`   Deploy: ${result.deploy?.status || "unknown"}`);
  console.log(`\n🌐 Sitio: https://${DOMAIN}/`);
} catch {
  console.log("Respuesta:", response.result);
}

process.exit(0);
