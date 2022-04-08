import { Request, Response } from 'express';
import User from '../entity/user';
import Post from '../entity/post';
import Like from '../entity/likes';
import _ from 'lodash';
import { getManager } from 'typeorm';
import * as validate from '../validate/postAndComment';
import Follow from '../entity/follow';
import { pseudoRandomBytes } from 'crypto';

export async function updateUserImage(req: Request, res: Response){
    try{
        await User.update({ id: req['user'].id },{ [req.params.image]: req.body.imgurl });
        res.status(200).json({message: "Image updated successfully"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};


export async function getUserPage(req: Request, res: Response){
    const AMOUNT = 20;
    try{
        const user = await getManager()
        .getRepository(User)
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.post", "p")
        .leftJoinAndMapOne('p.like', Like, 'like',
            `like.username = '${req['user'].username}' and p.id = like.post`)
        .limit(AMOUNT).offset()
        .where(`user.username = '${req.params.username}'`)
        .loadRelationCountAndMap("user.follow", "user.follow")
        .loadRelationCountAndMap('p.comments', 'p.comment')
        .loadRelationCountAndMap('p.likes', 'p.like').getMany();   
        
        const follows = await Follow.findOne({
            where: { follower: req['user'].id, followesAfter: user[0].id }  
        });

        if(user)
        {
            let data = [];
            const isMe = user[0].id == req['user'].id;
            data.push(isMe);
            data.push(follows || isMe ? true : false);
            data.push(follows || isMe ? 
                _(user[0]).pickBy((v, k) => k != "password").value()
                :
                _(user[0]).pickBy((v, k) => k != "password" && k != "post").value()
                );

            res.status(201).json(data);
        }
        else
            res.status(404).json("could not find any user");
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

export async function addPost(req: Request, res: Response){
    // Validate the data
    const { error } = validate.addPostValidation(req.body);
    if (error){
        return res.status(400).json({error: error.details[0].message});
    }

    try{
        const post = createPost(req.body, req['user'].id)
        await post.save();
        res.status(201).send();
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
};

export async function addFollower(req: Request, res: Response){
    try{
        const follow = createFollower(req['user'].id, req['userNameId']);
        await follow.save();
        res.status(201).send();
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
};

export async function deletePost(req: Request, res: Response){
    try{
        const post = await Post.delete({id: req.params.postId, user: req['user'].id})
        res.status(200).send();
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
};

//------------------------------- CREATE FUNCTIONS -----------------------------------

export function createDate(){
    const today = new Date();
    return (today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate());
}

function createPost (body: Post, id: User){
    const post = new Post;
    post.createdAt = createDate();
    post.description = body.description;
    post.url = body.url;
    post.user = id;
    return post;
}

function createFollower(userId: string, followingId: string){
    const follow = new Follow;
    follow.follower = userId;
    follow.followesAfter = followingId;
    follow.user = followingId;
    return follow;
}