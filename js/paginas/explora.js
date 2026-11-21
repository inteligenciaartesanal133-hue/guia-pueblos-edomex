// Explora: mapa grande con filtros y la lista de lugares.
import { iniciarPagina } from "../layout.js";
import { visibles } from "../datos.js";
import { crearMapa, puntosDesde, leyendaHTML } from "../mapa.js";
import { esc } from "../recursos.js";
import { detalleLugar, conectarCorazones, irAlAncla } from "./comun.js";

const ctx = await iniciarPagina("explora");
const { datos, t, txt, idioma, almacen } = ctx;
document.title = `${t("exploraTitulo")} · EdoMéx`;

const main = document.getElementById("principal");
main.innerHTML = `
  <section class="seccion envoltura">
    <h1>${esc(t("exploraTitulo"))}</h1>
    <p class="intro">${esc(t("exploraIntro"))}</p>
    <form class="filtros" id="filtros">
      <label>${esc(t("filtroPueblo"))}
        <select name="pueblo"><option value="">${esc(t("filtroTodos"))}</option>
          ${datos.pueblos.map((p) => `<option value="${p.id}">${esc(txt(p.nombre))}</option>`).join("")}</select>
      </label>
      <label>${esc(t("filtroTipo"))}
        <select name="tipo"><option value="">${esc(t("filtroTodos"))}</option>
          <option value="comunidad">${esc(t("leyendaComunidad"))}</option>
          <option value="zona">${esc(t("leyendaZona"))}</option></select>
      </label>
      <p class="filtros__cuenta" id="cuenta" aria-live="polite"></p>
    </form>
    <div class="mapa mapa--grande" id="mapa-explora" role="region" aria-label="${esc(t("exploraTitulo"))}"></div>
    ${leyendaHTML(t)}
  </section>
  <div class="envoltura lugares" id="lista"></div>`;

const form = document.getElementById("filtros");
let mapa = null;

function filtro() {
  const f = Object.fromEntries(new FormData(form));
  return { pueblo: f.pueblo || undefined, tipo: f.tipo || undefined };
}

function actualizar() {
  const fil = filtro();
  const puntos = puntosDesde(datos, idioma, fil);
  // Las zonas no pertenecen a un pueblo: si se filtra por pueblo, solo quedan sus comunidades.
  const ids = new Set(puntos.map((p) => p.id));
  const lugares = [...visibles(datos.destinos), ...visibles(datos.zonas)].filter((l) => ids.has(l.id));
  document.getElementById("lista").innerHTML = lugares.map((l) => detalleLugar(l, ctx)).join("");
  document.getElementById("cuenta").textContent = `${lugares.length} ${t("resultados")}`;
  if (mapa) mapa.pintar(puntos);
}

form.addEventListener("change", actualizar);
conectarCorazones(main, ctx);
actualizar();
irAlAncla();

const iniciar = () => { mapa = crearMapa(document.getElementById("mapa-explora"), puntosDesde(datos, idioma, filtro()), { t, almacen, alCambiarRuta: ctx.actualizarRuta }); };
if (globalThis.L) iniciar(); else window.addEventListener("load", iniciar);
