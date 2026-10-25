// Genera las imágenes OG (1200×630) de todas las páginas en public/og/.
// Inicio, cómo funciona y clientes: foto de hero.jpg con el titular en una franja blanca.
// Sectores: mosaico de fotos. Cada sector: su foto a la izquierda y el titular a la derecha.
// Ningún texto por debajo de 24 px. Uso: npm run og
// Si Playwright no encuentra Chromium: npx playwright install chromium

import { readFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { chromium } from "playwright";
import { imagenesOg, t } from "../src/rutas.js";

const raiz = new URL("../", import.meta.url);
const b64 = async (ruta) => (await readFile(new URL(ruta.replace(/^\//, "public/"), raiz))).toString("base64");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const conAcento = (texto, acento) => {
  const i = acento ? texto.toLowerCase().indexOf(acento.toLowerCase()) : -1;
  return i < 0 ? esc(texto) : `${esc(texto.slice(0, i))}<span class="acento">${esc(texto.slice(i, i + acento.length))}</span>${esc(texto.slice(i + acento.length))}`;
};

const estilos = `
@font-face { font-family: D; src: url(data:font/woff2;base64,${await b64("/fuentes/special-gothic-condensed-one.woff2")}) format("woff2"); }
@font-face { font-family: T; src: url(data:font/woff2;base64,${await b64("/fuentes/instrument-sans.woff2")}) format("woff2"); font-weight: 400 700; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; background: #fff; color: #1c1813; -webkit-font-smoothing: antialiased; }
h1 { font: 400 64px/1.05 D; text-transform: uppercase; letter-spacing: -0.02em; }
.acento { color: #3a6bb5; }
.marca { display: flex; align-items: center; gap: 12px; flex: none; font: 700 36px/1 T; }
.simbolo { width: 38px; height: 38px; color: #3a6bb5; }
.franja { display: flex; align-items: center; justify-content: space-between; gap: 32px; height: 168px; padding: 0 56px; border-top: 4px solid #3a6bb5; }
.foto { height: 462px; background-position: center 0%; background-size: cover; }
.mosaico { display: flex; gap: 8px; height: 462px; padding: 0; background: #f1ece3; }
.mosaico div { flex: 1; background-size: cover; background-position: center 30%; }
.sector { display: grid; grid-template-columns: 504px 1fr; height: 630px; }
.sector .lado { display: flex; flex-direction: column; justify-content: center; gap: 28px; padding: 56px; border-left: 4px solid #3a6bb5; }
.sector .linea { font: 600 30px/1.2 T; color: #4a4237; }
.sector h1 { font-size: 72px; }
`;

const plantillas = {
  foto: async (x) => `<div class="foto" style="background-image:url(data:image/jpeg;base64,${await b64(x.foto)})"></div>
    <div class="franja"><h1>${conAcento(x.titulo, x.acento)}</h1><div class="marca"><svg class="simbolo" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 21V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4H8z"/><path d="M8 10.5h5" stroke-linecap="round"/></g><circle cx="16.5" cy="10.5" r="1.5" fill="currentColor"/></svg>${esc(t.marca)}</div></div>`,
  mosaico: async (x) => `<div class="mosaico">${(await Promise.all(x.fotos.map(b64))).map((f) => `<div style="background-image:url(data:image/jpeg;base64,${f})"></div>`).join("")}</div>
    <div class="franja"><h1>${conAcento(x.titulo, x.acento)}</h1><div class="marca"><svg class="simbolo" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 21V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4H8z"/><path d="M8 10.5h5" stroke-linecap="round"/></g><circle cx="16.5" cy="10.5" r="1.5" fill="currentColor"/></svg>${esc(t.marca)}</div></div>`,
  sector: async (x) => `<div class="sector"><div class="foto" style="height:630px;background-position:center 30%;background-image:url(data:image/jpeg;base64,${await b64(x.foto)})"></div>
    <div class="lado"><div class="marca"><svg class="simbolo" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 21V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4H8z"/><path d="M8 10.5h5" stroke-linecap="round"/></g><circle cx="16.5" cy="10.5" r="1.5" fill="currentColor"/></svg>${esc(t.marca)}</div><h1>${conAcento(x.titulo, x.acento)}</h1><p class="linea">${esc(x.linea)}</p></div></div>`,
};

const navegador = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });

for (const x of imagenesOg()) {
  await pagina.setContent(`<!doctype html><html lang="${t.idioma}"><head><meta charset="utf-8"><style>${estilos}</style></head><body>${await plantillas[x.tipo](x)}</body></html>`, { waitUntil: "load" });
  await pagina.evaluate(() => document.fonts.ready);
  const problemas = await pagina.evaluate(() => {
    const textos = [...document.querySelectorAll("body *")].filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
    return [
      ...textos.filter((el) => parseFloat(getComputedStyle(el).fontSize) < 24).map((el) => `${el.tagName} ${getComputedStyle(el).fontSize} < 24 px`),
      ...textos.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => `${el.tagName} no cabe`),
    ];
  });
  if (problemas.length) throw new Error(`${x.archivo}: ${problemas.join(", ")}`);
  const destino = new URL(`public/${x.archivo}`, raiz).pathname;
  await mkdir(dirname(destino), { recursive: true });
  await pagina.screenshot({ path: destino, type: "jpeg", quality: 82 });
  console.log(`public/${x.archivo}`);
}

await navegador.close();
console.log("Imágenes OG generadas (1200×630, textos ≥ 24 px)");
