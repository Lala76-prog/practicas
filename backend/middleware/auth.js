const jwt = require('jsonwebtoken');
require('dotenv').config();

// Función para generar token automáticamente con los datos del usuario
const generateToken = (userData) => {
    if (!userData.id || !userData.correo) {
        throw new Error('Datos de usuario incompletos para generar el token');
    }

    return jwt.sign(
        {
            id: userData.id,
            correo: userData.correo,
            role: userData.role || 'user' // Valor por defecto 'user' si no se especifica
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Middleware para verificar token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (!req.user.id) {
            console.error('Token decodificado sin ID:', req.user);
            return res.status(400).json({ error: 'Token inválido: falta ID de usuario' });
        }

        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        
        return res.status(401).json({ error: 'Token inválido' });
    }
};

// Middleware para verificar rol de administrador
const checkRole = (roles = ['admin']) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Acceso denegado. Se requiere uno de estos roles: ${roles.join(', ')}` 
            });
        }
        next();
    };
};

module.exports = { 
    generateToken, 
    verifyToken, 
    checkRole 
};