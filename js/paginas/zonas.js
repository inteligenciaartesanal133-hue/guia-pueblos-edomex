// Zonas arqueologicas (apartado extra).
import { iniciarPagina } from "../layout.js";
import { visibles } from "../datos.js";
import { crearMapa, puntosDesde, leyendaHTML } from "../mapa.js";
import { esc } from "../recursos.js";
import { detalleLugar, conectarCorazones, irAlAncla } from "./comun.js";

const ctx = await iniciarPagina("zonas");
const { datos, t, idioma, almacen } = ctx;
document.title = `${t("zonasTitulo")} · EdoMéx`;
const zonas = visibles(datos.zonas);

const main = document.getElementById("principal");
main.innerHTML = `
  <section class="seccion envoltura">
    <div class="cabecera-pagina">
      <img src="assets/svg/ico-sitios.svg" alt="" width="90" height="90" class="cabecera-pagina__icono">
      <div><h1>${esc(t("zonasTitulo"))}</h1><p class="intro">${esc(t("zonasIntro"))}</p></div>
    </div>
    <div class="mapa" id="mapa-zonas" role="region" aria-label="${esc(t("zonasTitulo"))}"></div>
    ${leyendaHTML(t)}
  </section>
  <div class="envoltura lugares">${zonas.map((z) => detalleLugar(z, ctx)).join("")}</div>`;

conectarCorazones(main, ctx);
irAlAncla();
const iniciar = () => crearMapa(document.getElementById("mapa-zonas"), puntosDesde(datos, idioma, { tipo: "zona" }),
  { t, almacen, alCambiarRuta: ctx.actualizarRuta });
if (globalThis.L) iniciar(); else window.addEventListener("load", iniciar);
