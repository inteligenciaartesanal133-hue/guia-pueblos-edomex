# Cómo funciona la Guía de Pueblos Indígenas del Edomex

Esta guía explica qué se hizo, para qué sirve cada carpeta y archivo, cómo está publicada en GitHub y cómo hacerle cambios.

**Equipo Axolotl · Tecnológico de Estudios Superiores de Tianguistenco**

- **Página publicada:** https://inteligenciaartesanal133-hue.github.io/guia-pueblos-edomex/
- **Repositorio (el código):** https://github.com/inteligenciaartesanal133-hue/guia-pueblos-edomex
- **Carpeta en tu PC:** `C:\Users\yisus\Downloads\ProyectoINT`

---

## 1. La idea en una frase

Es una página web **informativa y bilingüe** (español e inglés) sobre los 5 pueblos originarios del Estado de México y sus zonas arqueológicas. **Todo el contenido vive en archivos de datos** (`data/*.json`), y las páginas solo lo "pintan" en pantalla. El ajolote físico (ESP32) podrá leer esos mismos datos para contestar preguntas.

---

## 2. Lo que se hizo, en orden

1. **Diseño y plan.** Se acordó qué tendría la página (pueblos, mapa, buscador, Mi Ruta, zonas arqueológicas, dos idiomas) y se escribió en `docs/diseno/2026-11-20-guia-pueblos-edomex-diseno.md`. Después se dividió el trabajo en 14 tareas, que están en `docs/superpowers/plans/`.
2. **Tecnología elegida.** Se usó HTML, CSS y JavaScript "puros", sin frameworks ni compilación, porque es lo más fácil de entender y de publicar gratis. Astro se dejó para aprenderlo después.
3. **Investigación.** Se buscó información de cada pueblo y de las zonas en fuentes serias: INPI, CEDIPIEM, INAH, INALI, INEGI, gobierno del Edomex y universidades.
   - Cada dato quedó con su fuente.
   - Lo que no se pudo confirmar quedó marcado como **no verificado**, y la página no lo muestra.
   - El equipo confirmó después varios datos (Centro Ceremonial Otomí, milpa, chincuete, temazcal).
4. **Fotos.** Se descargaron 28 fotos con licencia libre de Wikimedia Commons, cada una con su autor y licencia.
5. **Ubicaciones.** Las coordenadas del mapa se revisaron con OpenStreetMap.
6. **La lógica.** Se programó la carga de datos, el cambio de idioma, el buscador, Mi Ruta y el mapa, con **pruebas automáticas** que revisan que todo funcione.
7. **Las páginas.** Se hicieron 10: portada, pueblos, ficha de cada pueblo, zonas arqueológicas, categorías, Explora, galería, Acerca de, Mi Ruta y la página de error 404.
8. **El diseño visual.** Se usaron las imágenes que generó el equipo:
   - el ajolote en 4 poses (saluda, señala, lee y está confundida)
   - el paisaje de la portada
   - la nota de papel rasgado, en español y en inglés
   - las 5 categorías en papel picado, en español y en inglés
   - la tira de papel picado de colores

   A cada imagen se le quitó el fondo para que se viera bien sobre la página.
9. **Revisión.** Se revisó la accesibilidad (que se lea bien, que funcione con teclado) y cómo se ve en computadora y en celular. Un revisor independiente revisó el código y se corrigieron los 4 problemas importantes que encontró.
10. **Publicación.** Se subió a GitHub y se activó GitHub Pages para que cualquiera la pueda ver en internet.

---

## 3. Para qué sirve cada carpeta y archivo

### Las páginas (en la raíz del proyecto)

