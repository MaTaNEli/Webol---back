import { Request, Response } from 'express';
import Comment from '../entity/comment';
import _ from 'lodash';
import * as validate from '../validate/postAndComment';
import Like from '../entity/likes';
import {createDate} from './userPageRequests'


export async function addOrDeleteLike(req: Request, res: Response){
    
    const like = await Like.findOne({ where: { username: req['user'].username, post: req.params.postId }})
    
    if(!like){
        try{
            const like = new Like
            like.username = req['user'].username;
            like.post = req.params.postId;
            await like.save();
            res.status(201).send();
        }catch(err) {
            return res.status(500).json({error: err.message});
        }
    }else{
        await Like.delete(like);
        res.status(200).send();
    }
    
};


export async function addCommands(req: Request, res: Response){
    // Validate the data
    const { error } = validate.addCommentValidation(req.body);
    if (error){
        return res.status(400).json({error: error.details[0].message});
    }

    const command = new Comment;
    command.createdAt = createDate();;
    command.content = req.body.content;
    command.post = req.body.postId;
    command.username = req['user'].username;
    
    try{
        await command.save();
        res.status(201).send();
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
};