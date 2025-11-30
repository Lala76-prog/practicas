-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-06-2025 a las 19:30:00
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sichf`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calzados`
--

CREATE TABLE `calzados` (
  `id_calzado` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `nombre` text NOT NULL,
  `id_categoria` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 0,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `calzados`
--

INSERT INTO `calzados` (`id_calzado`, `estado`, `nombre`, `id_categoria`, `id_proveedor`, `cantidad`, `imagen`) VALUES
(1, 'Disponible', 'Zapato formal rojo', 1, 1, 40, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749568648/1749568648440_kadpnd.jpg'),
(2, 'Disponible', 'Zapato formal marrón', 1, 1, 40, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749570981/1749570981560_kcfqjf.jpg'),
(3, 'Disponible', 'Zapato formal azul', 1, 1, 40, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749571151/1749571151788_mcuruz.jpg'),
(4, 'Disponible', 'Zapato casual beige', 2, 2, 60, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749571787/1749571787446_p6v00i.jpg'),
(5, 'Disponible', 'Zapato casual negro', 2, 2, 60, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749708137/1749708135440_avpymr.jpg'),
(6, 'Disponible', 'Zapato escolar negro', 3, 3, 15, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749708225/1749708223300_rqjlsx.jpg'),
(7, 'Disponible', 'Zapato escolar azul', 3, 3, 10, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749708287/1749708285280_toiyvj.jpg'),
(8, 'Disponible', 'Tenis deportivo blanco', 1, 4, 15, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749708346/1749708343739_uctgv0.png'),
(9, 'Disponible', 'Tenis deportivo negro', 1, 4, 10, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749708412/1749708410108_kofs8c.jpg'),
(10, 'Disponible', 'Bota de trabajo negra', 1, 5, 25, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749708770/1749708768433_eow9ev.jpg'),
(11, 'Disponible', 'Sandalia beige', 2, 6, 12, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749708801/1749708799470_jepn1k.jpg'),
(12, 'Disponible', 'Sandalia negra', 2, 6, 12, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749708843/1749708841299_k1mpve.jpg'),
(13, 'Disponible', 'Zapato de vestir negro', 1, 7, 25, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749708958/1749708956619_rjv49k.jpg'),
(14, 'Disponible', 'Zapatillas  blancas para hombre ', 1, 4, 6, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749709034/1749709032065_nzoqi7.png'),
(15, 'Disponible', 'Zapatillas rosa para mujer ', 2, 5, 6, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749709091/1749709089080_t83eij.jpg'),
(16, 'Disponible', 'Tacón negro', 2, 9, 10, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749709146/1749709144246_uiap6l.jpg'),
(17, 'Disponible', 'Tacón nude', 2, 9, 10, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749709181/1749709179027_nzpeio.jpg'),
(18, 'Disponible', 'Tacón rojo', 2, 9, 5, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749709206/1749709204902_cm99z8.jpg'),
(19, 'Disponible', 'Tenis deportivo niño azul', 3, 10, 40, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749709238/1749709236320_ncw99b.jpg'),
(20, 'Disponible', 'Tenis deportivo niña rosa', 3, 10, 40, 'https://res.cloudinary.com/drifckfyd/image/upload/v1749709276/1749709274690_vkqwst.jpg'),
(61, 'active', 'Test Shoe', 1, 1, 10, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id_carrito` int(11) NOT NULL,
  `id_usu` int(11) NOT NULL,
  `id_calzado` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `precio_unitario` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` varchar(100) DEFAULT NULL,
  `id_pagos` int(11) NOT NULL,
  `total` int(11) DEFAULT NULL,
  `nombre` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`id_carrito`, `id_usu`, `id_calzado`, `cantidad`, `precio_unitario`, `descripcion`, `imagen`, `id_pagos`, `total`, `nombre`) VALUES
(185, 1, 1, 1, 150000, NULL, '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-ou', 0, 150000, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nombre_categoria`) VALUES
(1, 'Hombres'),
(2, 'Mujeres'),
(3, 'Niños ');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `info_calzado`
--

CREATE TABLE `info_calzado` (
  `id_info_calzado` int(11) NOT NULL,
  `material` varchar(20) NOT NULL,
  `talla` varchar(10) NOT NULL,
  `color` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_unitario` int(11) NOT NULL,
  `id_calzados` int(11) DEFAULT NULL,
  `cantidad` varchar(11) NOT NULL DEFAULT '0',
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `info_calzado`
--

INSERT INTO `info_calzado` (`id_info_calzado`, `material`, `talla`, `color`, `descripcion`, `precio_unitario`, `id_calzados`, `cantidad`, `imagen`) VALUES
(1, 'Cuero genuino ', '40-45', 'Negro', 'Zapato formal de vestir para hombre', 150000, 1, '40', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(2, 'Cuero genuino', '40-45', 'Marrón', 'Zapato formal de vestir para hombre', 150000, 2, '40', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(3, 'Cuero sintético', '40-45', 'Azul', 'Zapato formal de vestir para hombre', 150000, 3, '40', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(4, 'Gamuza', '35-39', 'Beige', 'Zapato casual cómodo para mujer', 120000, 4, '60', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(5, 'Cuero sintético', '35-39', 'Negro', 'Zapato casual elegante para mujer', 120000, 5, '60', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(6, 'Cuero sintético', '27-33', 'Negro', 'Zapato escolar resistente para niños', 80000, 6, '15', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(7, 'Cuero sintético', '27-33', 'Azul', 'Zapato escolar resistente para niños', 80000, 7, '10', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(8, 'Malla transpirable', '38-44', 'Blanco', 'Tenis deportivo de alta calidad', 180000, 8, '15', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(9, 'Malla transpirable', '38-44', 'Negro', 'Tenis deportivo de alta calidad', 180000, 9, '10', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(10, 'Cuero resistente', '39-44', 'Negro', 'Bota de trabajo impermeable', 250000, 10, '25', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(11, 'Cuero', '35-39', 'Beige', 'Sandalia cómoda para mujer', 95000, 11, '12', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(12, 'Cuero', '35-39', 'Negro', 'Sandalia elegante para mujer', 95000, 12, '12', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(13, 'Cuero genuino', '39-44', 'Negro', 'Zapato de vestir de alta calidad', 200000, 13, '25', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(14, 'Tela suave', '20-26', 'Blanco', 'Zapato cómodo para bebés', 70000, 14, '6', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(15, 'Tela suave', '20-26', 'Rosa', 'Zapato cómodo para bebés', 70000, 15, '6', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(16, 'Cuero italiano', '35-39', 'Negro', 'Tacón elegante para ocasiones especiales', 220000, 16, '10', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(17, 'Cuero italiano', '35-39', 'Nude', 'Tacón elegante para ocasiones especiales', 220000, 17, '10', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(18, 'Cuero italiano', '35-39', 'Rojo', 'Tacón elegante para ocasiones especiales', 220000, 18, '5', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(19, 'Malla transpirable', '27-33', 'Azul', 'Tenis deportivo para niños', 110000, 19, '40', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg'),
(20, 'Malla transpirable', '27-33', 'Rosa', 'Tenis deportivo para niñas', 110000, 20, '40', '1748229571107-stock-photo-hologram-shoes-and-sports-for-fitness-run-and-speed-for-health-tracking-outdoor-future-sneakers-2240460409.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `metodo_pago` varchar(11) DEFAULT NULL,
  `total` int(11) NOT NULL,
  `fecha_pago` datetime NOT NULL DEFAULT current_timestamp(),
  `id_carrito` int(11) DEFAULT NULL,
  `estado` enum('pendiente','completado','fallido') DEFAULT 'pendiente',
  `n_Transacción` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id_proveedor` int(11) NOT NULL,
  `nombre_proveedor` varchar(30) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(30) DEFAULT NULL,
  `productos_calzado` text DEFAULT NULL,
  `valor_unitario` int(11) DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `direccion` varchar(30) DEFAULT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL,
  `fecha_ultima_compra` date DEFAULT NULL,
  `notas` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`id_proveedor`, `nombre_proveedor`, `telefono`, `correo`, `productos_calzado`, `valor_unitario`, `total`, `cantidad`, `direccion`, `metodo_pago`, `fecha_ultima_compra`, `notas`) VALUES
(1, 'Zapatería Formal ', '3151234567', 'elegante@zapateria.com', 'Zapatos formales para hombre', 150000, 18000000, 120, 'Calle 123 #45-67, Bogotá', 'Transferencia bancaria', '2025-06-05', 'Entrega rápida y confiable'),
(2, 'Moda Femenina SAS', '3209876543', 'ventas@modafemenina.com', 'Zapatos casuales para mujer', 120000, 14400000, 120, 'Av. 68 #12-34, Medellín', 'Tarjeta crédito', '2023-11-02', 'Buenos materiales'),
(3, 'Calzado Infantil Feliz', '3174567890', 'info@calzadofeliz.com', 'Zapatos escolares para niños', 80000, 2000000, 25, 'Carrera 45 #78-90, Cali', 'Efectivo', '2023-09-28', 'Colores variados'),
(4, 'Deportivos Extremos', '3145678901', 'ventas@deportivosext.com', 'Tenis deportivos unisex', 180000, 4500000, 25, 'Diagonal 23 #34-56, Barranquil', 'Transferencia bancaria', '2023-10-30', 'Marcas reconocidas'),
(5, 'Botas y Más', '3182345678', 'botasymas@empresa.com', 'Botas de trabajo para hombre', 250000, 6250000, 25, 'Calle 78 #12-34, Bucaramanga', 'Tarjeta débito', '2023-11-10', 'Resistentes al agua'),
(6, 'Sandalias Tropical', '3193456789', 'info@sandaliastropical.com', 'Sandalias para mujer', 95000, 2280000, 24, 'Av. 30 #45-67, Cartagena', 'Efectivo', '2023-10-22', 'Variedad de tallas'),
(7, 'Zapatos Clásicos', '3164567890', 'clasicos@zapatos.com', 'Zapatos de vestir para hombre', 200000, 5000000, 25, 'Carrera 56 #78-90, Pereira', 'Tarjeta crédito', '2023-11-05', 'Cuero genuino'),
(8, 'Niños Contentos', '3135678901', 'ventas@ninoscontentos.com', 'Zapatos para niños pequeños', 70000, 840000, 12, 'Calle 34 #56-78, Manizales', 'Transferencia bancaria', '2023-09-15', 'Materiales suaves'),
(9, 'Lujo Femenino', '3106789012', 'lujo@zapatosmujer.com', 'Zapatos de tacón para mujer', 220000, 5500000, 25, 'Av. 6N #23-45, Armenia', 'Tarjeta crédito', '2023-11-12', 'Diseños exclusivos'),
(10, 'Deportivos Junior', '3157890123', 'info@deportivosjunior.com', 'Tenis para niños y adolescentes', 110000, 8800000, 80, 'Carrera 12 #34-56, Ibagué', 'Efectivo', '2023-10-18', 'Variedad de colores'),
(112, 'Temp Supplier', '1111111', 'temp@test.com', 'Zapatos', 30, NULL, 50, 'Dir', 'efectivo', NULL, 'Notas'),
(113, 'To Delete', '1111111', 'delete@test.com', 'Zapatos', 30, NULL, 50, 'Dir', 'efectivo', NULL, 'Notas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL CHECK (`descripcion` in ('Admin','Usuario'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `descripcion`) VALUES
(1, 'admin '),
(2, 'usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usu` int(11) NOT NULL,
  `correo` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usu`, `correo`, `password`, `id_rol`) VALUES
(1, 'varonmateo042@gmail.com', '$2b$10$B1pomJhyofwQYdAmQxxZ7u3Teji3M973IvYsyjc3518/OIV8wcA3e', 1),
(2, 'jose.perez123@example.com', '$2b$10$.UzZE9IXEaPwZzzewzJjAe6Yw2YYueNVK74QzMhy1E98teuuJUm7y', 2),
(3, 'luisa.martinez@example.com', '$2b$10$828D.mJs4ZFBnCiIbtMAU.SE0IeWXgnwgXwMnwIjw7mXyN.HF2lpm', 2),
(4, 'carlos.rodrigue@gmail.com', '$2b$10$BKlSWyPnqlwi.slPAoCQ0u3zE0xU3lqqLhakYlvR5jY/WNyvq7q0C', 2),
(5, 'im.bxl@gmail.com', '$2b$10$CsXpkOXcOZ24Z7e5DZDQdOEee5E/pAmwWZ/n1akwiMLeLH/xIHOKW', 2),
(6, 'prueba@gmail.com', '$2b$10$wH7EQOivPjPdQJiGkYzEmuVtjP.KvOOsxy9T8rxbCk8lgq5sGj.L.', 2),
(7, 'prueba1@gmail.com', '$2b$10$xNROwO5DqI/iBR..EZg7KeIoPBRejxWlas8VDTbivTFuvHlcV59N.', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `calzados`
--
ALTER TABLE `calzados`
  ADD PRIMARY KEY (`id_calzado`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id_carrito`),
  ADD KEY `id_usu` (`id_usu`),
  ADD KEY `id_calzado` (`id_calzado`),
  ADD KEY `id_pagos` (`id_pagos`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `info_calzado`
--
ALTER TABLE `info_calzado`
  ADD PRIMARY KEY (`id_info_calzado`),
  ADD KEY `fk_info_calzado_calzados` (`id_calzados`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `id_carrito` (`id_carrito`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usu`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `calzados`
--
ALTER TABLE `calzados`
  MODIFY `id_calzado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id_carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=186;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `info_calzado`
--
ALTER TABLE `info_calzado`
  MODIFY `id_info_calzado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `calzados`
--
ALTER TABLE `calzados`
  ADD CONSTRAINT `calzados_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`),
  ADD CONSTRAINT `calzados_ibfk_3` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`);

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_usu`) REFERENCES `usuarios` (`id_usu`),
  ADD CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`id_calzado`) REFERENCES `calzados` (`id_calzado`);

--
-- Filtros para la tabla `info_calzado`
--
ALTER TABLE `info_calzado`
  ADD CONSTRAINT `fk_info_calzado_calzados` FOREIGN KEY (`id_calzados`) REFERENCES `calzados` (`id_calzado`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_carrito`) REFERENCES `carrito` (`id_pagos`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
