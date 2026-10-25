// Capturas de revisión a 375 y 1280 px, con comprobaciones básicas, en varias páginas.
// Uso: npm run build && npm run capturas   (salen en capturas/)
// Si Playwright no encuentra Chromium: npx playwright install chromium

import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";
import { WHATSAPP } from "../content/es.js";

const DIST = new URL("../dist/", import.meta.url).pathname;
const SALIDA = new URL("../capturas/", import.meta.url).pathname;
const TIPOS = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain" };
const PAGINAS = ["/", "/como-funciona/", "/sectores/", "/sectores/fontaneria/", "/sectores/mudanzas/", "/clientes/"];

const servidor = createServer(async (req, res) => {
  let ruta = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^\/+/, "");
  if (ruta === "" || ruta.endsWith("/")) ruta += "index.html";
  try {
    res.writeHead(200, { "content-type": TIPOS[extname(ruta)] ?? "application/octet-stream" });
    res.end(await readFile(join(DIST, ruta)));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => servidor.listen(0, r));
const base = `http://localhost:${servidor.address().port}`;
await mkdir(SALIDA, { recursive: true });

const navegador = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
let fallos = 0;
const mal = (m) => (fallos++, console.log("✗ " + m));
const bien = (m) => console.log("✓ " + m);
const nombre = (ruta) => (ruta === "/" ? "inicio" : ruta.replace(/^\/|\/$/g, "").replaceAll("/", "-"));

for (const ruta of PAGINAS) {
  for (const ancho of [375, 1280]) {
    const pagina = await navegador.newPage({ viewport: { width: ancho, height: ancho < 600 ? 812 : 800 } });
    await pagina.goto(base + ruta, { waitUntil: "networkidle" });
    await pagina.waitForTimeout(400);
    const id = `${nombre(ruta)}-${ancho}`;
    await pagina.screenshot({ path: `${SALIDA}${id}-pantalla.png` });
    await pagina.screenshot({ path: `${SALIDA}${id}.png`, fullPage: true });

    const d = await pagina.evaluate(() => {
      const ancho = document.documentElement.clientWidth;
      // Elementos que se salen de la ventana, salvo los recortados a propósito (carrusel)
      const desbordan = [...document.querySelectorAll("body *")]
        .filter((el) => {
          if (el.closest(".sr, .saltar, .carrusel__escena")) return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > ancho + 1 || r.left < -1);
        })
        .map((el) => el.tagName.toLowerCase() + (el.classList[0] ? "." + el.classList[0] : ""));
      return {
        scroll: document.documentElement.scrollWidth,
        ancho,
        desbordan: [...new Set(desbordan)].slice(0, 8),
        whatsapp: [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.getAttribute("href")),
        prohibidos: document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"], form').length,
        vacios: [...document.querySelectorAll("a")].filter((a) => ["#", ""].includes(a.getAttribute("href"))).length,
        sellos: [...document.querySelectorAll(".sello")].filter((s) => s.getBoundingClientRect().width > 0).length,
      };
    });
    const p = `${ruta} @${ancho}`;
    d.scroll > d.ancho ? mal(`${p}: scroll horizontal (${d.scroll} > ${d.ancho})`) : bien(`${p}: sin scroll horizontal`);
    d.desbordan.length ? mal(`${p}: se salen ${d.desbordan.join(", ")}`) : bien(`${p}: ningún elemento se sale`);
    d.whatsapp.length && d.whatsapp.every((h) => h === WHATSAPP) ? bien(`${p}: ${d.whatsapp.length} enlaces a WhatsApp con la URL exacta`) : mal(`${p}: enlaces a WhatsApp ausentes o distintos`);
    d.prohibidos ? mal(`${p}: hay tel:, mailto: o formularios`) : null;
    d.vacios ? mal(`${p}: ${d.vacios} enlaces "#" o vacíos`) : null;

    if (ruta === "/" && ancho < 600) {
      // Menú móvil: abre, despliega Sectores, Escape cierra y devuelve el foco
      await pagina.click(".nav__boton");
      await pagina.waitForTimeout(200);
      const abierto = await pagina.isVisible("#nav-lista > li >> nth=0");
      await pagina.click('.desplegable__boton[aria-controls="menu-sectores"]');
      await pagina.waitForTimeout(200);
      const sectores = await pagina.isVisible('#menu-sectores a >> nth=0');
      await pagina.screenshot({ path: `${SALIDA}menu-375.png` });
      await pagina.keyboard.press("Escape");
      await pagina.keyboard.press("Escape");
      const cerrado = !(await pagina.isVisible("#nav-lista > li >> nth=0"));
      const foco = await pagina.evaluate(() => document.activeElement?.classList.contains("nav__boton"));
      abierto && sectores && cerrado && foco ? bien("Menú móvil: abre, despliega Sectores, Escape cierra y el foco vuelve") : mal(`Menú móvil: abierto=${abierto} sectores=${sectores} cerrado=${cerrado} foco=${foco}`);
    }
    if (ruta === "/" && ancho > 600) {
      // Desplegable de escritorio con teclado
      await pagina.focus('.desplegable__boton[aria-controls="menu-sectores"]');
      await pagina.keyboard.press("Enter");
      await pagina.waitForTimeout(200);
      const visible = await pagina.isVisible("#menu-sectores a >> nth=0");
      await pagina.screenshot({ path: `${SALIDA}desplegable-1280.png` });
      await pagina.keyboard.press("Escape");
      const cerrado = !(await pagina.isVisible("#menu-sectores a >> nth=0"));
      visible && cerrado ? bien("Desplegable de escritorio: abre con Enter y cierra con Escape") : mal(`Desplegable: visible=${visible} cerrado=${cerrado}`);
    }
    if (ruta === "/sectores/") {
      // El carrusel avanza solo (sin movimiento reducido)
      const antes = await pagina.getAttribute('.carrusel__item[data-pos="0"]', "data-indice");
      await pagina.mouse.move(1, 1);
      await pagina.waitForTimeout(4600);
      const despues = await pagina.getAttribute('.carrusel__item[data-pos="0"]', "data-indice");
      antes !== despues ? bien(`${p}: el carrusel avanza solo (${antes} → ${despues})`) : mal(`${p}: el carrusel no avanza`);
    }
    await pagina.close();
  }
}

// Con movimiento reducido el carrusel no se mueve
const quieta = await navegador.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
await quieta.goto(base + "/sectores/", { waitUntil: "networkidle" });
const a = await quieta.getAttribute('.carrusel__item[data-pos="0"]', "data-indice");
await quieta.waitForTimeout(4600);
const b = await quieta.getAttribute('.carrusel__item[data-pos="0"]', "data-indice");
a === b ? bien("Con movimiento reducido, el carrusel no se mueve") : mal("Con movimiento reducido, el carrusel se mueve");
await quieta.close();

await navegador.close();
servidor.close();
console.log(fallos ? `\n${fallos} comprobaciones fallidas.` : "\nTodo correcto. Capturas en capturas/");
process.exitCode = fallos ? 1 : 0;
