// Genera public/og.png (1200×630) a partir de public/img/hero.jpg, con el titular del hero
// en una franja blanca inferior. Ningún texto por debajo de 24 px. Uso: npm run og
// Si Playwright no encuentra Chromium: npx playwright install chromium

import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
import es from "../content/es.js";

const raiz = new URL("../", import.meta.url);
const b64 = async (ruta) => (await readFile(new URL(ruta, raiz))).toString("base64");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const { titulo, tituloAcento } = es.hero;
const i = titulo.toLowerCase().indexOf(tituloAcento.toLowerCase());
const tituloHtml =
  i < 0
    ? esc(titulo)
    : `${esc(titulo.slice(0, i))}<span class="acento">${esc(titulo.slice(i, i + tituloAcento.length))}</span>${esc(titulo.slice(i + tituloAcento.length))}`;

const html = `<!doctype html><html lang="${es.idioma}"><head><meta charset="utf-8"><style>
@font-face { font-family: D; src: url(data:font/woff2;base64,${await b64("public/fuentes/special-gothic-condensed-one.woff2")}) format("woff2"); }
@font-face { font-family: T; src: url(data:font/woff2;base64,${await b64("public/fuentes/instrument-sans.woff2")}) format("woff2"); font-weight: 400 700; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; background: #fff; -webkit-font-smoothing: antialiased; }
.foto { height: 462px; background: url(data:image/jpeg;base64,${await b64("public/img/hero.jpg")}) center 0% / cover; }
.franja { display: flex; align-items: center; justify-content: space-between; gap: 32px; height: 168px; padding: 0 56px; background: #fff; border-top: 4px solid #3a6bb5; }
h1 { font: 400 64px/1.05 D; text-transform: uppercase; letter-spacing: -0.02em; color: #1c1813; }
.acento { color: #3a6bb5; }
.marca { display: flex; align-items: center; gap: 12px; flex: none; font: 700 36px/1 T; color: #1c1813; }
.chapa { width: 26px; height: 26px; border-radius: 3px; background: #3a6bb5; }
</style></head><body>
  <div class="foto"></div>
  <div class="franja"><h1>${tituloHtml}</h1><div class="marca"><span class="chapa"></span>${esc(es.marca)}</div></div>
</body></html>`;

const navegador = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await pagina.setContent(html, { waitUntil: "load" });
await pagina.evaluate(() => document.fonts.ready);

const pequenos = await pagina.evaluate(() =>
  [...document.querySelectorAll("body *")]
    .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
    .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 24)
    .map((el) => `${el.tagName} ${getComputedStyle(el).fontSize}`)
);
if (pequenos.length) throw new Error("Texto por debajo de 24 px: " + pequenos.join(", "));
const desborda = await pagina.evaluate(() => document.querySelector("h1").scrollWidth > document.querySelector("h1").clientWidth + 1);
if (desborda) throw new Error("El titular no cabe en la franja");

await pagina.screenshot({ path: new URL("public/og.png", raiz).pathname });
await navegador.close();
console.log("public/og.png generada (1200×630, textos ≥ 24 px)");
