# 02 – Resoluciones y recursos

| Caso | Qué se verifica |
|------|-----------------|
| VIS-19 | 1920×1080: todas las vistas sin scroll horizontal ni elementos fuera del ancho visible |
| VIS-20 | 1366×768: igual |
| VIS-21 | 768×1024: igual |
| VIS-22 | 375×812: igual |
| VIS-23 | Zoom al 200 % (viewport 960×540): se puede completar una compra |
| VIS-24 | Sin imágenes rotas, sin recursos propios con error y sin errores de consola propios |

**Nota técnica (VIS-24):** al abrir una dirección directa como `/inventory.html`, GitHub Pages responde HTTP 404 y la
aplicación carga igualmente (redirección por una página 404). Esas respuestas de documento y su error de consola no se
cuentan como defectos de la aplicación.