| Archivo | Qué es |
|---|---|
| `index.html` | La portada |
| `pueblos.html` | Lista de los 5 pueblos |
| `pueblo.html` | Ficha de un pueblo. Una sola plantilla sirve para los 5: `pueblo.html?id=otomi`, `?id=mazahua`, etc. |
| `zonas.html` | Zonas arqueológicas |
| `categoria.html` | Artesanías, gastronomía o festividades de todos los pueblos (`?tipo=gastronomia`) |
| `explora.html` | Mapa grande con filtros |
| `galeria.html` | Todas las fotos con su crédito |
| `acerca.html` | Sobre el proyecto, el equipo y las fuentes |
| `mi-ruta.html` | Los lugares que guardaste con ♥ |
| `404.html` | Página de "no encontramos lo que buscas" |

Los `.html` están casi vacíos: solo cargan los estilos y un archivo de JavaScript. **El contenido lo pone el JavaScript leyendo los datos.**

### `data/`: el contenido (lo más importante)

| Archivo | Qué guarda |
|---|---|
| `pueblos.json` | Los 5 pueblos: nombre, lengua, reseña, gastronomía, fiestas, artesanías, costumbres, frases, municipios y fuentes |
| `destinos.json` | Lugares para visitar ligados a cada pueblo (son los puntos rosas del mapa) |
| `zonas.json` | Las 17 zonas arqueológicas (puntos morados del mapa) |
| `fotos.json` | De qué archivo es cada foto, su autor, licencia y texto alternativo |

Cada texto está guardado en los dos idiomas juntos, así: `"resena": { "es": "...", "en": "..." }`.

Cada dato tiene un campo `"verificado"`: si es `false`, se guarda pero **no se muestra**.

> **No edites estos archivos a mano.** Se generan desde los borradores (ver sección 6).

### `i18n/`: los textos fijos

`es.json` y `en.json` traen los textos de botones, menús y títulos ("Inicio", "Mi Ruta", "Buscar"…), que no son parte del contenido de los pueblos. Las pruebas revisan que los dos archivos tengan exactamente las mismas claves, para que nunca falte una traducción.

### `js/`: la lógica

| Archivo | Qué hace |
|---|---|
| `datos.js` | Lee los `.json`, elige el texto en el idioma actual y esconde lo no verificado |
| `i18n.js` | Recuerda el idioma (en el navegador y en la dirección con `?lang=en`) |
| `buscar.js` | El buscador: encuentra "otomí", "OTOMI" u "otomi", con o sin acentos |
| `mi-ruta.js` | Guarda y quita lugares de Mi Ruta (en el navegador de cada quien) |
| `mapa.js` | Dibuja los mapas con Leaflet y los puntos de cada lugar |
| `layout.js` | Pinta el encabezado (menú, buscador, idioma) y el pie en todas las páginas |
| `recursos.js` | Rutas de las imágenes del ajolote e íconos. **Aquí se cambia el ajolote** |
| `paginas/*.js` | Uno por página: arma el contenido de esa página |
| `paginas/comun.js` | Piezas repetidas: tarjetas de lugar, botón ♥, ficha de lugar, créditos |

### `css/`: el diseño

| Archivo | Qué controla |
|---|---|
| `tokens.css` | **Colores, letras y medidas de toda la página.** Por ejemplo, `--barra` es el rojo del encabezado y del pie. Si cambias un color aquí, cambia en todos lados |
| `base.css` | Reglas generales (márgenes, tamaño de letra, foco del teclado) |
| `componentes.css` | Encabezado, pie, tarjetas, botones y mapa |
| `inicio.css` | Solo la portada |
| `paginas.css` | Las demás páginas |

### `assets/`: imágenes y letras

- `img/`: tus imágenes sin fondo, el paisaje, las categorías, la nota de papel, la tira de papel picado y las 28 fotos de Commons.
- `svg/`: logo de la pirámide, íconos de categorías, la flor rosa (que también es el ícono de la pestaña) y el paisaje de respaldo para lugares sin foto.
- `fuentes/`: las 3 letras de la página (Fredoka, Nunito y Pacifico), guardadas aquí para que funcionen sin internet.

### `vendor/leaflet/`

