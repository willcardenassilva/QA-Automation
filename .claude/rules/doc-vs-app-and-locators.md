# La documentación no es la verdad absoluta; locators en listas

## Documento vs aplicación

- El documento funcional (`documentacion/`) y los casos son la **referencia esperada**, pero se escribieron sin ejecutar la
  aplicación. Si lo que se ve en la app difiere del documento, **repórtalo** como hallazgo (WARNING o bug según el impacto);
  no decidas tú cuál de los dos está mal.
- No modifiques el documento funcional, las historias ni los casos para que "cuadren" con la app sin autorización del
  usuario. Propón el cambio y espera la confirmación.
- Si un resultado esperado depende de una duda abierta (sección 11 del documento funcional), anótalo como WARNING con la
  referencia a la duda, no como FAIL.

## Locators en listas y tarjetas

- Los productos del inventario son tarjetas repetidas: identifica el botón por el **producto** (el nombre dentro de la
  misma tarjeta), no por posición ni por el primer "Add to cart" de la página.
- Prefiere atributos estables (`data-test`) cuando existan en el DOM; si no, usa el texto en inglés exacto.
- Tras agregar o quitar un producto, el botón de esa tarjeta cambia de texto: vuelve a localizarlo en lugar de reutilizar
  una referencia anterior.
- Si el orden cambia (selector de orden), no asumas posiciones: compara por nombre.
- No declares un bug por timing: si algo no aparece, espera y vuelve a leer la pantalla antes de concluir.
