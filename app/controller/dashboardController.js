import db from "../database/db.js";


// Función para actualizar membresías vencidas antes de mostrar datos
export const actualizarMembresiasVencidas = (req, res) => {
  const query = `UPDATE membresias SET activa = 0 WHERE fecha_fin < CURDATE() AND activa = 1 AND id IS NOT NULL`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al actualizar membresías vencidas:", err);
      return res.status(500).json({ message: "Error al actualizar" });
    }
    res.status(200).send("Membresías actualizadas");
  });
};



//Funcion para Contar Todos los Clientes
export const getTotalClientes = (req, res) => {
    const query = `SELECT COUNT(*) AS cantidad_clientes FROM usuarios;`;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error al obtener los clientes:", err);
        return res.status(500).json({ message: "Error al obtener los clientes" });
      }
      res.json(results[0]); 
    });
  };
  

// Obtener cantidad de pagos por día del mes actual
export const getPagosDiaMesActual = (req, res) => {
    const query = `
        SELECT COUNT(*) AS cantidad_pagos_dia
        FROM pagos_dia
        WHERE MONTH(fecha_pago) = MONTH(CURDATE())
        AND YEAR(fecha_pago) = YEAR(CURDATE());
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener los pagos diarios:", err);
            return res.status(500).json({ message: "Error al obtener los pagos diarios" });
        }
        res.json(results[0]);
    });
};

// Funcion para Contar Todos los Ingresos Mensuales
export const getTotalIngresosMensuales = (req, res) => {
    const query = `
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
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error al obtener los ingresos mensuales:", err);
        return res.status(500).json({ message: "Error al obtener ingresos" });
      }
      res.json(results[0]); // ← solo un resultado
    });
  };

//Comparacion de Clientes Activos y Vencidos
  export const getClientesActivosVsVencidos = (req, res) => {
    const query = `
      SELECT
        SUM(CASE WHEN fecha_fin >= CURDATE() THEN 1 ELSE 0 END) AS activos,
        SUM(CASE WHEN fecha_fin < CURDATE() THEN 1 ELSE 0 END) AS vencidos
      FROM membresias;
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error al obtener datos de membresías:", err);
        return res.status(500).json({ message: "Error al obtener los datos" });
      }
      res.json(results[0]);
    });
  };
  
