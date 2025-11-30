const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middleware/upload'); 
const { uploadImage } = require('../config/cloudinaryUploader');
const fs = require('fs');

// Obtener todos los calzados
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM calzados');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los calzados' });
  }
});

// Crear nuevo calzado
router.post('/', upload.single('imagen'), async (req, res) => {
  const { estado, nombre, id_categoria, id_proveedor, cantidad } = req.body;
  let imageUrl = null;

  if (req.file) {
    imageUrl = await uploadImage(req.file.path);
    fs.unlinkSync(req.file.path); // Elimina archivo local después de subir
  }

  try {
    await db.query(
      'INSERT INTO calzados (estado, nombre, id_categoria, id_proveedor, cantidad, imagen) VALUES (?, ?, ?, ?, ?, ?)',
      [estado, nombre, id_categoria, id_proveedor, cantidad, imageUrl]
    );
    res.json({ message: 'Calzado insertado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al insertar calzado' });
  }
});

// Actualizar calzado
router.put('/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params;
  const { estado, nombre, id_categoria, id_proveedor, cantidad, existingImage } = req.body;
  let imageUrl = existingImage;

  if (req.file) {
    imageUrl = await uploadImage(req.file.path);
    fs.unlinkSync(req.file.path);
  }

  try {
    const [result] = await db.query(
      'UPDATE calzados SET estado = ?, nombre = ?, id_categoria = ?, id_proveedor = ?, cantidad = ?, imagen = ? WHERE id_calzado = ?',
      [estado, nombre, id_categoria, id_proveedor, cantidad, imageUrl, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Calzado no encontrado' });
    }

    res.json({ message: 'Calzado actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar calzado' });
  }
});

// Eliminar calzado
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM calzados WHERE id_calzado = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Calzado no encontrado' });
    }

    res.json({ message: 'Calzado eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar calzado' });
  }
});

module.exports = router;
