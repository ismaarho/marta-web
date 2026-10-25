// Home y páginas de sector (misma plantilla; el sector cambia la línea bajo el hero, la foto,
// los avisos de "Atiende", el parte de ejemplo y una pregunta extra).

import { esc, conAcento, enlaceWhatsapp, carrusel, tarjetas, oscuro, precio, preguntas, cierre } from "./comun.js";

function heroFoto(c, sector) {
  const img = c.t.hero.imagen;
  if (sector) {
    const f = sector.foto;
    return `
        <picture class="hero__foto hero__foto--sector">
          <img src="${esc(f.src)}" width="${f.ancho}" height="${f.alto}" alt="${esc(f.alt)}" loading="eager" fetchpriority="high" decoding="async">
        </picture>`;
  }
  return `
        <picture class="hero__foto">
          <source media="(min-width: 64em)" srcset="${esc(img.escritorio.src)}" width="${img.escritorio.ancho}" height="${img.escritorio.alto}">
          <img src="${esc(img.movil.src)}" width="${img.movil.ancho}" height="${img.movil.alto}" alt="${esc(img.alt)}" loading="eager" fetchpriority="high" decoding="async">
        </picture>`;
}

export function inicio(c, sector = null) {
  const { t } = c;
  const h = t.hero;
  const cf = t.comoFunciona;
  const pe = t.primeraEmpresa;
  const tes = t.testimonio;

  return `
<main id="contenido" tabindex="-1">

  <section class="hero" id="inicio" aria-labelledby="hero-titulo">
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
      <div class="hero__visual">${heroFoto(c, sector)}</div>
      ${sector ? "" : `<div class="hero__carrusel">${carrusel(c, { pequeno: true, id: "carrusel-inicio" })}</div>`}
    </div>
  </section>

  <div class="claro">
    <section class="primero" aria-labelledby="primero-titulo">
      <div class="contenedor">
        <h2 id="primero-titulo" class="primero__titulo">${esc(pe.titulo)}</h2>
        ${
          pe.logo
            ? `<img class="primero__logo" src="${esc(pe.logo)}" alt="${esc(pe.nombre)}" loading="lazy">`
            : `<p class="primero__nombre" translate="no">${esc(pe.nombre)}</p>`
        }
        <p class="primero__sector">${esc(pe.sector)}</p>
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
