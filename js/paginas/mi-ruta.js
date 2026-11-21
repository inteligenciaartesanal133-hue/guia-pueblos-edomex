// Mi Ruta: lista personal de lugares guardados con ♥ (solo en este navegador).
import { iniciarPagina } from "../layout.js";
import { visibles } from "../datos.js";
import { leerRuta } from "../mi-ruta.js";
import { crearMapa, puntosDesde, leyendaHTML } from "../mapa.js";
import { AJOLOTE, esc } from "../recursos.js";
import { detalleLugar, conectarCorazones } from "./comun.js";

const ctx = await iniciarPagina("mi-ruta");
const { datos, t, idioma, almacen } = ctx;
document.title = `${t("miRutaTitulo")} · EdoMéx`;
const main = document.getElementById("principal");
let mapa = null;

function pintar() {
  const ids = new Set(leerRuta(almacen));
  const lugares = [...visibles(datos.destinos), ...visibles(datos.zonas)].filter((l) => ids.has(l.id));
  const puntos = puntosDesde(datos, idioma).filter((p) => ids.has(p.id));

  if (!lugares.length) {
    main.innerHTML = `
      <section class="seccion envoltura">
        <h1>${esc(t("miRutaTitulo"))}</h1>
        <p class="intro">${esc(t("miRutaIntro"))}</p>
        <div class="vacio">
          <img src="${AJOLOTE.senala}" alt="" width="200" height="240">
          <p>${esc(t("miRutaVacia"))}</p>
          <a class="boton" href="explora.html">${esc(t("irExplora"))}</a>
        </div>
      </section>`;
    mapa = null;
    return;
  }
  if (!mapa) {
    main.innerHTML = `
      <section class="seccion envoltura">
        <h1>${esc(t("miRutaTitulo"))}</h1>
        <p class="intro">${esc(t("miRutaIntro"))}</p>
        <div class="mapa" id="mapa-ruta" role="region" aria-label="${esc(t("miRutaTitulo"))}"></div>
        ${leyendaHTML(t)}
      </section>
      <div class="envoltura lugares" id="lista-ruta"></div>`;
    const iniciar = () => { mapa = crearMapa(document.getElementById("mapa-ruta"), puntos, { t, almacen, alCambiarRuta: () => { ctx.actualizarRuta(); pintar(); } }); };
    if (globalThis.L) iniciar(); else window.addEventListener("load", iniciar);
  } else {
    mapa.pintar(puntos);
  }
  document.getElementById("lista-ruta").innerHTML = lugares.map((l) => detalleLugar(l, ctx)).join("");
}

// Al quitar un lugar con ♥, la lista se vuelve a pintar.
conectarCorazones(main, ctx, () => pintar());
pintar();
