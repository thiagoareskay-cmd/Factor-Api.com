# FACTOR API · Tienda de productos apícolas

Sitio web estático listo para probar en GitHub Pages.

## Incluye

- Home / landing premium con glassmorphism.
- Tienda con filtros y buscador.
- Ficha de producto.
- Carrito con localStorage.
- Animación al agregar productos al carrito.
- Animación al completar pedido.
- Pedido por WhatsApp.
- Página Nosotros.
- Página Proceso.
- Página Contacto.
- Métodos de pago.
- Stock y precios de ejemplo.
- Diseño responsive para celular y computadora.

## Importante

El número de WhatsApp está puesto como ejemplo: `51941983088`.
Busca ese valor en `app.js`, `index.html` y `contacto.html` y reemplázalo por el número real, sin espacios ni `+`.

Los precios, stock, correos y textos son demostrativos y deben reemplazarse por los datos reales del negocio.

## Probar localmente

Puedes abrir `index.html` directamente en el navegador. Para una experiencia más parecida a GitHub Pages, usa una extensión de servidor local en VS Code o ejecuta un servidor HTTP simple.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube todos los archivos y la carpeta `assets`.
3. Ve a Settings → Pages.
4. En “Build and deployment” selecciona “Deploy from a branch”.
5. Selecciona la rama `main` y la carpeta `/ (root)`.
6. Guarda y espera a que GitHub genere tu enlace.

No necesita Node.js, npm ni base de datos para esta demo.


### Disponibilidad
La tienda muestra `Disponible para pedido` en lugar de cantidades exactas de stock, para evitar que tengas que actualizar existencias constantemente. La disponibilidad final se confirma por WhatsApp antes de cerrar el pedido.

### WhatsApp
En `app.js`, reemplaza `51941983088` por el número real del negocio, usando código de país y sin `+`, espacios ni guiones.
