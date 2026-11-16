import { defineConfig, devices } from '@playwright/test';

// Dos proyectos: escritorio (ventanas arrastrables) y móvil (modo apps con :target).
// Los tests prueban el sitio ya compilado (`dist/`), igual que en producción.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 4,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: 'http://127.0.0.1:4321', trace: 'on-first-retry' },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: /mobile\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 900 } },
    },
    {
      name: 'mobile',
      testMatch: /(mobile|a11y|seo)\.spec\.ts/,
      use: { ...devices['Pixel 7'] },
    },
  ],
});
