const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Ruta GET para listar todos los roles
router.get('/', async (req, res) => {
    try {
        // Consulta SQL para obtener los roles
        const [roles] = await db.query('SELECT * FROM roles');
        
        // Devuelve los roles en formato JSON
        res.json({
            success: true,
            data: roles
        });
        
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los roles'
        });
    }
});

module.exports = router;