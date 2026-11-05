# DESIGN.md — Campiña XP

Sistema de diseño inicial (intención). Se revisará contra la web construida al terminar y se ajustarán los valores que no pasen contraste AA.

## Concepto
Una web normal, clara y con scroll, "vestida" como un escritorio de la era Windows XP: ventanas con barra de título, Bloc de notas, Paint, reproductor de CD, notas adhesivas y garabatos a mano. Inspirada en Windows, sin copiarlo. **Sin logos de Microsoft, sin Bliss, sin tipografías ni iconos de Microsoft.**

Firma visual: el fondo de **colinas y cielo pixel-art propio**. En claro es mediodía; en oscuro es el mismo paisaje al anochecer (mismas colinas, cielo estrellado). El contenido nunca va sobre el paisaje: va dentro de ventanas opacas.

## Color (tokens en `src/styles/tokens.css`)
| Rol | Claro (mediodía) | Oscuro (anochecer) |
|---|---|---|
| `--sky` | `#8EC3F0` | `#14183A` |
| `--hill` | `#5FA83A` | `#1E4A3A` |
| `--window` (cuerpo) | `#ECE9D8` | `#2A2D3E` |
| `--window-text` | `#1B1B1B` | `#ECE9F5` |
| `--titlebar-a` / `-b` | `#1F5FD0` / `#3F8CF0` | `#3A4BB0` / `#4F63D0` |
| `--titlebar-text` | `#FFFFFF` | `#FFFFFF` |
| `--note` (adhesiva) | `#FBE08A` | `#D9B85A` |
| `--ink` (garabatos) | `#A8321E` | `#FF8A70` |
| `--link` | `#0B3FA8` | `#9DB8FF` |
| `--focus` | `#C2410C` | `#FFD166` |

Reglas: máximo dos tonos por barra de título (sin degradados decorativos más allá de ese par); la tinta roja solo para garabatos y acentos; el texto de cuerpo siempre sobre `--window`, nunca directamente sobre el fondo. Verificar contraste ≥ 4.5:1 (texto) y ≥ 3:1 (componentes) en ambos modos.

## Tipografía
- **Pixelify Sans** — títulos de ventana y etiquetas de interfaz (tamaño ≥ 15px). **Solo peso 400**: en 500/700 se rellenan los huecos de las letras y "Contacto" se lee "Oontacto" (comprobado visualmente). No usar `font-weight` > 400 con `--font-ui`; para énfasis usar tamaño, subrayado o color.
- **Atkinson Hyperlegible Next** — cuerpo y párrafos largos (16–18px, interlineado 1.6).
- **Permanent Marker** — solo garabatos y 1–2 palabras de acento por pantalla. Nunca para párrafos.
- Autoalojadas (woff2, subset latino), `font-display: swap`, precarga de las dos primeras.

## Componentes
- **Window**: marco de 2px, esquinas superiores redondeadas 6px, barra de título con icono + texto + 3 botones decorativos (`aria-hidden`), cuerpo opaco. Es un `article`/`section` con `aria-labelledby`.
- **Taskbar**: barra fija inferior (móvil: inferior compacta). Botón **Inicio** propio (símbolo de colina/sol, no la bandera de Windows) abre el menú de navegación (Proyectos, Sobre mí, Contacto, Cómo está hecho). A la derecha: tema, idioma, reloj decorativo.
- **StickyNote**: nota adhesiva con datos rápidos, ligera rotación (≤ 2°) estática.
- **NotepadAbout**: "Sobre mí" como Bloc de notas con barra de menú decorativa.
- **PaintPhoto**: foto de Marta dentro de una ventana tipo Paint con paleta de colores como marco.
- **CdPlayer**: reproductor retro que envuelve el vídeo de YouTube (fachada hasta pulsar).
- **Iconos**: pixel-art propio en SVG, rejilla 16/32px, trazo de 1px, paleta limitada; `shape-rendering: crispEdges`.
- **Garabatos**: SVG a mano (flechas, estrellas, subrayados) con `--ink`, decorativos (`aria-hidden`).

## Layout
Una columna central máx. ~1100px sobre el paisaje. Orden: Inicio con cabecera breve → **proyectos como ventanas (primero)** → sobre mí + nota + foto → contacto. Móvil: ventanas a ancho completo con 16px de margen, sin superposiciones. En escritorio, solo ligeros solapes decorativos que nunca tapan texto.

## Movimiento
- Ventana al entrar en pantalla: `opacity` 0→1 y `scale` .97→1, 120ms, `ease-out`, una sola vez.
- Botones: pulsado hunde 1px (`translateY`), 80ms.
- Nubes: deriva lenta (≈60s) en el fondo; CD girando solo mientras reproduce.
- Todo dentro de `@media (prefers-reduced-motion: no-preference)`; con reduced-motion todo queda estático. Solo `transform` y `opacity`.

## Prohibido
Degradados morados genéricos, tarjetas idénticas con sombra difusa, emojis como iconos, glassmorphism, texto de relleno, `transition: all`, logos/marcas de Microsoft.
