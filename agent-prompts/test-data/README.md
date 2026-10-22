# Datos de prueba

SauceDemo no tiene base de datos que preparar: los productos son fijos y los usuarios son públicos
(`agent-config/credentials/saucedemo-users.md`).

## Datos de formulario (checkout paso 1)

| Campo | Valor válido | Notas |
|-------|--------------|-------|
| First Name | `Ana` | |
| Last Name | `Pérez` | |
| Zip/Postal Code | `1000` | La app no parece validar el formato (duda 11.3) |

## Credenciales inválidas para pruebas negativas

| Caso | Usuario | Contraseña |
|------|---------|-----------|
| Contraseña incorrecta | `standard_user` | `wrong_password` |
| Usuario inexistente | `usuario_inexistente` | `secret_sauce` |
| Mayúsculas | `Standard_User` | `secret_sauce` |

## Catálogo de productos

Ver `.claude/skills/saucedemo-checkout/SKILL.md`. Los precios se **anotan de la pantalla** en cada ejecución.