Es la librería del mapa (Leaflet 1.9.4), guardada dentro del proyecto. **No la modifiques.**

### `docs/`: documentación y respaldos

| Archivo o carpeta | Qué es |
|---|---|
| `COMO-FUNCIONA.md` | Esta guía |
| `diseno/2026-11-20-...-diseno.md` | El documento de diseño original |
| `diseno/*-original.*` y `referencia.webp` | **Tus imágenes originales**, antes de quitarles el fondo (respaldo) |
| `investigacion/borradores/` | **La fuente de verdad del contenido**: lo que investigó cada investigador, un archivo por pueblo y otro para zonas |
| `investigacion/instrucciones-investigacion.md` | Las reglas con las que se investigó |
| `investigacion-pendiente.md` | Datos que **no se muestran** porque falta confirmarlos |
| `fotos-faltantes.md` | Lugares que no tienen foto libre |
| `superpowers/plans/` | El plan de trabajo en 14 tareas |

### `scripts/`: herramientas

| Script | Para qué |
|---|---|
| `unir-investigacion.mjs` | Junta los borradores y genera `data/*.json`. También aplica correcciones, como las coordenadas confirmadas |
| `bajar-fotos.mjs` | Descarga de Wikimedia Commons las fotos nuevas que se agreguen |
| `listar-pendientes.mjs` | Vuelve a generar `investigacion-pendiente.md` y `fotos-faltantes.md` |
| `quitar-fondo.mjs` | Quita el fondo blanco a una imagen JPG del ajolote |

### `tests/`: pruebas automáticas

Con `npm test` corren 26 pruebas que revisan, entre otras cosas:
- que no falte ninguna traducción
- que las coordenadas caigan dentro del Edomex
- que los datos sin verificar no se muestren
- que el buscador ignore los acentos
- que Mi Ruta y el idioma funcionen aunque el navegador no deje guardar nada

### Otros archivos

| Archivo | Qué es |
|---|---|
| `README.md` | Instrucciones cortas: cómo verla en tu PC, cómo correr pruebas y cómo publicar |
| `PRODUCT.md` | Ficha del proyecto que usa la herramienta de diseño Impeccable |
| `package.json` | Le dice a Node cómo correr las pruebas (`npm test`) |
| `.gitignore` | Lo que **no** se sube a GitHub (`node_modules`) |
| `.claude/launch.json` | Configuración de la vista previa que usó Claude |

---

## 4. Cómo funciona una página por dentro

Ejemplo: alguien abre `pueblo.html?id=otomi`.

1. El navegador carga `pueblo.html`, que trae los estilos y `js/paginas/pueblo.js`.
2. `pueblo.js` llama a `layout.js`, que:
   - ve qué idioma usar (`?lang=` en la dirección o lo guardado en el navegador; si no hay nada, español)
   - carga los textos fijos de `i18n/es.json`
   - carga todos los datos de `data/`
   - pinta el encabezado y el pie
3. `pueblo.js` lee el `id=otomi` de la dirección, busca ese pueblo en los datos y arma la ficha, escondiendo lo no verificado.
4. Si el `id` no existe, muestra al ajolote confundido con "No encontramos lo que buscas".
5. El mapa se dibuja con Leaflet. El fondo del mapa viene de OpenStreetMap y **necesita internet**; si no hay, se muestra un aviso y los puntos siguen funcionando.

**¿Por qué no abre con doble clic?** Cuando abres un `.html` con doble clic (`file://`), el navegador bloquea que la página lea los `.json`, por seguridad. Por eso en tu PC hay que usar un servidor local (sección 5), y en internet GitHub Pages hace ese trabajo.

---

## 5. Verla en tu PC

1. Abre una terminal en la carpeta del proyecto.
2. Escribe:
   ```
   python -m http.server 8000
   ```
3. Entra a http://localhost:8000
4. Para apagarlo: `Ctrl + C`.

Para correr las pruebas (necesitas Node.js):
```
npm test
```

