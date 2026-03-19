import { faker } from "@faker-js/faker";

export function generateFakerUsers(count = 5, fakerClient = faker) {
    if (!Number.isInteger(count) || count < 0) {
        throw new Error("count debe ser un entero mayor o igual a 0");
    }

    const users = [];

    for (let i = 0; i < count; i++) {
        users.push({
            // ID unico
            id: fakerClient.string.uuid(),
            // Nombre completo
            name: fakerClient.person.fullName(),
            // Email Random
            email: fakerClient.internet.email(),
        });
    }

    // Devolvemos el array final
    return users;
}
