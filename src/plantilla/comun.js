// Piezas comunes a todas las páginas. Todo se renderiza en el build, sin depender de JS.

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Envuelve en <span class="acento"> el trozo indicado del texto
export function conAcento(texto, acento) {
  const i = acento ? texto.toLowerCase().indexOf(acento.toLowerCase()) : -1;
  if (i < 0) return esc(texto);
  return `${esc(texto.slice(0, i))}<span class="acento">${esc(texto.slice(i, i + acento.length))}</span>${esc(texto.slice(i + acento.length))}`;
}

// Enlace a WhatsApp: siempre la misma URL, abre en pestaña nueva
export function enlaceWhatsapp(c, texto, clase = "boton") {
  return `<a class="${clase}" href="${esc(c.whatsapp)}" target="_blank" rel="noopener">${esc(texto)}<span class="sr"> ${esc(c.t.abreWhatsapp)}</span></a>`;
}

// Iconos propios de trazo, 20×20, en el color del texto
const icono = (d) =>
  `<svg class="icono" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const ICONOS = {
  atiende: icono("M6.2 2.8 8 6.6 6.4 8.1a9.5 9.5 0 0 0 5.5 5.5l1.5-1.6 3.8 1.8-.6 2.6a1.6 1.6 0 0 1-1.7 1.2A13.6 13.6 0 0 1 2.4 5.1a1.6 1.6 0 0 1 1.2-1.7z"),
  pregunta: icono("M4 4.5h12M4 10h12M4 15.5h7M14 15l1.5 1.5L18 14"),
  avisa: icono("M3.5 4.5h13v9h-7l-4 3v-3h-2z M7 8.2h6 M7 10.8h4"),
  check: icono("M4.5 10.5 8 14l7.5-8"),
  flecha: icono("M5 7.5 10 12.5 15 7.5"),
  izquierda: icono("M12.5 5 7.5 10l5 5"),
  derecha: icono("M7.5 5l5 5-5 5"),
  pausa: icono("M7.5 5v10M12.5 5v10"),
  reproducir: icono("M7 5l8 5-8 5z"),
};

const marca = (t) =>
  // Logo: símbolo B (burbuja de aviso, public/logo/simbolo-b.svg) + «Marta»
  `<svg class="marca__simbolo" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 21V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4H8z"/><path d="M8 10.5h5" stroke-linecap="round"/></g><circle class="marca__punto" cx="16.5" cy="10.5" r="1.5" fill="currentColor"/></svg><span translate="no">${esc(t.marca)}</span>`;

// ---------- <head> ----------

export function cabeza(c, { titulo, descripcion, ruta, og, ogAlt, noindex = false }) {
  const base = c.sitio.replace(/\/$/, "");
  const ogUrl = `${base}${og}`;
  return `
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}">
${noindex ? '<meta name="robots" content="noindex">' : ""}
${base && !noindex ? `<link rel="canonical" href="${esc(base + ruta)}">` : ""}
<meta property="og:type" content="website">
<meta property="og:locale" content="${esc(c.t.locale)}">
<meta property="og:site_name" content="${esc(c.t.marca)}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descripcion)}">
${base ? `<meta property="og:url" content="${esc(base + ruta)}">` : ""}
<meta property="og:image" content="${esc(ogUrl)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(ogAlt ?? titulo)}">
<meta name="twitter:card" content="summary_large_image">`;
}

// ---------- Cabecera con desplegables ----------

