// JS de la web: menú móvil, desplegables de la cabecera y carrusel de sectores.
// Todo es mejora progresiva: sin JS, el menú se ve abierto y el carrusel es una rejilla.

const escritorio = matchMedia("(min-width: 64em)");
const movimientoReducido = matchMedia("(prefers-reduced-motion: reduce)");

// ---------- Menú móvil ----------

const boton = document.querySelector(".nav__boton");
const lista = document.getElementById("nav-lista");

function abrirMenu(si) {
  boton.setAttribute("aria-expanded", String(si));
  boton.setAttribute("aria-label", si ? boton.dataset.cerrar : boton.dataset.abrir);
  document.documentElement.classList.toggle("menu-abierto", si);
  if (!si) cerrarDesplegables();
}

if (boton && lista) {
  boton.addEventListener("click", () => abrirMenu(boton.getAttribute("aria-expanded") !== "true"));
  lista.addEventListener("click", (e) => {
    if (e.target.closest("a")) abrirMenu(false);
  });
  escritorio.addEventListener("change", (e) => e.matches && abrirMenu(false));
}

// ---------- Desplegables (Cómo funciona, Sectores) ----------

const desplegables = [...document.querySelectorAll(".desplegable")];

function cerrarDesplegables(excepto) {
  for (const d of desplegables) {
    if (d === excepto) continue;
    d.classList.remove("abierto");
    d.querySelector(".desplegable__boton").setAttribute("aria-expanded", "false");
  }
}

for (const d of desplegables) {
  const b = d.querySelector(".desplegable__boton");
  b.addEventListener("click", () => {
    const abrir = b.getAttribute("aria-expanded") !== "true";
    cerrarDesplegables(d);
    d.classList.toggle("abierto", abrir);
    b.setAttribute("aria-expanded", String(abrir));
  });
}

document.addEventListener("click", (e) => {
  if (escritorio.matches && !e.target.closest(".desplegable")) cerrarDesplegables();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const abierto = desplegables.find((d) => d.classList.contains("abierto"));
  if (abierto) {
    cerrarDesplegables();
    abierto.querySelector(".desplegable__boton").focus();
  } else if (boton?.getAttribute("aria-expanded") === "true") {
    abrirMenu(false);
    boton.focus();
  }
});

// ---------- Carrusel de sectores ----------

function carrusel(el) {
  const items = [...el.querySelectorAll(".carrusel__item")];
  const escena = el.querySelector(".carrusel__escena");
  const pausa = el.querySelector('[data-accion="pausa"]');
  const n = items.length;
  let actual = 0;
  let pausado = false; // pausa pedida con el botón
  let tocado = false; // tras tocarlo con el dedo, deja de avanzar solo
  let encima = false;
  let foco = false;

  function pintar() {
    items.forEach((item, i) => {
      let d = i - actual;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      const cerca = Math.abs(d) <= 2;
      item.style.setProperty("--pos", d);
      item.dataset.pos = cerca ? String(d) : "lejos";
      item.querySelector("a").tabIndex = cerca ? 0 : -1;
    });
  }

  function mover(paso) {
    actual = (actual + paso + n) % n;
    pintar();
  }

  function avanzaSolo() {
    return !pausado && !tocado && !encima && !foco && !movimientoReducido.matches && !document.hidden;
  }

  setInterval(() => avanzaSolo() && mover(1), 4000);

  el.addEventListener("click", (e) => {
    const accion = e.target.closest("[data-accion]")?.dataset.accion;
    if (accion === "anterior") mover(-1);
    if (accion === "siguiente") mover(1);
    if (accion === "pausa") {
      pausado = !pausado;
      el.toggleAttribute("data-pausado", pausado);
      pausa.setAttribute("aria-label", pausado ? pausa.dataset.reanudar : pausa.dataset.pausar);
    }
  });

  el.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && (encima = true));
  el.addEventListener("pointerleave", (e) => e.pointerType === "mouse" && (encima = false));
  el.addEventListener("focusin", () => (foco = true));
  el.addEventListener("focusout", (e) => !el.contains(e.relatedTarget) && (foco = false));

  el.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") mover(-1);
    if (e.key === "ArrowRight") mover(1);
  });

  // Deslizar con el dedo
  let inicioX = null;
  let deslizado = false;
  escena.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") tocado = true;
    inicioX = e.clientX;
    deslizado = false;
  });
  escena.addEventListener("pointerup", (e) => {
    if (inicioX === null) return;
    const dx = e.clientX - inicioX;
    inicioX = null;
    if (Math.abs(dx) > 40) {
      deslizado = true;
      mover(dx < 0 ? 1 : -1);
    }
  });
  escena.addEventListener("pointercancel", () => (inicioX = null));
  // Si ha sido un deslizamiento, no abre el enlace de la tarjeta
  escena.addEventListener(
    "click",
    (e) => {
      if (deslizado) {
        e.preventDefault();
        deslizado = false;
      }
    },
    true
  );

  pintar();
}

document.querySelectorAll(".carrusel").forEach(carrusel);

// ---------- Cinta de sectores: una píldora resaltada que cambia cada 2 s ----------

for (const cinta of document.querySelectorAll(".cinta")) {
  const listas = [...cinta.querySelectorAll(".cinta__lista")];
  const n = listas[0]?.children.length ?? 0;
  let i = 0;
  const resaltar = () => {
    for (const l of listas) [...l.children].forEach((li, j) => li.classList.toggle("activa", j === i));
    i = (i + 1) % n;
  };
  if (n) {
    resaltar();
    setInterval(resaltar, 2000);
  }
}
