# Diseño: Guía turística de pueblos indígenas del Estado de México

Fecha: 20 de noviembre de 2026
Estado: borrador para aprobación

## 1. Intención y porqué
Una página web **informativa** para turistas que muestra los pueblos originarios del Estado de México (otomí/hñähñu, mazahua/jñatjo, nahua, matlatzinca y tlahuica/pjiekakjo): dónde están, qué se come, sus costumbres, fiestas, artesanías y frases en su lengua. Además, como apartado extra, incluye las zonas arqueológicas del estado, que son "el corazón de la civilización en sus inicios".

Es un **proyecto escolar** que se va a presentar. Si va bien, tendrá seguimiento. La página es la parte "digital" del proyecto. La parte física es un asistente de voz con un ajolote animado (ESP32-S3) que más adelante contestará preguntas usando **los mismos datos** de esta página.

## 2. Metas, no-metas y anti-metas
**Metas**
- Página bonita y fiel al diseño que hizo el usuario (ver sección 6), en **español** (principal) e **inglés**.
- Ficha completa de cada uno de los 5 pueblos, con fuentes.
- **Mini mapa** con puntos de las comunidades y destinos recomendados, y un mapa completo en "Explora".
- Apartado extra de **zonas arqueológicas**.
- **Frases cortas** en la lengua de cada pueblo (saludo, "bienvenido", "gracias"...).
- Datos guardados en archivos ordenados para que el servidor del ajolote los lea después.

**No-metas (por ahora)**
- No es agencia de viajes: nada de reservas, precios, pagos ni cuentas de usuario.
- No hay servidor propio ni base de datos. Tampoco panel para editar contenido.
- No se traduce a más idiomas aparte de español e inglés.
- No hay chat con el ajolote dentro de la página (se puede pensar después).

**Anti-metas (sería un fracaso aunque funcione)**
- **Inventar** datos culturales, fechas de fiestas o frases en lengua indígena. Todo dato lleva fuente. Si no se pudo confirmar, se marca como "por verificar" y no se muestra como cierto.
- Tratar a los pueblos como "folclor" o estereotipo: hay que presentarlos como comunidades vivas, con su nombre propio.
- Usar fotos sin permiso. Solo se usan fotos con licencia libre (Wikimedia Commons), con su crédito.
- Parecer un sitio oficial del gobierno: no se usan escudos ni logos oficiales.

## 3. Restricciones
- El usuario es aficionado y trabaja en Windows con VS Code y Python 3.12. El código debe ser fácil de leer y estar comentado en español.
- **No hay paso de compilación:** solo HTML, CSS y JavaScript, sin frameworks.
- Si se abre `index.html` con doble clic (`file://`), el navegador bloquea la lectura de los `.json`. Para verlo en la PC se usa `python -m http.server` (o la extensión Live Server de VS Code). Publicado en GitHub Pages funciona normal.
- Librerías externas solo por CDN y con versión fija: **Leaflet 1.9.4** con mapas de **OpenStreetMap** (gratis, no pide llave).
- Debe verse bien en celular y en la computadora donde se presente.

## 4. Enfoques considerados
1. **HTML, CSS y JS sin nada más, con datos en JSON (elegido por el usuario).** Fácil de entender, abrir y publicar gratis. El ajolote reutiliza los JSON.
2. **Astro.** Más ordenado y genera una página por pueblo e idioma, pero hay que instalar Node.js y compilar. El usuario quiere **aprenderlo después**. Por eso la estructura de los JSON se diseña para poder migrarla tal cual a las *content collections* de Astro.
3. **Flask.** Sería el mismo servidor del ajolote, pero solo funciona con la PC prendida y no se puede publicar gratis. Descartado.

## 5. Contenido (investigación)
La investigación la hace Claude y la revisa el equipo antes de presentar. Fuentes preferidas: INPI, CEDIPIEM, INAH, INEGI, INALI (lenguas), Secretaría de Turismo del Edomex y Wikimedia Commons (fotos).

