import { expect, test, type Locator, type Page } from '@playwright/test';

// Escritorio: ventanas, barra de tareas, menú Inicio, Esc, idioma y tema.

const win = (page: Page, id: string) => page.locator(`.desk .window[data-window="${id}"]`);

// Espera a que acaben las animaciones finitas de una ventana (entrada): si no, su caja se mide a medio mover.
const animationsDone = (loc: Locator) =>
  loc.evaluate((el) =>
    Promise.all(el.getAnimations().filter((a) => Number.isFinite(a.effect?.getComputedTiming().endTime)).map((a) => a.finished)),
  );

const overflowX = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('la portada carga con título, ventanas importantes y sin desborde', async ({ page }) => {
  await expect(page).toHaveTitle(/Marta Prieto/);
  for (const id of ['foto', 'sobre-mi', 'tecnologias', 'contacto', 'redes']) {
    await expect(win(page, id)).toBeVisible();
  }
  // "Mis proyectos" empieza cerrada
  await expect(win(page, 'proyectos')).toBeHidden();
  expect(await overflowX(page)).toBeLessThanOrEqual(0);
});

test('con espacio, los extras (música y avisos) empiezan abiertos', async ({ page }) => {
  await expect(win(page, 'escuchando')).toBeVisible();
  await expect(win(page, 'aviso-info')).toBeVisible();
});

test('se puede arrastrar una ventana por su barra de título', async ({ page }) => {
  await animationsDone(win(page, 'foto'));
  const before = (await win(page, 'foto').boundingBox())!;
  const b = (await win(page, 'foto').locator('.window__bar').boundingBox())!;
  await page.mouse.move(b.x + 80, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + 200, b.y + 120, { steps: 8 });
  await page.mouse.up();
  const after = (await win(page, 'foto').boundingBox())!;
  expect(Math.abs(after.x - before.x)).toBeGreaterThan(80);
  expect(Math.abs(after.y - before.y)).toBeGreaterThan(60);
  // la posición se recuerda al recargar (sessionStorage)
  await page.reload();
  await animationsDone(win(page, 'foto'));
  const again = (await win(page, 'foto').boundingBox())!;
  expect(Math.abs(again.x - after.x)).toBeLessThan(2);
});

test('pulsar una ventana la trae al frente', async ({ page }) => {
  await win(page, 'contacto').locator('.window__title').click();
  await expect(win(page, 'contacto')).toHaveAttribute('data-front', '');
  await win(page, 'redes').locator('.window__title').click();
  await expect(win(page, 'redes')).toHaveAttribute('data-front', '');
  await expect(win(page, 'contacto')).not.toHaveAttribute('data-front', '');
});

test('cerrar, reabrir desde la barra de tareas y minimizar', async ({ page }) => {
  const redes = win(page, 'redes');
  await redes.locator('[data-action="close"]').click();
  await expect(redes).toBeHidden();
  await page.locator('.task[data-toggle="redes"]').click();
  await expect(redes).toBeVisible();
  await redes.locator('[data-action="minimize"]').click();
  await expect(redes).toBeHidden();
  await page.locator('.task[data-toggle="redes"]').click();
  await expect(redes).toBeVisible();
});

test('maximizar y volver con Esc', async ({ page }) => {
  const sobre = win(page, 'sobre-mi');
  await sobre.locator('[data-action="maximize"]').click();
  await expect(sobre).toHaveAttribute('data-max', '');
  await page.keyboard.press('Escape');
  await expect(sobre).not.toHaveAttribute('data-max', '');
});

test('el menú Inicio abre "Mis proyectos" y lista los proyectos', async ({ page }) => {
  await page.locator('.start').click();
  await page.locator('#start-menu [data-open="proyectos"]').click();
  const proyectos = win(page, 'proyectos');
  await expect(proyectos).toBeVisible();
  await expect(proyectos.locator('.file__link')).toHaveCount(4);
});

test('la carpeta del escritorio abre "Mis proyectos"', async ({ page }) => {
  await page.locator('.dicon[data-open="proyectos"]').click();
  await expect(win(page, 'proyectos')).toBeVisible();
});

