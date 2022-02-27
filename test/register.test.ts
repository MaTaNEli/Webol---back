import dotenv from 'dotenv';
dotenv.config();
import { getConnection } from "typeorm"
import request from "supertest";
import app from '../src/server';
import { initStorage } from '../src/storage';
import User from '../src/entity/user';

beforeAll(async() =>{
    try{
        await initStorage();
    }
    catch(e){
        console.log(e);
    } 
})

describe("Post to the DB with Register", () =>{

    // afterEach(async () => {
    //     // await getConnection()
    //     // .createQueryBuilder()
    //     // .delete()
    //     // .from(User)
    //     // Fetch all the entities
    //     const entities = getConnection().entityMetadatas;
    //     for (const entity of entities) {
    //         const repository = getConnection().getRepository(entity.name); // Get repository
    //         await repository.clear(); // Clear each entity table's content
    //     }
    // });

    describe("When username is missing", () =>{
        test("should respond with a status code of 400",async () => {
            const body = {username: "", password: "password1", fullName: "benny", email: "adam@gmail.com"};
            const res = await request(app).post("/register").send(body);
            expect(res.text).toBe("{\"error\":\"\\\"username\\\" is not allowed to be empty\"}");
            expect(res.statusCode).toBe(400);
        });
    });

    describe("When password is missing", () =>{
        test("should respond with a status code of 400",async () => {
            const body = {username: "adamB", password: "", fullName: "benny", email: "adam@gmail.com"};
            const res = await request(app).post("/register").send(body);
            expect(res.text).toBe("{\"error\":\"\\\"password\\\" is not allowed to be empty\"}");
            expect(res.statusCode).toBe(400);
        });
    });

    describe("When fullName is missing", () =>{
        test("should respond with a status code of 400",async () => {
            const body = {username: "adamB", password: "45736356566", fullName: "", email: "adam@gmail.com"};
            const res = await request(app).post("/register").send(body);
            expect(res.text).toBe("{\"error\":\"\\\"fullName\\\" is not allowed to be empty\"}");
            expect(res.statusCode).toBe(400);
        });
    });

    describe("When email is missing", () =>{
        test("should respond with a status code of 400",async () => {
            const body = {username: "adamB", password: "45736356566", fullName: "adam", email: ""};
            const res = await request(app).post("/register").send(body);
            expect(res.text).toBe("{\"error\":\"\\\"email\\\" is not allowed to be empty\"}");
            expect(res.statusCode).toBe(400);
        });
    });

    describe("When password is to short", () =>{
        test("should respond with a status code of 400",async () => {
            const body = {username: "adamB", password: "45736", fullName: "adam", email: "adam@gmail.com"}
            const res = await request(app).post("/register").send(body);
            expect(res.text).toBe("{\"error\":\"\\\"password\\\" length must be at least 8 characters long\"}");
            expect(res.statusCode).toBe(400);
        });
    });

    describe("When give correct data to the application", () =>{
        test("should respond with a status code of 200", async () => {
            const bodyData = [
                {username: "adam", password: "12345678", fullName: "adam", email: "adam@gmail.com"},
                {username: "adam1", password: "123456789", fullName: "adam", email: "adam1@gmail.com"},
                {username: "adam2", password: "123456789", fullName: "adam", email: "adam2@gmail.com"},
            ];

            for (const body of bodyData) {
                const res = await request(app).post("/register").send(body);
                expect(res.statusCode).toBe(200);
            };
        });
    });
    
    describe("When register with email that is already exist", () =>{
        test("should respond with a status code of 400", async () => {
            const body = {username: "adam", password: "12345678", fullName: "adam", email: "adam@gmail.com"};
            const res = await request(app).post("/register").send(body);
            expect(res.statusCode).toBe(400);
            expect(res.text).toBe("{\"error\":\"Email is already exist\"}");
        });
    });

    describe("When register with username that is already exist", () =>{
        test("should respond with a status code of 400", async () => {
            const body = {username: "adam", password: "12345678", fullName: "adam", email: "adam5@gmail.com"};
            const res = await request(app).post("/register").send(body);
            expect(res.statusCode).toBe(400);
            expect(res.text).toBe("{\"error\":\"Username is already exist\"}");
        });
    });

    describe("When register with google", () =>{
        test("should respond with a status code of 200", async () => {
            const body = {name: "adam", email: "adam54@gmail.com"};
            const res = await request(app).post("/googlelogin").send(body);
            expect(res.statusCode).toBe(200);
        });
    });
});

afterAll(async () =>{
    console.log("the after all value")
    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(User).execute()
    await getConnection().close();
})