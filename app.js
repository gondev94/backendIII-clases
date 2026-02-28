import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Command } from "commander";
import { env } from "process";
import { fork } from "child_process";
import { resolve } from "path";



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();
program.option("-e, --env <environment>", "Entorno de ejecución", "dev"); // default(set) 
program.parse(process.argv);

//const { env } = program.opts() //-> get


const options = program.opts();
//borrariamos options

//const envName = env // default dev
const envName = options.env || "dev";

const allowedEnvs = ["local", "dev", "prod", "qa"];
if (!allowedEnvs.includes(envName)) { 
    console.error(`Entorno de ejecución inválido: ${envName}`);
    console.error(`Usa uno de estos valores: ${allowedEnvs.join(" | ")}`);
    process.exit(1);
}

const envFilePath = `.env.${envName}`;
if (!fs.existsSync(envFilePath)) { 
    console.error(`El archivo ${envFilePath} no existe`);
    process.exit(1);
}

dotenv.config({path: envFilePath});

const app = express();
const rawPort = process.env.PORT;
const PORT = rawPort ? Number(rawPort) : 3000;
const SECRET = process.env.SECRET || "default-secret";

if (Number.isNaN(PORT)) {
    console.error(`PORT inválido en ${envFilePath}; "${rawPort}"`);
}

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hola desde node");
})

app.get("/secret", (req, res) => {
    res.send(`Tu secreto es: ${SECRET}`);
})

/**
 * Ruta que ejecuta un proceso hijo
 * fork() cree un nuevo proceso node que ejecuta el archivo child.js
 */
app.get("/child", (req, res) => {
    //resolvemos la ruta absoluta del proceso hijo
    const childPath = resolve(__dirname, "./child.js");
    //creamos el proceso hijo
    const child = fork(childPath);

    //escuche el mensaje del proceso hijo -> enviado con process.send();
    child.on("message", (msj) => {
        res.send(`Mensaje del proceso hijo: ${msj}`);
    })

    // si ocurre un error en el hijo, informamos y respondemos con error 500
    child.on("error", (error) => {
        console.error("Error en el proceso hijo:", error);
        res.status(500).send("Error en el proceso hijo");
    })

    // este evento se ejecuta cuando el proceso hijo termina su ejecución
    child.on("exit", (code) => {
        console.log(childPath);
        console.log(`El proceso hijo terminó con código ${code}`);
    })
})
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
