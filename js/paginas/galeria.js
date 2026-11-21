// Galeria de fotos con su credito.
import { iniciarPagina } from "../layout.js";
import { fotosVisibles } from "../datos.js";
import { ICONO, esc } from "../recursos.js";

const ctx = await iniciarPagina("galeria");
const { datos, t, txt } = ctx;
document.title = `${t("galeriaTitulo")} · EdoMéx`;
const fotos = fotosVisibles(datos);

const main = document.getElementById("principal");
main.innerHTML = `
  <section class="seccion envoltura">
    <h1>${esc(t("galeriaTitulo"))}</h1>
    <p class="intro">${esc(t("galeriaIntro"))}</p>
    <ul class="galeria">
      ${fotos.map(([clave, f], i) => `<li><button type="button" class="galeria__boton" data-i="${i}">
        <img src="${esc(f.archivo)}" alt="${esc(txt(f.alt))}" loading="lazy" width="400" height="300"></button></li>`).join("")}
    </ul>
  </section>
  <dialog class="visor" id="visor" aria-labelledby="visor-titulo">
    <form method="dialog"><button class="boton-icono visor__cerrar" aria-label="${esc(t("cerrar"))}">${ICONO.cerrar}</button></form>
    <img id="visor-img" alt="">
    <div class="visor__pie">
      <p id="visor-titulo"></p>
      <p class="creditos" id="visor-credito"></p>
    </div>
  </dialog>`;

const visor = document.getElementById("visor");
main.querySelector(".galeria").addEventListener("click", (e) => {
  const b = e.target.closest(".galeria__boton");
  if (!b) return;
  const [, f] = fotos[Number(b.dataset.i)];
  const img = document.getElementById("visor-img");
  img.src = f.archivo;
  img.alt = txt(f.alt);
  document.getElementById("visor-titulo").textContent = txt(f.alt);
  document.getElementById("visor-credito").innerHTML =
    `${esc(t("creditoFoto"))}: ${esc(f.autor)} · ${esc(t("licencia"))}: ${esc(f.licencia)} · <a href="${esc(f.url_original)}" target="_blank" rel="noopener">${esc(t("verOriginal"))}</a>`;
  visor.showModal();
});
// Cerrar al tocar fuera de la foto
visor.addEventListener("click", (e) => { if (e.target === visor) visor.close(); });
