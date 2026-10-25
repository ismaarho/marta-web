// Todas las páginas de la web: ruta, metadatos (title, description, OG) y cuerpo.

import t, { WHATSAPP } from "../content/es.js";
import sectores from "../content/sectores/index.js";
import { cabeza, cabecera, pie } from "./plantilla/comun.js";
import { inicio } from "./plantilla/inicio.js";
import { comoFunciona, sectores as paginaSectores, clientes } from "./plantilla/paginas.js";
import { logo } from "./plantilla/logo.js";

export function paginas(sitio = "") {
  const c = { t, sectores, whatsapp: WHATSAPP, sitio };
  // oculta: página de trabajo, sin cabecera ni pie, con noindex y fuera del sitemap
  const pagina = (ruta, meta, cuerpo, { oculta = false } = {}) => ({
    ruta,
    oculta,
    cabeza: cabeza(c, { ...meta, ruta, noindex: oculta }),
    cuerpo: oculta ? cuerpo : cabecera(c) + cuerpo + pie(c),
    og: meta.og,
  });

  return [
    pagina("/", { titulo: t.meta.titulo, descripcion: t.meta.descripcion, og: "/og/inicio.jpg", ogAlt: t.meta.ogAlt }, inicio(c)),
    pagina(
      "/como-funciona/",
      { titulo: t.paginaComoFunciona.meta.titulo, descripcion: t.paginaComoFunciona.meta.descripcion, og: "/og/como-funciona.jpg" },
      comoFunciona(c)
    ),
    pagina("/sectores/", { titulo: t.paginaSectores.meta.titulo, descripcion: t.paginaSectores.meta.descripcion, og: "/og/sectores.jpg" }, paginaSectores(c)),
    ...sectores.map((s) =>
      pagina(`/sectores/${s.slug}/`, { titulo: s.meta.titulo, descripcion: s.meta.descripcion, og: `/og/sectores/${s.slug}.jpg`, ogAlt: s.foto.alt || s.meta.titulo }, inicio(c, s))
    ),
    pagina("/clientes/", { titulo: t.paginaClientes.meta.titulo, descripcion: t.paginaClientes.meta.descripcion, og: "/og/clientes.jpg" }, clientes(c)),
    pagina("/logo/", { titulo: "Logo de Marta: propuestas", descripcion: "Página de trabajo con tres propuestas de logo.", og: "/og/inicio.jpg" }, logo(), { oculta: true }),
  ];
}

// Datos para generar las imágenes OG (scripts/og.mjs)
export function imagenesOg() {
  return [
    { archivo: "og/inicio.jpg", tipo: "foto", foto: t.hero.imagen.escritorio.src, titulo: t.hero.titulo, acento: t.hero.tituloAcento },
    { archivo: "og/como-funciona.jpg", tipo: "foto", foto: t.hero.imagen.escritorio.src, titulo: t.paginaComoFunciona.meta.ogTitulo, acento: t.paginaComoFunciona.meta.ogAcento },
    { archivo: "og/sectores.jpg", tipo: "mosaico", fotos: sectores.slice(0, 5).map((s) => s.foto.mini), titulo: t.paginaSectores.meta.ogTitulo },
    { archivo: "og/clientes.jpg", tipo: "foto", foto: t.hero.imagen.escritorio.src, titulo: t.paginaClientes.meta.ogTitulo },
    ...sectores.map((s) => ({ archivo: `og/sectores/${s.slug}.jpg`, tipo: "sector", foto: s.foto.src, linea: s.linea, titulo: t.hero.titulo, acento: t.hero.tituloAcento })),
  ];
}

export { t };
