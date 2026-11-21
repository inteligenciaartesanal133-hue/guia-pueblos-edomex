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

// Ficha completa de un destino o una zona (se usa en Explora, Zonas y Mi Ruta).
export function detalleLugar(l, ctx) {
  const { datos, t, txt } = ctx;
  const foto = l.foto && datos.fotos[l.foto];
  const esZona = l.id.startsWith("zona-");
  const actividades = (l.actividades || []).map((a) =>
    `<li><span class="etiqueta etiqueta--${a.ambiente}">${esc(t(a.ambiente))}</span> ${esc(txt(a.nombre))}</li>`).join("");
  const queVer = (l.que_ver || []).map((q) => `<li>${esc(txt(q))}</li>`).join("");
  return `
    <article class="lugar" id="${esc(l.id)}" tabindex="-1">
      <div class="lugar__foto">
        ${foto
          ? `<img src="${esc(foto.archivo)}" alt="${esc(txt(foto.alt))}" loading="lazy" width="640" height="480">`
          : `<img class="lugar__ilustracion" src="assets/svg/paisaje.svg" alt="" loading="lazy" width="640" height="480">`}
      </div>
      <div class="lugar__texto">
        <div class="lugar__cabecera">
          <h2>${esc(txt(l.nombre))}</h2>
          ${botonCorazon(l.id, txt(l.nombre), ctx)}
        </div>
        <p class="tarjeta__meta">${esc(l.municipio || "")}${esZona && l.cultura ? ` · ${esc(t("cultura"))}: ${esc(txt(l.cultura))}` : ""}</p>
        <p>${esc(txt(l.resena))}</p>
        ${queVer ? `<h3>${esc(t("queVer"))}</h3><ul class="lista">${queVer}</ul>` : ""}
        ${actividades ? `<h3>${esc(t("actividades"))}</h3><ul class="lista lista--actividades">${actividades}</ul>` : ""}
        <h3>${esc(t("comoLlegar"))}</h3>
        <p>${esc(txt(l.como_llegar))}</p>
        <p class="creditos">${esc(t("aproximado"))}</p>
        ${l.inah_url ? `<p><a class="enlace-externo" href="${esc(l.inah_url)}" target="_blank" rel="noopener">${esc(t("consultarInah"))} ${ICONO.externo}</a></p>` : ""}
        ${fuentesHTML(l.fuentes, t)}
        ${creditosFotos([l.foto], ctx)}
      </div>
    </article>`;
}

export function fuentesHTML(fuentes = [], t) {
  if (!fuentes.length) return "";
  return `<details class="fuentes"><summary>${esc(t("fuentes"))} (${fuentes.length})</summary><ul>${fuentes.map((f) =>
    `<li><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.titulo || f.url)}</a></li>`).join("")}</ul></details>`;
}

// Lleva la vista al elemento del #ancla (despues de pintar la pagina).
export function irAlAncla() {
  const id = decodeURIComponent(location.hash.slice(1));
  const el = id && document.getElementById(id);
  if (el) { el.scrollIntoView({ block: "start" }); el.focus({ preventScroll: true }); }
}
