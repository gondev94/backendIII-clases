import express from "express";
import dotenv from "dotenv";
import { generateFakeUsers as fkUser } from "./services/user.service.js";



dotenv.config();

const app = express();
const rawPort = process.env.PORT;
const PORT = rawPort ? Number(rawPort) : 3000;


if (Number.isNaN(PORT)) {
    console.error(`PORT inválido en ${envFilePath}; "${rawPort}"`);
}

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send({
        message: "Server is running",
        // PID de procesos
        pid: process.pid,
    })
})

app.get("/users", (req, res) => {
    try {
        //si no viene USER_COUNT, se genera 5 usuarios
        const count = Number(process.env.USER_COUNT) || 5;

        //generamos los usuarios
        const users = fkUser(count)

        //respuesta exitosa
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;