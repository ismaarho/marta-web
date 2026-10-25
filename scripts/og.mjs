// Genera public/og.png (1200×630): marca, titular del hero y el parte con el sello "Ejemplo".
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
.lienzo { position: relative; height: 100%; padding: 56px 64px; display: grid; grid-template-columns: 590px 1fr; gap: 40px; }
.marca { display: flex; align-items: center; gap: 12px; font: 800 44px/1 B; letter-spacing: -0.03em; }
.chapa { width: 34px; height: 34px; border-radius: 4px; background: #ee6a1f; box-shadow: inset 0 0 0 3px #1c1813; rotate: -8deg; }
h1 { margin-top: 48px; font: 780 80px/0.95 B; font-stretch: 92%; letter-spacing: -0.035em; }
h1 span { display: block; }
h1 span + span { margin-top: 8px; }
.linea { margin-top: 36px; font-size: 28px; line-height: 1.3; max-width: 520px; }
.parte { position: relative; align-self: center; margin-top: 8px; padding: 30px 30px 36px; background: #fbf7ee; border-radius: 8px 8px 0 0; rotate: 2deg;
  box-shadow: 0 2px 2px rgb(28 24 19 / .08), 0 12px 24px -6px rgb(28 24 19 / .18), 0 40px 60px -24px rgb(28 24 19 / .35); font: 500 26px/1.35 M; }
.parte::after { content: ""; position: absolute; left: 0; right: 0; bottom: -9px; height: 18px; background: radial-gradient(circle at 9px 18px, #ede6d9 8px, transparent 8.5px) 0 0 / 18px 18px repeat-x; }
.prioridad { display: inline-block; padding: 4px 12px; border-radius: 5px; background: #ee6a1f; font: 760 26px/1.2 B; font-stretch: 80%; letter-spacing: .06em; text-transform: uppercase; }
.raya { margin: 22px 0 18px; border-top: 2px dashed #c9bda9; }
dl { display: grid; gap: 14px; }
dl div { display: grid; grid-template-columns: 128px 1fr; gap: 12px; align-items: baseline; }
dt { font: 600 24px/1.2 B; font-stretch: 75%; color: #51493e; }
dd { margin: 0; }
.sello { position: absolute; top: 22px; right: 22px; padding: 2px 14px; border: 4px solid #2a241d; border-radius: 8px; box-shadow: inset 0 0 0 3px #fbf7ee, inset 0 0 0 5px #2a241d;
  color: #2a241d; font: 800 40px/1.15 B; font-stretch: 75%; letter-spacing: .08em; text-transform: uppercase; rotate: -9deg; }
.banda { position: absolute; left: 0; right: 0; bottom: 0; height: 14px; background: #ee6a1f; }
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
  <div class="banda"></div>
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