---

## 6. Cómo hacer cambios

### Cambiar o agregar contenido (un platillo, una fiesta, un lugar)

1. Edita el borrador que corresponde en `docs/investigacion/borradores/` (por ejemplo `pueblo-mazahua.json`).
2. Si confirmaste un dato, cambia `"verificado": false` por `true`. Debe tener `"fuente"`.
3. Ejecuta, en este orden:
   ```
   node scripts/unir-investigacion.mjs
   node scripts/listar-pendientes.mjs
   npm test
   ```
4. Si las pruebas pasan, súbelo (sección 7).

### Cambiar un color

Ve a `css/tokens.css`. Por ejemplo, `--barra: #B3202A;` es el rojo del encabezado y del pie.

### Cambiar una imagen del ajolote

Guarda la imagen nueva (PNG sin fondo) en `assets/img/` y cambia su ruta en `js/recursos.js`.

### Cambiar un texto fijo (un botón o un menú)

Edita `i18n/es.json` **y** `i18n/en.json`, con la misma clave en los dos.

---

## 7. Git y GitHub: cómo se guarda y se publica

### Las ideas básicas

- **Git** guarda el historial de cambios en tu PC. Cada "commit" es una foto del proyecto en un momento, con una descripción. Si algo sale mal, se puede regresar a cualquier commit anterior, y nada borrado se pierde para siempre.
- **GitHub** es una copia de ese historial en internet.
- **GitHub Pages** toma los archivos de la rama `main` en GitHub y los publica como página web. **Cada vez que subes cambios a `main`, la página se actualiza sola en 1 o 2 minutos.**

### Cómo está configurado

- **Ramas:**
  - `main` es la versión oficial, la que se publica.
  - `guia-web` es la rama de trabajo; existe solo en tu PC.
- **Remote** (la dirección de GitHub): `origin` apunta a `https://inteligenciaartesanal133-hue@github.com/inteligenciaartesanal133-hue/guia-pueblos-edomex.git`. Lleva tu usuario en la dirección porque tu PC tiene guardada la sesión de otra cuenta (**YISUS360**). Así siempre sube con la cuenta correcta.
- **Privacidad:** los commits usan tu correo privado de GitHub (`359334003+inteligenciaartesanal133-hue@users.noreply.github.com`), **no tu Gmail**. Tu correo personal no aparece en el repositorio.
- **Pages:** está activado en *Settings → Pages*, con la rama `main` y la carpeta `/ (root)`.

### Subir un cambio tú mismo

En la terminal, dentro de la carpeta del proyecto:
```
git add -A
git commit -m "describe aquí qué cambiaste"
git push
```
Después de `git push`, espera 1 o 2 minutos y recarga la página publicada.

### Comandos útiles para revisar

| Comando | Qué muestra |
|---|---|
| `git status` | Qué archivos cambiaste y no has guardado |
| `git log --oneline` | La lista de todos los commits |
| `git diff` | Qué cambió exactamente en los archivos |

---

## 8. Lo que falta o queda pendiente

- **Datos por confirmar:** ver `docs/investigacion-pendiente.md` (13 datos y 3 lugares).
- **Frases en lengua indígena:** otomí, mazahua y nahua no tienen, porque no hubo fuente legible. Si consiguen un vocabulario, se agregan.
- **Detalles menores:**
  - el foco del teclado al quitar un lugar en Mi Ruta
  - la tecla Escape no cierra el buscador
  - el título de la pestaña de la portada no se traduce al inglés
  - la página 404 en algunas rutas de GitHub
- **El ajolote físico:**
  - cambiar la palabra de activación a **"Axolotl"** en `WAKE_PHRASES` de `servidor.py` (en el servidor de la PC, no en el ESP)
  - conectar la IA con los datos de `data/`
  - la voz de respuesta
  - el clima
- **Astro:** pasar esta misma página a Astro, para aprenderlo.
