import request from "supertest";
import app from '../../src/server';
import { UserInput } from "../../src/types";

export async function loginRequest (body: Pick<UserInput, 'username' | 'password'>){
    return await request(app).post("/login").send(body);
};

export async function registerRequest (body: UserInput){
    return await request(app).post("/register").send(body);
};

export async function googleRequest (body: {name: string, email: string}){
    return await request(app).post("/googlelogin").send(body);
};

export async function resetPasswordRequest (body: {email: string}){
    return await request(app).post("/resetpass").send(body);
};

export async function addPostRequest (body: {description: string, url: string}, token: string){
    if(token)
        return await  request(app).post("/user/addpost").set('auth_token', token).send(body);
    else 
        return await request(app).post("/user/addpost").send(body);
};

export async function getUserRequest (token: string, username: string){
    if(token)
        return await  request(app).get(`/user/${username}`).set('auth_token', token).send();
    else 
        return await request(app).get(`/user/${username}`).send();
};
