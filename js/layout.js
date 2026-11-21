// layout.js — pinta el encabezado y el pie en todas las paginas y prepara lo comun.
import { cargarDatos, texto } from "./datos.js";
import { crearAlmacen, idiomaActual, cambiarIdioma, cargarTextos, tr } from "./i18n.js";
import { crearIndice, buscar } from "./buscar.js";
import { leerRuta } from "./mi-ruta.js";
import { ICONO, esc } from "./recursos.js";

const MENU = [
  { clave: "menuInicio", url: "index.html", pagina: "inicio", color: "rosa" },
  { clave: "menuExplora", url: "explora.html", pagina: "explora", color: "amarillo" },
  { clave: "menuPueblos", url: "pueblos.html", pagina: "pueblos", color: "rosa-claro" },
  { clave: "menuZonas", url: "zonas.html", pagina: "zonas", color: "morado" },
  { clave: "menuGaleria", url: "galeria.html", pagina: "galeria", color: "morado-claro" },
  { clave: "menuAcerca", url: "acerca.html", pagina: "acerca", color: "verde-claro" },
];

// Mensaje por si ni siquiera cargan los textos (por ejemplo, abierto con doble clic).
const AVISO_SIN_SERVIDOR =
  "Para ver la guía, ábrela con un servidor local: en la terminal escribe «python -m http.server 8000» y entra a http://localhost:8000";

export async function iniciarPagina(pagina) {
  const almacen = crearAlmacen();
  const idioma = idiomaActual(almacen);
  document.documentElement.lang = idioma;

  let textos;
  try {
    textos = await cargarTextos(idioma);
  } catch {
    mostrarError(location.protocol === "file:" ? AVISO_SIN_SERVIDOR : "No pudimos cargar la página. / We could not load the page.");
    throw new Error(location.protocol === "file:" ? "SIN_SERVIDOR" : "SIN_DATOS");
  }
  const t = (clave) => tr(textos, clave);

  let datos;
  try {
    datos = await cargarDatos();
  } catch (error) {
    pintarEncabezado({ pagina, idioma, t, almacen, indice: [] });
    pintarPie(t);
    mostrarError(t(error.message));
    throw error;
  }

  const indice = crearIndice(datos, idioma);
  pintarEncabezado({ pagina, idioma, t, almacen, indice });
  pintarPie(t);
  const txt = (valor) => texto(valor, idioma);
  return { datos, idioma, textos, t, txt, almacen, indice, actualizarRuta: () => actualizarContador(almacen, t) };
}

function mostrarError(mensaje) {
  const main = document.querySelector("main");
  main.innerHTML = `<section class="envoltura aviso-error" role="alert"><p>${esc(mensaje)}</p></section>`;
}

