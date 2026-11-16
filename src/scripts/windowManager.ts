/**
 * Gestor de ventanas del escritorio (PC). JavaScript puro, sin librerías.
 *
 * Qué hace (y por qué necesita JS):
 *  - Arrastrar ventanas por su barra de título (Pointer Events + `translate`).
 *  - Traer al frente la que se pulsa o recibe el foco (así Tab nunca deja algo tapado).
 *  - Minimizar / maximizar / cerrar, y los botones de la barra de tareas y del menú Inicio.
 *  - Una sola regla para "activar" una ventana: cerrada -> se abre; minimizada -> se
 *    restaura; detrás -> al frente; ya delante -> un destello de la barra de título.
 *  - Extras decorativos (música y avisos): empiezan cerrados si no hay sitio libre.
 *  - "Recolocar": devuelve todo a su sitio y reabre lo cerrado.
 *  - Esc: cierra la ventana de página (proyecto) y vuelve al escritorio.
 *  - Recuerda posiciones y estado en sessionStorage mientras dura la visita.
 *
 * Sin JS, o en el modo "apps" (móvil), este archivo no activa nada: las ventanas
 * quedan en su sitio por CSS y todo sigue siendo legible y enlazable.
 *
 * Todos los eventos están delegados en `document`: no dependen de elementos concretos.
 */

// Deben coincidir con los criterios de src/styles/desktop.css
const DESKTOP_QUERY = '(min-width: 76rem) and (min-height: 38rem)';
/** Hay sitio libre para los extras (música y avisos) sin tapar ventanas importantes. */
const ROOM_QUERY = '(min-width: 96rem) and (min-height: 52rem)';
const STORE = 'desk:v1';
const Z_BASE = 100;
const KEEP_VISIBLE = 96; // px de la ventana que deben quedar siempre dentro del escritorio

const mq = window.matchMedia(DESKTOP_QUERY);
const room = window.matchMedia(ROOM_QUERY);
/** Ventana delantera al entrar y al recolocar. */
const DEFAULT_FRONT = 'sobre-mi';
const root = document.documentElement;
let zTop = Z_BASE;
let drag: { win: HTMLElement; startX: number; startY: number; dx0: number; dy0: number; baseLeft: number; baseTop: number; width: number } | null = null;

const active = () => mq.matches && root.classList.contains('wm');
const desk = () => document.querySelector<HTMLElement>('[data-desk]');
const windows = () => Array.from(document.querySelectorAll<HTMLElement>('.desk .window[data-draggable]'));
const byId = (id: string | undefined) => windows().find((w) => w.dataset.window === id);
const group = (prefix: string | undefined) => windows().filter((w) => prefix && w.dataset.window?.startsWith(prefix));
const isExtra = (w: HTMLElement) => w.hasAttribute('data-extra');
const num = (v: string) => parseFloat(v) || 0;

/** Ventanas que empiezan cerradas (data-start="closed", p. ej. "Mis proyectos"). */
const startsClosed = (w: HTMLElement) => w.dataset.start === 'closed';
/** Hay que forzar su visibilidad al abrirlas (el CSS las oculta mientras no se hayan abierto a propósito). */
const needsShown = (w: HTMLElement) => isExtra(w) || startsClosed(w);

/** Estado inicial: las de inicio cerrado, cerradas; los extras solo abiertos si hay sitio libre. */
const defaultState = (w: HTMLElement) => (startsClosed(w) || (isExtra(w) && !room.matches) ? 'closed' : 'open');

/* ───────────── Estado guardado ───────────── */

interface Saved {
  w: Record<string, { dx: number; dy: number; s: string; m: number }>;
  order: string[];
}

function read(): Saved | null {
  try {
    return JSON.parse(sessionStorage.getItem(STORE) ?? 'null');
  } catch {
    return null;
  }
}

