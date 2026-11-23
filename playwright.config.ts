import { defineConfig, devices } from '@playwright/test';

const SESSION_FILE = 'automatizacion/.auth/standard_user.json';

export default defineConfig({
  testDir: 'automatizacion',
  fullyParallel: true,
  // En GitHub Actions (CI) un reintento absorbe cortes de red momentáneos hacia el sitio
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://www.saucedemo.com',
    // SauceDemo identifica sus elementos con el atributo data-test
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // SLOWMO=700 (milisegundos) ralentiza cada acción para verlas en modo --headed
    launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
  },
  projects: [
    // Inicia sesión una vez y guarda la sesión para los demás tests
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      testMatch: /\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: SESSION_FILE },
    },
    // Pruebas de API (Restful-Booker): sin navegador y sin sesion de SauceDemo
    {
      name: 'api',
      testDir: 'api-testing/tests',
      testMatch: /\.spec\.ts/,
      retries: 1, // la API publica es compartida y a veces responde lento
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
