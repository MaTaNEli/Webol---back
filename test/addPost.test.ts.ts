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

describe("User page request - add post functions", () =>{
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

    // test("When post, respond with a status code of 201", async () => {
    //     const body = createFullUserDetails();
    //     const registerRes = await registerRequest(body)
    //     expect(registerRes.statusCode).toBe(200);
        
    //     const user = {
    //         username: body.username,
    //         password: body.password
    //     };
    //     const loginRes = await loginRequest(user)
    //     expect(loginRes.statusCode).toBe(200)

    //     const result = await addPostRequest(post, loginRes.body['UserInfo'].auth_token);
    //     expect(result.statusCode).toBe(201);
    // });
    
    // test("When post with content null in the post, respond with a status code of 400", async () => {
    //     const body = createFullUserDetails();
    //     const registerRes = await registerRequest(body)
    //     expect(registerRes.statusCode).toBe(200);
        
    //     const user = {
    //         username: body.username,
    //         password: body.password
    //     };
    //     const loginRes = await loginRequest(user)
    //     expect(loginRes.statusCode).toBe(200)

    //     post.description = null;
    //     const result = await addPostRequest(post, loginRes.body['UserInfo'].auth_token);
    //     expect(result.statusCode).toBe(400);
    //     expect(result.text).toBe("{\"error\":\"\\\"description\\\" must be a string\"}");
    // });

    // test("When post with content empty in the post, respond with a status code of 400", async () => {
    //     const body = createFullUserDetails();
    //     const registerRes = await registerRequest(body)
    //     expect(registerRes.statusCode).toBe(200);
        
    //     const user = {
    //         username: body.username,
    //         password: body.password
    //     };
    //     const loginRes = await loginRequest(user)
    //     expect(loginRes.statusCode).toBe(200)

    //     post.description = "";
    //     const result = await addPostRequest(post, loginRes.body['UserInfo'].auth_token);
    //     expect(result.statusCode).toBe(400);
    //     expect(result.text).toBe("{\"error\":\"\\\"description\\\" is not allowed to be empty\"}");
    // });

});