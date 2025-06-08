const mongoose = require('mongoose');
const { colorLog } = require('../utils/colors');

//-------------------------
// Función para conectar a MongoDB
//-------------------------
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/socios_db';
    
    await mongoose.connect(mongoURI);
    
    colorLog.success('MongoDB conectado exitosamente');
    colorLog.info(`Base de datos: ${mongoose.connection.name}`);
    
  } catch (error) {
    colorLog.error(`Error conectando a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

//-------------------------
// Manejo de eventos de conexión
//-------------------------
mongoose.connection.on('disconnected', () => {
  colorLog.warning('MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  colorLog.error(`Error en MongoDB: ${err.message}`);
});

module.exports = connectDB;
