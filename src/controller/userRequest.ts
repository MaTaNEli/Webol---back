import { Request, Response } from 'express';
import User from '../entity/user';
import Post from '../entity/post';
import Comment from '../entity/comment';
import _ from 'lodash';
import { getManager } from 'typeorm';
import * as validate from '../validate/postAndComment';

export async function postUserImage(req: Request, res: Response){
    try{
        await User.update({ id: req['user'].id },{ [req.params.image]: req.body.imgurl });
        res.status(200).json({message: "Image updated successfully"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

const blacklistFields = ['password', 'id']

export async function getUserPage(req: Request, res: Response){
    const information = {};
    try{
        const data = await getManager()
        .createQueryBuilder(User, 'u')
        .select('u', '*')
        .addSelect('p' , '*')
        .addSelect('c', '*')
        .leftJoin(Post, 'p', 'u.id = p."userId"')
        .leftJoin(Comment, 'c', 'p.id = c."postId"')
        .where(`u.id = '${req['user'].id}'`)
        .execute();
        
        const groupedPosts = _.groupBy(data,'p_id');
        const postsResult = Object.entries(groupedPosts).map(([postId, comments]) => ({ 
            ..._(comments[0])
                .pickBy((value, key) => key.startsWith('p_'))
                .mapKeys((value ,key) => key.slice(2))
                .value(),
            comments: comments.map(c => 
                _(c)
                .pickBy((value, key) => key.startsWith('c_'))
                .mapKeys((value, key) => key.slice(2))
                .value())
                .filter(c => c.id)
        }))

        if(postsResult)
            res.status(201).json({
                user: _(data[0])
                    .pickBy(( v, k) => k.startsWith('u_'))
                    .mapKeys((v, k) => k.slice(2))
                    .pickBy((v, k) => !blacklistFields.includes(k))
                    .value(),
                posts: postsResult
            });
        else
            res.status(404).json("could not find any user");
    } catch(err) {
        res.status(500).json({error: err.message});
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
        res.status(200).send();
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
};

export async function addPost(req: Request, res: Response){
    // Validate the data
    const { error } = validate.addPostValidation(req.body);
    if (error){
        return res.status(400).json({error: error.details[0].message});
    }

    const post = new Post;
    post.createdAt = createDate();
    post.description = req.body.description;
    post.url = req.body.url;
    post.user = req['user'].id;

    try{
        await post.save();
        res.status(200).send();
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
};

function createDate(){
    const today = new Date();
    return (today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate());
}