function pintarEncabezado({ pagina, idioma, t, almacen, indice }) {
  const header = document.getElementById("encabezado");
  const otro = idioma === "es" ? "en" : "es";
  header.className = "encabezado";
  header.innerHTML = `
    <a class="saltar" href="#principal">${esc(idioma === "es" ? "Saltar al contenido" : "Skip to content")}</a>
    <div class="encabezado__barra envoltura">
      <a class="marca" href="index.html" aria-label="${esc(t("marca"))} · ${esc(t("marcaSub"))}">
        <img class="marca__logo" src="assets/svg/logo-piramide.svg" alt="" width="48" height="33">
        <span class="marca__texto"><span class="marca__nombre">${esc(t("marca"))}</span><span class="marca__sub">${esc(t("marcaSub"))}</span></span>
      </a>
      <button class="boton-icono encabezado__menu" type="button" aria-expanded="false" aria-controls="menu-principal" aria-label="${esc(t("menuAbrir"))}">${ICONO.menu}</button>
      <nav id="menu-principal" class="menu" aria-label="${esc(idioma === "es" ? "Principal" : "Main")}">
        <ul>${MENU.map((m) => `<li><a class="menu__enlace menu__enlace--${m.color}" href="${m.url}"${m.pagina === pagina ? ' aria-current="page"' : ""}>${esc(t(m.clave))}</a></li>`).join("")}</ul>
      </nav>
      <div class="encabezado__acciones">
        <button class="boton-icono" type="button" id="abrir-buscador" aria-expanded="false" aria-controls="buscador" aria-label="${esc(t("buscarAbrir"))}">${ICONO.lupa}</button>
        <a class="boton-ruta" href="mi-ruta.html"${pagina === "mi-ruta" ? ' aria-current="page"' : ""}>${esc(t("miRuta"))} ${ICONO.corazon}<span class="boton-ruta__cuenta" id="cuenta-ruta" aria-live="polite"></span></a>
        <button class="boton-idioma" type="button" lang="${otro}" aria-label="${esc(t("idiomaEtiqueta"))}">${ICONO.idioma}<span>${otro.toUpperCase()}</span></button>
      </div>
    </div>
    <div class="buscador envoltura" id="buscador" hidden>
      <form role="search" class="buscador__form">
        <label class="solo-lector" for="campo-buscar">${esc(t("buscarBoton"))}</label>
        <input id="campo-buscar" type="search" autocomplete="off" placeholder="${esc(t("buscarPlaceholder"))}">
      </form>
      <ul class="buscador__resultados" id="resultados-buscar" aria-live="polite"></ul>
    </div>
    <div class="papel-picado" aria-hidden="true"></div>`;

  // Menu en celular
  const botonMenu = header.querySelector(".encabezado__menu");
  botonMenu.addEventListener("click", () => {
    const abierto = botonMenu.getAttribute("aria-expanded") === "true";
    botonMenu.setAttribute("aria-expanded", String(!abierto));
    header.classList.toggle("menu-abierto", !abierto);
  });

  // Idioma
  header.querySelector(".boton-idioma").addEventListener("click", () => {
    cambiarIdioma(almacen, otro);
    // El idioma viaja tambien en la URL por si el navegador no deja guardarlo.
    const url = new URL(location.href);
    url.searchParams.set("lang", otro);
    location.href = url.toString();
  });

  // Buscador desplegable
  const botonBuscar = header.querySelector("#abrir-buscador");
  const panel = header.querySelector("#buscador");
  const campo = header.querySelector("#campo-buscar");
  botonBuscar.addEventListener("click", () => {
    const abrir = panel.hidden;
    panel.hidden = !abrir;
    botonBuscar.setAttribute("aria-expanded", String(abrir));
    if (abrir) campo.focus();
  });
  conectarBuscador(campo, header.querySelector("#resultados-buscar"), indice, t);
  header.querySelector(".buscador__form").addEventListener("submit", (e) => {
    e.preventDefault();
    const primero = header.querySelector("#resultados-buscar a");
    if (primero) location.href = primero.href;
  });

  actualizarContador(almacen, t);
}

// Lo usa tambien la portada con su buscador grande.
export function conectarBuscador(campo, lista, indice, t) {
  campo.addEventListener("input", () => {
    const consulta = campo.value;
    const res = buscar(indice, consulta, 8);
    if (!consulta.trim()) { lista.innerHTML = ""; return; }
    lista.innerHTML = res.length
      ? res.map((r) => `<li><a href="${esc(r.url)}"><span class="etiqueta">${esc(t("tipo_" + r.tipo))}</span> ${esc(r.titulo)}</a></li>`).join("")
      : `<li class="buscador__vacio">${esc(t("buscarSinResultados"))}</li>`;
  });
}

function actualizarContador(almacen, t) {
  const cuenta = document.getElementById("cuenta-ruta");
  if (!cuenta) return;
  const n = leerRuta(almacen).length;
  cuenta.textContent = n > 0 ? String(n) : "";
  cuenta.hidden = n === 0;
}

function pintarPie(t) {
  const pie = document.getElementById("pie");
  pie.className = "pie";
  pie.innerHTML = `
    <div class="papel-picado papel-picado--pie" aria-hidden="true"></div>
    <div class="pie__contenido envoltura">
      <a class="marca marca--pie" href="index.html">
        <img class="marca__logo" src="assets/svg/logo-piramide.svg" alt="" width="48" height="33">
        <span class="marca__texto"><span class="marca__nombre">${esc(t("marca"))}</span><span class="marca__sub">${esc(t("marcaSub"))}</span></span>
      </a>
      <p class="pie__lema">${esc(t("pieLema"))}</p>
      <div class="pie__extra">
        <p class="pie__hashtag">#EdoMéxTurístico</p>
      </div>
    </div>`;
}
