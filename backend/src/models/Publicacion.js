const mongoose = require('mongoose');

//-------------------------
// Schema de Publicación para MongoDB
//-------------------------
const publicacionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    minlength: [5, 'El título debe tener al menos 5 caracteres'],
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  contenido: {
    type: String,
    required: [true, 'El contenido es requerido'],
    trim: true,
    minlength: [10, 'El contenido debe tener al menos 10 caracteres'],
    maxlength: [10000, 'El contenido no puede exceder 10000 caracteres']
  },
  imagenAsociada: {
    type: String,
    required: [true, 'La imagen en base64 es requerida'],
    validate: {
      validator: function(v) {
        return /^data:image\/(jpeg|jpg|png|gif|bmp|webp);base64,/.test(v);
      },
      message: 'La imagen debe estar en formato base64 válido (data:image/...;base64,...)'
    }
  },
  fechaPublicacion: {
    type: String,
    required: [true, 'La fecha de publicación es requerida'],
    validate: {
      validator: function(v) {
        // Validar formato YYYY-MM-DD o DD/MM/YYYY
        return /^\d{4}-\d{2}-\d{2}$/.test(v) || /^\d{2}\/\d{2}\/\d{4}$/.test(v);
      },
      message: 'La fecha debe tener formato YYYY-MM-DD o DD/MM/YYYY'
    }
  },
  empleado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empleado',
    required: [true, 'El empleado es requerido']
  },
  vigente: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Crea automáticamente createdAt y updatedAt
});

//-------------------------
// Índices para mejorar performance
//-------------------------
publicacionSchema.index({ empleado: 1 });
publicacionSchema.index({ vigente: 1 });
publicacionSchema.index({ fechaPublicacion: -1 });
publicacionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Publicacion', publicacionSchema);
