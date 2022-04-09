import dotenv from 'dotenv';
dotenv.config();
import { getConnection } from "typeorm"
import { initStorage } from '../src/storage';
import User from '../src/entity/user';
import { resetPasswordRequest, registerRequest, loginRequest} from './utilities/controlFunc'
import { faker } from '@faker-js/faker'

describe("Post to the DB with login", () =>{
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

    test("When email is not valid should respond with a status code 400",async () => {
        const body = {
            email: faker.internet.userName()
        }
        const loginRes = await resetPasswordRequest(body);
        expect(loginRes.text).toBe("{\"error\":\"Email is not valid\"}");
        expect(loginRes.statusCode).toBe(400);
    });

    test("When email is valid but not found respond with a status code 400",async () => {
        const body = {
            email: faker.internet.email()
        }
        const loginRes = await resetPasswordRequest(body);
        expect(loginRes.text).toBe("{\"error\":\"User did not found\"}" );
        expect(loginRes.statusCode).toBe(400);
    });

    test("When email valid and found respond with a status code 200 only send", async () => {
        const body = {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            fullName: faker.name.findName(),
            email: faker.internet.email()
        };
        const registerRes = await registerRequest(body);
        expect(registerRes.statusCode).toBe(200);
        expect(registerRes.text).toBe("{\"message\":\"Sign up successfully\"}");
        const user = {
            email: body.email
        }
        const loginRes = await resetPasswordRequest(user);
        expect(loginRes.text).toBe("{\"message\":\"Email send\"}");
        expect(loginRes.statusCode).toBe(200);
    });
});