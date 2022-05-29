import { Request, Response } from 'express';
import User from '../entity/user';
import Post from '../entity/post';
import Like from '../entity/likes';
import _ from 'lodash';
import { getManager } from 'typeorm';
import * as validate from '../validate/postAndComment';
import Follow from '../entity/follow';
import { addNotification } from './topBarRequest';
const AMOUNT = 20;

// Main function to get user's page
export async function getUserPage(req: Request, res: Response){
    try{
        const user = await getManager()
        .getRepository(User)
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.post", "p")
        .leftJoinAndMapOne('user.follow', Follow, 'f',
            `f.follower = '${req['user'].id}' and f.user = user.id`)
        .leftJoinAndMapOne('p.like', Like, 'like',
            `like.user = '${req['user'].id}' and p.id = like.post`)
        .orderBy('p.id','DESC').limit(AMOUNT)
        .where(`user.username = '${req.params.username.toLocaleLowerCase()}'`)
        .loadRelationCountAndMap("user.followers", "user.follow")
        .loadRelationCountAndMap("user.posts", "user.post")
        .loadRelationCountAndMap('p.comments', 'p.comment')
        .loadRelationCountAndMap('p.likes', 'p.like').getMany();   
        
        if(user) {     
            const data = fixData(user, req['user'].id);
            res.status(200).json(data);
        }
        else
            res.status(404).json("Could not find any user");
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

// Main function to get user's page when scrolling down
export async function getMoreUserPost(req: Request, res: Response){
    try{
        const data = await getManager()
        .getRepository(Post)
        .createQueryBuilder("post")
        .leftJoin("post.user", "user", 'user.id = post.userId')
        .leftJoin('user.follow','follow', 'user.id = follow.userId')
        .leftJoinAndMapOne('post.like', Like, 'like',
            `like.user = '${req['user'].id}' and post.id = like.post`)
        .where(`follow.followerId = '${req['user'].id}' AND user.username = '${req.params.username.toLocaleLowerCase()}'`)
        .orWhere(`user.username = '${req.params.username.toLocaleLowerCase()}' AND post.userId = '${req['user'].id}'
                AND user.id = '${req['user'].id}'`)
        .distinct(true)
        .limit(AMOUNT).offset(+req.params.offset)
        .orderBy('post.id','DESC')
        .loadRelationCountAndMap('post.comments', 'post.comment')
        .loadRelationCountAndMap('post.likes', 'post.like').getMany(); 

        res.status(201).send(data);
    }catch(err) {
        return res.status(500).json({error: err.message});
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
        follow = await Follow.findOne({ where: { follower: req['user'].id, user: req.params.userToFollowId }});
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
        res.status(201).send();
    }

    if(!follow){
        const message = `${req['user'].username} is following you`;
        addNotification(message, req.params.userToFollowId, null, req['user'].id);
    }
};

// Delete one post of user
export async function deletePost(req: Request, res: Response){
    try{
        await Post.delete({id: req.params.postId, user: req['user'].id})
        res.status(201).send();
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
};

// Delete one post of user
export async function getFollowers(req: Request, res: Response){
    try{
        const subQ = getManager()
        .createQueryBuilder(User,"user")
        .leftJoinAndSelect(Follow,'f', 'user.id = f.userId')
        .where(`user.username = '${req.params.username.toLocaleLowerCase()}'`)
        .limit(20).offset(+req.params.offset)
        .select('f.follower')

        const result = await getManager()
        .getRepository(User)
        .createQueryBuilder("user")     
        .where("user.id IN (" + subQ.getQuery() + ")")
        .select('user.displayUsername')
        .addSelect('user.profileImage')
        .distinct(true)
        .getMany()
         
        res.status(201).send(result);
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
};

//------------------------------- Create functions -----------------------------------
function fixData(user: User[], id: string){
    fixDate(user);
    const blackList = ['password', 'follow', 'username']
    let data = [];
        const isMe = user[0].id == id;
        data.push(isMe);
        data.push(user[0].follow || isMe ? true : false);
        data.push(user[0].follow || isMe ? 
            _(user[0]).pickBy((v, k) => !blackList.includes(k)).value()
            :
            _(user[0]).pickBy((v, k) => !blackList.includes(k) && k != "post").value()
            );
    return data;
}

function fixDate(data: Array<any>){
    for(let date of data[0].post)
        if(date.createdAt)
            date.createdAt = date.createdAt.toLocaleString()
}

function createPost (body: Post, id: string){
    const post = new Post;
    post.description = body.description;
    post.url = body.url;
    post.category = body.category;
    post.user = id;
    return post;
}

function createFollower(userId: string, followingId: string){
    const follow = new Follow;
    follow.follower = userId;
    follow.user = followingId;
    return follow;
}