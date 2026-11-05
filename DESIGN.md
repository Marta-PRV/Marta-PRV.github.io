# DESIGN.md — Campiña 98

Sistema de diseño del portfolio. **Escritorio de verdad, estilo Windows 98 clásico (original, sin copiar marcas), sobre un paisaje de colinas pixel propio.** Sustituye al planteamiento anterior ("Campiña XP", web con scroll). Se revisará contra la web construida al terminar y se ajustarán los valores que no pasen contraste AA.

## Concepto
La web es un **escritorio que ocupa exactamente la pantalla** (sin scroll de página): iconos en una columna a la izquierda, ventanas compactas solapadas como un collage, diálogos de aviso en cascada con humor, un reproductor con ecualizador pixel, pegatinas pixel sueltas y garabatos rojos a mano. Las ventanas **se pueden arrastrar** y la que se pulsa pasa al frente, pero **arrastrar es un extra**: al entrar todo está ya colocado y legible, y nada necesita moverse para encontrarse. Un proyecto se abre como una ventana grande con scroll solo interno. En móvil no se arrastra: cada ventana se abre a pantalla completa como una app.

**Sin logos, nombres de producto, tipografías, iconos ni fondos de Microsoft.** Nombres genéricos ("Bloc de notas", "Dibujo", "Escuchando ahora"); reproductor sin nombre ni logo de Winamp.

Firma visual: el **paisaje de colinas y cielo pixel-art** propio. Claro = mediodía; oscuro = el mismo paisaje al anochecer. El contenido va dentro de ventanas opacas, nunca suelto sobre el paisaje.

## Color (tokens en `src/styles/tokens.css`)
| Rol | Claro (mediodía) | Oscuro (anochecer) |
|---|---|---|
| Cielo / colinas | ver `--sky-*`, `--hill-*` | ídem, versión noche |
| `--window` (cara gris) | `#C6C6C6` | `#3A3A42` |
| `--window-text` | `#101010` | `#ECECF4` |
| Bisel claro / sombra / oscuro | `#FFFFFF` / `#808080` / `#404040` | `#5C5C68` / `#1C1C22` / `#0C0C10` |
| `--titlebar-a` → `-b` (activa) | `#0A0A78` → `#1084D0` | `#14146E` → `#3A62B8` |
| Barra inactiva | `#6B6B74` → `#A8A8B2` | `#4A4A54` → `#6A6A76` |
| `--titlebar-text` | `#FFFFFF` | `#FFFFFF` |
| `--paper` (bloc, campos) | `#FFFFFF` | `#161826` |
| `--note` (adhesiva) | `#FBE08A` | `#D9B85A` |
| `--ink` (garabatos) | `#A8321E` | `#FF8A70` |
| `--link` | `#0B3FA8` | `#9DB8FF` |
| `--focus` | `#C2410C` | `#FFD166` |

Reglas: la barra de título tiene solo dos tonos (azul marino → azul); **la ventana delantera tiene la barra azul y las demás grises** (así se ve cuál tiene el foco); tinta roja solo para garabatos y acentos; el texto de cuerpo siempre sobre `--window` o `--paper`, nunca directo sobre el fondo. Contraste ≥ 4.5:1 (texto) y ≥ 3:1 (componentes) en ambos modos.

## Tipografía
- **Pixelify Sans** — títulos de ventana y etiquetas (≥ 15px; 14px en las etiquetas de iconos en móvil). **Solo peso 400** (en 500/700 se rellenan los huecos de las letras: "Contacto" se leía "Oontacto"). Para énfasis: tamaño, subrayado o color, nunca `font-weight` > 400 con `--font-ui`.
- **Atkinson Hyperlegible Next** — cuerpo y párrafos (16–18px, interlineado 1.6).
- **Permanent Marker** — solo garabatos y 1–2 palabras de acento. Nunca párrafos.
- Autoalojadas (woff2, subset latino), `font-display: swap`.

