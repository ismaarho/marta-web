// Plantilla de la página. Recibe los textos de content/<idioma>.js y devuelve HTML.
// Se ejecuta en el build (vite.config.js): el HTML final sale completo, sin depender de JS.

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Enlace a WhatsApp: siempre la misma URL, abre en pestaña nueva
function enlaceWhatsapp(t, url, texto, clase = "boton") {
  return `<a class="${clase}" href="${esc(url)}" target="_blank" rel="noopener">${esc(texto)}<span class="sr"> ${esc(t.abreWhatsapp)}</span></a>`;
}

const icono = {
  telefono: `<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M10.2 4.5c.9-.4 1.9 0 2.3.9l1.8 4.2c.3.8.1 1.7-.6 2.2l-2.1 1.6c1.3 2.8 3.5 5 6.3 6.3l1.6-2.1c.5-.7 1.4-.9 2.2-.6l4.2 1.8c.9.4 1.3 1.4.9 2.3l-1.1 2.8c-.5 1.2-1.7 2-3 1.9C13.6 25.2 6.8 18.4 6.2 9.3c-.1-1.3.7-2.5 1.9-3z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
};

// El parte: objeto central del diseño. Variante "mini" para el visual del hero.
function parte(t, { mini = false } = {}) {
  const e = t.ejemplo;
  const campos = mini ? e.campos.filter((c) => ["Motivo", "Cliente", "Teléfono", "Dirección"].includes(c.etiqueta)) : e.campos;
  return `
  <article class="parte${mini ? " parte--mini" : ""}" ${mini ? 'aria-hidden="true"' : `aria-label="${esc(e.sello)}: ${esc(e.cabecera)}"`}>
    <span class="sello">${esc(e.sello)}</span>
    <header class="parte__cabeza">
      <span class="prioridad prioridad--urgente">${esc(e.prioridad)}</span>
      <span class="parte__titulo">${esc(e.cabecera)}</span>
    </header>
    <dl class="parte__campos">
      ${campos.map((c) => `<div><dt>${esc(c.etiqueta)}</dt><dd>${esc(c.valor)}</dd></div>`).join("")}
    </dl>
    ${mini ? "" : `<p class="parte__pie">${esc(e.pie)}</p>`}
  </article>`;
}

// Diagrama propio: llamada → unos segundos sin respuesta → Marta → parte
function diagrama(t) {
  const d = t.comoFunciona.diagrama;
  const onda = (x, y) =>
    [-12, -6, 0, 6, 12]
      .map((dx, i) => {
        const h = [8, 16, 24, 16, 8][i];
        return `<line x1="${x + dx}" y1="${y - h / 2}" x2="${x + dx}" y2="${y + h / 2}"/>`;
      })
      .join("");
  const ticket = (x, y) => `
      <g transform="translate(${x} ${y})">
        <rect x="-34" y="-42" width="68" height="84" rx="4" class="d-papel"/>
        <rect x="-34" y="-42" width="68" height="18" rx="4" class="d-naranja"/>
        <rect x="-34" y="-30" width="68" height="6" class="d-naranja"/>
        <line x1="-22" y1="-6" x2="22" y2="-6" class="d-renglon"/>
        <line x1="-22" y1="8" x2="16" y2="8" class="d-renglon"/>
        <line x1="-22" y1="22" x2="10" y2="22" class="d-renglon"/>
      </g>`;
  const tel = (x, y) => `
      <g transform="translate(${x} ${y})">
        <circle r="46" class="d-nodo"/>
        <g transform="translate(-24 -24) scale(1.5)" class="d-icono">${icono.telefono.replace(/<\/?svg[^>]*>/g, "")}</g>
      </g>`;
  const marta = (x, y) => `
      <g transform="translate(${x} ${y})">
        <circle r="46" class="d-nodo d-nodo--tinta"/>
        <g class="d-onda">${onda(0, 0)}</g>
      </g>`;

  return `
  <div class="diagrama" role="img" aria-label="${esc(d.resumen)}">
    <svg class="diagrama__h" viewBox="0 0 1000 220" aria-hidden="true" focusable="false">
      ${tel(90, 96)}
      <path d="M184 96 H 418" class="d-espera"/>
      <path d="M146 76 q 8 20 0 40 M161 68 q 12 28 0 56" class="d-tono"/>
      <text x="302" y="72" text-anchor="middle" class="d-nota">${esc(d.espera)}</text>
      ${marta(480, 96)}
      <path d="M540 96 H 796" class="d-envio"/>
      <path d="M784 86 l 14 10 l -14 10" class="d-envio d-punta"/>
      ${ticket(860, 96)}
      <text x="90" y="186" text-anchor="middle" class="d-etiqueta">${esc(d.llamada)}</text>
      <text x="480" y="186" text-anchor="middle" class="d-etiqueta">${esc(d.marta)}</text>
      <text x="860" y="186" text-anchor="middle" class="d-etiqueta">${esc(d.parte)}</text>
    </svg>
    <svg class="diagrama__v" viewBox="0 0 340 560" aria-hidden="true" focusable="false">
      ${tel(70, 64)}
      <text x="128" y="72" class="d-etiqueta">${esc(d.llamada)}</text>
      <path d="M70 122 V 236" class="d-espera"/>
      <text x="96" y="186" class="d-nota">${esc(d.espera)}</text>
      ${marta(70, 296)}
      <text x="128" y="304" class="d-etiqueta">${esc(d.marta)}</text>
      <path d="M70 354 V 440" class="d-envio"/>
      <path d="M60 428 l 10 14 l 10 -14" class="d-envio d-punta"/>
      ${ticket(70, 496)}
      <text x="128" y="504" class="d-etiqueta">${esc(d.parte)}</text>
    </svg>
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
  const v = t.visual;
  const cf = t.comoFunciona;
  const p = t.parte;

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
    ${enlaceWhatsapp(t, WHATSAPP, t.nav.cta, "boton boton--cabecera")}
  </div>
</header>

<main id="contenido" tabindex="-1">

  <section class="hero" id="inicio" aria-labelledby="hero-titulo">
    <div class="contenedor hero__rejilla">
      <div class="hero__texto">
        <h1 id="hero-titulo"><span>${esc(h.titulo.split(". ")[0])}.</span> <span>${esc(h.titulo.split(". ").slice(1).join(". "))}</span></h1>
        <p class="hero__flujo">${esc(h.flujo)}</p>
        <div class="hero__acciones">
          ${enlaceWhatsapp(t, WHATSAPP, h.cta, "boton boton--grande")}
          <a class="enlace" href="#como-funciona">${esc(h.secundario)}</a>
        </div>
        <p class="hero__nota">${esc(h.nota)}</p>
      </div>

      <div class="visual" role="img" aria-label="${esc(v.resumen)}">
        <div class="v-paso v-llamada" aria-hidden="true">
          <span class="v-icono">${icono.telefono}</span>
          <span><b>${esc(v.llamada)}</b><span class="v-estado">${esc(v.sinRespuesta)}</span></span>
        </div>
        <div class="v-tramo v-tramo--1" aria-hidden="true"><span>${esc(v.desvio)}</span></div>
        <div class="v-paso v-marta" aria-hidden="true">
          <span class="v-onda"><i></i><i></i><i></i><i></i><i></i></span>
          <b>${esc(v.marta)}</b>
        </div>
        <div class="v-tramo v-tramo--2" aria-hidden="true"><span>${esc(v.llega)}</span></div>
        <div class="v-salida">${parte(t, { mini: true })}</div>
      </div>
    </div>
  </section>

  <section class="seccion problema" id="${esc(t.problema.id)}" aria-labelledby="problema-titulo">
    <div class="contenedor">
      <h2 id="problema-titulo">${esc(t.problema.titulo)}</h2>
      <p class="problema__intro">${esc(t.problema.intro)}</p>
      <ul class="problema__lista">
        ${t.problema.situaciones.map((s) => `<li>${esc(s)}</li>`).join("")}
      </ul>
      <p class="problema__cierre">${esc(t.problema.cierre)}</p>
    </div>
  </section>

  <section class="seccion como" id="${esc(cf.id)}" aria-labelledby="como-titulo">
    <div class="contenedor">
      <h2 id="como-titulo">${esc(cf.titulo)}</h2>
      ${diagrama(t)}
      <ol class="pasos">
        ${cf.pasos
          .map(
            (s, i) => `<li class="paso"><span class="paso__num" aria-hidden="true">${i + 1}</span><h3>${esc(s.titulo)}</h3><p>${esc(s.texto)}</p></li>`
          )
          .join("")}
      </ol>
      <div class="limites">
        <h3>${esc(cf.limites.titulo)}</h3>
        <p>${esc(cf.limites.texto)}</p>
      </div>
    </div>
  </section>

  <section class="seccion ejemplo" id="${esc(p.id)}" aria-labelledby="parte-titulo">
    <div class="contenedor ejemplo__rejilla">
      <div class="ejemplo__texto">
        <h2 id="parte-titulo">${esc(p.titulo)}</h2>
        <p class="entradilla">${esc(p.intro)}</p>
        <ul class="ejemplo__notas">
          ${p.notas.map((n) => `<li><h3>${esc(n.titulo)}</h3><p>${esc(n.texto)}</p></li>`).join("")}
        </ul>
      </div>
      <div class="ejemplo__objeto">
        ${parte(t)}
        <div class="prioridades">
          <h3>${esc(p.prioridades.titulo)}</h3>
          <ul>
            ${p.prioridades.lista
              .map((x) => `<li><span class="prioridad prioridad--${x.clave}">${esc(x.nombre)}</span><span>${esc(x.texto)}</span></li>`)
              .join("")}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="seccion oficios" id="${esc(t.oficios.id)}" aria-labelledby="oficios-titulo">
    <div class="contenedor">
      <h2 id="oficios-titulo">${esc(t.oficios.titulo)}</h2>
      <ul class="oficios__lista">
        ${t.oficios.lista.map((o) => `<li><h3>${esc(o.nombre)}</h3><p>${esc(o.texto)}</p></li>`).join("")}
      </ul>
      <p class="oficios__real">${esc(t.oficios.real)}</p>
    </div>
  </section>

  <section class="seccion precio" id="${esc(t.precio.id)}" aria-labelledby="precio-titulo">
    <div class="contenedor precio__rejilla">
      <div>
        <h2 id="precio-titulo">${esc(t.precio.titulo)}</h2>
        <p class="precio__cifra"><span class="precio__num">${esc(t.precio.cifra)}</span><span class="precio__unidad">${esc(t.precio.unidad)}</span></p>
      </div>
      <div class="precio__detalle">
        <div class="piloto">
          <h3>${esc(t.precio.piloto.titulo)}</h3>
          <p>${esc(t.precio.piloto.texto)}</p>
        </div>
        <p class="precio__condiciones">${esc(t.precio.condiciones)}</p>
        ${enlaceWhatsapp(t, WHATSAPP, t.precio.cta, "boton boton--tinta boton--grande")}
      </div>
    </div>
  </section>

  <section class="seccion ismael" id="${esc(t.ismael.id)}" aria-labelledby="ismael-titulo">
    <div class="contenedor ismael__rejilla">
      <h2 id="ismael-titulo">${esc(t.ismael.titulo)}</h2>
      <div>${t.ismael.texto.map((x) => `<p>${esc(x)}</p>`).join("")}</div>
    </div>
  </section>

  <section class="seccion faq" id="${esc(t.faq.id)}" aria-labelledby="faq-titulo">
    <div class="contenedor faq__rejilla">
      <h2 id="faq-titulo">${esc(t.faq.titulo)}</h2>
      <div class="faq__lista">
        ${t.faq.lista
          .map((f) => `<details><summary><span>${esc(f.p)}</span><span class="faq__signo" aria-hidden="true"></span></summary><p>${esc(f.r)}</p></details>`)
          .join("")}
      </div>
    </div>
  </section>

  <section class="seccion final" aria-labelledby="final-titulo">
    <div class="contenedor">
      <h2 id="final-titulo">${esc(t.final.titulo)}</h2>
      <p>${esc(t.final.texto)}</p>
      ${enlaceWhatsapp(t, WHATSAPP, t.final.cta, "boton boton--grande")}
    </div>
  </section>

</main>

<footer class="pie">
  <div class="contenedor pie__fila">
    <span class="marca marca--pie"><span class="marca__chapa" aria-hidden="true"></span><span translate="no">${esc(t.marca)}</span></span>
    ${enlaceWhatsapp(t, WHATSAPP, t.pie.whatsapp, "enlace enlace--pie")}
  </div>
</footer>`;
}
