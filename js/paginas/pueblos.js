// Lista de los 5 pueblos originarios.
import { iniciarPagina } from "../layout.js";
import { AJOLOTE, ICONO, esc } from "../recursos.js";
import { creditosFotos } from "./comun.js";

const ctx = await iniciarPagina("pueblos");
const { datos, t, txt } = ctx;
document.title = `${t("pueblosTitulo")} · EdoMéx`;

// Primera oracion de la resena, para la tarjeta.
const resumen = (s) => (s.match(/^.+?[.!?](\s|$)/) || [s])[0];

document.getElementById("principal").innerHTML = `
  <section class="seccion envoltura">
    <div class="cabecera-pagina">
      <img src="${AJOLOTE.lee}" alt="" width="140" height="168">
      <div><h1>${esc(t("pueblosTitulo"))}</h1><p class="intro">${esc(t("pueblosIntro"))}</p></div>
    </div>
    <ul class="pueblos">
      ${datos.pueblos.map((p) => {
        const f = p.foto && datos.fotos[p.foto];
        return `<li class="pueblo-tarjeta">
          ${f ? `<img src="${esc(f.archivo)}" alt="${esc(txt(f.alt))}" loading="lazy" width="640" height="420">` : `<img src="assets/svg/paisaje.svg" alt="" width="640" height="420">`}
          <div class="pueblo-tarjeta__texto">
            <h2><a href="pueblo.html?id=${p.id}">${esc(txt(p.nombre))}</a></h2>
            <p class="pueblo-tarjeta__propio">${esc(p.nombrePropio)} · ${esc(txt(p.lengua))}</p>
            <p>${esc(resumen(txt(p.resena)))}</p>
            <span class="pueblo-tarjeta__mas" aria-hidden="true">${esc(t("conoceMas"))} ${ICONO.flecha}</span>
          </div>
        </li>`;
      }).join("")}
    </ul>
    ${creditosFotos(datos.pueblos.map((p) => p.foto), ctx)}
  </section>`;
