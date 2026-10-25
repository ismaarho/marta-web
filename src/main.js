// Único JS de la página: el menú en móvil.

const boton = document.querySelector(".nav__boton");
const lista = document.getElementById("nav-lista");

function abrir(si) {
  boton.setAttribute("aria-expanded", String(si));
  boton.setAttribute("aria-label", si ? boton.dataset.cerrar : boton.dataset.abrir);
  document.documentElement.classList.toggle("menu-abierto", si);
}

if (boton && lista) {
  boton.addEventListener("click", () => abrir(boton.getAttribute("aria-expanded") !== "true"));

  // Al elegir una sección, se cierra
  lista.addEventListener("click", (e) => {
    if (e.target.closest("a")) abrir(false);
  });

  // Escape cierra y devuelve el foco al botón
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && boton.getAttribute("aria-expanded") === "true") {
      abrir(false);
      boton.focus();
    }
  });

  // Si se pasa a escritorio con el menú abierto, se resetea
  matchMedia("(min-width: 64em)").addEventListener("change", (e) => e.matches && abrir(false));
}
