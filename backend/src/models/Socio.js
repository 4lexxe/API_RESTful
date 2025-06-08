const mongoose = require('mongoose');

//-------------------------
// Schema de Socio para MongoDB
//-------------------------
const socioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true,
    minlength: [2, 'El apellido debe tener al menos 2 caracteres'],
    maxlength: [50, 'El apellido no puede exceder 50 caracteres']
  },
  foto: {
    type: String,
    required: [true, 'La URL de la foto es requerida'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\..+/.test(v);
      },
      message: 'La foto debe ser una URL válida'
    }
  },
  dni: {
    type: String,
    required: [true, 'El DNI es requerido'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{7,8}$/.test(v);
      },
      message: 'El DNI debe tener 7 u 8 dígitos'
    }
  },
  numeroSocio: {
    type: Number,
    unique: true,
    required: true
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

//-------------------------
// Middleware para generar número de socio automáticamente
//-------------------------
socioSchema.pre('save', async function(next) {
  if (this.isNew && !this.numeroSocio) {
    try {
      const lastSocio = await this.constructor.findOne({}, {}, { sort: { numeroSocio: -1 } });
      this.numeroSocio = lastSocio ? lastSocio.numeroSocio + 1 : 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Socio', socioSchema);