export function cabecera(c) {
  const { t, sectores } = c;
  const n = t.nav;
  const desplegable = (id, texto, contenido, ancho = "") => `
      <li class="desplegable${ancho}">
        <button class="desplegable__boton" type="button" aria-expanded="false" aria-controls="${id}">${esc(texto)}${ICONOS.flecha}</button>
        <div class="desplegable__panel" id="${id}">${contenido}</div>
      </li>`;
  const lista = (enlaces) => `<ul class="desplegable__lista">${enlaces.map((l) => `<li><a href="${esc(l.href)}">${esc(l.texto)}</a></li>`).join("")}</ul>`;
  const listaSectores = lista([
    ...sectores.map((s) => ({ href: `/sectores/${s.slug}/`, texto: s.nombre })),
    { href: "/sectores/", texto: n.sectores.todos },
  ]);

  return `
<a class="saltar" href="#contenido">${esc(t.saltar)}</a>
<header class="cabecera">
  <div class="contenedor cabecera__fila">
    <a class="marca" href="/" aria-label="${esc(t.inicio)}">${marca(t)}</a>
    <nav class="nav" aria-label="${esc(n.etiqueta)}">
      <button class="nav__boton" type="button" aria-expanded="false" aria-controls="nav-lista"
        data-abrir="${esc(n.abrir)}" data-cerrar="${esc(n.cerrar)}" aria-label="${esc(n.abrir)}">
        <span class="nav__raya" aria-hidden="true"></span>
      </button>
      <ul class="nav__lista" id="nav-lista">
        ${desplegable("menu-como", n.comoFunciona.texto, lista(n.comoFunciona.enlaces))}
        ${desplegable("menu-sectores", n.sectores.texto, listaSectores, " desplegable--ancho")}
        ${n.enlaces.map((l) => `<li><a class="nav__enlace" href="${esc(l.href)}">${esc(l.texto)}</a></li>`).join("")}
      </ul>
    </nav>
    ${enlaceWhatsapp(c, n.cta, "boton boton--blanco boton--cabecera")}
  </div>
</header>`;
}

// ---------- Pie con columnas ----------

export function pie(c) {
  const { t, sectores } = c;
  const col = (titulo, items) => `
      <div class="pie__columna">
        <h2>${esc(titulo)}</h2>
        <ul>${items.join("")}</ul>
      </div>`;
  const li = (href, texto) => `<li><a href="${esc(href)}">${esc(texto)}</a></li>`;
  return `
<footer class="pie">
  <div class="pie__banda">
    <div class="contenedor pie__fila">
      <a class="marca marca--pie" href="/" aria-label="${esc(t.inicio)}">${marca(t)}</a>
      <p class="pie__lema">${esc(t.lema)}</p>
    </div>
  </div>
  <div class="contenedor pie__columnas">
    ${col(t.pie.producto, [li("/como-funciona/", t.nav.comoFunciona.texto), li("/sectores/", t.nav.sectores.todos), li("/#precio", "Precio")])}
    ${col(t.pie.sectores, sectores.map((s) => li(`/sectores/${s.slug}/`, s.nombre)))}
    ${col(t.pie.empresa, [li("/clientes/", "Clientes"), li("/#preguntas", t.faq.titulo), `<li>${enlaceWhatsapp(c, t.pie.whatsapp, "pie__wa")}</li>`])}
  </div>
  <div class="contenedor pie__nota">
    <p>${esc(t.pie.imagenIA)}</p>
  </div>
</footer>`;
}

// ---------- Carrusel de sectores ----------
// Sin JS se ve como una rejilla de tarjetas; con JS, central en color y laterales giradas.

