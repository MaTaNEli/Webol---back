import { Request, Response } from 'express';
import User from '../entity/user';
import Post from '../entity/post';

export async function postUserImage(req: Request, res: Response){
    try{
        await User.update({ id: req['user'].id },{ [req.params.image]: req.body.imgurl });
        res.status(200).json({message: "Image updated successfully"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

export async function getUserPage(req: Request, res: Response){
    try{
        const user = await User.find({relations:["post"],
            where: [
                {username: req.params.username}
            ],
            select: ['fullName', 'profileImage', 'themeImage', 'role', 'media', 'bio', 'post']
        });

        if(user)
            res.status(201).json(user);
        else
            res.status(404).json("could not find any user");
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

export async function addPost(req: Request, res: Response){
    const today = new Date();
    const date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
    const post = new Post;
    post.createdAt = date;
    post.description = req.body.description;// should do some validation on data
    post.url = req.body.url;
    post.user = req['user'].id;
    await post.save();
    res.status(200).send();
};