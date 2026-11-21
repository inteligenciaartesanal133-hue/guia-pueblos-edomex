# Genera las otras poses del ajolote a partir de assets/svg/ajolote-saluda.svg.
# Uso: python scripts/generar-poses.py
import re

base = open("assets/svg/ajolote-saluda.svg", encoding="utf8").read()

def cortar(s, desde, hasta):
    i = s.index(desde); j = s.index(hasta, i)
    return s[:i], s[j:]

TRAZO = 'stroke="#4A1530" stroke-width="3.5"'
PIEL = 'fill="#F9B9CD"'

poses = {
  "duerme": dict(
    cara=f'''    <!-- ojos cerrados durmiendo -->
    <path d="M88 100 C94 108 106 108 112 100" fill="none" stroke="#2A0F1F" stroke-width="4.5"/>
    <path d="M142 100 C148 108 160 108 166 100" fill="none" stroke="#2A0F1F" stroke-width="4.5"/>
    <ellipse cx="128" cy="124" rx="6" ry="5" fill="#9E1048" stroke="#4A1530" stroke-width="3"/>
''',
    brazo=f'''    <!-- brazo derecho abajo -->
    <path d="M178 170 C186 196 182 216 172 222 C164 214 162 196 164 176 Z" {PIEL} {TRAZO}/>
    <!-- letras Z del sueno -->
    <path d="M206 34 h18 l-18 20 h18" fill="none" stroke="#6D2468" stroke-width="4.5"/>
    <path d="M226 6 h12 l-12 13 h12" fill="none" stroke="#6D2468" stroke-width="3.5"/>
''', titulo="Ajolote dormido"),
  "senala": dict(
    cara='''    <!-- ojos abiertos -->
    <ellipse cx="100" cy="98" rx="11" ry="13" fill="#2A0F1F" stroke="none"/>
    <circle cx="104" cy="92" r="4.5" fill="#FFFFFF" stroke="none"/><circle cx="97" cy="104" r="2" fill="#FFFFFF" stroke="none"/>
    <ellipse cx="154" cy="96" rx="11" ry="13" fill="#2A0F1F" stroke="none"/>
    <circle cx="158" cy="90" r="4.5" fill="#FFFFFF" stroke="none"/><circle cx="151" cy="102" r="2" fill="#FFFFFF" stroke="none"/>
    <path d="M114 112 C120 112 136 112 144 110 C144 126 136 136 128 136 C120 136 114 126 114 112 Z" fill="#9E1048" stroke="#4A1530" stroke-width="3.2"/>
    <path d="M118 128 C122 122 134 122 138 128 C134 134 122 134 118 128 Z" fill="#F27BA5" stroke="none"/>
''',
    brazo=f'''    <!-- brazo derecho senalando -->
    <path d="M168 162 C190 158 210 152 226 146 C232 152 232 162 226 166 C208 172 190 178 172 180 Z" {PIEL} {TRAZO}/>
    <rect x="232" y="146" width="22" height="9" rx="4.5" {PIEL} {TRAZO}/>
    <circle cx="232" cy="157" r="11" {PIEL} {TRAZO}/>
''', titulo="Ajolote señalando"),
  "lee": dict(
    cara='''    <!-- ojos mirando al libro -->
    <ellipse cx="100" cy="104" rx="10" ry="8" fill="#2A0F1F" stroke="none"/><circle cx="103" cy="101" r="3" fill="#FFFFFF" stroke="none"/>
    <ellipse cx="154" cy="102" rx="10" ry="8" fill="#2A0F1F" stroke="none"/><circle cx="157" cy="99" r="3" fill="#FFFFFF" stroke="none"/>
    <path d="M118 122 C122 128 134 128 138 122" fill="none" stroke="#2A0F1F" stroke-width="3.5"/>
''',
    brazo=f'''    <!-- libro abierto -->
    <path d="M90 176 L128 184 L166 176 L170 212 L128 220 L86 212 Z" fill="#C2185B" {TRAZO}/>
    <path d="M94 172 L128 180 L128 214 L92 206 Z" fill="#FFFFFF" {TRAZO}/>
    <path d="M162 172 L128 180 L128 214 L164 206 Z" fill="#FFFFFF" {TRAZO}/>
    <path d="M100 184 l20 4 M100 192 l20 4 M136 188 l20 -4 M136 196 l20 -4" stroke="#B88AA0" stroke-width="2.4"/>
    <circle cx="90" cy="200" r="10" {PIEL} {TRAZO}/>
    <circle cx="166" cy="200" r="10" {PIEL} {TRAZO}/>
''', titulo="Ajolote leyendo"),
}

for nombre, p in poses.items():
    antes, resto = cortar(base, "    <!-- ojo abierto -->", "    <!-- brazo derecho saludando")
    s = antes + p["cara"] + resto
    antes, resto = cortar(s, "    <!-- brazo derecho saludando", "    <!-- manga derecha -->")
    s = antes + p["brazo"] + resto
    s = s.replace("Ajolote mascota saludando", p["titulo"])
    # al leer, el libro va encima de las mangas: lo movemos al final
    if nombre == "lee":
        i = s.index("    <!-- libro abierto -->"); j = s.index("    <!-- manga derecha -->")
        libro = s[i:j]; s = s[:i] + s[j:]
        s = s.replace("  </g>\n</svg>", libro + "  </g>\n</svg>")
    open(f"assets/svg/ajolote-{nombre}.svg", "w", encoding="utf8").write(s)
    print("ok", nombre)
