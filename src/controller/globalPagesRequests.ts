import { Request, Response } from 'express';
import Comment from '../entity/comment';
import _ from 'lodash';
import * as validate from '../validate/postAndComment';
import Likes from '../entity/likes';
import { getManager } from 'typeorm';
import { CommentInput } from '../types'
import Post from '../entity/post';
import Like from '../entity/likes';
import User from '../entity/user';
import Follow from '../entity/follow';


const AMOUNT = 20;
export async function getHomePage(req: Request, res: Response){
    try{
        const user = await getManager()
        .createQueryBuilder(User, "user")        
        .leftJoin(Follow, 'f', 'user.id = f.followerId')
        .select('user.username', 'username')
        .leftJoinAndMapMany('f.posts', Post, 'post', `post.user = f.userId`)
        .leftJoinAndMapOne('post.users', User, 'u', `post.user = u.id`)
        .loadRelationCountAndMap('post.comment', 'post.comment')
        .where(`user.id = '${req['user'].id}'`)
        .orderBy('post.id','DESC')
        .execute();

        const temp = await getManager()
        .createQueryBuilder(User,"user")
        .leftJoinAndSelect(Follow, 'f', 'user.id = f.followerId')
        .select('f.userId')
        .where(`user.id = '${req['user'].id}'`);

        const t = await getManager()
        .getRepository(Post)
        .createQueryBuilder("post")     
        .leftJoinAndSelect("post.user", "u")
        .where("post.user IN (" + temp.getQuery() + ")")
        .leftJoinAndMapOne('post.like', Like, 'like',
            `like.user = '${req['user'].id}' and post.id = like.post`)
        .loadRelationCountAndMap("u.posts", "u.post")
        .loadRelationCountAndMap('post.comments', 'post.comment')
        .loadRelationCountAndMap('post.likes', 'post.like')
        //.setParameters(temp.getParameters())
        .orderBy('post.id','DESC')
        .limit(AMOUNT)
        .offset(null)
        .getMany()


        if(user)
            res.status(200).json(t);
        else
            res.status(200).send();

    } catch(err){
        return res.status(500).json({error: err.message});
    }
};

export async function addOrDeleteLike(req: Request, res: Response){
    let like : Likes;
    try{
        like = await Likes.findOne({ where: { user: req['user'].id, post: req.params.postId }})
    } catch(err) {
        return res.status(500).json({error: err.message});
    }

    if(!like){
        try{
            const like = new Likes
            like.user = req['user'].id;
            like.post = req.params.postId;
            await like.save();
            res.status(201).send();
        }catch(err) {
            return res.status(500).json({error: err.message});
        }
    }else{
        await Likes.remove(like);
        res.status(200).send();
    } 
};

export async function addComment(req: Request, res: Response){
    // Validate the data
    const { error } = validate.addCommentValidation(req.body);
    if (error)
        return res.status(400).json({error: error.details[0].message});

    try{
        await createComment(req.body, req['user'].id).save()
        res.status(201).send();
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
};

export async function getComments(req: Request, res: Response){
    try{
        const user = await getManager()
        .getRepository(Post)
        .createQueryBuilder("post")
        .leftJoinAndSelect("post.user", "u")
        .leftJoinAndSelect("post.comment", "c")
        .where(`post.id = '${req.params.postId}'`)
        .leftJoinAndMapOne('c.user', User, 'user',
            `c.user = user.id`)
        .leftJoinAndMapOne('post.like', Like, 'like',
            `like.user = '${req['user'].id}' and post.id = like.post`)
        .orderBy('c.id','DESC')
        .loadRelationCountAndMap("post.comments", "post.comment")
        .loadRelationCountAndMap('post.likes', 'post.like')
        .limit(AMOUNT).getMany() 
        
        if(user[0]){
            const result = deeplyFilterUser(user[0], req['user'].username);
            res.status(200).json(result);
        }  
        else
            res.status(200).send();
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

export async function getLikes(req: Request, res: Response){
    try{
        const data =  await getManager()
        .getRepository(Likes)
        .createQueryBuilder("likes")
        .leftJoinAndSelect("likes.user", "u")
        .orderBy('likes.id','DESC')
        .limit(AMOUNT).offset(+req.params.offset)
        .where(`likes.post = '${req.params.postId}'`)
        .select('u.username', 'username')
        .addSelect('u.profileImage', 'profileImage')
        .execute()   

        if(data[0])
            res.status(200).json(data);
        else
            res.status(200).send();
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

export async function deleteComment(req: Request, res: Response){
    try{
        await Comment.delete({id: req.params.commentId, user: req['user'].id})
        res.status(200).send();
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
};

//------------------------------- Create functions -----------------------------------
function createComment (body: CommentInput, id: string){
    const comment = new Comment;
    comment.content = body.content;
    comment.post = body.postId;
    comment.user = id;
    return comment;
}

function filterUser(user: User) {
    return _.pick(user, ['id', 'username', 'profileImage']);
}

function filterisMe(user: string, name:string) {
    return user === name? true : false;
}

function deeplyFilterUser(obj: Object, username: string) {
    const clonedObj = _.cloneDeep(obj);
    for (let [ key, value ] of Object.entries(clonedObj)) {
        if (key === 'user'){
            clonedObj[key] = filterUser(value);
            clonedObj['isMe'] = filterisMe(value.username, username)
        }

        else if (_.isObject(value)) 
            clonedObj[key] = deeplyFilterUser(value, username);

        else if (_.isArray(value)) 
            clonedObj[key] = value.map(v => deeplyFilterUser(v, username));
    }
    return clonedObj;
}