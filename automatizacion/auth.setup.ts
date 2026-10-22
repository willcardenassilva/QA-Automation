import { test as setup, expect } from '@playwright/test';
import { USERS } from './support/data';
import { login } from './support/helpers';

const SESSION_FILE = 'automatizacion/.auth/standard_user.json';

// Inicia sesión con el usuario estándar y guarda la sesión para los demás tests
setup('iniciar sesión con standard_user', async ({ page }) => {
  await login(page, USERS.standard);
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await page.context().storageState({ path: SESSION_FILE });
});
