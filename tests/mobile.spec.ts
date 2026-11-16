import { expect, test } from '@playwright/test';

// Móvil: rejilla de iconos y ventanas a pantalla completa con :target.

const overflowX = (page: import('@playwright/test').Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

test('la portada es una rejilla de iconos sin desborde', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.dicon').first()).toBeVisible();
  expect(await overflowX(page)).toBeLessThanOrEqual(0);
});

test('los iconos y botones táctiles miden al menos 44 px', async ({ page }) => {
  await page.goto('/');
  const small = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('.dicon, .taskbar a, .taskbar button')]
      .map((el) => ({ n: el.className || el.tagName, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.width > 0 && (r.height < 43.5 || r.width < 43.5))
      .map(({ n, r }) => `${n} ${Math.round(r.width)}×${Math.round(r.height)}`),
  );
  expect(small).toEqual([]);
});

test('abrir una ventana con :target y cerrarla', async ({ page }) => {
  await page.goto('/');
  await page.locator('.dicon[href$="#contacto"]').click();
  const win = page.locator('#contacto');
  await expect(win).toBeVisible();
  await expect(page).toHaveURL(/#contacto$/);
  expect((await win.boundingBox())!.width).toBeGreaterThan(370);
  await win.locator('[data-action="close"]').click();
  await expect(win).toBeHidden();
});

test('de proyectos a un proyecto y vuelta', async ({ page }) => {
  await page.goto('/#proyectos');
  await page.locator('#proyectos .file__link').first().click();
  await expect(page).toHaveURL(/\/proyectos\//);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await overflowX(page)).toBeLessThanOrEqual(0);
  await page.locator('.window--page [data-action="close"]').click();
  await expect(page).toHaveURL(/:4321\/$/);
});

test('en inglés, sin desborde', async ({ page }) => {
  await page.goto('/en/');
  expect(await overflowX(page)).toBeLessThanOrEqual(0);
});
