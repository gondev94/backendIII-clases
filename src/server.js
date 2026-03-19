import app from "./app.js";

const rawPort = process.env.PORT;
const PORT = rawPort ? Number(rawPort) : 3000;

if (Number.isNaN(PORT)) {
    console.error(`PORT invalido: "${rawPort}"`);
    process.exit(1);
}

app.listen(PORT, () => {
    console.log(`Escuchando en http://localhost:${PORT}`);
});
