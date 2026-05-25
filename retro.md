# Retrospectiva - Sprint 7

## Metodología: Estrella de Mar

### 1. Comenzar a hacer
- Validar los datos en el back-end desde el inicio de cada formulario, no dejarlo para el final del sprint.
- Escribir mensajes de error claros y específicos para cada campo, en lugar de mensajes genéricos como "datos inválidos".
- Probar los formularios con datos maliciosos o inesperados (strings vacíos, scripts, emails falsos) para asegurarnos de que las validaciones realmente funcionan.

### 2. Hacer más
- Reutilizar los middlewares de validación en todas las rutas que reciben datos del usuario.
- Dar feedback visual inmediato al usuario en el front-end antes de enviar el formulario al servidor.
- Revisar el código en conjunto antes de hacer merge, sobre todo cuando se tocan archivos compartidos como `server.js` y `style.css`.

### 3. Continuar haciendo
- Separar la lógica de validación en archivos independientes (`middlewares/validations.js`).
- Mantener los mensajes de error coherentes entre el front-end y el back-end.
- Usar `express-validator` para las validaciones del servidor de forma consistente en todas las rutas.

### 4. Hacer menos
- Duplicar código de validación entre rutas similares — conviene extraer funciones reutilizables.
- Asumir que el front-end es suficiente para proteger el servidor (el usuario puede deshabilitar JavaScript).

### 5. Dejar de hacer
- Confiar solo en el atributo `required` de HTML como única validación — no es suficiente.
- Dejar que datos inválidos lleguen a los archivos JSON sin pasar por ningún control.

---

## Reflexión general

El Sprint 7 marcó un salto importante en la robustez del proyecto. Implementamos validaciones en dos capas:

**Back-end con `express-validator`:**
- Registro de usuarios: nombre/apellido (mín. 2 chars), email (formato válido + sin duplicados), contraseña (mín. 8 chars + mayúscula + número + carácter especial).
- Login: email existente en base, contraseña coincidente.
- Productos: nombre (mín. 5 chars), descripción (mín. 20 chars), imagen (extensión válida JPG/JPEG/PNG/GIF).

**Front-end con JavaScript:**
- Mismas reglas aplicadas antes de enviar el formulario para dar feedback inmediato al usuario.

El principal aprendizaje fue entender que las validaciones de front-end mejoran la UX pero no reemplazan las del back-end. Un usuario malintencionado puede deshabilitar JavaScript y enviar cualquier dato al servidor, por eso la última línea de defensa siempre tiene que estar en el servidor.
