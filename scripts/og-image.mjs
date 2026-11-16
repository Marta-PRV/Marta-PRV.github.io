// Genera la imagen de vista previa (Open Graph / Twitter) a partir del escritorio real.
// Uso: npm run build && npm run preview (en otra terminal) && node scripts/og-image.mjs
// Salida: public/og/preview.png (1200x630).
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const site = process.env.SITE_URL ?? 'http://localhost:4321/';
const out = fileURLToPath(new URL('../public/og/preview.png', import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 840 }, deviceScaleFactor: 0.75 });
await page.addInitScript(() => localStorage.setItem('theme', 'light'));
await page.goto(site);
await page.waitForTimeout(1500); // que terminen las animaciones de entrada
// Tarjeta con el nombre, hecha con los mismos tokens que las ventanas del escritorio.
await page.evaluate(() => {
  // Dejamos sitio para la tarjeta: sin el reproductor ni la ventana de tecnologías.
  document.querySelectorAll('.desk .window[data-window="tecnologias"], .desk .window[data-window="escuchando"]').forEach((w) => (w.style.display = 'none'));
  const card = document.createElement('div');
  card.setAttribute('style', [
    'position:fixed', 'right:3rem', 'bottom:6rem', 'width:34rem', 'z-index:99',
    'background:var(--window)', 'box-shadow:var(--bevel-out)', 'padding:3px', 'color:var(--window-text)',
  ].join(';'));
  card.innerHTML = `
    <div style="background:linear-gradient(90deg,var(--titlebar-a),var(--titlebar-b));color:#fff;font:1rem var(--font-ui);padding:.35rem .6rem">portfolio.exe</div>
    <div style="background:var(--paper);box-shadow:var(--bevel-in);margin:.4rem;padding:1.4rem 1.6rem">
      <div style="font:3.4rem/1 var(--font-ui);color:var(--paper-text)">Marta Prieto</div>
      <div style="font:1.3rem/1.4 var(--font-body);color:var(--window-muted);margin-top:.8rem">Ingeniería de Software<br>Frontend · IA · Videojuegos</div>
    </div>`;
  document.body.append(card);
});
await page.screenshot({ path: out });
await browser.close();
