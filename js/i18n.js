// i18n.js — idioma de la pagina (espanol / ingles) y textos fijos de la interfaz.

export const IDIOMAS = ["es", "en"];

// Envoltorio de localStorage que nunca rompe la pagina.
// En modo privado o con el almacenamiento bloqueado, guarda todo en memoria.
export function crearAlmacen(storage) {
  // Con cookies bloqueadas, solo LEER window.localStorage ya lanza error.
  if (storage === undefined) {
    try { storage = globalThis.localStorage; } catch { storage = null; }
  }
  const memoria = new Map();
  return {
    leer(clave) {
      try {
        const valor = storage?.getItem(clave);
        if (valor !== null && valor !== undefined) return valor;
      } catch { /* almacenamiento bloqueado: usamos la memoria */ }
      return memoria.has(clave) ? memoria.get(clave) : null;
    },
    guardar(clave, valor) {
      memoria.set(clave, valor);
      try { storage?.setItem(clave, valor); } catch { /* solo queda en memoria */ }
    },
  };
}

// Idioma guardado; si no hay o no es valido, espanol.
// Si la URL trae ?lang=en (o es), ese manda: asi el cambio de idioma funciona
// aunque el navegador no deje guardar nada.
export function idiomaActual(almacen, busqueda = globalThis.location?.search ?? "") {
  const deUrl = new URLSearchParams(busqueda).get("lang");
  if (IDIOMAS.includes(deUrl)) {
    almacen.guardar("idioma", deUrl);
    return deUrl;
  }
  const guardado = almacen.leer("idioma");
  return IDIOMAS.includes(guardado) ? guardado : "es";
}

export function cambiarIdioma(almacen, idioma) {
  if (IDIOMAS.includes(idioma)) almacen.guardar("idioma", idioma);
}

// Carga i18n/es.json o i18n/en.json.
export async function cargarTextos(idioma, base = "") {
  const resp = await fetch(`${base}i18n/${idioma}.json`);
  if (!resp.ok) throw new Error("SIN_DATOS");
  return resp.json();
}

// Traduce una clave; si no existe, devuelve la clave (asi se nota que falta).
export function tr(textos, clave) {
  return textos?.[clave] ?? clave;
}