## Ventana (Windows 98)
- Cara gris con **bisel de 2px**: borde exterior negro de 1px, luces blancas arriba/izquierda, sombras grises abajo/derecha. Sin sombra difusa: la elevación es el bisel.
- Barra de título: icono + título + tres botones **reales**: minimizar, maximizar, cerrar. Botones biselados que se **hunden 1px** al pulsar; objetivo táctil/clic ≥ 24px con zona ampliada.
- Cuerpo con `overflow: auto` y scroll **solo interno**. Es un `section`/`article` con `aria-labelledby` (no `dialog`, salvo la ventana de proyecto).
- Estados: abierta (delantera / de fondo), minimizada (oculta, su botón sigue en la barra de tareas), cerrada (oculta y sin botón; se reabre desde Inicio o con Recolocar), maximizada (llena el escritorio; Esc la restaura).
- Anchos compactos por defecto: foto ~17.5rem · bloc ~23rem · tecnologías ~28rem · contacto ~20rem · reproductor ~18rem · avisos ~17rem · proyecto ≤ 60rem.

## Escritorio (PC: ancho ≥ 52rem **y** alto ≥ 34rem)
- Área de escritorio fija: `position: fixed; inset: 0 0 var(--taskbar-h)`, `overflow: hidden`. **La página nunca hace scroll.**
- **Columna de iconos pegada a la izquierda** (Proyectos primero, luego accesos), en columna vertical que pasa a una segunda columna si no caben (como un escritorio real). Es lo primero en el orden de Tab.
- **Collage** (posiciones iniciales en % del escritorio, solapes orgánicos, siempre legibles): Dibujo (foto) y encima `sobre_mi.txt`; Mis tecnologías; Contacto; el reproductor **Escuchando ahora**; **3 diálogos de aviso apilados en cascada** con humor (editables en `src/data/alerts.ts`); **pegatinas pixel** sueltas (CD, ordenador, disquete; decorativas, sin pointer-events); **garabatos** rojos. Se comprueba que cabe sin scroll en 1366×768 y escala hasta 1920×1080.
- **Barra de tareas** gris con bisel: botón **Inicio** (símbolo propio de colinas/sol) con menú; **un botón por ventana abierta** (la delantera aparece hundida; clic = traer al frente, restaurar o minimizar); botón **Recolocar** (devuelve todas las ventanas a su sitio y reabre las cerradas); bandeja con idioma, tema y reloj.
- Foco por teclado: al enfocar algo dentro de una ventana (Tab), esa ventana pasa al frente, así nada queda tapado para quien navega con teclado.

## Proyecto como ventana
`/proyectos/<slug>` (y `/en/projects/<slug>`) muestra el escritorio detrás (inerte, `aria-hidden`) y una **ventana grande** delante (`role="dialog"`, `aria-modal`, `aria-labelledby`), con scroll interno. Cerrar con la X (un enlace real a `/`), con Esc o con "← Escritorio". Cada proyecto mantiene su URL, `title` y `description` propios. El foco entra en la ventana al abrirse y vuelve al icono al cerrarse.

## Vídeo (reproductor retro)
Muestra una **miniatura local** del vídeo (descargada una vez y optimizada con `astro:assets`; cero peticiones a terceros al cargar), con botón de play. Al pulsar carga el `<iframe>` de `youtube-nocookie.com`. Los botones de la cubierta del reproductor llevan **símbolos pixel** (anterior, play, stop, siguiente).

## Escuchando ahora (reproductor decorativo)
Ventana con ecualizador pixel de 12 barras (CSS), marquesina con un título genérico y botones con símbolos. **Sin audio**: es decoración. Datos en `src/data/nowPlaying.ts`.

