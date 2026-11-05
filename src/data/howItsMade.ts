import type { Lang } from '../i18n/ui';

/**
 * Texto de la página "Cómo está hecho". Cada frase debe describir algo que existe de verdad
 * en el código: si cambias el portfolio, actualiza aquí lo que ya no sea cierto.
 */
export interface HowSection {
  heading: string;
  items: string[];
}

export interface HowContent {
  /** Título de la ventana (nombre de archivo del Bloc de notas). */
  title: string;
  /** Título de la pestaña y del SEO. */
  heading: string;
  description: string;
  intro: string;
  sections: HowSection[];
}

export const howItsMade: Record<Lang, HowContent> = {
  es: {
    title: 'como_esta_hecho.txt — Bloc de notas',
    heading: 'Cómo está hecho',
    description:
      'Las decisiones de diseño y técnicas detrás de este portfolio: un escritorio estilo Windows 98 hecho con Astro y MDX, con gestor de ventanas propio, accesibilidad y rendimiento.',
    intro:
      'Este portfolio es un escritorio de los 2000 que ocupa exactamente la pantalla: ventanas que se pueden arrastrar, una barra de tareas y un menú Inicio. Pero nada depende de arrastrar: al entrar todo está colocado y legible, y cada proyecto está a un clic. Estas son las decisiones que hay detrás.',
    sections: [
      {
        heading: 'Diseño',
        items: [
          'Retro propio, no copiado. Inspirado en Windows 98, pero sin logos, tipografías ni fondos de Microsoft. El paisaje de colinas está hecho con rectángulos SVG y los iconos son rejillas de 16×16 píxeles dibujadas a mano en texto.',
          'Ventanas con relieve. El bisel sale hacia fuera en reposo y se hunde al pulsar. La ventana de delante tiene la barra azul y las demás, gris, para ver siempre cuál tiene el foco.',
          'Modo claro y oscuro. Cada color se define una sola vez con light-dark(): mediodía en claro, anochecer en oscuro, con el mismo paisaje.',
          'Tipografía pensada para leer. Pixelify Sans solo en peso normal (en negrita, «Contacto» se leía «Oontacto»), Atkinson Hyperlegible Next para los textos y Permanent Marker solo para detalles.',
          'Etiquetas legibles sobre cualquier fondo. Los nombres de los iconos van sobre una pastilla azul marino en lugar de flotar sobre el paisaje.',
          'Movimiento con medida. Las ventanas se abren en cascada en unos 300 ms y todo se apaga con «reducir movimiento» (arrastrar sigue funcionando). No hay pantalla de arranque que haga esperar.',
          'Logos de marca solo donde toca. Los de LinkedIn y GitHub de la ventana «Mis redes» van sin modificar, como permiten sus guías de marca, y solo sirven para enlazar a mis perfiles.',
        ],
      },
      {
        heading: 'Técnica',
        items: [
          'Astro y MDX. La web es HTML estático. El JavaScript es un gestor de ventanas escrito a mano, sin librerías, más el cambio de tema, el reloj, el botón de copiar el email y el vídeo.',
          'Gestor de ventanas. Arrastrar con Pointer Events, traer al frente al pulsar o al tabular, minimizar, maximizar y cerrar, barra de tareas y botón de recolocar. Recuerda las posiciones mientras dura la visita. Sin JavaScript, las ventanas quedan en su sitio y se leen igual.',
          'Cada proyecto es una ventana con su propia URL, para poder compartirlo y para el SEO. El scroll es solo dentro de la ventana; Esc o la X vuelven al escritorio.',
          'Añadir un proyecto es crear dos archivos MDX (español e inglés). Su cabecera está validada con Zod: si falta un dato, la compilación falla en vez de publicar algo a medias.',
          'Los datos que cambian se editan en un archivo cada uno: tecnologías, redes, avisos, el reproductor y el texto de «sobre mí».',
          'Bilingüe. Los textos de la interfaz viven en un archivo de traducciones y el inglés cuelga de /en/.',
          'Vídeo con fachada. Muestra una miniatura propia y no descarga nada de YouTube hasta que se pulsa; entonces usa youtube-nocookie.com.',
          'Imágenes optimizadas. Astro las convierte a WebP en varios tamaños: mi foto pasa de 110 kB a entre 10 y 58 kB.',
          'Adaptable a cualquier pantalla. En pantallas grandes es un escritorio; en móvil, una rejilla de iconos donde cada ventana se abre a pantalla completa como una app. La música y los avisos solo empiezan abiertos si hay sitio libre, para no tapar nada importante.',
          'El email público se codifica en entidades HTML como protección básica contra robots de spam.',
        ],
      },
      {
        heading: 'Accesibilidad',
        items: [
          'HTML semántico, un solo h1 por página, enlace para saltar al contenido y foco de teclado siempre visible.',
          'Todo se maneja con teclado: Tab recorre iconos y ventanas (una ventana tapada pasa al frente al recibir el foco), Enter abre y Esc vuelve al escritorio.',
          'La ventana de un proyecto es un diálogo modal: el escritorio de detrás queda inerte para lectores de pantalla y teclado.',
          'Arrastrar es un extra: nada necesita moverse para encontrar contenido.',
        ],
      },
    ],
  },
  en: {
    title: 'how_its_made.txt — Notepad',
    heading: 'How it is made',
    description:
      'The design and technical decisions behind this portfolio: a Windows 98-style desktop built with Astro and MDX, with its own window manager, accessibility and performance.',
    intro:
      'This portfolio is an early-2000s desktop that fills the screen exactly: draggable windows, a taskbar and a Start menu. But nothing depends on dragging: everything is laid out and readable on arrival, and every project is one click away. These are the decisions behind it.',
    sections: [
      {
        heading: 'Design',
        items: [
          'Retro, but original. Inspired by Windows 98, with no Microsoft logos, fonts or wallpapers. The hills landscape is built from SVG rectangles and the icons are 16×16 pixel grids drawn by hand as text.',
          'Windows with relief. The bevel sticks out at rest and sinks when pressed. The front window has a blue title bar and the others are grey, so you can always tell which one has focus.',
          'Light and dark mode. Every colour is defined once with light-dark(): midday in light, dusk in dark, with the same landscape.',
          'Typography made for reading. Pixelify Sans only at regular weight (in bold, "Contacto" read as "Oontacto"), Atkinson Hyperlegible Next for body text and Permanent Marker only for small touches.',
          'Labels that read on any background. Icon names sit on a navy pill instead of floating over the landscape.',
          'Measured motion. Windows open in a cascade in about 300 ms and everything switches off with "reduce motion" (dragging still works). There is no boot screen making anyone wait.',
          'Brand logos only where they belong. The LinkedIn and GitHub ones in the "My profiles" window are unmodified, as their brand guidelines allow, and only link to my profiles.',
        ],
      },
      {
        heading: 'Technical',
        items: [
          'Astro and MDX. The site is static HTML. The JavaScript is a hand-written window manager with no libraries, plus the theme switch, the clock, the copy-email button and the video.',
          'Window manager. Dragging with Pointer Events, bring to front on click or Tab, minimise, maximise and close, a taskbar and a rearrange button. It remembers positions for the duration of the visit. Without JavaScript the windows stay in place and read the same.',
          'Every project is a window with its own URL, for sharing and for SEO. Scrolling happens only inside the window; Esc or the X return to the desktop.',
          'Adding a project means creating two MDX files (Spanish and English). Their header is validated with Zod: if a field is missing, the build fails instead of publishing something half-finished.',
          'Data that changes lives in one file each: technologies, profiles, alerts, the player and the "about me" text.',
          'Bilingual. Interface text lives in one translations file and English sits under /en/.',
          'Video behind a facade. It shows a local thumbnail and downloads nothing from YouTube until it is clicked; then it uses youtube-nocookie.com.',
          'Optimised images. Astro converts them to WebP in several sizes: my photo goes from 110 kB to between 10 and 58 kB.',
          'Adapts to any screen. On large screens it is a desktop; on mobile it is a grid of icons where each window opens full screen like an app. The music and alerts only start open when there is free room, so they never cover anything important.',
          'The public email is encoded as HTML entities as basic protection against spam bots.',
        ],
      },
      {
        heading: 'Accessibility',
        items: [
          'Semantic HTML, a single h1 per page, a skip-to-content link and an always-visible keyboard focus.',
          'Everything works with the keyboard: Tab moves through icons and windows (a covered window comes to the front when it receives focus), Enter opens and Esc returns to the desktop.',
          'A project window is a modal dialog: the desktop behind it is inert for screen readers and keyboard.',
          'Dragging is an extra: nothing needs to be moved to find content.',
        ],
      },
    ],
  },
};
