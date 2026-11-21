# Guía de Pueblos Indígenas del Edomex: plan de implementación

> **Para agentes:** SUB-SKILL REQUERIDA: usar superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan casillas (`- [ ]`) para llevar el avance.

**Meta:** una página web bilingüe (ES/EN), solo informativa, sobre los 5 pueblos originarios del Estado de México y sus zonas arqueológicas, con mapa, buscador y "Mi Ruta".

**Arquitectura:** HTML, CSS y JavaScript (módulos ES) sin compilación. Todo el contenido vive en `data/*.json`, con cada texto en `{es, en}`, y una sola plantilla por tipo de página lo pinta. La lógica sin DOM (datos, idioma, búsqueda, Mi Ruta) vive en módulos pequeños con pruebas de `node --test`. Las páginas se verifican en el navegador con Playwright.

**Tecnologías:** HTML5, CSS con variables, JavaScript ES2022 (módulos), Leaflet 1.9.4 (copia local en `vendor/`), teselas de OpenStreetMap, Node 26 (solo para pruebas) y Python 3.12 (`python -m http.server` para servir).

**Diseño:** `docs/diseno/2026-11-20-guia-pueblos-edomex-diseno.md`. Hay que leerlo completo antes de cualquier tarea.

## Restricciones globales
- Sin frameworks ni paso de compilación. Cada página abre servida con `python -m http.server 8000` desde la raíz del proyecto.
- Todo el código va **comentado en español** y con nombres en español, porque el usuario es aficionado.
- Rutas siempre **relativas**, sin `/` inicial, para que funcione en GitHub Pages bajo `/repo/`.
- Leaflet **1.9.4**, guardado en `vendor/leaflet/`. Fotos y letras también locales. Solo las teselas del mapa necesitan internet.
- Idiomas: `es` (predeterminado) y `en`. El idioma elegido se guarda en `localStorage` con la clave `"idioma"`.
- No se muestra ningún dato con `"verificado": false`.
- Los nombres propios (pueblos, lenguas, platillos, lugares) **no se traducen**.
- Fotos solo de Wikimedia Commons con licencia libre, con autor y licencia visibles.
- Nada de escudos ni logos oficiales del gobierno. Las redes del pie van sin enlace.
- Paleta base del diseño: rosa mexicano, verde nopal, amarillo cempasúchil, morado y crema. Los valores exactos los fija la Tarea 5.
- La página debe funcionar bien a 375 px de ancho y en escritorio.

## Puntos de revisión
1. **Abrir `index.html` con doble clic (`file://`):** la carga del JSON falla. Debe aparecer un aviso amable que diga "Abre la página con un servidor (python -m http.server)", no una página en blanco. Prueba en la Tarea 7.
2. **`localStorage` bloqueado o lanzando error** (modo privado): Mi Ruta y el idioma siguen funcionando en memoria sin romper la página. Prueba en la Tarea 7.
3. **Búsqueda con o sin acentos y mayúsculas** ("otomi", "OTOMÍ", "tamal"), y con consulta vacía (sin resultados, sin error). Prueba en la Tarea 7.
4. **`pueblo.html?id=desconocido` o sin `id`:** muestra "No encontramos ese pueblo" con el ajolote dormido y enlace a `pueblos.html`. Prueba en la Tarea 11.
5. **Sin internet:** el mapa no carga teselas, pero los marcadores y el resto de la página funcionan, y se ve un aviso "El mapa necesita internet". Prueba en la Tarea 10.

---

## Estructura de archivos
```
index.html  pueblos.html  pueblo.html  zonas.html  categoria.html
explora.html  galeria.html  acerca.html  mi-ruta.html  404.html
css/tokens.css     variables de color, letra y espacios (Tarea 5)
css/base.css       reset, tipografía, utilidades
css/componentes.css  encabezado, pie, tarjetas, botones, mapa
js/datos.js        carga y acceso a los JSON
js/i18n.js         idioma y textos de la interfaz
js/buscar.js       índice y búsqueda
js/mi-ruta.js      favoritos
js/mapa.js         envoltorio de Leaflet
js/layout.js       pinta encabezado y pie en todas las páginas
js/paginas/<pagina>.js   uno por página
data/pueblos.json  data/destinos.json  data/zonas.json  data/fotos.json
i18n/es.json  i18n/en.json
assets/img/        fotos (Commons)
assets/svg/        ajolote, decoraciones, logo
vendor/leaflet/    Leaflet 1.9.4
tests/*.test.js    pruebas con node --test
docs/fotos-faltantes.md
```

