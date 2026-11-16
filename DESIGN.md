# DESIGN.md — Campiña 98

Sistema de diseño del portfolio. **Escritorio de verdad, estilo Windows 98 clásico (original, sin copiar marcas), sobre un paisaje de colinas pixel propio.** Sustituye al planteamiento anterior ("Campiña XP", web con scroll). Se revisará contra la web construida al terminar y se ajustarán los valores que no pasen contraste AA.

## Concepto
La web es un **escritorio que ocupa exactamente la pantalla** (sin scroll de página): una carpeta "Mis proyectos" a la izquierda, ventanas compactas solapadas como un collage, diálogos de aviso en cascada con humor, un reproductor con ecualizador pixel. Las ventanas **se pueden arrastrar** y la que se pulsa pasa al frente, pero **arrastrar es un extra**: al entrar todo está ya colocado y legible, y nada necesita moverse para encontrarse. Un proyecto se abre como una ventana grande con scroll solo interno. En móvil no se arrastra: cada ventana se abre a pantalla completa como una app.

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
- Anchos compactos por defecto: foto 17.5rem · bloc 21rem · tecnologías 26rem · contacto 19rem · redes 14.5rem · reproductor 13.5rem · avisos 14rem · proyecto ≤ 60rem.

## Escritorio (PC: ancho ≥ 76rem **y** alto ≥ 38rem)
- Área de escritorio fija: `position: fixed; inset: 0 0 var(--taskbar-h)`, `overflow: hidden`. **La página nunca hace scroll.**
- **Columna izquierda = SOLO proyectos**, con el título a mano "mis proyectos" encima y una flecha hacia abajo que apunta al primer icono. Es lo primero en el orden de Tab. **Zona derecha**: accesos directos (hoy solo "Cómo está hecho"). Contacto, LinkedIn y GitHub ya no son iconos: son ventanas.
- **Ventanas importantes** (foto, bloc, tecnologías, contacto, redes): colocación inicial **sin solapes salvo el deliberado foto/bloc** (el bloc tapa ~2.5rem del borde de la foto, nunca la cara). Cada una parte de su posición compacta y se reparte según lo que sobra de pantalla (`--sx`/`--sy`), así el collage ocupa también la parte de abajo y escala con la pantalla. Si el texto de una ventana no cabe en alto, hay scroll dentro de la ventana, nunca fuera del escritorio.
- **Extras decorativos** (música y 3 avisos con humor, editables en `src/data/alerts.ts`): a la derecha del conjunto, siempre por debajo de las ventanas importantes, y **solo empiezan abiertos si hay sitio libre** (ancho ≥ 100rem y alto ≥ 42rem); si no, empiezan cerrados y se abren desde la bandeja o Inicio. Comprobado de 1216×608 a 2560×1300: ningún extra toca una ventana importante.
- **Barra de tareas** (gris con bisel): `[Inicio] | [Sobre mí][Foto][Tecnologías][Contacto][Mis redes] | … | bandeja: [Recolocar][♪][⚠] · [EN][tema] · reloj`. Los **botones fijos** están siempre: cerrada → la abre; abierta detrás → al frente; minimizada → la restaura; **delante → la minimiza**. Tres estados visuales: cerrada (relieve), abierta (relieve + barrita azul), delante (hundida con trama de puntos; es la única con `aria-pressed`). Los **extras** (música, avisos) son iconos pequeños de la bandeja que abren y cierran ("Avisos" actúa sobre los 3). Con una ventana de página abierta, los botones fijos y los extras se ocultan.
- **Menú Inicio**: Proyectos ▸ (submenú con los proyectos), Sobre mí, Contacto, Mis redes, Cómo está hecho, separador, Extras ▸ (Música, Avisos), Recolocar el escritorio, Idioma, Tema. Cada ventana: cerrada → se abre; minimizada → se restaura; detrás → al frente; **ya delante → destello breve de la barra de título** (para que no parezca que no hace nada). Submenús tipo *disclosure* (botón con `aria-expanded`; Esc cierra primero el submenú y luego el menú). En móvil se despliegan en vertical y no hay Extras ni Recolocar.
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
- Icono temático propio por proyecto (campo `icon`): zombi, paleta, carnet, gafas VR (TFG, más adelante). Acceso de la derecha: libro ("Cómo está hecho").
- Tecnologías: azulejo pixel con monograma (mini fuente 3×5) y nombre debajo; datos en `src/data/tech.ts`.

## Mis redes (logos de marca)
Ventana con dos **azulejos cuadrados blancos** (como los de tecnologías; siempre blancos, también en oscuro) y un botón por red ("Ver mi LinkedIn", "Ver mi GitHub"). **Excepción documentada** a "sin logos de marcas": solo estos dos, **sin modificarlos** (proporciones y forma originales, color oficial LinkedIn Blue #0A66C2 e Invertocat en negro), solo para **enlazar a mis perfiles** y sin dar a entender que LinkedIn o GitHub respalden esta web. Ambas guías lo permiten (LinkedIn: los miembros pueden usar el logo "in" para su perfil; GitHub: "usa la Invertocat como botón social hacia tu perfil"). Los trazos vienen de la colección Simple Icons (CC0), que reproduce los logos oficiales. Datos en `src/data/socials.ts`.

## Móvil / apps (ancho < 76rem **o** alto < 38rem)
- **Sin arrastrar.** El escritorio es una **rejilla de iconos tipo pantalla de inicio** (4 columnas): proyectos, Sobre mí, Foto, Tecnologías, Contacto, Mis redes, Cómo está hecho.
- Cada ventana se abre **a pantalla completa** (encima de la barra de tareas) con scroll interno. Se abre con la URL `#sobre-mi`/`#tecnologias`… (CSS `:target`), el botón "atrás" la cierra, la X es un enlace a `#` y Esc también. Los proyectos son ventanas completas por defecto.
- Barra de tareas: Inicio + bandeja (idioma, tema, reloj). Sin diálogos de aviso.

## Qué usa JavaScript y por qué
- **Gestor de ventanas** (`src/scripts/windowManager.ts`, vanilla): arrastrar (Pointer Events + `translate`), traer al frente, minimizar/maximizar/cerrar, botones fijos y extras de la barra de tareas, opciones del menú Inicio, Recolocar, estado inicial de los extras según el espacio libre y destello. CSS no puede mover ventanas ni recordar cuál está delante. **Sin JS** las ventanas quedan fijas en su posición inicial y todo sigue siendo legible y enlazable.
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
