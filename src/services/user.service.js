import { faker } from "@faker-js/faker";


export function generateFakeUsers(count , fakerClient = faker) {
    if (!Number.isInteger(count) || count < 0) {
        throw new Error("count debe ser un número entero positivo");
    }

    const users = [];

    for (let i = 0; i < count; i++){
        users.push({
            // ID UNICO
            id: fakerClient.string.uuid(),
            // NOMBRE
            name: fakerClient.person.fullName(),
            // EMAIL
            email: fakerClient.internet.email()
            
        });
    }
    //devolvemos el array final
    return users;
}