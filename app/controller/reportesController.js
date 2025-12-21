import db from "../database/db.js";

export const getIngresosMensuales = (req, res) => {
  const query = `
    SELECT 
        COALESCE(m.mes, p.mes) AS mes,
        COALESCE(m.ingresos_membresias, 0) AS ingresos_membresias,
        COALESCE(p.ingresos_pagos_dia, 0) AS ingresos_pagos_dia,
        (COALESCE(m.ingresos_membresias, 0) + COALESCE(p.ingresos_pagos_dia, 0)) AS total
    FROM 
        (
            SELECT 
                DATE_FORMAT(m.fecha_inicio, '%Y-%m') AS mes,
                SUM(tm.precio) AS ingresos_membresias
            FROM membresias m
            INNER JOIN tipos_membresia tm ON m.tipo_id = tm.id
            GROUP BY mes
        ) m
    LEFT JOIN
        (
            SELECT 
                DATE_FORMAT(p.fecha_pago, '%Y-%m') AS mes,
                COUNT(*) * 2 AS ingresos_pagos_dia
            FROM pagos_dia p
            GROUP BY mes
        ) p
    ON m.mes = p.mes

    UNION

    SELECT 
        p.mes,
        0 AS ingresos_membresias,
        p.ingresos_pagos_dia,
        p.ingresos_pagos_dia AS total
    FROM
        (
            SELECT 
                DATE_FORMAT(p.fecha_pago, '%Y-%m') AS mes,
                COUNT(*) * 2 AS ingresos_pagos_dia
            FROM pagos_dia p
            GROUP BY mes
        ) p
    WHERE p.mes NOT IN (
        SELECT DATE_FORMAT(m.fecha_inicio, '%Y-%m') FROM membresias m
    )

    ORDER BY mes ASC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener ingresos mensuales:", err);
      return res.status(500).json({ mensaje: "Error al generar reporte" });
    }

    res.status(200).json(results);
  });
};
