// comun.js — piezas de pagina que se repiten (tarjetas de lugar, botones ♥).
import { estaEnRuta, alternar } from "../mi-ruta.js";
import { AJOLOTE, ICONO, esc } from "../recursos.js";

// Tarjeta de un destino o una zona. "l" es el objeto del JSON.
export function tarjetaLugar(l, { datos, t, txt }) {
  const foto = l.foto && datos.fotos[l.foto];
  const esZona = l.id.startsWith("zona-");
  const url = esZona ? `zonas.html#${l.id}` : `explora.html#${l.id}`;
  return `
    <li class="tarjeta">
      ${foto
        ? `<img class="tarjeta__foto" src="${esc(foto.archivo)}" alt="${esc(txt(foto.alt))}" loading="lazy" width="400" height="300">`
        : `<img class="tarjeta__foto tarjeta__foto--ilustracion" src="assets/svg/paisaje.svg" alt="" loading="lazy" width="400" height="300">`}
      ${botonCorazon(l.id, txt(l.nombre), arguments[1])}
      <div class="tarjeta__cuerpo">
        <h3 class="tarjeta__titulo"><a href="${url}">${esc(txt(l.nombre))}</a></h3>
        <p class="tarjeta__meta">${ICONO.ubicacion.replace('width="22" height="22"', 'width="16" height="16"')} ${esc(l.municipio || "")} · ${esc(t(esZona ? "tipo_zona" : "tipo_destino"))}</p>
      </div>
    </li>`;
}

export function botonCorazon(id, nombre, { t, almacen }) {
  const g = estaEnRuta(almacen, id);
  return `<button type="button" class="boton-corazon" data-ruta="${esc(id)}" data-nombre="${esc(nombre)}" aria-pressed="${g}" aria-label="${esc(t(g ? "quitar" : "guardar"))}: ${esc(nombre)}">${g ? ICONO.corazonLleno : ICONO.corazon}</button>`;
}

// Hace funcionar todos los botones ♥ dentro de "raiz".
export function conectarCorazones(raiz, { t, almacen, actualizarRuta }, alCambiar = () => {}) {
  raiz.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ruta]");
    if (!b) return;
    const ahora = alternar(almacen, b.dataset.ruta);
    b.setAttribute("aria-pressed", String(ahora));
    b.setAttribute("aria-label", `${t(ahora ? "quitar" : "guardar")}: ${b.dataset.nombre}`);
    b.innerHTML = ahora ? ICONO.corazonLleno : ICONO.corazon;
    actualizarRuta();
    alCambiar(b.dataset.ruta, ahora);
  });
}

// Pantalla de "no encontrado" con el ajolote dormido.
export function noEncontrado(t, enlace = { url: "pueblos.html", clave: "irPueblos" }) {
  return `
    <section class="vacio envoltura">
      <img src="${AJOLOTE.duerme}" alt="" width="200" height="240">
      <h1>${esc(t("noEncontrado"))}</h1>
      <p>${esc(t("noEncontradoTexto"))}</p>
      <a class="boton" href="${enlace.url}">${esc(t(enlace.clave))}</a>
    </section>`;
}

// Lista de creditos de fotos usadas en una pagina.
export function creditosFotos(claves, { datos, t }) {
  const usadas = [...new Set(claves)].filter((c) => c && datos.fotos[c]);
  if (!usadas.length) return "";
  return `<p class="creditos">${esc(t("creditoFoto"))}: ${usadas.map((c) => {
    const f = datos.fotos[c];
    return `<a href="${esc(f.url_original)}" rel="noopener" target="_blank">${esc(f.autor)}</a> (${esc(f.licencia)})`;
  }).join(" · ")}</p>`;
}
