/**
 * Gestor de ventanas del escritorio (PC). JavaScript puro, sin librerías.
 *
 * Qué hace (y por qué necesita JS):
 *  - Arrastrar ventanas por su barra de título (Pointer Events + `translate`).
 *  - Traer al frente la que se pulsa o recibe el foco (así Tab nunca deja algo tapado).
 *  - Minimizar / maximizar / cerrar, y la barra de tareas con un botón por ventana.
 *  - "Recolocar": devuelve todo a su sitio y reabre lo cerrado.
 *  - Esc: cierra la ventana de página (proyecto) y vuelve al escritorio.
 *  - Recuerda posiciones y estado en sessionStorage mientras dura la visita.
 *
 * Sin JS, o en el modo "apps" (móvil), este archivo no activa nada: las ventanas
 * quedan en su sitio por CSS y todo sigue siendo legible y enlazable.
 *
 * Todos los eventos están delegados en `document`: no dependen de elementos concretos.
 */

// Debe coincidir con el criterio de src/styles/desktop.css
const DESKTOP_QUERY = '(min-width: 76rem) and (min-height: 38rem)';
const STORE = 'desk:v1';
const DEFAULT_FRONT = 'sobre-mi';
const Z_BASE = 100;
const KEEP_VISIBLE = 96; // px de la ventana que deben quedar siempre dentro del escritorio

const mq = window.matchMedia(DESKTOP_QUERY);
const root = document.documentElement;
let zTop = Z_BASE;
let drag: { win: HTMLElement; startX: number; startY: number; dx0: number; dy0: number; baseLeft: number; baseTop: number; width: number } | null = null;

const active = () => mq.matches && root.classList.contains('wm');
const desk = () => document.querySelector<HTMLElement>('[data-desk]');
const windows = () => Array.from(document.querySelectorAll<HTMLElement>('.desk .window[data-draggable]'));
const byId = (id: string | undefined) => windows().find((w) => w.dataset.window === id);
const num = (v: string) => parseFloat(v) || 0;

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
  syncTasks();
  save();
}

/** La ventana abierta que está más arriba (para pasarle el foco al cerrar o minimizar otra). */
function topmostOpen(except?: HTMLElement) {
  return windows()
    .filter((w) => w !== except && w.dataset.state === 'open')
    .sort((a, b) => num(b.style.zIndex || getComputedStyle(b).zIndex) - num(a.style.zIndex || getComputedStyle(a).zIndex))[0];
}

function focusWindow(win: HTMLElement) {
  const title = win.querySelector<HTMLElement>('.window__title');
  if (!title) return;
  title.tabIndex = -1;
  title.focus({ preventScroll: true });
}

function setState(win: HTMLElement, state: 'open' | 'min' | 'closed') {
  const wasFront = win.hasAttribute('data-front');
  win.dataset.state = state;
  if (state !== 'open') {
    win.removeAttribute('data-front');
    if (wasFront) {
      const next = topmostOpen(win);
      if (next) front(next);
    }
  }
  syncTasks();
  save();
}

function openWindow(win: HTMLElement) {
  win.dataset.state = 'open';
  front(win);
  syncTasks();
  focusWindow(win);
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

/* ───────────── Barra de tareas ───────────── */

function syncTasks() {
  const list = document.querySelector<HTMLElement>('[data-tasks]');
  if (!list) return;
  const shown = new Set<string>();
  for (const w of windows()) {
    const id = w.dataset.window!;
    if (w.dataset.state === 'closed') continue;
    shown.add(id);
    let btn = list.querySelector<HTMLButtonElement>(`[data-win="${id}"]`);
    if (!btn) {
      const li = document.createElement('li');
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'task';
      btn.dataset.win = id;
      const icon = w.querySelector('.window__bar > svg')?.cloneNode(true);
      const label = document.createElement('span');
      label.textContent = w.querySelector('.window__title')?.textContent ?? id;
      if (icon) btn.append(icon);
      btn.append(label);
      li.append(btn);
      list.append(li);
    }
    btn.setAttribute('aria-pressed', String(w.hasAttribute('data-front') && w.dataset.state === 'open'));
  }
  list.querySelectorAll<HTMLElement>('[data-win]').forEach((b) => {
    if (!shown.has(b.dataset.win!)) b.closest('li')?.remove();
  });
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
    w.dataset.state = 'open';
    w.removeAttribute('data-max');
    w.removeAttribute('data-front');
    w.setAttribute('data-inactive', '');
  }
  zTop = Z_BASE;
  const first = byId(DEFAULT_FRONT) ?? windows()[0];
  if (first) front(first);
  syncTasks();
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
    }
    w.setAttribute('data-inactive', '');
  }
  // Orden de apilado guardado (de atrás hacia delante)
  saved?.order.forEach((id) => {
    const w = byId(id);
    if (w) w.style.zIndex = String(++zTop);
  });
  const start = byId(DEFAULT_FRONT);
  const last = saved?.order.map(byId).filter((w) => w && w.dataset.state === 'open').pop() ?? start;
  if (last) {
    last.removeAttribute('data-front');
    front(last);
  } else {
    syncTasks();
  }
  clampAll();
}

function disable() {
  root.classList.remove('wm');
  document.body.classList.remove('is-dragging');
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

  const action = target.closest<HTMLElement>('[data-action]');
  if (action?.dataset.action === 'reset') {
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

  // Botón de la barra de tareas: traer, restaurar o minimizar
  const task = target.closest<HTMLElement>('[data-win]');
  if (task) {
    const w = byId(task.dataset.win);
    if (!w) return;
    if (w.dataset.state === 'min') openWindow(w);
    else if (w.hasAttribute('data-front')) setState(w, 'min');
    else openWindow(w);
    return;
  }

  // Iconos / menú Inicio que abren una ventana de la portada (en vez de navegar)
  const opener = target.closest<HTMLElement>('[data-open]');
  if (opener) {
    const w = byId(opener.dataset.open);
    if (w) {
      e.preventDefault();
      openWindow(w);
    }
    return;
  }

  // "Proyectos" en la barra: lleva el foco a la columna de iconos
  const link = target.closest<HTMLAnchorElement>('a[href$="#proyectos"]');
  if (link) {
    e.preventDefault();
    document.querySelector<HTMLElement>('.icons .dicon')?.focus();
  }
});

document.addEventListener('keydown', (e) => {
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
