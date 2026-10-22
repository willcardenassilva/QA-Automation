// Datos de prueba y mensajes literales (documento funcional, secciones 2, 6 y 8).
// Los usuarios y la contraseña son públicos: los muestra la propia página de login de SauceDemo.

export const PASSWORD = 'secret_sauce';

export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
} as const;

export const MSG = {
  invalidCredentials:
    'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  notLoggedIn: (path: string) =>
    `Epic sadface: You can only access '${path}' when you are logged in.`,
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
  orderComplete: 'Thank you for your order!',
} as const;

// Valores de formulario válidos para el checkout
export const CHECKOUT_INFO = {
  firstName: 'Ana',
  lastName: 'Pérez',
  postalCode: '1000',
} as const;

// Identificadores de producto tal como aparecen en los data-test de los botones
export const PRODUCT = {
  backpack: 'sauce-labs-backpack',
  bikeLight: 'sauce-labs-bike-light',
  boltTShirt: 'sauce-labs-bolt-t-shirt',
} as const;

export const TAX_RATE = 0.08;
