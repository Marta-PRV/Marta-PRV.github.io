import { expect, test } from '@playwright/test';

// SEO y compartir: Open Graph, Twitter, hreflang, JSON-LD, robots y sitemap.
const pages: [string, 'es' | 'en'][] = [
  ['/', 'es'],
  ['/en/', 'en'],
  ['/proyectos/carnets-universidad/', 'es'],
  ['/en/projects/carnets-universidad/', 'en'],
];

for (const [path, lang] of pages) {
  test(`metadatos de ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{40,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://marta-prv.github.io${path}`);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://marta-prv.github.io/og/preview.png',
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', lang === 'es' ? 'es_ES' : 'en_GB');
    expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBeGreaterThanOrEqual(2);
    const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
    expect(ld['@type']).toBe('Person');
    expect(ld.sameAs).toContain('https://github.com/Marta-PRV');
  });
}

test('robots.txt, sitemap e imagen de vista previa existen', async ({ request }) => {
  expect(await (await request.get('/robots.txt')).text()).toContain(
    'Sitemap: https://marta-prv.github.io/sitemap-index.xml',
  );
  expect((await request.get('/sitemap-index.xml')).ok()).toBeTruthy();
  const img = await request.get('/og/preview.png');
  expect(img.headers()['content-type']).toContain('image/png');
});
