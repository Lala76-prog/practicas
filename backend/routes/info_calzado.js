const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Helper function for error responses
const errorResponse = (res, error, context) => {
  console.error(`Error en ${context}:`, error);
  return res.status(500).json({ 
    success: false,
    error: `Error al ${context}`,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

// Base query for shoe information
const BASE_SHOE_QUERY = `
  SELECT 
    ic.id_info_calzado,
    ic.material,
    ic.talla,
    ic.color,
    ic.descripcion,
    ic.precio_unitario,
    ic.id_calzados,
    ic.cantidad as cantidad_variante,
    c.id_calzado,
    c.estado,
    c.nombre,
    c.id_categoria,
    c.id_proveedor,
    c.cantidad as cantidad_total,
    c.imagen
  FROM info_calzado ic
  JOIN calzados c ON ic.id_calzados = c.id_calzado
`;

// Obtener todos los registros de calzado con imágenes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(BASE_SHOE_QUERY);
    
    res.json({ 
      success: true,
      data: rows 
    });
  } catch (err) {
    return errorResponse(res, err, 'obtener los registros de calzado');
  }
});

// Obtener un producto específico por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ 
      success: false,
      error: 'ID de producto inválido' 
    });
  }

  try {
    const [rows] = await db.query(`${BASE_SHOE_QUERY} WHERE ic.id_info_calzado = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Producto no encontrado',
        suggestion: 'Verifique que el ID sea correcto'
      });
    }

    res.json({ 
      success: true,
      data: rows[0] 
    });
  } catch (error) {
    return errorResponse(res, error, 'obtener el producto');
  }
});

// Insertar nuevo registro de calzado
// Insertar nuevo registro de calzado
router.post('/', async (req, res) => {
  const { material, talla, color, descripcion, precio_unitario, id_calzados, cantidad } = req.body;

  if (!material || !talla || !color || !id_calzados || !precio_unitario) {
    return res.status(400).json({
      success: false,
      error: 'Faltan campos requeridos (material, talla, color, id_calzados, precio_unitario)'
    });
  }

  try {
    // Verificar que el calzado padre exista y obtener su imagen
    const [shoeCheck] = await db.query('SELECT imagen FROM calzados WHERE id_calzado = ?', [id_calzados]);
    
    if (shoeCheck.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'El calzado principal no existe'
      });
    }

    const imagen = shoeCheck[0].imagen || null;

    const [result] = await db.query(
      'INSERT INTO info_calzado (material, talla, color, descripcion, precio_unitario, id_calzados, cantidad, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [material, talla, color, descripcion, precio_unitario, id_calzados, cantidad, imagen]
    );

    res.status(201).json({ 
      success: true,
      message: 'Registro creado correctamente', 
      id: result.insertId 
    });

  } catch (err) {
    return errorResponse(res, err, 'crear registro de calzado');
  }
});


// Actualizar registro de calzado
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { material, talla, color, descripcion, precio_unitario, id_calzados, cantidad } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE info_calzado SET 
        material = ?, 
        talla = ?, 
        color = ?, 
        descripcion = ?, 
        precio_unitario = ?,
        id_calzados = ?,
        cantidad = ?
      WHERE id_info_calzado = ?`,
      [material, talla, color, descripcion, precio_unitario, id_calzados, cantidad || 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Registro no encontrado' 
      });
    }

    res.json({ 
      success: true,
      message: 'Registro actualizado correctamente' 
    });
  } catch (err) {
    return errorResponse(res, err, 'actualizar registro de calzado');
  }
});

// Eliminar registro de calzado
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM info_calzado WHERE id_info_calzado = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Registro no encontrado' 
      });
    }

    res.json({ 
      success: true,
      message: 'Registro eliminado correctamente' 
    });
  } catch (err) {
    return errorResponse(res, err, 'eliminar registro de calzado');
  }
});

// Obtener variantes de un producto por id_calzados
router.get('/variantes/:id_calzados', async (req, res) => {
  const { id_calzados } = req.params;

  try {
    const [rows] = await db.query(`${BASE_SHOE_QUERY} WHERE ic.id_calzados = ?`, [id_calzados]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontraron variantes para este producto'
      });
    }
    
    res.json({ 
      success: true,
      data: rows 
    });
  } catch (error) {
    return errorResponse(res, error, 'obtener variantes del producto');
  }
});

module.exports = router;