import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Accesibilidad con axe (WCAG 2.1 A/AA): ambos idiomas, ambos temas, proyecto y 404.
// Se ejecuta en escritorio y en móvil (distinto diseño, distintos contrastes).
const pages = [
  '/',
  '/en/',
  '/proyectos/carnets-universidad/',
  '/proyectos/healthsimvr/',
  '/en/projects/healthsimvr/',
  '/en/projects/carnets-universidad/',
  '/como-esta-hecho/',
  '/404.html',
];

for (const path of pages) {
  for (const theme of ['light', 'dark']) {
    test(`axe: ${path} (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
      await page.goto(path);
      await page.waitForTimeout(1500); // fin de las animaciones de entrada (afectan al contraste medido)
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        violations.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`),
      ).toEqual([]);
    });
  }
}

test('el foco es visible al tabular', async ({ page, isMobile }) => {
  test.skip(isMobile, 'sin teclado en móvil');
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => {
    const s = getComputedStyle(document.activeElement!);
    return { w: parseFloat(s.outlineWidth), style: s.outlineStyle };
  });
  expect(outline.style).not.toBe('none');
  expect(outline.w).toBeGreaterThan(0);
});
