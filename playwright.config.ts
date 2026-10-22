import { defineConfig, devices } from '@playwright/test';

const SESSION_FILE = 'automatizacion/.auth/standard_user.json';

export default defineConfig({
  testDir: 'automatizacion',
  fullyParallel: true,
  retries: 0,
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
  ],
});