## Formato de datos (lo usan todas las tareas)
- Texto bilingüe `T` = `{ "es": string, "en": string }`.
- Elemento `E` = `{ "id": string, "nombre": T, "descripcion": T, "verificado": boolean, "fuente": string }`.

**`data/pueblos.json`**: arreglo de 5 objetos con ids exactos `otomi`, `mazahua`, `nahua`, `matlatzinca` y `tlahuica`. Cada uno tiene:
`{ id, nombre: T, nombrePropio: string, lengua: T, municipios: [{nombre, lat, lon}], resena: T, gastronomia: E[], festividades: (E & {fecha: T})[], artesanias: E[], costumbres: E[], frases: [{original, es, en, fuente, verificado}], foto: string|null, fuentes: [{titulo, url}] }`

**`data/destinos.json`**: arreglo de
`{ id: "destino-…", pueblo: <id de pueblo>, tipo: "comunidad"|"sitio", nombre: T, municipio, lat, lon, resena: T, como_llegar: T, actividades: [{nombre: T, ambiente: "aire_libre"|"bajo_techo"}], foto, fuentes, verificado }`

**`data/zonas.json`**: arreglo de
`{ id: "zona-…", nombre: T, municipio, lat, lon, cultura: T, resena: T, que_ver: T[], como_llegar: T, actividades: [...], foto, inah_url, fuentes, verificado }`

**`data/fotos.json`**: objeto `{ <clave>: { archivo: "assets/img/…", autor, licencia, url_original, alt: T } }`

---

### Task 1: Base del proyecto y validador de datos

**Archivos:**
- Crear: `package.json` (`"type": "module"`, script `"test": "node --test tests/"`), `.gitignore` (`node_modules/`), `README.md` (cómo servir la página y cómo correr las pruebas, en español), carpetas vacías con `.gitkeep`, `vendor/leaflet/` (`leaflet.js`, `leaflet.css` e `images/` copiados de `node_modules/leaflet/dist` después de `npm install leaflet@1.9.4 --no-save`)
- Crear: `tests/validar-datos.js` (funciones), `tests/datos.test.js`
- Crear: `data/*.json` con arreglos vacíos o `{}`

**Interfaces producidas:**
- `validarBilingue(obj, ruta): string[]` → errores de cada `T` con `es` o `en` vacío
- `validarCoordenadas(lat, lon): boolean` → dentro de lat 18.35–20.30 y lon −100.62 a −98.58 (caja del Edomex)
- `validarTodo({pueblos, destinos, zonas, fotos}): string[]`

- [ ] **Paso 1:** `git init` y primer commit con la estructura (el usuario aprobó el plan, que incluye commits locales; no se hace push).
- [ ] **Paso 2: escribir las pruebas que fallan** en `tests/datos.test.js`:
  - `validarBilingue({es:"a",en:""}, "x")` devuelve 1 error que contiene `"x.en"`.
  - `validarCoordenadas(19.29, -99.65)` es `true` (Toluca); `validarCoordenadas(20.97, -89.62)` es `false` (Mérida).
  - `validarTodo` con un destino cuya `foto` no está en `fotos` → error que contiene la clave.
  - `validarTodo` con ids repetidos entre destinos y zonas → error.
  - `validarTodo` con una frase `verificado:true` sin `fuente` → error.
  - Prueba de los datos reales: lee `data/*.json` y espera `validarTodo(...)` igual a `[]`. Las comprobaciones de 5 pueblos con sus ids exactos se activan cuando `pueblos.length > 0`.
- [ ] **Paso 3:** ejecutar `npm test` → FALLA (funciones no definidas).
- [ ] **Paso 4:** implementar `tests/validar-datos.js`.
- [ ] **Paso 5:** ejecutar `npm test` → PASA.
- [ ] **Paso 6:** commit con el mensaje `chore: base del proyecto y validador de datos`.

### Task 2: Investigación de los 5 pueblos → `data/pueblos.json`

**Archivos:** modificar `data/pueblos.json`.

