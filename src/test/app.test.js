import request from "supertest";
import app from "../app.js";

// Grupo de pruebas del endpoit raiz
describe("GET /", () => {
    // Caso feliz: el servidor responde con 200 y mensaje esperado
    it("devuelve mensaje de servidor activo", async () => {
        // Ejecuta una request Get contra "/"
        const res = await request(app).get("/");

        // Validamos condigo HTTP
        expect(res.statusCode).toBe(200);
        // Validamos estructura minima del JSON de respuesta
        expect(res.body).toHaveProperty(
            "message",
            "Servidor funcionando correctamente",
        );
    });
});
