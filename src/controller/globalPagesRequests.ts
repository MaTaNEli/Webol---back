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


const AMOUNT = 20;
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
        .leftJoinAndSelect("c.user", "userComment")
        .where(`post.id = '${req.params.postId}'`)
        .loadRelationCountAndMap("post.comments", "post.comment")
        .loadRelationCountAndMap('post.likes', 'post.like')
        .leftJoinAndMapOne('post.like', Like, 'like',
            `like.user = '${req['user'].id}' and post.id = like.post`)
        .limit(AMOUNT)
        .orderBy('c.id','DESC')
        .limit(AMOUNT).getMany() 
        

        // const data =  await getManager()
        // .getRepository(Comment)
        // .createQueryBuilder("comment")
        // .leftJoinAndSelect("comment.user", "u")
        // .orderBy('comment.id','DESC')
        // .limit(AMOUNT).offset(+req.params.offset)
        // .where(`comment.post = '${req.params.postId}'`)
        // .select('comment.id', 'id')
        // .addSelect('comment.createdAt', 'createdAt')
        // .addSelect('comment.content', 'content')
        // .addSelect('u.fullName', 'fullName')
        // .addSelect('u.username', 'username')
        // .addSelect('u.profileImage', 'profileImage')
        // .execute() 

        
        if(user[0]){
            const result = deeplyFilterUser(user[0]);
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

function deeplyFilterUser(obj: Object) {
    const clonedObj = _.cloneDeep(obj);
    for (let [ key, value ] of Object.entries(clonedObj)) {
        if (key === 'user') {
            clonedObj[key] = filterUser(value);
        }

        else if (_.isObject(value)) {
            clonedObj[key] = deeplyFilterUser(value);
        }

        else if (_.isArray(value)) {
            clonedObj[key] = value.map(deeplyFilterUser);
        }
    }
    return clonedObj;
}