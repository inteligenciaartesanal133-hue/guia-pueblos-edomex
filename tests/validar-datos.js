// Validador de los datos de la guia (data/*.json).
// Devuelve una lista de errores en texto; si la lista esta vacia, todo esta bien.

const PUEBLOS_ESPERADOS = ["otomi", "mazahua", "nahua", "matlatzinca", "tlahuica"];

// Un texto bilingue debe tener "es" y "en" con contenido.
export function validarBilingue(obj, ruta) {
  const errores = [];
  if (!obj || typeof obj !== "object") return [`${ruta}: falta el texto bilingue`];
  for (const idioma of ["es", "en"]) {
    if (typeof obj[idioma] !== "string" || obj[idioma].trim() === "") {
      errores.push(`${ruta}.${idioma} esta vacio`);
    }
  }
  return errores;
}

// Caja aproximada que encierra al Estado de Mexico.
export function validarCoordenadas(lat, lon) {
  return typeof lat === "number" && typeof lon === "number" &&
    lat >= 18.35 && lat <= 20.30 && lon >= -100.62 && lon <= -98.58;
}

// Revisa un elemento simple (platillo, fiesta, artesania, costumbre).
function validarElemento(el, ruta) {
  const errores = [
    ...validarBilingue(el.nombre, `${ruta}.nombre`),
    ...validarBilingue(el.descripcion, `${ruta}.descripcion`),
  ];
  if (!el.id) errores.push(`${ruta}: falta id`);
  if (el.verificado === true && !el.fuente) errores.push(`${ruta}: verificado sin fuente`);
  return errores;
}

function validarFoto(clave, fotos, ruta) {
  if (clave === null || clave === undefined) return [];
  return fotos[clave] ? [] : [`${ruta}: la foto "${clave}" no existe en fotos.json`];
}

function validarPueblo(p, fotos) {
  const r = `pueblo ${p.id}`;
  const errores = [
    ...validarBilingue(p.nombre, `${r}.nombre`),
    ...validarBilingue(p.lengua, `${r}.lengua`),
    ...validarBilingue(p.resena, `${r}.resena`),
    ...validarFoto(p.foto, fotos, r),
  ];
  if (!p.nombrePropio) errores.push(`${r}: falta nombrePropio`);
  for (const m of p.municipios || []) {
    if (!validarCoordenadas(m.lat, m.lon)) errores.push(`${r}: municipio ${m.nombre} fuera del Edomex`);
  }
  for (const lista of ["gastronomia", "festividades", "artesanias", "costumbres"]) {
    (p[lista] || []).forEach((el, i) => errores.push(...validarElemento(el, `${r}.${lista}[${i}]`)));
  }
  (p.festividades || []).forEach((f, i) => {
    if (f.verificado !== false) errores.push(...validarBilingue(f.fecha, `${r}.festividades[${i}].fecha`));
  });
  (p.frases || []).forEach((f, i) => {
    if (!f.original || !f.es || !f.en) errores.push(`${r}.frases[${i}]: incompleta`);
    if (f.verificado === true && !f.fuente) errores.push(`${r}.frases[${i}]: verificada sin fuente`);
  });
  return errores;
}

// Destinos y zonas comparten casi todos los campos.
function validarLugar(l, fotos, prefijo) {
  const r = `${prefijo} ${l.id}`;
  const errores = [
    ...validarBilingue(l.nombre, `${r}.nombre`),
    ...validarBilingue(l.resena, `${r}.resena`),
    ...validarBilingue(l.como_llegar, `${r}.como_llegar`),
    ...validarFoto(l.foto, fotos, r),
  ];
  if (!String(l.id).startsWith(prefijo + "-")) errores.push(`${r}: el id debe empezar con "${prefijo}-"`);
  if (!validarCoordenadas(l.lat, l.lon)) errores.push(`${r}: coordenadas fuera del Edomex`);
  (l.actividades || []).forEach((a, i) => {
    errores.push(...validarBilingue(a.nombre, `${r}.actividades[${i}].nombre`));
    if (!["aire_libre", "bajo_techo"].includes(a.ambiente)) errores.push(`${r}.actividades[${i}]: ambiente invalido`);
  });
  return errores;
}

export function validarTodo({ pueblos = [], destinos = [], zonas = [], fotos = {} }) {
  const errores = [];

  if (pueblos.length > 0) {
    const ids = pueblos.map((p) => p.id).sort();
    if (JSON.stringify(ids) !== JSON.stringify([...PUEBLOS_ESPERADOS].sort()) && pueblos.length >= 5) {
      errores.push(`pueblos: se esperaban ${PUEBLOS_ESPERADOS.join(", ")}`);
    }
  }
  pueblos.forEach((p) => errores.push(...validarPueblo(p, fotos)));

  const idsPueblos = new Set(pueblos.map((p) => p.id));
  destinos.forEach((d) => {
    errores.push(...validarLugar(d, fotos, "destino"));
    if (idsPueblos.size > 0 && !idsPueblos.has(d.pueblo)) errores.push(`destino ${d.id}: pueblo "${d.pueblo}" no existe`);
  });
  zonas.forEach((z) => {
    errores.push(...validarLugar(z, fotos, "zona"));
    errores.push(...validarBilingue(z.cultura, `zona ${z.id}.cultura`));
  });

  const vistos = new Set();
  for (const l of [...destinos, ...zonas]) {
    if (vistos.has(l.id)) errores.push(`id repetido: ${l.id}`);
    vistos.add(l.id);
  }

  for (const [clave, f] of Object.entries(fotos)) {
    if (!f.archivo || !f.autor || !f.licencia || !f.url_original) errores.push(`foto ${clave}: faltan datos de credito`);
    errores.push(...validarBilingue(f.alt, `foto ${clave}.alt`));
  }
  return errores;
}
