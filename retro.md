# Retrospectiva - Sprint 3

## Metodología: Estrella de Mar

### 1. Comenzar a hacer
- Revisar el código de cada integrante antes de hacer merge para evitar conflictos.
- Documentar mejor las rutas y componentes nuevos al momento de crearlos.
- Hacer commits más pequeños y frecuentes con mensajes descriptivos.

### 2. Hacer más
- Comunicación durante el desarrollo: avisar cuando una tarea está lista para no bloquear al resto.
- Reutilización de parciales: aprovechar aún más los archivos de `views/partials/` en todas las vistas.
- Planificación inicial del sprint para distribuir las tareas de forma más equitativa.

### 3. Continuar haciendo
- Usar ramas separadas por funcionalidad antes de mergear a `main`.
- Mantener el código ordenado y con nombres de variables descriptivos.
- Apoyarnos entre los integrantes cuando alguien tiene un bloqueo técnico.

### 4. Hacer menos
- Acumular cambios grandes sin compartirlos con el equipo.
- Modificar archivos que otro integrante está trabajando en paralelo sin coordinarse.

### 5. Dejar de hacer
- Copiar y pegar HTML en varias vistas cuando se puede extraer un partial.
- Commitear directamente a `main` sin revisar que todo funcione.

---

## Reflexión general

En este sprint avanzamos significativamente en la estructura del proyecto: pasamos de un sitio estático a una aplicación dinámica con Express y EJS. Separamos los componentes repetidos en archivos parciales (`head`, `header`, `footer`, `nav`, `product-card`, `top-bar`) y organizamos las vistas en subcarpetas (`products/`, `users/`). 

Las principales dificultades estuvieron en entender el flujo de `express-ejs-layouts` y en coordinar quién trabajaba sobre qué archivo. Para el próximo sprint conviene definir desde el principio qué rutas y vistas le corresponden a cada integrante.
