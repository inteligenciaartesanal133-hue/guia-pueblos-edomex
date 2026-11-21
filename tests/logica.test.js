// Pruebas de la logica de la pagina (sin navegador).
import { test } from "node:test";
import assert from "node:assert/strict";
import { texto, visibles, buscarPorId, cargarDatos } from "../js/datos.js";
import { crearAlmacen, idiomaActual, cambiarIdioma, tr } from "../js/i18n.js";
import { normalizar, crearIndice, buscar } from "../js/buscar.js";
import { leerRuta, estaEnRuta, alternar } from "../js/mi-ruta.js";

// ---------- datos.js ----------
test("texto elige el idioma y cae a espanol", () => {
  assert.equal(texto({ es: "Hola", en: "Hello" }, "en"), "Hello");
  assert.equal(texto({ es: "Hola" }, "en"), "Hola");
  assert.equal(texto("Temoaya", "en"), "Temoaya");
  assert.equal(texto(undefined, "es"), "");
});

test("visibles quita lo no verificado", () => {
  assert.equal(visibles([{ verificado: true }, { verificado: false }, {}]).length, 2);
});

test("cargarDatos avisa SIN_SERVIDOR al abrir con file://", async () => {
  const fetchFalla = () => Promise.reject(new TypeError("Failed to fetch"));
  await assert.rejects(cargarDatos("", { fetch: fetchFalla, protocolo: "file:" }), /SIN_SERVIDOR/);
  await assert.rejects(cargarDatos("", { fetch: fetchFalla, protocolo: "http:" }), /SIN_DATOS/);
});

// ---------- i18n.js ----------
const storageQueFalla = {
  getItem() { throw new Error("bloqueado"); },
  setItem() { throw new Error("bloqueado"); },
};

test("el almacen sigue funcionando si localStorage falla", () => {
  const alm = crearAlmacen(storageQueFalla);
  alm.guardar("a", "1");
  assert.equal(alm.leer("a"), "1");
});

test("idiomaActual ignora valores invalidos", () => {
  const alm = crearAlmacen(storageQueFalla);
  assert.equal(idiomaActual(alm), "es");
  alm.guardar("idioma", "fr");
  assert.equal(idiomaActual(alm), "es");
  cambiarIdioma(alm, "en");
  assert.equal(idiomaActual(alm), "en");
});

test("tr devuelve la clave si falta el texto", () => {
  assert.equal(tr({ hola: "Hola" }, "hola"), "Hola");
  assert.equal(tr({}, "nada"), "nada");
});

// ---------- buscar.js ----------
const datosPrueba = {
  pueblos: [{
    id: "otomi", nombre: { es: "Otomí", en: "Otomí" }, nombrePropio: "Hñähñu",
    resena: { es: "Pueblo del norte", en: "Northern people" },
    gastronomia: [
      { id: "tamal", nombre: { es: "Tamal de ceniza", en: "Tamal de ceniza" }, descripcion: { es: "d", en: "d" }, verificado: true },
      { id: "sec", nombre: { es: "Secreto", en: "Secret" }, descripcion: { es: "x", en: "x" }, verificado: false },
    ],
    festividades: [], artesanias: [], costumbres: [],
  }],
  destinos: [{ id: "destino-centro", pueblo: "otomi", nombre: { es: "Centro Ceremonial", en: "Ceremonial Center" }, resena: { es: "r", en: "r" }, verificado: true }],
  zonas: [{ id: "zona-malinalco", nombre: { es: "Malinalco", en: "Malinalco" }, resena: { es: "r", en: "r" }, verificado: true }],
  fotos: {},
};

test("normalizar quita acentos, mayusculas y signos", () => {
  assert.equal(normalizar("¡OTOMÍ!"), "otomi");
});

test("buscar encuentra platillos y lleva a la ficha del pueblo", () => {
  const indice = crearIndice(datosPrueba, "es");
  assert.equal(buscar(indice, "tamal")[0].url, "pueblo.html?id=otomi");
  assert.ok(buscar(indice, "otomi").length >= 1);
  assert.equal(buscar(indice, "MALINALCO")[0].url, "zonas.html#zona-malinalco");
});

test("buscar con consulta vacia no devuelve nada", () => {
  const indice = crearIndice(datosPrueba, "es");
  assert.deepEqual(buscar(indice, "   "), []);
});

