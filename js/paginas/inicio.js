// Portada: heroe con el ajolote, buscador, categorias, destinos, pueblos y mini mapa.
import { iniciarPagina, conectarBuscador } from "../layout.js";
import { visibles } from "../datos.js";
import { estaEnRuta } from "../mi-ruta.js";
import { crearMapa, puntosDesde, leyendaHTML } from "../mapa.js";
import { AJOLOTE, ICONO, esc } from "../recursos.js";
import { tarjetaLugar, conectarCorazones } from "./comun.js";

const ctx = await iniciarPagina("inicio");
const { datos, t, txt, idioma, almacen, indice } = ctx;

const CATEGORIAS = [
  { clave: "catArtesanias", url: "categoria.html?tipo=artesanias", imagen: "cat-artesanias" },
  { clave: "catGastronomia", url: "categoria.html?tipo=gastronomia", imagen: "cat-gastronomia" },
  { clave: "catFestividades", url: "categoria.html?tipo=festividades", imagen: "cat-festividades" },
  { clave: "catSitios", url: "zonas.html", imagen: "cat-sitios" },
  { clave: "catPueblos", url: "pueblos.html", imagen: "cat-pueblos" },
];

// Destacados: 2 comunidades con foto y 2 zonas con foto.
const conFoto = (l) => l.foto && datos.fotos[l.foto];
const destacados = [
  ...visibles(datos.destinos).filter(conFoto).filter((d) => ["destino-centro-ceremonial-otomi", "destino-san-felipe-del-progreso"].includes(d.id)),
  ...visibles(datos.zonas).filter(conFoto).filter((z) => ["zona-teotihuacan", "zona-malinalco"].includes(z.id)),
];

document.getElementById("principal").innerHTML = `
  <section class="heroe" aria-labelledby="titulo-heroe">
    <img class="heroe__fondo" src="assets/img/portada-paisaje.jpg" alt="" aria-hidden="true" width="1973" height="528">
    <div class="heroe__contenido envoltura">
      <img class="heroe__ajolote" src="${AJOLOTE.saluda}" alt="${idioma === "es" ? "Ajolote mascota saludando" : "Axolotl mascot waving"}" width="260" height="312">
      <div class="heroe__texto">
        <h1 id="titulo-heroe">
          <span class="heroe__rotulo">${esc(t("heroTitulo1"))}</span>
          <span class="heroe__grande">${esc(t("heroTitulo2"))}</span>
        </h1>
        <p class="heroe__banda">${esc(t("heroBanda"))}</p>
        <p class="heroe__lema">${esc(t("heroLema"))}</p>
      </div>
      <img class="heroe__nota heroe__nota--papel" src="assets/img/${idioma === "en" ? "nota-papel-en" : "nota-papel"}.png" alt="${esc(t("heroNota"))}" width="640" height="${idioma === "en" ? 352 : 353}">
    </div>
  </section>

  <div class="buscador-grande envoltura">
    <form role="search" class="buscador-grande__form" id="form-buscar">
      <label class="solo-lector" for="buscar-portada">${esc(t("buscarBoton"))}</label>
      <span class="buscador-grande__lupa">${ICONO.lupa}</span>
      <input id="buscar-portada" type="search" autocomplete="off" placeholder="${esc(t("buscarPlaceholder"))}">
      <button class="boton" type="submit" aria-label="${esc(t("buscarBoton"))}">${ICONO.flecha}</button>
    </form>
    <ul class="buscador__resultados buscador-grande__resultados" id="resultados-portada" aria-live="polite"></ul>
  </div>

  <nav class="categorias envoltura" aria-label="${esc(idioma === "es" ? "Categorías" : "Categories")}">
    <ul>
      ${CATEGORIAS.map((c) => `
        <li class="${c.imagen === "cat-pueblos" ? "categoria-ancha" : ""}"><a class="categoria-papel" href="${c.url}">
          <img src="assets/img/${c.imagen}${idioma === "en" ? "-en" : ""}.png" alt="${esc(t(c.clave))}" loading="lazy">
        </a></li>`).join("")}
    </ul>
  </nav>

  <div class="destinos-y-pueblos envoltura">
    <section class="seccion destinos" aria-labelledby="titulo-destinos">
      <h2 id="titulo-destinos" class="cinta">${esc(t("nuestrosDestinos"))}</h2>
      <ul class="tarjetas">${destacados.map((l) => tarjetaLugar(l, ctx)).join("")}</ul>
    </section>
    <aside class="caja-pueblos" aria-labelledby="titulo-pueblos">
      <h2 id="titulo-pueblos" class="cinta cinta--verde">${esc(t("nuestrosPueblos"))}</h2>
      <p>${esc(t("nuestrosPueblosTexto"))}</p>
      <ul class="lista-pueblos">
        ${datos.pueblos.map((p) => `<li><a href="pueblo.html?id=${p.id}"><img src="assets/svg/flor-bugambilia.svg" alt="" width="20" height="20">${esc(txt(p.nombre))} <small>${esc(p.nombrePropio)}</small></a></li>`).join("")}
      </ul>
      <a class="boton" href="pueblos.html">${esc(t("conoceMas"))} ${ICONO.flecha}</a>
    </aside>
  </div>

  <section class="seccion envoltura" aria-labelledby="titulo-mapa">
    <div class="mapa-cabecera">
      <img src="${AJOLOTE.senala}" alt="" width="110" height="132">
      <div>
        <h2 id="titulo-mapa">${esc(t("mapaTitulo"))}</h2>
        <p class="intro">${esc(t("mapaTexto"))}</p>
      </div>
    </div>
    <div class="mapa" id="mapa-inicio" role="region" aria-label="${esc(t("mapaTitulo"))}"></div>
    ${leyendaHTML(t)}
    <p><a class="boton boton--verde" href="explora.html">${esc(t("irExplora"))} ${ICONO.flecha}</a></p>
  </section>`;

conectarBuscador(document.getElementById("buscar-portada"), document.getElementById("resultados-portada"), indice, t);
document.getElementById("form-buscar").addEventListener("submit", (e) => {
  e.preventDefault();
  const primero = document.querySelector("#resultados-portada a");
  if (primero) location.href = primero.href;
});
conectarCorazones(document, ctx);

// El mapa espera a que Leaflet (defer) este listo.
const iniciarMapa = () => crearMapa(document.getElementById("mapa-inicio"), puntosDesde(datos, idioma),
  { t, almacen, alCambiarRuta: ctx.actualizarRuta, zoom: 10 });
if (globalThis.L) iniciarMapa(); else window.addEventListener("load", iniciarMapa);
