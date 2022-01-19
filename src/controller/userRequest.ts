import { Request, Response } from 'express';
import User from '../entity/user';

export async function postUserImage(req: Request, res: Response){
    try{
        await User.update({ id: req['user'].id },{ [req.params.image]: req.body.imgurl });
        res.status(200).json({message: "Profile image updated successfully"});
    } catch(err) {
        console.log("controller/user request line 39", err);
        res.status(400).json({error: "Profile image did not updated"});
    }
};

export async function getUserPage(req: Request, res: Response){
    try{
        const user = await User.findOne({
            where: [
                {username: req.params.username}
            ],
            select: ['fullName', 'profileImage', 'themeImage', 'role', 'media', 'bio']
        });
        console.log(user);
        if(user)
            res.status(201).json(user);
        else
            res.status(404).send();
    } catch(err) {
        console.log("controller/user request line 40", err);
        res.status(400).json({error: "could not find user"});
    }
};