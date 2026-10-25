// Home y páginas de sector (misma plantilla; el sector cambia la línea bajo el hero, la foto,
// los avisos de "Atiende", el parte de ejemplo y una pregunta extra).

import { esc, conAcento, enlaceWhatsapp, buscarLogo, carrusel, tarjetas, oscuro, precio, preguntas, cierre } from "./comun.js";

// Columna derecha del hero: en la home, el carrusel de sectores; en cada sector, su foto
function heroVisual(c, sector) {
  if (!sector) return carrusel(c, { id: "carrusel-inicio", hero: true });
  const f = sector.foto;
  return `
        <picture class="hero__foto hero__foto--sector">
          <img src="${esc(f.src)}" width="${f.ancho}" height="${f.alto}" alt="${esc(f.alt)}" loading="eager" fetchpriority="high" decoding="async">
        </picture>`;
}

// Cinta de sectores: píldoras en movimiento continuo; la lista va duplicada para que el bucle no se corte
function cinta(c) {
  const li = c.sectores.map((s) => `<li>${esc(s.nombre)}</li>`).join("");
  return `
      <div class="cinta">
        <div class="cinta__pista">
          <ul class="cinta__lista" aria-label="${esc(c.t.cinta.etiqueta)}">${li}</ul>
          <ul class="cinta__lista" aria-hidden="true">${li}</ul>
        </div>
      </div>`;
}

// Primera empresa: logo en gris si existe; si no, el nombre en texto. Preparado para una fila de hasta 6 logos.
function primeraEmpresa(c) {
  const pe = c.t.primeraEmpresa;
  const logo = pe.logo || buscarLogo(pe.archivoLogo);
  if (logo) {
    return `
        <h2 id="primero-titulo" class="primero__titulo">${esc(pe.tituloConLogos)}</h2>
        <ul class="primero__logos">
          <li><img src="${esc(logo)}" alt="${esc(pe.nombre)}" height="40" loading="lazy"></li>
        </ul>`;
  }
  return `
        <h2 id="primero-titulo" class="primero__titulo">${esc(pe.titulo)}</h2>
        <p class="primero__nombre" translate="no">${esc(pe.nombre)}</p>
        <p class="primero__sector">${esc(pe.sector)}</p>`;
}

export function inicio(c, sector = null) {
  const { t } = c;
  const h = t.hero;
  const cf = t.comoFunciona;
  const tes = t.testimonio;

  return `
<main id="contenido" tabindex="-1">

  <section class="hero rejilla" id="inicio" aria-labelledby="hero-titulo">
    <div class="hero__marco">
      <div class="hero__texto">
        <h1 id="hero-titulo">${conAcento(h.titulo, h.tituloAcento)}</h1>
        <p class="hero__flujo">${esc(h.flujo)}</p>
        <p class="hero__linea">${esc(sector ? sector.linea : h.linea)}</p>
        <div class="hero__acciones">
          ${enlaceWhatsapp(c, h.cta, "boton")}
          <a class="boton boton--contorno" href="#${esc(cf.id)}">${esc(h.secundario)}</a>
        </div>
      </div>
      <div class="hero__visual${sector ? "" : " hero__visual--home"}">${heroVisual(c, sector)}</div>
      ${sector ? "" : `<div class="hero__cinta">${cinta(c)}</div>`}
    </div>
  </section>

  <div class="claro">
    <section class="primero" aria-labelledby="primero-titulo">
      <div class="contenedor">
        ${primeraEmpresa(c)}
      </div>
    </section>

    <section class="producto" id="${esc(cf.id)}" aria-labelledby="producto-titulo">
      <div class="contenedor">
        <h2 id="producto-titulo" class="titular">${esc(cf.titulo)}</h2>
        <p class="subtitular">${esc(cf.subtitulo)}</p>
        ${tarjetas(c, sector)}
      </div>
    </section>
  </div>

  ${
    tes.texto
      ? `<section class="testimonio" aria-label="${esc(tes.empresa || tes.nombre)}">
    <div class="contenedor">
      <figure class="cita">
        <blockquote><p>${esc(tes.texto)}</p></blockquote>
        <figcaption><strong>${esc(tes.nombre)}</strong>${tes.cargo ? `<span>${esc(tes.cargo)}${tes.empresa ? `, ${esc(tes.empresa)}` : ""}</span>` : ""}</figcaption>
      </figure>
    </div>
  </section>`
      : ""
  }

  ${oscuro(c)}
  ${precio(c)}
  ${preguntas(c, sector ? [sector.faq] : [])}
  ${cierre(c)}
  ${sector ? otrosSectores(c, sector) : ""}

</main>`;
}

function otrosSectores(c, sector) {
  const otros = c.sectores.filter((s) => s.slug !== sector.slug);
  return `
  <section class="otros" aria-labelledby="otros-titulo">
    <div class="contenedor">
      <h2 id="otros-titulo" class="otros__titulo">${esc(c.t.paginaSector.otros)}</h2>
      <ul class="otros__lista">
        ${otros.map((s) => `<li><a href="/sectores/${esc(s.slug)}/">${esc(s.nombre)}</a></li>`).join("")}
      </ul>
    </div>
  </section>`;
}
