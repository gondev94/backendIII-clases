import { describe, expect, jest } from "@jest/globals";

//importamos un clinete http para testear los endpoints

import request from "supertest";
import { generateFakeUsers } from "../services/user.service.js";


//armamos nuestra suite de tests para /users

//se usa describe para testear un endpoint en particular
describe('GET /users con moks de `faker`', () => {
    //guardamos valor original de USERS_COUNT en una variable
    const originalUsersCount = process.env.USERS_COUNT;

    // limpiamos el cache de modulos entre un test y otro
    beforeEach(() => {
        jest.resetModules();
    });

    //restauramos estado de process.env luego de cada test 
    afterEach(() => {
        if (originalUsersCount === undefined) {
            delete process.env.USERS_COUNT;
        } else {
            process.env.USERS_COUNT = originalUsersCount;
        }
    });

    it('usar mock del servicio', async () => {
        jest.unstable_mockModule('../services/user.service.js', () => ({
            generateFakeUsers: () => [
                { id: '1', name: 'Usuario Mock', email: 'test@email.com' },
            ]
        }));
        // import dinamoco: asegura que la app use el modulo mockeado
        const app = (await import('../app.js')).default;
        const res = await request(app).get('/users');

        expect(res.status).toBe(200) // lo que se espera cumplir
        expect(res.body).toEqual([
            { id: '1', name: 'Usuario Mock', email: 'test@email.com' }
        ]);
    
    });

    // ejemplo de mockeo para process.env
    it('mockea process.env para cambiar USERS_COUNT', async () => {
        //mock espia para verificar con que valor fue llamado.
        const userMock = jest.fn(() => []);
        //mock del servicio
        jest.unstable_mockModule('../services/user.service.js', () => ({
            generateFakeUsers: userMock,
        }));
        // sobreescribimos variables de entorno solo en este test
        process.env.USERS_COUNT = '2';
        const app = (await import('../app.js')).default;
        const res = await request(app).get('/users');

        expect(res.statusCode).toBe(200);

        //confirmamos que el endpoint leyo y convirtio USERS_COUNT a un numero
        
    })

})