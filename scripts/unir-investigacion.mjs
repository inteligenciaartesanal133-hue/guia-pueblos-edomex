// Junta los borradores de docs/investigacion/borradores/ en data/*.json.
// Uso: node scripts/unir-investigacion.mjs
import { readFileSync, writeFileSync } from "node:fs";

const dir = "docs/investigacion/borradores/";
const leer = (f) => JSON.parse(readFileSync(dir + f, "utf8"));
const ids = ["otomi", "mazahua", "nahua", "matlatzinca", "tlahuica"];

const pueblos = ids.map((i) => leer(`pueblo-${i}.json`));
const destinos = ids.flatMap((i) => leer(`destinos-${i}.json`));
const zonas = leer("zonas.json");

// Correccion: Ocuilan pertenece al pueblo tlahuica, no al matlatzinca.
const matla = pueblos.find((p) => p.id === "matlatzinca");
matla.municipios = matla.municipios.filter((m) => !/ocuilan/i.test(m.nombre));


// Coordenadas confirmadas con OpenStreetMap (Nominatim, 20-nov-2026). Al confirmarlas,
// el lugar se puede mostrar: su unico pendiente eran las coordenadas o el tiempo
// aproximado de "como llegar", que la pagina presenta como aproximado.
const confirmados = {
  "destino-centro-ceremonial-mazahua": [19.5738, -99.9626],
  "destino-sacromonte-amecameca": [19.1273, -98.776],
  "destino-san-francisco-oxtotilpan": [19.1688, -99.902],
  "destino-nevado-de-toluca": [19.1079, -99.7555],
  "destino-san-juan-atzingo": [19.0107, -99.3851],
  "zona-huamango": [19.9788, -99.8686],
  "zona-san-miguel-ixtapan": [18.8072, -100.1505],
};
for (const l of [...destinos, ...zonas]) {
  const c = confirmados[l.id];
  if (c) { [l.lat, l.lon] = c; l.verificado = true; }
}

// Fotos: quitamos las nulas y apuntamos al archivo local que se descarga despues.
const fotos = {};
for (const f of [...ids, "zonas"]) {
  for (const [clave, v] of Object.entries(leer(`fotos-${f}.json`))) {
    if (!v) continue;
    fotos[clave] = {
      archivo: `assets/img/${clave}.jpg`,
      archivo_commons: v.archivo_commons,
      autor: v.autor,
      licencia: v.licencia,
      url_original: v.url_original,
      alt: v.alt,
    };
  }
}
// Fotos cuyo archivo no existe en Commons (la descarga dio 404).
for (const clave of ["destino-temascaltepec"]) delete fotos[clave];
// Las claves de foto sin imagen libre quedan en null.
for (const l of [...pueblos, ...destinos, ...zonas]) {
  if (l.foto && !fotos[l.foto]) l.foto = null;
}

const escribir = (n, d) => writeFileSync(`data/${n}.json`, JSON.stringify(d, null, 2) + "\n");
escribir("pueblos", pueblos);
escribir("destinos", destinos);
escribir("zonas", zonas);
escribir("fotos", fotos);
console.log(`pueblos ${pueblos.length}, destinos ${destinos.length}, zonas ${zonas.length}, fotos ${Object.keys(fotos).length}`);
