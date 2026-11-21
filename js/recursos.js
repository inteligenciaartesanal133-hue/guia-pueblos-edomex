// recursos.js — rutas de imagenes e iconos usados en varias paginas.

// Ajolote mascota. Para cambiarlo por otra imagen, basta con cambiar estas rutas.
// Imagenes del equipo, sin fondo (se recortan con scripts/quitar-fondo.mjs).
export const AJOLOTE = {
  saluda: "assets/img/ajolote.png",
  senala: "assets/img/ajolote-senala.png",
  lee: "assets/img/ajolote-lee.png",
  confundida: "assets/img/ajolote-confundida.png", // pantallas de "no encontrado"
};

// Iconos de interfaz (trazo de 2 px, mismo estilo que los de categorias).
const svg = (d) =>
  `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;

export const ICONO = {
  lupa: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
  corazon: svg('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  corazonLleno: `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="currentColor"/></svg>`,
  menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  cerrar: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  idioma: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'),
  flecha: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  ubicacion: svg('<path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>'),
  externo: svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
};

// Escapa texto para meterlo en HTML sin riesgos.
export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