## Iconos de escritorio
- Pixel 16×16 pintado a ×3 (48px); etiqueta debajo en Pixelify Sans 400 (≥ 15px PC, 14px móvil), con `iconLabel` opcional en el MDX para nombres cortos.
- Etiqueta blanca sobre pastilla azul marino semiopaca (≥ 4.5:1). Hover/foco: selección azul sólida + contorno punteado; el icono sube 3px solo con ratón real (`hover: hover`), nunca con foco de teclado.
- Icono temático propio por proyecto (campo `icon`): zombi, paleta, carnet, gafas VR (TFG, más adelante). Accesos: sobre, maletín, `</>`, libro. Sin logos de marcas.
- Tecnologías: azulejo pixel con monograma (mini fuente 3×5) y nombre debajo; datos en `src/data/tech.ts`.

## Móvil / apps (ancho < 52rem **o** alto < 34rem)
- **Sin arrastrar.** El escritorio es una **rejilla de iconos tipo pantalla de inicio** (4 columnas): proyectos, Sobre mí, Tecnologías, Foto, Contacto, LinkedIn, GitHub, Cómo está hecho.
- Cada ventana se abre **a pantalla completa** (encima de la barra de tareas) con scroll interno. Se abre con la URL `#sobre-mi`/`#tecnologias`… (CSS `:target`), el botón "atrás" la cierra, la X es un enlace a `#` y Esc también. Los proyectos son ventanas completas por defecto.
- Barra de tareas: Inicio + bandeja (idioma, tema, reloj). Sin diálogos de aviso ni pegatinas.

## Qué usa JavaScript y por qué
- **Gestor de ventanas** (`src/scripts/windowManager.ts`, vanilla, ~3–4 KB): arrastrar (Pointer Events + `transform`), traer al frente, minimizar/maximizar/cerrar, barra de tareas, Recolocar. CSS no puede mover ventanas ni recordar cuál está delante. **Sin JS** las ventanas quedan fijas en su posición inicial y todo sigue siendo legible y enlazable.
- **Esc y foco** al abrir/cerrar la ventana de proyecto. La X ya funciona sin JS.
- **Sin ClientRouter (decisión)**: abrir un proyecto o volver al escritorio es una carga de página normal (robusto, con URL y SEO reales). El gestor guarda posiciones, estado y orden de las ventanas en `sessionStorage` mientras dura la visita, y un script mínimo en línea las aplica antes del primer pintado para que no haya parpadeo. Al volver de un proyecto, el foco regresa al icono desde el que se abrió.
- Ya existentes: tema, reloj, copiar email, vídeo con fachada.
- **CSS puro**: ecualizador, marquesina, cascada de apertura, estados de iconos, apps de móvil (`:target`).

## Movimiento
- **Cascada de apertura** al cargar: `opacity` 0→1 y `scale` .97→1, 160ms, ease-out exponencial, escalonada ~70ms por ventana (≈300ms en total); el contenido es visible sin JS.
- Botones: pulsado hunde 1px (100ms). Iconos y azulejos de tecnologías: salto de 3px solo con ratón real; `:active` en táctil.
- Arrastre: la ventana sigue al puntero sin transición (seguimiento directo); al soltar, nada rebota. "Recolocar" anima el regreso (≤ 250ms, ease-out).
- Ecualizador: barras con `steps()` (aspecto pixel), marquesina lenta; **en pose fija con `prefers-reduced-motion`**. Todo lo animado va dentro de `@media (prefers-reduced-motion: no-preference)`; arrastrar sigue funcionando (es una acción del usuario). Solo `transform` y `opacity`.

## Humor de los avisos
Tono ligero y autoirónico sobre programar. **Nunca afirmaciones falsas sobre Marta** (cifras, empleos, logros) ni mensajes que parezcan errores reales del sitio. Se editan en `src/data/alerts.ts`.

## Prohibido
Degradados morados genéricos, tarjetas idénticas con sombra difusa, emojis como iconos, glassmorphism, texto de relleno, `transition: all`, logos/marcas/fondos de Microsoft o Winamp, audio con reproducción automática.
