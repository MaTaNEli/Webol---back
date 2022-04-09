import dotenv from 'dotenv';
dotenv.config();
import { getConnection } from "typeorm"
import { initStorage } from '../src/storage';
import User from '../src/entity/user';
import { registerRequest } from './utilities/controlFunc';
import { faker } from '@faker-js/faker';

describe("Post to the DB with Register", () =>{
    beforeAll(async() =>{
        try{
            await initStorage();
        }
        catch(e){
            console.log(e);
        };
    });
    
    // afterAll(async () =>{
    //     try{
    //         await getConnection()
    //         .createQueryBuilder()
    //         .delete()
    //         .from(User).execute();
    //     }
    //     catch(e){
    //         console.log(e);
    //     } 
    // });

    test("When username is missing should respond with a status code of 400",async () => {
        const body = {
            username: "",
            password: faker.internet.password(),
            fullName: faker.name.findName(),
            email: faker.internet.email()
        };
        const registerRes = await registerRequest(body)
        expect(registerRes.text).toBe("{\"error\":\"\\\"username\\\" is not allowed to be empty\"}");
        expect(registerRes.statusCode).toBe(400);
    });
    
    test("When password is missing should respond with a status code of 400",async () => {
        const body = {
            username: faker.internet.userName(),
            password: "",
            fullName: faker.name.findName(),
            email: faker.internet.email()
        };
        const registerRes = await registerRequest(body)
        expect(registerRes.text).toBe("{\"error\":\"\\\"password\\\" is not allowed to be empty\"}");
        expect(registerRes.statusCode).toBe(400);
    });

    test("When fullName is missing should respond with a status code of 400",async () => {
        const body = {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            fullName: "",
            email: faker.internet.email()
        };
        const registerRes = await registerRequest(body)
        expect(registerRes.text).toBe("{\"error\":\"\\\"fullName\\\" is not allowed to be empty\"}");
        expect(registerRes.statusCode).toBe(400);
    });

    test("When email is missing should respond with a status code of 400",async () => {
        const body = {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            fullName: faker.name.findName(),
            email: ""
        };
        const registerRes = await registerRequest(body)
        expect(registerRes.text).toBe("{\"error\":\"\\\"email\\\" is not allowed to be empty\"}");
        expect(registerRes.statusCode).toBe(400);
    });

    test("When password is to short should respond with a status code of 400",async () => {
        const body = {
            username: faker.internet.userName(),
            password: "53635",
            fullName: faker.name.findName(),
            email: faker.internet.email()
        };
        const registerRes = await registerRequest(body)
        expect(registerRes.text).toBe("{\"error\":\"\\\"password\\\" length must be at least 8 characters long\"}");
        expect(registerRes.statusCode).toBe(400);
    });

    test("When give correct data should respond with a status code of 200", async () => {
        const body = {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            fullName: faker.name.findName(),
            email: faker.internet.email()
        };
        const registerRes = await registerRequest(body)
        expect(registerRes.statusCode).toBe(200);
        expect(registerRes.text).toBe("{\"message\":\"Sign up successfully\"}");
    });
    
    test("When register with email that is already exist should respond with a status code 400", async () =>{
        const body = {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            fullName: faker.name.findName(),
            email: faker.internet.email()
        };
        const registerRes = await registerRequest(body);
        expect(registerRes.statusCode).toBe(200);
        expect(registerRes.text).toBe("{\"message\":\"Sign up successfully\"}");
        const registerResult = await registerRequest(body)
        expect(registerResult.statusCode).toBe(400);
        expect(registerResult.text).toBe("{\"error\":\"Email is already exist\"}");
    });
});