export function carrusel(c, { pequeno = false, id = "carrusel" } = {}) {
  const { t, sectores } = c;
  const k = t.carrusel;
  return `
  <div class="carrusel${pequeno ? " carrusel--pequeno" : ""}" id="${id}" role="region" aria-roledescription="carrusel" aria-label="${esc(k.etiqueta)}">
    <div class="carrusel__escena">
      <span class="carrusel__corchetes" aria-hidden="true"></span>
      <ul class="carrusel__pista">
        ${sectores
          .map(
            (s, i) => `
        <li class="carrusel__item" data-indice="${i}">
          <a class="carrusel__tarjeta" href="/sectores/${esc(s.slug)}/">
            <img src="${esc(s.foto.mini)}" srcset="${esc(s.foto.mini)} 360w, ${esc(s.foto.src)} 900w" sizes="${pequeno ? "180px" : "(min-width: 48em) 300px, 220px"}"
              width="360" height="450" alt="" loading="${i < 3 || i > sectores.length - 3 ? "eager" : "lazy"}" decoding="async">
            <span class="carrusel__nombre">${esc(s.nombre)}</span>
          </a>
        </li>`
          )
          .join("")}
      </ul>
    </div>
    <div class="carrusel__controles">
      <button class="carrusel__boton" type="button" data-accion="anterior" aria-label="${esc(k.anterior)}">${ICONOS.izquierda}</button>
      <button class="carrusel__boton" type="button" data-accion="pausa" aria-label="${esc(k.pausar)}" data-pausar="${esc(k.pausar)}" data-reanudar="${esc(k.reanudar)}">${ICONOS.pausa}${ICONOS.reproducir}</button>
      <button class="carrusel__boton" type="button" data-accion="siguiente" aria-label="${esc(k.siguiente)}">${ICONOS.derecha}</button>
    </div>
  </div>`;
}

// ---------- El parte, como mensaje de WhatsApp en un móvil simplificado ----------

export function mensajeParte(c, parte = {}) {
  const e = c.t.ejemplo;
  const prioridad = parte.prioridad ?? e.prioridad;
  const campos = [{ etiqueta: "Motivo", valor: parte.motivo ?? e.motivo }, ...e.campos];
  return `
  <div class="movil">
    <div class="movil__barra"><span class="movil__avatar" aria-hidden="true">${esc(e.remitente.slice(0, 1))}</span>${esc(e.remitente)}</div>
    <div class="movil__chat">
      <article class="mensaje" aria-label="${esc(e.sello)}: ${esc(e.cabecera)}">
        <div class="mensaje__cabeza">
          <span class="etiqueta-prioridad etiqueta-prioridad--${esc(prioridad.toLowerCase())}">${esc(prioridad)}</span>
          <span class="sello">${esc(e.sello)}</span>
        </div>
        <p class="mensaje__titulo">${esc(e.cabecera)}</p>
        <dl class="mensaje__campos">
          ${campos.map((x) => `<div><dt>${esc(x.etiqueta)}</dt><dd>${esc(x.valor)}</dd></div>`).join("")}
        </dl>
      </article>
    </div>
  </div>`;
}

// ---------- Tres tarjetas: Atiende, Pregunta, Avisa ----------

export function tarjetas(c, sector) {
  const ta = c.t.comoFunciona.tarjetas;
  const hitos = sector?.hitos ?? ta.atiende.hitos;
  const datos = ta.pregunta.datos.map((d) => (d === "Aviso" && sector?.dato ? sector.dato : d));
  return `
        <div class="bandeja tarjetas">
          <article class="tarjeta">
            <h3 class="tarjeta__titulo">${ICONOS.atiende}${esc(ta.atiende.titulo)}</h3>
            <p class="tarjeta__texto">${esc(ta.atiende.texto)}</p>
            <ol class="mini tiempo">
              ${hitos
                .map((x) => `<li><span class="tiempo__t">${esc(x.tiempo)}</span><span class="tiempo__texto">${esc(x.texto)}</span><span class="pastilla">${esc(x.etiqueta)}</span></li>`)
                .join("")}
            </ol>
          </article>
          <article class="tarjeta">
            <h3 class="tarjeta__titulo">${ICONOS.pregunta}${esc(ta.pregunta.titulo)}</h3>
            <p class="tarjeta__texto">${esc(ta.pregunta.texto)}</p>
            <ul class="mini datos">
              ${datos.map((d) => `<li>${ICONOS.check}${esc(d)}</li>`).join("")}
            </ul>
          </article>
          <article class="tarjeta">
            <h3 class="tarjeta__titulo">${ICONOS.avisa}${esc(ta.avisa.titulo)}</h3>
            <p class="tarjeta__texto">${esc(ta.avisa.texto)}</p>
            ${mensajeParte(c, sector?.parte)}
          </article>
        </div>`;
}