function save() {
  const data: Saved = { w: {}, order: [] };
  for (const w of windows()) {
    data.w[w.dataset.window!] = {
      dx: num(w.style.getPropertyValue('--dx')),
      dy: num(w.style.getPropertyValue('--dy')),
      s: w.dataset.state ?? 'open',
      m: w.hasAttribute('data-max') ? 1 : 0,
    };
  }
  data.order = windows()
    .sort((a, b) => num(a.style.zIndex) - num(b.style.zIndex))
    .map((w) => w.dataset.window!);
  try {
    sessionStorage.setItem(STORE, JSON.stringify(data));
  } catch {
    /* sin almacenamiento: las posiciones solo duran esta página */
  }
}

/* ───────────── Botones de la barra de tareas, bandeja y menú ───────────── */

type WinState = 'closed' | 'open' | 'front';

function winState(w: HTMLElement): WinState {
  if (w.dataset.state === 'closed') return 'closed';
  if (w.dataset.state === 'min') return 'open';
  return w.hasAttribute('data-front') ? 'front' : 'open';
}

/** Refleja el estado de cada ventana en sus botones (estado visual y aria-pressed). */
function updateButtons() {
  document.querySelectorAll<HTMLElement>('[data-toggle]').forEach((btn) => {
    const w = byId(btn.dataset.toggle);
    if (!w) return;
    const st = winState(w);
    btn.dataset.winState = st;
    // Botón fijo: "pulsado" = es la ventana delantera. Extra: "pulsado" = está visible.
    const pressed = isExtra(w) ? w.dataset.state === 'open' : st === 'front';
    btn.setAttribute('aria-pressed', String(pressed));
  });
  document.querySelectorAll<HTMLElement>('[data-toggle-group]').forEach((btn) => {
    const anyOpen = group(btn.dataset.toggleGroup).some((w) => w.dataset.state === 'open');
    btn.setAttribute('aria-pressed', String(anyOpen));
  });
}

/* ───────────── Ventanas ───────────── */

function front(win: HTMLElement) {
  if (win.hasAttribute('data-front') && win.dataset.state === 'open') return;
  win.style.zIndex = String(++zTop);
  for (const w of windows()) {
    if (w === win) {
      w.removeAttribute('data-inactive');
      w.setAttribute('data-front', '');
    } else {
      w.setAttribute('data-inactive', '');
      w.removeAttribute('data-front');
    }
  }
  updateButtons();
  save();
}

/** La ventana abierta que está más arriba (para pasarle el frente al cerrar o minimizar otra). */
function topmostOpen(except?: HTMLElement) {
  const z = (w: HTMLElement) => num(w.style.zIndex || getComputedStyle(w).zIndex);
  return windows()
    .filter((w) => w !== except && w.dataset.state === 'open')
    .sort((a, b) => z(b) - z(a))[0];
}

function focusWindow(win: HTMLElement) {
  const title = win.querySelector<HTMLElement>('.window__title');
  if (!title) return;
  title.tabIndex = -1;
  title.focus({ preventScroll: true });
}

/** Hace visible una ventana (abierta o restaurada) sin traerla al frente todavía. */
function show(win: HTMLElement) {
  win.dataset.state = 'open';
  // Los extras y las ventanas de inicio cerrado, abiertos a propósito, deben verse aunque el escritorio sea pequeño
  if (needsShown(win)) win.setAttribute('data-shown', '');
}

function setState(win: HTMLElement, state: 'open' | 'min' | 'closed') {
  const wasFront = win.hasAttribute('data-front');
  if (state === 'open') show(win);
  else win.dataset.state = state;
  if (state !== 'open') {
    win.removeAttribute('data-front');
    if (wasFront) {
      const next = topmostOpen(win);
      if (next) front(next);
    }
  }
  updateButtons();
  save();
}

/** Destello breve de la barra de título: "esta es la ventana que has pedido". */
function flash(win: HTMLElement) {
  win.removeAttribute('data-flash');
  void win.offsetWidth; // reinicia la animación
  win.setAttribute('data-flash', '');
  window.setTimeout(() => win.removeAttribute('data-flash'), 1000);
}

/**
 * LA regla para abrir una ventana desde el menú Inicio o un icono:
 * cerrada -> se abre; minimizada -> se restaura; detrás -> al frente; ya delante -> destello.
 */
function activateWindow(win: HTMLElement) {
  const wasFront = win.dataset.state === 'open' && win.hasAttribute('data-front');
  show(win);
  front(win);
  updateButtons();
  focusWindow(win);
  if (wasFront) flash(win);
  save();
}

