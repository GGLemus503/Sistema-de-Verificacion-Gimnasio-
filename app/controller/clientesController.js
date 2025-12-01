import db from "../database/db.js";

// Listar clientes (sin async/await)
export const getClientes = (req, res) => {
  const query = `
    SELECT u.id, u.nombre, u.pin, u.fecha_registro, m.fecha_inicio, m.fecha_fin,
           tm.nombre AS tipo_membresia, tm.precio, m.activa
    FROM usuarios u
    INNER JOIN membresias m ON u.id = m.usuario_id
    INNER JOIN tipos_membresia tm ON m.tipo_id = tm.id
    ORDER BY u.nombre ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener los clientes:", err);
      return res.status(500).json({ mensaje: "Error al obtener los clientes" });
    }

    res.status(200).json(results);
  });
};


// Agregar un nuevo cliente
export const agregarCliente = async (req, res) => {
  const { nombre, pin, tipo_membresia_id } = req.body;

  // Calcular la fecha de inicio (hoy)
  const fecha_inicio = new Date().toISOString().slice(0, 10); // Formato 'YYYY-MM-DD'

  // Calcular la fecha de fin (30 días después)
  const fecha_fin = new Date();
  fecha_fin.setDate(fecha_fin.getDate() + 30); // 30 días después
  const fecha_fin_str = fecha_fin.toISOString().slice(0, 10); // Formato 'YYYY-MM-DD'

  try {
    // Insertar el cliente en la base de datos
    const result = await db.query(`
      INSERT INTO usuarios (nombre, pin) 
      VALUES (?, ?);
    `, [nombre, pin]);

    const usuario_id = result.insertId;

    // Insertar la membresía en la base de datos
    await db.query(`
      INSERT INTO membresias (usuario_id, tipo_id, fecha_inicio, fecha_fin, activa)
      VALUES (?, ?, ?, ?, ?);
    `, [usuario_id, tipo_membresia_id, fecha_inicio, fecha_fin_str, true]);

    res.status(201).json({ mensaje: "Cliente agregado correctamente" });
  } catch (error) {
    console.error("Error al agregar cliente:", error);
    res.status(500).json({ mensaje: "Error al agregar el cliente" });
  }
};