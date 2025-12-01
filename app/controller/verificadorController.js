import db from "../database/db.js";

export const verificarMembresia = (req, res) => {
  const { codigo } = req.body;

  const query = `
    SELECT u.nombre, m.fecha_fin, m.activa
    FROM usuarios u
    INNER JOIN membresias m ON u.id = m.usuario_id
    WHERE u.pin = ?
    ORDER BY m.fecha_fin DESC
    LIMIT 1;
  `;

  db.query(query, [codigo], (err, results) => {
    if (err) {
      console.error("Error al verificar membresía:", err);
      return res.status(500).json({ message: "Error del servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ estado: "no_encontrado", message: "Cliente no encontrado." });
    }

    const { nombre, fecha_fin, activa } = results[0];

    const estado = activa ? "activa" : "vencida";

    res.json({
      nombre,
      fecha_fin,
      estado,
    });
  });
};

export const pagoDia = (_, res) => {
    const query = `INSERT INTO pagos_dia (fecha_pago) VALUES (NOW())`;
  
    db.query(query, (err, _) => {
      if (err) {
        console.error("Error al registrar pago del día:", err);
        return res.status(500).json({ message: "Error al registrar el pago del día" });
      }
  
      res.status(200).json({ message: "Pago del día registrado con éxito" });
    });
  };
  