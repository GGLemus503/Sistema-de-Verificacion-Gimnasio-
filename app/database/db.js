import mysql from 'mysql2';

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "gimnasio",
});

db.connect((err) => {
    if (err) {
        console.error("Error al conectar con la base de datos:", err.message);
        process.exit(1);
    }
    console.log("Conexión a la base de datos establecida.");
});

export default db;
