# Épica: Pruebas visuales

Requisitos: RNF-VIS-01…06 · Automatizado en `automatizacion/tests/visual.spec.ts`.

Son comprobaciones **estructurales** (posiciones, tamaños, imágenes cargadas, estados, desbordes), iguales en cualquier
sistema operativo, y cada vista adjunta una captura como evidencia en el informe HTML. Las comparaciones píxel a píxel
con línea base se dejan para más adelante: cambian entre Windows y Linux y romperían la ejecución diaria en la nube.

| # | Archivo | Casos |
|---|---------|-------|
| 01 | [01-vistas.md](01-vistas.md) | VIS-01…VIS-18 |
| 02 | [02-resoluciones-y-recursos.md](02-resoluciones-y-recursos.md) | VIS-19…VIS-24 (VIS-25 en `usuarios-especiales`) |
| 99 | [99-resumen-ejecucion.md](99-resumen-ejecucion.md) | resultados |
