// Capturas para el README. Uso: npm run build && npm run preview (otra terminal) && npm run screenshots
import { chromium, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const site = process.env.SITE_URL ?? 'http://localhost:4321';
const out = (name) => fileURLToPath(new URL(`../docs/screenshots/${name}`, import.meta.url));
const browser = await chromium.launch();

async function shot(name, path, { theme = 'light', ...ctxOpts } = {}) {
  const ctx = await browser.newContext(ctxOpts);
  await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme);
  const page = await ctx.newPage();
  await page.goto(site + path);
  await page.waitForTimeout(1800); // fin de las animaciones de entrada
  await page.screenshot({ path: out(name) });
  await ctx.close();
}

const desktop = { viewport: { width: 1600, height: 840 } };
await shot('escritorio-claro.png', '/', desktop);
await shot('escritorio-oscuro.png', '/', { ...desktop, theme: 'dark' });
await shot('proyecto.png', '/proyectos/carnets-universidad/', desktop);
await shot('movil.png', '/', { ...devices['Pixel 7'] });
await browser.close();
