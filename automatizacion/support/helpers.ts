import { expect, type Page } from '@playwright/test';
import { CHECKOUT_INFO, PASSWORD } from './data';

export async function login(page: Page, username: string, password: string = PASSWORD) {
  await page.goto('/');
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByTestId('login-button').click();
}

export async function addToCart(page: Page, ...products: string[]) {
  for (const product of products) {
    await page.getByTestId(`add-to-cart-${product}`).click();
  }
}

// Convierte "$29.99" o "Item total: $55.97" en un número
export function parseMoney(text: string): number {
  const match = text.match(/\$(\d+(?:\.\d{1,2})?)/);
  if (!match) throw new Error(`No se encontró un monto en: "${text}"`);
  return Number(match[1]);
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export async function openMenu(page: Page) {
  await page.locator('#react-burger-menu-btn').click();
  await expect(page.getByTestId('logout-sidebar-link')).toBeVisible();
}

// Nombres y precios tal como se ven en el listado, en el orden en que aparecen
export async function listNames(page: Page): Promise<string[]> {
  return page.getByTestId('inventory-item-name').allTextContents();
}

export async function listPrices(page: Page): Promise<number[]> {
  return (await page.getByTestId('inventory-item-price').allTextContents()).map(parseMoney);
}

// Del carrito al paso 1 del checkout
export async function goToCheckoutStepOne(page: Page) {
  await page.getByTestId('shopping-cart-link').click();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await page.getByTestId('checkout').click();
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
}

// Completa el paso 1 con datos válidos y llega al resumen
export async function fillCheckoutInfo(page: Page, info = CHECKOUT_INFO) {
  await page.getByTestId('firstName').fill(info.firstName);
  await page.getByTestId('lastName').fill(info.lastName);
  await page.getByTestId('postalCode').fill(info.postalCode);
  await page.getByTestId('continue').click();
  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
}
