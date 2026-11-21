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
