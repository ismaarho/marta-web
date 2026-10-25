// Plantilla de la página. Recibe los textos de content/<idioma>.js y devuelve HTML.
// Se ejecuta en el build (vite.config.js): el HTML final sale completo, sin depender de JS.

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Envuelve en <span class="acento"> el trozo indicado del texto
function conAcento(texto, acento) {
  const i = acento ? texto.toLowerCase().indexOf(acento.toLowerCase()) : -1;
  if (i < 0) return esc(texto);
  return `${esc(texto.slice(0, i))}<span class="acento">${esc(texto.slice(i, i + acento.length))}</span>${esc(texto.slice(i + acento.length))}`;
}

// Enlace a WhatsApp: siempre la misma URL, abre en pestaña nueva
function enlaceWhatsapp(t, url, texto, clase = "boton") {
  return `<a class="${clase}" href="${esc(url)}" target="_blank" rel="noopener">${esc(texto)}<span class="sr"> ${esc(t.abreWhatsapp)}</span></a>`;
}

// Iconos propios de trazo, 20×20, en el color del texto
const icono = (d) =>
  `<svg class="icono" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICONOS = {
  atiende: icono("M6.2 2.8 8 6.6 6.4 8.1a9.5 9.5 0 0 0 5.5 5.5l1.5-1.6 3.8 1.8-.6 2.6a1.6 1.6 0 0 1-1.7 1.2A13.6 13.6 0 0 1 2.4 5.1a1.6 1.6 0 0 1 1.2-1.7z"),
  pregunta: icono("M4 4.5h12M4 10h12M4 15.5h7M14 15l1.5 1.5L18 14"),
  avisa: icono("M3.5 4.5h13v9h-7l-4 3v-3h-2z M7 8.2h6 M7 10.8h4"),
  check: icono("M4.5 10.5 8 14l7.5-8"),
};

// El parte, como mensaje de WhatsApp dentro de un móvil simplificado
function mensajeParte(t) {
  const e = t.ejemplo;
  return `
  <div class="movil">
    <div class="movil__barra"><span class="movil__avatar" aria-hidden="true">${esc(e.remitente.slice(0, 1))}</span>${esc(e.remitente)}</div>
    <div class="movil__chat">
      <article class="mensaje" aria-label="${esc(e.sello)}: ${esc(e.cabecera)}">
        <div class="mensaje__cabeza">
          <span class="etiqueta-urgente">${esc(e.prioridad)}</span>
          <span class="sello">${esc(e.sello)}</span>
        </div>
        <p class="mensaje__titulo">${esc(e.cabecera)}</p>
        <dl class="mensaje__campos">
          ${e.campos.map((c) => `<div><dt>${esc(c.etiqueta)}</dt><dd>${esc(c.valor)}</dd></div>`).join("")}
        </dl>
      </article>
    </div>
  </div>`;
}

export function cabeza(t, sitio = "") {
  const base = sitio.replace(/\/$/, "");
  const og = `${base}/og.png`;
  return `
<title>${esc(t.meta.titulo)}</title>
<meta name="description" content="${esc(t.meta.descripcion)}">
${base ? `<link rel="canonical" href="${esc(base)}/">` : ""}
<meta property="og:type" content="website">
<meta property="og:locale" content="${esc(t.locale)}">
<meta property="og:title" content="${esc(t.meta.titulo)}">
<meta property="og:description" content="${esc(t.meta.descripcion)}">
${base ? `<meta property="og:url" content="${esc(base)}/">` : ""}
<meta property="og:image" content="${esc(og)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(t.meta.ogAlt)}">
<meta name="twitter:card" content="summary_large_image">`;
}

export function pagina(t, WHATSAPP) {
  const h = t.hero;
  const img = h.imagen;
  const cf = t.comoFunciona;
  const ta = cf.tarjetas;
  const pi = t.primerInstalador;
  const tes = t.testimonio;

  return `
<a class="saltar" href="#contenido">${esc(t.saltar)}</a>

<header class="cabecera">
  <div class="contenedor cabecera__fila">
    <a class="marca" href="#inicio" aria-label="${esc(t.inicio)}"><span class="marca__chapa" aria-hidden="true"></span><span translate="no">${esc(t.marca)}</span></a>
    <nav class="nav" aria-label="${esc(t.nav.etiqueta)}">
      <button class="nav__boton" type="button" aria-expanded="false" aria-controls="nav-lista"
        data-abrir="${esc(t.nav.abrir)}" data-cerrar="${esc(t.nav.cerrar)}" aria-label="${esc(t.nav.abrir)}">
        <span class="nav__raya" aria-hidden="true"></span>
      </button>
      <ul class="nav__lista" id="nav-lista">
        ${t.nav.enlaces.map((l) => `<li><a href="${esc(l.href)}">${esc(l.texto)}</a></li>`).join("")}
      </ul>
    </nav>
    ${enlaceWhatsapp(t, WHATSAPP, t.nav.cta, "boton boton--blanco boton--cabecera")}
  </div>
</header>

