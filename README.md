# Marta · web pública

Web estática (HTML, CSS y JS) construida con Vite. Sin frameworks, sin analítica.

## Comandos
- `npm install`: instala Vite y Playwright.
- `npm run dev`: servidor local con todas las rutas.
- `npm run build`: genera `dist/` (17 páginas, `robots.txt` y, si existe la variable `URL`, `sitemap.xml`).
  Es lo que publica Netlify (ver `netlify.toml`); Netlify define `URL` en cada build.
- `npm run og`: regenera las imágenes OG de todas las páginas en `public/og/`.
- `npm run enlaces`: tras el build, comprueba que todos los enlaces internos y anclas existen.
- `npm run capturas`: tras el build, capturas a 375 y 1280 px de varias páginas en `capturas/` y comprobaciones
  (scroll horizontal, enlaces de WhatsApp, menú móvil, desplegables y carrusel).
  Si falta Chromium: `npx playwright install chromium`.

## Páginas
- `/` inicio · `/como-funciona/` · `/sectores/` · `/sectores/<slug>/` (13) · `/clientes/`

## Dónde está cada cosa
- `content/es.js`: textos generales y el único enlace de contacto (`WHATSAPP`).
- `content/sectores/<slug>.js`: textos de cada sector; `content/sectores/index.js` fija el orden.
- `src/rutas.js`: lista de páginas con su title, description e imagen OG.
- `src/plantilla/`: plantillas (`comun.js`, `inicio.js` para inicio y sectores, `paginas.js` para el resto).
- `src/estilos.css`: estilos. `src/main.js`: menú móvil, desplegables y carrusel.
- `public/fuentes/`: Special Gothic Condensed One e Instrument Sans (licencia OFL).
- `public/img/`: fotos del hero y de los sectores (`sectores/` a 900×1125 y `sectores/mini/` a 360×450).
  Imágenes generadas con IA.
- El logo de la primera empresa va en `primeraEmpresa.logo` de `content/es.js`; vacío, se muestra el nombre.
