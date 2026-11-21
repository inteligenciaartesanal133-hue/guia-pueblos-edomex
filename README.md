# Guía turística de pueblos indígenas del Estado de México

Página web informativa (español / inglés) sobre los pueblos otomí, mazahua, nahua,
matlatzinca y tlahuica, y las zonas arqueológicas del Edomex.

## Cómo ver la página en tu PC
Las páginas leen archivos `.json`, y el navegador no lo permite si abres
`index.html` con doble clic. Hay que usar un servidor local:

1. Abre una terminal en esta carpeta (en VS Code: menú *Terminal → New Terminal*).
2. Ejecuta:
   ```
   python -m http.server 8000
   ```
3. Abre en el navegador: <http://localhost:8000>
4. Para detenerlo: `Ctrl + C` en la terminal.

## Cómo correr las pruebas
Necesitas Node.js instalado. En la terminal:
```
npm test
```
Las pruebas revisan, entre otras cosas, que todos los datos tengan su traducción y
fuente, y que las coordenadas caigan dentro del Estado de México.

Para la explicación completa de cómo funciona todo, lee [docs/COMO-FUNCIONA.md](docs/COMO-FUNCIONA.md).

## Dónde está cada cosa
| Carpeta | Qué guarda |
|---|---|
| `data/` | Contenido: pueblos, destinos, zonas arqueológicas y créditos de fotos |
| `i18n/` | Textos fijos de la interfaz (menús, botones) en español e inglés |
| `js/` | Lógica de la página |
| `css/` | Estilos |
| `assets/` | Fotos, ilustraciones SVG y letras |
| `vendor/leaflet/` | Librería del mapa (Leaflet 1.9.4) |
| `docs/` | Diseño, plan e investigación |

## Cambiar la imagen del ajolote
Las rutas del ajolote están en `js/recursos.js` (constante `AJOLOTE`). Guarda tu imagen
(de preferencia PNG con fondo transparente) en `assets/img/` y cambia ahí la ruta.

## Actualizar el contenido
1. Edita los borradores en `docs/investigacion/borradores/`.
2. Ejecuta `node scripts/unir-investigacion.mjs` (junta todo en `data/`).
3. Si agregaste fotos: `node scripts/bajar-fotos.mjs`.
4. Ejecuta `node scripts/listar-pendientes.mjs` y `npm test`.

Los datos con `"verificado": false` se guardan pero no se muestran. La lista está en
`docs/investigacion-pendiente.md`; las fotos que faltan, en `docs/fotos-faltantes.md`.

## Publicar gratis en GitHub Pages
1. Crea un repositorio en GitHub y sube esta carpeta.
2. En el repositorio: *Settings → Pages → Build and deployment*, elige la rama y la carpeta `/ (root)`.
3. En unos minutos la página queda en `https://<tu-usuario>.github.io/<repositorio>/`.
Todas las rutas son relativas, así que funciona sin cambios.
