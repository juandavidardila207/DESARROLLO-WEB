# Retrospectiva - Sprint 4

## Metodología: Estrella de Mar

### 1. Comenzar a hacer
- Validar los datos del formulario también en el cliente (frontend) antes de enviarlos al servidor, no solo en el backend.
- Documentar las rutas de la API en un archivo separado (por ejemplo `ROUTES.md`) para que todo el equipo sepa qué endpoints existen.
- Usar variables de entorno (`.env`) para configurar el puerto y otras constantes del servidor.

### 2. Hacer más
- Revisar el código en conjunto antes de hacer merge, especialmente cuando se trabaja sobre archivos compartidos como `server.js`.
- Reutilizar funciones auxiliares (como `generateSlug` o `generateId`) en archivos separados para mantener el servidor limpio.
- Probar cada ruta manualmente después de implementarla para verificar que funcione correctamente.

### 3. Continuar haciendo
- Separar las responsabilidades: vistas en `views/`, datos en `data/`, lógica en `server.js`.
- Mantener los archivos JSON bien formateados y con estructura consistente.
- Nombrar las ramas de Git de forma descriptiva (por ejemplo: `feature/crud-productos`).

### 4. Hacer menos
- Acumular múltiples cambios en un solo commit sin descripción clara.
- Pisar el trabajo de otro integrante al modificar el mismo archivo sin coordinar.

### 5. Dejar de hacer
- Hardcodear datos directamente en el servidor cuando ya tenemos archivos JSON como fuente de datos.
- Ignorar los errores en consola durante el desarrollo: cada warning es una señal de algo que puede fallar en producción.

---

## Reflexión general

El Sprint 4 marcó el paso más importante hasta ahora: el sitio dejó de ser estático y comenzó a trabajar con datos reales almacenados en archivos JSON. Implementamos el CRUD completo de productos con las 7 rutas requeridas (GET listado, GET detalle, GET crear, POST crear, GET editar, PUT editar, DELETE eliminar) y también la persistencia de usuarios.

El mayor desafío fue entender el flujo de `method-override` para poder usar los métodos HTTP PUT y DELETE desde formularios HTML, ya que el navegador solo soporta GET y POST de forma nativa.

Para el próximo sprint, el foco estará en agregar middlewares de autenticación y validaciones más robustas, lo que va a requerir una coordinación aún más cuidadosa entre los integrantes del equipo.
