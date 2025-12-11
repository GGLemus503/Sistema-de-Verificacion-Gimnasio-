//Importaciones necesarias para el funcionamiento
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { login, register } from "./controller/authenticationController.js";
import { authenticate, authorize } from "./middleware/authMiddleware.js";
import { getClientes, agregarCliente,actualizarMembresia } from "./controller/clientesController.js";
import { verificarMembresia, pagoDia } from "./controller/verificadorController.js";
import { getTotalClientes, getPagosDiaMesActual, getTotalIngresosMensuales, 
         getClientesActivosVsVencidos, actualizarMembresiasVencidas } from "./controller/dashboardController.js";

//Configuracion del Token
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "ClaveSuperSecreta";
export { JWT_SECRET };


const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname + '/public'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "app/public")));

// Configuración  e inicio del Servidor
const PORT = 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

// Rutas de Registro y Logeo
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/pages/login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "/pages/register.html")));


//Rutas de Vistas
app.get("/admin", authenticate, authorize(["admin"]), (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/admin/dashboard.html"));
});

app.get("/verificador", authenticate, authorize(["admin"]), (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/admin/verificador.html"));
});

app.get("/clientes", authenticate, authorize(["admin"]), (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/admin/clientes.html"));
});

app.get("/reportes", authenticate, authorize(["admin"]), (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/admin/reportes.html"));
});

app.get("/configuracion", authenticate, authorize(["admin"]), (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/admin/configuracion.html"));
});


//Rutas de los Clientes
app.get("/api/clientes", authenticate,authorize(["admin"]), getClientes);
app.post("/api/clientes/agregar", authenticate, authorize(["admin"]), agregarCliente);
app.put("/api/clientes/actualizar/:id", authenticate, authorize(["admin"]), actualizarMembresia);




//Rutas de la DashBoard
app.get("/api/actualizar-membresias", authenticate,authorize(["admin"]), actualizarMembresiasVencidas);

app.get("/api/total-clientes", authenticate,authorize(["admin"]), getTotalClientes);

app.get("/api/pagos-dia", authenticate, authorize(["admin"]), getPagosDiaMesActual);

app.get("/api/ingresos-mensuales", authenticate, authorize(["admin"]), getTotalIngresosMensuales);

app.get("/api/clientes-activos-vencidos", authenticate, authorize(["admin"]), getClientesActivosVsVencidos);


//Rutas de Verificador de Ingreso
app.post("/api/verificar-membresia", authenticate, authorize(["admin"]), verificarMembresia);

app.post("/api/pago-dia", authenticate, authorize(["admin"]), pagoDia);



//Ruta Cierre de Sesion
app.post("/api/logout", (req, res) => {
    res.clearCookie("authToken");
    res.json({ message: "Sesión cerrada con éxito" });
});

//Cargar los metodos de Registro y Loggeo
app.post("/api/register", register);
app.post("/api/login", login);



