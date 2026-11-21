// buscar.js — buscador de la guia. Todo ocurre en el navegador, sin servidor.
import { texto, visibles } from "./datos.js";

// "¡OTOMÍ!" -> "otomi": minusculas, sin acentos y sin signos.
export function normalizar(s) {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Arma la lista de cosas que se pueden encontrar, en el idioma activo.
export function crearIndice(datos, idioma) {
  const indice = [];
  const agregar = (id, tipo, titulo, extra, url) => indice.push({
    id, tipo, titulo, url,
    texto: normalizar(`${titulo} ${extra}`),
    tituloNorm: normalizar(titulo),
  });

  for (const p of datos.pueblos) {
    const url = `pueblo.html?id=${p.id}`;
    agregar(p.id, "pueblo", texto(p.nombre, idioma), `${p.nombrePropio} ${texto(p.resena, idioma)}`, url);
    for (const lista of ["gastronomia", "festividades", "artesanias", "costumbres"]) {
      for (const el of visibles(p[lista])) {
        agregar(`${p.id}-${el.id}`, lista, texto(el.nombre, idioma),
          `${texto(el.descripcion, idioma)} ${texto(p.nombre, idioma)}`, url);
      }
    }
  }
  for (const d of visibles(datos.destinos)) {
    agregar(d.id, "destino", texto(d.nombre, idioma), `${d.municipio ?? ""} ${texto(d.resena, idioma)}`, `explora.html#${d.id}`);
  }
  for (const z of visibles(datos.zonas)) {
    agregar(z.id, "zona", texto(z.nombre, idioma), `${z.municipio ?? ""} ${texto(z.resena, idioma)}`, `zonas.html#${z.id}`);
  }
  return indice;
}

// Devuelve hasta "max" resultados. El titulo pesa mas que el resto del texto.
export function buscar(indice, consulta, max = 10) {
  const palabras = normalizar(consulta).split(" ").filter(Boolean);
  if (palabras.length === 0) return [];
  return indice
    .map((el) => {
      if (!palabras.every((w) => el.texto.includes(w))) return null;
      const puntos = palabras.reduce((s, w) => s + (el.tituloNorm.includes(w) ? 3 : 1), 0);
      return { el, puntos };
    })
    .filter(Boolean)
    .sort((a, b) => b.puntos - a.puntos)
    .slice(0, max)
    .map(({ el }) => ({ id: el.id, tipo: el.tipo, titulo: el.titulo, url: el.url }));
}