**Por cada pueblo:** nombre propio y en español, lengua, municipios principales con coordenadas, reseña breve, gastronomía (3 a 5 platillos), festividades (con fecha o temporada), artesanías, costumbres, 3 a 5 frases cortas (con traducción y fuente) y lista de fuentes.

**Destinos recomendados** (puntos del mapa): comunidades o lugares visitables ligados a cada pueblo. Ejemplos a confirmar: Centro Ceremonial Otomí (Temoaya), San Felipe del Progreso, San Francisco Oxtotilpan, San Juan Atzingo (Ocuilan).

**Zonas arqueológicas (extra):** Teotihuacán, Malinalco, Calixtlahuaca, Teotenango, Huamango, Acozac (Ixtapaluca), Tlapacoya, San Miguel Ixtapan y otras que tenga registradas el INAH. Por cada una: ubicación, cultura, reseña y qué ver. Horarios y costos **no** se escriben como datos fijos: se pone un enlace "consultar en INAH".

**Formato de datos** (cada texto lleva los dos idiomas juntos para que sea fácil ver si falta una traducción):
```
data/pueblos.json      -> lista de pueblos
data/destinos.json     -> puntos del mapa (pueblo, tipo, coordenadas, foto)
data/zonas.json        -> zonas arqueológicas
data/fotos.json        -> crédito y licencia de cada foto
i18n/es.json, en.json  -> textos fijos de la interfaz (menús, botones)
```
Ejemplo de campo: `"resena": { "es": "...", "en": "..." }`.

## 6. Diseño visual
La base es la imagen del usuario (`docs/diseno/referencia.jpg`; falta guardarla ahí). Elementos:
- Encabezado verde con papel picado: logo "EdoMéx · Guía Turística" con la pirámide, menú (Inicio, Explora, Pueblos, Galería, Acerca de), lupa, botón **Mi Ruta ♥** y selector **ES/EN**.
- Portada: el ajolote mascota saludando con mochila y blusa bordada, título "Descubre el Estado de México", banda "Guía Turística de Pueblos Indígenas", nopales, flores, iglesia y volcán de fondo.
- Buscador grande.
- Cinco tarjetas de categoría con colores distintos: Artesanías (verde), Gastronomía (amarillo), Festividades (rosa), Sitios Históricos (morado) y Pueblos Indígenas (verde).
- "Nuestros Destinos" en tarjetas con foto y flecha, y el recuadro "Nuestros Pueblos Indígenas" con la lista de los 5 y el botón "Conoce más".
- Pie morado con el lema "Viaja, conoce y cuida nuestras raíces", redes sociales y #EdoMéxTurístico.
- Paleta: rosa mexicano, verde nopal, amarillo cempasúchil, morado y crema. Títulos en letra tipo rotulación y texto en una letra legible.

Herramientas: **UI/UX Pro Max** para fijar paleta, tipografía y reglas; **Impeccable** (`init` al empezar; `critique`, `audit` y `polish` al terminar); **Playwright** para probar en navegador y en tamaño celular. **SkillUI** solo si el usuario da una página de referencia.

## 7. Páginas y comportamiento
| Página | Qué hace |
|---|---|
| `index.html` | Portada como en el diseño, más un **mini mapa** con los puntos de los 5 pueblos |
| `pueblos.html` | Lista de los 5 pueblos |
| `pueblo.html?id=otomi` | Ficha de un pueblo (una sola plantilla que se llena desde el JSON), con su mapa |
| `explora.html` | Mapa grande con todos los puntos y filtros por pueblo y por tipo (comunidad, zona arqueológica) |
| `categoria.html?tipo=gastronomia` | Reúne esa categoría de todos los pueblos (artesanías, gastronomía, festividades) |
| `zonas.html` | Apartado extra de zonas arqueológicas, al que lleva "Sitios Históricos" |
| `galeria.html` | Fotos con su crédito |
| `acerca.html` | Sobre el proyecto, el equipo, el ajolote asistente y las fuentes |
| `mi-ruta.html` | Lugares marcados con ♥, guardados en el navegador (`localStorage`), con su mapa. Solo es una lista personal: no reserva nada |

