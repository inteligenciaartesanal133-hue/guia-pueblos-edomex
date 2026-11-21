# Dibuja assets/svg/ajolote-saluda.svg (ajolote mascota, recreado de la imagen del usuario).
# Las branquias con orilla de "plumita" se calculan aqui para no escribirlas a mano.
# Uso: python scripts/dibujar-ajolote.py  y luego  python scripts/generar-poses.py
import math


def branquia(largo=58, ancho=16, dientes=9):
    """Hoja alargada apuntando a la izquierda (-x), con orilla dentada suave."""
    arriba, abajo = [], []
    for i in range(dientes * 2 + 1):
        t = i / (dientes * 2)
        x = -largo * t
        w = ancho * math.sin(math.pi * min(1, t * 1.1)) * (1 - 0.3 * t)
        extra = 4 if i % 2 else 0  # los "dientes" de la pluma
        arriba.append((x, -(w + extra)))
        abajo.append((x, w + extra))
    pts = arriba + list(reversed(abajo))
    return "M0 0 " + " ".join(f"L{x:.1f} {y:.1f}" for x, y in pts) + " Z"


T = 'stroke="#4A1530" stroke-width="3.5"'
PIEL = 'fill="#F9B9CD"'
PETALO = "M40 40 C26 30 26 12 40 10 C54 12 54 30 40 40 Z"
petalos = "\n".join(
    f'        <path d="{PETALO}" fill="url(#petalo-color)" stroke="#4A1530" stroke-width="2.5" transform="rotate({a} 40 40)"/>'
    for a in (0, 72, 144, 216, 288)
)

svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 312">
  <!-- Ajolote mascota saludando (recreado del diseño del usuario) -->
  <defs>
    <g id="br">
      <path d="{branquia()}" fill="#D81B60" {T} stroke-linejoin="round"/>
      <path d="M-4 0 C-18 -2 -34 -2 -46 0" fill="none" stroke="#F7A1C0" stroke-width="7" stroke-linecap="round"/>
    </g>
    <radialGradient id="petalo-color" cx="40" cy="40" r="30" gradientUnits="userSpaceOnUse">
      <stop offset=".25" stop-color="#F7931E"/><stop offset=".6" stop-color="#F0567F"/><stop offset="1" stop-color="#E23A72"/>
    </radialGradient>
  </defs>
  <g stroke-linejoin="round" stroke-linecap="round">
    <!-- cola ondulada -->
    <path d="M86 236 C60 232 40 246 22 238 C10 232 8 248 18 256 C30 266 52 262 66 270 C80 278 94 270 98 258 Z" fill="#F7A6C1" {T}/>
    <path d="M30 248 C46 252 62 250 82 254" fill="none" stroke="#FBD0DE" stroke-width="4"/>

    <!-- mochila (detras del cuerpo) -->
    <path d="M60 176 C50 182 46 222 54 244 C62 254 82 254 88 246 L94 180 C84 172 68 172 60 176 Z" fill="#A0682F" {T}/>
    <path d="M56 208 C64 214 80 214 90 208" fill="none" stroke="#4A1530" stroke-width="2.5"/>

    <!-- branquias izquierdas -->
    <use href="#br" transform="translate(72 66) rotate(42)"/>
    <use href="#br" transform="translate(60 96) rotate(8)"/>
    <use href="#br" transform="translate(64 124) rotate(-24)"/>
    <!-- branquias derechas (espejo) -->
    <use href="#br" transform="translate(180 64) scale(-1 1) rotate(42)"/>
    <use href="#br" transform="translate(194 92) scale(-1 1) rotate(8)"/>
    <use href="#br" transform="translate(190 120) scale(-1 1) rotate(-24)"/>

    <!-- pies -->
    <path d="M90 286 C90 276 118 276 118 286 C118 294 90 294 90 286 Z" {PIEL} {T}/>
    <path d="M140 286 C140 276 168 276 168 286 C168 294 140 294 140 286 Z" {PIEL} {T}/>
    <path d="M98 292 v-4 M106 293 v-4 M148 292 v-4 M156 293 v-4" stroke="#4A1530" stroke-width="2"/>

    <!-- falda con olanes -->
    <path d="M78 230 C104 240 152 240 178 228 L192 270 Q184 280 176 272 Q168 282 158 274 Q148 284 138 276 Q128 286 118 276 Q108 284 98 274 Q88 282 80 272 Q70 280 64 270 Z" fill="#C2185B" {T}/>
    <path d="M100 248 L96 270 M128 250 V276 M156 248 L160 270" stroke="#9E1048" stroke-width="2.5"/>

    <!-- blusa -->
    <path d="M86 150 C110 142 148 142 170 150 L182 230 C150 244 106 244 74 230 Z" fill="#FFFFFF" {T}/>
    <!-- bordado de la blusa -->
    <path d="M94 158 C112 168 146 168 162 158" fill="none" stroke="#E0357E" stroke-width="2.5" stroke-dasharray="1 5"/>
    <g stroke="none">
      <g transform="translate(104 178)"><circle r="7" fill="#D6204F"/><circle r="2.6" fill="#F2B705"/></g>
      <g transform="translate(128 184)"><circle r="8" fill="#F0567F"/><circle r="3" fill="#F7931E"/></g>
      <g transform="translate(152 178)"><circle r="7" fill="#6D2468"/><circle r="2.6" fill="#F2B705"/></g>
      <ellipse cx="116" cy="188" rx="5" ry="2.4" fill="#3F8A3A" transform="rotate(30 116 188)"/>
      <ellipse cx="140" cy="188" rx="5" ry="2.4" fill="#3F8A3A" transform="rotate(-30 140 188)"/>
      <ellipse cx="93" cy="186" rx="4" ry="2" fill="#3F8A3A" transform="rotate(-40 93 186)"/>
      <ellipse cx="163" cy="186" rx="4" ry="2" fill="#3F8A3A" transform="rotate(40 163 186)"/>
      <circle cx="110" cy="200" r="2.6" fill="#E8820C"/><circle cx="128" cy="204" r="3" fill="#D6204F"/><circle cx="146" cy="200" r="2.6" fill="#E8820C"/>
    </g>
    <!-- faja rosa -->
    <path d="M76 218 C104 230 152 230 180 216 L183 234 C152 248 104 248 73 234 Z" fill="#E23A72" {T}/>

    <!-- tirantes de la mochila -->
    <path d="M94 150 C98 176 100 200 102 226" fill="none" stroke="#A0682F" stroke-width="11"/>
    <path d="M94 150 C98 176 100 200 102 226" fill="none" stroke="#4A1530" stroke-width="2" stroke-dasharray="2 7"/>
    <path d="M164 150 C162 172 160 196 158 222" fill="none" stroke="#A0682F" stroke-width="11"/>

    <!-- manga izquierda abombada + brazo hacia abajo -->
    <path d="M78 172 C68 200 72 222 84 230 C94 222 96 202 94 180 Z" {PIEL} {T}/>
    <path d="M90 148 C72 148 62 162 66 176 C70 186 88 188 98 180 Z" fill="#FFFFFF" {T}/>
    <path d="M67 178 c4 3 8 3 12 0 c4 3 8 3 12 0" fill="none" stroke="#E0357E" stroke-width="2.4"/>

    <!-- cabeza -->
    <path d="M52 100 C52 52 86 32 126 32 C168 32 202 54 202 98 C202 142 168 160 126 160 C84 160 52 144 52 100 Z" {PIEL} {T}/>
    <ellipse cx="114" cy="52" rx="28" ry="9" fill="#FCD6E2" stroke="none"/>
    <path d="M150 44 q6 -4 12 0" fill="none" stroke="#4A1530" stroke-width="2"/>

    <!-- flor en la cabeza -->
    <g transform="translate(86 50)">
      <path d="M-26 6 C-34 -4 -22 -14 -12 -6 Z M22 14 C32 8 34 22 22 24 Z M-20 22 C-30 26 -28 36 -16 30 Z" fill="#3F8A3A" stroke="#4A1530" stroke-width="2.5"/>
      <g transform="translate(-40 -40)">
{petalos}
      </g>
      <circle r="7" fill="#F6E27A" stroke="#4A1530" stroke-width="2.5"/>
      <circle r="2.8" fill="#C2185B" stroke="none"/>
    </g>

    <!-- mejillas -->
    <ellipse cx="86" cy="120" rx="14" ry="9" fill="#F27BA5" opacity=".75" stroke="none"/>
    <ellipse cx="170" cy="114" rx="14" ry="9" fill="#F27BA5" opacity=".75" stroke="none"/>
    <!-- nariz -->
    <circle cx="122" cy="104" r="1.8" fill="#4A1530" stroke="none"/><circle cx="136" cy="103" r="1.8" fill="#4A1530" stroke="none"/>
    <!-- ojo abierto -->
    <ellipse cx="100" cy="98" rx="11" ry="13" fill="#2A0F1F" stroke="none"/>
    <circle cx="104" cy="92" r="4.5" fill="#FFFFFF" stroke="none"/>
    <circle cx="97" cy="104" r="2" fill="#FFFFFF" stroke="none"/>
    <path d="M89 90 l-5 -4" stroke="#2A0F1F" stroke-width="2.6"/>
    <!-- ojo guiñando -->
    <path d="M148 98 C152 88 164 88 168 96" fill="none" stroke="#2A0F1F" stroke-width="4.5"/>
    <!-- boca abierta y feliz -->
    <path d="M112 114 C122 116 138 116 148 112 C148 130 138 140 130 140 C120 140 112 130 112 114 Z" fill="#9E1048" {T}/>
    <path d="M118 132 C122 125 136 125 142 132 C136 138 124 138 118 132 Z" fill="#F27BA5" stroke="none"/>
    <!-- brazo derecho saludando (encima de la cabeza para que se vea) -->
    <path d="M166 162 C186 152 206 138 216 112 C224 112 232 118 230 128 C222 150 202 168 178 180 Z" {PIEL} {T}/>
    <path d="M214 112 C210 100 212 90 218 88 C220 82 228 80 230 86 C236 82 244 86 242 94 C248 96 250 104 244 110 C240 118 228 120 220 118 Z" {PIEL} {T}/>
    <path d="M224 92 L226 104 M233 92 L232 104 M240 99 L236 107" stroke="#4A1530" stroke-width="2.2" fill="none"/>
    <!-- manga derecha -->
    <path d="M164 146 C182 144 194 156 190 170 C186 180 168 182 160 174 Z" fill="#FFFFFF" {T}/>
    <path d="M168 178 c4 -3 8 -3 12 0 c3 -3 6 -3 9 -1" fill="none" stroke="#E0357E" stroke-width="2.4"/>
  </g>
</svg>
"""
open("assets/svg/ajolote-saluda.svg", "w", encoding="utf8").write(svg)
print("ok")
