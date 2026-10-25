// Capturas de revisión a 375 y 1280 px, con comprobaciones básicas.
// Uso: npm run build && npm run capturas   (salen en capturas/)
// Si Playwright no encuentra Chromium: npx playwright install chromium

import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";
import { WHATSAPP } from "../content/es.js";

const DIST = new URL("../dist/", import.meta.url).pathname;
const SALIDA = new URL("../capturas/", import.meta.url).pathname;
const TIPOS = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2" };

const servidor = createServer(async (req, res) => {
  const ruta = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^\/+/, "");
  try {
    const archivo = join(DIST, ruta.endsWith("/") || ruta === "" ? ruta + "index.html" : ruta);
    res.writeHead(200, { "content-type": TIPOS[extname(archivo)] ?? "application/octet-stream" });
    res.end(await readFile(archivo));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => servidor.listen(0, r));
const url = `http://localhost:${servidor.address().port}/`;
await mkdir(SALIDA, { recursive: true });

const navegador = await chromium.launch(
  process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}
);
let fallos = 0;
const mal = (m) => (fallos++, console.log("✗ " + m));
const bien = (m) => console.log("✓ " + m);

for (const ancho of [375, 1280]) {
  const pagina = await navegador.newPage({ viewport: { width: ancho, height: ancho < 600 ? 812 : 800 } });
  await pagina.goto(url, { waitUntil: "networkidle" });
  await pagina.waitForTimeout(3800); // deja terminar el gesto del hero

  await pagina.screenshot({ path: `${SALIDA}hero-${ancho}.png` });
  await pagina.screenshot({ path: `${SALIDA}pagina-${ancho}.png`, fullPage: true });

  const datos = await pagina.evaluate(() => {
    const ancho = document.documentElement.clientWidth;
    const desbordan = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > ancho + 1 || r.left < -1) && !el.closest(".sr, .saltar");
      })
      .map((el) => el.tagName.toLowerCase() + (el.className ? "." + String(el.className).split(" ")[0] : ""));
    return {
      scroll: document.documentElement.scrollWidth,
      ancho,
      desbordan: [...new Set(desbordan)].slice(0, 10),
      whatsapp: [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.getAttribute("href")),
      tel: document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').length,
      vacios: [...document.querySelectorAll("a")].filter((a) => ["#", ""].includes(a.getAttribute("href"))).length,
      selloVisible: [...document.querySelectorAll(".sello")].map((s) => {
        const r = s.getBoundingClientRect();
        const cs = getComputedStyle(s);
        return r.width > 0 && cs.visibility !== "hidden" && cs.display !== "none";
      }),
    };
  });

  datos.scroll > datos.ancho ? mal(`${ancho}px: scroll horizontal (${datos.scroll} > ${datos.ancho})`) : bien(`${ancho}px: sin scroll horizontal`);
  datos.desbordan.length ? mal(`${ancho}px: se salen ${datos.desbordan.join(", ")}`) : bien(`${ancho}px: ningún elemento se sale`);
  datos.whatsapp.every((h) => h === WHATSAPP) ? bien(`${ancho}px: ${datos.whatsapp.length} enlaces a WhatsApp, todos con la URL exacta`) : mal(`${ancho}px: hay enlaces a WhatsApp distintos`);
  datos.tel ? mal(`${ancho}px: hay enlaces tel: o mailto:`) : bien(`${ancho}px: sin tel: ni mailto:`);
  datos.vacios ? mal(`${ancho}px: ${datos.vacios} enlaces "#" o vacíos`) : bien(`${ancho}px: sin enlaces vacíos`);
  datos.selloVisible.every(Boolean) ? bien(`${ancho}px: sello "Ejemplo" visible en ${datos.selloVisible.length} partes`) : mal(`${ancho}px: algún sello no se ve`);

  if (ancho < 600) {
    // Menú móvil: abre, enlaces visibles, Escape cierra y devuelve el foco
    await pagina.click(".nav__boton");
    await pagina.waitForTimeout(250);
    await pagina.screenshot({ path: `${SALIDA}menu-${ancho}.png` });
    const abierto = await pagina.isVisible("#nav-lista a");
    await pagina.keyboard.press("Escape");
    const cerrado = !(await pagina.isVisible("#nav-lista a"));
    const foco = await pagina.evaluate(() => document.activeElement?.classList.contains("nav__boton"));
    abierto && cerrado && foco ? bien("Menú móvil: abre, Escape cierra y el foco vuelve al botón") : mal(`Menú móvil: abierto=${abierto} cerrado=${cerrado} foco=${foco}`);
  }

  // Foco visible: captura con el teclado sobre el primer CTA del hero
  await pagina.evaluate(() => window.scrollTo(0, 0));
  await pagina.keyboard.press("Tab");
  await pagina.keyboard.press("Tab");
  await pagina.keyboard.press("Tab");
  if (ancho < 600) await pagina.keyboard.press("Tab");
  await pagina.screenshot({ path: `${SALIDA}foco-${ancho}.png` });
  await pagina.close();
}

await navegador.close();
servidor.close();
console.log(fallos ? `\n${fallos} comprobaciones fallidas.` : "\nTodo correcto. Capturas en capturas/");
process.exitCode = fallos ? 1 : 0;
