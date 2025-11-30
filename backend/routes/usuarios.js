const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id_usu, correo, id_rol FROM usuarios');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Actualizar correo de usuario
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { correo } = req.body;

  if (!correo) return res.status(400).json({ error: 'Correo es obligatorio' });

  try {
    const [result] = await db.query('UPDATE usuarios SET correo = ? WHERE id_usu = ?', [correo, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Correo actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar correo:', error);
    res.status(500).json({ error: 'Error al actualizar el correo' });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await db.query('DELETE FROM usuarios WHERE id_usu = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

module.exports = router;