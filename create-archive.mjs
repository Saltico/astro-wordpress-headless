#!/usr/bin/env node
/**
 * create-archive.mjs
 * Crea un ZIP del código fuente con permisos Unix explícitos (0644/0755)
 * para evitar "Permission denied (os error 13)" en el build de Hostinger.
 */
import { createWriteStream, statSync } from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const requireCjs = createRequire(import.meta.url);
const { ZipArchive } = requireCjs("archiver");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "source_deploy.zip");

const output = createWriteStream(OUT);
const archive = new ZipArchive({ zlib: { level: 9 } });

output.on("close", () => {
  const mb = (archive.pointer() / 1024 / 1024).toFixed(1);
  console.log(`OK: ${path.basename(OUT)} (${mb} MB)`);
});
archive.on("warning", (e) => console.warn("WARN:", e.message));
archive.on("error", (e) => { console.error("ERR:", e.message); process.exit(1); });
archive.pipe(output);

// Archivos raíz necesarios para el build
const rootFiles = [
  "astro.config.mjs",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
];
for (const f of rootFiles) {
  const p = path.join(__dirname, f);
  try {
    statSync(p);
    archive.file(p, { name: f, mode: 0o644 });
  } catch {
    console.warn(`skip (no existe): ${f}`);
  }
}

// Directorios de código fuente con permisos correctos
archive.directory(path.join(__dirname, "src"), "src", (entry) => {
  entry.mode = entry.stats?.isDirectory?.() ? 0o755 : 0o644;
  return entry;
});
archive.directory(path.join(__dirname, "public"), "public", (entry) => {
  entry.mode = entry.stats?.isDirectory?.() ? 0o755 : 0o644;
  return entry;
});

archive.finalize();
