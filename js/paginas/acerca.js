// Acerca del proyecto: que es, el ajolote asistente, equipo y todas las fuentes.
import { iniciarPagina } from "../layout.js";
import { lugaresVisibles } from "../datos.js";
import { AJOLOTE, esc } from "../recursos.js";

const ctx = await iniciarPagina("acerca");
const { datos, t, idioma } = ctx;
document.title = `${t("acercaTitulo")} · EdoMéx`;

const TEXTO = {
  es: {
    queEs: [
      "Esta guía reúne información de los cinco pueblos originarios que viven en el Estado de México —otomí (hñähñu), mazahua (jñatjo), nahua, matlatzinca (bot'una) y tlahuica (pjiekak'joo)— y de las zonas arqueológicas del estado.",
      "Es una guía informativa: no vendemos viajes ni hacemos reservaciones. Queremos que quien la visite conozca a estas comunidades vivas, su comida, sus fiestas y su lengua, y que viaje con respeto.",
      "Cada dato tiene una fuente. Lo que no pudimos confirmar se queda fuera hasta verificarlo.",
    ],
    ajolote: [
      "El ajolote de esta página también existe fuera de la pantalla: es un pequeño asistente de voz con pantalla redonda. Le dices «Axolotl» y tu pregunta, y te responde con la misma información de esta guía.",
      "Elegimos al ajolote porque es un animal endémico del centro de México y un símbolo de nuestra biodiversidad.",
    ],
    equipo: "Equipo Axolotl · Tecnológico de Estudios Superiores de Tianguistenco · Proyecto escolar, 2026.",
  },
  en: {
    queEs: [
      "This guide brings together information about the five original peoples who live in the State of Mexico —Otomí (Hñähñu), Mazahua (Jñatjo), Nahua, Matlatzinca (Bot'una) and Tlahuica (Pjiekak'joo)— and about the state's archaeological sites.",
      "It is an informational guide: we do not sell trips or take bookings. We want visitors to get to know these living communities, their food, festivals and language, and to travel with respect.",
      "Every fact has a source. Anything we could not confirm stays out until it is verified.",
    ],
    ajolote: [
      "The axolotl on this site also exists off the screen: it is a small voice assistant with a round display. Say “Axolotl” and your question, and it answers with the same information as this guide.",
      "We chose the axolotl because it is endemic to central Mexico and a symbol of our biodiversity.",
    ],
    equipo: "Team Axolotl · Tecnológico de Estudios Superiores de Tianguistenco · School project, 2026.",
  },
}[idioma];

// Todas las fuentes, sin repetir.
const fuentes = new Map();
for (const l of lugaresVisibles(datos)) {
  for (const f of l.fuentes || []) if (f.url && !fuentes.has(f.url)) fuentes.set(f.url, f.titulo || f.url);
}

document.getElementById("principal").innerHTML = `
  <section class="seccion envoltura acerca">
    <h1>${esc(t("acercaTitulo"))}</h1>
    <h2>${esc(t("acercaQueEs"))}</h2>
    ${TEXTO.queEs.map((p) => `<p>${esc(p)}</p>`).join("")}
    <div class="acerca__ajolote">
      <img src="${AJOLOTE.saluda}" alt="" width="200" height="240">
      <div>
        <h2>${esc(t("acercaAjolote"))}</h2>
        ${TEXTO.ajolote.map((p) => `<p>${esc(p)}</p>`).join("")}
      </div>
    </div>
    <h2>${esc(t("acercaEquipo"))}</h2>
    <p>${esc(TEXTO.equipo)}</p>
    <p class="rotulo">${esc(t("pieLema"))}</p>
    <h2>${esc(t("acercaFuentes"))}</h2>
    <p>${esc(t("fotosFaltan"))}</p>
    <ul class="lista-fuentes">${[...fuentes].map(([url, titulo]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener">${esc(titulo)}</a></li>`).join("")}</ul>
  </section>`;
