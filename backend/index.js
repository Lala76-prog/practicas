require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Importar rutas
const routes = {
  registro: require('./routes/registro'),
  login: require('./routes/login'),
  usuarios: require('./routes/usuarios'),
  carrito: require('./routes/carrito'),
  proveedor: require('./routes/proveedor'),
  calzado: require('./routes/calzado'),
  categoria: require('./routes/categoria'),
  info_calzado: require('./routes/info_calzado'),
  roles: require('./routes/roles'),
  pagos: require('./routes/pagos')
};

// Configuración centralizada
const config = {
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dygiiq3wg',
    api_key: process.env.CLOUDINARY_API_KEY || '592528791475957',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'jDdPsDjIDznPCM7hsKvXPSOvdZU'
  },
  server: {
    port: process.env.PORT || 3001,
    uploads: {
      dir: 'temp_uploads',
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1
      },
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    }
  }
};

// Inicializar Cloudinary
cloudinary.config(config.cloudinary);

// Crear aplicación Express
const app = express();

// Configuración de middlewares
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(config.server.uploads.dir)) {
      fs.mkdirSync(config.server.uploads.dir, { recursive: true });
    }
    cb(null, config.server.uploads.dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (config.server.uploads.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no soportado. Solo se permiten: ${config.server.uploads.allowedTypes.join(', ')}`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: config.server.uploads.limits,
  fileFilter: fileFilter
});

// Registrar rutas
Object.entries(routes).forEach(([routeName, routeHandler]) => {
  app.use(`/api/${routeName}`, routeHandler);
});

// Ruta de subida de imágenes
app.post('/api/uploads', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No se proporcionó ningún archivo o el archivo está vacío'
      });
    }

    // Validación adicional del tipo MIME
    if (!req.file.mimetype.startsWith('image/')) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'El archivo proporcionado no es una imagen válida'
      });
    }

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'product_images',
      resource_type: 'auto',
      quality: 'auto:good'
    });
 
    // Eliminar archivo temporal
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error al eliminar archivo temporal:', err);
    });

    res.status(200).json({
      success: true,
      message: 'Imagen subida correctamente',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        bytes: result.bytes,
        created_at: result.created_at
      }
    });

  } catch (error) {
    console.error('Error en la subida:', error);
    
    // Limpieza: eliminar archivo temporal si existe
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: 'Error al procesar la imagen',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Ruta GET informativa para /api/uploads
app.get('/api/uploads', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Endpoint de subida de imágenes',
    instructions: 'Use POST /api/uploads con un archivo de imagen en el campo "image"',
    limits: {
      maxFileSize: `${config.server.uploads.limits.fileSize / (1024 * 1024)}MB`,
      allowedTypes: config.server.uploads.allowedTypes
    }
  });
});

// Rutas básicas de verificación
const basicRoutes = {
  '/': 'Servidor de subida de imágenes y API funcionando',
  '/api/registro': 'Bienvenido al servidor de registro',
  '/api/login': 'Bienvenido al servidor de login',
  '/api/usuarios': 'Bienvenido al servidor de usuarios',
  '/api/carrito': 'Bienvenido al servidor de carrito',
  '/api/proveedor': 'Bienvenido al servidor de proveedor',
  '/api/pagos': 'Bienvenido al servidor de pagos'
};

Object.entries(basicRoutes).forEach(([path, message]) => {
  app.get(path, (req, res) => res.send(message));
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(413).json({
      success: false,
      error: err.code === 'LIMIT_FILE_SIZE' 
        ? `El archivo excede el tamaño máximo permitido (${config.server.uploads.limits.fileSize / (1024 * 1024)}MB)` 
        : 'Error al subir el archivo'
    });
  }
  
  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(config.server.port, () => {
  console.log(`Servidor corriendo en puerto ${config.server.port}`);
  console.log('Configuración de Cloudinary:', {
    cloud_name: cloudinary.config().cloud_name,
    api_key: '***' + cloudinary.config().api_key.slice(-4)
  });
});