- [ ] **Paso 1:** investigar cada pueblo en INPI, CEDIPIEM, INALI, INEGI, Secretaría de Cultura y Turismo del Edomex y publicaciones académicas. Usar la skill `anthropic-skills:deep-research`, un pueblo por línea de investigación. Llenar todos los campos del formato. Mínimos: 3 a 5 elementos en gastronomía, festividades, artesanías y costumbres. Frases: de 0 a 5, solo con fuente.
- [ ] **Paso 2:** todo dato sin al menos una fuente seria queda con `"verificado": false`.
- [ ] **Paso 3:** redactar el inglés (sin traducir nombres propios). Las reseñas van en 80 a 120 palabras por idioma, en tono respetuoso (comunidades vivas, sin folclorizar).
- [ ] **Paso 4:** ejecutar `npm test` → PASA (5 pueblos, ids exactos, bilingüe completo, coordenadas dentro del Edomex).
- [ ] **Paso 5:** crear `docs/investigacion-pendiente.md` con la lista de datos `verificado:false` para que el equipo los revise. Hacer commit con el mensaje `content: investigación de pueblos`.

### Task 3: Destinos y zonas arqueológicas → `data/destinos.json`, `data/zonas.json`

- [ ] **Paso 1:** destinos. Por pueblo, de 2 a 4 lugares visitables ligados a él (a confirmar: Centro Ceremonial Otomí en Temoaya, San Felipe del Progreso, San Francisco Oxtotilpan, San Juan Atzingo). Cada uno con `como_llegar` (desde Toluca y desde CDMX, en términos generales) y actividades con `ambiente`.
- [ ] **Paso 2:** zonas. Todas las zonas arqueológicas del Edomex que el INAH tiene abiertas al público (al menos Teotihuacán, Malinalco, Calixtlahuaca, Teotenango, Huamango, Acozac, Tlapacoya y San Miguel Ixtapan), con `inah_url`. **Sin horarios ni precios.**
- [ ] **Paso 3:** ejecutar `npm test` → PASA. Hacer commit con el mensaje `content: destinos y zonas arqueológicas`.

### Task 4: Fotos → `assets/img/`, `data/fotos.json`

- [ ] **Paso 1:** para cada `foto` en pueblos, destinos y zonas, buscar en Wikimedia Commons una imagen con licencia CC BY, CC BY-SA, CC0 o dominio público. Descargar la versión de 1280 px de ancho (`https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/<Archivo>&width=1280`) a `assets/img/<clave>.jpg`. Registrar `autor`, `licencia`, `url_original` y `alt` bilingüe.
- [ ] **Paso 2:** si no hay foto libre, dejar `foto: null` y anotar el lugar en `docs/fotos-faltantes.md`.
- [ ] **Paso 3:** ejecutar `npm test` → PASA. Comprobar que el total de `assets/img/` pese menos de 25 MB. Hacer commit.

### Task 5: Sistema de diseño y 3 propuestas del ajolote — **PUNTO DE CONTROL DEL USUARIO**

**Archivos:** crear `css/tokens.css`, `css/base.css`, `docs/diseno/propuestas-ajolote.html`, `.impeccable/` (lo que genere `init`).

- [ ] **Paso 1:** usar la skill `ui-ux-pro-max` con la imagen `docs/diseno/referencia.jpg` (si falta, pedírsela al usuario) para fijar los tokens: colores (rosa, verde, amarillo, morado, crema, texto y fondo, todos con contraste AA), letra de títulos (estilo rotulación, de Google Fonts, descargada a `assets/fuentes/`), letra de texto y escala de espacios y radios. Escribirlos en `css/tokens.css`.
- [ ] **Paso 2:** ejecutar `/impeccable init` con el contexto del diseño.
- [ ] **Paso 3:** dibujar 3 ajolotes SVG con estilos distintos: (a) tierno redondo con contorno grueso, parecido al de la imagen; (b) plano geométrico sin contorno; (c) estilo bordado otomí (tenango), con patrones. Los tres llevan blusa bordada y mochila, y están en la pose "saludando". Mostrarlos lado a lado en `docs/diseno/propuestas-ajolote.html` sobre el fondo crema y sobre el verde del encabezado.
- [ ] **Paso 4:** **detenerse y pedir al usuario que elija.** No seguir con la Tarea 6 sin su respuesta. Hacer commit.

### Task 6: Ilustraciones SVG en el estilo elegido

