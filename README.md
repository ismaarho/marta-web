# Marta · web pública

Web estática (HTML, CSS y JS) construida con Vite. Sin frameworks, sin analítica.

## Comandos
- `npm install`: instala Vite y Playwright.
- `npm run dev`: servidor local.
- `npm run build`: genera `dist/`, que es lo que publica Netlify (ver `netlify.toml`).
- `npm run og`: regenera `public/og.png` (1200×630) a partir de `hero.jpg` y el titular.
- `npm run capturas`: tras el build, capturas a 375 y 1280 px en `capturas/` y comprobaciones
  (scroll horizontal, enlaces de WhatsApp, sello "Ejemplo", menú móvil).
  Si falta Chromium: `npx playwright install chromium`.

## Dónde está cada cosa
- `content/es.js`: todos los textos y el único enlace de contacto (`WHATSAPP`).
  Para otro idioma, se copia como `content/ca.js` con la misma estructura.
- `src/pagina.js`: la plantilla; Vite la rellena con los textos en el build.
- `src/estilos.css`: estilos y tokens de color y tipografía.
- `src/main.js`: el menú móvil (es el único JavaScript).
- `public/fuentes/`: Special Gothic Condensed One e Instrument Sans (licencia OFL).
- `public/img/`: `hero.jpg` (16:9, escritorio) y `hero-movil.jpg` (4:5, móvil). Imágenes generadas con IA.
  El logo del primer instalador va en `primerInstalador.logo` de `content/es.js`; vacío, se muestra el nombre.

`og:image` y `canonical` usan la variable `URL` que Netlify define en cada build.
