import { Request, Response } from 'express';
import _ from 'lodash';
import { getManager, In, Not } from 'typeorm';
import Follow from '../entity/follow';
import Post from '../entity/post';
import User from '../entity/user';
import { deeplyFilterUser } from './globalPagesRequests';

const AMOUNT = 20;

export async function globalPostRecommendation(req: Request, res: Response){
    try{
        let result: Post[] = []
        if(req.params.category != 'All'){
            result = await getManager()
            .getRepository(Post)
            .createQueryBuilder("post")
            .leftJoinAndSelect('post.user', 'user')
            .where("user.id NOT IN ("+ getMyFollow(req['user'].id).getQuery()+ ")")
            .andWhere(`user.id != '${req['user'].id}'`)
            .andWhere('user.isPrivate = false')
            .andWhere("post.category like :category", { category:`%${req.params.category}%`})
            .limit(AMOUNT * 2)
            .offset(+req.params.offset)
            .distinct(true)
            .getMany();
        } else{
            result = await getManager()
            .getRepository(Post)
            .createQueryBuilder("post")
            .leftJoinAndSelect('post.user', 'user')
            .where("user.id NOT IN ("+ getMyFollow(req['user'].id).getQuery()+ ")")
            .andWhere(`user.id != '${req['user'].id}'`)
            .andWhere('user.isPrivate = false')
            .limit(AMOUNT * 2)
            .offset(+req.params.offset)
            .distinct(true)
            .getMany();
        }
        const info = deeplyFilterUser(result, req['user'].username.toLocaleLowerCase());
        res.status(201).json(info);

    } catch(err) {
        return res.status(500).json({error: err.message});
    }
}

export async function globalUsersRecommendation(req: Request, res: Response){
    try{
        const result = await getUsersByRole(req['user'].id);
        if(result.length != 0){
            const info = result.map(user=> _.pick(user, ['id', 'displayUsername', 'profileImage', 'role']))
            res.status(201).json(info);
        }
        else{
            const result = await getUsersByMostFollowers();
            res.status(201).json(result);
        }
         
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
}

//------------------------------- Query functions -----------------------------------
async function getUsersByRole(id: string){
    const result = await getManager()
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect(Follow, 'f', 'user.id = f.userId')
    .where("user.id IN (" + getFollowersOfMyFollowers(id).getQuery() + ")"+
        "AND user.id NOT IN ("+ getMyFollow(id).getQuery()+ ")")     
    .orWhere("user.role IN (" + getFollowersByRole(id).getQuery() + ")" + 
        `AND user.id != '${id}'` + "AND user.id NOT IN ("+ getMyFollow(id).getQuery()+ ")")
    .limit(AMOUNT * 2)
    .distinct(true)
    .getMany();

    return result;
}

async function getUsersByMostFollowers(){
    const result = await User.find({ 
        where: { id: In(await countFollowers()) }, 
        take: AMOUNT * 2, 
        select: ['id', 'displayUsername', 'profileImage', 'role']        
    })
    return result;
}

//------------------------------- Sub Query functions -----------------------------------
async function countFollowers(){
    const followers =  await getManager()
    .createQueryBuilder(Follow, 'follow')
    .select("follow.userId") 
    .addSelect('COUNT(*)', 'followers')
    .limit(AMOUNT)
    .distinct(true)
    .groupBy('follow.userId')
    .orderBy('followers','DESC')
    .getRawMany();

    const arr: Array<string> = [];
    followers.map(k=> arr.push(k.userId))
    return arr;
}

function getMyFollow(id: string){
    return getManager()
    .createQueryBuilder(Follow, 'follow')
    .where(`follow.followerId = '${id}'`)
    .select("follow.userId")
    .limit(AMOUNT)
    .distinct(true);
}

function getFollowersByRole(id: string){
    return getManager()
    .createQueryBuilder(Follow, 'follow')
    .leftJoinAndSelect(User, 'user', 'user.id = follow.userId')
    .select('user.role', 'role')
    .where(`follow.followerId = '${id}'`)
    .limit(AMOUNT)
    .distinct(true);
}

function getFollowers(id: string){
    return getManager()
    .createQueryBuilder(Follow, 'follow')
    .where(`follow.followerId = '${id}'`)
    .select("follow.userId")
    .limit(AMOUNT)
    .distinct(true)
}

function getFollowersOfMyFollowers(id: string){
    return getManager()
    .createQueryBuilder(Follow, 'follow') 
    .where("follow.followerId IN (" + getFollowers(id).getQuery() + ")")
    .andWhere(`follow.userId != '${id}'`)
    .select("follow.userId")
    .limit(AMOUNT)
    .distinct(true)
}