const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Middleware para forzar el ID del usuario (siempre 2)
const fixedUserId = (req, res, next) => {
  req.user = { id: 2 };
  next();
};

// Agregar item al carrito
router.post('/', fixedUserId, async (req, res) => {
  const { id_calzado, cantidad } = req.body;
  const id_usu = req.user.id;

  if (!id_calzado || !cantidad || cantidad <= 0) {
    return res.status(400).json({ 
      success: false,
      error: 'ID del calzado y cantidad válida son requeridos' 
    });
  }

  try {
    // Obtener información del calzado
    const [calzado] = await db.query(
      `SELECT 
        nombre,
        cantidad as stock,
        imagen
      FROM calzados 
      WHERE id_calzado = ?`,
      [id_calzado]
    );

    if (calzado.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Calzado no encontrado' 
      });
    }

    // Obtener el precio de la tabla carrito (asumiendo que se almacena allí)
    // O puedes definir un precio fijo si no hay columna de precio
    const precioUnitario = 100; // Precio por defecto o deberías obtenerlo de alguna tabla

    const total = precioUnitario * cantidad;

    // Verificar stock disponible
    if (calzado[0].stock < cantidad) {
      return res.status(400).json({
        success: false,
        error: 'No hay suficiente stock disponible',
        stock_disponible: calzado[0].stock
      });
    }

    // Insertar en el carrito
    const [result] = await db.query(
      `INSERT INTO carrito 
        (id_usu, id_calzado, cantidad, precio_unitario, total, descripcion, imagen) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id_usu, 
        id_calzado, 
        cantidad, 
        precioUnitario,
        total,
        calzado[0].nombre,
        calzado[0].imagen
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Item agregado al carrito',
      data: {
        id_carrito: result.insertId,
        total,
        item: {
          id_calzado,
          nombre: calzado[0].nombre,
          cantidad,
          precio_unitario: precioUnitario,
          imagen: calzado[0].imagen
        }
      }
    });
  } catch (error) {
    console.error('Error al agregar item:', error);
    res.status(500).json({
      success: false,
      error: 'Error al agregar item al carrito',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Obtener carrito del usuario
router.get('/', fixedUserId, async (req, res) => {
  const id_usu = req.user.id;

  try {
    const [items] = await db.query(
      `SELECT 
        id_carrito, 
        id_calzado, 
        cantidad, 
        precio_unitario,
        total,
        descripcion as nombre,
        imagen
       FROM carrito 
       WHERE id_usu = ?`,
      [id_usu]
    );

    // Calcular total general del carrito
    const totalCarrito = items.reduce((sum, item) => sum + (item.total || 0), 0);

    res.json({
      success: true,
      data: {
        items,
        total: totalCarrito,
        count: items.length
      }
    });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener el carrito',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Actualizar item del carrito
router.put('/:id', fixedUserId, async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;
  const id_usu = req.user.id;

  if (!cantidad || cantidad <= 0) {
    return res.status(400).json({ 
      success: false,
      error: 'Cantidad válida es requerida' 
    });
  }

  try {
    // Verificar existencia del item
    const [item] = await db.query(
      `SELECT 
        car.id_calzado,
        car.precio_unitario,
        c.cantidad as stock
       FROM carrito car
       JOIN calzados c ON car.id_calzado = c.id_calzado
       WHERE car.id_carrito = ? AND car.id_usu = ?`,
      [id, id_usu]
    );

    if (item.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Item no encontrado en tu carrito' 
      });
    }

    // Verificar stock
    if (item[0].stock < cantidad) {
      return res.status(400).json({
        success: false,
        error: 'No hay suficiente stock disponible',
        stock_disponible: item[0].stock
      });
    }

    // Calcular nuevo total
    const nuevoTotal = cantidad * item[0].precio_unitario;

    // Actualizar
    await db.query(
      'UPDATE carrito SET cantidad = ?, total = ? WHERE id_carrito = ?',
      [cantidad, nuevoTotal, id]
    );

    res.json({ 
      success: true,
      message: 'Item actualizado correctamente',
      data: {
        id_carrito: parseInt(id),
        nueva_cantidad: cantidad,
        nuevo_total: nuevoTotal
      }
    });
  } catch (error) {
    console.error('Error al actualizar item:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al actualizar el item',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Eliminar item del carrito
router.delete('/:id', fixedUserId, async (req, res) => {
  const { id } = req.params;
  const id_usu = req.user.id;

  try {
    const [result] = await db.query(
      'DELETE FROM carrito WHERE id_carrito = ? AND id_usu = ?',
      [id, id_usu]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Item no encontrado en tu carrito' 
      });
    }

    res.json({ 
      success: true,
      message: 'Item eliminado del carrito',
      data: {
        id_carrito: parseInt(id)
      }
    });
  } catch (error) {
    console.error('Error al eliminar item:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al eliminar el item',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Procesar compra (checkout)
router.post('/checkout', fixedUserId, async (req, res) => {
  const id_usu = req.user.id;

  try {
    // Obtener items del carrito con información de stock
    const [items] = await db.query(
      `SELECT 
        car.id_carrito,
        car.id_calzado,
        car.cantidad,
        car.precio_unitario,
        car.total,
        car.descripcion as nombre,
        c.cantidad as stock
       FROM carrito car
       JOIN calzados c ON car.id_calzado = c.id_calzado
       WHERE car.id_usu = ?`,
      [id_usu]
    );

    if (items.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'El carrito está vacío' 
      });
    }

    // Verificar stock para todos los items
    for (const item of items) {
      if (item.stock < item.cantidad) {
        return res.status(400).json({
          success: false,
          error: `No hay suficiente stock para el producto ${item.nombre}`,
          id_calzado: item.id_calzado,
          stock_disponible: item.stock,
          cantidad_solicitada: item.cantidad
        });
      }
    }

    // Calcular total general
    const total = items.reduce((sum, item) => sum + (item.total || 0), 0);

    await db.query('START TRANSACTION');

    try {
      // Crear pedido
      const [pedido] = await db.query(
        'INSERT INTO pedido (total_pedido, fecha, id_usu) VALUES (?, NOW(), ?)',
        [total, id_usu]
      );
      const id_pedido = pedido.insertId;

      // Crear items del pedido y actualizar stock
      for (const item of items) {
        await db.query(
          `INSERT INTO items_pedido 
            (id_pedido, id_calzado, cantidad, precio_unitario, total) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            id_pedido, 
            item.id_calzado, 
            item.cantidad, 
            item.precio_unitario,
            item.total
          ]
        );

        // Actualizar stock
        await db.query(
          'UPDATE calzados SET cantidad = cantidad - ? WHERE id_calzado = ?',
          [item.cantidad, item.id_calzado]
        );
      }

      // Vaciar el carrito
      await db.query('DELETE FROM carrito WHERE id_usu = ?', [id_usu]);

      await db.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Compra realizada con éxito',
        data: {
          id_pedido,
          total,
          items_count: items.length
        }
      });
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error en checkout:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al procesar la compra', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;