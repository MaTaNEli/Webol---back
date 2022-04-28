import dotenv from 'dotenv';
dotenv.config();
import { getConnection } from "typeorm"
import User from '../src/entity/user';
import { initStorage } from '../src/storage';
import { loginRequest, registerRequest, getUserRequest } from './utilities/apiFunctions';
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

    test("When get try to get user page buy bot connected statuse code sould be 401", async () => {
        const body = createFullUserDetails();
        const registerRes = await registerRequest(body)
        expect(registerRes.statusCode).toBe(200);
        
        const result = await getUserRequest(null, body.username); 
        expect(result.statusCode).toBe(401);
    });

    test("When get try to get my page and connect expect status code to be 200", async () => {
        const body = createFullUserDetails();
        const registerRes = await registerRequest(body)
        expect(registerRes.statusCode).toBe(200);
        
        const user = {
            username: body.username,
            password: body.password
        };
        const loginRes = await loginRequest(user)
        expect(loginRes.statusCode).toBe(200)

        const result = await getUserRequest(loginRes.body['UserInfo'].auth_token, body.username);
        expect(result.statusCode).toBe(200);
        expect(result.body[0]).toBe(true);
        expect(result.body[1]).toBe(true);
    });
    
    test("When get try to get someone page and connect buy not following after", async () => {
        const body = createFullUserDetails();
        const registerRes = await registerRequest(body)
        expect(registerRes.statusCode).toBe(200);
        
        const otherBody = createFullUserDetails();
        const otherRegisterRes = await registerRequest(otherBody)
        expect(otherRegisterRes.statusCode).toBe(200);

        const user = {
            username: body.username,
            password: body.password
        };
        const loginRes = await loginRequest(user)
        expect(loginRes.statusCode).toBe(200)

        const result = await getUserRequest(loginRes.body['UserInfo'].auth_token, otherBody.username);
        expect(result.statusCode).toBe(200);
        expect(result.body[0]).toBe(false);
        expect(result.body[1]).toBe(false);
    });


    // test("When get try to get someone page and connect and following after", async () => {
    //     const body = createFullUserDetails();
    //     const registerRes = await registerRequest(body)
    //     expect(registerRes.statusCode).toBe(200);
        
    //     const otherBody = createFullUserDetails();
    //     const otherRegisterRes = await registerRequest(otherBody)
    //     expect(otherRegisterRes.statusCode).toBe(200);

    //     const user = {
    //         username: body.username,
    //         password: body.password
    //     };
    //     const loginRes = await loginRequest(user)
    //     expect(loginRes.statusCode).toBe(200)

    //     const result = await getUserRequest(loginRes.body['UserInfo'].auth_token, otherBody.username);
    //     expect(result.statusCode).toBe(200);
    //     expect(result.body[0]).toBe(false);
    //     expect(result.body[1]).toBe(false);

    //     // write to add follow function and call get getUserRequest again
    // });
});