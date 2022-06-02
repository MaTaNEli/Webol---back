import { Request, Response } from 'express';
import _ from 'lodash';
import { getManager } from 'typeorm';


const AMOUNT = 20;
export async function signToWebol(req: Request, res: Response){
    try{
        res.status(201).json();
    } catch(err) {
        console.log(err)
        return res.status(500).json({error: err.message});
    }
}