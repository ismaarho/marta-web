// Página de trabajo /logo/: tres propuestas de símbolo para comparar. No está enlazada ni en el sitemap.

import { readFileSync } from "node:fs";

const RAIZ = new URL("../../public/logo/", import.meta.url);
const TINTA = "#1C1813";

// Lee un SVG de public/logo/ y lo prepara para incrustarlo en el color del texto
function svgEnLinea(archivo, alto) {
  const fuente = readFileSync(new URL(archivo, RAIZ), "utf8").trim();
  const [, ancho, altoOriginal] = fuente.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const anchoFinal = Math.round((ancho / altoOriginal) * alto * 100) / 100;
  return fuente
    .replaceAll(TINTA, "currentColor")
    .replace(/<title>.*?<\/title>/, "")
    .replace(/ role="img" aria-label="[^"]*"/, ' aria-hidden="true" focusable="false"')
    .replace(/ width="[\d.]+" height="[\d.]+"/, ` width="${anchoFinal}" height="${alto}"`);
}

const PROPUESTAS = [
  {
    k: "a",
    titulo: "A. La M como onda de voz",
    texto: "Una M de palos rectos cuyo centro son tres barras de distinta altura: la voz que contesta.",
  },
  {
    k: "b",
    titulo: "B. Burbuja de aviso",
    texto: "Un cuadrado con esquinas de 4 px y cola de mensaje; dentro, una barra y un punto de «nuevo aviso». Remite al parte por WhatsApp.",
  },
  {
    k: "c",
    titulo: "C. Llamada atendida",
    texto: "Un círculo discontinuo, la llamada que suena, y un check: atendida.",
  },
];

const TRATAMIENTOS = [
  { clase: "tinta", nombre: "Tinta sobre blanco" },
  { clase: "marino", nombre: "Blanco sobre azul marino" },
  { clase: "una", nombre: "Una sola tinta (azul #3A6BB5)" },
];

const TAMANOS = [24, 48, 128, 512];

export function logo() {
  const propuesta = (p) => `
    <section class="logo-propuesta" aria-labelledby="logo-${p.k}">
      <h2 id="logo-${p.k}">${p.titulo}</h2>
      <p>${p.texto} Archivos: <code>/logo/simbolo-${p.k}.svg</code> y <code>/logo/logo-${p.k}.svg</code>.</p>

      ${TRATAMIENTOS.map(
        (tr) => `
      <figure class="logo-muestra logo-muestra--${tr.clase}">
        <figcaption>${tr.nombre}</figcaption>
        <div class="logo-tamanos">
          ${TAMANOS.map((t) => `<div class="logo-tamano"><span class="logo-lienzo">${svgEnLinea(`simbolo-${p.k}.svg`, t)}</span><span class="logo-cota">${t} px</span></div>`).join("")}
        </div>
      </figure>`
      ).join("")}

      <figure class="logo-muestra logo-muestra--marcas">
        <figcaption>Con el wordmark «Marta»: Special Gothic Condensed One / Instrument Sans 700</figcaption>
        <div class="logo-marcas">
          ${["tinta", "marino"]
            .map(
              (fondo) => `
          <div class="logo-marcas__fila logo-muestra--${fondo}">
            <span>${svgEnLinea(`comparar/logo-${p.k}-gothic.svg`, 56)}</span>
            <span>${svgEnLinea(`logo-${p.k}.svg`, 56)}</span>
            <span>${svgEnLinea(`comparar/logo-${p.k}-gothic.svg`, 24)}</span>
            <span>${svgEnLinea(`logo-${p.k}.svg`, 24)}</span>
          </div>`
            )
            .join("")}
        </div>
      </figure>
    </section>`;

  return `
<main id="contenido" class="logo-pagina" tabindex="-1">
  <div class="contenedor">
    <h1 class="logo-pagina__titulo">Logo de Marta: tres propuestas</h1>
    <p class="logo-pagina__nota">Página de trabajo, sin enlazar. Símbolos en una rejilla de 24 px con trazo de 2 px y un solo color.</p>
    ${PROPUESTAS.map(propuesta).join("")}
  </div>
</main>`;
}