**Archivos:** crear en `assets/svg/` los archivos `ajolote-saluda.svg`, `ajolote-senala.svg`, `ajolote-lee.svg`, `ajolote-duerme.svg`, `logo-piramide.svg`, `papel-picado.svg` (tira repetible), `flor-cempasuchil.svg`, `flor-bugambilia.svg`, `nopal.svg`, `volcan-iglesia.svg` (fondo de la portada) e íconos de categoría (`ico-artesanias.svg`, `ico-gastronomia.svg`, `ico-festividades.svg`, `ico-sitios.svg`, `ico-pueblos.svg`).

- [ ] **Paso 1:** dibujar todo en el estilo elegido, usando solo los colores de `tokens.css` (como valores fijos en el SVG o con `currentColor` en los íconos). Cada archivo debe pesar menos de 40 KB y llevar `viewBox`, sin `width`/`height` fijos.
- [ ] **Paso 2:** revisar visualmente con Playwright una hoja `docs/diseno/ilustraciones.html` que muestre todas. Hacer commit.

### Task 7: Lógica central (datos, idioma, búsqueda, Mi Ruta)

**Archivos:** crear `js/datos.js`, `js/i18n.js`, `js/buscar.js`, `js/mi-ruta.js`, `i18n/es.json`, `i18n/en.json`, `tests/logica.test.js`.

**Interfaces producidas:**
- `js/datos.js`
  - `cargarDatos(base = "") : Promise<{pueblos, destinos, zonas, fotos}>`. Usa `fetch`. Si falla, lanza `Error("SIN_SERVIDOR")` cuando `location.protocol === "file:"` y `Error("SIN_DATOS")` en otro caso.
  - `texto(valor: T|string, idioma): string`. Si falta el idioma, devuelve `es`.
  - `visibles(lista): Array`. Quita los elementos con `verificado === false`.
  - `buscarPorId(datos, id): {tipo: "pueblo"|"destino"|"zona", item} | null`
- `js/i18n.js`
  - `crearAlmacen(storage = globalThis.localStorage)`: devuelve `{leer(clave), guardar(clave, valor)}`. Envuelve todo en try/catch y, si falla, usa un `Map` en memoria.
  - `idiomaActual(almacen): "es"|"en"`. Devuelve `"es"` si no hay nada guardado o el valor no es válido.
  - `cambiarIdioma(almacen, idioma)`
  - `cargarTextos(idioma): Promise<object>` y `tr(textos, clave): string` (si falta la clave, devuelve la clave misma)
- `js/buscar.js`
  - `normalizar(s): string` (minúsculas, sin acentos, sin signos)
  - `crearIndice(datos, idioma): Array<{id, tipo, titulo, texto, url}>`. Indexa pueblos (y sus platillos, fiestas y artesanías), destinos y zonas, solo los visibles. Las URL son `pueblo.html?id=…`, `explora.html#destino-…` y `zonas.html#zona-…`.
  - `buscar(indice, consulta, max = 10): Array`. Devuelve `[]` si la consulta normalizada queda vacía. El título pesa más que el texto.
- `js/mi-ruta.js`
  - `leerRuta(almacen): string[]`, `estaEnRuta(almacen, id): boolean`, `alternar(almacen, id): boolean` (devuelve el nuevo estado). Usa la clave `"miRuta"` y JSON. Si el JSON está dañado, devuelve `[]`.

- [ ] **Paso 1: escribir las pruebas que fallan**
  - `texto({es:"Hola",en:"Hello"},"en") === "Hello"`; `texto({es:"Hola"},"en") === "Hola"`; `texto("Temoaya","en") === "Temoaya"`.
  - `visibles([{verificado:true},{verificado:false},{}]).length === 2`.
  - Almacén con un `storage` cuyo `getItem` y `setItem` lanzan error: `guardar("a","1")` y luego `leer("a") === "1"`, sin lanzar.
  - `idiomaActual` con `"fr"` guardado devuelve `"es"`.
  - `normalizar("¡OTOMÍ!") === "otomi"`.
  - Con datos de prueba (un pueblo `otomi` con el platillo "Tamal de ceniza"): `buscar(indice,"tamal")[0].url === "pueblo.html?id=otomi"`; `buscar(indice,"otomi").length >= 1`; `buscar(indice,"   ")` igual a `[]`.
  - Un elemento con `verificado:false` llamado "Secreto" no aparece en `buscar(indice,"secreto")`.
  - `alternar(alm,"zona-malinalco") === true`, luego `estaEnRuta` es `true`; alternar otra vez devuelve `false`. Con `miRuta` igual a `"{roto"`, `leerRuta` devuelve `[]`.
  - `cargarDatos` con `fetch` simulado que rechaza y `location.protocol` igual a `"file:"` → rechaza con `"SIN_SERVIDOR"`.
