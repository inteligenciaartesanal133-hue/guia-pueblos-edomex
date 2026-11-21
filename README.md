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