// ---------- Secciones repetidas ----------

export function oscuro(c, { conIsmael = true } = {}) {
  const t = c.t;
  return `
  <section class="oscuro"${conIsmael ? ` id="${esc(t.ismael.id)}"` : ""}>
    <div class="contenedor oscuro__rejilla${conIsmael ? "" : " oscuro__rejilla--una"}">
      <div class="oscuro__bloque">
        <h2>${esc(t.limites.titulo)}</h2>
        <p>${esc(t.limites.texto)}</p>
      </div>
      ${
        conIsmael
          ? `<div class="oscuro__bloque">
        <h2>${esc(t.ismael.titulo)}</h2>
        ${t.ismael.texto.map((x) => `<p>${esc(x)}</p>`).join("")}
      </div>`
          : ""
      }
    </div>
  </section>`;
}

export function precio(c) {
  const p = c.t.precio;
  return `
  <section class="precio" id="${esc(p.id)}" aria-labelledby="precio-titulo">
    <div class="contenedor">
      <h2 id="precio-titulo" class="titular">${esc(p.titulo)}</h2>
      <div class="bandeja bandeja--estrecha">
        <div class="tarjeta precio__tarjeta">
          <p class="precio__cifra"><span class="precio__num">${esc(p.cifra)}</span> <span class="precio__unidad">${esc(p.unidad)}</span></p>
          <div class="piloto">
            <h3>${esc(p.piloto.titulo)}</h3>
            <p>${esc(p.piloto.texto)}</p>
          </div>
          <p class="precio__condiciones">${esc(p.condiciones)}</p>
          ${enlaceWhatsapp(c, p.cta, "boton")}
        </div>
      </div>
    </div>
  </section>`;
}

export function preguntas(c, extra = []) {
  const f = c.t.faq;
  const lista = [...extra, ...f.lista];
  return `
  <section class="faq" id="${esc(f.id)}" aria-labelledby="faq-titulo">
    <div class="contenedor">
      <h2 id="faq-titulo" class="titular">${esc(f.titulo)}</h2>
      <div class="bandeja bandeja--estrecha faq__lista">
        ${lista
          .map((x) => `<details class="tarjeta"><summary><span>${esc(x.p)}</span><span class="faq__signo" aria-hidden="true"></span></summary><p>${esc(x.r)}</p></details>`)
          .join("")}
      </div>
    </div>
  </section>`;
}

export function cierre(c) {
  const f = c.t.final;
  return `
  <section class="cierre" aria-labelledby="cierre-titulo">
    <div class="contenedor">
      <div class="cierre__tarjeta">
        <h2 id="cierre-titulo">${esc(f.titulo)}</h2>
        <p>${esc(f.texto)}</p>
        ${enlaceWhatsapp(c, f.cta, "boton boton--blanco")}
      </div>
    </div>
  </section>`;
}

// Hero de página interior: titular, subtítulo y botones (sin foto)
export function heroSimple(c, { titulo, acento, subtitulo, secundario }) {
  return `
  <section class="hero hero--simple" aria-labelledby="hero-titulo">
    <div class="hero__marco hero__marco--simple">
      <div class="hero__texto">
        <h1 id="hero-titulo">${conAcento(titulo, acento)}</h1>
        <p class="hero__flujo">${esc(subtitulo)}</p>
        ${
          secundario
            ? `<div class="hero__acciones">
          ${enlaceWhatsapp(c, c.t.hero.cta, "boton")}
          <a class="boton boton--contorno" href="${esc(secundario.href)}">${esc(secundario.texto)}</a>
        </div>`
            : ""
        }
      </div>
    </div>
  </section>`;
}
