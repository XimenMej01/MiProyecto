-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-11-2026 a las 18:07:35
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `banco_semillas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `semillas`
--

CREATE TABLE `semillas` (
  `id` bigint(20) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `fecha_registro` date NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `procedencia` varchar(150) NOT NULL,
  `variedad` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `semillas`
--

INSERT INTO `semillas` (`id`, `cantidad`, `categoria`, `descripcion`, `fecha_registro`, `nombre`, `procedencia`, `variedad`) VALUES
(1, 500.00, 'Hortaliza', 'Semillas para cultivo comunitario.', '2026-11-15', 'Tomate', 'Chiclayo', 'Cherry'),
(2, 0.00, 'Hortaliza', 'Variedad de raiz.', '2026-11-17', 'Zanahoria', 'Lambayeque', 'Nantes'),
(5, 0.90, 'Frutal', NULL, '2026-11-23', 'Tomate', 'Pacasmayo', 'cherry'),
(6, 0.80, 'Frutal', NULL, '2026-11-23', 'Fresa', 'Pacasmayo', 'pequeña'),
(7, 0.70, 'Hortaliza', NULL, '2026-11-23', 'Lechugas', 'Pacasmayo', 'mini'),
(8, 0.89, 'Frutal', NULL, '2026-11-23', 'Maracuyá', 'Pacasmayo', 'mini'),
(9, 0.70, 'Frutal', NULL, '2026-11-23', 'Maracuya', 'Pacasmayo', 'Gigante'),
(10, 0.80, 'Leguminosa', NULL, '2026-11-16', 'Papa', 'Pacasmayo', 'amarilla');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` bigint(20) NOT NULL,
  `activo` bit(1) NOT NULL,
  `correo` varchar(120) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `activo`, `correo`, `nombre`, `password`) VALUES
(1, b'1', 'admin@bancosemillas.local', 'Administrador', '$2a$10$.VHDjWcQeO3NFDeONcQoTuDhu57C4ZWJyyROUTfAoYAedptRENEEi');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `semillas`
--
ALTER TABLE `semillas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `semillas`
--
ALTER TABLE `semillas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
