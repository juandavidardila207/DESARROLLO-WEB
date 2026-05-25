const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const USERS_PATH = path.join(__dirname, '..', 'data', 'users.json');

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
}

// ===================== VALIDACIONES REGISTRO =====================
const validateRegister = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio.')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio.')
    .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres.'),

  body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es obligatorio.')
    .isEmail().withMessage('El correo electrónico no tiene un formato válido.')
    .custom((value) => {
      const users = readUsers();
      if (users.find(u => u.email === value.toLowerCase())) {
        throw new Error('Ya existe una cuenta con ese correo electrónico.');
      }
      return true;
    }),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/)
    .withMessage('La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial.'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden.');
      }
      return true;
    }),
];

// ===================== VALIDACIONES LOGIN =====================
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es obligatorio.')
    .isEmail().withMessage('El correo electrónico no tiene un formato válido.')
    .custom((value) => {
      const users = readUsers();
      if (!users.find(u => u.email === value.toLowerCase())) {
        throw new Error('El correo ingresado no está registrado.');
      }
      return true;
    }),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.'),
];

// ===================== VALIDACIONES PRODUCTO =====================
const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre del producto es obligatorio.')
    .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres.'),

  body('description')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria.')
    .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres.'),

  body('price')
    .notEmpty().withMessage('El precio es obligatorio.')
    .isNumeric().withMessage('El precio debe ser un número.')
    .custom(value => {
      if (parseFloat(value) <= 0) throw new Error('El precio debe ser mayor a 0.');
      return true;
    }),

  body('category')
    .notEmpty().withMessage('La categoría es obligatoria.'),

  body('image')
    .trim()
    .notEmpty().withMessage('La imagen es obligatoria.')
    .custom((value) => {
      const validExtensions = /\.(jpg|jpeg|png|gif)$/i;
      if (!validExtensions.test(value)) {
        throw new Error('La imagen debe ser un archivo válido (JPG, JPEG, PNG, GIF).');
      }
      return true;
    }),
];

// ===================== HANDLER DE ERRORES =====================
// Para vistas EJS — renderiza de nuevo con los errores
function handleValidationErrors(view, extraData = {}) {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array()[0].msg;
      const allErrors = errors.array().map(e => e.msg);
      return res.render(view, {
        ...extraData(req),
        errorMsg,
        allErrors,
        formData: req.body,
        activeNav: ''
      });
    }
    next();
  };
}

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  handleValidationErrors,
  validationResult
};
