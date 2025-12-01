import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../index.js";
import db from "../database/db.js";

export const register = (req, res) => {
    const { user, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const query = "INSERT INTO empleados (nombre, usuario, password, role) VALUES (?, ?, ?, 'admin')";
    db.query(query, [user, email, hashedPassword], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    });
};


export const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Correo y contraseña son requeridos" });
    }

    const query = "SELECT * FROM empleados WHERE usuario = ?";
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ error: "Error del servidor" });

        if (results.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        try {
            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
            res.cookie("authToken", token, { httpOnly: true });

            // Determinar redirección según el rol
            const redirectURL = user.role === "admin" ? "/admin" : "/user";
            res.json({ message: "Inicio de sesión exitoso", redirectURL });
        } catch (err) {
            return res.status(500).json({ message: "Error al generar el token" });
        }
    });
};