- [ ] **Paso 2:** ejecutar `npm test` → FALLA.
- [ ] **Paso 3:** implementar los 4 módulos y llenar `i18n/es.json` y `en.json` con todos los textos fijos: menú, botones, títulos de sección, mensajes de error (`SIN_SERVIDOR`, `SIN_DATOS`, no encontrado, mapa sin internet, ruta vacía) y el lema del pie.
- [ ] **Paso 4:** ejecutar `npm test` → PASA. Hacer commit.

### Task 8: Encabezado, pie y estilos de componentes

**Archivos:** crear `js/layout.js` y `css/componentes.css`.

**Interfaces:**
- Usa: `crearAlmacen`, `idiomaActual`, `cambiarIdioma`, `cargarTextos`, `tr`.
- Produce: `iniciarPagina(): Promise<{datos, idioma, textos, almacen}>`. Pinta el encabezado (logo, menú con la página activa marcada, buscador desplegable con resultados en vivo, Mi Ruta ♥ con contador, botón ES/EN) y el pie en `<header id="encabezado">` y `<footer id="pie">`. Pone `<html lang>`. Si `cargarDatos` falla, muestra el aviso de error correspondiente en `<main>` y lanza el error. Cambiar de idioma guarda el valor y recarga.

- [ ] **Paso 1:** implementar siguiendo el diseño (tira de papel picado, botones de menú de colores, botón Mi Ruta rosa). En celular, el menú se vuelve un botón de hamburguesa accesible (con `aria-expanded`), y todo funciona con teclado y con foco visible.
- [ ] **Paso 2:** con una página de prueba temporal, verificar con Playwright a 1280 px y 375 px: el cambio ES→EN cambia el menú, la búsqueda "malinalco" muestra un resultado y no hay errores en la consola. Abrir la página con `file://` y confirmar que se ve el aviso `SIN_SERVIDOR`. Hacer commit.

### Task 9: Portada `index.html`

**Archivos:** crear `index.html` y `js/paginas/inicio.js`.

- [ ] **Paso 1:** maquetar las secciones del diseño en este orden: portada (ajolote saludando, título, banda, lema, fondo de volcán e iglesia, nopales y flores), buscador grande (usa `buscar`), 5 tarjetas de categoría (enlaces según la sección 9 del diseño), "Nuestros Destinos" (4 tarjetas: 2 destinos y 2 zonas, con foto y ♥), recuadro "Nuestros Pueblos Indígenas" (lista de 5 y "Conoce más" → `pueblos.html`) y mini mapa (Tarea 10).
- [ ] **Paso 2:** verificar con Playwright en los dos tamaños y los dos idiomas, comparando contra `docs/diseno/referencia.jpg`. Hacer commit.

### Task 10: Mapa

**Archivos:** crear `js/mapa.js`; modificar `js/paginas/inicio.js`.

**Interfaces:**
- `crearMapa(elemento, puntos, {idioma, textos, almacen, zoom}): L.Map`. Cada punto es `{id, lat, lon, titulo, foto, url, tipo}`. Usa marcadores con colores distintos por tipo (comunidad o zona). La ventanita muestra título, miniatura, enlace "Ver más" y el botón ♥ (`alternar`). Ajusta la vista a todos los puntos. Si aparece el evento `tileerror` 3 veces, muestra el aviso `tr(textos,"mapaSinInternet")` encima del mapa.
- `puntosDesde(datos, idioma, filtro?): Punto[]`. Toma solo destinos y zonas visibles. `filtro` es `{pueblo?, tipo?}`.

- [ ] **Paso 1:** prueba en `tests/logica.test.js`: `puntosDesde` con un destino `verificado:false` lo excluye, y con `filtro {tipo:"zona"}` devuelve solo zonas. Ejecutar y ver que FALLA, implementar `puntosDesde` y ver que PASA.
- [ ] **Paso 2:** implementar `crearMapa` y el mini mapa de la portada (alto de 320 px).
- [ ] **Paso 3:** verificar con Playwright: aparecen los marcadores, la ventanita abre y ♥ actualiza el contador. Con la red de teselas bloqueada (`route` de `*.tile.openstreetmap.org` abortada), aparece el aviso. Hacer commit.

