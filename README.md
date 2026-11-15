# Mi Bolsillo — sitio oficial (prototipo)

Sitio web estático de presentación de Mi Bolsillo, listo para importar a Vercel.

## Publicar desde GitHub + Vercel

1. Crea un repositorio de GitHub nuevo, por ejemplo `mi-bolsillo-web`.
2. Sube a la raíz del repositorio **el contenido de esta carpeta** (`index.html`, `styles.css`, `script.js`, `assets/`, `vercel.json`, etc.). No subas únicamente el ZIP.
3. En https://vercel.com/new elige **Import Git Repository** y selecciona `mi-bolsillo-web`.
4. Para el proyecto selecciona **Framework Preset: Other** (sitio estático). Deja el **Root Directory** en `./`. No se requiere comando de build ni output directory.
5. Pulsa **Deploy** y verifica la URL que Vercel te asigne.

## Vista local

Ejecuta desde esta carpeta: `python -m http.server 3000` y abre `http://localhost:3000/`.

## Antes del lanzamiento comercial

- Revisa y reemplaza las páginas de privacidad y términos, que están marcadas como borradores.
- Sustituye las capturas de prueba por imágenes finales autorizadas.
- Actualiza el texto de disponibilidad y las descargas cuando la app esté realmente publicada.
- Añade dominio propio y correo de contacto real cuando estén disponibles.
- Verifica el plan de Vercel que permite tu caso de uso comercial.

La web no contiene claves privadas ni conexión directa a Supabase y no procesa pagos.