/** Botón fijo de la barra de tareas: cerrada -> abre; detrás -> frente; delante -> minimiza (extras: cierra). */
function toggleWindow(win: HTMLElement) {
  if (win.dataset.state !== 'open') {
    show(win);
    front(win);
  } else if (!win.hasAttribute('data-front')) {
    front(win);
  } else {
    setState(win, isExtra(win) ? 'closed' : 'min');
    return;
  }
  updateButtons();
  save();
}

/** Grupo de ventanas (los 3 avisos): si alguno está abierto se cierran todos; si no, se abren todos. */
function toggleGroup(prefix: string | undefined) {
  const ws = group(prefix);
  if (!ws.length) return;
  if (ws.some((w) => w.dataset.state === 'open')) {
    ws.forEach((w) => {
      w.dataset.state = 'closed';
      w.removeAttribute('data-front');
    });
    const next = topmostOpen();
    if (next && !windows().some((w) => w.hasAttribute('data-front'))) front(next);
  } else {
    openGroup(prefix);
    return;
  }
  updateButtons();
  save();
}

function openGroup(prefix: string | undefined) {
  const ws = group(prefix);
  ws.forEach(show);
  const last = ws[ws.length - 1];
  if (last) {
    last.removeAttribute('data-front');
    front(last);
  }
  updateButtons();
  save();
}

function toggleMaximize(win: HTMLElement) {
  const max = !win.hasAttribute('data-max');
  win.toggleAttribute('data-max', max);
  const btn = win.querySelector<HTMLElement>('[data-action="maximize"]');
  if (btn) btn.setAttribute('aria-pressed', String(max));
  front(win);
  save();
}

/* ───────────── Arrastre ───────────── */

function bounds(win: HTMLElement) {
  const d = desk()!.getBoundingClientRect();
  const r = win.getBoundingClientRect();
  const dx = num(win.style.getPropertyValue('--dx'));
  const dy = num(win.style.getPropertyValue('--dy'));
  return { d, r, dx, dy, baseLeft: r.left - dx, baseTop: r.top - dy };
}

/** Limita el desplazamiento para que la barra de título siga siempre al alcance. */
function clamp(left: number, top: number, width: number, d: DOMRect) {
  return {
    left: Math.min(Math.max(left, d.left - width + KEEP_VISIBLE), d.right - KEEP_VISIBLE),
    top: Math.min(Math.max(top, d.top), d.bottom - 32),
  };
}

function onPointerDown(e: PointerEvent) {
  const target = e.target as Element;
  const win = target.closest<HTMLElement>('.desk .window[data-draggable]');
  if (win && active()) front(win);

  const bar = target.closest<HTMLElement>('.window__bar');
  if (!win || !bar || !active() || e.button !== 0 || target.closest('.ctl') || win.hasAttribute('data-max')) return;
  e.preventDefault(); // evita seleccionar texto al arrastrar
  const b = bounds(win);
  drag = { win, startX: e.clientX, startY: e.clientY, dx0: b.dx, dy0: b.dy, baseLeft: b.baseLeft, baseTop: b.baseTop, width: b.r.width };
  try {
    bar.setPointerCapture(e.pointerId);
  } catch {
    /* puntero sintético o ya liberado: el arrastre sigue funcionando por los eventos de document */
  }
  document.body.classList.add('is-dragging');
}

function onPointerMove(e: PointerEvent) {
  if (!drag) return;
  const d = desk()!.getBoundingClientRect();
  const want = { left: drag.baseLeft + drag.dx0 + (e.clientX - drag.startX), top: drag.baseTop + drag.dy0 + (e.clientY - drag.startY) };
  const c = clamp(want.left, want.top, drag.width, d);
  drag.win.style.setProperty('--dx', `${c.left - drag.baseLeft}px`);
  drag.win.style.setProperty('--dy', `${c.top - drag.baseTop}px`);
}

function onPointerEnd() {
  if (!drag) return;
  drag = null;
  document.body.classList.remove('is-dragging');
  save();
}

