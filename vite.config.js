import { defineConfig } from "vite";
import es, { WHATSAPP } from "./content/es.js";
import { cabeza, pagina } from "./src/pagina.js";

// Netlify define URL en cada build con la dirección del sitio (para og:image y canonical)
const SITIO = process.env.URL ?? "";

export default defineConfig({
  plugins: [
    {
      name: "marta-contenido",
      transformIndexHtml(html) {
        return html
          .replace('<html lang="es">', `<html lang="${es.idioma}">`)
          .replace("<!--cabeza-->", cabeza(es, SITIO))
          .replace("<!--pagina-->", pagina(es, WHATSAPP));
      },
    },
  ],
  build: { outDir: "dist" },
});
