// Comprueba que todos los enlaces internos de dist/ resuelven: rutas, archivos y anclas (#id).
// Uso: npm run build && npm run enlaces

import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;

async function htmls(dir) {
  const salida = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) salida.push(...(await htmls(ruta)));
    else if (e.name.endsWith(".html")) salida.push(ruta);
  }
  return salida;
}

const existe = async (ruta) => stat(ruta).then((s) => s.isFile(), () => false);
const archivoDe = (ruta) => join(DIST, ruta.endsWith("/") ? ruta + "index.html" : ruta);
const urlDe = (archivo) => "/" + relative(DIST, archivo).replace(/index\.html$/, "");

const paginas = await htmls(DIST);
const ids = new Map();
for (const p of paginas) {
  const html = await readFile(p, "utf8");
  ids.set(urlDe(p), new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

let fallos = 0;
let total = 0;
for (const p of paginas) {
  const html = await readFile(p, "utf8");
  const origen = urlDe(p);
  const refs = [...html.matchAll(/\s(?:href|src|srcset)="([^"]+)"/g)].flatMap((m) => m[1].split(",").map((x) => x.trim().split(/\s+/)[0]));
  for (const ref of new Set(refs)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
    total++;
    const url = new URL(ref, "http://x" + origen);
    const ruta = decodeURIComponent(url.pathname);
    if (!(await existe(archivoDe(ruta)))) {
      fallos++;
      console.log(`✗ ${origen} → ${ref} (no existe)`);
      continue;
    }
    if (url.hash) {
      const ancla = decodeURIComponent(url.hash.slice(1));
      const destino = ruta.endsWith("/") ? ruta : ruta.replace(/index\.html$/, "");
      if (!ids.get(destino)?.has(ancla)) {
        fallos++;
        console.log(`✗ ${origen} → ${ref} (no hay id="${ancla}")`);
      }
    }
  }
}
console.log(`${paginas.length} páginas, ${total} enlaces internos comprobados. ${fallos ? fallos + " rotos." : "Ninguno roto."}`);
process.exitCode = fallos ? 1 : 0;
