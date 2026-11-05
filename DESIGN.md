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

## Escritorio (portada) — enfoque vigente
La portada es un **escritorio de los 2000, ordenado y compacto**, pero sigue siendo una web con scroll: **sin ventanas arrastrables**. Nada es enorme: ventanas pequeñas con anchos máximos fijos y relleno ajustado.

**Anchos máximos:** foto ~16rem · bloc de notas ~23rem · tecnologías ~26rem · contacto ~20rem · página de proyecto ~60rem. Barra de título ~1.9rem, relleno del cuerpo `--s-4`.

**PC (≥ 52rem)**, tres zonas dentro de un contenedor de ~68rem:
- Izquierda, **Proyectos**: iconos de escritorio en columna (proyecto con más prioridad arriba). Primer elemento tabulable de la página tras la navegación.
- Centro: ventana **Dibujo** (foto) y encima, solapada ~3rem, el **Bloc de notas** `sobre_mi.txt`. El solape cubre solo el hombro/margen de la foto, **nunca la cara ni texto**. Debajo, la ventana **Mis tecnologías** y la ventanita **Contacto** (`#contacto`).
- Derecha, **Accesos**: iconos de Contacto, LinkedIn, GitHub y Cómo está hecho (como los iconos del lateral derecho de un escritorio real).

**Móvil (< 52rem)**, orden de lectura: Proyectos (rejilla de iconos 3–4 columnas, tipo pantalla de inicio de teléfono) → foto + bloc con solape suave (~1rem) → tecnologías (4 columnas) → contacto → accesos (4 columnas). Margen lateral 16px, sin desbordes horizontales.

**Accesibilidad de la estructura:** un `h1` visualmente oculto ("Marta Prieto, ingeniera de software"); las zonas de iconos son `section` con `h2` oculto; cada icono es un `<a>` normal con nombre visible, activable con Enter, objetivo táctil ≥ 44px.

## Iconos de escritorio
- Icono pixel 16×16 pintado a ×3 (48px) para que los píxeles sean nítidos; etiqueta debajo en Pixelify Sans 400, ≥ 15px en PC y 14px en móvil (4 columnas), centrada. Nombre corto opcional con `iconLabel` en el MDX para que no se parta ("Zombie FPS", "Carnets").
- **Etiqueta legible sobre cualquier fondo:** texto blanco sobre una pastilla azul marino semiopaca (contraste ≥ 4.5:1 sobre cielo claro y oscuro; se verifica midiendo píxeles). No texto flotando sobre el paisaje.
- **Hover/foco:** selección azul sólida en la etiqueta + contorno punteado de 1px alrededor (guiño al escritorio clásico), además del anillo de foco global. Nunca solo color: el contorno y el movimiento también cambian.
- Cada proyecto tiene **icono temático propio** (campo `icon` del MDX): zombi (FPS), paleta (ArtPrompt), carnet (carnets), gafas VR (TFG, más adelante). Accesos: sobre (Contacto), maletín (LinkedIn), `</>` (GitHub), engranaje (Cómo está hecho). Sin logos de marcas.
- **Tecnologías:** azulejo pixel por tecnología con monograma (mini fuente 3×5 propia) en color propio, con nombre debajo. Datos en un único archivo `src/data/tech.ts`.

## Ventanas especiales
- **Proyecto:** ventana grande con barra de menú ("← Escritorio" funcional); el botón X de cierre es un enlace real al escritorio.
- **404:** ventana de error (icono de aviso, mensaje, botón "Aceptar" que vuelve al escritorio).
- **Contacto:** ventanita con el email visible, botón "Copiar" y enlace "Escribir correo".
- **Sin pantalla de arranque** (decisión: estorba a reclutadores y retrasa el primer contenido).

## Movimiento
- **Apertura en cascada** al cargar: cada ventana `opacity` 0→1 y `scale` .97→1, 160ms, ease-out exponencial, escalonadas ~70ms (≈300ms en total), una sola vez; el contenido ya es visible sin JS ni animación.
- **Iconos:** al pasar el ratón o tocar, el icono sube 2px con un pequeño rebote de 2 pasos (150ms); `:active` lo hunde 1px. Solo con `(hover: hover)` y `:active` para táctil.
- Botones: pulsado hunde 1px (`translateY`), 100ms. Nubes: deriva lenta (≈60s); CD girando solo mientras reproduce.
- Todo dentro de `@media (prefers-reduced-motion: no-preference)`; con reduced-motion todo queda estático. Solo `transform` y `opacity`.

## Prohibido
Degradados morados genéricos, tarjetas idénticas con sombra difusa, emojis como iconos, glassmorphism, texto de relleno, `transition: all`, logos/marcas de Microsoft.
