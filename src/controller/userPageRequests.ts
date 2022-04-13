import { Request, Response } from 'express';
import User from '../entity/user';
import Post from '../entity/post';
import Like from '../entity/likes';
import _ from 'lodash';
import { getManager } from 'typeorm';
import * as validate from '../validate/postAndComment';
import Follow from '../entity/follow';

// Main function to get user's page
export async function getUserPage(req: Request, res: Response){
    const blackList = ['password', 'follow']
    const AMOUNT = 20;
    try{
        const user = await getManager()
        .getRepository(User)
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.post", "p")
        .leftJoinAndMapOne('user.follow', Follow, 'f',
            `f.follower = '${req['user'].id}' and f.user = user.id`)
        .leftJoinAndMapOne('p.like', Like, 'like',
            `like.user = '${req['user'].id}' and p.id = like.post`)
        .orderBy('p.id','DESC')
        .limit(AMOUNT)
        .where(`user.username = '${req.params.username}'`)
        .loadRelationCountAndMap("user.followers", "user.follow")
        .loadRelationCountAndMap("user.posts", "user.post")
        .loadRelationCountAndMap('p.comments', 'p.comment')
        .loadRelationCountAndMap('p.likes', 'p.like').getMany();   

        if(user) {
            let data = [];
            const isMe = user[0].id == req['user'].id;
            data.push(isMe);
            data.push(user[0].follow || isMe ? true : false);
            data.push(user[0].follow || isMe ? 
                _(user[0]).pickBy((v, k) => !blackList.includes(k)).value()
                :
                _(user[0]).pickBy((v, k) => !blackList.includes(k) && k != "post").value()
                );

            res.status(200).json(data);
        }
        else
            res.status(404).json("could not find any user");
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

// Update the user profile image or theme image
export async function updateUserImage(req: Request, res: Response){
    try{
        await User.update({ id: req['user'].id },{ [req.params.image]: req.body.imgurl });
        res.status(200).send();
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

// Create new post function
export async function addPost(req: Request, res: Response){
    // Validate the data
    const { error } = validate.addPostValidation(req.body);
    if (error)
        return res.status(400).json({error: error.details[0].message});

    try{
        await createPost(req.body, req['user'].id).save();
        res.status(201).send();
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
};

// Add new follower 
export async function addOrDeleteFollower(req: Request, res: Response){
    let follow : Follow;
    try{
        follow = await Follow.findOne({ where: { follower: req['user'].id, user: req.params.userToFollowId }})
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
    
    if(!follow){
        try{
            await createFollower(req['user'].id, req.params.userToFollowId).save();
            res.status(201).send();
        }catch(err) {
            return res.status(500).json({error: err.message});
        }
    } else {
        await Follow.remove(follow);
        res.status(200).send();
    }
};

// Delete one post of user
export async function deletePost(req: Request, res: Response){
    try{
        await Post.delete({id: req.params.postId, user: req['user'].id})
        res.status(200).send();
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
};

// Update the bio
export async function updateBio(req: Request, res: Response){
    const { error } = validate.addBioValidation(req.body);
    if (error)
        return res.status(400).json({error: error.details[0].message});

    try{
        await User.update({ id: req['user'].id },{ bio: req.body.bio });
        res.status(200).send();
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
};

//------------------------------- Create functions -----------------------------------
function createPost (body: Post, id: string){
    const post = new Post;
    post.description = body.description;
    post.url = body.url;
    post.user = id;
    return post;
}

function createFollower(userId: string, followingId: string){
    const follow = new Follow;
    follow.follower = userId;
    follow.user = followingId;
    return follow;
}