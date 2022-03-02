import request from "supertest";
import app from '../../src/server';
import { UserInput } from "../../src/types";

export async function loginRequest (body: Pick<UserInput, 'username' | 'password'>){
    const res = await request(app).post("/login").send(body);
    return res;
};

export async function registerRequest (body: UserInput){
    const res = await request(app).post("/register").send(body);
    return res;
};

export async function googleRequest (body: {name: string, email: string}){
    const res = await request(app).post("/googlelogin").send(body);
    return res;
};

export async function resetPasswordRequest (body: {email: string}){
    const res = await request(app).post("/resetpass").send(body);
    return res;
};