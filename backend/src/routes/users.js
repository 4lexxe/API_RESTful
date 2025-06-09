const express = require('express');
const router = express.Router();

// GET todos los usuarios
router.get('/', (req, res) => {
    res.json({ message: 'Obtener todos los usuarios' });
});

// GET usuario por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `Obtener usuario con ID: ${id}` });
});

// POST crear nuevo usuario
router.post('/', (req, res) => {
    res.json({ message: 'Crear nuevo usuario' });
});

// PUT actualizar usuario
router.put('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `Actualizar usuario con ID: ${id}` });
});

// DELETE eliminar usuario
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `Eliminar usuario con ID: ${id}` });
});

module.exports = router;
