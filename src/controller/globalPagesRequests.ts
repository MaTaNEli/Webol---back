import { Request, Response } from 'express';
import User from '../entity/user';
import Post from '../entity/post';
import Comment from '../entity/comment';
import _ from 'lodash';
import { getManager, RelationId } from 'typeorm';
import * as validate from '../validate/postAndComment';
import Like from '../entity/likes';


export async function addOrDeleteLike(req: Request, res: Response){
    
    const like = await Like.findOne({ where: { username: req['user'].username, post: req.params.postId }})
    
    if(!like){
        try{
            const like = new Like
            like.username = req['user'].username;
            like.post = req.params.postId;
            await like.save();
            res.status(200).send();
        }catch(err) {
            return res.status(500).json({error: err.message});
        }
    }else{
        await Like.delete(like);
        res.status(200).send();
    }
    
};