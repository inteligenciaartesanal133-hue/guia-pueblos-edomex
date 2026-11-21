// datos.js — carga el contenido de la guia (carpeta data/) y ayuda a leerlo.

// Lee los 4 archivos JSON. "base" es la ruta hasta la raiz del sitio (normalmente "").
// Si falla:
//   - "SIN_SERVIDOR": la pagina se abrio con doble clic (file://) y el navegador bloquea la lectura.
//   - "SIN_DATOS": hubo otro problema (archivo faltante, sin conexion, etc.).
export async function cargarDatos(base = "", {
  fetch: traer = globalThis.fetch,
  protocolo = globalThis.location?.protocol,
} = {}) {
  const leer = async (nombre) => {
    const resp = await traer(`${base}data/${nombre}.json`);
    if (!resp.ok) throw new Error(`No se pudo leer ${nombre}.json`);
    return resp.json();
  };
  try {
    const [pueblos, destinos, zonas, fotos] = await Promise.all(
      ["pueblos", "destinos", "zonas", "fotos"].map(leer),
    );
    return { pueblos, destinos, zonas, fotos };
  } catch (error) {
    throw new Error(protocolo === "file:" ? "SIN_SERVIDOR" : "SIN_DATOS", { cause: error });
  }
}

// Devuelve el texto en el idioma pedido. Acepta {es, en} o un texto simple.
// Si falta la traduccion, usa el espanol.
export function texto(valor, idioma) {
  if (valor === null || valor === undefined) return "";
  if (typeof valor === "string") return valor;
  return valor[idioma] || valor.es || "";
}

// Quita los elementos marcados como no verificados (no se muestran en la pagina).
export function visibles(lista = []) {
  return lista.filter((el) => el.verificado !== false);
}

// Busca cualquier cosa por su id: un pueblo, un destino o una zona.
export function buscarPorId(datos, id) {
  const pueblo = datos.pueblos.find((p) => p.id === id);
  if (pueblo) return { tipo: "pueblo", item: pueblo };
  const destino = datos.destinos.find((d) => d.id === id);
  if (destino) return { tipo: "destino", item: destino };
  const zona = datos.zonas.find((z) => z.id === id);
  if (zona) return { tipo: "zona", item: zona };
  return null;
}
