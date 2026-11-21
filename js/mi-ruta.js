// mi-ruta.js — lista personal de lugares marcados con ♥ (se guarda en el navegador).
// No reserva nada: solo es una lista para recordar.

const CLAVE = "miRuta";

export function leerRuta(almacen) {
  try {
    const lista = JSON.parse(almacen.leer(CLAVE) ?? "[]");
    return Array.isArray(lista) ? lista.filter((x) => typeof x === "string") : [];
  } catch {
    return []; // datos danados: empezamos de cero
  }
}

export function estaEnRuta(almacen, id) {
  return leerRuta(almacen).includes(id);
}

// Agrega el lugar si no esta, o lo quita si ya estaba. Devuelve si quedo guardado.
export function alternar(almacen, id) {
  const lista = leerRuta(almacen);
  const ya = lista.includes(id);
  const nueva = ya ? lista.filter((x) => x !== id) : [...lista, id];
  almacen.guardar(CLAVE, JSON.stringify(nueva));
  return !ya;
}
