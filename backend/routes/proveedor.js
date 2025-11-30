const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todos los proveedores
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM proveedor');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los proveedores' });
  }
});

// Crear un nuevo proveedor
router.post('/', async (req, res) => {
  const { 
    nombre_proveedor, 
    telefono, 
    correo, 
    productos_calzado, 
    valor_unitario, 
    cantidad, 
    direccion, 
    metodo_pago, 
    notas 
  } = req.body;
  
  const total = valor_unitario * cantidad;
  
  try {
    await db.query(
      `INSERT INTO proveedor
      (nombre_proveedor, telefono, correo, productos_calzado, valor_unitario, total, cantidad, direccion, metodo_pago, fecha_ultima_compra, notas) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)`,
      [nombre_proveedor, telefono, correo, productos_calzado, valor_unitario, total, cantidad, direccion, metodo_pago, notas]
    );
    res.json({ message: 'Proveedor creado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el proveedor' });
  }
});

// Actualizar un proveedor
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    nombre_proveedor, 
    telefono, 
    correo, 
    productos_calzado, 
    valor_unitario, 
    cantidad, 
    direccion, 
    metodo_pago, 
    notas 
  } = req.body;
  
  const total = valor_unitario * cantidad;
  
  try {
    const [result] = await db.query(
      `UPDATE proveedor SET 
      nombre_proveedor = ?, 
      telefono = ?, 
      correo = ?, 
      productos_calzado = ?, 
      valor_unitario = ?, 
      total = ?, 
      cantidad = ?, 
      direccion = ?, 
      metodo_pago = ?, 
      fecha_ultima_compra = CURDATE(), 
      notas = ? 
      WHERE id_proveedor = ?`,
      [nombre_proveedor, telefono, correo, productos_calzado, valor_unitario, total, cantidad, direccion, metodo_pago, notas, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({ message: 'Proveedor actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el proveedor' });
  }
});

// Eliminar un proveedor
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM proveedores WHERE id_proveedor = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({ message: 'Proveedor eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el proveedor' });
  }
});

module.exports = router;