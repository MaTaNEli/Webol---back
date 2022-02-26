import dotenv from 'dotenv';
dotenv.config();
import request from "supertest";
import app from '../src/server';
import { initStorage } from '../src/storage';

beforeAll(async() =>{
    try{
        await initStorage();
    }
    catch(e){
        console.log(e);
    } 
})

describe("Post to the DB with Sign up", () =>{
    test("Give correct data to the application", async () => {
        const bodyData = [
            {username: "username11", password: "password1", fullName: "benny", email: "bennyyyy@gmail.com"},
            {username: "username12", password: "password2", fullName: "benny", email: "bennyyyyy@gmail.com"},
            {username: "username31", password: "password3", fullName: "benny", email: "bennyyyyyyy@gmail.com"},
        ];

        for (const body of bodyData) {
            const res = await request(app).post("/register").send(body)
            expect(res.statusCode).toBe(200)
            //expect(res.body).toBe({message: "Sign up successfully"})
        }
    })
})