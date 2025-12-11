import db from "../database/db.js";

// Obtener todos los clientes
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
export const agregarCliente = (req, res) => {
  const { nombre, pin, tipo_membresia_id } = req.body;

  const fecha_inicio = new Date().toISOString().slice(0, 10);
  const fecha_fin = new Date();
    let dias = 30;

    switch (parseInt(tipo_membresia_id)) {
      case 1: dias = 15; break;
      case 2: dias = 30; break;
      case 3: dias = 365; break;
    }

    fecha_fin.setDate(fecha_fin.getDate() + dias);

  const fecha_fin_str = fecha_fin.toISOString().slice(0, 10);

  const sqlInsertUsuario = `INSERT INTO usuarios (nombre, pin) VALUES (?, ?)`;
  db.query(sqlInsertUsuario, [nombre, pin], (err, result) => {
    if (err) {
      console.error("Error insert usuario:", err);
      return res.status(500).json({ mensaje: "Error al agregar el usuario" });
    }
    const usuario_id = result.insertId;
    const sqlInsertMemb = `INSERT INTO membresias (usuario_id, tipo_id, fecha_inicio, fecha_fin, activa) VALUES (?, ?, ?, ?, ?)`;
    db.query(sqlInsertMemb, [usuario_id, tipo_membresia_id, fecha_inicio, fecha_fin_str, 1], (err2) => {
      if (err2) {
        console.error("Error insert membresia:", err2);
        return res.status(500).json({ mensaje: "Error al agregar la membresía" });
      }
      return res.status(201).json({ mensaje: "Cliente agregado correctamente" });
    });
  });
};

//Funcion para actualizar la membresia de un cliente
export const actualizarMembresia = (req, res) => {
  const usuario_id = req.params.id;
  const { tipo_membresia_id } = req.body;

  // Días según tipo
  let dias = 30;

  switch (parseInt(tipo_membresia_id)) {
    case 1: dias = 15; break;  // Quincenal
    case 2: dias = 30; break;  // Mensual
    case 3: dias = 365; break; // Anual
  }

  const fecha_inicio = new Date().toISOString().slice(0, 10);

  const fecha_fin_obj = new Date();
  fecha_fin_obj.setDate(fecha_fin_obj.getDate() + dias);
  const fecha_fin = fecha_fin_obj.toISOString().slice(0, 10);

  const sql = `
    UPDATE membresias 
    SET tipo_id = ?, fecha_inicio = ?, fecha_fin = ?, activa = 1
    WHERE usuario_id = ?
  `;

  db.query(sql, [tipo_membresia_id, fecha_inicio, fecha_fin, usuario_id], (err) => {
    if (err) {
      console.error("Error al actualizar membresía:", err);
      return res.status(500).json({ mensaje: "Error al actualizar membresía" });
    }
    res.json({ mensaje: "Membresía actualizada correctamente" });
  });
};