test('proyecto: URL propia, enlace al repo y Esc vuelve al escritorio', async ({ page }) => {
  await page.locator('.dicon[data-open="proyectos"]').click();
  await win(page, 'proyectos').locator('.file__link').first().click();
  await expect(page).toHaveURL(/\/proyectos\/[a-z0-9-]+\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const repo = page.locator('.window--page a.btn[href^="https://github.com/"]:not([data-memoir])');
  await expect(repo).toHaveAttribute('target', '_blank');
  await expect(repo).toHaveAttribute('rel', /noopener/);
  await expect(page.locator('html.wm')).toHaveCount(1); // el gestor de ventanas (script diferido) ya escucha el teclado
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/:4321\/$/);
});

test('todos los proyectos enlazan a un repositorio de GitHub', async ({ page }) => {
  await page.locator('.dicon[data-open="proyectos"]').click();
  const hrefs = await win(page, 'proyectos')
    .locator('.file__link')
    .evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    await page.goto(href);
    await expect(page.locator('.window--page a.btn[href^="https://github.com/"]:not([data-memoir])')).toHaveCount(1);
  }
});

test('HealthSimVR va el primero, con etiqueta TFG y botón de memoria en PDF', async ({ page }) => {
  await page.locator('.dicon[data-open="proyectos"]').click();
  const primero = win(page, 'proyectos').locator('.file').first();
  await expect(primero.locator('.file__link')).toContainText('HealthSimVR');
  await expect(primero.locator('.badge')).toHaveText('TFG');
  await primero.locator('.file__link').click();
  await expect(page).toHaveURL(/\/proyectos\/healthsimvr\/$/);
  const memoria = page.locator('.window--page a[data-memoir]');
  await expect(memoria).toHaveText(/Leer memoria \(PDF\)/);
  await expect(memoria).toHaveAttribute('href', /HealthSimVR\/blob\/main\/docs\/.+\.pdf$/);
  await expect(memoria).toHaveAttribute('target', '_blank');
});

test('las tecnologías enlazan con los proyectos donde se usaron', async ({ page }) => {
  const casos: [string, string][] = [
    ['openxr', 'HealthSimVR'],
    ['unity', 'HealthSimVR'],
    ['pytorch', 'ArtPrompt'],
    ['nextjs', 'Carnets'],
    ['tailwind', 'Carnets'],
    ['mongodb', 'Carnets'],
  ];
  for (const [id, proyecto] of casos) {
    await win(page, 'tecnologias').locator(`[data-tech-btn="${id}"]`).click();
    await expect(page.locator(`#tp-${id} .tpanel__link`).filter({ hasText: proyecto })).toBeVisible();
    await page.locator(`#tp-${id} [data-tech-back]`).click();
  }
});

test('Mis redes enlaza a LinkedIn y GitHub de Marta', async ({ page }) => {
  const redes = win(page, 'redes');
  await expect(redes.locator('a[href*="linkedin.com/in/"]')).toBeVisible();
  await expect(redes.locator('a[href="https://github.com/Marta-PRV"]')).toBeVisible();
});

test('cambio de idioma ES ↔ EN', async ({ page }) => {
  await page.locator('.tray a[hreflang="en"]').click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('.tray a[hreflang="es"]').click();
  await expect(page).toHaveURL(/:4321\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('cambio de tema claro/oscuro, que se recuerda', async ({ page }) => {
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.locator('.tray [data-theme-toggle]').click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
});

test('"Cómo está hecho" y la 404 funcionan', async ({ page }) => {
  await page.locator('.dicon[href*="como-esta-hecho"]:visible').click();
  await expect(page).toHaveURL(/como-esta-hecho/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const res = await page.goto('/no-existe/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

test('con reduced-motion no hay animaciones de entrada', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4321/');
  const anim = await win(page, 'foto').evaluate((el) => getComputedStyle(el).animationName);
  expect(anim).toBe('none');
  await ctx.close();
});

for (const [w, h] of [
  [1280, 720],
  [1920, 1080],
  [2560, 1440],
]) {
  test(`sin desborde y con títulos visibles a ${w}×${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/');
    expect(await overflowX(page)).toBeLessThanOrEqual(0);
    // los títulos de las ventanas importantes deben quedar siempre a la vista (nada los tapa)
    for (const id of ['sobre-mi', 'tecnologias', 'contacto', 'redes']) {
      const box = (await win(page, id).locator('.window__title').boundingBox())!;
      const top = await page.evaluate(
        ([x, y]) => document.elementFromPoint(x, y)?.closest('.window')?.getAttribute('data-window') ?? null,
        [box.x + 4, box.y + box.height / 2],
      );
      expect(top, `título de ${id}`).toBe(id);
    }
  });
}
