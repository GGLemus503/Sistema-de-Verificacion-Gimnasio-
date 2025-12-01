import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../index.js";

export const authenticate = (req, res, next) => {
    const token = req.cookies.authToken;

     // Redirige al login si no hay token
    if (!token) {
        return res.redirect("/");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Error al verificar token:", err);
        return res.redirect("/");
    }
};

export const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).send("Acceso denegado. No tienes permiso para acceder a esta ruta.");
        }
        next();
    };
};
