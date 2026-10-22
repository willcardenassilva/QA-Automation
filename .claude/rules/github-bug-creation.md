# Creación de bugs en GitHub Issues

Los defectos se reportan en el repositorio `willcardenassilva/QA-Automation` con la plantilla `.github/ISSUE_TEMPLATE/bug.yml`.

## Antes de crear un bug

1. Reprodúcelo al menos **dos veces** y descarta el timing de la automatización.
2. Cruza con el documento funcional y con otros flujos: confirma que no es un comportamiento definido.
3. Revisa si el usuario es de prueba con fallas intencionales (`problem_user`, `error_user`, `visual_user`,
   `performance_glitch_user`). Sus fallas son **hallazgos esperados del entorno de demo**: se documentan con el prefijo
   `[Usuario de prueba]` y severidad según el impacto, no como regresión.
4. Busca issues abiertos con el mismo problema para no duplicar.

## Formato

- **Título:** `[Módulo] Qué falla` (ej. `[Checkout] El impuesto no es el 8 % del item total`).
- **Severidad:**
  - **Blocker:** impide completar el flujo principal (login, compra) o pierde datos.
  - **Major:** una función importante falla pero hay alternativa, o un cálculo es incorrecto.
  - **Minor:** cosmético, texto, alineación o mejora.
- **Cuerpo:** usuario, requisito y caso (`RF-…` / `XXX-NN`), pasos numerados, esperado, real (texto exacto) y evidencia.
- Etiquetas: `bug` y la severidad en minúsculas (`blocker`, `major`, `minor`).

## Cómo crearlo

- **Nunca crees un issue sin confirmación del usuario.** Primero muestra el borrador completo.
- Si `gh` está disponible, crea el issue con `gh issue create` y la plantilla. Si no, entrega el texto listo para pegar en
  la web del repositorio (Issues → New issue → Bug).
- Registra el enlace del issue en el `99-resumen-ejecucion.md` del flujo, junto al caso que falló.
