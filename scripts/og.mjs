// Genera public/og.png (1200×630): marca, titular del hero y el parte con el sello "Ejemplo", con la misma piel que la web.
// Ningún texto por debajo de 24 px. Uso: npm run og
// Si Playwright no encuentra Chromium: npx playwright install chromium

import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
import es from "../content/es.js";

const raiz = new URL("../", import.meta.url);
const fuente = async (f) => (await readFile(new URL(`public/fuentes/${f}`, raiz))).toString("base64");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const [lineaA, ...resto] = es.hero.titulo.split(". ");
const campos = es.ejemplo.campos.filter((c) => ["Motivo", "Cliente", "Teléfono"].includes(c.etiqueta));

const html = `<!doctype html><html lang="${es.idioma}"><head><meta charset="utf-8"><style>
@font-face { font-family: B; src: url(data:font/woff2;base64,${await fuente("bricolage.woff2")}) format("woff2"); font-weight: 200 800; font-stretch: 75% 100%; }
@font-face { font-family: A; src: url(data:font/woff2;base64,${await fuente("atkinson.woff2")}) format("woff2"); font-weight: 200 800; }
@font-face { font-family: M; src: url(data:font/woff2;base64,${await fuente("plex-mono-500.woff2")}) format("woff2"); font-weight: 500; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; background: #ede6d9; color: #1c1813; font-family: A; -webkit-font-smoothing: antialiased; }
.lienzo { position: relative; height: 100%; padding: 64px; display: grid; grid-template-columns: 600px 1fr; gap: 48px; align-items: center; }
.marca { display: flex; align-items: center; gap: 12px; font: 700 40px/1 B; }
.chapa { width: 28px; height: 28px; border-radius: 2px; background: #1c1813; }
h1 { margin-top: 44px; font: 700 68px/1.04 B; }
h1 span { display: block; }
.linea { margin-top: 32px; padding-top: 24px; border-top: 2px solid #c4551a; font-size: 28px; line-height: 1.3; max-width: 520px; }
.parte { position: relative; padding: 32px; background: #fbf7ee; border: 1px solid #51493e; border-radius: 4px; font: 500 26px/1.35 M; }
.prioridad { display: inline-block; padding: 2px 12px; border-radius: 2px; background: #c4551a; color: #fff; font: 700 26px/1.25 B; text-transform: uppercase; }
.raya { margin: 24px 0 20px; border-top: 1px solid #c9bda9; }
dl { display: grid; gap: 14px; }
dl div { display: grid; grid-template-columns: 128px 1fr; gap: 12px; align-items: baseline; }
dt { font: 600 24px/1.2 B; color: #51493e; }
dd { margin: 0; }
.sello { position: absolute; top: 32px; right: 32px; padding: 0 12px; border: 2px solid currentColor; border-radius: 2px; color: rgb(81 73 62 / 0.6); font: 700 32px/1.25 B; text-transform: uppercase; }
</style></head><body><div class="lienzo">
  <div>
    <div class="marca"><span class="chapa"></span>${esc(es.marca)}</div>
    <h1><span>${esc(lineaA)}.</span><span>${esc(resto.join(". "))}</span></h1>
    <p class="linea">${esc(es.visual.llega)}.</p>
  </div>
  <div class="parte">
    <span class="sello">${esc(es.ejemplo.sello)}</span>
    <span class="prioridad">${esc(es.ejemplo.prioridad)}</span>
    <div class="raya"></div>
    <dl>${campos.map((c) => `<div><dt>${esc(c.etiqueta)}</dt><dd>${esc(c.valor)}</dd></div>`).join("")}</dl>
  </div>
</div></body></html>`;

const navegador = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await pagina.setContent(html, { waitUntil: "load" });
await pagina.evaluate(() => document.fonts.ready);

// Comprobación: ningún texto visible por debajo de 24 px
const pequenos = await pagina.evaluate(() =>
  [...document.querySelectorAll("body *")]
    .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
    .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 24)
    .map((el) => `${el.tagName} ${getComputedStyle(el).fontSize}`)
);
if (pequenos.length) throw new Error("Texto por debajo de 24 px: " + pequenos.join(", "));

await pagina.screenshot({ path: new URL("public/og.png", raiz).pathname });
await navegador.close();
console.log("public/og.png generada (1200×630, textos ≥ 24 px)");
