// mapa.js — mapas con Leaflet (vendor/leaflet) y teselas de OpenStreetMap.
// Leaflet se carga con <script src="vendor/leaflet/leaflet.js"> y queda como "L" global.
import { texto, visibles } from "./datos.js";
import { estaEnRuta, alternar } from "./mi-ruta.js";
import { ICONO, esc } from "./recursos.js";

// Convierte destinos y zonas (solo los verificados) en puntos para el mapa.
// filtro: { pueblo?: "otomi", tipo?: "comunidad" | "zona" }
export function puntosDesde(datos, idioma, filtro = {}) {
  const foto = (clave) => (clave && datos.fotos[clave] ? datos.fotos[clave].archivo : null);
  const destinos = visibles(datos.destinos).map((d) => ({
    id: d.id, tipo: "comunidad", pueblo: d.pueblo, lat: d.lat, lon: d.lon,
    titulo: texto(d.nombre, idioma), foto: foto(d.foto), url: `explora.html#${d.id}`,
  }));
  const zonas = visibles(datos.zonas).map((z) => ({
    id: z.id, tipo: "zona", pueblo: null, lat: z.lat, lon: z.lon,
    titulo: texto(z.nombre, idioma), foto: foto(z.foto), url: `zonas.html#${z.id}`,
  }));
  return [...destinos, ...zonas].filter((p) =>
    (!filtro.tipo || p.tipo === filtro.tipo) && (!filtro.pueblo || p.pueblo === filtro.pueblo));
}

// Crea el mapa dentro de "elemento". Devuelve el mapa y una funcion para cambiar los puntos.
export function crearMapa(elemento, puntos, { t, almacen, alCambiarRuta = () => {}, zoom } = {}) {
  const L = globalThis.L;
  const mapa = L.map(elemento, { scrollWheelZoom: false, zoomControl: true });
  const capa = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(mapa);

  // Si las teselas no cargan (sin internet), avisamos sin romper nada.
  let fallas = 0;
  capa.on("tileerror", () => {
    fallas += 1;
    if (fallas === 3 && !elemento.querySelector(".mapa__aviso")) {
      const aviso = document.createElement("p");
      aviso.className = "mapa__aviso";
      aviso.textContent = t("mapaSinInternet");
      elemento.appendChild(aviso);
    }
  });

  const grupo = L.layerGroup().addTo(mapa);

  function pintar(lista) {
    grupo.clearLayers();
    for (const p of lista) {
      const icono = L.divIcon({ className: `marcador marcador--${p.tipo}`, iconSize: [22, 22] });
      const marcador = L.marker([p.lat, p.lon], { icon: icono, title: p.titulo, alt: p.titulo, keyboard: true });
      marcador.bindPopup(() => ventanita(p));
      grupo.addLayer(marcador);
    }
    if (lista.length) {
      mapa.fitBounds(L.latLngBounds(lista.map((p) => [p.lat, p.lon])), { padding: [36, 36], maxZoom: zoom ?? 11 });
    } else {
      mapa.setView([19.35, -99.6], 8);
    }
  }

  function ventanita(p) {
    const caja = document.createElement("div");
    caja.className = "ventanita";
    const guardado = estaEnRuta(almacen, p.id);
    caja.innerHTML = `
      ${p.foto ? `<img src="${esc(p.foto)}" alt="" loading="lazy">` : ""}
      <strong>${esc(p.titulo)}</strong>
      <span class="ventanita__acciones">
        <a href="${esc(p.url)}">${esc(t("verMas"))}</a>
        <button type="button" class="boton-corazon" aria-pressed="${guardado}" aria-label="${esc(t(guardado ? "quitar" : "guardar"))}: ${esc(p.titulo)}">${guardado ? ICONO.corazonLleno : ICONO.corazon}</button>
      </span>`;
    caja.querySelector("button").addEventListener("click", (e) => {
      const b = e.currentTarget;
      const ahora = alternar(almacen, p.id);
      b.setAttribute("aria-pressed", String(ahora));
      b.setAttribute("aria-label", `${t(ahora ? "quitar" : "guardar")}: ${p.titulo}`);
      b.innerHTML = ahora ? ICONO.corazonLleno : ICONO.corazon;
      alCambiarRuta();
    });
    return caja;
  }

  pintar(puntos);
  // Si el contenedor cambia de tamano (fuentes, imagenes), Leaflet debe recalcular.
  new ResizeObserver(() => mapa.invalidateSize()).observe(elemento);
  return { mapa, pintar };
}

// Leyenda de colores, con texto (no solo color).
export function leyendaHTML(t) {
  return `<p class="leyenda"><span><i class="punto punto--comunidad"></i>${esc(t("leyendaComunidad"))}</span><span><i class="punto punto--zona"></i>${esc(t("leyendaZona"))}</span></p>`;
}
