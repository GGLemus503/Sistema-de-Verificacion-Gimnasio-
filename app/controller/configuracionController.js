import db from "../database/db.js";

// Obtener todos los usuarios
export const getUsuarios = (req, res) => {
  const query = `
    SELECT id, nombre, pin, fecha_registro
    FROM usuarios
    ORDER BY nombre ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener los usuarios:", err);
      return res.status(500).json({ mensaje: "Error al obtener los usuarios" });
    }

    res.status(200).json(results);
  });
};
