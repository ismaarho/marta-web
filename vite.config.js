import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import { paginas } from "./src/rutas.js";

// Netlify define URL en cada build con la dirección del sitio (canonical, og:image y sitemap)
const SITIO = (process.env.URL ?? "").replace(/\/$/, "");

const CABEZA = /<!--cabeza:inicio-->[\s\S]*<!--cabeza:fin-->/;
const CUERPO = /<!--cuerpo:inicio-->[\s\S]*<!--cuerpo:fin-->/;

// Rellena la plantilla index.html con la página de la ruta indicada
function rellenar(html, p, idioma = "es") {
  return html
    .replace(/<html lang="[^"]*">/, `<html lang="${idioma}">`)
    .replace(CABEZA, `<!--cabeza:inicio-->${p.cabeza}<!--cabeza:fin-->`)
    .replace(CUERPO, `<!--cuerpo:inicio-->${p.cuerpo}<!--cuerpo:fin-->`);
}

const normalizar = (url) => {
  const ruta = url.split(/[?#]/)[0].replace(/index\.html$/, "");
  return ruta.endsWith("/") ? ruta : ruta + "/";
};

function marta() {
  let todas;
  const buscar = (ruta) => (todas ??= paginas(SITIO)).find((p) => p.ruta === ruta);
  return {
    name: "marta-paginas",
    // En desarrollo: sirve cada ruta con la plantilla de index.html
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const ruta = normalizar(req.url);
        if (ruta === "/" || !buscar(ruta) || !req.headers.accept?.includes("text/html")) return next();
        todas = paginas(SITIO); // relee los textos en cada petición
        const html = await server.transformIndexHtml(req.url, readFileSync("index.html", "utf8"));
        res.setHeader("content-type", "text/html; charset=utf-8");
        res.end(html);
      });
    },
    transformIndexHtml(html, ctx) {
      const p = buscar(normalizar(ctx.originalUrl ?? ctx.path));
      return rellenar(html, p ?? buscar("/"));
    },
    // En el build: la home sale de index.html; el resto de páginas, de la home ya procesada
    generateBundle: {
      order: "post",
      handler(_, bundle) {
        const base = bundle["index.html"].source;
        for (const p of paginas(SITIO)) {
          if (p.ruta === "/") continue;
          this.emitFile({ type: "asset", fileName: `${p.ruta.slice(1)}index.html`, source: rellenar(base, p) });
        }
        // sitemap.xml y robots.txt (el sitemap solo si se conoce la dirección del sitio)
        if (SITIO) {
          const urls = paginas(SITIO).map((p) => `  <url><loc>${SITIO}${p.ruta}</loc></url>`).join("\n");
          this.emitFile({
            type: "asset",
            fileName: "sitemap.xml",
            source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
          });
        } else {
          this.warn("Sin variable URL: no se genera sitemap.xml (Netlify la define en cada build).");
        }
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source: `User-agent: *\nAllow: /\n${SITIO ? `\nSitemap: ${SITIO}/sitemap.xml\n` : ""}`,
        });
      },
    },
  };
}

export default defineConfig({
  plugins: [marta()],
  build: { outDir: "dist" },
});