/** Tras cambiar el tamaño de la pantalla, mete de nuevo en el escritorio lo que haya quedado fuera. */
function clampAll() {
  if (!active()) return;
  for (const w of windows()) {
    if (w.dataset.state !== 'open') continue; // las ocultas no tienen caja que medir
    const b = bounds(w);
    const c = clamp(b.r.left, b.r.top, b.r.width, b.d);
    w.style.setProperty('--dx', `${b.dx + (c.left - b.r.left)}px`);
    w.style.setProperty('--dy', `${b.dy + (c.top - b.r.top)}px`);
  }
  save();
}

/* ───────────── Recolocar ───────────── */

function reset() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  for (const w of windows()) {
    if (!reduce) w.classList.add('is-resetting');
    w.style.removeProperty('--dx');
    w.style.removeProperty('--dy');
    w.style.zIndex = '';
    w.dataset.state = defaultState(w);
    if (needsShown(w)) w.toggleAttribute('data-shown', w.dataset.state === 'open');
    w.removeAttribute('data-max');
    w.removeAttribute('data-front');
    w.setAttribute('data-inactive', '');
  }
  zTop = Z_BASE;
  const first = byId(DEFAULT_FRONT) ?? windows()[0];
  if (first) front(first);
  updateButtons();
  try {
    sessionStorage.removeItem(STORE);
  } catch {
    /* nada que borrar */
  }
  setTimeout(() => windows().forEach((w) => w.classList.remove('is-resetting')), 300);
}

/* ───────────── Activación ───────────── */

function enable() {
  root.classList.add('wm');
  const saved = read();
  for (const w of windows()) {
    const s = saved?.w[w.dataset.window!];
    if (s) {
      w.style.setProperty('--dx', `${s.dx}px`);
      w.style.setProperty('--dy', `${s.dy}px`);
      w.dataset.state = s.s;
      w.toggleAttribute('data-max', !!s.m);
    } else {
      w.dataset.state = defaultState(w); // los extras empiezan cerrados si no hay sitio libre
    }
    if (needsShown(w)) w.toggleAttribute('data-shown', w.dataset.state === 'open');
    w.setAttribute('data-inactive', '');
  }
  // Orden de apilado guardado (de atrás hacia delante)
  saved?.order.forEach((id) => {
    const w = byId(id);
    if (w) w.style.zIndex = String(++zTop);
  });
  const start = byId(DEFAULT_FRONT);
  const last = saved?.order.map(byId).filter((w) => w && w.dataset.state === 'open' && !isExtra(w)).pop() ?? start;
  if (last) {
    last.removeAttribute('data-front');
    front(last);
  }
  // Los botones fijos son enlaces #id: con el gestor activo se comportan como botones
  document.querySelectorAll<HTMLElement>('a[data-toggle]').forEach((a) => a.setAttribute('role', 'button'));
  updateButtons();
  clampAll();
}

function disable() {
  root.classList.remove('wm');
  document.body.classList.remove('is-dragging');
  document.querySelectorAll<HTMLElement>('a[data-toggle]').forEach((a) => a.removeAttribute('role'));
  drag = null;
}

function apply() {
  if (mq.matches) enable();
  else disable();
}

/* ───────────── Eventos ───────────── */

document.addEventListener('pointerdown', onPointerDown, true);
document.addEventListener('pointermove', onPointerMove);
document.addEventListener('pointerup', onPointerEnd);
document.addEventListener('pointercancel', onPointerEnd);

document.addEventListener('focusin', (e) => {
  if (!active()) return;
  const win = (e.target as Element).closest<HTMLElement>('.desk .window[data-draggable]');
  if (win && win.dataset.state === 'open') front(win);
});

