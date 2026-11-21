// Pruebas del validador de datos: revisan que los JSON esten completos y bien hechos.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validarBilingue, validarCoordenadas, validarTodo } from "./validar-datos.js";

const vacio = { pueblos: [], destinos: [], zonas: [], fotos: {} };
const destino = (extra = {}) => ({
  id: "destino-a", pueblo: "otomi", tipo: "comunidad",
  nombre: { es: "A", en: "A" }, municipio: "Temoaya", lat: 19.47, lon: -99.59,
  resena: { es: "r", en: "r" }, como_llegar: { es: "c", en: "c" },
  actividades: [], foto: null, fuentes: [], verificado: true, ...extra,
});

test("validarBilingue detecta el ingles vacio", () => {
  const errores = validarBilingue({ es: "a", en: "" }, "x");
  assert.equal(errores.length, 1);
  assert.ok(errores[0].includes("x.en"));
});

test("validarCoordenadas acepta Toluca y rechaza Merida", () => {
  assert.equal(validarCoordenadas(19.29, -99.65), true);
  assert.equal(validarCoordenadas(20.97, -89.62), false);
});

test("validarTodo avisa si una foto no existe en fotos.json", () => {
  const errores = validarTodo({ ...vacio, destinos: [destino({ foto: "no-existe" })] });
  assert.ok(errores.some((e) => e.includes("no-existe")));
});

test("validarTodo avisa ids repetidos entre destinos y zonas", () => {
  const zona = { ...destino(), id: "destino-a" };
  const errores = validarTodo({ ...vacio, destinos: [destino()], zonas: [zona] });
  assert.ok(errores.some((e) => e.includes("repetido")));
});

test("validarTodo exige fuente en frases verificadas", () => {
  const pueblo = {
    id: "otomi", nombre: { es: "Otomí", en: "Otomí" }, nombrePropio: "Hñähñu",
    lengua: { es: "l", en: "l" }, municipios: [], resena: { es: "r", en: "r" },
    gastronomia: [], festividades: [], artesanias: [], costumbres: [],
    frases: [{ original: "Ki hats'i", es: "Buenos dias", en: "Good morning", fuente: "", verificado: true }],
    foto: null, fuentes: [],
  };
  const errores = validarTodo({ ...vacio, pueblos: [pueblo] });
  assert.ok(errores.some((e) => e.includes("fuente")));
});

test("los datos reales de data/ son validos", () => {
  const leer = (n) => JSON.parse(readFileSync(new URL(`../data/${n}.json`, import.meta.url), "utf8"));
  const datos = { pueblos: leer("pueblos"), destinos: leer("destinos"), zonas: leer("zonas"), fotos: leer("fotos") };
  assert.deepEqual(validarTodo(datos), []);
});
