const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Obtener todas las categorías
 *     description: Devuelve una lista de todas las categorías en la tabla categoria.
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_categoria:
 *                     type: integer
 *                     example: 1
 *                   nombre_categoria:
 *                     type: string
 *                     example: 'Calzado'
 *                   descripcion:
 *                     type: string
 *                     example: 'Categoría de productos de calzado'
 *       500:
 *         description: Error al obtener categorías
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categoria');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Insertar nueva categoría
 *     description: Inserta una nueva categoría en la tabla categoria.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_categoria:
 *                 type: string
 *                 example: 'Calzado'
 *               descripcion:
 *                 type: string
 *                 example: 'Categoría de productos de calzado'
 *     responses:
 *       200:
 *         description: Categoría insertada correctamente
 *       500:
 *         description: Error al insertar categoría
 */
router.post('/', async (req, res) => {
  const { nombre_categoria, descripcion } = req.body;
  try {
    const [result] = await db.query('INSERT INTO categoria (nombre_categoria, descripcion) VALUES (?, ?)', [nombre_categoria, descripcion]);
    res.json({ message: 'Categoría insertada correctamente', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Error al insertar categoría' });
  }
});

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Editar categoría
 *     description: Actualiza una categoría existente en la tabla categoria por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la categoría a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_categoria:
 *                 type: string
 *                 example: 'Calzado'
 *               descripcion:
 *                 type: string
 *                 example: 'Categoría de productos de calzado'
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al actualizar categoría
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_categoria, descripcion } = req.body;
  
  try {
    const [result] = await db.query('UPDATE categoria SET nombre_categoria = ?, descripcion = ? WHERE id_categoria = ?', [nombre_categoria, descripcion, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
});

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Eliminar categoría
 *     description: Elimina una categoría existente en la tabla categoria por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la categoría a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al eliminar categoría
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM categoria WHERE id_categoria = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
});

module.exports = router;
