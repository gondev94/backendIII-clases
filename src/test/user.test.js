import { afterEach, expect, jest } from "@jest/globals";
// Importamos un cliente HTTP para testear los endpoints
import request from "supertest";
import { generateFakerUsers } from "../services/user.service.js";

// Armamos nuestra suite de tests para /users
describe("GET /users con moks de `faker`", () => {
    // Guardamos valor original de USERS_COUT en una variable
    const originalUserCount = process.env.USERS_COUNT;

    // Limpiamos el cache de modulos entre un test y otro
    beforeEach(() => {
        jest.resetModules();
    });

    // Restauramos estado de process.env luego de cada test
    afterEach(() => {
        if (originalUserCount === undefined) {
            delete process.env.USERS_COUNT;
        } else {
            process.env.USERS_COUNT = originalUserCount;
        }
    });

    it("usar mock del servicio", async () => {
        jest.unstable_mockModule("../services/user.service.js", () => ({
            generateFakerUsers: () => [
                { id: "1", name: "Usuario Mock", email: "test@email.com" },
            ],
        }));

        // Import dinamico: asegura que la app use el modulo mockeado
        const app = (await import("../app.js")).default;
        const res = await request(app).get("/users");

        expect(res.statusCode).toBe(200); // Lo que se espera cumplir
        expect(res.body).toEqual([
            { id: "1", name: "Usuario Mock", email: "test@email.com" },
        ]);
    });

    // Ejemplo de mockeo para process.env
    it("mockea process.env para cambiar USERS_COUNT", async () => {
        // Mock espia para verificar con que valor fue llamado
        const userMock = jest.fn(() => []);
        jest.unstable_mockModule("../services/user.service.js", () => ({
            generateFakerUsers: userMock,
        }));

        // Sobrescribimos variables de entorno solo en este test
        process.env.USERS_COUNT = "2";
        const app = (await import("../app.js")).default;
        const res = await request(app).get("/users");

        expect(res.statusCode).toBe(200);
        // Confirmamos que el endopoint leyo y convirtio USERS_COUNT a Number
        expect(userMock).toHaveBeenCalledWith(2);
    });

    // Simulamos un fallo interno del servidor para validar manejo de errores (500)
    it("responde 500 si el servicio falla", async () => {
        jest.unstable_mockModule("../services/user.service.js", () => ({
            generateFakerUsers: () => {
                throw new Error("Fallo en el Servidor.!");
            },
        }));

        const app = (await import("../app.js")).default;
        const res = await request(app).get("/users");

        expect(res.statusCode).toBe(500);
        // Solo verificamos que exista en campo error, el mensaje puede variar;
        expect(res.body).toHaveProperty("error");
    });
});
