// Ficha de un pueblo: pueblo.html?id=otomi
import { iniciarPagina } from "../layout.js";
import { visibles } from "../datos.js";
import { crearMapa, puntosDesde, leyendaHTML } from "../mapa.js";
import { esc } from "../recursos.js";
import { noEncontrado, tarjetaLugar, conectarCorazones, creditosFotos, fuentesHTML } from "./comun.js";

const ctx = await iniciarPagina("pueblos");
const { datos, t, txt, idioma, almacen } = ctx;
const main = document.getElementById("principal");

const id = new URLSearchParams(location.search).get("id");
const p = datos.pueblos.find((x) => x.id === id);

const ICONO_BLOQUE = { gastronomia: "gastronomia", festividades: "festividades", artesanias: "artesanias", costumbres: "pueblos" };

if (!p) {
  document.title = `${t("noEncontrado")} · EdoMéx`;
  main.innerHTML = noEncontrado(t);
} else {
  document.title = `${txt(p.nombre)} (${p.nombrePropio}) · EdoMéx`;
  const f = p.foto && datos.fotos[p.foto];
  const frases = visibles(p.frases);
  const destinos = visibles(datos.destinos).filter((d) => d.pueblo === p.id);

  const lista = (clave, conFecha = false) => {
    const items = visibles(p[clave]);
    if (!items.length) return "";
    return `<section class="bloque" aria-labelledby="t-${clave}">
      <h2 id="t-${clave}"><img src="assets/svg/ico-${ICONO_BLOQUE[clave]}.svg" alt="" width="32" height="32"> ${esc(t(clave))}</h2>
      <ul class="elementos">${items.map((e) => `<li class="elemento">
        <h3>${esc(txt(e.nombre))}</h3>
        ${conFecha && e.fecha ? `<p class="elemento__fecha">${esc(txt(e.fecha))}</p>` : ""}
        <p>${esc(txt(e.descripcion))}</p>
      </li>`).join("")}</ul>
    </section>`;
  };

  main.innerHTML = `
    <section class="portada-pueblo">
      ${f ? `<img class="portada-pueblo__foto" src="${esc(f.archivo)}" alt="${esc(txt(f.alt))}" width="1280" height="720">` : ""}
      <div class="portada-pueblo__texto envoltura">
        <p class="rotulo">${esc(p.nombrePropio)}</p>
        <h1>${esc(txt(p.nombre))}</h1>
        <p><strong>${esc(t("lengua"))}:</strong> ${esc(txt(p.lengua))}</p>
      </div>
    </section>
    <div class="envoltura ficha">
      <p class="ficha__resena">${esc(txt(p.resena))}</p>
      ${frases.length ? `<section class="bloque" aria-labelledby="t-frases">
        <h2 id="t-frases">${esc(t("frases"))}</h2>
        <ul class="frases">${frases.map((fr) => `<li class="frase"><span class="frase__original">${esc(fr.original)}</span><span>${esc(fr[idioma] || fr.es)}</span></li>`).join("")}</ul>
      </section>` : ""}
      ${lista("gastronomia")}
      ${lista("festividades", true)}
      ${lista("artesanias")}
      ${lista("costumbres")}
      <section class="bloque" aria-labelledby="t-donde">
        <h2 id="t-donde">${esc(t("dondeViven"))}</h2>
        <p>${p.municipios.map((m) => esc(m.nombre)).join(" · ")}</p>
        <div class="mapa" id="mapa-pueblo" role="region" aria-label="${esc(t("dondeViven"))}"></div>
        ${leyendaHTML(t)}
      </section>
      ${destinos.length ? `<section class="bloque" aria-labelledby="t-lugares">
        <h2 id="t-lugares">${esc(t("lugaresVisitar"))}</h2>
        <ul class="tarjetas">${destinos.map((d) => tarjetaLugar(d, ctx)).join("")}</ul>
      </section>` : ""}
      ${fuentesHTML(p.fuentes, t)}
      ${creditosFotos([p.foto, ...destinos.map((d) => d.foto)], ctx)}
    </div>`;

  conectarCorazones(main, ctx);
  const puntos = puntosDesde(datos, idioma, { pueblo: p.id });
  const iniciar = () => {
    const L = globalThis.L;
    const { mapa } = crearMapa(document.getElementById("mapa-pueblo"), puntos, { t, almacen, alCambiarRuta: ctx.actualizarRuta, zoom: 10 });
    // Los municipios donde vive el pueblo se marcan como circulos suaves.
    for (const m of p.municipios) {
      L.circle([m.lat, m.lon], { radius: 2500, color: "#6D2468", weight: 1.5, fillColor: "#C2185B", fillOpacity: 0.12 })
        .bindTooltip(m.nombre).addTo(mapa);
    }
    const todos = [...puntos.map((x) => [x.lat, x.lon]), ...p.municipios.map((m) => [m.lat, m.lon])];
    if (todos.length) mapa.fitBounds(L.latLngBounds(todos), { padding: [40, 40], maxZoom: 11 });
  };
  if (globalThis.L) iniciar(); else window.addEventListener("load", iniciar);
}
