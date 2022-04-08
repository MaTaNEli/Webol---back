import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../entity/user';
import { getManager } from 'typeorm';
import Follow from '../entity/follow';


export function admin(req: Request, res: Response, next: NextFunction) {
    const token = req.header('auth_token');
    if (!token) return res.status(401).json({error: 'Access Denide'});

    try{
        req['user'] = jwt.verify(token, process.env.TOKEN_SECRET);
        if(req['user'].username == req.params.username)
            next();
        else
            res.status(401).json({error: 'Access Denide'});

    } catch (err) {
        res.status(401).json({error: 'Access Denide'});
    }
}

export async function connect(req: Request, res: Response, next: NextFunction) {
    const token = req.header('auth_token');
    if (!token){
        return res.status(401).json({error: 'Access Denide'});
    };

    try{
        req['user'] = jwt.verify(token, process.env.TOKEN_SECRET);
        if(req['user'])
            next();
        else
            res.status(401).json({error: 'Access Denide'});

    } catch (err) {
        res.status(401).json({error: 'Access Denide'});
    }
}

export async function connectAndGetUser(req: Request, res: Response, next: NextFunction) {
    const token = req.header('auth_token');
    if (!token){
        return res.status(401).json({error: 'Access Denide'});
    };

    try{
        req['user'] = jwt.verify(token, process.env.TOKEN_SECRET);
        
        if(req['user']){
            try{
                const user = await User.findOne({
                    where: { username: req.params.username},
                    select: ['id']
                });
                // chance for user be undefined------------------------------------------
                req['userNameId'] = user.id;
                next();

            }catch (err){
                return res.status(500).json({error: err.message});
            }
            
        }
        else
            res.status(401).json({error: 'Access Denide'});

    } catch (err) {
        res.status(401).json({error: 'Access Denide'});
    }
}

export async function resetPassToken(req: Request, res: Response, next: NextFunction) {
    console.log
    const token = req.header('mail_token');
    if (!token){
        return res.status(401).json({error: "Access Denied"});
    } 
    let user: User;

    try{
        user = await User.findOne(req.body.id);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }

    console.log(user, "the user from verify line 74");
    if (user){
        const newSecret = process.env.TOKEN_SECRET + user.password;
        try{
            const userInfo = jwt.verify(token, newSecret);
            if(userInfo){
                req['user'] = userInfo;
                next();
            }
            else{
                return res.status(401).json({error: 'This link was expired'});
            }
        }
        catch {
            return res.status(401).json({error: 'This link was expired'});
        } 
    } else {
        res.status(200).json({error: 'Could not find the user'});
    };
};