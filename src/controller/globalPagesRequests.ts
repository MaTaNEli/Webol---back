import { Request, Response } from 'express';
import Comment from '../entity/comment';
import _ from 'lodash';
import * as validate from '../validate/postAndComment';
import Like from '../entity/likes';
import {createDate} from './userPageRequests'
import { getManager } from 'typeorm';


export async function addOrDeleteLike(req: Request, res: Response){
    let like : Like;
    try{
        like = await Like.findOne({ where: { username: req['user'].username, post: req.params.postId }})
    } catch(err) {
        return res.status(500).json({error: err.message});
    }

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
        await Like.remove(like);
        res.status(200).send();
    }
    
};

export async function addComment(req: Request, res: Response){
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

export async function getComments(req: Request, res: Response){
    try{
        const comments = await Comment.find({
            where: {post:req.params.postId},
            take: 10, skip: 0
        });

        if(comments[0])
            res.status(200).json(comments);
        else
            res.status(200).json({message: "No comments"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

export async function deleteComment(req: Request, res: Response){
    let comment : Comment;
    try{
        comment = await Comment.findOne({ where: { id: req.params.commentId, username: req['user'].username }})
        if(comment){
            await Comment.remove(comment);
            res.status(200).send();
        } else
            return res.status(404).json({error: "No such comment"});
        
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
};