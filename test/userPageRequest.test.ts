import dotenv from 'dotenv';
dotenv.config();
import { getConnection } from "typeorm"
import User from '../src/entity/user';
import { initStorage } from '../src/storage';
import { loginRequest, registerRequest, addPostRequest } from './utilities/apiFunctions';
import { createFullUserDetails } from './utilities/utilitiesFunctions';


const post = {
	description: "superman",
	url: "some url.com"
};

describe("User page request functions", () =>{
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

    test("When post not connected respond with a status code of 401", async () => {
        const result = await addPostRequest(post, null);
        expect(result.statusCode).toBe(401);
        expect(result.text).toBe("{\"error\":\"Access Denide\"}" );
    });

    test("When post, respond with a status code of 201", async () => {
        const body = createFullUserDetails();
        const registerRes = await registerRequest(body)
        expect(registerRes.statusCode).toBe(200);
        
        const user = {
            username: body.username,
            password: body.password
        };
        const loginRes = await loginRequest(user)
        expect(loginRes.statusCode).toBe(200)

        const result = await addPostRequest(post, loginRes.body['UserInfo'].auth_token);
        expect(result.statusCode).toBe(201);
    });
    
    test("When post with content null in the post, respond with a status code of 400", async () => {
        const body = createFullUserDetails();
        const registerRes = await registerRequest(body)
        expect(registerRes.statusCode).toBe(200);
        
        const user = {
            username: body.username,
            password: body.password
        };
        const loginRes = await loginRequest(user)
        expect(loginRes.statusCode).toBe(200)

        post.description = null;
        const result = await addPostRequest(post, loginRes.body['UserInfo'].auth_token);
        expect(result.statusCode).toBe(400);
        expect(result.text).toBe("{\"error\":\"\\\"description\\\" must be a string\"}");
    });

    test("When post with content empty in the post, respond with a status code of 400", async () => {
        const body = createFullUserDetails();
        const registerRes = await registerRequest(body)
        expect(registerRes.statusCode).toBe(200);
        
        const user = {
            username: body.username,
            password: body.password
        };
        const loginRes = await loginRequest(user)
        expect(loginRes.statusCode).toBe(200)

        post.description = "";
        const result = await addPostRequest(post, loginRes.body['UserInfo'].auth_token);
        expect(result.statusCode).toBe(400);
        expect(result.text).toBe("{\"error\":\"\\\"description\\\" is not allowed to be empty\"}");
    });

    
    
    // test("When password is missing should respond with a status code of 400",async () => {
    //     const body = {
    //         username: faker.internet.userName(),
    //         password: "",
    //         fullName: faker.name.findName(),
    //         email: faker.internet.email()
    //     };
    //     const registerRes = await registerRequest(body)
    //     expect(registerRes.text).toBe("{\"error\":\"\\\"password\\\" is not allowed to be empty\"}");
    //     expect(registerRes.statusCode).toBe(400);
    // });

    // test("When fullName is missing should respond with a status code of 400",async () => {
    //     const body = {
    //         username: faker.internet.userName(),
    //         password: faker.internet.password(),
    //         fullName: "",
    //         email: faker.internet.email()
    //     };
    //     const registerRes = await registerRequest(body)
    //     expect(registerRes.text).toBe("{\"error\":\"\\\"fullName\\\" is not allowed to be empty\"}");
    //     expect(registerRes.statusCode).toBe(400);
    // });

    // test("When email is missing should respond with a status code of 400",async () => {
    //     const body = {
    //         username: faker.internet.userName(),
    //         password: faker.internet.password(),
    //         fullName: faker.name.findName(),
    //         email: ""
    //     };
    //     const registerRes = await registerRequest(body)
    //     expect(registerRes.text).toBe("{\"error\":\"\\\"email\\\" is not allowed to be empty\"}");
    //     expect(registerRes.statusCode).toBe(400);
    // });

    // test("When password is to short should respond with a status code of 400",async () => {
    //     const body = {
    //         username: faker.internet.userName(),
    //         password: "53635",
    //         fullName: faker.name.findName(),
    //         email: faker.internet.email()
    //     };
    //     const registerRes = await registerRequest(body)
    //     expect(registerRes.text).toBe("{\"error\":\"\\\"password\\\" length must be at least 8 characters long\"}");
    //     expect(registerRes.statusCode).toBe(400);
    // });

    // test("When give correct data should respond with a status code of 200", async () => {
    //     const body = {
    //         username: faker.internet.userName(),
    //         password: faker.internet.password(),
    //         fullName: faker.name.findName(),
    //         email: faker.internet.email()
    //     };
    //     const registerRes = await registerRequest(body)
    //     expect(registerRes.statusCode).toBe(200);
    //     expect(registerRes.text).toBe("{\"message\":\"Sign up successfully\"}");
    // });
    
    // test("When register with email that is already exist should respond with a status code 400", async () =>{
    //     const body = {
    //         username: faker.internet.userName(),
    //         password: faker.internet.password(),
    //         fullName: faker.name.findName(),
    //         email: faker.internet.email()
    //     };
    //     const registerRes = await registerRequest(body);
    //     expect(registerRes.statusCode).toBe(200);
    //     expect(registerRes.text).toBe("{\"message\":\"Sign up successfully\"}");
    //     const registerResult = await registerRequest(body)
    //     expect(registerResult.statusCode).toBe(400);
    //     expect(registerResult.text).toBe("{\"error\":\"Email is already exist\"}");
    // });
});