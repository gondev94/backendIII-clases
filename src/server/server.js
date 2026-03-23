import express from "express";
import dotenv from "dotenv";
import { generateFakerUsers as fkuser } from "../services/user.service.js";

import logger from "../../src/logs/logger.js";

dotenv.config();

const app = express();

app.use(express.json());

// Middleware general de auditoria
app.use((req, res, next) => {
    logger.http(`Solicitud entrante: ${req.method} | URL: ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    const message = "Servidor funcionando correctamente";
    const pid = process.pid;
    res.status(200).json({ message: message, pid: pid });
    logger.http(message);
});

// Ruta de ejemplo para debug
app.get("/debug", (req, res) => {
    logger.debug("Ruta solicitada: /debug");
    res.send("Mensaje de Debug");
});

// Ruta de ejempo para testear un warn
app.get("/warn", (req, res) => {
    logger.warn("Ruta solicitada: /warn");
    res.send("Mensaje de Advertencia");
});

// Ruta de ejempo para testear un error
app.get("/error", (req, res) => {
    logger.error("Ruta solicitada: /error");
    res.send("Mensaje de Error");
});

// Ruta de ejempo para testear un warn
app.get("/fatal", (req, res) => {
    logger.fatal("Ruta solicitada: /fatal");
    res.send("Mensaje de Error Fatal");
});

// Ruta de ejempo para testear solicitudes
app.get("/test", (req, res) => {
    logger.http("Ruta solicitada: /test");
    res.send("Mensaje de Test");
});

app.get("/users", (req, res) => {
    try {
        // Si no viene USERS_COUNT, usamos por defecto 5.
        const count = Number(process.env.USERS_COUNT || 5);

        // Generar N Usuarios en Memoria
        const users = fkuser(count);

        // Respuesta exitosa del Array de los usuarios
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

const rawPort = process.env.PORT;
const PORT = rawPort ? Number(rawPort) : 3000;

if (Number.isNaN(PORT)) {
    logger.error(`PORT invalido en ${envFilePath}; "${rawPort}"`);
}

export function startServer() {
    app.listen(PORT, () => {
        logger.info(`Escuchando en http://localhost:${PORT}`);
    });
}
