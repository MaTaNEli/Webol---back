import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../entity/user';

// Middleware to check if the user is connected
export async function connect(req: Request, res: Response, next: NextFunction) {
    const token = req.header('auth_token');
    if (!token) return res.status(401).json({error: 'Access Denide'});
    
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

// Middleware for new password, special link with special token to decrypt
export async function resetPassToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('mail_token');
    if (!token) return res.status(401).json({error: "Access Denied"});
    
    let user: User;
    try{
        user = await User.findOne({where: {id: req.body.id}, select : ['password']});
    } catch(err) {
        return res.status(500).json({error: err.message});
    }

    if (user){
        const newSecret = process.env.TOKEN_SECRET + user.password;
        try{
            const userInfo = jwt.verify(token, newSecret);
            if(userInfo){
                req['user'] = userInfo;
                next();
            }
            else
                return res.status(401).json({error: 'This link was expired'});
        }
        catch {
            return res.status(401).json({error: 'This link was expired'});
        } 
    } else {
        res.status(500).json({error: 'Could not find the user'});
    };
};