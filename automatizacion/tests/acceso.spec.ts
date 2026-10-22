import { test, expect } from '@playwright/test';
import { MSG, PASSWORD, USERS } from '../support/data';
import { login } from '../support/helpers';

// Los casos de acceso parten sin sesión (no usan la sesión guardada)
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Acceso – Login y cierre de sesión', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('LOG-01 login válido abre el listado de productos', { tag: '@smoke' }, async ({ page }) => {
    await login(page, USERS.standard);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  test('LOG-02 contraseña incorrecta muestra error y permanece en login', async ({ page }) => {
    await login(page, USERS.standard, 'wrong_password');
    await expect(page.getByTestId('error')).toHaveText(MSG.invalidCredentials);
    await expect(page).toHaveURL(/saucedemo\.com\/$/);
  });

  test('LOG-03 usuario inexistente muestra el mismo error', async ({ page }) => {
    await login(page, 'usuario_inexistente', PASSWORD);
    await expect(page.getByTestId('error')).toHaveText(MSG.invalidCredentials);
  });

  test('LOG-04 usuario bloqueado no accede', async ({ page }) => {
    await login(page, USERS.lockedOut);
    await expect(page.getByTestId('error')).toHaveText(MSG.lockedOut);
    await expect(page).toHaveURL(/saucedemo\.com\/$/);
  });

  test('LOG-05 usuario vacío pide el usuario', async ({ page }) => {
    await page.getByTestId('password').fill(PASSWORD);
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('error')).toHaveText(MSG.usernameRequired);
  });

  test('LOG-06 contraseña vacía pide la contraseña', async ({ page }) => {
    await page.getByTestId('username').fill(USERS.standard);
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('error')).toHaveText(MSG.passwordRequired);
  });

  test('LOG-07 ambos campos vacíos pide el usuario', async ({ page }) => {
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('error')).toHaveText(MSG.usernameRequired);
  });

  test('LOG-08 la X cierra el mensaje de error', async ({ page }) => {
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('error')).toBeVisible();
    await page.locator('.error-button').click();
    await expect(page.getByTestId('error')).toHaveCount(0);
  });

  test('LOG-09 acceso directo sin sesión vuelve al login con mensaje', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page.getByTestId('error')).toHaveText(MSG.notLoggedIn('/inventory.html'));
    await expect(page.getByTestId('inventory-container')).toHaveCount(0);
  });

  test('LOG-10 el usuario distingue mayúsculas y minúsculas', async ({ page }) => {
    await login(page, 'Standard_User');
    await expect(page.getByTestId('error')).toHaveText(MSG.invalidCredentials);
  });

  test('OUT-01 logout vuelve al login con los campos vacíos', { tag: '@smoke' }, async ({ page }) => {
    await login(page, USERS.standard);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await page.locator('#react-burger-menu-btn').click();
    await page.getByTestId('logout-sidebar-link').click();
    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(page.getByTestId('username')).toHaveValue('');
    await expect(page.getByTestId('password')).toHaveValue('');
  });

  test('OUT-02 tras el logout "atrás" no muestra los productos', async ({ page }) => {
    await login(page, USERS.standard);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await page.locator('#react-burger-menu-btn').click();
    await page.getByTestId('logout-sidebar-link').click();
    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await page.goBack();
    await expect(page.getByTestId('inventory-container')).toHaveCount(0);
  });

  // Hallazgo (tema por definir con producto): con la sesión activa, "atrás" desde el inventario muestra el
  // formulario de login y "adelante" vuelve al inventario sin cerrar la sesión.
  test('LOG-11 con la sesión activa, "atrás" no debería mostrar el formulario de login', async ({ page }) => {
    test.fail(true, 'Por definir con producto: con la sesión activa, "atrás" muestra el formulario de login');
    await login(page, USERS.standard);
    await expect(page).toHaveURL(/\/inventory\.html$/);

    await page.goBack();

    await expect(page.getByTestId('login-button')).toHaveCount(0);
  });
});