test("buscar no muestra datos sin verificar", () => {
  const indice = crearIndice(datosPrueba, "es");
  assert.deepEqual(buscar(indice, "secreto"), []);
});

test("buscarPorId distingue pueblo, destino y zona", () => {
  assert.equal(buscarPorId(datosPrueba, "otomi").tipo, "pueblo");
  assert.equal(buscarPorId(datosPrueba, "zona-malinalco").tipo, "zona");
  assert.equal(buscarPorId(datosPrueba, "nada"), null);
});

// ---------- mi-ruta.js ----------
test("alternar agrega y quita lugares de Mi Ruta", () => {
  const alm = crearAlmacen(storageQueFalla);
  assert.equal(alternar(alm, "zona-malinalco"), true);
  assert.equal(estaEnRuta(alm, "zona-malinalco"), true);
  assert.equal(alternar(alm, "zona-malinalco"), false);
  assert.deepEqual(leerRuta(alm), []);
});

test("leerRuta tolera datos danados", () => {
  const alm = crearAlmacen(storageQueFalla);
  alm.guardar("miRuta", "{roto");
  assert.deepEqual(leerRuta(alm), []);
});

// ---------- mapa.js ----------
import { puntosDesde } from "../js/mapa.js";
import { esc } from "../js/recursos.js";

const datosMapa = {
  pueblos: [], fotos: { "zona-a": { archivo: "assets/img/zona-a.jpg" } },
  destinos: [
    { id: "destino-a", pueblo: "otomi", nombre: { es: "A", en: "A" }, lat: 19.5, lon: -99.5, foto: null, verificado: true },
    { id: "destino-oculto", pueblo: "otomi", nombre: { es: "O", en: "O" }, lat: 19.5, lon: -99.5, foto: null, verificado: false },
  ],
  zonas: [{ id: "zona-a", nombre: { es: "Z", en: "Z" }, lat: 19.6, lon: -98.8, foto: "zona-a", verificado: true }],
};

test("puntosDesde excluye lugares no verificados", () => {
  const ids = puntosDesde(datosMapa, "es").map((p) => p.id);
  assert.deepEqual(ids.sort(), ["destino-a", "zona-a"]);
});

test("puntosDesde filtra por tipo y por pueblo", () => {
  assert.deepEqual(puntosDesde(datosMapa, "es", { tipo: "zona" }).map((p) => p.id), ["zona-a"]);
  assert.deepEqual(puntosDesde(datosMapa, "es", { pueblo: "otomi" }).map((p) => p.id), ["destino-a"]);
  const z = puntosDesde(datosMapa, "es", { tipo: "zona" })[0];
  assert.equal(z.foto, "assets/img/zona-a.jpg");
  assert.equal(z.url, "zonas.html#zona-a");
});

test("esc evita que un texto rompa el HTML", () => {
  assert.equal(esc('<b>"hola"</b>'), "&lt;b&gt;&quot;hola&quot;&lt;/b&gt;");
});

// ---------- correcciones de la revision final ----------
import { fotosVisibles } from "../js/datos.js";

test("crearAlmacen funciona aunque leer window.localStorage lance error", () => {
  const previo = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", { configurable: true, get() { throw new Error("SecurityError"); } });
  try {
    const alm = crearAlmacen();
    alm.guardar("a", "1");
    assert.equal(alm.leer("a"), "1");
  } finally {
    if (previo) Object.defineProperty(globalThis, "localStorage", previo); else delete globalThis.localStorage;
  }
});

test("idiomaActual toma el idioma de la URL (?lang=en) aunque no haya almacenamiento", () => {
  const alm = crearAlmacen(storageQueFalla);
  assert.equal(idiomaActual(alm, "?lang=en"), "en");
  assert.equal(idiomaActual(crearAlmacen(storageQueFalla), "?id=otomi&lang=fr"), "es");
});

test("fotosVisibles solo incluye fotos de pueblos y lugares verificados", () => {
  const datos = {
    pueblos: [{ id: "otomi", foto: "p" }],
    destinos: [{ id: "destino-a", foto: "a", verificado: true }, { id: "destino-b", foto: "b", verificado: false }],
    zonas: [{ id: "zona-c", foto: "c", verificado: true }],
    fotos: { p: {}, a: {}, b: {}, c: {} },
  };
  assert.deepEqual(fotosVisibles(datos).map(([clave]) => clave).sort(), ["a", "c", "p"]);
});
