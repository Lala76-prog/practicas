const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Login de usuario
router.post('/', async (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    try {
        const [user] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (user.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        const usuario = user[0];
        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign(
            { 
                id: usuario.id, 
                correo: usuario.correo, 
                role: usuario.id_rol === 1 ? 'admin' : 'user' 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: usuario.id,
                correo: usuario.correo,
                role: usuario.id_rol === 1 ? 'admin' : 'user'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;