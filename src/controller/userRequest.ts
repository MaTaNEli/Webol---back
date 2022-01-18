import { Request, Response } from 'express';
import User from '../entity/user';

export async function getUserImage(req: Request, res: Response) {
    let user: { profileImage: string };
    try{
        user = await User.findOne(req['user'].id, { select: [req.params.image] })
    } catch(err) {
        console.log("controller/user request line 7", err);
    }

    if (user){
        res.status(200).json(user);
    } else {
        res.status(400).json({error:"User did not found"});
    }
};

export async function postUserImage(req: Request, res: Response){
    try{
        await User.update({ id: req['user'].id },{ [req.params.image]: req.body.imgurl });
        res.status(200).json({message: "Profile image updated successfully"});
    } catch(err) {
        console.log("controller/user request line 39", err);
        res.status(400).json({error: "Profile image did not updated"});
    }
};
