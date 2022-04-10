import dotenv from 'dotenv';
dotenv.config();
import { getConnection } from "typeorm"
import { initStorage } from '../src/storage';
import User from '../src/entity/user';
import { googleRequest, loginRequest, registerRequest} from './utilities/apiFunctions'
import { faker } from '@faker-js/faker'
import { createFullUserDetails } from './utilities/utilitiesFunctions'

describe("Login functions", () =>{
    beforeAll(async() =>{
        try{
            await initStorage();
        }
        catch(e){
            console.log(e);
        } 
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
            password: faker.internet.password()
        };
        const loginRes = await loginRequest(body);
        expect(loginRes.text).toBe("{\"error\":\"Email or Password are incorrect\"}");
        expect(loginRes.statusCode).toBe(400);
    });

    // test("When password is missing should respond with a status code of 400",async () => {
    //     const body = {
    //         username: faker.internet.userName(),
    //         password: ""
    //     };
    //     const loginRes = await loginRequest(body);
    //     expect(loginRes.text).toBe("{\"error\":\"Email or Password are incorrect\"}");
    //     expect(loginRes.statusCode).toBe(400);
    // });

    // test("When login but give wrong password should respond with a status code of 401", async () => {
    //     const body = createFullUserDetails();
    //     const registerRes = await registerRequest(body)
    //     expect(registerRes.statusCode).toBe(200);
    //     const user = {
    //         username: body.username,
    //         password: faker.internet.password()
    //     };
    //     const loginRes = await loginRequest(user);
    //     expect(loginRes.text).toBe("{\"error\":\"Email or Password are incorrect\"}");
    //     expect(loginRes.statusCode).toBe(401);
    // });

    // test("When login but give wrong username should respond with a status code of 401", async () => {
    //     const body = createFullUserDetails();
    //     const registerRes = await registerRequest(body)
    //     expect(registerRes.statusCode).toBe(200);
    //     const user = {
    //         username: faker.internet.userName(),
    //         password: body.password
    //     };

    //     const loginRes = await loginRequest(user);
    //     expect(loginRes.text).toBe("{\"error\":\"Email or Password are incorrect\"}");
    //     expect(loginRes.statusCode).toBe(401);
    // });
    
    // test("When login should respond with a status code of 200", async () => {
    //     const body = createFullUserDetails();
    //     const registerRes = await registerRequest(body)
    //     expect(registerRes.statusCode).toBe(200);
        
    //     const user = {
    //         username: body.username,
    //         password: body.password
    //     };
    //     const loginRes = await loginRequest(user)
    //     expect(loginRes.statusCode).toBe(200)
    // });

    // test("When login with google should respond with a status code of 200", async () => {
    //     const body = {
    //         name: faker.internet.userName(),
    //         email: faker.internet.email()
    //     };
        
    //     const res = await googleRequest(body)
    //     expect(res.statusCode).toBe(200)
    // });
});