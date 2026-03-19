import { describe, expect, jest } from "@jest/globals";
import { generateFakerUsers } from "../services/user.service.js";

// Suite de prueba unitaria del servicio (sin HTTP)

describe("generateFakerUsers coo stubs", () => {
    // Usamos stubs para devolver siempre los mismos datos
    it("permite generar datos fijos para tests unitario", () => {
        // Stub minimo del objeto faker
        const fakerStub = {
            string: { uuid: jest.fn(() => "id-fijo") },
            person: { fullName: jest.fn(() => "Nombre Fijo") },
            internet: { email: jest.fn(() => "fijo@test.com") },
        };

        // Ejecutamos el servicio con dependencia stub
        const users = generateFakerUsers(1, fakerStub);

        // Resultado totalmente determinista
        expect(users).toEqual([
            { id: "id-fijo", name: "Nombre Fijo", email: "fijo@test.com" },
        ]);
    });
});
