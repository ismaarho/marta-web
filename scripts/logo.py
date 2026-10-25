"""Genera los SVG del logo de Marta en public/logo/.

- simbolo-a/b/c.svg: los tres símbolos en una rejilla de 24×24, trazo de 2 px, un solo color.
- wordmark-instrument.svg y wordmark-gothic.svg: «Marta» convertida a trazos (no depende de la fuente).
- logo-a/b/c.svg: cada símbolo con el wordmark en Instrument Sans 700.
- comparar/logo-a/b/c-gothic.svg: lo mismo con Special Gothic Condensed One, para comparar.

Uso: python3 scripts/logo.py   (requiere: pip install fonttools brotli uharfbuzz)
"""

from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "public" / "logo"
TINTA = "#1C1813"

# ---------- Símbolos (rejilla 24×24, trazo 2) ----------

SIMBOLOS = {
    # A. La M como onda de voz: palos laterales, hombros en diagonal y tres barras de distinta altura
    #    (corta, larga, media), asimétricas para que se lean como forma de onda
    "a": (
        '<g fill="none" stroke="{c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
        '<path d="M4 19V5l4 4v3M20 19V5l-4 4v6M12 7v10"/>'
        "</g>"
    ),
    # B. Burbuja de aviso: cuadrado con esquinas de 4, cola abajo a la izquierda, barra y punto de «nuevo»
    "b": (
        '<g fill="none" stroke="{c}" stroke-width="2" stroke-linejoin="round">'
        '<path d="M3 21V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4H8z"/>'
        '<path d="M8 10.5h5" stroke-linecap="round"/>'
        "</g>"
        '<circle cx="16.5" cy="10.5" r="1.5" fill="{c}"/>'
    ),
    # C. Llamada atendida: círculo discontinuo (sonando) y check (atendida)
    "c": (
        '<g fill="none" stroke="{c}" stroke-width="2">'
        '<circle cx="12" cy="12" r="9" stroke-dasharray="4.2 2.87" transform="rotate(-80 12 12)"/>'
        '<path d="M8 12.5l3 3 5-6" stroke-linecap="round" stroke-linejoin="round"/>'
        "</g>"
    ),
}

# Alto visible de cada símbolo dentro de la rejilla (y mínima y máxima, trazo incluido)
EXTENSION = {"a": (4, 20), "b": (2, 22), "c": (2, 22)}

TITULOS = {
    "a": "Marta: la M como onda de voz",
    "b": "Marta: burbuja de aviso",
    "c": "Marta: llamada atendida",
}


def svg(ancho, alto, contenido, titulo):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(ancho)} {fmt(alto)}" '
        f'width="{fmt(ancho)}" height="{fmt(alto)}" role="img" aria-label="{titulo}">'
        f"<title>{titulo}</title>{contenido}</svg>\n"
    )


def fmt(n):
    return f"{n:.2f}".rstrip("0").rstrip(".")


# ---------- Wordmark: «Marta» a trazos, con kerning de HarfBuzz ----------


def wordmark(ruta_fuente, peso=None, texto="Marta"):
    """Devuelve (path_d, ancho, alto_mayúscula) en unidades de la fuente, con y hacia abajo."""
    fuente = TTFont(ruta_fuente)
    datos = (RAIZ / "scratch.ttf")
    fuente.flavor = None
    fuente.save(datos)
    blob = hb.Blob.from_file_path(str(datos))
    datos.unlink()
    cara = hb.Face(blob)
    hbfont = hb.Font(cara)
    ubicacion = {}
    if peso and "fvar" in fuente:
        hbfont.set_variations({"wght": peso})
        ubicacion = {"wght": peso}
    buf = hb.Buffer()
    buf.add_str(texto)
    buf.guess_segment_properties()
    hb.shape(hbfont, buf, {"kern": True, "liga": True})

    glifos = fuente.getGlyphSet(location=ubicacion) if ubicacion else fuente.getGlyphSet()
    orden = fuente.getGlyphOrder()
    mayuscula = fuente["OS/2"].sCapHeight
    x = 0
    trazos = []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        nombre = orden[info.codepoint]
        pen = SVGPathPen(glifos)
        # Invierte el eje y y lleva la línea de mayúsculas a y = 0
        glifos[nombre].draw(TransformPen(pen, (1, 0, 0, -1, x + pos.x_offset, mayuscula)))
        trazos.append(pen.getCommands())
        x += pos.x_advance
    return " ".join(trazos), x, mayuscula


def escala_path(d, factor):
    """Escala los números de un path SVG (comandos absolutos de SVGPathPen)."""
    salida, numero = [], ""
    for ch in d + " ":
        if ch in "-.0123456789" and not (ch == "-" and numero):
            numero += ch
        else:
            if numero:
                salida.append(fmt(float(numero) * factor))
                numero = ""
            if ch == "-":
                numero = "-"
            elif ch.strip():
                salida.append(ch)
            elif salida and salida[-1] != " ":
                salida.append(" ")
    return "".join(salida).strip()


def main():
    SALIDA.mkdir(parents=True, exist_ok=True)
    fuentes = RAIZ / "public" / "fuentes"

    # Símbolos sueltos (24×24)
    for k, interior in SIMBOLOS.items():
        (SALIDA / f"simbolo-{k}.svg").write_text(svg(24, 24, interior.format(c=TINTA), TITULOS[k]))

    # Wordmarks sueltos, a 40 de altura de mayúscula
    marcas = {
        "instrument": wordmark(fuentes / "instrument-sans.woff2", peso=700),
        "gothic": wordmark(fuentes / "special-gothic-condensed-one.woff2"),
    }
    ALTO = 40
    escalados = {}
    for nombre, (d, ancho, mayus) in marcas.items():
        f = ALTO / mayus
        escalados[nombre] = (escala_path(d, f), ancho * f)
        (SALIDA / f"wordmark-{nombre}.svg").write_text(
            svg(ancho * f, ALTO, f'<path fill="{TINTA}" d="{escalados[nombre][0]}"/>', "Marta")
        )

    # Logos: símbolo + wordmark en Instrument Sans 700.
    # El alto visible del símbolo (trazo incluido) es 1,15 veces la mayúscula y se centra con ella.
    (SALIDA / "comparar").mkdir(exist_ok=True)
    for fuente, ruta in (("instrument", "logo-{k}.svg"), ("gothic", "comparar/logo-{k}-gothic.svg")):
        componer(escalados[fuente], ruta, ALTO)

    for p in sorted(SALIDA.rglob("*.svg")):
        print(p.relative_to(RAIZ), p.stat().st_size, "bytes")


def componer(marca, ruta, ALTO):
    d, ancho = marca
    hueco = ALTO * 0.45
    for k, interior in SIMBOLOS.items():
        y0, y1 = EXTENSION[k]
        f = ALTO * 1.15 / (y1 - y0)
        lado = 24 * f
        alto = max(ALTO, (y1 - y0) * f)
        dy_simbolo = (alto - (y1 - y0) * f) / 2 - y0 * f
        dy_texto = (alto - ALTO) / 2
        contenido = (
            f'<g transform="translate(0 {fmt(dy_simbolo)}) scale({fmt(f)})">{interior.format(c=TINTA)}</g>'
            f'<path fill="{TINTA}" transform="translate({fmt(lado + hueco)} {fmt(dy_texto)})" d="{d}"/>'
        )
        (SALIDA / ruta.format(k=k)).write_text(svg(lado + hueco + ancho, alto, contenido, TITULOS[k]))


if __name__ == "__main__":
    main()