- **Buscador:** busca dentro de los datos (pueblos, platillos, fiestas, lugares) en el idioma activo, sin servidor.
- **Idioma:** se recuerda en el navegador. La primera vez se usa español.
- Los puntos del mapa abren una ventanita con el nombre, una foto pequeña y el enlace "Ver más".

## 8. Relación con el ajolote (después)
El servidor `servidor.py` leerá `data/*.json` y le pasará a la IA la información del pueblo o tema que se pregunte. Esto **no** se construye en esta etapa. Solo se cuida que los datos queden completos y ordenados.

**Ideas acordadas para el ajolote (etapa posterior, no se construyen ahora):**
- Usa una IA existente con instrucciones fijas: contesta solo sobre pueblos y zonas del Edomex, solo con los datos de la página, en 2 o 3 frases.
- Detecta el idioma (español o inglés) y contesta en el mismo.
- Sabe **dónde está**: el lugar se configura en el servidor y el usuario también puede decirlo por voz. Si el usuario menciona otro lugar, el ajolote le aclara con amabilidad y aun así le da información de ese lugar o cómo llegar.
- Consulta el **clima** del lugar (Open-Meteo, gratis y sin llave) para sugerir si conviene salir, qué comer o qué actividades hacer.
- **Por eso la investigación debe incluir**, para cada destino y zona, un campo `como_llegar` (desde Toluca y CDMX, en términos generales) y actividades marcadas como "al aire libre" o "bajo techo", para que el clima sirva para recomendar algo.

## 8.1 Ilustraciones (decidido por el usuario)
Claude dibuja en **SVG** el ajolote mascota y las decoraciones (nopal, flores de cempasúchil y bugambilia, papel picado, volcán, iglesia, pirámide del logo). Primero presenta **3 propuestas de ajolote** con estilos distintos. El usuario elige una y el resto de las ilustraciones sigue ese estilo. El ajolote tiene poses para distintas partes de la página: saludando (portada), señalando (mapa), leyendo (fichas) y durmiendo (página no encontrada / sin resultados).

## 9. Decisiones tomadas por Claude (el usuario puede corregirlas)
- **Fotos:** se descargan de Wikimedia Commons a `assets/img/` (no se enlazan directo), con autor y licencia en `data/fotos.json`. Si un lugar no tiene foto libre, se usa una ilustración genérica decorativa y se anota en `docs/fotos-faltantes.md`.
- **"Por verificar":** el dato se guarda en el JSON con `"verificado": false` y **no se muestra** en la página. Un pueblo puede tener de 0 a 5 frases: solo aparecen las confirmadas, y si no hay ninguna se oculta la sección.
- **Inglés:** lo traduce Claude y lo revisa el equipo. Los nombres propios de pueblos, lenguas, platillos y lugares no se traducen (se agrega una explicación cuando haga falta).
- **Tarjetas de categoría:** Artesanías, Gastronomía y Festividades llevan a `categoria.html`, Sitios Históricos a `zonas.html` y Pueblos Indígenas a `pueblos.html`.
- **Redes sociales del pie:** se muestran como íconos decorativos sin enlace mientras no existan cuentas reales.
- **Mi Ruta:** se pueden guardar destinos y zonas. Cada elemento lleva un id único con prefijo (`destino-…`, `zona-…`).
- **Acerca de:** lleva espacios marcados para nombres del equipo y escuela hasta que el usuario los dé.
- **Sin internet:** Leaflet, letras y fotos se guardan en el proyecto. Solo los cuadros del mapa (OpenStreetMap) necesitan internet. Para la presentación, basta con el hotspot del celular.

## 10. Lo que se deja a quien construya
- Estructura exacta de carpetas de CSS y JS, y nombres de funciones.
- Elección final de tipografías y ajuste fino de colores (con UI/UX Pro Max).
- Cómo se dibujan las decoraciones (papel picado, flores): SVG o imágenes.
- Diseño en celular de las partes que la imagen no muestra.
