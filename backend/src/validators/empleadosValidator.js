const Joi = require('joi');

//-------------------------
// Schema para validar datos de empleado
//-------------------------
const empleadoSchema = Joi.object({
  apellido: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El apellido es requerido',
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder 50 caracteres'
    }),
  
  nombre: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El nombre es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 50 caracteres'
    }),
  
  dni: Joi.string()
    .pattern(/^\d{7,8}$/)
    .required()
    .messages({
      'string.empty': 'El DNI es requerido',
      'string.pattern.base': 'El DNI debe tener 7 u 8 dígitos'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'El email es requerido',
      'string.email': 'El email debe tener un formato válido'
    })
});

//-------------------------
// Función de validación
//-------------------------
const validateEmpleado = (data) => {
  return empleadoSchema.validate(data);
};

module.exports = {
  validateEmpleado
};
