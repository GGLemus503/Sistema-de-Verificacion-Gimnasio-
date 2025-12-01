-- Crear base de datos
CREATE DATABASE IF NOT EXISTS gimnasio;
USE gimnasio;

-- Tabla de usuarios (clientes del gimnasio)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    pin VARCHAR(10) NOT NULL UNIQUE,
    fecha_registro DATE NOT NULL DEFAULT (CURRENT_DATE)
);

-- Tabla de tipos de membresía
CREATE TABLE tipos_membresia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,        -- Ej: Semanal, Mensual, Anual
    duracion_dias INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL
);

-- Tabla de membresías activas o vencidas
CREATE TABLE membresias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (tipo_id) REFERENCES tipos_membresia(id)
);

-- Pagos por día (no importa quién pagó, solo cuántos)
CREATE TABLE pagos_dia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Empleados (para login)
CREATE TABLE empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- Contraseña hasheada con bcrypt
    rol ENUM('admin', 'empleado') NOT NULL,
    fecha_ingreso DATE NOT NULL DEFAULT (CURRENT_DATE)
);

-- Índice para acelerar conteos de pagos por fecha
CREATE INDEX idx_fecha_pago ON pagos_dia(fecha_pago);

-- Insertar tipos de membresía
INSERT INTO tipos_membresia (nombre, duracion_dias, precio)
VALUES 
('Semanal', 7, 5.00),
('Mensual', 30, 15.00),
('Anual', 365, 120.00);

-- Insertar 3 usuarios con PIN
INSERT INTO usuarios (nombre, pin)
VALUES 
('Omar Hernandez', '8765');
Select * from membresias;
-- Asignar membresía activa
INSERT INTO membresias (usuario_id, tipo_id, fecha_inicio, fecha_fin, activa)
VALUES 
(8, 1, '2025-04-22', '2025-05-22', TRUE);
Update membresias set tipo_id = 1
Where usuario_id = 8;

-- Insertar pagos del día de personas sin membresía 
INSERT INTO pagos_dia (fecha_pago) VALUES
(NOW()), (NOW()); 


-- Consultar Cantidad de Pagos Diarios
SELECT 
    DATE(fecha_pago) AS dia, 
    COUNT(*) AS cantidad_pagaron
FROM pagos_dia
WHERE MONTH(fecha_pago) = 4 AND YEAR(fecha_pago) = 2025
GROUP BY DATE(fecha_pago);

SELECT * FROM pagos_dia;
Delete From empleados Where id = 4;
Select * from tipos_membresia;

update tipos_membresia 
set precio = 20.00 Where ID = 2; 

SELECT u.nombre, u.pin , u.fecha_registro, m.fecha_inicio, m.fecha_fin, tm.nombre as tipo_membresia, tm.precio, m.activa
FROM usuarios u
INNER JOIN  membresias m ON u.id = m.usuario_id
INNER JOIN tipos_membresia tm ON m.tipo_id= tm.id;

SELECT 
    COUNT(*) AS cantidad_pado_dia
FROM pagos_dia
WHERE MONTH(fecha_pago) = 4 AND YEAR(fecha_pago) = 2025
GROUP BY DATE(fecha_pago);


SELECT 
    SUM(tm.precio) AS total_ingresos_mensualidades
FROM usuarios u
INNER JOIN  membresias m ON u.id = m.usuario_id
INNER JOIN tipos_membresia tm ON m.tipo_id= tm.id;

SELECT 
    (SELECT SUM(tm.precio)
     FROM usuarios u
     INNER JOIN membresias m ON u.id = m.usuario_id
     INNER JOIN tipos_membresia tm ON m.tipo_id = tm.id
     WHERE m.fecha_fin >= CURDATE()) 
    +
    (SELECT COUNT(*) * 2.00 
     FROM pagos_dia 
     WHERE MONTH(fecha_pago) = MONTH(CURDATE()) AND YEAR(fecha_pago) = YEAR(CURDATE()))
    AS total_ingresos_mes;


SELECT
      SUM(CASE WHEN fecha_fin >= CURDATE() THEN 1 ELSE 0 END) AS activos,
      SUM(CASE WHEN fecha_fin < CURDATE() THEN 1 ELSE 0 END) AS vencidos
    FROM membresias;
    
Select * from membresias;
Update membresias set activa = 1;  
-- Triger para verificar membresias
UPDATE membresias
SET activa = 0
WHERE fecha_fin < CURDATE() AND activa = 1 AND id IS NOT NULL;