<main id="contenido" tabindex="-1">

  <section class="hero" id="inicio" aria-labelledby="hero-titulo">
    <div class="hero__marco">
      <div class="hero__texto">
        <h1 id="hero-titulo">${conAcento(h.titulo, h.tituloAcento)}</h1>
        <p class="hero__flujo">${esc(h.flujo)}</p>
        <div class="hero__acciones">
          ${enlaceWhatsapp(t, WHATSAPP, h.cta, "boton")}
          <a class="boton boton--contorno" href="#${esc(cf.id)}">${esc(h.secundario)}</a>
        </div>
      </div>
      <div class="hero__visual">
        <picture class="hero__foto">
          <source media="(min-width: 64em)" srcset="${esc(img.escritorio.src)}" width="${img.escritorio.ancho}" height="${img.escritorio.alto}">
          <img src="${esc(img.movil.src)}" width="${img.movil.ancho}" height="${img.movil.alto}" alt="${esc(img.alt)}" loading="eager" fetchpriority="high" decoding="async">
        </picture>
        <ul class="cinta" aria-label="${esc(t.oficios.etiqueta)}">
          ${t.oficios.lista.map((o) => `<li>${esc(o)}</li>`).join("")}
        </ul>
      </div>
    </div>
  </section>

  <div class="claro">
    <section class="primero" aria-labelledby="primero-titulo">
      <div class="contenedor">
        <h2 id="primero-titulo" class="primero__titulo">${esc(pi.titulo)}</h2>
        ${
          pi.logo
            ? `<img class="primero__logo" src="${esc(pi.logo)}" alt="${esc(pi.nombre)}" loading="lazy">`
            : `<p class="primero__nombre" translate="no">${esc(pi.nombre)}</p>`
        }
        <p class="primero__sector">${esc(pi.sector)}</p>
      </div>
    </section>

    <section class="producto" id="${esc(cf.id)}" aria-labelledby="producto-titulo">
      <div class="contenedor">
        <h2 id="producto-titulo" class="titular">${conAcento(cf.titulo, cf.tituloAcento)}</h2>
        <div class="bandeja tarjetas">
          <article class="tarjeta">
            <h3 class="tarjeta__titulo">${ICONOS.atiende}${esc(ta.atiende.titulo)}</h3>
            <p class="tarjeta__texto">${esc(ta.atiende.texto)}</p>
            <ol class="mini tiempo">
              ${ta.atiende.hitos
                .map((x) => `<li><span class="tiempo__t">${esc(x.tiempo)}</span><span class="tiempo__texto">${esc(x.texto)}</span><span class="pastilla">${esc(x.etiqueta)}</span></li>`)
                .join("")}
            </ol>
          </article>
          <article class="tarjeta">
            <h3 class="tarjeta__titulo">${ICONOS.pregunta}${esc(ta.pregunta.titulo)}</h3>
            <p class="tarjeta__texto">${esc(ta.pregunta.texto)}</p>
            <ul class="mini datos">
              ${ta.pregunta.datos.map((d) => `<li>${ICONOS.check}${esc(d)}</li>`).join("")}
            </ul>
          </article>
          <article class="tarjeta">
            <h3 class="tarjeta__titulo">${ICONOS.avisa}${esc(ta.avisa.titulo)}</h3>
            <p class="tarjeta__texto">${esc(ta.avisa.texto)}</p>
            ${mensajeParte(t)}
          </article>
        </div>
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

  <section class="oscuro" id="${esc(t.ismael.id)}">
    <div class="contenedor oscuro__rejilla">
      <div class="oscuro__bloque">
        <h2>${esc(t.limites.titulo)}</h2>
        <p>${esc(t.limites.texto)}</p>
      </div>
      <div class="oscuro__bloque">
        <h2>${esc(t.ismael.titulo)}</h2>
        ${t.ismael.texto.map((x) => `<p>${esc(x)}</p>`).join("")}
      </div>
    </div>
  </section>

  <section class="precio" id="${esc(t.precio.id)}" aria-labelledby="precio-titulo">
    <div class="contenedor">
      <h2 id="precio-titulo" class="titular">${esc(t.precio.titulo)}</h2>
      <div class="bandeja bandeja--estrecha">
        <div class="tarjeta precio__tarjeta">
          <p class="precio__cifra"><span class="precio__num">${esc(t.precio.cifra)}</span> <span class="precio__unidad">${esc(t.precio.unidad)}</span></p>
          <div class="piloto">
            <h3>${esc(t.precio.piloto.titulo)}</h3>
            <p>${esc(t.precio.piloto.texto)}</p>
          </div>
          <p class="precio__condiciones">${esc(t.precio.condiciones)}</p>
          ${enlaceWhatsapp(t, WHATSAPP, t.precio.cta, "boton")}
        </div>
      </div>
    </div>
  </section>

  <section class="faq" id="${esc(t.faq.id)}" aria-labelledby="faq-titulo">
    <div class="contenedor">
      <h2 id="faq-titulo" class="titular">${esc(t.faq.titulo)}</h2>
      <div class="bandeja bandeja--estrecha faq__lista">
        ${t.faq.lista
          .map((f) => `<details class="tarjeta"><summary><span>${esc(f.p)}</span><span class="faq__signo" aria-hidden="true"></span></summary><p>${esc(f.r)}</p></details>`)
          .join("")}
      </div>
    </div>
  </section>

  <section class="cierre" aria-labelledby="cierre-titulo">
    <div class="contenedor">
      <div class="cierre__tarjeta">
        <h2 id="cierre-titulo">${esc(t.final.titulo)}</h2>
        <p>${esc(t.final.texto)}</p>
        ${enlaceWhatsapp(t, WHATSAPP, t.final.cta, "boton boton--blanco")}
      </div>
    </div>
  </section>

</main>

<footer class="pie">
  <div class="pie__banda">
    <div class="contenedor pie__fila">
      <span class="marca marca--pie"><span class="marca__chapa" aria-hidden="true"></span><span translate="no">${esc(t.marca)}</span></span>
      ${enlaceWhatsapp(t, WHATSAPP, t.pie.whatsapp, "pie__enlace")}
    </div>
  </div>
  <div class="contenedor pie__nota">
    <p>${esc(t.pie.imagenIA)}</p>
  </div>
</footer>`;
}
