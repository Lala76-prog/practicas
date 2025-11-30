const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Registro de nuevo usuario
router.post('/', async (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@%$#^&*!])[A-Za-z\d@%$#^&*!]{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            error: 'La contraseña debe tener al menos 6 caracteres, incluyendo mayúsculas, minúsculas y símbolos.'
        });
    }

    try {
        const [existingUser] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'El usuario ya existe' });
        }

        const [usersCount] = await db.query('SELECT COUNT(*) AS total FROM usuarios');
        const role = usersCount[0].total === 0 ? 1 : 2;

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO usuarios (correo, password, id_rol) VALUES (?, ?, ?)',
            [correo, hashedPassword, role]
        );

        res.status(201).json({
            message: 'Usuario registrado',
            id: result.insertId,
            role: role === 1 ? 'admin' : 'user'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

module.exports = router;