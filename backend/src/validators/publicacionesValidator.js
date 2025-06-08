const Joi = require('joi');

//-------------------------
// Schema para validar datos de publicación
//-------------------------
const publicacionSchema = Joi.object({
  titulo: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.empty': 'El título es requerido',
      'string.min': 'El título debe tener al menos 5 caracteres',
      'string.max': 'El título no puede exceder 200 caracteres'
    }),
  
  contenido: Joi.string()
    .min(10)
    .max(10000)
    .required()
    .messages({
      'string.empty': 'El contenido es requerido',
      'string.min': 'El contenido debe tener al menos 10 caracteres',
      'string.max': 'El contenido no puede exceder 10000 caracteres'
    }),
  
  imagenAsociada: Joi.string()
    .pattern(/^data:image\/(jpeg|jpg|png|gif|bmp|webp);base64,/)
    .required()
    .messages({
      'string.empty': 'La imagen en base64 es requerida',
      'string.pattern.base': 'La imagen debe estar en formato base64 válido (data:image/...;base64,...)'
    }),
  
  fechaPublicacion: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/)
    .required()
    .messages({
      'string.empty': 'La fecha de publicación es requerida',
      'string.pattern.base': 'La fecha debe tener formato YYYY-MM-DD o DD/MM/YYYY'
    }),
  
  empleado: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'El ID del empleado es requerido',
      'string.pattern.base': 'El ID del empleado debe ser un ObjectId válido de MongoDB'
    }),
  
  vigente: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'El campo vigente debe ser verdadero o falso'
    })
});

//-------------------------
// Función de validación
//-------------------------
const validatePublicacion = (data) => {
  return publicacionSchema.validate(data);
};

module.exports = {
  validatePublicacion
};
