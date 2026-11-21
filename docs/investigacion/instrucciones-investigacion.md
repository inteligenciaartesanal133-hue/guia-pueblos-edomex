# Instrucciones para la investigación (guía de pueblos indígenas del Edomex)

Proyecto: página web turística **informativa** (no vende ni reserva) sobre los pueblos originarios del Estado de México. Es bilingüe, español e inglés. Los mismos datos los usará después un asistente de voz.

## Reglas
1. **Nada inventado.** Cada dato necesita al menos una fuente seria y consultable. Preferidas: INPI, CEDIPIEM (Consejo Estatal para el Desarrollo Integral de los Pueblos Indígenas del Estado de México), INALI, INEGI, INAH, Secretaría de Cultura y Turismo del Edomex, Gobierno de México (gob.mx), SIC (Sistema de Información Cultural), universidades (UAEMex, UNAM) y artículos académicos. Wikipedia sirve como pista, pero no como única fuente.
2. Si un dato no se pudo confirmar, igual se guarda, pero con `"verificado": false`.
3. **Frases en lengua indígena:** solo con fuente explícita (diccionario, vocabulario de INALI o INPI, material educativo oficial). Si no hay fuente, no se ponen. Es preferible tener 0 frases a una frase inventada.
4. Tono respetuoso: son comunidades vivas, no folclor. Se usa el nombre propio del pueblo.
5. Inglés natural. Los nombres propios no se traducen (pueblos, lenguas, platillos, lugares). Si hace falta, se explica entre paréntesis, por ejemplo "tlacoyos (stuffed corn cakes)".
6. Coordenadas en grados decimales, que caigan dentro del Edomex (lat 18.35–20.30, lon −100.62 a −98.58). Para un municipio o localidad, usar su cabecera o centro.
7. **No** se escriben horarios ni precios.
8. Las reseñas largas (`resena`) llevan de 80 a 120 palabras por idioma. Las descripciones de elementos, de 20 a 45 palabras.

## Formato
`T` = `{"es": "...", "en": "..."}`
`E` = `{"id": "kebab-case", "nombre": T, "descripcion": T, "verificado": true|false, "fuente": "URL"}`

### Pueblo
```json
{
  "id": "otomi",
  "nombre": T,
  "nombrePropio": "Hñähñu",
  "lengua": T,
  "municipios": [{"nombre": "Temoaya", "lat": 19.468, "lon": -99.593}],
  "resena": T,
  "gastronomia": [E, ...],
  "festividades": [E + "fecha": T, ...],
  "artesanias": [E, ...],
  "costumbres": [E, ...],
  "frases": [{"original": "...", "es": "...", "en": "...", "fuente": "URL", "verificado": true}],
  "foto": "otomi-portada",
  "fuentes": [{"titulo": "...", "url": "..."}]
}
```
Cantidades: municipios principales (3 a 8), gastronomía 3 a 5, festividades 3 a 5, artesanías 3 a 5, costumbres 3 a 5, frases 0 a 5.

### Destino (lugar visitable ligado a un pueblo)
```json
{
  "id": "destino-<kebab>", "pueblo": "otomi", "tipo": "comunidad" | "sitio",
  "nombre": T, "municipio": "Temoaya", "lat": 0, "lon": 0,
  "resena": T,
  "como_llegar": T,
  "actividades": [{"nombre": T, "ambiente": "aire_libre" | "bajo_techo"}],
  "foto": "destino-<kebab>" | null,
  "fuentes": [{"titulo": "...", "url": "..."}],
  "verificado": true
}
```
- `como_llegar`: indicaciones generales desde Toluca y desde CDMX (carretera o autobús, tiempo aproximado). Sin calles.

### Zona arqueológica
Mismo formato que el destino, pero **sin** `pueblo` ni `tipo`, con `id` igual a `"zona-<kebab>"`, y además:
`"cultura": T, "que_ver": [T, ...], "inah_url": "URL de su ficha en inah.gob.mx"`.

### Fotos candidatas (archivo aparte)
Por cada clave de `foto` que uses, busca **una** imagen en Wikimedia Commons con licencia CC0, CC BY, CC BY-SA o dominio público. Debe ser una foto real del lugar o del tema (para la portada de un pueblo sirve: artesanía, fiesta, comunidad o paisaje de su región). **No** uses fotos de primer plano de personas identificables sin contexto.
```json
{"otomi-portada": {"archivo_commons": "File:Nombre exacto.jpg", "autor": "...", "licencia": "CC BY-SA 4.0", "url_original": "https://commons.wikimedia.org/wiki/File:...", "alt": T}}
```
Si no encuentras foto libre, pon `null` como valor de esa clave.

## Entrega
Escribe archivos JSON válidos (UTF-8) en `docs/investigacion/borradores/`, con los nombres que te indiquen. Al terminar, responde con un resumen breve: cuántos elementos tiene cada lista, cuántos quedaron `verificado: false` y por qué, y las fotos que no encontraste.