### Task 11: Pueblos y ficha de pueblo

**Archivos:** crear `pueblos.html`, `pueblo.html`, `js/paginas/pueblos.js` y `js/paginas/pueblo.js`.

- [ ] **Paso 1:** `pueblos.html` muestra 5 tarjetas grandes con foto, nombre, nombre propio y reseña corta.
- [ ] **Paso 2:** `pueblo.html?id=` muestra: cabecera con foto y nombre propio, reseña, lengua, "Frases para saludar" (solo las verificadas; si no hay, la sección se oculta), gastronomía, festividades (con fecha), artesanías, costumbres, mapa de sus destinos, fuentes y créditos de foto. Si el `id` falta o no existe, muestra "no encontrado" con `ajolote-duerme.svg` y enlace a `pueblos.html`.
- [ ] **Paso 3:** verificar con Playwright `pueblo.html?id=otomi` en ES y EN, `pueblo.html?id=xyz` y `pueblo.html`. Hacer commit.

### Task 12: Zonas arqueológicas y categorías

**Archivos:** crear `zonas.html`, `categoria.html`, `js/paginas/zonas.js` y `js/paginas/categoria.js`.

- [ ] **Paso 1:** `zonas.html` tiene una introducción ("el corazón de la civilización…"), un mapa de zonas y una tarjeta por zona con `id` igual a su id (para los enlaces `#zona-…`). Cada tarjeta lleva cultura, reseña, qué ver, cómo llegar, el enlace "Consultar horarios en INAH" (`inah_url`) y ♥.
- [ ] **Paso 2:** `categoria.html?tipo=` acepta `artesanias`, `gastronomia` y `festividades`, y reúne esa lista de los 5 pueblos agrupada por pueblo, con enlace a su ficha. Con un `tipo` inválido, muestra "no encontrado".
- [ ] **Paso 3:** verificar con Playwright los 3 tipos, uno inválido y `zonas.html#zona-malinalco` (que haga scroll hasta esa tarjeta). Hacer commit.

### Task 13: Explora, Galería, Acerca de, Mi Ruta y 404

**Archivos:** crear `explora.html`, `galeria.html`, `acerca.html`, `mi-ruta.html`, `404.html` y su JS en `js/paginas/`.

- [ ] **Paso 1:** `explora.html` tiene un mapa grande (70 % del alto de la ventana) con filtros por pueblo y por tipo (`puntosDesde` con filtro), y una lista debajo con un `id` por destino.
- [ ] **Paso 2:** `galeria.html` es una cuadrícula de todas las fotos de `fotos.json`, con ampliación accesible (`<dialog>`) que muestra el crédito (autor, licencia y enlace).
- [ ] **Paso 3:** `acerca.html` explica el proyecto, presenta al ajolote asistente y la frase "Viaja, conoce y cuida nuestras raíces", incluye espacios marcados `[Nombre del equipo]` y `[Escuela]`, y lista todas las fuentes juntas.
- [ ] **Paso 4:** `mi-ruta.html` muestra los lugares guardados con un mapa y botón para quitar cada uno. Si está vacía, aparece el ajolote señalando y el enlace a `explora.html`. Un texto aclara que es una lista personal guardada en el navegador.
- [ ] **Paso 5:** `404.html` muestra el ajolote dormido y enlace al inicio.
- [ ] **Paso 6:** verificar con Playwright: agregar 2 lugares desde Explora, verlos en Mi Ruta, quitar uno y recargar (persiste). Hacer commit.

### Task 14: Revisión final y pulido

- [ ] **Paso 1:** ejecutar `/impeccable critique` y `/impeccable audit`, y corregir lo importante.
- [ ] **Paso 2:** ejecutar `/impeccable polish`.
- [ ] **Paso 3:** con Playwright, recorrer las 10 páginas a 1280 px y 375 px, en ES y EN. Confirmar que no hay errores en la consola, ni scroll horizontal, ni textos sin traducir (buscar claves crudas de `i18n`), y que el foco con teclado es visible.
- [ ] **Paso 4:** ejecutar `npm test` → PASA. Actualizar `README.md` con cómo publicarla en GitHub Pages. Hacer commit con el mensaje `chore: pulido final`.
