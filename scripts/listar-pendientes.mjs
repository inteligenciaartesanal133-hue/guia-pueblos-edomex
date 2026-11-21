// Genera docs/investigacion-pendiente.md y docs/fotos-faltantes.md a partir de data/.
import { readFileSync, writeFileSync } from "node:fs";
const r = (n) => JSON.parse(readFileSync(`data/${n}.json`, "utf8"));
const pueblos = r("pueblos"), destinos = r("destinos"), zonas = r("zonas");

let md = "# Datos por verificar\n\nEstos datos están guardados pero **no se muestran** en la página (`\"verificado\": false`). " +
  "Si el equipo confirma alguno con una fuente seria, cambien `verificado` a `true` en el borrador de `docs/investigacion/borradores/` " +
  "y vuelvan a ejecutar `node scripts/unir-investigacion.mjs`.\n\n";
for (const p of pueblos) {
  const pend = ["gastronomia", "festividades", "artesanias", "costumbres"]
    .flatMap((k) => p[k].filter((e) => e.verificado === false).map((e) => `- ${k}: **${e.nombre.es}** (fuente: ${e.fuente || "ninguna"})`));
  if (pend.length) md += `## ${p.nombre.es}\n${pend.join("\n")}\n\n`;
}
const lugares = [...destinos, ...zonas].filter((l) => l.verificado === false);
md += "## Lugares ocultos\n" + lugares.map((l) => `- **${l.nombre.es}** (${l.municipio})`).join("\n") + "\n\n";
md += "## Revisar a mano\n" +
  "- Frases matlatzincas: confirmar acentos y apóstrofos contra el prontuario INALI «Bot'una» (el texto se extrajo de un PDF).\n" +
  "- Frases tlahuicas: son nombres de platillos del libro *Cinco sabores tradicionales mexiquenses*; no son saludos.\n" +
  "- Otomí, mazahua y nahua: no tienen frases porque no hubo fuente legible. El cuadernillo «Aprendiendo otomí, Temoaya» (gob.mx) es un PDF de imágenes.\n" +
  "- Los tiempos de «cómo llegar» son aproximados.\n";
writeFileSync("docs/investigacion-pendiente.md", md);

const sinFoto = [...pueblos, ...destinos, ...zonas].filter((l) => !l.foto);
writeFileSync("docs/fotos-faltantes.md", "# Fotos faltantes\n\nNo se encontró foto con licencia libre en Wikimedia Commons para:\n\n" +
  sinFoto.map((l) => `- ${typeof l.nombre === "string" ? l.nombre : l.nombre.es} (\`${l.id}\`)`).join("\n") + "\n\nLa página muestra una ilustración en su lugar.\n");
console.log("pendientes", lugares.length, "sin foto", sinFoto.length);
