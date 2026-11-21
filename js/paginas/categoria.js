// Una categoria (artesanias, gastronomia o festividades) en todos los pueblos.
import { iniciarPagina } from "../layout.js";
import { visibles } from "../datos.js";
import { esc } from "../recursos.js";
import { noEncontrado } from "./comun.js";

const TIPOS = ["artesanias", "gastronomia", "festividades"];

const ctx = await iniciarPagina("");
const { datos, t, txt } = ctx;
const main = document.getElementById("principal");
const tipo = new URLSearchParams(location.search).get("tipo");

if (!TIPOS.includes(tipo)) {
  main.innerHTML = noEncontrado(t, { url: "index.html", clave: "irInicio" });
} else {
  document.title = `${t(tipo)} · EdoMéx`;
  main.innerHTML = `
    <section class="seccion envoltura">
      <div class="cabecera-pagina">
        <img src="assets/svg/ico-${tipo}.svg" alt="" width="90" height="90" class="cabecera-pagina__icono">
        <div><h1>${esc(t(tipo))}</h1><p class="intro">${esc(t("categoriaDe"))}</p></div>
      </div>
      ${datos.pueblos.map((p) => {
        const items = visibles(p[tipo]);
        if (!items.length) return "";
        return `<section class="bloque" aria-labelledby="c-${p.id}">
          <h2 id="c-${p.id}"><a href="pueblo.html?id=${p.id}">${esc(txt(p.nombre))}</a> <small class="rotulo">${esc(p.nombrePropio)}</small></h2>
          <ul class="elementos">${items.map((e) => `<li class="elemento">
            <h3>${esc(txt(e.nombre))}</h3>
            ${e.fecha ? `<p class="elemento__fecha">${esc(txt(e.fecha))}</p>` : ""}
            <p>${esc(txt(e.descripcion))}</p></li>`).join("")}</ul>
        </section>`;
      }).join("")}
    </section>`;
}
