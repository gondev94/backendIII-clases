import express from "express";
import dotenv from "dotenv";
import { generateFakerUsers as fkuser } from "./services/user.service.js";

dotenv.config();

const app = express();
const rawPort = process.env.PORT;
const PORT = rawPort ? Number(rawPort) : 3000;


if (Number.isNaN(PORT)) {
    console.error(`PORT invalido: "${rawPort}"`);
}

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Servidor funcionando correctamente",
        // PID de procesos
        pid: process.pid,
    });
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

export default app;
