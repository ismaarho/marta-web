// Páginas interiores: /como-funciona/, /sectores/ y /clientes/.

import { esc, conAcento, enlaceWhatsapp, ICONOS, carrusel, mensajeParte, oscuro, preguntas, cierre, heroSimple } from "./comun.js";

// ---------- /como-funciona/ ----------

export function comoFunciona(c) {
  const p = c.t.paginaComoFunciona;
  const b = p.bloques;
  const img = c.t.hero.imagen;

  const bloque = (x, mini, i) => `
    <section class="bloque${i % 2 ? " bloque--invertido" : ""}" id="${esc(x.id)}" aria-labelledby="${esc(x.id)}-titulo">
      <div class="contenedor bloque__rejilla">
        <div class="bloque__texto">
          <p class="bloque__etiqueta">${esc(x.etiqueta)}</p>
          <h2 id="${esc(x.id)}-titulo">${esc(x.titulo)}</h2>
          <p>${esc(x.texto)}</p>
        </div>
        <div class="bandeja bloque__mini"><div class="tarjeta">${mini}</div></div>
      </div>
    </section>`;

  const miniDesvio = `
          <dl class="filas">
            ${b.desvio.filas.map((f) => `<div><dt>${esc(f.a)}</dt><dd>${esc(f.b)}</dd></div>`).join("")}
          </dl>`;
  const miniConversacion = `
          <div class="conversacion">
            <span class="sello">${esc(c.t.ejemplo.sello)}</span>
            <ol>
              ${b.conversacion.turnos
                .map((x) => `<li class="turno turno--${x.quien === "Marta" ? "marta" : "cliente"}"><span class="turno__quien">${esc(x.quien)}</span><span class="turno__texto">${esc(x.texto)}</span></li>`)
                .join("")}
            </ol>
          </div>`;
  const miniClasificacion = `
          <ul class="clasificacion">
            ${b.clasificacion.prioridades
              .map((x) => `<li><span class="etiqueta-prioridad etiqueta-prioridad--${esc(x.clave)}">${esc(x.nombre)}</span><span>${esc(x.texto)}</span></li>`)
              .join("")}
          </ul>`;

  return `
<main id="contenido" tabindex="-1">
  <section class="hero" aria-labelledby="hero-titulo">
    <div class="hero__marco">
      <div class="hero__texto">
        <h1 id="hero-titulo">${conAcento(p.titulo, p.tituloAcento)}</h1>
        <p class="hero__flujo">${esc(p.subtitulo)}</p>
        <div class="hero__acciones">
          ${enlaceWhatsapp(c, c.t.hero.cta, "boton")}
          <a class="boton boton--contorno" href="/sectores/">${esc(p.secundario)}</a>
        </div>
      </div>
      <div class="hero__visual">
        <picture class="hero__foto">
          <source media="(min-width: 64em)" srcset="${esc(img.escritorio.src)}" width="${img.escritorio.ancho}" height="${img.escritorio.alto}">
          <img src="${esc(img.movil.src)}" width="${img.movil.ancho}" height="${img.movil.alto}" alt="${esc(img.alt)}" loading="eager" fetchpriority="high" decoding="async">
        </picture>
      </div>
    </div>
  </section>

  <div class="claro claro--bloques">
    ${bloque(b.desvio, miniDesvio, 0)}
    ${bloque(b.conversacion, miniConversacion, 1)}
    ${bloque(b.clasificacion, miniClasificacion, 2)}
    ${bloque(b.parte, mensajeParte(c), 3)}
  </div>

  ${oscuro(c, { conIsmael: false })}
  ${preguntas(c)}
  ${cierre(c)}
</main>`;
}

// ---------- /sectores/ ----------

export function sectores(c) {
  const p = c.t.paginaSectores;
  return `
<main id="contenido" tabindex="-1">
  <section class="hero hero--sectores" aria-labelledby="hero-titulo">
    <div class="hero__marco hero__marco--centro">
      <div class="hero__texto">
        <h1 id="hero-titulo">${esc(p.titulo)}</h1>
        <p class="hero__flujo">${esc(p.subtitulo)}</p>
      </div>
      ${carrusel(c, { id: "carrusel-sectores" })}
    </div>
  </section>

  <section class="rejilla-sectores" aria-labelledby="rejilla-titulo">
    <div class="contenedor">
      <h2 id="rejilla-titulo" class="titular">${esc(p.rejillaTitulo)}</h2>
      <ul class="bandeja sectores__lista">
        ${c.sectores
          .map(
            (s) => `<li><a class="tarjeta sector-tarjeta" href="/sectores/${esc(s.slug)}/"><span class="sector-tarjeta__nombre">${esc(s.nombre)}</span><span class="sector-tarjeta__resumen">${esc(s.resumen)}</span></a></li>`
          )
          .join("")}
      </ul>
    </div>
  </section>

  ${cierre(c)}
</main>`;
}

// ---------- /clientes/ ----------

export function clientes(c) {
  const p = c.t.paginaClientes;
  const e = c.t.primeraEmpresa;
  const tes = c.t.testimonio;
  return `
<main id="contenido" tabindex="-1">
  ${heroSimple(c, { titulo: p.titulo, subtitulo: p.subtitulo })}

  <section class="caso" aria-labelledby="caso-titulo">
    <div class="contenedor">
      <article class="bandeja caso__bandeja">
        <div class="tarjeta caso__tarjeta">
          <div class="caso__cabeza">
            ${
              e.logo
                ? `<img class="caso__logo" src="${esc(e.logo)}" alt="${esc(e.nombre)}" loading="lazy">`
                : `<h2 id="caso-titulo" class="caso__nombre" translate="no">${esc(e.nombre)}</h2>`
            }
            ${e.logo ? `<h2 id="caso-titulo" class="sr">${esc(e.nombre)}</h2>` : ""}
            <p class="primero__sector">${esc(e.sector)}</p>
          </div>
          ${
            tes.texto
              ? `<figure class="caso__cita"><blockquote><p>${esc(tes.texto)}</p></blockquote><figcaption>${esc(tes.nombre)}${tes.cargo ? `, ${esc(tes.cargo)}` : ""}</figcaption></figure>`
              : `<p class="caso__frase">${esc(p.sinCita)}</p>`
          }
          <div class="caso__que">
            <h3>${ICONOS.atiende}${esc(p.queHaceTitulo)}</h3>
            <p>${esc(p.queHace)}</p>
          </div>
        </div>
      </article>
    </div>
  </section>

  ${cierre(c)}
</main>`;
}