document.addEventListener('click', (e) => {
  const target = e.target as Element;

  // Recuerda desde qué icono se abrió un proyecto, para devolver ahí el foco al cerrarlo
  const icon = target.closest<HTMLAnchorElement>('.dicon');
  if (icon && !icon.target) {
    try {
      sessionStorage.setItem('desk:last', icon.getAttribute('href') ?? '');
    } catch {
      /* sin almacenamiento */
    }
  }

  if (!active()) return;

  // Con una ventana de página abierta (proyecto…) el escritorio de detrás es inerte:
  // los enlaces del menú navegan con normalidad (p. ej. "Sobre mí" lleva a /#sobre-mi).
  if (document.querySelector('.window--page')) return;

  const action = target.closest<HTMLElement>('[data-action]');
  if (action?.dataset.action === 'reset') {
    e.preventDefault();
    reset();
    return;
  }
  const win = action?.closest<HTMLElement>('.desk .window[data-draggable]');
  if (action && win) {
    if (action.dataset.action === 'close') {
      e.preventDefault();
      setState(win, 'closed');
      return;
    }
    if (action.dataset.action === 'minimize') {
      setState(win, 'min');
      return;
    }
    if (action.dataset.action === 'maximize') {
      toggleMaximize(win);
      return;
    }
  }

  // Botones de la barra de tareas y de la bandeja
  const toggle = target.closest<HTMLElement>('[data-toggle]');
  if (toggle) {
    const w = byId(toggle.dataset.toggle);
    if (w) {
      e.preventDefault();
      toggleWindow(w);
    }
    return;
  }
  const toggleGrp = target.closest<HTMLElement>('[data-toggle-group]');
  if (toggleGrp) {
    e.preventDefault();
    toggleGroup(toggleGrp.dataset.toggleGroup);
    return;
  }

  // Menú Inicio e iconos que abren ventanas
  const openGrp = target.closest<HTMLElement>('[data-open-group]');
  if (openGrp) {
    e.preventDefault();
    openGroup(openGrp.dataset.openGroup);
    return;
  }
  const opener = target.closest<HTMLElement>('[data-open]');
  if (opener) {
    const w = byId(opener.dataset.open);
    if (w) {
      e.preventDefault();
      activateWindow(w);
    }
    return;
  }
});

document.addEventListener('keydown', (e) => {
  // Los botones fijos son enlaces con role="button": la barra espaciadora también los activa
  if (e.key === ' ' && active()) {
    const btn = (e.target as Element).closest<HTMLAnchorElement>('a[role="button"][data-toggle]');
    if (btn) {
      e.preventDefault();
      btn.click();
      return;
    }
  }

  if (e.key !== 'Escape' || e.defaultPrevented) return;
  if (document.querySelector(':popover-open')) return; // el menú Inicio gestiona su propio Esc

  // Ventana de página (proyecto…): Esc vuelve al escritorio
  const close = document.querySelector<HTMLAnchorElement>('.window--page [data-action="close"]');
  if (close) {
    window.location.href = close.href;
    return;
  }
  if (active()) {
    const maxed = windows().find((w) => w.hasAttribute('data-max'));
    if (maxed) toggleMaximize(maxed);
    return;
  }
  // Modo apps: Esc cierra la "app" abierta (equivale a pulsar su X)
  document.querySelector<HTMLElement>('.window:target [data-action="close"]')?.click();
});

/* En modo apps, al abrir una ventana por su #ancla el foco entra en ella */
function focusTarget() {
  if (active()) return;
  const win = document.querySelector<HTMLElement>('.window:target');
  if (win) focusWindow(win);
}
window.addEventListener('hashchange', focusTarget);

let resizeTimer: number | undefined;
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(clampAll, 120);
});

mq.addEventListener('change', apply);

function init() {
  apply();
  // Ventana de página abierta: el foco entra en ella (es un diálogo modal)
  const page = document.querySelector<HTMLElement>('.window--page');
  if (page) {
    focusWindow(page);
    return;
  }
  // Llegada con #ancla de una ventana (p. ej. desde el menú Inicio de otra página): se activa
  const hashWin = active() ? byId(decodeURIComponent(location.hash.slice(1))) : undefined;
  if (hashWin) {
    activateWindow(hashWin);
    return;
  }
  focusTarget();
  // Volviendo de un proyecto: el foco regresa al icono desde el que se abrió
  try {
    const last = sessionStorage.getItem('desk:last');
    sessionStorage.removeItem('desk:last');
    if (last) document.querySelector<HTMLElement>(`.dicon[href="${CSS.escape(last)}"]`)?.focus({ preventScroll: true });
  } catch {
    /* sin almacenamiento */
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
